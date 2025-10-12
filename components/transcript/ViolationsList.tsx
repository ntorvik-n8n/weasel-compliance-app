'use client';

import { useState } from 'react';
import type { Violation } from '@/types/analysis';
import { ResponseEvaluationPanel } from '@/components/response-evaluation/ResponseEvaluationPanel';
import { useFileManager } from '@/contexts/FileManagerContext';

interface ViolationItemProps {
  violation: Violation;
  violationIndex: number;
  isHighlighted: boolean;
  onEvaluate: (violation: Violation) => void;
  onHighlight: (index: number) => void;
}

function ViolationItem({ violation, violationIndex, isHighlighted, onEvaluate, onHighlight }: ViolationItemProps) {
    return (
        <div
            className={`p-3 rounded-md border transition-all cursor-pointer ${
                isHighlighted
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
            onClick={() => onHighlight(violationIndex)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onHighlight(violationIndex);
                }
            }}
            aria-label={`Violation at ${Math.floor(violation.timestamp / 60)}:${String(violation.timestamp % 60).padStart(2, '0')}. Click to highlight in transcript.`}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="font-semibold text-sm">{violation.regulation}</p>
                    <p className="text-xs text-gray-500 uppercase">{violation.severity}</p>
                    <p className="text-xs text-gray-600 mt-1">
                        @ {Math.floor(violation.timestamp / 60)}:{String(violation.timestamp % 60).padStart(2, '0')}
                    </p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEvaluate(violation);
                    }}
                    className="ml-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    aria-label="Evaluate this violation"
                >
                    Evaluate
                </button>
            </div>
            <blockquote className="mt-2 pl-2 border-l-2 border-red-500">
                <p className="text-sm italic text-gray-700">&quot;{violation.quote}&quot;</p>
            </blockquote>
            <p className="text-sm mt-2">{violation.explanation}</p>
            {isHighlighted && (
                <p className="text-xs text-blue-600 mt-2 font-medium">
                    ↓ Highlighted in transcript below
                </p>
            )}
        </div>
    );
}

interface ViolationsListProps {
  violations: Violation[];
}

export function ViolationsList({ violations }: ViolationsListProps) {
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const { state, actions } = useFileManager();

  const handleEvaluate = (violation: Violation) => {
    setSelectedViolation(violation);
  };

  const handleClosePanel = () => {
    setSelectedViolation(null);
  };

  const handleHighlight = (index: number) => {
    // Toggle highlight: if clicking the same violation, clear it
    if (state.highlightedViolationId === index) {
      actions.setHighlightedViolation(null);
    } else {
      actions.setHighlightedViolation(index);
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-4">
          Violations Detected ({violations.length})
          {state.highlightedViolationId !== null && (
            <span className="ml-2 text-xs text-blue-600 font-normal">
              (Click violation to highlight in transcript)
            </span>
          )}
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {violations.length > 0 ? (
              violations.map((v, i) => (
                <ViolationItem
                  key={i}
                  violation={v}
                  violationIndex={i}
                  isHighlighted={state.highlightedViolationId === i}
                  onEvaluate={handleEvaluate}
                  onHighlight={handleHighlight}
                />
              ))
          ) : (
              <p className="text-sm text-gray-500">No violations were detected in this call.</p>
          )}
        </div>
      </div>

      {selectedViolation && (
        <ResponseEvaluationPanel
          violation={selectedViolation}
          onClose={handleClosePanel}
        />
      )}
    </>
  );
}
