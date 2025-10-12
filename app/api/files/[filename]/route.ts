import { NextRequest, NextResponse } from 'next/server';
import { getBlobStorageService } from '@/lib/azure/blobStorageClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename);
    const uploadedAt = request.nextUrl.searchParams.get('uploadedAt');

    if (!uploadedAt) {
      return NextResponse.json({ error: 'Missing uploadedAt parameter' }, { status: 400 });
    }

    // Use Azure Blob Storage to download the file
    const blobService = getBlobStorageService();
    const uploadDate = new Date(uploadedAt);

    try {
      const fileBuffer = await blobService.downloadFile(filename, uploadDate, 'raw');
      const fileContent = fileBuffer.toString('utf-8');
      const callData = JSON.parse(fileContent);

      // Return the actual call data
      return NextResponse.json(callData);
    } catch (fileError) {
      console.error(`File not found in Azure: ${filename}`, fileError);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

  } catch (error) {
    console.error(`Failed to fetch transcript for ${params.filename}:`, error);
    return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 });
  }
}

/**
 * PATCH /api/files/[filename]
 * Update file metadata
 * Body: Partial<FileMetadata>
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const dateParam = searchParams.get('date');
    const containerType = searchParams.get('containerType') as 'raw' | 'processed' | 'backups' || 'raw';

    // Parse date or use today
    const date = dateParam ? new Date(dateParam) : new Date();

    // Parse request body
    const body = await request.json();

    // Get Blob Storage service
    const blobService = getBlobStorageService();

    // Check if file exists
    const exists = await blobService.fileExists(filename, date, containerType);

    if (!exists) {
      return NextResponse.json(
        { error: 'File not found.' },
        { status: 404 }
      );
    }

    // Update metadata
    await blobService.updateMetadata(filename, date, body, containerType);

    return NextResponse.json({
      success: true,
      message: 'Metadata updated successfully.',
    });

  } catch (error) {
    console.error('Update metadata error:', error);

    return NextResponse.json(
      { error: 'Failed to update metadata.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/files/[filename]
 * Delete file from Azure Blob Storage
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = decodeURIComponent(params.filename);
  const uploadedAt = request.nextUrl.searchParams.get('uploadedAt');

  if (!uploadedAt) {
    return NextResponse.json({ error: 'Missing uploadedAt parameter' }, { status: 400 });
  }

  try {
    const blobService = getBlobStorageService();
    const uploadDate = new Date(uploadedAt);

    console.log(`Deleting file from Azure: ${filename} uploaded at ${uploadedAt}`);

    // Delete from Azure Blob Storage
    await blobService.deleteFile(filename, uploadDate, 'raw');

    return NextResponse.json({
      success: true,
      message: `${filename} deleted successfully.`,
      filename: filename,
      uploadedAt: uploadedAt
    });

  } catch (error) {
    console.error(`Failed to delete ${filename}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to delete file: ${errorMessage}` }, { status: 500 });
  }
}
