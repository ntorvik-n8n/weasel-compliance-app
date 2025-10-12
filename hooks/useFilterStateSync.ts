'use client';

import { useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useFileManager } from '@/contexts/FileManagerContext';

export function useFilterStateSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, actions } = useFileManager();
  const { filters, searchTerm } = state;

  useEffect(() => {
    // On mount, read from URL and update context
    const urlFilters: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      urlFilters[key] = value;
    });
    
    // This is a simplified sync, a more robust solution would handle
    // type conversions (e.g., for dates, numbers)
    if (Object.keys(urlFilters).length > 0) {
        if(urlFilters.searchTerm) {
            actions.setSearchTerm(urlFilters.searchTerm);
        }
        for (const [key, value] of Object.entries(urlFilters)) {
            if (key !== 'searchTerm') {
                actions.setFilter(key, value);
            }
        }
    }
  }, []); // Run only once on mount

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (searchTerm) {
        params.set('searchTerm', searchTerm);
    }
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params.set(key, String(value));
      }
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchTerm, filters, pathname, router]);

  useEffect(() => {
    // On context change, update URL
    const handler = setTimeout(() => {
        updateUrl();
    }, 300); // Debounce URL updates
    
    return () => clearTimeout(handler);
  }, [searchTerm, filters, updateUrl]);
}
