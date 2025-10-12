'use client';

interface ComparisonViewProps {
  originalResponse: string;
  alternativeResponse: string;
}

export function ComparisonView({ originalResponse, alternativeResponse }: ComparisonViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Original Response */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-red-600 font-bold text-lg">🔴</span>
          <h4 className="font-semibold text-red-900">Original Response</h4>
        </div>
        <div className="bg-white rounded p-3">
          <blockquote className="text-gray-800 italic text-sm leading-relaxed">
            &quot;{originalResponse}&quot;
          </blockquote>
        </div>
        <div className="mt-2 text-xs text-red-700 font-medium">
          ⚠️ Contains FDCPA violation
        </div>
      </div>

      {/* Alternative Response */}
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-green-600 font-bold text-lg">✅</span>
          <h4 className="font-semibold text-green-900">Your Alternative</h4>
        </div>
        <div className="bg-white rounded p-3">
          <blockquote className="text-gray-800 text-sm leading-relaxed">
            &quot;{alternativeResponse}&quot;
          </blockquote>
        </div>
        <div className="mt-2 text-xs text-green-700 font-medium">
          ✓ Compliance-focused response
        </div>
      </div>
    </div>
  );
}
