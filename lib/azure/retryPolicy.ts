/**
 * Retry Policy for Azure Blob Storage Operations
 * Implements exponential backoff with jitter for resilient cloud operations
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
  totalDuration: number;
}

/**
 * Default retryable error codes and messages from Azure
 */
const DEFAULT_RETRYABLE_ERRORS = [
  'ETIMEDOUT',
  'ECONNRESET',
  'ECONNREFUSED',
  'ENOTFOUND',
  'ServerBusy',
  'InternalError',
  'OperationTimedOut',
  'RequestTimeout',
];

/**
 * Sleep utility with promise
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Add jitter to delay to prevent thundering herd
 */
function addJitter(delay: number): number {
  // Add ±20% jitter
  const jitter = delay * 0.2 * (Math.random() - 0.5) * 2;
  return Math.floor(delay + jitter);
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: any, retryableErrors: string[]): boolean {
  if (!error) return false;

  const errorMessage = error.message || '';
  const errorCode = error.code || '';
  const statusCode = error.statusCode || error.status;

  // Check error code/message against retryable list
  const matchesRetryablePattern = retryableErrors.some(pattern =>
    errorMessage.includes(pattern) || errorCode.includes(pattern)
  );

  // Also retry on 429 (Too Many Requests) and 503 (Service Unavailable)
  const isRetryableStatus = statusCode === 429 || statusCode === 503;

  return matchesRetryablePattern || isRetryableStatus;
}

/**
 * Execute operation with exponential backoff retry logic
 *
 * @param operation - Async function to retry
 * @param options - Retry configuration options
 * @returns RetryResult with success status, data/error, and metadata
 *
 * @example
 * ```typescript
 * const result = await retryWithBackoff(
 *   () => blobClient.upload(data, data.length),
 *   { maxRetries: 3, initialDelayMs: 1000 }
 * );
 *
 * if (result.success) {
 *   console.log('Upload succeeded after', result.attempts, 'attempts');
 * } else {
 *   console.error('Upload failed:', result.error);
 * }
 * ```
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 30000,
    backoffMultiplier = 2,
    retryableErrors = DEFAULT_RETRYABLE_ERRORS,
  } = options;

  const startTime = Date.now();
  let attempts = 0;
  let lastError: Error | undefined;

  while (attempts <= maxRetries) {
    attempts++;

    try {
      const data = await operation();
      return {
        success: true,
        data,
        attempts,
        totalDuration: Date.now() - startTime,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      const shouldRetry =
        attempts <= maxRetries &&
        isRetryableError(error, retryableErrors);

      if (!shouldRetry) {
        // Non-retryable error or max retries exceeded
        return {
          success: false,
          error: lastError,
          attempts,
          totalDuration: Date.now() - startTime,
        };
      }

      // Calculate delay with exponential backoff
      const baseDelay = Math.min(
        initialDelayMs * Math.pow(backoffMultiplier, attempts - 1),
        maxDelayMs
      );
      const delayWithJitter = addJitter(baseDelay);

      console.warn(
        `Retry attempt ${attempts}/${maxRetries} after ${delayWithJitter}ms. Error: ${lastError.message}`
      );

      await sleep(delayWithJitter);
    }
  }

  // Should never reach here, but TypeScript needs it
  return {
    success: false,
    error: lastError || new Error('Unknown error'),
    attempts,
    totalDuration: Date.now() - startTime,
  };
}

/**
 * Retry policy specifically tuned for Azure Blob Storage operations
 */
export async function retryBlobOperation<T>(
  operation: () => Promise<T>,
  operationName: string = 'Blob operation'
): Promise<T> {
  const result = await retryWithBackoff(operation, {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
  });

  if (result.success && result.data !== undefined) {
    if (result.attempts > 1) {
      console.log(
        `${operationName} succeeded after ${result.attempts} attempts (${result.totalDuration}ms)`
      );
    }
    return result.data;
  }

  throw new Error(
    `${operationName} failed after ${result.attempts} attempts: ${result.error?.message}`
  );
}
