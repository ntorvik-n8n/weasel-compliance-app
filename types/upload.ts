// types/upload.ts
// Type definitions for file upload functionality

/**
 * Represents the detailed state of an upload in progress.
 */
export type UploadState =
  | 'queued'
  | 'validating'
  | 'checking_collision'
  | 'uploading'
  | 'processing'
  | 'complete'
  | 'failed'
  | 'cancelled';

/**
 * Represents a detailed error during the upload process.
 */
export interface UploadError {
  code: string;
  message: string; // User-friendly message
  details?: string; // Technical details
  retryable: boolean;
  timestamp: number;
}

/**
 * Represents the progress of a single file upload.
 */
export interface UploadProgress {
  file: File;
  fileId: string;
  filename: string;
  state: UploadState;
  progress: number; // 0-100
  uploadedBytes: number;
  totalBytes: number;
  speed: number; // bytes per second
  estimatedTimeRemaining: number; // seconds
  startTime: number; // timestamp
  error?: UploadError;
  retryCount: number;
  maxRetries: number;
}

/**
 * Simple upload status for general use.
 */
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

/**
 * Represents a file that has been uploaded.
 */
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  status: UploadStatus;
  progress: number;
  error?: string;
}

/**
 * Result of a file validation check.
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Response from the upload API.
 */
export interface UploadResponse {
  success: boolean;
  fileId: string;
  fileName: string;
  message?: string;
  error?: string;
}

/**
 * Request to the upload API.
 */
export interface UploadRequest {
  file: File;
  fileName:string;
}