import { NextRequest, NextResponse } from 'next/server';
import { getBlobStorageService } from '@/lib/azure/blobStorageClient';

export async function POST(request: NextRequest) {
  try {
    const { fileNames } = await request.json();

    if (!Array.isArray(fileNames)) {
      return NextResponse.json({ error: 'fileNames must be an array' }, { status: 400 });
    }

    const blobService = getBlobStorageService();
    const statusUpdates = [];

    for (const filename of fileNames) {
      const metadata = await blobService.getFileMetadata(filename);
      if (metadata) {
        statusUpdates.push({
          name: filename,
          status: metadata.status,
          // Add other details if needed, e.g., progress
        });
      }
    }

    return NextResponse.json({ updates: statusUpdates });
  } catch (error) {
    console.error('Failed to get status updates:', error);
    return NextResponse.json({ error: 'Failed to get status updates' }, { status: 500 });
  }
}
