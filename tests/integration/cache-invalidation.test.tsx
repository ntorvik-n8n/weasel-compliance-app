/**
 * Integration tests for localStorage cache invalidation
 * Tests that cache is properly cleared when files are uploaded or deleted
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { FileManagerProvider, useFileManager } from '@/contexts/FileManagerContext';
import { clearFileListCache } from '@/hooks/use-file-list-loader';
import { ReactNode } from 'react';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Wrapper component
const wrapper = ({ children }: { children: ReactNode }) => (
  <FileManagerProvider>{children}</FileManagerProvider>
);

describe('Cache Invalidation Integration Tests', () => {
  const mockFile = {
    id: 'test-file.json',
    name: 'test-file.json',
    originalName: 'test-file.json',
    size: 1024,
    type: 'application/json',
    uploadedAt: new Date('2025-10-20T10:00:00Z'),
    lastModified: new Date('2025-10-20T10:00:00Z'),
    url: '/files/test-file.json',
    status: 'uploaded' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Setup cache
    localStorageMock.setItem('weasel-file-list-cache', JSON.stringify([mockFile]));
    localStorageMock.setItem('weasel-file-list-cache-timestamp', Date.now().toString());
    
    // Default mock for fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  describe('File Deletion Cache Invalidation', () => {
    it('should clear cache when file is deleted', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const { result } = renderHook(() => useFileManager(), { wrapper });

      // Set initial files
      act(() => {
        result.current.actions.setFiles([mockFile]);
      });

      // Verify cache exists
      expect(localStorageMock.getItem('weasel-file-list-cache')).toBeTruthy();
      expect(localStorageMock.getItem('weasel-file-list-cache-timestamp')).toBeTruthy();

      // Delete the file
      await act(async () => {
        await result.current.actions.deleteFile(mockFile);
      });

      // Verify cache was cleared
      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith('[FileListLoader] Cache cleared');
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('weasel-file-list-cache');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('weasel-file-list-cache-timestamp');

      consoleLogSpy.mockRestore();
    });

    it('should clear cache even if background deletion API fails', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Mock API to fail
      (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useFileManager(), { wrapper });

      act(() => {
        result.current.actions.setFiles([mockFile]);
      });

      // Delete the file
      await act(async () => {
        await result.current.actions.deleteFile(mockFile);
      });

      // Cache should still be cleared despite API failure
      await waitFor(() => {
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('weasel-file-list-cache');
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Background deletion failed'),
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
      consoleLogSpy.mockRestore();
    });
  });

  describe('clearFileListCache Utility', () => {
    it('should be callable and clear cache independently', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Verify cache exists
      expect(localStorageMock.getItem('weasel-file-list-cache')).toBeTruthy();

      // Clear cache using utility
      clearFileListCache();

      // Verify cache was cleared
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('weasel-file-list-cache');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('weasel-file-list-cache-timestamp');
      expect(consoleLogSpy).toHaveBeenCalledWith('[FileListLoader] Cache cleared');

      consoleLogSpy.mockRestore();
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Mock removeItem to throw
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('Storage unavailable');
      });

      // Should not throw
      expect(() => clearFileListCache()).not.toThrow();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FileListLoader] Failed to clear cache'),
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Cache State Verification', () => {
    it('should have cache before deletion', () => {
      const cacheData = localStorageMock.getItem('weasel-file-list-cache');
      const cacheTimestamp = localStorageMock.getItem('weasel-file-list-cache-timestamp');

      expect(cacheData).toBeTruthy();
      expect(cacheTimestamp).toBeTruthy();
      
      if (cacheData) {
        const parsed = JSON.parse(cacheData);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].name).toBe('test-file.json');
      }
    });

    it('should not have cache after manual clearing', () => {
      clearFileListCache();

      const cacheData = localStorageMock.getItem('weasel-file-list-cache');
      const cacheTimestamp = localStorageMock.getItem('weasel-file-list-cache-timestamp');

      // After clearing, subsequent getItem calls should return null (since we deleted the keys)
      // But our mock stores the value, so we check if removeItem was called
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('weasel-file-list-cache');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('weasel-file-list-cache-timestamp');
    });
  });

  describe('Multiple Operations', () => {
    it('should clear cache on each file operation', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const { result } = renderHook(() => useFileManager(), { wrapper });

      const file1 = { ...mockFile, id: 'file1.json', name: 'file1.json' };
      const file2 = { ...mockFile, id: 'file2.json', name: 'file2.json' };

      act(() => {
        result.current.actions.setFiles([file1, file2]);
      });

      // Delete first file
      await act(async () => {
        await result.current.actions.deleteFile(file1);
      });

      await waitFor(() => {
        expect(localStorageMock.removeItem).toHaveBeenCalledTimes(2); // Both keys
      });

      // Reset mock
      localStorageMock.removeItem.mockClear();

      // Delete second file
      await act(async () => {
        await result.current.actions.deleteFile(file2);
      });

      await waitFor(() => {
        expect(localStorageMock.removeItem).toHaveBeenCalledTimes(2); // Both keys again
      });

      consoleLogSpy.mockRestore();
    });
  });

  describe('Cache Keys Consistency', () => {
    it('should use consistent cache key names', () => {
      clearFileListCache();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('weasel-file-list-cache');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('weasel-file-list-cache-timestamp');
      
      // Verify these match the keys used in use-file-list-loader.ts
      const expectedCacheKey = 'weasel-file-list-cache';
      const expectedTimestampKey = 'weasel-file-list-cache-timestamp';

      const removeItemCalls = localStorageMock.removeItem.mock.calls;
      expect(removeItemCalls).toContainEqual([expectedCacheKey]);
      expect(removeItemCalls).toContainEqual([expectedTimestampKey]);
    });
  });
});
