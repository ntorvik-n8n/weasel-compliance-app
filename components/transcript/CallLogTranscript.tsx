'use client';

import { useEffect, useRef } from 'react';
import type { TranscriptTurn } from '@/types/callLog';
import { useFileManager } from '@/contexts/FileManagerContext';
import type { Violation } from '@/types/analysis';

interface TranscriptTurnProps {
  turn: TranscriptTurn;
  isHighlighted: boolean;
  violationAtThisTurn?: Violation;
}

function TranscriptTurnComponent({ turn, isHighlighted, violationAtThisTurn }: TranscriptTurnProps) {
    const isAgent = turn.speaker === 'agent';
    const turnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isHighlighted && turnRef.current) {
            turnRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [isHighlighted]);

    return (
        <div
            ref={turnRef}
            className={`flex items-start gap-3 ${isAgent ? '' : 'flex-row-reverse'} transition-all ${
                isHighlighted ? 'scale-105' : ''
            }`}
        >
            <div
                className={`p-3 rounded-lg transition-all ${
                    isHighlighted
                        ? isAgent
                            ? 'bg-red-200 ring-4 ring-red-400 shadow-lg'
                            : 'bg-yellow-200 ring-4 ring-yellow-400 shadow-lg'
                        : isAgent
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                }`}
            >
                <p className="text-sm text-gray-800">{turn.text}</p>
                <span className="text-xs text-gray-500">
                    {typeof turn.timestamp === 'number'
                        ? `${Math.floor(turn.timestamp / 60)}:${String(turn.timestamp % 60).padStart(2, '0')}`
                        : turn.timestamp}
                </span>
                {isHighlighted && violationAtThisTurn && (
                    <div className="mt-2 pt-2 border-t border-red-400">
                        <p className="text-xs font-semibold text-red-700">
                            ⚠️ VIOLATION: {violationAtThisTurn.regulation}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                            {violationAtThisTurn.explanation}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

interface CallLogTranscriptProps {
  transcript: TranscriptTurn[];
  violations?: Violation[];
}

export function CallLogTranscript({ transcript, violations = [] }: CallLogTranscriptProps) {
  const { state } = useFileManager();
  const highlightedViolation = state.highlightedViolationId !== null && violations[state.highlightedViolationId];

  // Find transcript turn that matches the highlighted violation timestamp
  const getHighlightedTurnIndex = () => {
    if (!highlightedViolation) return -1;

    // Find the turn closest to the violation timestamp
    let closestIndex = -1;
    let closestDiff = Infinity;

    transcript.forEach((turn, index) => {
      const turnTime = typeof turn.timestamp === 'number' ? turn.timestamp : 0;
      const diff = Math.abs(turnTime - highlightedViolation.timestamp);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const highlightedTurnIndex = getHighlightedTurnIndex();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-4">
        Transcript
        {highlightedViolation && (
          <span className="ml-2 text-sm font-normal text-blue-600">
            (Showing violation at {Math.floor(highlightedViolation.timestamp / 60)}:
            {String(highlightedViolation.timestamp % 60).padStart(2, '0')})
          </span>
        )}
      </h3>
      <div className="space-y-4 max-h-96 overflow-y-auto scroll-smooth">
        {transcript.map((turn, index) => (
            <TranscriptTurnComponent
                key={index}
                turn={turn}
                isHighlighted={index === highlightedTurnIndex}
                violationAtThisTurn={
                  index === highlightedTurnIndex && highlightedViolation
                    ? highlightedViolation
                    : undefined
                }
            />
        ))}
      </div>
    </div>
  );
}
