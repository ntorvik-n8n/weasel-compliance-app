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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Analysis Summary</h2>
        <p className="text-sm text-gray-500">No analysis data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Analysis Summary</h2>
        {fileMetadata?.callId && (
          <p className="text-sm text-blue-100 mt-1">Call ID: {fileMetadata.callId}</p>
        )}
      </div>

      <div className="p-6">
        {/* Risk Score Gauges */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <RiskScoreGauge score={analysis.riskScore} label="Risk Score" size="md" inverted={false} />
          <RiskScoreGauge score={analysis.fdcpaScore} label="FDCPA Compliance" size="md" inverted={true} />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Violations Count */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Violations Found</p>
            <p className="text-3xl font-bold text-gray-900">
              {analysis.violations?.length || 0}
            </p>
          </div>

          {/* Violation Severity or Call Duration */}
          {(() => {
            // Show highest violation severity if violations exist
            if (analysis.violations && analysis.violations.length > 0) {
              const severityOrder = ['critical', 'high', 'medium', 'low'];
              const highestSeverity = severityOrder.find(sev =>
                analysis.violations.some(v => v.severity === sev)
              ) || 'low';

              const severityColors = {
                critical: 'text-red-600',
                high: 'text-orange-600',
                medium: 'text-yellow-600',
                low: 'text-blue-600',
              };

              const severityLabels = {
                critical: 'Critical',
                high: 'High',
                medium: 'Medium',
                low: 'Low',
              };

              return (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Violation Severity</p>
                  <p className={`text-3xl font-bold ${severityColors[highestSeverity as keyof typeof severityColors]}`}>
                    {severityLabels[highestSeverity as keyof typeof severityLabels]}
                  </p>
                </div>
              );
            }

            // Fallback to Call Duration if no violations
            if (fileMetadata?.callDuration) {
              return (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Call Duration</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.floor(fileMetadata.callDuration / 60)}:{(fileMetadata.callDuration % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              );
            }

            // Final fallback: show a placeholder
            return (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Severity</p>
                <p className="text-3xl font-bold text-green-600">
                  None
                </p>
              </div>
            );
          })()}
        </div>

        {/* Severity Breakdown */}
        {analysis.violations && analysis.violations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Violation Severity</h3>
            <div className="space-y-2">
              {['critical', 'high', 'medium', 'low'].map(severity => {
                const count = analysis.violations.filter(v => v.severity === severity).length;
                if (count === 0) return null;

                const colors = {
                  critical: { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50' },
                  high: { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50' },
                  medium: { bg: 'bg-yellow-500', text: 'text-yellow-700', light: 'bg-yellow-50' },
                  low: { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50' },
                };

                const color = colors[severity as keyof typeof colors];

                return (
                  <div key={severity} className={`flex items-center justify-between p-2 rounded ${color.light}`}>
                    <span className={`text-sm font-medium ${color.text} capitalize`}>
                      {severity}
                    </span>
                    <span className={`text-sm font-bold ${color.text}`}>
                      {count} violation{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Call Metadata */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Call Details</h3>

          {fileMetadata?.agentName && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Agent</span>
              <span className="font-medium text-gray-900">{fileMetadata.agentName}</span>
            </div>
          )}

          {fileMetadata?.agentId && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Agent ID</span>
              <span className="font-medium text-gray-900">{fileMetadata.agentId}</span>
            </div>
          )}

          {fileMetadata?.callTimestamp && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-900">
                {new Date(fileMetadata.callTimestamp).toLocaleDateString()}
              </span>
            </div>
          )}

          {fileMetadata?.uploadedAt && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Analyzed</span>
              <span className="font-medium text-gray-900">
                {new Date(fileMetadata.uploadedAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Summary Text */}
        {analysis.summary && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">AI Summary</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{analysis.summary}</p>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Recommendations</h3>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
