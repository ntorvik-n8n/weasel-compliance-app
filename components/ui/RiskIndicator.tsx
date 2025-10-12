import { getRiskLevel, RiskLevel } from '@/lib/riskLevels';

interface RiskIndicatorProps {
  score: number | undefined;
}

const RISK_CONFIG: Record<RiskLevel, { label: string; className: string }> = {
  none: { label: 'N/A', className: 'bg-gray-100 text-gray-800' },
  low: { label: 'Low', className: 'bg-green-100 text-green-800' },
  medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-800' },
  critical: { label: 'Critical', className: 'bg-red-100 text-red-800' },
};

export function RiskIndicator({ score }: RiskIndicatorProps) {
  const level = getRiskLevel(score);
  const config = RISK_CONFIG[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      <span className="w-2 h-2 rounded-full bg-current" />
      <span>{config.label}</span>
    </span>
  );
}
