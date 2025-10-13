import { NextRequest, NextResponse } from 'next/server';
import { getBlobStorageService } from '@/lib/azure/blobStorageClient';

export async function POST(request: NextRequest) {
  try {
    const { files } = await request.json();

    if (!Array.isArray(files)) {
      return NextResponse.json({ error: 'files must be an array' }, { status: 400 });
    }

    const blobService = getBlobStorageService();
    const statusUpdates = [];

    for (const file of files) {
      const { name, uploadedAt } = file;
      if (!name || !uploadedAt) {
        console.warn('Skipping file with missing name or uploadedAt:', file);
        continue;
      }

      const uploadDate = new Date(uploadedAt);
      const metadata = await blobService.getFileMetadata(name, uploadDate, 'raw');

      if (metadata) {
        statusUpdates.push({
          name: name,
          status: metadata.status,
          riskScore: metadata.riskScore ? parseFloat(metadata.riskScore) : undefined,
        });
      }
    }

    return NextResponse.json({ updates: statusUpdates });
  } catch (error) {
    console.error('Failed to get status updates:', error);
    return NextResponse.json({ error: 'Failed to get status updates' }, { status: 500 });
  }
}
