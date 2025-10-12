'use client';

import { useRouter } from 'next/navigation';
import type { FileMetadata } from '@/types/fileManagement';
import { useFileManager } from '@/contexts/FileManagerContext';
import { useMemo } from 'react';

export function CallLogHeader({ file }: { file: FileMetadata }) {
  const router = useRouter();
  const { state } = useFileManager();

  const { prevFile, nextFile } = useMemo(() => {
    const currentIndex = state.files.findIndex(f => f.name === file.name);
    if (currentIndex === -1) {
      return { prevFile: null, nextFile: null };
    }
    const prev = currentIndex > 0 ? state.files[currentIndex - 1] : null;
    const next = currentIndex < state.files.length - 1 ? state.files[currentIndex + 1] : null;
    return { prevFile: prev, nextFile: next };
  }, [state.files, file.name]);

  const navigateToFile = (filename: string) => {
    router.push(`/calls/${encodeURIComponent(filename)}`);
  };

  return (
    <div className="p-4 border-b flex justify-between items-center">
      <button onClick={() => router.back()} className="text-blue-600">
        &larr; Back to List
      </button>
      <h2 className="text-lg font-semibold">{file.name}</h2>
      <div className="flex items-center gap-2">
        <button onClick={() => prevFile && navigateToFile(prevFile.name)} disabled={!prevFile} className="p-2 rounded-md disabled:opacity-50">
            &larr; Previous
        </button>
        <button onClick={() => nextFile && navigateToFile(nextFile.name)} disabled={!nextFile} className="p-2 rounded-md disabled:opacity-50">
            Next &rarr;
        </button>
      </div>
    </div>
  );
}
