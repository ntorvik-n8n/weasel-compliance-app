import Anthropic from '@anthropic-ai/sdk';
import type { CallLog } from '@/types/callLog';
import type { AnalysisResult } from '@/types/analysis';

let anthropic: Anthropic;

function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables.');
    }
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

function constructAnalysisPrompt(transcript: CallLog['transcript']): string {
    const transcriptText = transcript.map(turn => `${turn.speaker}: ${turn.text}`).join('\n');

    return `Analyze this debt collection call for FDCPA compliance.

Call Transcript:
${transcriptText}

Evaluate the conversation for:

1. FDCPA Violations
   - Section 806 (Harassment or Abuse)
   - Section 807 (False or Misleading Representations)
   - Section 808 (Unfair Practices)

2. Risk Assessment
   - Overall risk score (0-10, where 10 is highest risk)
   - FDCPA compliance score (0-10, where 10 is fully compliant)

3. Language Analysis
   - Abusive or threatening language
   - Excessive pressure tactics
   - Unprofessional communication

Return analysis in the following JSON structure, and nothing else:
{
  "riskScore": number,
  "fdcpaScore": number,
  "violations": [
    {
      "type": "abusive_language" | "threatening" | "excessive_pressure" | "fdcpa_violation",
      "severity": "low" | "medium" | "high" | "critical",
      "timestamp": number (seconds from start),
      "speaker": "agent" | "client",
      "quote": "exact quote from transcript",
      "explanation": "why this is problematic",
      "regulation": "FDCPA Section reference",
      "suggestedAlternative": "better way to phrase this"
    }
  ],
  "summary": "brief overall assessment",
  "recommendations": ["list of general recommendations"]
}`;
}

/**
 * Attempts to repair common JSON formatting issues from AI responses
 */
function repairJSON(jsonString: string): string {
  let repaired = jsonString.trim();

  // Remove markdown code blocks if present
  repaired = repaired.replace(/```json\s*/g, '').replace(/```\s*/g, '');

  // Remove any text before the first { or after the last }
  const firstBrace = repaired.indexOf('{');
  const lastBrace = repaired.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    repaired = repaired.substring(firstBrace, lastBrace + 1);
  }

  // Fix common issues: trailing commas before closing braces/brackets
  repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

  // Fix missing commas between array items or object properties
  repaired = repaired.replace(/"\s*\n\s*"/g, '",\n"');
  repaired = repaired.replace(/}\s*\n\s*{/g, '},\n{');

  return repaired;
}

/**
 * Validates that the parsed JSON has the expected structure
 */
function validateAnalysisStructure(parsed: any): parsed is AnalysisResult {
  return (
    typeof parsed === 'object' &&
    parsed !== null &&
    typeof parsed.riskScore === 'number' &&
    typeof parsed.fdcpaScore === 'number' &&
    Array.isArray(parsed.violations) &&
    typeof parsed.summary === 'string' &&
    Array.isArray(parsed.recommendations)
  );
}

/**
 * Attempts to parse JSON with repair strategies
 */
function parseWithRepair(jsonString: string): AnalysisResult {
  // First attempt: direct parse
  try {
    const parsed = JSON.parse(jsonString);
    if (validateAnalysisStructure(parsed)) {
      console.log('[Anthropic] ✓ JSON parsed successfully on first attempt');
      return parsed;
    }
    throw new Error('Invalid JSON structure');
  } catch (firstError) {
    console.log('[Anthropic] ⚠ Initial JSON parse failed, attempting repair...');

    // Second attempt: with repair
    try {
      const repaired = repairJSON(jsonString);
      const parsed = JSON.parse(repaired);
      if (validateAnalysisStructure(parsed)) {
        console.log('[Anthropic] ✓ JSON parsed successfully after repair');
        return parsed;
      }
      throw new Error('Invalid JSON structure after repair');
    } catch (repairError) {
      console.error('[Anthropic] ❌ JSON parse failed even after repair');
      console.error('[Anthropic] Original error:', firstError);
      console.error('[Anthropic] Repair error:', repairError);
      console.error('[Anthropic] First 500 chars of response:', jsonString.substring(0, 500));
      throw firstError; // Throw the original error for clarity
    }
  }
}

/**
 * Sleep utility for retry backoff
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getComplianceAnalysis(
  transcript: CallLog['transcript'],
  maxRetries: number = 3
): Promise<AnalysisResult> {
  console.log('[Anthropic] Starting compliance analysis...');
  console.log('[Anthropic] API Key present:', !!process.env.ANTHROPIC_API_KEY);
  console.log('[Anthropic] Transcript length:', transcript.length, 'turns');
  console.log('[Anthropic] Max retries:', maxRetries);

  const client = getAnthropicClient();
  const prompt = constructAnalysisPrompt(transcript);

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Anthropic] Attempt ${attempt}/${maxRetries} - Sending request to Claude API...`);

      const response = await client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      });

      console.log('[Anthropic] Response received, model:', response.model);
      console.log('[Anthropic] Usage:', JSON.stringify(response.usage));

      const firstContent = response.content[0];
      if (firstContent.type !== 'text') {
        throw new Error('Unexpected response type from AI');
      }

      const jsonResponse = firstContent.text;
      console.log('[Anthropic] Response length:', jsonResponse.length, 'chars');

      // Parse with repair strategies
      const parsed = parseWithRepair(jsonResponse);

      console.log('[Anthropic] ✅ Analysis successful - Risk:', parsed.riskScore, 'FDCPA:', parsed.fdcpaScore);
      return parsed;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      console.error(`[Anthropic] ❌ Attempt ${attempt}/${maxRetries} failed:`, lastError.message);

      if (attempt < maxRetries) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff: 1s, 2s, 4s (max 5s)
        console.log(`[Anthropic] ⏳ Retrying in ${backoffMs}ms...`);
        await sleep(backoffMs);
      }
    }
  }

  // All retries failed
  console.error('[Anthropic] ❌ All retry attempts exhausted');
  console.error('[Anthropic] Final error:', lastError);
  throw new Error(`Failed to get compliance analysis after ${maxRetries} attempts: ${lastError?.message}`);
}
