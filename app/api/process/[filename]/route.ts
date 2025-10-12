import { NextRequest, NextResponse } from 'next/server';
import { getBlobStorageService } from '@/lib/azure/blobStorageClient';
import { getComplianceAnalysis } from '@/lib/anthropic/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = decodeURIComponent(params.filename);

  try {
    const blobService = getBlobStorageService();

    // Fire-and-forget: don't await this, let it run in the background
    processAnalysis(filename);

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

async function processAnalysis(filename: string) {
  const blobService = getBlobStorageService();
  const now = new Date();

  try {
    // 1. Update status to 'processing'
    await blobService.updateMetadata(filename, now, { status: 'processing' });

    // 2. Get file content
    const content = await blobService.downloadFile(filename, now);
    if (!content) {
        throw new Error(`File content not found for ${filename}`);
    }
    const callLog = JSON.parse(content.toString());

    // 3. Call AI analysis
    const analysisResult = await getComplianceAnalysis(callLog.transcript);

    // 4. Store the analysis result in the 'processed' container (same date path)
    await blobService.uploadAnalysisResult(filename, analysisResult, now);

    // 5. Update the original file's metadata with the final status and result pointer
    await blobService.updateMetadata(filename, now, {
        status: 'analyzed',
        riskScore: String(analysisResult.riskScore),
        // Full analysis stored in processed container
    });

  } catch (error) {
    console.error(`Error during analysis of ${filename}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await blobService.updateMetadata(filename, now, {
        status: 'error',
        errorMessage,
    });
  }
}
