export type ViolationType =
  | 'abusive_language'
  | 'threatening'
  | 'excessive_pressure'
  | 'fdcpa_violation';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Violation {
  type: ViolationType;
  severity: Severity;
  timestamp: number;
  speaker: 'agent' | 'client';
  quote: string;
  explanation: string;
  regulation: string;
  suggestedAlternative: string;
}

export interface AnalysisResult {
  riskScore: number;
  fdcpaScore: number;
  violations: Violation[];
  summary: string;
  recommendations: string[];
}
