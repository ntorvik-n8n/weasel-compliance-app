/**
 * Utility for making fetch requests with automatic retry logic
 * Handles transient failures like Azure cold starts and network issues
 */

interface FetchWithRetryOptions extends RequestInit {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Fetch with automatic retry on transient failures
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options plus retry configuration
 * @returns Promise resolving to Response
 * 
 * @example
 * const response = await fetchWithRetry('/api/files', {
 *   maxRetries: 3,
 *   timeout: 45000,
 *   onRetry: (attempt) => console.log(`Retry attempt ${attempt}`)
 * });
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 45000,
    onRetry,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Success - return response
      if (response.ok) {
        return response;
      }

      // Client errors (4xx) - don't retry
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Server errors (5xx) - retry if attempts remaining
      if (attempt < maxRetries - 1) {
        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
        onRetry?.(attempt + 1, lastError);
        await delay(retryDelay * (attempt + 1)); // Exponential backoff
        continue;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      const err = error as Error;

      // Don't retry on abort (timeout)
      if (err.name === 'AbortError') {
        throw new Error('Request timed out. The server may be warming up. Please try again.');
      }

      // Network errors - retry if attempts remaining
      if (attempt < maxRetries - 1) {
        lastError = err;
        onRetry?.(attempt + 1, err);
        await delay(retryDelay * (attempt + 1));
        continue;
      }

      // Max retries reached
      throw err;
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError || new Error('Request failed after all retries');
}

/**
 * Helper function to delay execution
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Specialized version for JSON API calls
 * 
 * @example
 * const data = await fetchJSONWithRetry('/api/files');
 * console.log(data.files);
 */
export async function fetchJSONWithRetry<T = any>(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Track API call performance
 */
export function trackAPICall(endpoint: string) {
  const start = performance.now();

  return {
    end: () => {
      const duration = performance.now() - start;
      
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${endpoint}: ${duration.toFixed(0)}ms`);
      }

      // Warn on slow requests
      if (duration > 5000) {
        console.warn(`[API] Slow request: ${endpoint} took ${duration.toFixed(0)}ms`);
      }

      return duration;
    },
  };
}
