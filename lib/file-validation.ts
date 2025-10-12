// lib/file-validation.ts
// File validation utilities for upload functionality

import { FileValidationResult } from '@/types/upload';

/**
 * Maximum file size in bytes (from env or default to 10MB)
 */
const MAX_FILE_SIZE = (parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10) * 1024 * 1024);

/**
 * Validates if a file meets upload requirements
 */
export function validateFile(file: File): FileValidationResult {
  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: 'No file provided',
    };
  }

  // Check file type
  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    return {
      valid: false,
      error: 'Only JSON files are allowed',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = Math.floor(MAX_FILE_SIZE / (1024 * 1024));
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty',
    };
  }

  return { valid: true };
}

/**
 * Validates JSON structure of file content
 */
export async function validateJSONStructure(file: File): Promise<FileValidationResult> {
  try {
    const text = await file.text();
    JSON.parse(text);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid JSON format',
    };
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
