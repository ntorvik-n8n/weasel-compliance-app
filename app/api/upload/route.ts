import { NextRequest, NextResponse } from 'next/server';
import { getBlobStorageService } from '@/lib/azure/blobStorageClient';
import { parseCallLogMetadata } from '@/lib/callLogParsing';
import { validateFile } from '@/lib/file-validation';
import type { CallLog } from '@/types/callLog';
import type { FileMetadata as AppFileMetadata } from '@/types/fileManagement';
import type { FileMetadata as StorageFileMetadata } from '@/lib/azure/blobStorageClient';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    const validation = validateFile(file); // Changed to sync validation
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const callLogData: CallLog = JSON.parse(buffer.toString());

    const blobService = getBlobStorageService();
    const uploadedAt = new Date(); // Timestamp for metadata

    // Check if file exists (flat structure - no date path)
    const exists = await blobService.fileExists(file.name);
    if (exists) {
      return NextResponse.json(
        { collision: true, filename: file.name },
        { status: 409 }
      );
    }

    const callLogMetadata = parseCallLogMetadata(callLogData);

    // Create a valid StorageFileMetadata object
    // Note: Azure Blob Storage requires all metadata values to be strings
    const metadata: StorageFileMetadata = {
      originalFilename: file.name,
      size: file.size,
      contentType: file.type,
      uploadedAt: uploadedAt.toISOString(),
      status: 'uploaded',
      callId: callLogMetadata.callId,
      agentName: callLogMetadata.agentName,
      agentId: callLogMetadata.agentId,
      // Convert callDuration from number to string for Azure metadata
      callDuration: callLogMetadata.callDuration !== undefined
        ? String(callLogMetadata.callDuration)
        : undefined,
      callTimestamp: callLogMetadata.callTimestamp,
    };

    await blobService.uploadFile(
      buffer,
      file.name,
      metadata
      // The uploadFile method in the provided context uses a date-based path by default
    );

    // Note: Processing will be triggered by the frontend after successful upload
    // This decouples upload from processing to avoid timeout issues in Azure SWA
    // where long-running AI analysis can cause the upload request to timeout

    const responseData: Partial<AppFileMetadata> = {
      name: file.name,
      size: file.size,
      uploadedAt: uploadedAt,
      status: 'uploaded',
      callId: callLogMetadata.callId,
      agentName: callLogMetadata.agentName,
      agentId: callLogMetadata.agentId,
      callDuration: callLogMetadata.callDuration,
      callTimestamp: callLogMetadata.callTimestamp,
    };

    return NextResponse.json({ success: true, file: responseData });

  } catch (error) {
    console.error('Upload failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during upload.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
