'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFileManager } from '@/contexts/FileManagerContext';
import type { FileMetadata } from '@/types/fileManagement';
import { formatFileSize } from '@/lib/fileManagement';
import { formatDuration } from '@/lib/callLogParsing';
import { StatusBadge } from '../../StatusBadge';
import { RiskIndicator } from '../ui/RiskIndicator'; // New import
import { TrashIcon } from '@heroicons/react/24/outline';


interface Column {
  key: keyof FileMetadata | 'actions';
  header: string;
  render?: (value: any, file: FileMetadata) => React.ReactNode;
  sortable?: boolean;
}

const columns: Column[] = [
  { key: 'name', header: 'Filename', sortable: true },
  { key: 'callId', header: 'Call ID', sortable: true },
  { key: 'agentName', header: 'Agent', sortable: true },
  {
    key: 'riskScore',
    header: 'Risk Level',
    render: (score) => <RiskIndicator score={score} />,
    sortable: true,
  },
  {
    key: 'callDuration',
    header: 'Duration',
    render: (duration) => formatDuration(duration),
    sortable: true,
  },
  {
    key: 'size',
    header: 'Size',
    render: (size) => formatFileSize(size),
    sortable: true,
  },
  {
    key: 'uploadedAt',
    header: 'Uploaded',
    render: (date) => new Date(date).toLocaleString(),
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    render: (status) => <StatusBadge status={status} />,
    sortable: true,
  },
  { key: 'actions', header: 'Actions' },
];

export function EnhancedFileList() {
  const router = useRouter();
  const { state, actions } = useFileManager();
  const {
    files,
    sortBy,
    sortDirection,
    page,
    totalFiles,
    isLoading,
    error,
    selectedFile,
  } = state;
  const pageSize = 25; // Increased page size

  const [focusedIndex, setFocusedIndex] = useState(-1);

  const sortedFiles = useMemo(() => {
    // Sorting logic remains the same
    return [...files].sort((a, b) => {
        const aValue = a[sortBy] ?? '';
        const bValue = b[sortBy] ?? '';
  
        if (aValue === bValue) return 0;
  
        const modifier = sortDirection === 'asc' ? 1 : -1;
        return aValue > bValue ? modifier : -modifier;
      });
  }, [files, sortBy, sortDirection]);

  const paginatedFiles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedFiles.slice(start, start + pageSize);
  }, [sortedFiles, page, pageSize]);

  const handleRowClick = useCallback((filename: string) => {
    actions.selectFile(filename);
    router.push(`/calls/${encodeURIComponent(filename)}`);
  }, [actions, router]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (paginatedFiles.length === 0) return;

      let nextIndex = focusedIndex;
      if (event.key === 'ArrowDown') {
        nextIndex = (focusedIndex + 1) % paginatedFiles.length;
        event.preventDefault();
      } else if (event.key === 'ArrowUp') {
        nextIndex = (focusedIndex - 1 + paginatedFiles.length) % paginatedFiles.length;
        event.preventDefault();
      } else if (event.key === 'Enter' && focusedIndex >= 0) {
        handleRowClick(paginatedFiles[focusedIndex].name);
      }
      setFocusedIndex(nextIndex);
    },
    [focusedIndex, paginatedFiles, handleRowClick]
  );
  
  const totalPages = Math.ceil(totalFiles / pageSize);

  useEffect(() => {
    // Reset focus when page changes
    setFocusedIndex(-1);
  }, [page]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (files.length === 0) {
    return <div>No files found.</div>;
  }

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200" role="grid">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-gray-700' : ''
                  }`}
                  onClick={() => column.sortable && actions.setSortBy(column.key as keyof FileMetadata)}
                >
                  <span className="inline-flex items-center">
                    {column.header}
                    {sortBy === column.key && (
                      <span className="ml-2">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={columns.length} className="text-center p-4">Loading...</td></tr>
            ) : paginatedFiles.length > 0 ? (
              paginatedFiles.map((file, index) => (
                <tr
                  key={file.name}
                  onClick={() => handleRowClick(file.name)}
                  className={`cursor-pointer ${selectedFile === file.name ? 'bg-blue-100' : 'hover:bg-gray-50'} ${focusedIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                  aria-selected={selectedFile === file.name}
                  role="row"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.key === 'actions' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            if (window.confirm(`Are you sure you want to delete ${file.name}?`)) {
                              actions.deleteFile(file);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                          aria-label={`Delete ${file.name}`}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      ) : column.render
                        ? column.render(file[column.key as keyof FileMetadata], file)
                        : String(file[column.key as keyof FileMetadata] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr><td colSpan={columns.length} className="text-center p-4">No files found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination component would be updated to handle pageSize=25 */}
    </div>
  );
}