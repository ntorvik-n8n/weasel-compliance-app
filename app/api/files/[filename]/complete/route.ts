import { NextRequest, NextResponse } from 'next/server';
import { getBlobStorageService } from '@/lib/azure/blobStorageClient';

/**
 * Combined endpoint to fetch both transcript and analysis data in a single request
 * This reduces latency by eliminating one round-trip to the server
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    const uploadedAt = request.nextUrl.searchParams.get('uploadedAt');

    if (!uploadedAt) {
      return NextResponse.json(
        { error: 'Missing uploadedAt parameter' },
        { status: 400 }
      );
    }

    const blobService = getBlobStorageService();

    // Fetch transcript and analysis in parallel for better performance
    const [transcriptResult, analysisResult] = await Promise.allSettled([
      blobService.downloadFileContent(filename, { containerType: 'raw' }),
      blobService.downloadFileContent(filename, { containerType: 'processed' })
    ]);

    let transcript = null;
    let analysis = null;

    // Handle transcript result
    if (transcriptResult.status === 'fulfilled' && transcriptResult.value) {
      try {
        const callLog = typeof transcriptResult.value === 'string'
          ? JSON.parse(transcriptResult.value)
          : transcriptResult.value;
        transcript = callLog.transcript || callLog;
      } catch (parseError) {
        console.error('Failed to parse transcript:', parseError);
      }
    }

    // Handle analysis result
    if (analysisResult.status === 'fulfilled' && analysisResult.value) {
      try {
        analysis = typeof analysisResult.value === 'string'
          ? JSON.parse(analysisResult.value)
          : analysisResult.value;
      } catch (parseError) {
        console.error('Failed to parse analysis:', parseError);
      }
    }

    // Return combined data with caching headers
    return NextResponse.json(
      {
        success: true,
        transcript,
        analysis,
        filename
      },
      {
        headers: {
          // Cache for 5 minutes, allow stale content for up to 10 minutes
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Failed to load file data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
}
