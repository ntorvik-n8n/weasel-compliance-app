'use client';

import React from 'react';
import { useUploadProgress } from '@/contexts/UploadProgressContext';
import { formatBytes } from '@/lib/utils';
import { UploadProgressBar } from './UploadProgressBar';

export default function FileList() {
  const { uploads, cancelUpload, retryUpload } = useUploadProgress();

  const completedUploads = Array.from(uploads.values()).filter(u => u.state === 'complete' || u.state === 'failed');

  if (completedUploads.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Uploads</h3>
      <div className="space-y-4">
        {completedUploads.map((upload) => (
          <div
            key={upload.fileId}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {upload.filename}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500">
                    {formatBytes(upload.totalBytes)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(upload.startTime).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (upload.state === 'failed') {
                    retryUpload(upload.fileId);
                  } else {
                    // By default, we can just cancel/remove it from the list
                    cancelUpload(upload.fileId);
                  }
                }}
                className="ml-4 text-gray-400 hover:text-red-600 transition-colors"
                aria-label={upload.state === 'failed' ? 'Retry upload' : 'Remove file'}
              >
                {upload.state === 'failed' ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12A8 8 0 1 0 12 4" />
                    </svg>
                ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
              </button>
            </div>

            {upload.state === 'failed' && upload.error && (
                <div className="mt-3 flex gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Failed: {upload.error.message}
                    </span>
                </div>
            )}

            {upload.state === 'complete' && (
              <div className="mt-3 flex gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Uploaded
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
