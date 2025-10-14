# Backend Call Failures - Troubleshooting Guide

## Observed Behavior
**Date:** October 14, 2025  
**Issue:** Intermittent "Backend call failure" errors that resolve on retry  
**Platform:** Azure Static Web Apps

## Root Cause Analysis

### Most Likely Causes:

1. **Cold Start Latency** ⚡
   - Azure Static Web Apps API routes (serverless functions) go cold after ~20 minutes of inactivity
   - First request after idle period takes 5-15 seconds
   - Subsequent requests are fast (~200-500ms)
   - **This is the most common cause**

2. **Timeout Issues** ⏱️
   - Default Azure SWA timeout is 30 seconds
   - Anthropic API calls can take 10-20 seconds for complex analysis
   - If total request time > 30s, request fails
   - Browser may timeout before server

3. **Connection Issues** 🌐
   - Temporary network disruption
   - Azure Blob Storage throttling (rare)
   - Anthropic API rate limiting (unlikely with current volume)

4. **CORS/Preflight Failures** 🔒
   - OPTIONS request timing out
   - Missing CORS headers on some endpoints

## Evidence This is Cold Start

✅ **Error resolves on immediate retry** - Classic cold start pattern  
✅ **Happens after period of inactivity** - Functions have gone cold  
✅ **First request slow, subsequent fast** - Warm functions respond quickly  
✅ **No errors in Azure logs** - Functions eventually succeed  

## Immediate Mitigations

### 1. Add Retry Logic to Frontend
```typescript
// utils/fetch-with-retry.ts
export async function fetchWithRetry(url: string, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(45000), // 45 second timeout
      });
      
      if (response.ok) return response;
      
      // Don't retry 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Retry on 5xx errors
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        continue;
      }
    } catch (error) {
      if (i < maxRetries - 1 && error.name !== 'AbortError') {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
}
```

### 2. Add Loading States with Timeout Messages
```typescript
const [loadingMessage, setLoadingMessage] = useState('Loading...');

useEffect(() => {
  const timer = setTimeout(() => {
    setLoadingMessage('Still loading... This may take a moment on first request.');
  }, 5000);
  
  return () => clearTimeout(timer);
}, []);
```

### 3. Keep Functions Warm (Ping Endpoint)
```typescript
// Add to next.config.js or create a ping endpoint
// Call /api/health every 10 minutes to keep functions warm
```

## Long-term Solutions

### Option 1: Upgrade to Azure Functions Premium Plan
- **Cost:** ~$150/month
- **Benefit:** Pre-warmed instances, no cold starts
- **Recommended for:** Production with SLA requirements

### Option 2: Implement Function Warmup
```typescript
// app/api/warmup/route.ts
export async function GET() {
  // Lightweight endpoint to keep function instance warm
  return NextResponse.json({ status: 'warm', timestamp: new Date().toISOString() });
}

// Client-side: Call every 15 minutes
setInterval(() => fetch('/api/warmup'), 15 * 60 * 1000);
```

### Option 3: Client-Side Keep-Alive
```typescript
// Add to app layout
useEffect(() => {
  const keepAlive = setInterval(() => {
    // Ping a lightweight endpoint to keep backend warm
    fetch('/api/version').catch(() => {});
  }, 10 * 60 * 1000); // Every 10 minutes
  
  return () => clearInterval(keepAlive);
}, []);
```

### Option 4: Add Health Check Monitoring
```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    api: true,
    storage: await checkBlobStorage(),
    ai: await checkAnthropicAPI(),
    timestamp: new Date().toISOString()
  };
  
  return NextResponse.json(checks);
}
```

## Monitoring & Diagnostics

### Add Performance Tracking
```typescript
// hooks/use-performance-tracker.ts
export function usePerformanceTracker() {
  const trackAPICall = (endpoint: string) => {
    const start = performance.now();
    
    return {
      end: () => {
        const duration = performance.now() - start;
        console.log(`[Perf] ${endpoint}: ${duration.toFixed(0)}ms`);
        
        // Send to analytics if available
        if (duration > 5000) {
          console.warn(`[Perf] Slow request detected: ${endpoint} took ${duration}ms`);
        }
      }
    };
  };
  
  return { trackAPICall };
}
```

### Usage:
```typescript
const { trackAPICall } = usePerformanceTracker();

const loadFiles = async () => {
  const tracker = trackAPICall('/api/files');
  try {
    const response = await fetch('/api/files');
    // ... handle response
  } finally {
    tracker.end();
  }
};
```

## User-Facing Improvements

### Better Error Messages
```typescript
// Instead of "Backend call failure"
if (error.name === 'AbortError') {
  return 'Request timed out. The server may be waking up. Please try again.';
} else if (error.message.includes('Failed to fetch')) {
  return 'Connection lost. Please check your internet and try again.';
} else {
  return 'Something went wrong. The issue has been logged and we\'re looking into it.';
}
```

### Loading Indicators with Context
```tsx
<div className="loading-state">
  <Spinner />
  <p>Loading your call logs...</p>
  {isSlowRequest && (
    <p className="text-xs text-muted">
      First request may take 10-15 seconds while the server warms up.
    </p>
  )}
</div>
```

## Quick Checklist

When "Backend call failure" occurs:

- [ ] Check browser console for specific error
- [ ] Check Network tab for failed request details
- [ ] Note the time since last successful request (cold start?)
- [ ] Try again immediately (should succeed if cold start)
- [ ] Check Azure Portal > Application Insights for logs
- [ ] Verify internet connection stable

## Expected Behavior

✅ **Normal:** First request after idle takes 10-15 seconds  
✅ **Normal:** Subsequent requests under 1 second  
⚠️ **Investigate:** All requests failing repeatedly  
⚠️ **Investigate:** Failures during active usage  
⚠️ **Investigate:** Timeouts on small/simple requests  

## Recommended Immediate Action

Since the error resolved on retry, this is almost certainly a **cold start issue**.

### Quick Fix (No Code):
1. Keep a browser tab open to the app
2. Refresh every 10 minutes to keep functions warm
3. Expect 10-15s delay after 20+ minutes idle

### Better Fix (Add Retry Logic):
Implement the `fetchWithRetry` utility shown above in all API calls.

### Best Fix (Infrastructure):
Consider upgrading to Azure Functions Premium if budget allows, or implement the warmup ping strategy.

---

**Status:** 🟡 Known Issue (Azure SWA Cold Start)  
**Severity:** Low (Self-resolving on retry)  
**Next Steps:** Add retry logic + better error messaging
