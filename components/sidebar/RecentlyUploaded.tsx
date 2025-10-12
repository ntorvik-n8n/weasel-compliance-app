'use client';

import { useMemo, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useFileManager } from '@/contexts/FileManagerContext';
import { RecentFileItem } from './RecentFileItem';

export function RecentlyUploaded() {
  const { state } = useFileManager();
  const [isExpanded, setIsExpanded] = useState(true);

  const recentFiles = useMemo(() => {
    return [...state.files]
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, 5);
  }, [state.files]);

  if (recentFiles.length === 0) {
    return null;
  }

  return (
    <div className="pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-sm font-semibold text-gray-900">Recently Uploaded</h3>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-500 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isExpanded && (
        <ul className="mt-2 divide-y divide-gray-200">
          {recentFiles.map(file => (
            <RecentFileItem key={file.name} file={file} />
          ))}
        </ul>
      )}
    </div>
  );
}
