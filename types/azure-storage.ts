/**
 * Azure Blob Storage type definitions
 * Re-exports types from the blob storage client for use in components
 */

export type {
  FileMetadata,
  UploadResult,
  ListOptions,
  PaginatedFileList,
} from '@/lib/azure/blobStorageClient';

/**
 * Container types for Azure Blob Storage
 */
export type ContainerType = 'raw' | 'processed' | 'backups';

/**
 * API response types
 */
export interface UploadResponse {
  success: boolean;
  filename?: string;
  url?: string;
  uploadedAt?: string;
  size?: number;
  path?: string;
  error?: string;
  collision?: boolean;
}

export interface ListFilesResponse {
  success: boolean;
  files?: Array<{
    name: string;
    path: string;
    size: number;
    uploadedAt: string;
    metadata: {
      originalFilename: string;
      uploadedAt: string;
      size: number;
      status: string;
      contentType: string;
    };
  }>;
  total?: number;
  hasMore?: boolean;
  error?: string;
}

export interface GetFileResponse {
  success: boolean;
  filename?: string;
  content?: any;
  metadata?: {
    originalFilename: string;
    uploadedAt: string;
    size: number;
    status: string;
    contentType: string;
  };
  error?: string;
}

export interface UpdateMetadataResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface DeleteFileResponse {
  success: boolean;
  message?: string;
  error?: string;
}
