import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { EvaluateRequest, EvaluationResult } from '@/types/evaluation';

function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set in environment variables.');
  }
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

function constructEvaluationPrompt(request: EvaluateRequest): string {
  const { originalResponse, alternativeResponse, violationContext } = request;

  return `Evaluate this alternative collection agent response for quality and compliance.

Context:
- Original Response: "${originalResponse}"
- Violation Type: ${violationContext.type}
- FDCPA Issue: ${violationContext.explanation}
- Regulation: ${violationContext.regulation}

Alternative Response:
"${alternativeResponse}"

Evaluate the alternative response on these dimensions (0-10 scale):

1. FDCPA Compliance
   - Does it avoid all regulatory violations?
   - Is it free of harassment, threats, or false representations?

2. Professionalism
   - Is the tone respectful and appropriate?
   - Does it maintain professional standards?

3. Effectiveness
   - Does it advance the collection goal appropriately?
   - Does it maintain communication without being aggressive?

4. Tone & Empathy
   - Does it show understanding of the consumer's situation?
   - Is the language constructive rather than confrontational?

Return evaluation in this JSON structure, and nothing else:
{
  "scores": {
    "fdcpaCompliance": number (0-10),
    "professionalism": number (0-10),
    "effectiveness": number (0-10),
    "toneEmpathy": number (0-10),
    "overall": number (0-10)
  },
  "improvements": [
    "List specific improvements over original"
  ],
  "concerns": [
    "List any remaining issues or areas for improvement"
  ],
  "rationale": "Detailed explanation of the evaluation",
  "recommendation": "approve" | "approve_with_notes" | "needs_revision"
}`;
}

export async function POST(request: NextRequest) {
  console.log('[Evaluate API] Received evaluation request');

  try {
    // 1. Parse and validate request body
    const body = await request.json() as EvaluateRequest;

    if (!body.originalResponse || !body.alternativeResponse || !body.violationContext) {
      return NextResponse.json(
        { error: 'Missing required fields: originalResponse, alternativeResponse, or violationContext' },
        { status: 400 }
      );
    }

    if (!body.alternativeResponse.trim()) {
      return NextResponse.json(
        { error: 'Alternative response cannot be empty' },
        { status: 400 }
      );
    }

    console.log('[Evaluate API] Request validated');
    console.log('[Evaluate API] Original length:', body.originalResponse.length);
    console.log('[Evaluate API] Alternative length:', body.alternativeResponse.length);

    // 2. Get Anthropic client
    const client = getAnthropicClient();
    console.log('[Evaluate API] Anthropic client initialized');

    // 3. Construct evaluation prompt
    const prompt = constructEvaluationPrompt(body);
    console.log('[Evaluate API] Prompt constructed, length:', prompt.length);

    // 4. Call Anthropic API
    console.log('[Evaluate API] Sending request to Claude API...');
    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307', // Fast model for evaluation
      max_tokens: 2000,
      temperature: 0.3, // Lower temperature for consistent scoring
      messages: [{ role: 'user', content: prompt }],
    });

    console.log('[Evaluate API] Response received from Claude');
    console.log('[Evaluate API] Usage:', JSON.stringify(response.usage));

    // 5. Parse and validate AI response
    const firstContent = response.content[0];
    if (firstContent.type !== 'text') {
      throw new Error('Unexpected response type from AI');
    }
    const jsonResponse = firstContent.text;
    console.log('[Evaluate API] Response length:', jsonResponse.length, 'chars');

    const parsed = JSON.parse(jsonResponse);

    // Basic validation
    if (
      !parsed.scores ||
      typeof parsed.scores.fdcpaCompliance !== 'number' ||
      typeof parsed.scores.professionalism !== 'number' ||
      typeof parsed.scores.effectiveness !== 'number' ||
      typeof parsed.scores.toneEmpathy !== 'number' ||
      typeof parsed.scores.overall !== 'number' ||
      !Array.isArray(parsed.improvements) ||
      !Array.isArray(parsed.concerns) ||
      typeof parsed.rationale !== 'string' ||
      !['approve', 'approve_with_notes', 'needs_revision'].includes(parsed.recommendation)
    ) {
      console.error('[Evaluate API] Invalid response structure:', parsed);
      throw new Error('Invalid JSON structure from AI response');
    }

    console.log('[Evaluate API] ✅ Evaluation successful - Overall score:', parsed.scores.overall);
    console.log('[Evaluate API] Recommendation:', parsed.recommendation);

    // 6. Return evaluation result
    return NextResponse.json({
      success: true,
      data: parsed as EvaluationResult,
    });

  } catch (error) {
    console.error('[Evaluate API] ❌ Error during evaluation:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    if (error instanceof Error) {
      console.error('[Evaluate API] Error name:', error.name);
      console.error('[Evaluate API] Error message:', error.message);

      return NextResponse.json(
        { error: 'Evaluation failed. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
