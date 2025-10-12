import type { AnalysisResult } from '@/types/analysis';

interface AnalysisSummaryProps {
  analysis: AnalysisResult;
}

export function AnalysisSummary({ analysis }: AnalysisSummaryProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-4">Analysis Summary</h3>
        <div className="space-y-2">
            <div>
                <span className="font-medium">Overall Risk Score:</span> {analysis.riskScore.toFixed(1)} / 10
            </div>
            <div>
                <span className="font-medium">FDCPA Compliance Score:</span> {analysis.fdcpaScore.toFixed(1)} / 10
            </div>
            <p className="text-sm text-gray-700 pt-2">{analysis.summary}</p>
        </div>
    </div>
  );
}
