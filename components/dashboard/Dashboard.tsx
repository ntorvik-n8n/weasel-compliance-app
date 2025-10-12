'use client';

import React, { useEffect } from 'react';
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
    }
  }, [selectedFile?.name, selectedFile?.uploadedAt, actions]);

  // Show error state if there is an error and no data available
  if (state.error && !state.selectedFileTranscript && !state.selectedFileAnalysis) {
    return (
      <div className="flex-1 flex items-center justify-center bg-red-50 p-8">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium text-red-900 mb-2">Error</h3>
          <p className="text-sm text-red-700">{state.error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="text-center max-w-md">
          <div className="text-gray-400 mb-4">
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Call Selected
          </h3>
          <p className="text-sm text-gray-500">
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
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-sm text-gray-600">Loading call data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-6">
        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Analysis Summary Card - Left column */}
          <div className="lg:col-span-4">
            {state.error && state.error.includes('analysis') ? (
              <div className="bg-red-50 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Analysis</h2>
                <p className="text-sm text-red-700">{state.error}</p>
                <button 
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Identified Violations</h2>
                <div className="space-y-4">
                  {selectedFileAnalysis.violations.map((violation, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        violation.severity === 'critical' || violation.severity === 'high'
                          ? 'border-red-500 bg-red-50'
                          : violation.severity === 'medium'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {violation.regulation || 'FDCPA Violation'}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded uppercase ${
                          violation.severity === 'critical' || violation.severity === 'high'
                            ? 'bg-red-200 text-red-800'
                            : violation.severity === 'medium'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-blue-200 text-blue-800'
                        }`}>
                          {violation.severity}
                        </span>
                      </div>

                      {violation.quote && (
                        <blockquote className="my-2 pl-3 border-l-2 border-gray-300 text-sm italic text-gray-700">
                          &quot;{violation.quote}&quot;
                        </blockquote>
                      )}

                      <p className="text-sm text-gray-700 mb-2">{violation.explanation}</p>

                      {violation.suggestedAlternative && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-medium text-green-800 mb-1">Suggested Alternative:</p>
                          <p className="text-sm text-green-700">{violation.suggestedAlternative}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transcript Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Call Transcript</h2>
              {selectedFileTranscript && selectedFileTranscript.length > 0 ? (
                <div className="space-y-3">
                  {selectedFileTranscript.map((turn, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        turn.speaker === 'agent' ? 'bg-blue-50 ml-0 mr-8' : 'bg-gray-50 ml-8 mr-0'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-700 uppercase">
                          {turn.speaker}
                        </span>
                        <span className="text-xs text-gray-500">
                          {typeof turn.timestamp === 'number'
                            ? new Date(turn.timestamp * 1000).toISOString().substr(14, 5)
                            : turn.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800">{turn.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No transcript data available</p>
              )}
            </div>

            {/* Charts Placeholder for Story 4.4 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Compliance Trends</h2>
              <p className="text-sm text-gray-500">
                Trend charts will be implemented in Story 4.4
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
