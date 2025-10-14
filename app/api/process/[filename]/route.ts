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
    // IMPORTANT: Must await in Azure SWA - fire-and-forget doesn't work
    // The function execution context terminates when response is sent,
    // killing any unfinished async operations
    await processAnalysis(filename);

    // Return success after analysis completes
    return NextResponse.json({
      success: true,
      message: `Analysis for ${filename} completed successfully.`,
    });
  } catch (error) {
    console.error(`Failed to process analysis for ${filename}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to process analysis: ${errorMessage}` },
      { status: 500 }
    );
  }
}

async function processAnalysis(filename: string) {
  const blobService = getBlobStorageService();

  try {
    console.log(`[Process] Starting analysis for ${filename}`);

    // 1. Update status to 'processing'
    await blobService.updateMetadata(filename, { status: 'processing' });
    console.log(`[Process] Status updated to 'processing' for ${filename}`);

    // 2. Get file content
    const content = await blobService.downloadFile(filename);
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

    // 4. Store the analysis result in the 'processed' container (flat structure)
    await blobService.uploadAnalysisResult(filename, analysisResult);
    console.log(`[Process] Analysis result uploaded to processed container for ${filename}`);

    // 5. Update the original file's metadata with the final status and result pointer
    await blobService.updateMetadata(filename, {
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
    await blobService.updateMetadata(filename, {
        status: 'error',
        errorMessage,
    });
    console.error(`[Process] Status updated to 'error' for ${filename} with message: ${errorMessage}`);
  }
}
