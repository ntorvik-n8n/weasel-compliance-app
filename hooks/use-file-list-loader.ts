'use client';

import { useEffect } from 'react';
import { useFileManager } from '@/contexts/FileManagerContext';

/**
 * Hook to load the initial file list from the server on mount
 */
export function useFileListLoader() {
  const { state, actions } = useFileManager();

  useEffect(() => {
    let isMounted = true;

    const loadFiles = async () => {
      // Only load if we don't have files already
      if (state.files.length > 0) {
        return;
      }

      try {
        const response = await fetch('/api/files');

        if (!response.ok) {
          throw new Error('Failed to load files');
        }

        const data = await response.json();

        if (isMounted && data.success && data.files) {
          // Convert uploadedAt strings to Date objects
          const filesWithDates = data.files.map((file: any) => ({
            ...file,
            uploadedAt: new Date(file.uploadedAt),
            lastModified: file.lastModified ? new Date(file.lastModified) : new Date(file.uploadedAt),
          }));

          // Files will be loaded through the normal context flow
          // This hook is deprecated and can be removed
        }
      } catch (error) {
        console.error('Error loading file list:', error);
      }
    };

    loadFiles();

    return () => {
      isMounted = false;
    };
  }, []); // Run only once on mount
}
