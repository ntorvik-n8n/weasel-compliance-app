'use client';

import type { EvaluationScores } from '@/types/evaluation';

interface ScoreBreakdownProps {
  scores: EvaluationScores;
}

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore?: number;
}

function ScoreBar({ label, score, maxScore = 10 }: ScoreBarProps) {
  const percentage = (score / maxScore) * 100;

  const getColor = () => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    if (score >= 8) return 'text-green-700';
    if (score >= 6) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-bold ${getTextColor()}`}>
          {score.toFixed(1)}/{maxScore}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={maxScore}
          aria-label={`${label}: ${score} out of ${maxScore}`}
        />
      </div>
    </div>
  );
}

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  const scoreItems = [
    { label: 'FDCPA Compliance', value: scores.fdcpaCompliance },
    { label: 'Professionalism', value: scores.professionalism },
    { label: 'Effectiveness', value: scores.effectiveness },
    { label: 'Tone & Empathy', value: scores.toneEmpathy },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {scoreItems.map((item) => (
        <ScoreBar key={item.label} label={item.label} score={item.value} />
      ))}

      {/* Overall Score - Highlighted */}
      <div className="pt-3 border-t border-gray-300">
        <ScoreBar label="Overall Score" score={scores.overall} />
      </div>
    </div>
  );
}
