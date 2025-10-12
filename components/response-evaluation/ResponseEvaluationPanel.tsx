'use client';

import { useState } from 'react';
import type { Violation } from '@/types/analysis';
import type { EvaluationResult } from '@/types/evaluation';
import { EvaluationResults } from './EvaluationResults';

interface ResponseEvaluationPanelProps {
  violation: Violation;
  onClose: () => void;
}

export function ResponseEvaluationPanel({ violation, onClose }: ResponseEvaluationPanelProps) {
  const [alternativeResponse, setAlternativeResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async () => {
    if (!alternativeResponse.trim()) {
      setError('Please enter an alternative response');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalResponse: violation.quote,
          alternativeResponse: alternativeResponse.trim(),
          violationContext: {
            type: violation.type,
            severity: violation.severity,
            regulation: violation.regulation,
            explanation: violation.explanation,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Evaluation failed');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="evaluation-panel-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 id="evaluation-panel-title" className="text-xl font-semibold">
              Response Evaluation
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              aria-label="Close panel"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Original Response */}
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-2">
              🔴 Original Response (VIOLATION @ {Math.floor(violation.timestamp / 60)}:{String(violation.timestamp % 60).padStart(2, '0')})
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <blockquote className="text-gray-800 italic">
                &quot;{violation.quote}&quot;
              </blockquote>
              <div className="mt-3 text-sm">
                <p className="text-red-700 font-medium">
                  Issue: {violation.regulation}
                </p>
                <p className="text-gray-600 mt-1">{violation.explanation}</p>
                <p className="text-gray-500 mt-1">
                  Severity: <span className="uppercase font-medium">{violation.severity}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Alternative Response Input */}
          <div>
            <label htmlFor="alternative-response" className="block font-semibold text-sm text-gray-700 mb-2">
              ✏️ Your Alternative Response
            </label>
            <textarea
              id="alternative-response"
              value={alternativeResponse}
              onChange={(e) => setAlternativeResponse(e.target.value)}
              placeholder="Enter a better, compliant alternative response..."
              className="w-full border border-gray-300 rounded-md p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleEvaluate}
              disabled={isLoading || !alternativeResponse.trim()}
              className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Evaluating...' : 'Evaluate My Response'}
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-gray-600">Analyzing your response...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 font-medium">❌ {error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Result Display (Story 5.2: Rich UI) */}
          {result && !isLoading && (
            <EvaluationResults
              result={result}
              originalResponse={violation.quote}
              alternativeResponse={alternativeResponse}
            />
          )}
        </div>
      </div>
    </div>
  );
}
