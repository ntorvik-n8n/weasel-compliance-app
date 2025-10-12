'use client';

// contexts/UploadContext.tsx
// Context for managing file upload state across components

import React, { createContext, useContext, useState, useCallback } from 'react';
import { UploadedFile, UploadStatus } from '@/types/upload';

interface UploadContextType {
  files: UploadedFile[];
  addFile: (file: UploadedFile) => void;
  updateFileStatus: (id: string, status: UploadStatus, progress?: number, error?: string) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const addFile = useCallback((file: UploadedFile) => {
    setFiles((prev) => [...prev, file]);
  }, []);

  const updateFileStatus = useCallback(
    (id: string, status: UploadStatus, progress: number = 0, error?: string) => {
      setFiles((prev) =>
        prev.map((file) =>
          file.id === id ? { ...file, status, progress, error } : file
        )
      );
    },
    []
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return (
    <UploadContext.Provider
      value={{ files, addFile, updateFileStatus, removeFile, clearFiles }}
    >
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
}
