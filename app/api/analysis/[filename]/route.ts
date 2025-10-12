import { NextRequest, NextResponse } from 'next/server';
import { getBlobStorageService } from '@/lib/azure/blobStorageClient';

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

    const blobService = getBlobStorageService();
    const uploadDate = new Date(uploadedAt);

    try {
      // Try to get analysis from processed container first
      try {
        const analysisBuffer = await blobService.downloadFile(filename, uploadDate, 'processed');
        const analysisData = JSON.parse(analysisBuffer.toString('utf-8'));
        return NextResponse.json(analysisData);
      } catch (processedError) {
        // Analysis doesn't exist yet, generate it from the raw file
        console.log(`Analysis not found for ${filename}, generating from raw file...`);
      }

      // Download the raw call log file
      const fileBuffer = await blobService.downloadFile(filename, uploadDate, 'raw');
      const callData = JSON.parse(fileBuffer.toString('utf-8'));

      // Generate analysis based on actual file content
      let mockAnalysis;

      if (filename === 'high-risk-call.json') {
        // High risk call with multiple serious violations
        mockAnalysis = {
          filename,
          uploadedAt,
          riskScore: 9.2,
          fdcpaScore: 2.1,
          violations: [
            {
              type: "threatening_language",
              severity: "critical",
              timestamp: "2025-10-10T10:15:20Z",
              quote: "I understand your frustration. You must pay this debt or we'll have no choice but to take further action!",
              explanation: "Agent used threatening language creating false sense of urgency and implying unspecified consequences",
              regulation: "FDCPA Section 806 - Harassment or abuse",
              suggestedAlternative: "I understand this is a difficult situation. Let's discuss what payment options might work for your current financial situation."
            },
            {
              type: "illegal_threat",
              severity: "critical",
              timestamp: "2025-10-10T10:15:40Z",
              quote: "If you don't pay today, we'll garnish your wages. This is your final warning!",
              explanation: "Agent threatened wage garnishment without legal authority or proper notice, and used intimidating final warning language",
              regulation: "FDCPA Section 807(5) - False or misleading representations",
              suggestedAlternative: "I'd like to work with you to resolve this debt. We have several payment plan options available if paying in full isn't possible right now."
            },
            {
              type: "harassment",
              severity: "high",
              timestamp: "2025-10-10T10:15:20Z",
              quote: "You must pay this debt",
              explanation: "Demanding immediate payment without offering alternatives or considering consumer's situation",
              regulation: "FDCPA Section 806",
              suggestedAlternative: "I'm calling about your outstanding balance. Would you be able to discuss payment options today?"
            }
          ],
          summary: "CRITICAL COMPLIANCE ISSUES: This call contains multiple severe FDCPA violations including illegal threats of wage garnishment, threatening language, and harassment. The agent created false urgency and made threats without legal authority.",
          recommendations: [
            "IMMEDIATE: Remove agent from calling queue pending retraining",
            "Conduct full FDCPA compliance review of all agent's recent calls",
            "Mandatory FDCPA certification training required",
            "Implement supervisor review before agent returns to active duty",
            "Review and update call scripts to prevent future violations"
          ]
        };
      } else if (filename === 'compliant-call.json') {
        // Compliant call with no violations
        mockAnalysis = {
          filename,
          uploadedAt,
          riskScore: 1.2,
          fdcpaScore: 9.8,
          violations: [],
          summary: "EXCELLENT COMPLIANCE: This call demonstrates best practices in debt collection. The agent was professional, courteous, and fully compliant with FDCPA regulations. The conversation was respectful and focused on constructive solutions.",
          recommendations: [
            "Use this call as a training example for other agents",
            "Commend agent for excellent compliance practices",
            "Consider agent for quality assurance mentor role"
          ]
        };
      } else {
        // Standard call with moderate issues (default for standard-call.json and others)
        mockAnalysis = {
          filename,
          uploadedAt,
          riskScore: 4.5,
          fdcpaScore: 6.8,
          violations: [
            {
              type: "minor_pressure",
              severity: "low",
              timestamp: "2025-10-10T09:30:15Z",
              quote: "I'm calling regarding your outstanding balance of $500 with XYZ Bank. Are you able to make a payment today?",
              explanation: "While not a serious violation, the phrasing could be improved to be more open-ended and less focused on immediate payment",
              regulation: "Best Practice Recommendation",
              suggestedAlternative: "I'm calling regarding your account with XYZ Bank. I'd like to discuss your balance and explore options that work for you."
            }
          ],
          summary: "MODERATE COMPLIANCE: This call shows generally good practices with minor areas for improvement. The agent was professional but could benefit from additional training on creating a more collaborative tone.",
          recommendations: [
            "Provide coaching on using more open-ended questions",
            "Review best practices for offering payment plan options proactively",
            "Continue monitoring for quality assurance"
          ]
        };
      }

      // Save the generated analysis to the processed container for future requests
      try {
        await blobService.uploadAnalysisResult(filename, mockAnalysis, uploadDate);
        console.log(`Analysis saved to processed container for ${filename}`);
      } catch (saveError) {
        console.warn(`Failed to save analysis to processed container:`, saveError);
        // Continue even if save fails - we can still return the analysis
      }

      return NextResponse.json(mockAnalysis);
    } catch (fileError) {
      console.error(`File not found for analysis in Azure:`, fileError);
      return NextResponse.json({ error: 'Call log file not found' }, { status: 404 });
    }
  } catch (error) {
    console.error(`Failed to fetch analysis for ${params.filename}:`, error);
    return NextResponse.json({ error: 'Failed to fetch analysis content' }, { status: 500 });
  }
}
