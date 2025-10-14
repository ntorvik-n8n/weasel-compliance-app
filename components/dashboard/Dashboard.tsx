'use client';

import React, { useEffect, useCallback } from 'react';
import { useFileManager } from '@/contexts/FileManagerContext';
import { AnalysisSummaryCard } from './AnalysisSummaryCard';

/**
 * Main Dashboard Component
 *
 * Displays a comprehensive view of the selected call log with:
 * - Analysis summary card
 * - Violations list
 * - Interactive transcript
 * - Compliance trend charts
 *
 * Uses CSS Grid for responsive layout
 */
export function Dashboard() {
  const { selectedFile, state, actions } = useFileManager();

  // Load data when selected file changes
  useEffect(() => {
    if (selectedFile) {
      actions.loadSelectedFileData(selectedFile.name, selectedFile.uploadedAt);
    } else {
      // Clear data when no file is selected
      actions.clearSelectedFileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile?.name, selectedFile?.uploadedAt]);

  // Show error state if there is an error and no data available
  if (state.error && !state.selectedFileTranscript && !state.selectedFileAnalysis) {
    return (
      <div className="flex-1 flex items-center justify-center bg-dark-bg p-8">
        <div className="text-center max-w-md bg-dark-surface rounded-card p-8 border border-risk-critical/30">
          <h3 className="text-lg font-medium text-risk-critical mb-2">Error</h3>
          <p className="text-sm text-dark-text-secondary">{state.error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-risk-critical text-white rounded-lg hover:bg-risk-critical/90 focus:outline-none focus:ring-2 focus:ring-risk-critical focus:ring-offset-2 focus:ring-offset-dark-bg transition-colors"
            onClick={() => {
              if (selectedFile) {
                actions.loadSelectedFileData(selectedFile.name, selectedFile.uploadedAt);
              }
            }}
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // Show empty state when no file is selected
  if (!selectedFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-dark-bg p-8">
        <div className="text-center max-w-md">
          <div className="text-dark-text-muted mb-4">
            <svg
              className="mx-auto h-24 w-24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-dark-text-primary mb-2">
            No Call Selected
          </h3>
          <p className="text-sm text-dark-text-secondary">
            Select a call log from the list to view its analysis, transcript, and compliance details.
          </p>
        </div>
      </div>
    );
  }

  const { selectedFileTranscript, selectedFileAnalysis, selectedFileLoading } = state;

  // Show loading state while data is being fetched
  if (selectedFileLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-dark-bg p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-badge-pressure mb-4"></div>
          <p className="text-sm text-dark-text-secondary">Loading call data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-dark-bg overflow-auto dark-scrollbar">
      <div className="p-6">
        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Analysis Summary Card - Left column */}
          <div className="lg:col-span-4">
            {state.error && state.error.includes('analysis') ? (
              <div className="metric-card bg-risk-critical/10">
                <h2 className="text-xl font-bold mb-4 text-dark-text-primary">Analysis</h2>
                <p className="text-sm text-dark-text-secondary">{state.error}</p>
                <button 
                  className="mt-4 px-4 py-2 bg-risk-critical text-white rounded-lg hover:bg-risk-critical/90 focus:outline-none focus:ring-2 focus:ring-risk-critical focus:ring-offset-2 focus:ring-offset-dark-bg transition-colors"
                  onClick={() => {
                    if (selectedFile) {
                      actions.loadSelectedFileData(selectedFile.name, selectedFile.uploadedAt);
                    }
                  }}
                >
                  Retry Loading Analysis
                </button>
              </div>
            ) : (
              <AnalysisSummaryCard analysis={selectedFileAnalysis} fileMetadata={selectedFile} />
            )}
          </div>

          {/* Main Content Area - Right column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Violations Section */}
            {selectedFileAnalysis?.violations && selectedFileAnalysis.violations.length > 0 && (
              <div className="metric-card">
                <h2 className="text-xl font-bold mb-4 text-dark-text-primary">Compliance Flags</h2>
                <div className="space-y-3">
                  {selectedFileAnalysis.violations.map((violation, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                        violation.severity === 'critical' || violation.severity === 'high'
                          ? 'border-risk-critical/30 bg-risk-critical/5'
                          : violation.severity === 'medium'
                          ? 'border-risk-medium/30 bg-risk-medium/5'
                          : 'border-badge-pressure/30 bg-badge-pressure/5'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-sm font-semibold ${
                          violation.severity === 'critical' || violation.severity === 'high'
                            ? 'text-risk-critical'
                            : violation.severity === 'medium'
                            ? 'text-risk-medium'
                            : 'text-badge-pressure'
                        }`}>
                          {violation.regulation || 'FDCPA Violation'}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full uppercase ${
                          violation.severity === 'critical' || violation.severity === 'high'
                            ? 'bg-risk-critical/20 text-risk-critical border border-risk-critical/30'
                            : violation.severity === 'medium'
                            ? 'bg-risk-medium/20 text-risk-medium border border-risk-medium/30'
                            : 'bg-badge-pressure/20 text-badge-pressure border border-badge-pressure/30'
                        }`}>
                          {violation.severity}
                        </span>
                      </div>

                      {violation.quote && (
                        <blockquote className="my-2 pl-3 border-l-2 border-dark-border text-sm italic text-dark-text-secondary">
                          &quot;{violation.quote}&quot;
                        </blockquote>
                      )}

                      <p className="text-sm text-dark-text-secondary mb-2">{violation.explanation}</p>

                      {violation.suggestedAlternative && (
                        <div className="mt-3 pt-3 border-t border-dark-border">
                          <p className="text-xs font-medium text-compliance-pass mb-1">Suggested Alternative:</p>
                          <p className="text-sm text-dark-text-secondary">{violation.suggestedAlternative}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transcript Section */}
            <div className="metric-card">
              <h2 className="text-xl font-bold mb-4 text-dark-text-primary">Call Transcript</h2>
              {selectedFileTranscript && selectedFileTranscript.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto dark-scrollbar pr-2">
                  {selectedFileTranscript.map((turn, index) => (
                    <div
                      key={index}
                      className="flex gap-3"
                    >
                      <div className={`flex-1 p-3 rounded-lg ${
                        turn.speaker === 'agent' 
                          ? 'bg-risk-critical/10 border border-risk-critical/20' 
                          : 'bg-dark-elevated border border-dark-border'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                            turn.speaker === 'agent'
                              ? 'bg-risk-critical/20 text-risk-critical'
                              : 'bg-badge-success/20 text-badge-success border border-badge-success/30'
                          }`}>
                            {turn.speaker}
                          </span>
                          <span className="text-xs text-dark-text-muted">
                            {typeof turn.timestamp === 'number'
                              ? new Date(turn.timestamp * 1000).toISOString().substr(14, 5)
                              : turn.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-dark-text-primary leading-relaxed">{turn.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-dark-text-muted">No transcript data available</p>
              )}
            </div>

            {/* Charts Placeholder for Story 4.4 */}
            <div className="metric-card">
              <h2 className="text-xl font-bold mb-4 text-dark-text-primary">Compliance Trends</h2>
              <p className="text-sm text-dark-text-muted">
                Trend charts will be implemented in Story 4.4
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
