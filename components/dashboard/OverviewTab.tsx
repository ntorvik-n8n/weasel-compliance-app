"use client";

import React from 'react';
import { AnalysisResult } from '@/types/analysis';
import { FileMetadata } from '@/types/fileManagement';
import { QuickInsights } from './QuickInsights';
import { RiskTimeline } from './RiskTimeline';
import { ComparisonCard } from './ComparisonCard';

interface OverviewTabProps {
  analysis: AnalysisResult;
  metadata: FileMetadata;
}

export function OverviewTab({ analysis, metadata }: OverviewTabProps) {
  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Quick Insights */}
      <QuickInsights analysis={analysis} metadata={metadata} />

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Risk Score */}
        <div className="metric-card text-center">
          <div className="text-xs text-text-muted uppercase tracking-wide mb-2">Risk Score</div>
          <div className={`text-4xl font-bold ${
            analysis.riskScore >= 7 ? 'text-risk-critical' :
            analysis.riskScore >= 5 ? 'text-risk-high' :
            analysis.riskScore >= 3 ? 'text-risk-medium' :
            'text-risk-low'
          }`}>
            {analysis.riskScore.toFixed(1)}
          </div>
          <div className="text-xs text-text-muted mt-1">/10</div>
          <div className={`mt-2 text-xs font-semibold ${
            analysis.riskScore >= 7 ? 'text-risk-critical' :
            analysis.riskScore >= 5 ? 'text-risk-high' :
            analysis.riskScore >= 3 ? 'text-risk-medium' :
            'text-risk-low'
          }`}>
            {analysis.riskScore >= 7 ? '🔴 Critical' :
             analysis.riskScore >= 5 ? '🟠 High' :
             analysis.riskScore >= 3 ? '🟡 Medium' :
             '🟢 Low'}
          </div>
        </div>

        {/* FDCPA Score */}
        <div className="metric-card text-center">
          <div className="text-xs text-text-muted uppercase tracking-wide mb-2">FDCPA Score</div>
          <div className={`text-4xl font-bold ${
            analysis.fdcpaScore >= 7 ? 'text-risk-critical' :
            analysis.fdcpaScore >= 4 ? 'text-risk-medium' :
            'text-risk-low'
          }`}>
            {analysis.fdcpaScore.toFixed(1)}
          </div>
          <div className="text-xs text-text-muted mt-1">/10</div>
          <div className={`mt-2 text-xs font-semibold ${
            analysis.fdcpaScore >= 7 ? 'text-risk-critical' :
            analysis.fdcpaScore >= 4 ? 'text-risk-medium' :
            'text-risk-low'
          }`}>
            {analysis.fdcpaScore >= 7 ? '🔴 High' :
             analysis.fdcpaScore >= 4 ? '🟡 Moderate' :
             '🟢 Low'}
          </div>
        </div>

        {/* Duration */}
        <div className="metric-card text-center">
          <div className="text-xs text-text-muted uppercase tracking-wide mb-2">Duration</div>
          <div className="text-4xl font-bold text-white">
            {metadata.callDuration ? formatDuration(metadata.callDuration).split(':')[0] : '0'}
          </div>
          <div className="text-xs text-text-muted mt-1">
            {metadata.callDuration ? `${formatDuration(metadata.callDuration).split(':')[1]} sec` : 'min'}
          </div>
          <div className="mt-2 text-xs font-semibold text-text-secondary">
            📞 Call Length
          </div>
        </div>

        {/* Violations */}
        <div className="metric-card text-center">
          <div className="text-xs text-text-muted uppercase tracking-wide mb-2">Violations</div>
          <div className={`text-4xl font-bold ${
            analysis.violations.length >= 3 ? 'text-risk-critical' :
            analysis.violations.length >= 1 ? 'text-risk-medium' :
            'text-risk-none'
          }`}>
            {analysis.violations.length}
          </div>
          <div className="text-xs text-text-muted mt-1">found</div>
          <div className={`mt-2 text-xs font-semibold ${
            analysis.violations.length >= 3 ? 'text-risk-critical' :
            analysis.violations.length >= 1 ? 'text-risk-medium' :
            'text-risk-none'
          }`}>
            {analysis.violations.length >= 3 ? '⚠️ Multiple' :
             analysis.violations.length >= 1 ? '⚡ Some' :
             '✅ None'}
          </div>
        </div>
      </div>

      {/* Risk Timeline */}
      <RiskTimeline analysis={analysis} metadata={metadata} />

      {/* Two Column Layout for Comparison and Agent Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Comparison Card */}
        <ComparisonCard analysis={analysis} metadata={metadata} />

        {/* Agent Info Card */}
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">👤</div>
            <h3 className="text-lg font-semibold text-white">Agent Information</h3>
          </div>

          <div className="space-y-4">
            {metadata.agentName && (
              <div>
                <div className="text-xs text-text-muted mb-1">Agent Name</div>
                <div className="text-sm font-medium text-white">{metadata.agentName}</div>
              </div>
            )}

            {metadata.agentId && (
              <div>
                <div className="text-xs text-text-muted mb-1">Agent ID</div>
                <div className="text-sm font-medium text-white">{metadata.agentId}</div>
              </div>
            )}

            {metadata.callTimestamp && (
              <div>
                <div className="text-xs text-text-muted mb-1">Call Time</div>
                <div className="text-sm font-medium text-white">
                  {new Date(metadata.callTimestamp).toLocaleString()}
                </div>
              </div>
            )}

            {metadata.callId && (
              <div>
                <div className="text-xs text-text-muted mb-1">Call ID</div>
                <div className="text-sm font-mono text-white">{metadata.callId}</div>
              </div>
            )}
          </div>

          {(!metadata.agentName && !metadata.agentId) && (
            <div className="py-8 text-center">
              <p className="text-sm text-text-muted">Agent information not available</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">📋 Summary</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {/* Recommendations */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">💡 Recommendations</h3>
          {analysis.recommendations && analysis.recommendations.length > 0 ? (
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-badge-pressure mt-0.5">▸</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">No specific recommendations at this time.</p>
          )}
        </div>
      </div>
    </div>
  );
}
