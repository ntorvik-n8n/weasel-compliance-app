"use client";

import React, { useState } from 'react';

interface TranscriptTurn {
  speaker: 'agent' | 'client' | 'customer';
  text: string;
  timestamp: number | string;
}

interface TranscriptTabProps {
  transcript: TranscriptTurn[];
}

export function TranscriptTab({ transcript }: TranscriptTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightViolations, setHighlightViolations] = useState(true);

  // Format timestamp
  const formatTime = (timestamp: number | string): string => {
    if (typeof timestamp === 'number') {
      const mins = Math.floor(timestamp / 60);
      const secs = Math.floor(timestamp % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return timestamp;
  };

  // Filter transcript based on search
  const filteredTranscript = transcript.filter(turn => {
    if (!searchQuery) return true;
    return turn.text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-badge-pressure/30 text-white rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search and Controls */}
      <div className="sticky top-0 bg-dark-surface border-b border-dark-border p-4 space-y-3 z-10">
        {/* Search Box */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-dark-elevated border border-dark-border rounded-lg text-white text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-badge-pressure focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={highlightViolations}
                onChange={(e) => setHighlightViolations(e.target.checked)}
                className="w-4 h-4 rounded border-dark-border bg-dark-elevated text-badge-pressure focus:ring-badge-pressure focus:ring-offset-dark-surface"
              />
              <span>Highlight Violations</span>
            </label>
          </div>

          <div className="text-xs text-text-muted">
            {filteredTranscript.length} of {transcript.length} turns
            {searchQuery && ' (filtered)'}
          </div>
        </div>
      </div>

      {/* Transcript Content */}
      <div className="flex-1 overflow-y-auto dark-scrollbar p-6">
        {filteredTranscript.length > 0 ? (
          <div className="space-y-4 max-w-4xl">
            {filteredTranscript.map((turn, index) => (
              <div key={index} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className={`flex-1 p-4 rounded-lg transition-all ${
                  turn.speaker === 'agent' 
                    ? 'bg-risk-critical/10 border border-risk-critical/20' 
                    : 'bg-dark-elevated border border-dark-border'
                }`}>
                  {/* Speaker Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                      turn.speaker === 'agent'
                        ? 'bg-risk-critical/20 text-risk-critical border border-risk-critical/30'
                        : 'bg-badge-success/20 text-badge-success border border-badge-success/30'
                    }`}>
                      {turn.speaker === 'agent' ? '🎤 AGENT' : '👤 CUSTOMER'}
                    </span>
                    <span className="text-xs text-text-muted">
                      {formatTime(turn.timestamp)}
                    </span>
                  </div>

                  {/* Text Content */}
                  <p className="text-sm text-white leading-relaxed">
                    {searchQuery ? highlightText(turn.text, searchQuery) : turn.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-sm text-text-muted">
                {searchQuery 
                  ? `No results found for "${searchQuery}"`
                  : 'No transcript data available'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
