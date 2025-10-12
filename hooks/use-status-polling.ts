'use client';

import { useEffect, useState, useCallback } from 'react';
import { useFileManager } from '@/contexts/FileManagerContext';
import type { FileStatus } from '@/types/fileManagement';

export function useStatusPolling(interval = 5000) {
  const { state, actions } = useFileManager();
  const [isPolling, setIsPolling] = useState(false);

  const poll = useCallback(async () => {
    const processingFiles = state.files
      .filter(f => f.status === 'queued' || f.status === 'processing')
      .map(f => f.name);

    if (processingFiles.length === 0) {
      setIsPolling(false);
      return;
    }

    try {
      const response = await fetch('/api/files/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileNames: processingFiles }),
      });
      if (response.ok) {
        const { updates } = await response.json();
        actions.updateFileStatuses(updates);
      }
    } catch (error) {
      console.error('Status polling error:', error);
    }
  }, [state.files]);

  useEffect(() => {
    const hasProcessingFiles = state.files.some(f => f.status === 'queued' || f.status === 'processing');
    if (hasProcessingFiles && !isPolling) {
      setIsPolling(true);
    } else if (!hasProcessingFiles && isPolling) {
      setIsPolling(false);
    }
  }, [state.files, isPolling]);

  useEffect(() => {
    if (!isPolling) return;

    const timerId = setInterval(poll, interval);
    return () => clearInterval(timerId);
  }, [isPolling, poll, interval]);

  return { isPolling };
}
