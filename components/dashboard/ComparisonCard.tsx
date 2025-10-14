"use client";

import React from 'react';
import { AnalysisResult } from '@/types/analysis';
import { FileMetadata } from '@/types/fileManagement';

interface ComparisonCardProps {
  analysis: AnalysisResult;
  metadata?: FileMetadata;
}

// Mock team averages - in production, these would come from an API
const TEAM_AVERAGES = {
  riskScore: 4.2,
  fdcpaScore: 3.5,
  duration: 272, // 4:32 in seconds
  violationRate: 0.35, // 35% of calls have violations
};

export function ComparisonCard({ analysis, metadata }: ComparisonCardProps) {
  const duration = metadata?.callDuration || 0;
  const violationCount = analysis.violations.length;

  // Calculate percentage difference
  const calculateDiff = (value: number, average: number): number => {
    if (average === 0) return 0;
    return ((value - average) / average) * 100;
  };

  // Format percentage with sign
  const formatDiff = (diff: number): string => {
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff.toFixed(0)}%`;
  };

  // Get indicator color based on metric type and difference
  const getIndicatorColor = (diff: number, metricType: 'risk' | 'duration' | 'violations'): string => {
    // For risk metrics, positive is bad
    if (metricType === 'risk' || metricType === 'violations' || metricType === 'duration') {
      if (diff > 50) return 'text-risk-critical';
      if (diff > 20) return 'text-risk-high';
      if (diff > 0) return 'text-risk-medium';
      if (diff < -20) return 'text-risk-none';
      return 'text-text-secondary';
    }
    return 'text-text-secondary';
  };

  const getIndicatorIcon = (diff: number, metricType: 'risk' | 'duration' | 'violations'): string => {
    // For risk metrics, positive is bad
    if (metricType === 'risk' || metricType === 'violations' || metricType === 'duration') {
      if (diff > 20) return '⚠️';
      if (diff > 0) return '↗️';
      if (diff < -20) return '✅';
      return '→';
    }
    return '→';
  };

  const riskDiff = calculateDiff(analysis.riskScore, TEAM_AVERAGES.riskScore);
  const fdcpaDiff = calculateDiff(analysis.fdcpaScore, TEAM_AVERAGES.fdcpaScore);
  const durationDiff = duration ? calculateDiff(duration, TEAM_AVERAGES.duration) : 0;

  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-2xl">🏆</div>
        <h3 className="text-lg font-semibold text-white">Comparison to Team</h3>
      </div>

      <div className="space-y-4">
        {/* Risk Score Comparison */}
        <div className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg">
          <div>
            <div className="text-xs text-text-muted mb-1">Risk Score</div>
            <div className="text-sm font-medium text-white">
              {analysis.riskScore.toFixed(1)} vs {TEAM_AVERAGES.riskScore.toFixed(1)} avg
            </div>
          </div>
          <div className={`text-right ${getIndicatorColor(riskDiff, 'risk')}`}>
            <div className="text-lg">{getIndicatorIcon(riskDiff, 'risk')}</div>
            <div className="text-xs font-semibold">{formatDiff(riskDiff)}</div>
          </div>
        </div>

        {/* FDCPA Score Comparison */}
        <div className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg">
          <div>
            <div className="text-xs text-text-muted mb-1">FDCPA Score</div>
            <div className="text-sm font-medium text-white">
              {analysis.fdcpaScore.toFixed(1)} vs {TEAM_AVERAGES.fdcpaScore.toFixed(1)} avg
            </div>
          </div>
          <div className={`text-right ${getIndicatorColor(fdcpaDiff, 'risk')}`}>
            <div className="text-lg">{getIndicatorIcon(fdcpaDiff, 'risk')}</div>
            <div className="text-xs font-semibold">{formatDiff(fdcpaDiff)}</div>
          </div>
        </div>

        {/* Duration Comparison */}
        {duration > 0 && (
          <div className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg">
            <div>
              <div className="text-xs text-text-muted mb-1">Call Duration</div>
              <div className="text-sm font-medium text-white">
                {formatDuration(duration)} vs {formatDuration(TEAM_AVERAGES.duration)} avg
              </div>
            </div>
            <div className={`text-right ${getIndicatorColor(durationDiff, 'duration')}`}>
              <div className="text-lg">{getIndicatorIcon(durationDiff, 'duration')}</div>
              <div className="text-xs font-semibold">{formatDiff(durationDiff)}</div>
            </div>
          </div>
        )}

        {/* Violations Count */}
        <div className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg">
          <div>
            <div className="text-xs text-text-muted mb-1">Violations</div>
            <div className="text-sm font-medium text-white">
              {violationCount} {violationCount === 1 ? 'violation' : 'violations'}
            </div>
          </div>
          <div className="text-right">
            {violationCount === 0 ? (
              <div className="text-lg text-risk-none">✅</div>
            ) : violationCount >= 3 ? (
              <div className="text-lg text-risk-critical">⚠️</div>
            ) : (
              <div className="text-lg text-risk-medium">⚡</div>
            )}
          </div>
        </div>
      </div>

      {/* Overall Assessment */}
      <div className="mt-4 p-3 bg-dark-bg rounded-lg border border-dark-border">
        <div className="text-xs font-semibold text-white mb-1">Overall Assessment</div>
        <div className="text-xs text-text-secondary">
          {riskDiff > 50 ? (
            <>This call performs significantly worse than team average. Immediate action recommended.</>
          ) : riskDiff > 20 ? (
            <>This call performs below team average. Consider coaching opportunities.</>
          ) : riskDiff > -10 ? (
            <>This call performs near team average. Continue current practices.</>
          ) : (
            <>This call performs better than team average. Excellent work!</>
          )}
        </div>
      </div>
    </div>
  );
}
