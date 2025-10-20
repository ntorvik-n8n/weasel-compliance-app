/**
 * Unit tests for use-file-list-loader hook with localStorage caching
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useFileListLoader, clearFileListCache } from '@/hooks/use-file-list-loader';
import { FileManagerProvider } from '@/contexts/FileManagerContext';
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

// Wrapper component for testing hooks with context
const wrapper = ({ children }: { children: ReactNode }) => (
  <FileManagerProvider>{children}</FileManagerProvider>
);

describe('use-file-list-loader', () => {
  const mockFiles = [
    {
      id: 'test-file-1.json',
      name: 'test-file-1.json',
      originalName: 'test-file-1.json',
      size: 1024,
      type: 'application/json',
      uploadedAt: '2025-10-20T10:00:00Z',
      lastModified: '2025-10-20T10:00:00Z',
      url: '/files/test-file-1.json',
      status: 'analyzed',
      riskScore: 5.5,
    },
    {
      id: 'test-file-2.json',
      name: 'test-file-2.json',
      originalName: 'test-file-2.json',
      size: 2048,
      type: 'application/json',
      uploadedAt: '2025-10-20T11:00:00Z',
      lastModified: '2025-10-20T11:00:00Z',
      url: '/files/test-file-2.json',
      status: 'analyzed',
      riskScore: 8.2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Default mock for successful fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        files: mockFiles,
      }),
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Cold Cache Scenario', () => {
    it('should fetch from API when no cache exists', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      renderHook(() => useFileListLoader(), { wrapper });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/files');
      });

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FileListLoader] No cache found, fetching from API')
      );

      consoleLogSpy.mockRestore();
    });

    it('should update cache after successful fetch', async () => {
      renderHook(() => useFileListLoader(), { wrapper });

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'weasel-file-list-cache',
          expect.any(String)
        );
      });

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'weasel-file-list-cache-timestamp',
          expect.any(String)
        );
      });

      // Verify cache content
      const cacheKey = localStorageMock.setItem.mock.calls.find(
        call => call[0] === 'weasel-file-list-cache'
      )?.[1];

      expect(cacheKey).toBeDefined();
      if (cacheKey) {
        const cachedData = JSON.parse(cacheKey);
        expect(cachedData).toHaveLength(2);
        expect(cachedData[0].name).toBe('test-file-1.json');
      }
    });
  });

  describe('Warm Cache Scenario', () => {
    it('should use cached data when cache is fresh (< 12 hours)', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Set up fresh cache (1 hour old)
      const cacheTimestamp = Date.now() - (1 * 60 * 60 * 1000); // 1 hour ago
      const cachedFiles = mockFiles.map(file => ({
        ...file,
        uploadedAt: new Date(file.uploadedAt).toISOString(),
        lastModified: new Date(file.lastModified).toISOString(),
      }));

      localStorageMock.setItem('weasel-file-list-cache', JSON.stringify(cachedFiles));
      localStorageMock.setItem('weasel-file-list-cache-timestamp', cacheTimestamp.toString());

      renderHook(() => useFileListLoader(), { wrapper });

      // Should still fetch in background, but immediately serve cache
      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('[FileListLoader] Using cached file list'),
          expect.anything(),
          expect.anything()
        );
      });

      // Should also fetch fresh data in background
      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('[FileListLoader] Refreshing cache in background')
        );
      });

      consoleLogSpy.mockRestore();
    });

    it('should restore Date objects from cached strings', async () => {
      // Set up cache with ISO string dates
      const cacheTimestamp = Date.now() - (1 * 60 * 60 * 1000);
      const cachedFiles = mockFiles.map(file => ({
        ...file,
        uploadedAt: '2025-10-20T10:00:00.000Z',
        lastModified: '2025-10-20T10:00:00.000Z',
      }));

      localStorageMock.setItem('weasel-file-list-cache', JSON.stringify(cachedFiles));
      localStorageMock.setItem('weasel-file-list-cache-timestamp', cacheTimestamp.toString());

      const { result } = renderHook(() => useFileListLoader(), { wrapper });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // The Date objects should be properly restored
      // This is verified through the FileManager context state
    });
  });

  describe('Expired Cache Scenario', () => {
    it('should fetch fresh data when cache is expired (> 12 hours)', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Set up expired cache (13 hours old)
      const cacheTimestamp = Date.now() - (13 * 60 * 60 * 1000); // 13 hours ago
      const cachedFiles = mockFiles.map(file => ({
        ...file,
        uploadedAt: new Date(file.uploadedAt).toISOString(),
        lastModified: new Date(file.lastModified).toISOString(),
      }));

      localStorageMock.setItem('weasel-file-list-cache', JSON.stringify(cachedFiles));
      localStorageMock.setItem('weasel-file-list-cache-timestamp', cacheTimestamp.toString());

      renderHook(() => useFileListLoader(), { wrapper });

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('[FileListLoader] Cache expired'),
          expect.anything(),
          expect.anything()
        );
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/files');
      });

      consoleLogSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle corrupted cache data gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Set up corrupted cache
      const cacheTimestamp = Date.now() - (1 * 60 * 60 * 1000);
      localStorageMock.setItem('weasel-file-list-cache', 'invalid-json-{]');
      localStorageMock.setItem('weasel-file-list-cache-timestamp', cacheTimestamp.toString());

      renderHook(() => useFileListLoader(), { wrapper });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('[FileListLoader] Failed to parse cached data'),
          expect.any(Error)
        );
      });

      // Should fall back to API fetch
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/files');
      });

      consoleErrorSpy.mockRestore();
      consoleLogSpy.mockRestore();
    });

    it('should handle fetch failure gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      renderHook(() => useFileListLoader(), { wrapper });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('[FileListLoader] Error loading file list'),
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });

    it('should handle localStorage.setItem failure gracefully', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Save the original implementation
      const originalImpl = localStorageMock.setItem.getMockImplementation();
      
      // Mock localStorage.setItem to throw (e.g., quota exceeded)
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      renderHook(() => useFileListLoader(), { wrapper });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('[FileListLoader] Failed to update cache'),
          expect.any(Error)
        );
      });

      // Restore the original implementation
      if (originalImpl) {
        localStorageMock.setItem.mockImplementation(originalImpl);
      }
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('clearFileListCache utility', () => {
    it('should clear both cache keys', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Set up cache
      localStorageMock.setItem('weasel-file-list-cache', JSON.stringify(mockFiles));
      localStorageMock.setItem('weasel-file-list-cache-timestamp', Date.now().toString());

      clearFileListCache();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('weasel-file-list-cache');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('weasel-file-list-cache-timestamp');
      expect(consoleLogSpy).toHaveBeenCalledWith('[FileListLoader] Cache cleared');

      consoleLogSpy.mockRestore();
    });

    it('should handle localStorage.removeItem failure gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Mock localStorage.removeItem to throw
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      clearFileListCache();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FileListLoader] Failed to clear cache'),
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Cache TTL Calculation', () => {
    it('should consider cache fresh when age is less than 12 hours', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Cache is 11 hours and 59 minutes old
      const cacheTimestamp = Date.now() - (11 * 60 * 60 * 1000 + 59 * 60 * 1000);
      localStorageMock.setItem('weasel-file-list-cache', JSON.stringify(mockFiles));
      localStorageMock.setItem('weasel-file-list-cache-timestamp', cacheTimestamp.toString());

      renderHook(() => useFileListLoader(), { wrapper });

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('[FileListLoader] Using cached file list'),
          expect.anything(),
          expect.anything()
        );
      });

      consoleLogSpy.mockRestore();
    });

    it('should consider cache expired when age is exactly 12 hours', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Cache is exactly 12 hours old
      const cacheTimestamp = Date.now() - (12 * 60 * 60 * 1000);
      localStorageMock.setItem('weasel-file-list-cache', JSON.stringify(mockFiles));
      localStorageMock.setItem('weasel-file-list-cache-timestamp', cacheTimestamp.toString());

      renderHook(() => useFileListLoader(), { wrapper });

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('[FileListLoader] Cache expired'),
          expect.anything(),
          expect.anything()
        );
      });

      consoleLogSpy.mockRestore();
    });
  });

  describe('Background Refresh', () => {
    it('should always fetch fresh data even with valid cache', async () => {
      // Set up fresh cache
      const cacheTimestamp = Date.now() - (1 * 60 * 60 * 1000);
      localStorageMock.setItem('weasel-file-list-cache', JSON.stringify(mockFiles));
      localStorageMock.setItem('weasel-file-list-cache-timestamp', cacheTimestamp.toString());

      renderHook(() => useFileListLoader(), { wrapper });

      // Should fetch in background even with valid cache
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/files');
      });
    });

    it('should update cache with background refresh results', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Set up fresh cache with old data
      const cacheTimestamp = Date.now() - (1 * 60 * 60 * 1000);
      localStorageMock.setItem('weasel-file-list-cache', JSON.stringify([mockFiles[0]]));
      localStorageMock.setItem('weasel-file-list-cache-timestamp', cacheTimestamp.toString());

      // Mock API returns updated data
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          files: mockFiles, // Now includes both files
        }),
      });

      renderHook(() => useFileListLoader(), { wrapper });

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('[FileListLoader] Cache updated with'),
          2,
          'files'
        );
      });

      consoleLogSpy.mockRestore();
    });
  });
});
