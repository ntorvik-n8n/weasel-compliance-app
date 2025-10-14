"use client";

import React from 'react';
import { AnalysisResult } from '@/types/analysis';
import { FileMetadata } from '@/types/fileManagement';

interface QuickInsightsProps {
  analysis: AnalysisResult;
  metadata?: FileMetadata;
}

export function QuickInsights({ analysis, metadata }: QuickInsightsProps) {
  // Generate AI-powered insights based on the analysis
  const generateInsights = (): string[] => {
    const insights: string[] = [];

    // Risk-based insights
    if (analysis.riskScore >= 7) {
      insights.push('⚠️ Critical compliance violations detected - immediate supervisor review recommended');
    } else if (analysis.riskScore >= 5) {
      insights.push('⚡ Multiple violations present - agent coaching recommended');
    } else if (analysis.riskScore >= 3) {
      insights.push('📋 Some compliance concerns - monitor for patterns');
    } else {
      insights.push('✅ Strong compliance performance - minimal concerns detected');
    }

    // FDCPA score insights
    if (analysis.fdcpaScore >= 7) {
      insights.push('🚨 Severe FDCPA violations - legal review may be necessary');
    } else if (analysis.fdcpaScore >= 5) {
      insights.push('📚 FDCPA training needed - review debt collection regulations');
    }

    // Violation-specific insights
    const violationTypes = analysis.violations.map(v => v.type);
    if (violationTypes.includes('abusive_language')) {
      insights.push('🗣️ De-escalation training recommended - focus on empathetic communication');
    }
    if (violationTypes.includes('excessive_pressure')) {
      insights.push('⏰ Avoid urgency tactics - offer flexible payment solutions instead');
    }
    if (violationTypes.includes('threatening')) {
      insights.push('⚖️ Review permissible actions under FDCPA - threats are prohibited');
    }
    if (violationTypes.includes('fdcpa_violation')) {
      insights.push('📖 Ensure accurate information - verify all claims before making statements');
    }

    // Duration insights
    if (metadata?.callDuration) {
      const minutes = Math.floor(metadata.callDuration / 60);
      if (minutes > 10) {
        insights.push(`📞 Call duration (${minutes} min) exceeds typical range - may indicate inefficient handling`);
      } else if (minutes < 2) {
        insights.push('⚡ Short call duration - ensure adequate information was provided');
      }
    }

    // Success indicators
    if (analysis.riskScore < 3 && analysis.violations.length === 0) {
      insights.push('🌟 Excellent call handling - consider as training example');
    }

    // Limit to top 4 insights
    return insights.slice(0, 4);
  };

  const insights = generateInsights();

  return (
    <div className="metric-card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-2xl">💡</div>
        <h3 className="text-lg font-semibold text-white">Quick Insights</h3>
        <div className="ml-auto text-xs text-text-muted bg-dark-elevated px-2 py-1 rounded">
          AI Generated
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-dark-elevated rounded-lg border border-dark-border hover:border-badge-pressure/30 transition-colors"
          >
            <div className="flex-shrink-0 w-1 h-full bg-badge-pressure rounded-full" />
            <p className="text-sm text-text-secondary leading-relaxed">
              {insight}
            </p>
          </div>
        ))}
      </div>

      {insights.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          <p className="text-sm">No specific insights available for this call.</p>
        </div>
      )}
    </div>
  );
}
