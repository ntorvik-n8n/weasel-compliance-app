import React from 'react';
import { UploadProgress } from '@/types/upload';
import { ErrorMessage } from './ErrorMessage';
import { formatBytes, formatSpeed, formatTime } from '@/lib/utils'; // Assuming utils file exists

interface UploadProgressBarProps {
  upload: UploadProgress;
  onRetry?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
}

const StateIndicator = ({ state }: { state: UploadProgress['state'] }) => {
  // A simple component to show state, will be improved later
  return <span className="text-sm text-gray-500">{state}</span>;
};

const FileIcon = () => (
  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
);


export function UploadProgressBar({ upload, onRetry, onCancel, onDismiss }: UploadProgressBarProps) {
  const { state, progress, filename, uploadedBytes, totalBytes, speed, estimatedTimeRemaining, error } = upload;

  return (
    <div className="upload-progress-bar p-4 border rounded-lg mb-2 bg-dark-surface border-dark-border max-w-full overflow-hidden">
      <div className="upload-header flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <FileIcon />
          <span className="filename font-medium text-white text-sm truncate">{filename}</span>
        </div>
        <StateIndicator state={state} />
      </div>

      <div className="progress-bar-container mt-2 h-2 bg-dark-elevated rounded overflow-hidden">
        <div
          className="progress-bar-fill h-full bg-badge-pressure rounded transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="progress-details flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted mt-2">
        <span className="whitespace-nowrap">{formatBytes(uploadedBytes)} / {formatBytes(totalBytes)}</span>
        <span className="whitespace-nowrap">{Math.round(progress)}%</span>
        {speed > 0 && <span className="whitespace-nowrap">{formatSpeed(speed)}</span>}
        {estimatedTimeRemaining > 0 && <span className="whitespace-nowrap">{formatTime(estimatedTimeRemaining)}</span>}
      </div>

      {error && (
        <ErrorMessage error={error} onRetry={onRetry} onDismiss={onDismiss} hideDismiss />
      )}

      <div className="upload-actions mt-2 flex justify-end space-x-2">
        {state === 'uploading' && onCancel && (
          <button onClick={onCancel} className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded hover:bg-red-200">Cancel</button>
        )}
        {state === 'failed' && error?.retryable && onRetry && (
          <button onClick={onRetry} className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600">Retry</button>
        )}
        {(state === 'failed' || state === 'complete') && onDismiss && (
          <button onClick={onDismiss} className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300">Dismiss</button>
        )}
      </div>
    </div>
  );
}
