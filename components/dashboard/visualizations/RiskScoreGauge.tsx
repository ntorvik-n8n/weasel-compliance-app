'use client';

import React from 'react';

interface RiskScoreGaugeProps {
  score: number; // 0-10
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  inverted?: boolean; // If true, higher scores are good (for FDCPA Compliance)
}

/**
 * Risk Score Gauge Component
 *
 * Displays a risk score as a radial gauge with color-coded severity levels
 *
 * Color Scheme:
 * - Green: Good (low risk OR high compliance)
 * - Yellow: Warning/Caution
 * - Red: Bad (high risk OR low compliance)
 *
 * @param inverted - Set to true for metrics where higher is better (e.g., FDCPA Compliance)
 */
export function RiskScoreGauge({ score, label = 'Risk Score', size = 'md', inverted = false }: RiskScoreGaugeProps) {
  // Determine color based on score
  // For normal (Risk Score): High score = Red (bad), Low score = Green (good)
  // For inverted (FDCPA Compliance): High score = Green (good), Low score = Red (bad)
  const getColor = (score: number, inverted: boolean) => {
    if (inverted) {
      // Inverted: higher is better (FDCPA Compliance)
      if (score >= 7) return { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-100' };
      if (score >= 4) return { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-100' };
      return { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' };
    } else {
      // Normal: higher is worse (Risk Score)
      if (score >= 7) return { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' };
      if (score >= 4) return { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-100' };
      return { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-100' };
    }
  };

  const color = getColor(score, inverted);
  const percentage = (score / 10) * 100;

  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-24 h-24', text: 'text-2xl', label: 'text-xs' },
    md: { container: 'w-32 h-32', text: 'text-3xl', label: 'text-sm' },
    lg: { container: 'w-40 h-40', text: 'text-4xl', label: 'text-base' },
  };

  const config = sizeConfig[size];

  // Calculate SVG circle properties for radial gauge
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative ${config.container}`}
        role="img"
        aria-label={`${label}: ${score.toFixed(1)} out of 10`}
      >
        {/* Background circle */}
        <svg className="transform -rotate-90 w-full h-full" aria-hidden="true">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={color.bg.replace('bg-', 'text-')}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>

        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
          <span className={`${config.text} font-bold ${color.text}`}>
            {score.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">/ 10</span>
        </div>
      </div>

      {/* Label */}
      <p className={`mt-2 ${config.label} font-medium text-gray-700 text-center`} aria-hidden="true">
        {label}
      </p>
    </div>
  );
}

/**
 * Horizontal Bar Gauge (Alternative)
 * Simpler linear representation of risk score
 */
export function RiskScoreBar({ score, label = 'Risk Score', inverted = false }: Omit<RiskScoreGaugeProps, 'size'>) {
  const getColor = (score: number, inverted: boolean) => {
    if (inverted) {
      // Inverted: higher is better (FDCPA Compliance)
      if (score >= 7) return 'bg-green-600';
      if (score >= 4) return 'bg-yellow-600';
      return 'bg-red-600';
    } else {
      // Normal: higher is worse (Risk Score)
      if (score >= 7) return 'bg-red-600';
      if (score >= 4) return 'bg-yellow-600';
      return 'bg-green-600';
    }
  };

  const getTextColor = (score: number, inverted: boolean) => {
    if (inverted) {
      // Inverted: higher is better (FDCPA Compliance)
      if (score >= 7) return 'text-green-600';
      if (score >= 4) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      // Normal: higher is worse (Risk Score)
      if (score >= 7) return 'text-red-600';
      if (score >= 4) return 'text-yellow-600';
      return 'text-green-600';
    }
  };

  const percentage = (score / 10) * 100;

  return (
    <div role="img" aria-label={`${label}: ${score.toFixed(1)} out of 10`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700" aria-hidden="true">{label}</span>
        <span className={`text-2xl font-bold ${getTextColor(score, inverted)}`} aria-hidden="true">
          {score.toFixed(1)}/10
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3" aria-hidden="true">
        <div
          className={`h-3 rounded-full ${getColor(score, inverted)} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
