export type FileStatus =
  | 'uploaded'      // Just uploaded, not queued yet
  | 'queued'        // In queue for AI processing
  | 'processing'    // AI analysis in progress
  | 'analyzed'      // Analysis complete
  | 'error'         // Processing failed
  | 'pending-review'; // Analyzed but user hasn't viewed

export interface FileStatusDetail {
  status: FileStatus;
  message?: string;
  progress?: number; // 0-100 for processing state
  startedAt?: string;
  completedAt?: string;
  estimatedTimeRemaining?: number; // seconds
  errorDetails?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

export interface FileMetadata {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  uploadedAt: Date;
  lastModified: Date;
  status: FileStatus;
  statusDetail?: FileStatusDetail;
  collisionHistory?: CollisionResolution[];
  error?: string;
  url?: string;
  // Call log metadata
  callId?: string;
  agentName?: string;
  agentId?: string;
  callDuration?: number;
  callTimestamp?: string;
  riskScore?: number;
}

export interface CollisionResolution {
  timestamp: Date;
  originalName: string;
  resolvedName: string;
  action: CollisionAction;
}

export type CollisionAction = 'rename' | 'replace' | 'skip';

export interface FileListOptions {
  sortBy?: keyof FileMetadata;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: Partial<FileMetadata>;
}

export interface FileUploadOptions {
  onCollision?: (file: File, existingFile: FileMetadata) => Promise<CollisionAction>;
  generateUniqueName?: (file: File, existingFiles: FileMetadata[]) => string;
  batchMode?: boolean;
}

export interface FileManagerContextState {
  files: FileMetadata[];
  searchTerm: string;
  sortBy: keyof FileMetadata;
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;
  totalFiles: number;
  isLoading: boolean;
  error: string | null;
  selectedFile: string | null;
  filters: Partial<FileMetadata>;
}

export interface FileManagerContextActions {
  uploadFiles: (files: File[], options?: FileUploadOptions) => Promise<void>;
  deleteFile: (file: FileMetadata) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSortBy: (field: keyof FileMetadata) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  selectFile: (filename: string | null) => void;
  setFilter: (name: string, value: any) => void;
  clearFilters: () => void;
  updateFileStatuses: (updates: { name: string; status: FileStatus }[]) => void;
}