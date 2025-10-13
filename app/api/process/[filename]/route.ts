import { NextRequest, NextResponse } from 'next/server';
import { getBlobStorageService } from '@/lib/azure/blobStorageClient';
import { getComplianceAnalysis } from '@/lib/anthropic/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename: rawFilename } = await params;
  const filename = decodeURIComponent(rawFilename);

  try {
    // Get uploadedAt from request body or query params
    let uploadedAt: Date;

    try {
      const body = await request.json();
      uploadedAt = body.uploadedAt ? new Date(body.uploadedAt) : new Date();
    } catch (e) {
      // If no body or invalid JSON, try to get the file's upload date from Azure
      const blobService = getBlobStorageService();
      const metadata = await blobService.getFileMetadata(filename);
      uploadedAt = metadata?.uploadedAt ? new Date(metadata.uploadedAt) : new Date();
    }

    // Fire-and-forget: don't await this, let it run in the background
    processAnalysis(filename, uploadedAt);

    // Immediately return a response to the client
    return NextResponse.json({
      success: true,
      message: `Analysis for ${filename} has been queued.`,
    });
  } catch (error) {
    console.error(`Failed to queue analysis for ${filename}:`, error);
    // This error is for the queuing process itself, not the analysis
    return NextResponse.json(
      { error: 'Failed to queue analysis' },
      { status: 500 }
    );
  }
}

async function processAnalysis(filename: string, uploadedAt: Date) {
  const blobService = getBlobStorageService();

  try {
    // 1. Update status to 'processing'
    await blobService.updateMetadata(filename, uploadedAt, { status: 'processing' });

    // 2. Get file content
    const content = await blobService.downloadFile(filename, uploadedAt);
    if (!content) {
        throw new Error(`File content not found for ${filename}`);
    }
    const callLog = JSON.parse(content.toString());

    // 3. Call AI analysis
    const analysisResult = await getComplianceAnalysis(callLog.transcript);

    // 4. Store the analysis result in the 'processed' container (same date path)
    await blobService.uploadAnalysisResult(filename, analysisResult, uploadedAt);

    // 5. Update the original file's metadata with the final status and result pointer
    await blobService.updateMetadata(filename, uploadedAt, {
        status: 'analyzed',
        riskScore: String(analysisResult.riskScore),
        // Full analysis stored in processed container
    });

  } catch (error) {
    console.error(`Error during analysis of ${filename}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await blobService.updateMetadata(filename, uploadedAt, {
        status: 'error',
        errorMessage,
    });
  }
}
