"use client";

import React from 'react';
import { AnalysisResult } from '@/types/analysis';
import { FileMetadata } from '@/types/fileManagement';

interface RiskTimelineProps {
  analysis: AnalysisResult;
  metadata?: FileMetadata;
}

export function RiskTimeline({ analysis, metadata }: RiskTimelineProps) {
  const duration = metadata?.callDuration || 300; // Default 5 minutes if not available
  
  // Format timestamp in MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get violation color based on type
  const getViolationColor = (type: string): string => {
    switch (type) {
      case 'abusive_language':
        return 'bg-badge-abusive';
      case 'threatening':
        return 'bg-badge-threat';
      case 'excessive_pressure':
        return 'bg-badge-pressure';
      case 'fdcpa_violation':
        return 'bg-risk-critical';
      default:
        return 'bg-risk-medium';
    }
  };

  // Get violation label
  const getViolationLabel = (type: string): string => {
    switch (type) {
      case 'abusive_language':
        return 'Abusive';
      case 'threatening':
        return 'Threat';
      case 'excessive_pressure':
        return 'Pressure';
      case 'fdcpa_violation':
        return 'FDCPA';
      default:
        return 'Violation';
    }
  };

  // Sort violations by timestamp
  const sortedViolations = [...analysis.violations].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="metric-card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-2xl">⏱️</div>
        <h3 className="text-lg font-semibold text-white">Risk Timeline</h3>
        <div className="ml-auto text-xs text-text-muted">
          {formatTime(0)} - {formatTime(duration)}
        </div>
      </div>

      {analysis.violations.length > 0 ? (
        <div className="space-y-4">
          {/* Timeline Bar */}
          <div className="relative h-8 bg-dark-elevated rounded-lg overflow-hidden">
            {/* Base timeline */}
            <div className="absolute inset-0 bg-gradient-to-r from-risk-none/20 via-risk-low/20 to-risk-medium/20" />
            
            {/* Violation markers */}
            {sortedViolations.map((violation, index) => {
              const position = (violation.timestamp / duration) * 100;
              return (
                <div
                  key={index}
                  className="absolute top-0 bottom-0 group cursor-pointer"
                  style={{ left: `${position}%` }}
                >
                  {/* Marker line */}
                  <div className={`w-1 h-full ${getViolationColor(violation.type)} opacity-80 group-hover:opacity-100 transition-opacity`} />
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-dark-bg border border-dark-border rounded-lg shadow-lg p-3 whitespace-nowrap">
                      <div className="text-xs font-semibold text-white mb-1">
                        {getViolationLabel(violation.type)} - {formatTime(violation.timestamp)}
                      </div>
                      <div className="text-xs text-text-muted max-w-xs">
                        {violation.quote.substring(0, 60)}...
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Violation legend */}
          <div className="flex flex-wrap gap-4 pt-2">
            {sortedViolations.map((violation, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getViolationColor(violation.type)}`} />
                <span className="text-xs text-text-secondary">
                  {getViolationLabel(violation.type)} at {formatTime(violation.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-sm text-text-muted">No violations detected during this call</p>
          <div className="mt-4 h-2 bg-risk-none/20 rounded-full" />
        </div>
      )}
    </div>
  );
}
