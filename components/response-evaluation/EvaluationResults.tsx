'use client';

import type { EvaluationResult } from '@/types/evaluation';
import { ScoreBreakdown } from './ScoreBreakdown';
import { ComparisonView } from './ComparisonView';

interface EvaluationResultsProps {
  result: EvaluationResult;
  originalResponse: string;
  alternativeResponse: string;
}

export function EvaluationResults({ result, originalResponse, alternativeResponse }: EvaluationResultsProps) {
  const getRecommendationColor = () => {
    switch (result.recommendation) {
      case 'approve':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'approve_with_notes':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'needs_revision':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getRecommendationLabel = () => {
    switch (result.recommendation) {
      case 'approve':
        return '✅ Approved';
      case 'approve_with_notes':
        return '⚠️ Approved with Notes';
      case 'needs_revision':
        return '❌ Needs Revision';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Score and Recommendation */}
      <div className={`border rounded-lg p-4 ${getRecommendationColor()}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{getRecommendationLabel()}</h3>
            <p className="text-sm mt-1">Overall Score: {result.scores.overall}/10</p>
          </div>
          <div className="text-4xl font-bold">
            {result.scores.overall.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">📊 Score Breakdown</h3>
        <ScoreBreakdown scores={result.scores} />
      </div>

      {/* Comparison View */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">📝 Response Comparison</h3>
        <ComparisonView
          originalResponse={originalResponse}
          alternativeResponse={alternativeResponse}
        />
      </div>

      {/* Rationale */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 AI Rationale</h3>
        <p className="text-sm text-blue-800 whitespace-pre-wrap">{result.rationale}</p>
      </div>

      {/* Improvements */}
      {result.improvements.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">✨ Improvements</h3>
          <ul className="list-disc list-inside space-y-1">
            {result.improvements.map((improvement, index) => (
              <li key={index} className="text-sm text-green-800">
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Concerns */}
      {result.concerns.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 mb-2">⚠️ Remaining Concerns</h3>
          <ul className="list-disc list-inside space-y-1">
            {result.concerns.map((concern, index) => (
              <li key={index} className="text-sm text-orange-800">
                {concern}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
