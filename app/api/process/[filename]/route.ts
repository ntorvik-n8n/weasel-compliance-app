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
    console.log(`[Process] Starting analysis for ${filename} uploaded at ${uploadedAt.toISOString()}`);

    // 1. Update status to 'processing'
    await blobService.updateMetadata(filename, uploadedAt, { status: 'processing' });
    console.log(`[Process] Status updated to 'processing' for ${filename}`);

    // 2. Get file content
    const content = await blobService.downloadFile(filename, uploadedAt);
    if (!content) {
        throw new Error(`File content not found for ${filename}`);
    }
    const callLog = JSON.parse(content.toString());
    console.log(`[Process] File content downloaded and parsed for ${filename}`);

    // 3. Call AI analysis
    console.log(`[Process] Calling Anthropic AI for ${filename}...`);
    console.log(`[Process] ANTHROPIC_API_KEY present: ${!!process.env.ANTHROPIC_API_KEY}`);
    const analysisResult = await getComplianceAnalysis(callLog.transcript);
    console.log(`[Process] AI analysis completed for ${filename} - Risk: ${analysisResult.riskScore}`);

    // 4. Store the analysis result in the 'processed' container (same date path)
    await blobService.uploadAnalysisResult(filename, analysisResult, uploadedAt);
    console.log(`[Process] Analysis result uploaded to processed container for ${filename}`);

    // 5. Update the original file's metadata with the final status and result pointer
    await blobService.updateMetadata(filename, uploadedAt, {
        status: 'analyzed',
        riskScore: String(analysisResult.riskScore),
        // Full analysis stored in processed container
    });
    console.log(`[Process] ✅ Analysis completed successfully for ${filename}`);

  } catch (error) {
    console.error(`[Process] ❌ Error during analysis of ${filename}:`, error);
    console.error(`[Process] Error type: ${error instanceof Error ? error.constructor.name : typeof error}`);
    console.error(`[Process] Error message: ${error instanceof Error ? error.message : String(error)}`);
    console.error(`[Process] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await blobService.updateMetadata(filename, uploadedAt, {
        status: 'error',
        errorMessage,
    });
    console.error(`[Process] Status updated to 'error' for ${filename} with message: ${errorMessage}`);
  }
}
