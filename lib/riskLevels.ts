export type RiskLevel = 'low' | 'medium' | 'high' | 'critical' | 'none';

export function getRiskLevel(score: number | undefined): RiskLevel {
    if (score === undefined || score === null) return 'none';
    if (score >= 8) return 'critical';
    if (score >= 6) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
}
