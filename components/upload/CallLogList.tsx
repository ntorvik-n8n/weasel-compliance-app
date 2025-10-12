'use client';

import { useMemo } from 'react';
import { formatFileSize } from '@/lib/fileManagement';
import { formatDuration, formatCallId, formatAgentName } from '@/lib/callLogParsing';
import type { FileMetadata } from '@/lib/azure/blobStorageClient';

interface CallLogListProps {
  files: Array<{
    name: string;
    path: string;
    size: number;
    uploadedAt: string;
    metadata: FileMetadata;
  }>;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

interface Column {
  key: string;
  header: string;
  render: (file: any) => React.ReactNode;
  sortable: boolean;
  width?: string;
}

export function CallLogList({
  files,
  sortBy,
  sortDirection,
  onSort,
  isLoading = false,
  error = null,
}: CallLogListProps) {
  const columns: Column[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Filename',
        render: (file) => (
          <div className="font-medium text-gray-900 truncate max-w-xs" title={file.name}>
            {file.name}
          </div>
        ),
        sortable: true,
        width: 'w-1/5',
      },
      {
        key: 'callId',
        header: 'Call ID',
        render: (file) => (
          <div className="text-sm text-gray-700">
            {file.metadata?.callId ? (
              <span className="font-mono">{formatCallId(file.metadata.callId)}</span>
            ) : (
              <span className="text-gray-400 italic">N/A</span>
            )}
          </div>
        ),
        sortable: true,
        width: 'w-1/6',
      },
      {
        key: 'agentName',
        header: 'Agent',
        render: (file) => (
          <div className="text-sm text-gray-700">
            {file.metadata?.agentName ? (
              formatAgentName(file.metadata.agentName)
            ) : (
              <span className="text-gray-400 italic">N/A</span>
            )}
          </div>
        ),
        sortable: true,
        width: 'w-1/6',
      },
      {
        key: 'callDuration',
        header: 'Duration',
        render: (file) => (
          <div className="text-sm text-gray-700 font-mono">
            {file.metadata?.callDuration ? (
              formatDuration(parseInt(file.metadata.callDuration, 10))
            ) : (
              <span className="text-gray-400 italic">N/A</span>
            )}
          </div>
        ),
        sortable: true,
        width: 'w-24',
      },
      {
        key: 'size',
        header: 'Size',
        render: (file) => (
          <div className="text-sm text-gray-600">{formatFileSize(file.size)}</div>
        ),
        sortable: true,
        width: 'w-24',
      },
      {
        key: 'uploadedAt',
        header: 'Uploaded',
        render: (file) => (
          <div className="text-sm text-gray-600">
            {new Date(file.uploadedAt).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        ),
        sortable: true,
        width: 'w-40',
      },
      {
        key: 'status',
        header: 'Status',
        render: (file) => {
          const status = file.metadata?.status || 'uploaded';
          const statusColors = {
            uploaded: 'bg-green-100 text-green-800',
            processing: 'bg-blue-100 text-blue-800',
            analyzed: 'bg-purple-100 text-purple-800',
            error: 'bg-red-100 text-red-800',
          };

          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {status}
            </span>
          );
        },
        sortable: true,
        width: 'w-28',
      },
    ],
    []
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Loading call logs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading files</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No call logs</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload JSON call log files to get started.
          </p>
        </div>
      </div>
    );
  }

  // Sort indicator component
  const SortIndicator = ({ field }: { field: string }) => {
    if (sortBy !== field) {
      return (
        <span className="text-gray-400 opacity-0 group-hover:opacity-50 transition-opacity">
          ⇅
        </span>
      );
    }
    return <span className="text-blue-600">{sortDirection === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`${column.width || ''} px-3 py-3.5 text-left text-sm font-semibold text-gray-900`}
              >
                {column.sortable ? (
                  <button
                    onClick={() => onSort(column.key)}
                    className="group inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    {column.header}
                    <SortIndicator field={column.key} />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {files.map((file, idx) => (
            <tr
              key={file.path}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                >
                  {column.render(file)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
