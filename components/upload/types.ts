export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: 'uploading' | 'success' | 'error' | 'processing';
  error?: string;
}

export interface FileUploadProps {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: Error, file?: File) => void;
  maxSize?: number; // in bytes
  className?: string;
}

export interface FileListProps {
  files: UploadedFile[];
  onRemove?: (fileId: string) => void;
  className?: string;
}

export interface UploadResponse {
  fileId: string;
  status: 'success' | 'error';
  message?: string;
}