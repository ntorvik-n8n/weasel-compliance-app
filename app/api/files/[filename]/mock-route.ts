import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename);
    const uploadedAt = request.nextUrl.searchParams.get('uploadedAt');

    if (!uploadedAt) {
      return NextResponse.json({ error: 'Missing uploadedAt parameter' }, { status: 400 });
    }

    // Return mock transcript data
    const mockTranscript = [
      {
        timestamp: 0,
        speaker: "agent",
        text: "Hello, this is John Smith calling from Debt Recovery Services. Is this available?"
      },
      {
        timestamp: 5,
        speaker: "client",
        text: "Yes, this is available. What is this regarding?"
      },
      {
        timestamp: 10,
        speaker: "agent",
        text: "I'm calling about an outstanding debt that needs to be addressed immediately."
      }
    ];

    return NextResponse.json({ transcript: mockTranscript });

  } catch (error) {
    console.error(`Failed to fetch transcript for ${params.filename}:`, error);
    return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 });
  }
}