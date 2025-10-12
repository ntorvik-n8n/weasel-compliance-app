import { NextRequest, NextResponse } from 'next/server';
import { getBlobStorageService } from '@/lib/azure/blobStorageClient';
import type { FileMetadata as FileMetadataType } from '@/types/fileManagement';

export async function GET(request: NextRequest) {
  try {
    // Use Azure Blob Storage
    const blobService = getBlobStorageService();

    // List files from Azure
    const azureFiles = await blobService.listFiles({ containerType: 'raw' });

    // Transform Azure file list to match FileMetadata interface
    const files: FileMetadataType[] = azureFiles.files.map(file => {
      const uploadedAt = new Date(file.uploadedAt);
      return {
        id: file.name,
        name: file.name,
        originalName: file.metadata.originalFilename || file.name,
        size: file.size,
        type: file.metadata.contentType || 'application/json',
        uploadedAt: uploadedAt,
        lastModified: uploadedAt,
        url: file.path,
        status: (file.metadata.status as any) || 'uploaded',
        callId: file.metadata.callId,
        agentName: file.metadata.agentName,
        agentId: file.metadata.agentId,
        callDuration: file.metadata.callDuration ? parseInt(file.metadata.callDuration) : undefined,
        callTimestamp: file.metadata.callTimestamp,
        riskScore: file.metadata.riskScore ? parseFloat(file.metadata.riskScore) : undefined,
      };
    });

    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error('Failed to list files:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while listing files.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
