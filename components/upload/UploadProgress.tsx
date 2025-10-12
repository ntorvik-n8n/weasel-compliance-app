'use client';

// components/upload/UploadProgress.tsx
// Progress indicator for file uploads

import React from 'react';
import { UploadStatus } from '@/types/upload';

interface UploadProgressProps {
  fileName: string;
  status: UploadStatus;
  progress: number;
  error?: string;
}

export default function UploadProgress({
  fileName,
  status,
  progress,
  error,
}: UploadProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
          {fileName}
        </span>
        <span className="text-sm text-gray-500">
          {status === 'success' && '✓ Complete'}
          {status === 'uploading' && `${progress}%`}
          {status === 'error' && '✗ Failed'}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            status === 'success'
              ? 'bg-green-500'
              : status === 'error'
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
