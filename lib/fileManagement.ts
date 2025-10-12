import type { FileMetadata, FileStatus } from '@/types/fileManagement';

export function generateUniqueFileName(
  originalName: string,
  existingFiles: FileMetadata[],
  strategy: 'timestamp' | 'increment' = 'timestamp'
): string {
  const extension = originalName.split('.').pop() || '';
  const nameWithoutExt = originalName.replace(`.${extension}`, '');

  if (!existingFiles.some(f => f.name === originalName)) {
    return originalName;
  }

  if (strategy === 'timestamp') {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/[T.]/g, '_')
      .slice(0, 15);
    return `${nameWithoutExt}_${timestamp}.${extension}`;
  }

  let counter = 1;
  let newName = '';
  do {
    const suffix = counter.toString().padStart(3, '0');
    newName = `${nameWithoutExt}_${suffix}.${extension}`;
    counter++;
  } while (existingFiles.some(f => f.name === newName));

  return newName;
}

export function checkFileCollision(
  fileName: string,
  existingFiles: FileMetadata[]
): FileMetadata | null {
  return existingFiles.find(f => f.name === fileName) || null;
}

export function sanitizeFileName(fileName: string): string {
  // Remove invalid characters and spaces
  let sanitized = fileName
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\s+/g, '_');
  
  // Ensure the filename isn't too long (max 255 characters including extension)
  const extension = sanitized.split('.').pop() || '';
  const nameWithoutExt = sanitized.replace(`.${extension}`, '');
  if (sanitized.length > 255) {
    sanitized = `${nameWithoutExt.slice(0, 251 - extension.length)}.${extension}`;
  }
  
  return sanitized;
}

export function parseFileExtension(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return extension;
}

export function validateFileType(fileName: string, allowedTypes: string[] = ['json']): boolean {
  const extension = parseFileExtension(fileName);
  return allowedTypes.includes(extension);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function sortFiles(
  files: FileMetadata[],
  sortBy: keyof FileMetadata,
  direction: 'asc' | 'desc'
): FileMetadata[] {
  return [...files].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    // Handle undefined values
    if (aVal === undefined && bVal === undefined) return 0;
    if (aVal === undefined) return direction === 'asc' ? 1 : -1;
    if (bVal === undefined) return direction === 'asc' ? -1 : 1;

    const comparison = typeof aVal === 'string' 
      ? (aVal as string).localeCompare(bVal as string)
      : typeof aVal === 'number'
        ? (aVal as number) - (bVal as number)
        : aVal instanceof Date
          ? (aVal as Date).getTime() - (bVal as Date).getTime()
          : String(aVal).localeCompare(String(bVal));
    
    return direction === 'asc' ? comparison : -comparison;
  });
}

export interface FilterState {
  searchTerm?: string;
  status?: FileStatus | 'all';
  dateRange?: { start?: Date | null; end?: Date | null };
  agentName?: string | 'all';
  riskLevel?: 'low' | 'medium' | 'high' | 'critical' | 'all';
  durationRange?: { min?: number; max?: number };
}

export function applyFilters(
  files: FileMetadata[],
  filters: FilterState
): FileMetadata[] {
  return files.filter(file => {
    // Search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const matchesFilename = file.name.toLowerCase().includes(term);
      const matchesCallId = file.callId?.toLowerCase().includes(term) || false;
      const matchesAgent = file.agentName?.toLowerCase().includes(term) || false;
      if (!matchesFilename && !matchesCallId && !matchesAgent) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== 'all' && file.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
        const uploadDate = new Date(file.uploadedAt);
        if (filters.dateRange.start && uploadDate < filters.dateRange.start) {
          return false;
        }
        if (filters.dateRange.end && uploadDate > filters.dateRange.end) {
          return false;
        }
    }

    // Agent filter
    if (filters.agentName && filters.agentName !== 'all' && file.agentName !== filters.agentName) {
      return false;
    }
    
    // Duration filter
    if (filters.durationRange) {
        const duration = file.callDuration ?? 0;
        if (filters.durationRange.min && duration < filters.durationRange.min) {
            return false;
        }
        if (filters.durationRange.max && duration > filters.durationRange.max) {
            return false;
        }
    }

    // Risk level filter (will work once risk scores are available)
    // For now, this part of the filter will not do anything.

    return true;
  });
}

export function paginateFiles(
  files: FileMetadata[],
  page: number,
  pageSize: number
): {
  files: FileMetadata[];
  totalPages: number;
  totalFiles: number;
} {
  const start = (page - 1) * pageSize;
  const paginatedFiles = files.slice(start, start + pageSize);
  
  return {
    files: paginatedFiles,
    totalPages: Math.ceil(files.length / pageSize),
    totalFiles: files.length
  };
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}