import React, { useState } from 'react';
import { UploadError } from '@/types/upload';

interface ErrorMessageProps {
  error: UploadError;
  onRetry?: () => void;
  onDismiss?: () => void;
  hideDismiss?: boolean;
}

const ErrorIcon = () => (
    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

export function ErrorMessage({ error, onRetry, onDismiss, hideDismiss }: ErrorMessageProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="error-message mt-2 p-4 border border-red-200 bg-red-50 rounded-lg">
      <div className="error-header flex items-center">
        <ErrorIcon />
        <span className="error-title ml-2 font-semibold text-red-800">{error.message}</span>
      </div>

      {error.details && (
        <details className="mt-2">
          <summary className="text-sm text-gray-600 cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
            View technical details
          </summary>
          {showDetails && <pre className="error-details mt-2 p-2 bg-gray-100 text-xs text-gray-700 rounded">{error.details}</pre>}
        </details>
      )}

      <div className="error-actions mt-4 flex justify-end space-x-2">
        {error.retryable && onRetry && (
          <button onClick={onRetry} className="btn-retry px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600">
            Retry Upload
          </button>
        )}
        {!hideDismiss && onDismiss && (
            <button onClick={onDismiss} className="btn-dismiss px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                Dismiss
            </button>
        )}
      </div>
    </div>
  );
}
