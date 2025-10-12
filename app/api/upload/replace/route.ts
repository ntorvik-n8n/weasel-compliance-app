import { NextRequest, NextResponse } from 'next/server';
import { getBlobStorageService } from '@/lib/azure/blobStorageClient';
import type { FileMetadata } from '@/lib/azure/blobStorageClient';

/**
 * POST /api/upload/replace
 * Replace an existing file with a new one after creating a backup
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 2. Validate file type
    if (!file.name.toLowerCase().endsWith('.json')) {
      return NextResponse.json(
        { error: 'Only JSON files are supported. Please select a .json file.' },
        { status: 400 }
      );
    }

    // 3. Validate file size (10MB limit)
    const maxSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10);
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      return NextResponse.json(
        {
          error: `File exceeds ${maxSizeMB}MB limit. Current size: ${sizeMB}MB.`,
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: 'File is empty. Please select a valid call log file.' },
        { status: 400 }
      );
    }

    // 4. Read file content
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Basic JSON validation
    try {
      JSON.parse(buffer.toString());
    } catch (jsonError) {
      return NextResponse.json(
        { error: 'File is not valid JSON.' },
        { status: 400 }
      );
    }

    // 6. Get Blob Storage service
    const blobService = getBlobStorageService();

    // 7. Check if original file exists
    const exists = await blobService.fileExists(file.name);

    if (!exists) {
      return NextResponse.json(
        { error: 'Original file not found. Cannot replace.' },
        { status: 404 }
      );
    }

    // 8. Create backup of the original file
    let backupFilename: string;
    try {
      backupFilename = await blobService.backupFile(file.name);
    } catch (backupError) {
      console.error('Backup failed:', backupError);
      return NextResponse.json(
        { error: 'Failed to create backup. Replace operation aborted for safety.' },
        { status: 500 }
      );
    }

    // 9. Delete the original file
    try {
      await blobService.deleteFile(file.name);
    } catch (deleteError) {
      console.error('Delete failed:', deleteError);
      return NextResponse.json(
        {
          error: 'Failed to delete original file. Backup was created successfully.',
          backupFilename
        },
        { status: 500 }
      );
    }

    // 10. Upload the new file with original filename
    const metadata: FileMetadata = {
      originalFilename: file.name,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      status: 'uploaded',
      contentType: 'application/json',
    };

    try {
      const result = await blobService.uploadFile(buffer, file.name, metadata);

      // 11. Return success response
      return NextResponse.json({
        success: true,
        filename: result.filename,
        url: result.url,
        uploadedAt: result.uploadedAt,
        size: result.size,
        path: result.path,
        backupFilename,
        message: 'File replaced successfully. Original backed up.',
      });
    } catch (uploadError) {
      console.error('Upload failed after backup:', uploadError);
      return NextResponse.json(
        {
          error: 'Failed to upload new file. Original was backed up and deleted.',
          backupFilename
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Replace operation error:', error);

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('AZURE_STORAGE_CONNECTION_STRING')) {
        return NextResponse.json(
          { error: 'Storage service configuration error. Please contact administrator.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Replace operation failed. Please try again.' },
      { status: 500 }
    );
  }
}
