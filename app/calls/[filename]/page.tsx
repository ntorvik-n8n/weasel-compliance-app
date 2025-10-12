'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { CallLog } from '@/types/callLog';
import { CallLogHeader } from '@/components/transcript/CallLogHeader';
import { CallLogMetadata } from '@/components/transcript/CallLogMetadata';
import { CallLogTranscript } from '@/components/transcript/CallLogTranscript';
import { useFileManager } from '@/contexts/FileManagerContext';
import { AnalysisSummary } from '@/components/transcript/AnalysisSummary';
import { ViolationsList } from '@/components/transcript/ViolationsList';
import type { AnalysisResult } from '@/types/analysis';

export default function CallLogDetailPage() {
  const { filename } = useParams();
  const { state, actions } = useFileManager();
  const [callLog, setCallLog] = useState<CallLog | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  
  const decodedFilename = decodeURIComponent(filename as string);

  useEffect(() => {
    actions.selectFile(decodedFilename);

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [callLogRes, analysisRes] = await Promise.all([
          fetch(`/api/files/${filename}`),
          fetch(`/api/analysis/${filename}`),
        ]);

        if (callLogRes.ok) {
          setCallLog(await callLogRes.json());
        }
        if (analysisRes.ok) {
          setAnalysis(await analysisRes.json());
        }
        // Handle cases where one or both might fail
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [filename]);

  const fileMetadata = state.files.find(f => f.name === decodedFilename);

  if (loading) {
    return <div>Loading call log and analysis...</div>;
  }

  if (!callLog || !fileMetadata) {
    return <div>Call log not found.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <CallLogHeader file={fileMetadata} />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <CallLogMetadata file={fileMetadata} />
            {analysis && <AnalysisSummary analysis={analysis} />}
          </div>
          <div className="lg:col-span-2 space-y-4">
            <CallLogTranscript transcript={callLog.transcript} />
            {analysis && <ViolationsList violations={analysis.violations} />}
          </div>
        </div>
      </div>
    </div>
  );
}
