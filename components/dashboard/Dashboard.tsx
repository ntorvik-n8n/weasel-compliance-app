'use client';

import React, { useEffect, useCallback } from 'react';
import { useFileManager } from '@/contexts/FileManagerContext';
import { Tabs } from '@/components/ui/Tabs';
import { PortfolioAnalytics } from './PortfolioAnalytics';
import { OverviewTab } from './OverviewTab';
import { TranscriptTab } from './TranscriptTab';
import { ViolationsTab } from './ViolationsTab';

/**
 * Main Dashboard Component
 *
 * Displays a comprehensive view of the selected call log with:
 * - Portfolio analytics when no file selected
 * - Tabbed interface for call details (Overview, Transcript, Violations)
 * - Quick insights and recommendations
 * - Risk timeline and comparison metrics
 *
 * Uses modern dark theme and tabbed navigation
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

  // Handler to download the call log JSON
  const handleDownload = useCallback(() => {
    if (!selectedFile || !state.selectedFileTranscript || !state.selectedFileAnalysis) return;

    const callLogData = {
      metadata: {
        filename: selectedFile.name,
        uploadedAt: selectedFile.uploadedAt,
        callDuration: selectedFile.callDuration,
      },
      transcript: state.selectedFileTranscript,
      analysis: state.selectedFileAnalysis,
    };

    const blob = new Blob([JSON.stringify(callLogData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [selectedFile, state.selectedFileTranscript, state.selectedFileAnalysis]);

  // Handler to close the call and return to portfolio analytics
  const handleClose = useCallback(() => {
    actions.selectFile(null);
  }, [actions]);

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

  // Show Portfolio Analytics when no file is selected
  if (!selectedFile) {
    return (
      <div className="flex-1 bg-dark-bg overflow-auto dark-scrollbar">
        <PortfolioAnalytics files={state.files} />
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

  // Show error if analysis failed to load
  if (!selectedFileAnalysis) {
    return (
      <div className="flex-1 flex items-center justify-center bg-dark-bg p-8">
        <div className="text-center max-w-md bg-dark-surface rounded-card p-8 border border-dark-border">
          <h3 className="text-lg font-medium text-dark-text-primary mb-2">No Analysis Available</h3>
          <p className="text-sm text-dark-text-secondary">
            This call hasn&apos;t been analyzed yet or the analysis failed to load.
          </p>
        </div>
      </div>
    );
  }

  // Define tabs
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      content: <OverviewTab analysis={selectedFileAnalysis} metadata={selectedFile} />,
    },
    {
      id: 'transcript',
      label: 'Transcript',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      content: <TranscriptTab transcript={selectedFileTranscript || []} />,
    },
    {
      id: 'violations',
      label: 'Violations',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      content: <ViolationsTab analysis={selectedFileAnalysis} />,
    },
  ];

  return (
    <div className="flex-1 bg-dark-bg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-dark-surface border-b border-dark-border px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <h1 className="text-xl font-bold text-white truncate">
              📞 {selectedFile.name}
            </h1>
            
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex-shrink-0 p-2 hover:bg-dark-elevated rounded-lg transition-colors group"
              title="Download call log JSON"
            >
              <svg className="w-5 h-5 text-text-muted group-hover:text-badge-success transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Risk Badge */}
            <div className={`px-4 py-2 rounded-lg font-bold text-sm uppercase whitespace-nowrap ${
              selectedFileAnalysis.riskScore >= 7 ? 'bg-risk-critical text-white' :
              selectedFileAnalysis.riskScore >= 5 ? 'bg-risk-high text-white' :
              selectedFileAnalysis.riskScore >= 3 ? 'bg-risk-medium text-white' :
              'bg-risk-none text-white'
            }`}>
              {selectedFileAnalysis.riskScore >= 7 ? '🔴 CRITICAL RISK' :
               selectedFileAnalysis.riskScore >= 5 ? '🟠 HIGH RISK' :
               selectedFileAnalysis.riskScore >= 3 ? '🟡 MEDIUM RISK' :
               '🟢 LOW RISK'}
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-2 hover:bg-dark-elevated rounded-lg transition-colors group"
              title="Return to Portfolio Analytics"
            >
              <svg className="w-5 h-5 text-text-muted group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <p className="text-sm text-text-muted mt-2">
          Uploaded {new Date(selectedFile.uploadedAt).toLocaleString()}
        </p>
      </div>

      {/* Tabbed Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs tabs={tabs} defaultTab="overview" />
      </div>
    </div>
  );
}
