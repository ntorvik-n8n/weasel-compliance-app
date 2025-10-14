'use client';

import React from 'react';
import { useUploadProgress } from '@/contexts/UploadProgressContext';
import { UploadProgressBar } from '@/components/upload/UploadProgressBar';

export function ActiveUploads() {
  const { uploads, retryUpload, cancelUpload, dismissUpload } = useUploadProgress();

  const activeUploads = Array.from(uploads.values());

  if (activeUploads.length === 0) {
    return <p className="text-sm text-dark-text-muted">No active uploads.</p>;
  }

  return (
    <div>
      {activeUploads.map(upload => (
        <UploadProgressBar
          key={upload.fileId}
          upload={upload}
          onRetry={() => retryUpload(upload.fileId)}
          onCancel={() => cancelUpload(upload.fileId)}
          onDismiss={() => dismissUpload(upload.fileId)}
        />
      ))}
    </div>
  );
}
