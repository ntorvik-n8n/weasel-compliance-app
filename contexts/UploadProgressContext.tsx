'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { UploadProgress, UploadState, UploadError } from '@/types/upload';

interface UploadProgressContextValue {
  uploads: Map<string, UploadProgress>;
  startUpload: (file: File, onComplete?: () => void) => void;
  retryUpload: (fileId: string) => Promise<void>;
  cancelUpload: (fileId: string) => void;
  dismissUpload: (fileId: string) => void; // New function
  clearCompleted: () => void;
}

const UploadProgressContext = createContext<UploadProgressContextValue | undefined>(undefined);

export function UploadProgressProvider({ children }: { children: ReactNode }) {
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(new Map());

  const updateProgress = (fileId: string, uploadedBytes: number) => {
    setUploads(prev => {
      const newUploads = new Map(prev);
      const upload = newUploads.get(fileId);
      if (upload) {
        const elapsed = (Date.now() - upload.startTime) / 1000;
        const speed = uploadedBytes / elapsed;
        const remainingBytes = upload.totalBytes - uploadedBytes;
        const estimatedTimeRemaining = speed > 0 ? remainingBytes / speed : 0;
        const progress = (uploadedBytes / upload.totalBytes) * 100;

        newUploads.set(fileId, {
          ...upload,
          state: 'uploading',
          progress,
          uploadedBytes,
          speed,
          estimatedTimeRemaining,
        });
      }
      return newUploads;
    });
  };

  const updateState = (fileId: string, state: UploadState) => {
    setUploads(prev => {
      const newUploads = new Map(prev);
      const upload = newUploads.get(fileId);
      if (upload) {
        newUploads.set(fileId, { ...upload, state });
      }
      return newUploads;
    });
  };

  const setError = (fileId: string, error: UploadError) => {
    setUploads(prev => {
      const newUploads = new Map(prev);
      const upload = newUploads.get(fileId);
      if (upload) {
        newUploads.set(fileId, { ...upload, state: 'failed', error });
      }
      return newUploads;
    });
  };

  const uploadFile = useCallback(async (file: File, fileId: string, customFilename?: string, onComplete?: () => void) => {
    try {
      updateState(fileId, 'uploading');

      const formData = new FormData();
      const fileToUpload = customFilename
        ? new File([file], customFilename, { type: file.type })
        : file;

      formData.append('file', fileToUpload);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          updateProgress(fileId, event.loaded);
        }
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          updateState(fileId, 'complete');
          // Trigger callback to refresh file list
          if (onComplete) {
            onComplete();
          }
        } else if (xhr.status === 409) {
          // Handle collision
          const errorData = JSON.parse(xhr.responseText);
          const uploadError: UploadError = {
            code: 'COLLISION',
            message: `File "${errorData.filename || file.name}" already exists. Please rename the file or delete the existing one.`,
            retryable: false,
            timestamp: Date.now(),
          };
          setError(fileId, uploadError);
        } else {
          const errorData = JSON.parse(xhr.responseText);
          const uploadError: UploadError = {
            code: `HTTP_${xhr.status}`,
            message: errorData.error || 'Upload failed',
            retryable: xhr.status >= 500,
            timestamp: Date.now(),
          };
          setError(fileId, uploadError);
        }
      };

      xhr.onerror = () => {
        const uploadError: UploadError = {
          code: 'NETWORK_ERROR',
          message: 'Network error during upload',
          retryable: true,
          timestamp: Date.now(),
        };
        setError(fileId, uploadError);
      };

      xhr.send(formData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      const uploadError: UploadError = {
        code: 'CLIENT_ERROR',
        message: errorMessage,
        retryable: false,
        timestamp: Date.now(),
      };
      setError(fileId, uploadError);
    }
  }, [updateState, updateProgress, setError]);

  const startUpload = (file: File, onComplete?: () => void) => {
    const fileId = `${Date.now()}-${file.name}`;
    setUploads(prev => {
      const newUploads = new Map(prev);
      newUploads.set(fileId, {
        file,
        fileId,
        filename: file.name,
        state: 'queued',
        progress: 0,
        uploadedBytes: 0,
        totalBytes: file.size,
        speed: 0,
        estimatedTimeRemaining: 0,
        startTime: Date.now(),
        retryCount: 0,
        maxRetries: 3,
      });
      return newUploads;
    });
    uploadFile(file, fileId, undefined, onComplete);
  };


  const retryUpload = async (fileId: string) => {
    const upload = uploads.get(fileId);
    if (upload && upload.error && upload.retryCount < upload.maxRetries) {
        setUploads(prev => {
            const newUploads = new Map(prev);
            const upload = newUploads.get(fileId);
            if (upload) {
                newUploads.set(fileId, {
                    ...upload,
                    state: 'queued',
                    progress: 0,
                    uploadedBytes: 0,
                    error: undefined,
                    retryCount: upload.retryCount + 1,
                });
            }
            return newUploads;
        });
        uploadFile(upload.file, fileId);
    }
  };

  const cancelUpload = (fileId: string) => {
    setUploads(prev => {
      const newUploads = new Map(prev);
      const upload = newUploads.get(fileId);
      if (upload) {
        newUploads.set(fileId, { ...upload, state: 'cancelled' });
      }
      return newUploads;
    });
  };

  const clearCompleted = () => {
    setUploads(prev => {
      const newUploads = new Map<string, UploadProgress>();
      for (const [key, value] of prev.entries()) {
        if (value.state !== 'complete' && value.state !== 'cancelled') {
          newUploads.set(key, value);
        }
      }
      return newUploads;
    });
  };

  const dismissUpload = (fileId: string) => {
    setUploads(prev => {
      const newUploads = new Map(prev);
      newUploads.delete(fileId);
      return newUploads;
    });
  };

  const contextValue: UploadProgressContextValue = {
    uploads,
    startUpload,
    retryUpload,
    cancelUpload,
    dismissUpload, // Expose the new function
    clearCompleted,
  };

  return (
    <UploadProgressContext.Provider value={contextValue}>
      {children}
    </UploadProgressContext.Provider>
  );
}

export function useUploadProgress() {
  const context = useContext(UploadProgressContext);
  if (context === undefined) {
    throw new Error('useUploadProgress must be used within an UploadProgressProvider');
  }
  return context;
}