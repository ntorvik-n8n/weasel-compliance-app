'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import type { FileUploadProps, UploadedFile } from './types';
import { useUploadProgress } from '@/contexts/UploadProgressContext';
import { useFileManager } from '@/contexts/FileManagerContext';
import { uploadFileWithProgress } from '@/lib/uploadWithProgress';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function FileUpload({
  onUploadComplete,
  onUploadError,
  maxSize = MAX_FILE_SIZE,
  className = '',
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { actions } = useFileManager();

  const validateFile = useCallback((file: File): string | null => {
    if (!file.type.includes('json')) {
      return 'Only JSON files are allowed';
    }
    if (file.size > maxSize) {
      return `File size must be less than ${maxSize / 1024 / 1024}MB`;
    }
    return null;
  }, [maxSize]);

  const { startUpload } = useUploadProgress();

  const refreshFileList = useCallback(async () => {
    try {
      const response = await fetch('/api/files');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.files) {
          const filesWithDates = data.files.map((file: any) => ({
            ...file,
            id: file.id || file.name,
            uploadedAt: new Date(file.uploadedAt),
            lastModified: file.lastModified ? new Date(file.lastModified) : new Date(file.uploadedAt),
          }));
          actions.setFiles(filesWithDates);
        }
      }
    } catch (error) {
      console.error('Error refreshing file list:', error);
    }
  }, [actions]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);

    for (const file of acceptedFiles) {
      const error = validateFile(file);
      if (error) {
        onUploadError?.(new Error(error), file);
        continue;
      }

      try {
        // Use the context's startUpload which handles the entire upload process
        startUpload(file, refreshFileList);
        onUploadComplete?.({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          status: 'success',
        });
      } catch (e) {
        onUploadError?.(e as Error, file);
      }
    }

    setIsUploading(false);
  }, [validateFile, onUploadError, onUploadComplete, startUpload, refreshFileList]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    maxSize,
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        p-6 border-2 border-dashed rounded-lg
        ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
        ${isUploading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        hover:border-blue-400 transition-colors
        ${className}
      `}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="text-blue-600">Drop the files here...</p>
        ) : (
          <>
            <p className="text-gray-600">
              Drag &amp; drop JSON files here, or click to select files
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Only JSON files up to {maxSize / 1024 / 1024}MB are accepted
            </p>
          </>
        )}
        {isUploading && (
          <div className="mt-4">
            <p className="text-blue-600">Uploading...</p>
          </div>
        )}
      </div>
    </div>
  );
}