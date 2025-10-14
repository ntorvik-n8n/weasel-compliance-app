"use client";

import React, { useState } from 'react';
import { AnalysisResult, Violation } from '@/types/analysis';

interface ViolationsTabProps {
  analysis: AnalysisResult;
}

export function ViolationsTab({ analysis }: ViolationsTabProps) {
  const [expandedViolation, setExpandedViolation] = useState<number | null>(null);
  const [severityCycleIndex, setSeverityCycleIndex] = useState<Record<string, number>>({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  // Get violations grouped by severity
  const violationsBySeverity = {
    critical: analysis.violations.map((v, idx) => ({ ...v, originalIndex: idx })).filter(v => v.severity === 'critical'),
    high: analysis.violations.map((v, idx) => ({ ...v, originalIndex: idx })).filter(v => v.severity === 'high'),
    medium: analysis.violations.map((v, idx) => ({ ...v, originalIndex: idx })).filter(v => v.severity === 'medium'),
    low: analysis.violations.map((v, idx) => ({ ...v, originalIndex: idx })).filter(v => v.severity === 'low'),
  };

  // Handle clicking on severity badge to cycle through violations
  const handleSeverityClick = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    const violations = violationsBySeverity[severity];
    if (violations.length === 0) return;

    const currentIndex = severityCycleIndex[severity];
    const violation = violations[currentIndex];

    // If this violation is already expanded, move to next one
    if (expandedViolation === violation.originalIndex) {
      const nextIndex = (currentIndex + 1) % violations.length;
      setSeverityCycleIndex(prev => ({ ...prev, [severity]: nextIndex }));
      
      // If we cycled back to the beginning, close it, otherwise open next
      if (nextIndex === 0 && currentIndex === violations.length - 1) {
        setExpandedViolation(null);
      } else {
        setExpandedViolation(violations[nextIndex].originalIndex);
      }
    } else {
      // Open the current violation
      setExpandedViolation(violation.originalIndex);
    }

    // Scroll to the violation
    setTimeout(() => {
      const element = document.getElementById(`violation-${violation.originalIndex}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Get violation display info
  const getViolationInfo = (type: string) => {
    switch (type) {
      case 'abusive_language':
        return {
          label: 'Abusive Language',
          icon: '🔴',
          color: 'bg-badge-abusive',
          borderColor: 'border-badge-abusive',
        };
      case 'threatening':
        return {
          label: 'Threats',
          icon: '⚠️',
          color: 'bg-badge-threat',
          borderColor: 'border-badge-threat',
        };
      case 'excessive_pressure':
        return {
          label: 'Excessive Pressure',
          icon: '⚡',
          color: 'bg-badge-pressure',
          borderColor: 'border-badge-pressure',
        };
      case 'fdcpa_violation':
        return {
          label: 'FDCPA Violation',
          icon: '📖',
          color: 'bg-risk-critical',
          borderColor: 'border-risk-critical',
        };
      default:
        return {
          label: 'Violation',
          icon: '⚠️',
          color: 'bg-risk-medium',
          borderColor: 'border-risk-medium',
        };
    }
  };

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-risk-critical text-white';
      case 'high':
        return 'bg-risk-high text-white';
      case 'medium':
        return 'bg-risk-medium text-white';
      case 'low':
        return 'bg-risk-low text-white';
      default:
        return 'bg-dark-elevated text-text-secondary';
    }
  };

  // Format timestamp
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleViolation = (index: number) => {
    setExpandedViolation(expandedViolation === index ? null : index);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Summary Stats at Top */}
      {analysis.violations.length > 0 && (
        <div className="sticky top-0 z-10 bg-dark-surface border-b border-dark-border p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">📊 Violation Summary</h3>
            <div className="text-xs text-text-muted">Click severity to navigate</div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {/* Critical */}
            <button
              onClick={() => handleSeverityClick('critical')}
              disabled={violationsBySeverity.critical.length === 0}
              className={`text-center p-3 rounded-lg border-2 transition-all ${
                violationsBySeverity.critical.length > 0
                  ? 'border-risk-critical/50 bg-risk-critical/10 hover:bg-risk-critical/20 hover:border-risk-critical cursor-pointer'
                  : 'border-dark-border bg-dark-elevated/50 cursor-not-allowed opacity-50'
              }`}
            >
              <div className={`text-2xl font-bold ${
                violationsBySeverity.critical.length > 0 ? 'text-risk-critical' : 'text-text-muted'
              }`}>
                {violationsBySeverity.critical.length}
              </div>
              <div className="text-xs text-text-muted mt-1">Critical</div>
              {violationsBySeverity.critical.length > 1 && (
                <div className="text-xs text-risk-critical mt-1">
                  {severityCycleIndex.critical + 1}/{violationsBySeverity.critical.length}
                </div>
              )}
            </button>

            {/* High */}
            <button
              onClick={() => handleSeverityClick('high')}
              disabled={violationsBySeverity.high.length === 0}
              className={`text-center p-3 rounded-lg border-2 transition-all ${
                violationsBySeverity.high.length > 0
                  ? 'border-risk-high/50 bg-risk-high/10 hover:bg-risk-high/20 hover:border-risk-high cursor-pointer'
                  : 'border-dark-border bg-dark-elevated/50 cursor-not-allowed opacity-50'
              }`}
            >
              <div className={`text-2xl font-bold ${
                violationsBySeverity.high.length > 0 ? 'text-risk-high' : 'text-text-muted'
              }`}>
                {violationsBySeverity.high.length}
              </div>
              <div className="text-xs text-text-muted mt-1">High</div>
              {violationsBySeverity.high.length > 1 && (
                <div className="text-xs text-risk-high mt-1">
                  {severityCycleIndex.high + 1}/{violationsBySeverity.high.length}
                </div>
              )}
            </button>

            {/* Medium */}
            <button
              onClick={() => handleSeverityClick('medium')}
              disabled={violationsBySeverity.medium.length === 0}
              className={`text-center p-3 rounded-lg border-2 transition-all ${
                violationsBySeverity.medium.length > 0
                  ? 'border-risk-medium/50 bg-risk-medium/10 hover:bg-risk-medium/20 hover:border-risk-medium cursor-pointer'
                  : 'border-dark-border bg-dark-elevated/50 cursor-not-allowed opacity-50'
              }`}
            >
              <div className={`text-2xl font-bold ${
                violationsBySeverity.medium.length > 0 ? 'text-risk-medium' : 'text-text-muted'
              }`}>
                {violationsBySeverity.medium.length}
              </div>
              <div className="text-xs text-text-muted mt-1">Medium</div>
              {violationsBySeverity.medium.length > 1 && (
                <div className="text-xs text-risk-medium mt-1">
                  {severityCycleIndex.medium + 1}/{violationsBySeverity.medium.length}
                </div>
              )}
            </button>

            {/* Low */}
            <button
              onClick={() => handleSeverityClick('low')}
              disabled={violationsBySeverity.low.length === 0}
              className={`text-center p-3 rounded-lg border-2 transition-all ${
                violationsBySeverity.low.length > 0
                  ? 'border-risk-low/50 bg-risk-low/10 hover:bg-risk-low/20 hover:border-risk-low cursor-pointer'
                  : 'border-dark-border bg-dark-elevated/50 cursor-not-allowed opacity-50'
              }`}
            >
              <div className={`text-2xl font-bold ${
                violationsBySeverity.low.length > 0 ? 'text-risk-low' : 'text-text-muted'
              }`}>
                {violationsBySeverity.low.length}
              </div>
              <div className="text-xs text-text-muted mt-1">Low</div>
              {violationsBySeverity.low.length > 1 && (
                <div className="text-xs text-risk-low mt-1">
                  {severityCycleIndex.low + 1}/{violationsBySeverity.low.length}
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto dark-scrollbar p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            🚨 {analysis.violations.length} Compliance {analysis.violations.length === 1 ? 'Violation' : 'Violations'} Found
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Detailed analysis and remediation suggestions
          </p>
        </div>

        {/* Violations List */}
        {analysis.violations.length > 0 ? (
          <div className="space-y-4">
            {analysis.violations.map((violation, index) => {
              const info = getViolationInfo(violation.type);
              const isExpanded = expandedViolation === index;

              return (
                <div
                  key={index}
                  id={`violation-${index}`}
                  className={`metric-card border-2 ${info.borderColor}/30 hover:${info.borderColor}/60 transition-all cursor-pointer ${
                    isExpanded ? 'ring-2 ring-badge-pressure' : ''
                  }`}
                  onClick={() => toggleViolation(index)}
                >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl mt-1">{info.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          Violation #{index + 1}: {info.label}
                        </h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${getSeverityBadge(violation.severity)}`}>
                          {violation.severity}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <span>Time: {formatTime(violation.timestamp)}</span>
                        <span>•</span>
                        <span>Speaker: {violation.speaker === 'agent' ? '🎤 Agent' : '👤 Client'}</span>
                      </div>
                    </div>
                  </div>

                  <button className="text-text-muted hover:text-white transition-colors">
                    <svg
                      className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-6 space-y-6 border-t border-dark-border pt-6">
                    {/* Regulation */}
                    {violation.regulation && (
                      <div>
                        <div className="text-xs text-text-muted uppercase tracking-wide mb-2">Regulation</div>
                        <div className="text-sm font-medium text-white bg-dark-elevated p-3 rounded-lg border border-dark-border">
                          {violation.regulation}
                        </div>
                      </div>
                    )}

                    {/* Quote */}
                    <div>
                      <div className="text-xs text-text-muted uppercase tracking-wide mb-2">
                        📝 Quote from Transcript
                      </div>
                      <div className="bg-dark-bg p-4 rounded-lg border border-risk-critical/30">
                        <p className="text-sm text-white leading-relaxed italic">
                          "{violation.quote}"
                        </p>
                      </div>
                    </div>

                    {/* Explanation */}
                    {violation.explanation && (
                      <div>
                        <div className="text-xs text-text-muted uppercase tracking-wide mb-2">
                          ❌ Issue
                        </div>
                        <div className="text-sm text-text-secondary leading-relaxed bg-dark-elevated p-4 rounded-lg border border-dark-border">
                          {violation.explanation}
                        </div>
                      </div>
                    )}

                    {/* Suggested Alternative */}
                    {violation.suggestedAlternative && (
                      <div>
                        <div className="text-xs text-text-muted uppercase tracking-wide mb-2">
                          ✅ Suggested Alternative
                        </div>
                        <div className="bg-risk-none/10 p-4 rounded-lg border border-risk-none/30">
                          <p className="text-sm text-white leading-relaxed">
                            "{violation.suggestedAlternative}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button className="px-4 py-2 bg-badge-pressure text-white text-sm font-medium rounded-lg hover:bg-badge-pressure/80 transition-colors">
                        View in Transcript →
                      </button>
                      <button className="px-4 py-2 bg-dark-elevated text-white text-sm font-medium rounded-lg border border-dark-border hover:bg-dark-bg transition-colors">
                        Assign Training
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* No Violations State */
        <div className="metric-card text-center py-16">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Violations Detected</h3>
          <p className="text-sm text-text-muted max-w-md mx-auto">
            This call demonstrated excellent compliance with FDCPA regulations. 
            The agent maintained professional standards throughout the conversation.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-risk-none/20 text-risk-none rounded-lg">
            <span className="text-2xl">🌟</span>
            <span className="text-sm font-semibold">Exemplary Performance</span>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
