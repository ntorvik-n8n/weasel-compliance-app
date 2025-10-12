import { BlobServiceClient, ContainerClient, BlockBlobClient } from '@azure/storage-blob';
import { retryBlobOperation } from './retryPolicy';
import type { FileStatus } from '@/types/fileManagement';

/**
 * Configuration for Azure Blob Storage
 */
interface BlobStorageConfig {
  connectionString: string;
  containers: {
    raw: string;
    processed: string;
    backups: string;
  };
}

/**
 * File metadata stored with blob
 */
export interface FileMetadata {
  originalFilename: string;
  uploadedAt: string;
  size: number;
  uploaderId?: string;
  status: 'uploaded' | 'processing' | 'analyzed' | 'error';
  contentType: string;
  processingStartedAt?: string;
  processingCompletedAt?: string;
  errorMessage?: string;
  // Call log specific metadata
  callId?: string;
  agentName?: string;
  agentId?: string;
  callDuration?: string; // Duration in seconds as string
  callTimestamp?: string;
  callOutcome?: string;
  riskScore?: string; // Risk score as string for Azure metadata
}

/**
 * Result of file upload operation
 */
export interface UploadResult {
  filename: string;
  url: string;
  uploadedAt: string;
  size: number;
  path: string;
}

/**
 * Options for listing files
 */
export interface ListOptions {
  containerType?: 'raw' | 'processed' | 'backups';
  dateFilter?: {
    year?: number;
    month?: number;
    day?: number;
  };
  prefix?: string;
  maxResults?: number;
}

/**
 * Paginated file list result
 */
export interface PaginatedFileList {
  files: Array<{
    name: string;
    path: string;
    size: number;
    uploadedAt: string;
    metadata: FileMetadata;
  }>;
  total: number;
  hasMore: boolean;
}

/**
 * Azure Blob Storage Service
 * Handles all file operations with Azure Blob Storage
 */
export class BlobStorageService {
  private serviceClient: BlobServiceClient;
  private containers: {
    raw: ContainerClient;
    processed: ContainerClient;
    backups: ContainerClient;
  };

  constructor(config: BlobStorageConfig) {
    this.serviceClient = BlobServiceClient.fromConnectionString(
      config.connectionString
    );

    this.containers = {
      raw: this.serviceClient.getContainerClient(config.containers.raw),
      processed: this.serviceClient.getContainerClient(config.containers.processed),
      backups: this.serviceClient.getContainerClient(config.containers.backups),
    };
  }

  /**
   * Initialize containers if they don't exist
   */
  async initializeContainers(): Promise<void> {
    try {
      await this.containers.raw.createIfNotExists();
      await this.containers.processed.createIfNotExists();
      await this.containers.backups.createIfNotExists();
      console.log('Azure Blob Storage containers initialized');
    } catch (error) {
      console.error('Failed to initialize containers:', error);
      throw new Error('Container initialization failed');
    }
  }

  /**
   * Generate date-based path: /YYYY/MM/DD/filename
   */
  private getDateBasedPath(filename: string, date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}/${filename}`;
  }

  /**
   * Upload file to Azure Blob Storage
   */
  async uploadFile(
    file: Buffer,
    filename: string,
    metadata: FileMetadata,
    containerType: 'raw' | 'processed' | 'backups' = 'raw'
  ): Promise<UploadResult> {
    try {
      const container = this.containers[containerType];
      const path = this.getDateBasedPath(filename);
      const blobClient = container.getBlockBlobClient(path);

      // Upload file with metadata using retry logic
      await retryBlobOperation(
        () => blobClient.upload(file, file.length, {
          blobHTTPHeaders: {
            blobContentType: metadata.contentType,
          },
          metadata: this.serializeMetadata(metadata),
        }),
        `Upload file: ${filename}`
      );

      return {
        filename,
        url: blobClient.url,
        uploadedAt: metadata.uploadedAt,
        size: metadata.size,
        path,
      };
    } catch (error) {
      console.error('File upload failed:', error);
      throw new Error(`Failed to upload file: ${filename}`);
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(
    filename: string,
    date: Date = new Date(),
    containerType: 'raw' | 'processed' | 'backups' = 'raw'
  ): Promise<boolean> {
    try {
      const container = this.containers[containerType];
      const path = this.getDateBasedPath(filename, date);
      const blobClient = container.getBlockBlobClient(path);
      return await blobClient.exists();
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(
    filename: string,
    date: Date = new Date(),
    containerType: 'raw' | 'processed' | 'backups' = 'raw'
  ): Promise<FileMetadata | null> {
    try {
      const container = this.containers[containerType];
      const path = this.getDateBasedPath(filename, date);
      const blobClient = container.getBlockBlobClient(path);

      const properties = await blobClient.getProperties();

      if (!properties.metadata) {
        return null;
      }

      return this.deserializeMetadata(properties.metadata);
    } catch (error) {
      console.error('Error getting file metadata:', error);
      return null;
    }
  }

  /**
   * Download file content
   */
  async downloadFile(
    filename: string,
    date: Date = new Date(),
    containerType: 'raw' | 'processed' | 'backups' = 'raw'
  ): Promise<Buffer> {
    try {
      const container = this.containers[containerType];
      const path = this.getDateBasedPath(filename, date);
      const blobClient = container.getBlockBlobClient(path);

      const downloadResponse = await blobClient.download();

      if (!downloadResponse.readableStreamBody) {
        throw new Error('No content in blob');
      }

      const chunks: Buffer[] = [];
      for await (const chunk of downloadResponse.readableStreamBody) {
        chunks.push(Buffer.from(chunk));
      }

      return Buffer.concat(chunks);
    } catch (error) {
      console.error('File download failed:', error);
      throw new Error(`Failed to download file: ${filename}`);
    }
  }

  /**
   * List files with optional filtering and pagination
   */
  async listFiles(options: ListOptions = {}): Promise<PaginatedFileList> {
    try {
      const containerType = options.containerType || 'raw';
      const container = this.containers[containerType];

      // Build prefix based on date filter
      let prefix = '';
      if (options.dateFilter) {
        const { year, month, day } = options.dateFilter;
        if (year) {
          prefix += `${year}/`;
          if (month) {
            prefix += `${String(month).padStart(2, '0')}/`;
            if (day) {
              prefix += `${String(day).padStart(2, '0')}/`;
            }
          }
        }
      }
      if (options.prefix) {
        prefix += options.prefix;
      }

      const files: PaginatedFileList['files'] = [];
      const maxResults = options.maxResults || 1000;

      const iterator = container.listBlobsFlat({
        prefix: prefix || undefined,
        includeMetadata: true, // Required to get custom metadata
      });

      let count = 0;
      for await (const blob of iterator) {
        if (count >= maxResults) {
          break;
        }

        // Use metadata from listBlobsFlat response directly (no extra getProperties call)
        // listBlobsFlat includes basic metadata in blob.metadata
        files.push({
          name: blob.name.split('/').pop() || blob.name,
          path: blob.name,
          size: blob.properties.contentLength || 0,
          uploadedAt: blob.properties.createdOn?.toISOString() || '',
          metadata: blob.metadata
            ? this.deserializeMetadata(blob.metadata)
            : this.getDefaultMetadata(),
        });

        count++;
      }

      return {
        files,
        total: files.length,
        hasMore: count >= maxResults,
      };
    } catch (error) {
      console.error('Failed to list files:', error);
      throw new Error('Failed to list files');
    }
  }

  /**
   * Copy file to backup location
   */
  async backupFile(
    filename: string,
    sourceDate: Date = new Date()
  ): Promise<string> {
    try {
      const sourcePath = this.getDateBasedPath(filename, sourceDate);
      const sourceBlob = this.containers.raw.getBlockBlobClient(sourcePath);

      // Generate backup filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFilename = filename.replace('.json', `_backup_${timestamp}.json`);
      const backupPath = this.getDateBasedPath(backupFilename, sourceDate);
      const backupBlob = this.containers.backups.getBlockBlobClient(backupPath);

      // Copy blob
      await backupBlob.beginCopyFromURL(sourceBlob.url);

      return backupFilename;
    } catch (error) {
      console.error('Backup failed:', error);
      throw new Error(`Failed to backup file: ${filename}`);
    }
  }

  /**
   * Update file metadata
   */
  async updateMetadata(
    filename: string,
    date: Date = new Date(),
    metadata: Partial<FileMetadata>,
    containerType: 'raw' | 'processed' | 'backups' = 'raw'
  ): Promise<void> {
    try {
      const container = this.containers[containerType];
      const path = this.getDateBasedPath(filename, date);
      const blobClient = container.getBlockBlobClient(path);

      // Get existing metadata
      const properties = await blobClient.getProperties();
      const existingMetadata = properties.metadata
        ? this.deserializeMetadata(properties.metadata)
        : this.getDefaultMetadata();

      // Merge with new metadata
      const updatedMetadata = {
        ...existingMetadata,
        ...metadata,
      };

      // Set updated metadata
      await blobClient.setMetadata(this.serializeMetadata(updatedMetadata));
    } catch (error) {
      console.error('Failed to update metadata:', error);
      throw new Error(`Failed to update metadata for: ${filename}`);
    }
  }

  /**
   * Delete file
   */
  async deleteFile(
    filename: string,
    date: Date = new Date(),
    containerType: 'raw' | 'processed' | 'backups' = 'raw'
  ): Promise<void> {
    try {
      const container = this.containers[containerType];
      const path = this.getDateBasedPath(filename, date);
      const blobClient = container.getBlockBlobClient(path);

      await blobClient.delete();
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw new Error(`Failed to delete file: ${filename}`);
    }
  }

  /**
   * Upload analysis result to Azure Blob Storage
   */
  async uploadAnalysisResult(filename: string, analysisData: object, date: Date = new Date()): Promise<void> {
    const path = this.getDateBasedPath(filename, date);
    const blockBlobClient = this.containers.processed.getBlockBlobClient(path);
    const data = JSON.stringify(analysisData, null, 2);
    await retryBlobOperation(
      () => blockBlobClient.upload(data, data.length, {
        blobHTTPHeaders: { blobContentType: 'application/json' }
      }),
      `Upload analysis result: ${filename}`
    );
  }

  /**
   * Set file metadata for a specific file
   */
  async setFileMetadata(filename: string, metadata: Record<string, string>): Promise<void> {
    const blockBlobClient = this.containers.raw.getBlockBlobClient(filename); // Assuming raw container for general metadata
    await retryBlobOperation(
      () => blockBlobClient.setMetadata(metadata),
      `Set metadata for: ${filename}`
    );
  }

  /**
   * Serialize metadata for Azure Blob Storage
   * Azure metadata values must be strings
   */
  private serializeMetadata(metadata: FileMetadata): Record<string, string> {
    return {
      originalFilename: metadata.originalFilename,
      uploadedAt: metadata.uploadedAt,
      size: String(metadata.size),
      uploaderId: metadata.uploaderId || '',
      status: metadata.status,
      contentType: metadata.contentType,
      processingStartedAt: metadata.processingStartedAt || '',
      processingCompletedAt: metadata.processingCompletedAt || '',
      errorMessage: metadata.errorMessage || '',
      // Call log metadata
      callId: metadata.callId || '',
      agentName: metadata.agentName || '',
      agentId: metadata.agentId || '',
      callDuration: metadata.callDuration || '',
      callTimestamp: metadata.callTimestamp || '',
      callOutcome: metadata.callOutcome || '',
      riskScore: metadata.riskScore || '',
    };
  }

  /**
   * Deserialize metadata from Azure Blob Storage
   */
  private deserializeMetadata(metadata: Record<string, string>): FileMetadata {
    return {
      originalFilename: metadata.originalFilename,
      uploadedAt: metadata.uploadedAt,
      size: parseInt(metadata.size, 10),
      uploaderId: metadata.uploaderId || undefined,
      status: metadata.status as FileMetadata['status'],
      contentType: metadata.contentType,
      processingStartedAt: metadata.processingStartedAt || undefined,
      processingCompletedAt: metadata.processingCompletedAt || undefined,
      errorMessage: metadata.errorMessage || undefined,
      // Call log metadata
      callId: metadata.callId || undefined,
      agentName: metadata.agentName || undefined,
      agentId: metadata.agentId || undefined,
      callDuration: metadata.callDuration || undefined,
      callTimestamp: metadata.callTimestamp || undefined,
      callOutcome: metadata.callOutcome || undefined,
      riskScore: metadata.riskScore || undefined,
    };
  }

  /**
   * Get default metadata
   */
  private getDefaultMetadata(): FileMetadata {
    return {
      originalFilename: 'unknown',
      uploadedAt: new Date().toISOString(),
      size: 0,
      status: 'uploaded',
      contentType: 'application/json',
    };
  }
}

/**
 * Get configured Blob Storage Service instance
 */
export function getBlobStorageService(): BlobStorageService {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is not set');
  }

  const config: BlobStorageConfig = {
    connectionString,
    containers: {
      raw: process.env.AZURE_STORAGE_CONTAINER_RAW || 'call-logs-raw',
      processed: process.env.AZURE_STORAGE_CONTAINER_PROCESSED || 'call-logs-processed',
      backups: process.env.AZURE_STORAGE_CONTAINER_BACKUPS || 'call-logs-backups',
    },
  };

  return new BlobStorageService(config);
}
