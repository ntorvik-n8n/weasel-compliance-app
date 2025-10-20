'use client';

import { useEffect } from 'react';
import { useFileManager } from '@/contexts/FileManagerContext';
import { FileMetadata } from '@/types/fileManagement';

const CACHE_KEY = 'weasel-file-list-cache';
const CACHE_TIMESTAMP_KEY = 'weasel-file-list-cache-timestamp';
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

/**
 * Hook to load the initial file list from the server on mount
 * 
 * Uses localStorage caching with 12-hour TTL for instant loading.
 * Cache is automatically invalidated on file uploads/deletes.
 */
export function useFileListLoader() {
  const { state, actions } = useFileManager();

  useEffect(() => {
    let isMounted = true;

    const loadFiles = async () => {
      try {
        // Check if we have cached data
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        
        if (cachedData && cachedTimestamp) {
          const cacheAge = Date.now() - parseInt(cachedTimestamp, 10);
          
          if (cacheAge < CACHE_TTL) {
            // Cache is fresh - use it immediately
            console.log('[FileListLoader] Using cached file list (age:', Math.round(cacheAge / 1000 / 60), 'minutes)');
            
            try {
              const parsedCache = JSON.parse(cachedData);
              
              // Restore Date objects from cached strings
              const filesWithDates: FileMetadata[] = parsedCache.map((file: any) => ({
                ...file,
                uploadedAt: new Date(file.uploadedAt),
                lastModified: new Date(file.lastModified),
              }));
              
              if (isMounted) {
                actions.setFiles(filesWithDates);
              }
              
              // Still fetch fresh data in background for next time (stale-while-revalidate)
              console.log('[FileListLoader] Refreshing cache in background...');
            } catch (parseError) {
              console.error('[FileListLoader] Failed to parse cached data, fetching fresh:', parseError);
              // Fall through to fetch
            }
          } else {
            console.log('[FileListLoader] Cache expired (age:', Math.round(cacheAge / 1000 / 60 / 60), 'hours), fetching fresh data');
          }
        } else {
          console.log('[FileListLoader] No cache found, fetching from API');
        }

        // Fetch fresh data from API
        const response = await fetch('/api/files');

        if (!response.ok) {
          throw new Error('Failed to load files');
        }

        const data = await response.json();

        if (isMounted && data.success && data.files) {
          // Convert uploadedAt strings to Date objects
          const filesWithDates: FileMetadata[] = data.files.map((file: any) => ({
            ...file,
            id: file.id || file.name,
            uploadedAt: new Date(file.uploadedAt),
            lastModified: file.lastModified ? new Date(file.lastModified) : new Date(file.uploadedAt),
          }));

          // Update cache with fresh data
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(filesWithDates));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
            console.log('[FileListLoader] Cache updated with', filesWithDates.length, 'files');
          } catch (storageError) {
            console.warn('[FileListLoader] Failed to update cache:', storageError);
            // Continue anyway - caching is not critical
          }

          // Set files in the context
          actions.setFiles(filesWithDates);
        }
      } catch (error) {
        console.error('[FileListLoader] Error loading file list:', error);
      }
    };

    loadFiles();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount - actions is stable from context
}

/**
 * Utility function to clear the file list cache
 * Call this when files are uploaded, deleted, or modified
 */
export function clearFileListCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    console.log('[FileListLoader] Cache cleared');
  } catch (error) {
    console.warn('[FileListLoader] Failed to clear cache:', error);
  }
}
