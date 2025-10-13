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
    const uploadedAt = new Date(); // Use a single Date object

    // Use a date-based path for the blob
    const exists = await blobService.fileExists(file.name, uploadedAt);
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

    // Trigger analysis pipeline asynchronously
    const requestUrl = new URL(request.url);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
    const processUrl = new URL(`/api/process/${encodeURIComponent(file.name)}`, baseUrl);

    console.log(`[Upload] File uploaded successfully: ${file.name}`);
    console.log(`[Upload] Triggering analysis at: ${processUrl.toString()}`);
    console.log(`[Upload] uploadedAt: ${uploadedAt.toISOString()}`);

    // Trigger processing (don't await - let it run separately)
    // The process endpoint will now properly await the full analysis
    fetch(processUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uploadedAt: uploadedAt.toISOString(),
        }),
    })
    .then(response => {
      console.log(`[Upload] Process API response status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log(`[Upload] Process API response:`, data);
    })
    .catch(err => {
      // Log but don't fail the upload if processing trigger fails
      console.error(`[Upload] ❌ Failed to trigger analysis for ${file.name}:`, err);
    });

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
