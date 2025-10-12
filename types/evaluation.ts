/**
 * Response Evaluation Types
 * For Epic 5 - Response Evaluation System
 */

export interface EvaluateRequest {
  originalResponse: string;
  alternativeResponse: string;
  violationContext: {
    type: string;
    severity: string;
    regulation: string;
    explanation: string;
  };
}

export interface EvaluationScores {
  fdcpaCompliance: number;
  professionalism: number;
  effectiveness: number;
  toneEmpathy: number;
  overall: number;
}

export type EvaluationRecommendation = 'approve' | 'approve_with_notes' | 'needs_revision';

export interface EvaluationResult {
  scores: EvaluationScores;
  improvements: string[];
  concerns: string[];
  rationale: string;
  recommendation: EvaluationRecommendation;
}

export interface EvaluationState {
  isLoading: boolean;
  result: EvaluationResult | null;
  error: string | null;
}
