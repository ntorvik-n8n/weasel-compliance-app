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

  if (isLoading) return <p className="p-4 text-sm text-dark-text-secondary">Loading files...</p>;
  if (error) return <p className="p-4 text-sm text-risk-critical">Error: {error}</p>;
  if (files.length === 0) return <p className="p-4 text-sm text-dark-text-muted">No files uploaded yet.</p>;

  return (
    <div>
      <ul className="divide-y divide-dark-border">
        {files.map(file => (
          <li
            key={file.name}
            onClick={() => handleFileClick(file.name)}
            className={`px-4 py-3 hover:bg-dark-elevated cursor-pointer transition-all ${
              selectedFile?.name === file.name ? 'bg-dark-elevated border-l-4 border-l-badge-pressure' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-text-primary truncate flex items-center gap-2">
                  <svg className="w-4 h-4 text-dark-text-muted" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  {file.name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    file.status === 'analyzed' ? 'bg-compliance-pass/20 text-compliance-pass border border-compliance-pass/30' :
                    file.status === 'processing' ? 'bg-compliance-warning/20 text-compliance-warning border border-compliance-warning/30' :
                    file.status === 'error' ? 'bg-compliance-violation/20 text-compliance-violation border border-compliance-violation/30' :
                    'bg-dark-text-muted/20 text-dark-text-muted border border-dark-text-muted/30'
                  }`}>
                    {file.status}
                  </span>
                  {file.riskScore !== undefined && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      file.riskScore >= 7 ? 'bg-risk-critical/20 text-risk-critical' :
                      file.riskScore >= 5 ? 'bg-risk-high/20 text-risk-high' :
                      file.riskScore >= 3 ? 'bg-risk-medium/20 text-risk-medium' :
                      'bg-risk-low/20 text-risk-low'
                    }`}>
                      {file.riskScore}/10
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => handleDelete(e, file)}
                className="ml-2 p-1.5 text-risk-critical hover:bg-risk-critical/10 rounded transition-colors"
                aria-label={`Delete ${file.name}`}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
