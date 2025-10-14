import { BlobServiceClient, ContainerClient, BlockBlobClient } from '@azure/storage-blob';
import { retryBlobOperation } from './retryPolicy';

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

  private normalizeMetadataKeys(metadata?: Record<string, string>): Record<string, string> {
    if (!metadata) {
      return {};
    }

    return Object.entries(metadata).reduce<Record<string, string>>((acc, [key, value]) => {
      const normalizedKey = key.toLowerCase();
      acc[normalizedKey] = value ?? '';
      return acc;
    }, {});
  }

  private parseNumber(value?: string): number {
    if (!value) {
      return 0;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

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
   * Get path for file (flat structure - no date partitioning)
   * @param filename The name of the file
   * @returns The filename as-is (flat storage)
   */
  private getFilePath(filename: string): string {
    // Simplified: no date partitioning, just use filename directly
    return filename;
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
      const path = this.getFilePath(filename);
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
    containerType: 'raw' | 'processed' | 'backups' = 'raw'
  ): Promise<boolean> {
    try {
      const container = this.containers[containerType];
      const path = this.getFilePath(filename);
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
    containerType: 'raw' | 'processed' | 'backups' = 'raw'
  ): Promise<FileMetadata | null> {
    try {
      const container = this.containers[containerType];
      const path = this.getFilePath(filename);
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
    containerType: 'raw' | 'processed' | 'backups' = 'raw'
  ): Promise<Buffer> {
    try {
      const container = this.containers[containerType];
      const path = this.getFilePath(filename);
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

        // Skip blobs with slashes (old date-partitioned structure)
        if (blob.name.includes('/')) {
          console.warn(`Skipping old date-partitioned blob: ${blob.name}`);
          continue;
        }

        // Skip blobs that don't have content length (likely deleted/corrupted)
        if (!blob.properties.contentLength || blob.properties.contentLength === 0) {
          console.warn(`Skipping blob with no content: ${blob.name}`);
          continue;
        }

        // Verify blob actually exists by trying to get its properties
        // This is more reliable than exists() which can return stale data
        try {
          const blobClient = container.getBlockBlobClient(blob.name);
          await blobClient.getProperties();
        } catch (err: any) {
          // If we get a 404, the blob doesn't really exist - skip it
          if (err?.statusCode === 404 || err?.code === 'BlobNotFound') {
            console.warn(`Skipping non-existent blob (404): ${blob.name}`);
            continue;
          }
          // For other errors, also skip to be safe
          console.warn(`Error verifying blob, skipping: ${blob.name}`, err?.message);
          continue;
        }

        // Use metadata from listBlobsFlat response directly (no extra getProperties call)
        // listBlobsFlat includes basic metadata in blob.metadata
        // Note: blob.name is already the filename (flat structure, no slashes)
        files.push({
          name: blob.name,
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
    filename: string
  ): Promise<string> {
    try {
      const sourcePath = this.getFilePath(filename);
      const sourceBlob = this.containers.raw.getBlockBlobClient(sourcePath);

      // Generate backup filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFilename = filename.replace('.json', `_backup_${timestamp}.json`);
      const backupPath = this.getFilePath(backupFilename);
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
    metadata: Partial<FileMetadata>,
    containerType: 'raw' | 'processed' | 'backups' = 'raw'
  ): Promise<void> {
    try {
      const container = this.containers[containerType];
      const path = this.getFilePath(filename);
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

      // Set updated metadata with retry logic
      await retryBlobOperation(
        () => blobClient.setMetadata(this.serializeMetadata(updatedMetadata)),
        `Update metadata: ${filename}`
      );
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
    containerType: 'raw' | 'processed' | 'backups' = 'raw'
  ): Promise<void> {
    try {
      const container = this.containers[containerType];
      const path = this.getFilePath(filename);
      const blobClient = container.getBlockBlobClient(path);

      // Check if blob exists first
      const exists = await blobClient.exists();
      if (!exists) {
        console.log(`Blob does not exist, skipping delete: ${path}`);
        return; // Return successfully if blob doesn't exist (idempotent delete)
      }

      await blobClient.delete();
      console.log(`Successfully deleted blob: ${path}`);
    } catch (error: any) {
      // If the blob is not found, treat as success (already deleted)
      if (error?.statusCode === 404 || error?.code === 'BlobNotFound') {
        console.log(`Blob not found during delete (already deleted): ${filename}`);
        return;
      }

      console.error('Failed to delete file:', error);
      throw new Error(`Failed to delete file: ${filename}`);
    }
  }

  /**
   * Upload analysis result to Azure Blob Storage
   */
  async uploadAnalysisResult(filename: string, analysisData: object): Promise<void> {
    const path = this.getFilePath(filename);
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
    const ensureString = (value: string | undefined | null, fallback = ''): string => {
      if (value === undefined || value === null) {
        return fallback;
      }
      return value;
    };

    const ensureNumberString = (value: number | undefined, fallback = '0'): string => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        return String(value);
      }
      return fallback;
    };

    return {
      originalfilename: ensureString(metadata.originalFilename, 'unknown'),
      uploadedat: ensureString(metadata.uploadedAt, new Date().toISOString()),
      size: ensureNumberString(metadata.size, '0'),
      uploaderid: ensureString(metadata.uploaderId),
      status: ensureString(metadata.status ?? 'uploaded', 'uploaded'),
      contenttype: ensureString(metadata.contentType, 'application/json'),
      processingstartedat: ensureString(metadata.processingStartedAt),
      processingcompletedat: ensureString(metadata.processingCompletedAt),
      errormessage: ensureString(metadata.errorMessage),
      callid: ensureString(metadata.callId),
      agentname: ensureString(metadata.agentName),
      agentid: ensureString(metadata.agentId),
      callduration: ensureString(metadata.callDuration),
      calltimestamp: ensureString(metadata.callTimestamp),
      calloutcome: ensureString(metadata.callOutcome),
      riskscore: ensureString(metadata.riskScore),
    };
  }

  /**
   * Deserialize metadata from Azure Blob Storage
   */
  private deserializeMetadata(metadata: Record<string, string>): FileMetadata {
    const normalized = this.normalizeMetadataKeys(metadata);

    return {
      originalFilename: normalized.originalfilename || 'unknown',
      uploadedAt: normalized.uploadedat || new Date().toISOString(),
      size: this.parseNumber(normalized.size),
      uploaderId: normalized.uploaderid || undefined,
      status: (normalized.status as FileMetadata['status']) || 'uploaded',
      contentType: normalized.contenttype || 'application/json',
      processingStartedAt: normalized.processingstartedat || undefined,
      processingCompletedAt: normalized.processingcompletedat || undefined,
      errorMessage: normalized.errormessage || undefined,
      // Call log metadata
      callId: normalized.callid || undefined,
      agentName: normalized.agentname || undefined,
      agentId: normalized.agentid || undefined,
      callDuration: normalized.callduration || undefined,
      callTimestamp: normalized.calltimestamp || undefined,
      callOutcome: normalized.calloutcome || undefined,
      riskScore: normalized.riskscore || undefined,
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
      raw: process.env.AZURE_STORAGE_CONTAINER_RAW || 'raw',
      processed: process.env.AZURE_STORAGE_CONTAINER_PROCESSED || 'processed',
      backups: process.env.AZURE_STORAGE_CONTAINER_BACKUPS || 'backups',
    },
  };

  return new BlobStorageService(config);
}
