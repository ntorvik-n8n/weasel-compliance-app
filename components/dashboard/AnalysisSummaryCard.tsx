'use client';

import React from 'react';
import { RiskScoreGauge, RiskScoreBar } from './visualizations/RiskScoreGauge';
import type { AnalysisResult } from '@/types/analysis';
import type { FileMetadata } from '@/types/fileManagement';

interface AnalysisSummaryCardProps {
  analysis: AnalysisResult | null;
  fileMetadata: FileMetadata | null;
}

/**
 * Analysis Summary Card Component
 *
 * Displays high-level metrics and risk scores for the selected call
 * Includes visual gauges for risk and FDCPA compliance scores
 */
export function AnalysisSummaryCard({ analysis, fileMetadata }: AnalysisSummaryCardProps) {
  if (!analysis) {
    return (
      <div className="metric-card">
        <h2 className="text-xl font-bold mb-4 text-dark-text-primary">Analysis Summary</h2>
        <p className="text-sm text-dark-text-muted">No analysis data available</p>
      </div>
    );
  }

  // Determine overall risk level badge
  const getRiskBadge = () => {
    if (analysis.riskScore >= 7) return { text: 'CRITICAL RISK', class: 'bg-risk-critical' };
    if (analysis.riskScore >= 5) return { text: 'HIGH RISK', class: 'bg-risk-high' };
    if (analysis.riskScore >= 3) return { text: 'MEDIUM RISK', class: 'bg-risk-medium' };
    if (analysis.riskScore >= 1) return { text: 'LOW RISK', class: 'bg-risk-low' };
    return { text: 'COMPLIANT', class: 'bg-compliance-pass' };
  };

  const riskBadge = getRiskBadge();

  return (
    <div className="metric-card overflow-hidden">
      {/* Header with Risk Badge */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-dark-text-primary">
          Call Analysis: {fileMetadata?.name?.split('.')[0] || 'Unknown'}
        </h2>
        <span className={`${riskBadge.class} text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide`}>
          {riskBadge.text}
        </span>
      </div>
        {/* Risk Score Gauges */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-dark-elevated rounded-lg p-4 border border-dark-border">
            <p className="text-xs text-dark-text-muted uppercase tracking-wide mb-2">Risk Score</p>
            <p className={`text-4xl font-bold ${
              analysis.riskScore >= 7 ? 'text-risk-critical' :
              analysis.riskScore >= 5 ? 'text-risk-high' :
              analysis.riskScore >= 3 ? 'text-risk-medium' :
              'text-risk-low'
            }`}>
              {analysis.riskScore.toFixed(1)}<span className="text-2xl text-dark-text-muted">/10</span>
            </p>
          </div>

          <div className="bg-dark-elevated rounded-lg p-4 border border-dark-border">
            <p className="text-xs text-dark-text-muted uppercase tracking-wide mb-2">FDCPA Score</p>
            <p className={`text-4xl font-bold ${
              analysis.fdcpaScore >= 7 ? 'text-compliance-pass' :
              analysis.fdcpaScore >= 4 ? 'text-risk-medium' :
              'text-risk-critical'
            }`}>
              {analysis.fdcpaScore.toFixed(1)}<span className="text-2xl text-dark-text-muted">/10</span>
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Violations Count */}
          <div className="bg-dark-elevated rounded-lg p-4 border border-dark-border">
            <p className="text-xs text-dark-text-muted uppercase tracking-wide mb-1">Violations</p>
            <p className="text-3xl font-bold text-risk-critical">
              {analysis.violations?.length || 0}
            </p>
          </div>

          {/* Call Duration */}
          {fileMetadata?.callDuration ? (
            <div className="bg-dark-elevated rounded-lg p-4 border border-dark-border">
              <p className="text-xs text-dark-text-muted uppercase tracking-wide mb-1">Duration</p>
              <p className="text-3xl font-bold text-dark-text-primary">
                {Math.floor(fileMetadata.callDuration / 60)}:{(fileMetadata.callDuration % 60).toString().padStart(2, '0')}
              </p>
            </div>
          ) : (
            <div className="bg-dark-elevated rounded-lg p-4 border border-dark-border">
              <p className="text-xs text-dark-text-muted uppercase tracking-wide mb-1">Status</p>
              <p className="text-3xl font-bold text-compliance-pass">
                ✓
              </p>
            </div>
          )}
        </div>

        {/* Severity Breakdown - Compliance Flags */}
        {analysis.violations && analysis.violations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-dark-text-primary mb-3">Compliance Flags</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.violations.map((violation, index) => {
                const getSeverityClass = (severity: string) => {
                  switch(severity) {
                    case 'critical':
                    case 'high':
                      return 'bg-badge-abusive/20 text-badge-abusive border-badge-abusive/30';
                    case 'medium':
                      return 'bg-risk-medium/20 text-risk-medium border-risk-medium/30';
                    default:
                      return 'bg-badge-pressure/20 text-badge-pressure border-badge-pressure/30';
                  }
                };

                return (
                  <span
                    key={index}
                    className={`badge-pill border ${getSeverityClass(violation.severity)}`}
                  >
                    {violation.regulation || 'FDCPA'}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Call Metadata */}
        <div className="pt-4 border-t border-dark-border space-y-2">
          <h3 className="text-sm font-semibold text-dark-text-primary mb-2">Call Details</h3>

          {fileMetadata?.agentName && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-text-muted">Agent</span>
              <span className="font-medium text-dark-text-primary">{fileMetadata.agentName}</span>
            </div>
          )}

          {fileMetadata?.agentId && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-text-muted">Agent ID</span>
              <span className="font-medium text-dark-text-primary">{fileMetadata.agentId}</span>
            </div>
          )}

          {fileMetadata?.callTimestamp && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-text-muted">Date</span>
              <span className="font-medium text-dark-text-primary">
                {new Date(fileMetadata.callTimestamp).toLocaleDateString()}
              </span>
            </div>
          )}

          {fileMetadata?.uploadedAt && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-text-muted">Analyzed</span>
              <span className="font-medium text-dark-text-primary">
                {new Date(fileMetadata.uploadedAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Summary Text */}
        {analysis.summary && (
          <div className="mt-6 pt-4 border-t border-dark-border">
            <h3 className="text-sm font-semibold text-dark-text-primary mb-2">AI Summary</h3>
            <p className="text-sm text-dark-text-secondary leading-relaxed">{analysis.summary}</p>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div className="mt-6 pt-4 border-t border-dark-border">
            <h3 className="text-sm font-semibold text-dark-text-primary mb-2">Recommendations</h3>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start text-sm text-dark-text-secondary">
                  <span className="text-badge-pressure mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}
