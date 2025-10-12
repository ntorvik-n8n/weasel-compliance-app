import type { FileMetadata } from '@/types/fileManagement';
import { formatDuration } from '@/lib/callLogParsing';

export function CallLogMetadata({ file }: { file: FileMetadata }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-4">Call Metadata</h3>
      <dl>
        <div className="flex justify-between py-1">
          <dt className="text-gray-600">Call ID</dt>
          <dd>{file.callId || 'N/A'}</dd>
        </div>
        <div className="flex justify-between py-1">
          <dt className="text-gray-600">Agent</dt>
          <dd>{file.agentName || 'N/A'}</dd>
        </div>
        <div className="flex justify-between py-1">
          <dt className="text-gray-600">Duration</dt>
          <dd>{formatDuration(file.callDuration)}</dd>
        </div>
        <div className="flex justify-between py-1">
            <dt className="text-gray-600">Uploaded</dt>
            <dd>{new Date(file.uploadedAt).toLocaleString()}</dd>
        </div>
      </dl>
    </div>
  );
}
