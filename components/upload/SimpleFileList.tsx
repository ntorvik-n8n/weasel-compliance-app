'use client';

import React from 'react';
import { useFileManager } from '@/contexts/FileManagerContext';
import { TrashIcon } from '@heroicons/react/24/outline';
import { FileMetadata } from '@/types/fileManagement';

export function SimpleFileList() {
  const { state, actions, selectedFile } = useFileManager();
  const { files, isLoading, error } = state;

  const handleDelete = (e: React.MouseEvent, file: FileMetadata) => {
    e.stopPropagation(); // Prevent triggering file selection
    if (window.confirm(`Are you sure you want to delete ${file.name}?`)) {
      actions.deleteFile(file);
    }
  };

  const handleFileClick = (filename: string) => {
    actions.selectFile(filename);
  };

  if (isLoading) return <p className="p-4 text-sm text-gray-600">Loading files...</p>;
  if (error) return <p className="p-4 text-sm text-red-500">Error: {error}</p>;
  if (files.length === 0) return <p className="p-4 text-sm text-gray-500">No files uploaded yet.</p>;

  return (
    <div>
      <ul className="divide-y divide-gray-200">
        {files.map(file => (
          <li
            key={file.name}
            onClick={() => handleFileClick(file.name)}
            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedFile?.name === file.name ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    file.status === 'analyzed' ? 'bg-green-100 text-green-800' :
                    file.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    file.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {file.status}
                  </span>
                  {file.riskScore !== undefined && (
                    <span className={`text-xs font-semibold ${
                      file.riskScore >= 7 ? 'text-red-600' :
                      file.riskScore >= 4 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      Risk: {file.riskScore}/10
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => handleDelete(e, file)}
                className="ml-2 p-1 text-red-500 hover:bg-red-100 rounded"
                aria-label={`Delete ${file.name}`}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
