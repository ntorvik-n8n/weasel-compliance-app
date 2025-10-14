# Performance Optimization Plan

## Identified Latency Issues

### Current Problems:
1. **Dual API calls per file selection** - Loading transcript and analysis separately
2. **No caching** - Every file selection makes fresh API calls
3. **No pagination** - Loading all files at once from Azure Blob Storage
4. **Sequential processing** - Not using parallel requests where possible
5. **No lazy loading** - Portfolio Analytics calculates all metrics on every render
6. **Cold start delays** - Azure Static Web Apps API routes have cold start latency

## Proposed Solutions

### 🚀 Quick Wins (Immediate Impact)

#### 1. Combine API Calls
**Problem:** Selecting a file makes 2 separate fetch requests  
**Solution:** Create a combined endpoint `/api/files/${filename}/complete`

```typescript
// New endpoint: app/api/files/[filename]/complete/route.ts
export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  const { filename } = params;
  const uploadedAt = request.nextUrl.searchParams.get('uploadedAt');
  
  // Load transcript and analysis in parallel
  const [transcript, analysis] = await Promise.all([
    loadTranscript(filename, uploadedAt),
    loadAnalysis(filename, uploadedAt)
  ]);
  
  return NextResponse.json({ transcript, analysis });
}
```

**Impact:** Reduces 2 round trips to 1 = ~50% faster file loading

#### 2. Implement Browser Caching
**Problem:** Every file click re-fetches data  
**Solution:** Cache file data in FileManagerContext

```typescript
const fileDataCache = new Map<string, { transcript, analysis, timestamp }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Check cache before fetching
const cached = fileDataCache.get(cacheKey);
if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
  return cached;
}
```

**Impact:** Instant loading for recently viewed files

#### 3. Add Response Caching Headers
**Problem:** Browser doesn't cache API responses  
**Solution:** Add Cache-Control headers to API routes

```typescript
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
  }
});
```

**Impact:** Reduces server load and improves perceived performance

### 📊 Medium Priority (Next Sprint)

#### 4. Implement Pagination
**Problem:** Loading all files at once is slow with many files  
**Solution:** Paginate file list, load 20 at a time

```typescript
// API: /api/files?page=1&limit=20
export async function GET(request: NextRequest) {
  const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
  
  const files = await blobService.listFiles({
    containerType: 'raw',
    maxResults: limit,
    continuationToken: getContinuationToken(page)
  });
  
  return NextResponse.json({ files, hasMore: files.length === limit });
}
```

**Impact:** Faster initial load, especially with 100+ files

#### 5. Optimize Portfolio Analytics
**Problem:** Recalculates all metrics on every render  
**Solution:** Memoize expensive calculations

```typescript
const analytics = useMemo(() => ({
  totalCalls: analyzedFiles.length,
  avgRisk: calculateAvgRisk(analyzedFiles),
  trendData: calculateTrendData(analyzedFiles),
  distribution: calculateDistribution(analyzedFiles)
}), [analyzedFiles]);
```

**Impact:** Smoother UI, less CPU usage

#### 6. Add Loading Skeletons
**Problem:** Users see blank screen during loads  
**Solution:** Show skeleton loaders

```typescript
{isLoading ? (
  <FileListSkeleton count={10} />
) : (
  <SimpleFileList files={files} />
)}
```

**Impact:** Better perceived performance

### 🔧 Long-term (Future Phases)

#### 7. Implement Virtual Scrolling
Use `react-window` for large file lists

#### 8. Add Service Worker
Cache static assets and API responses offline

#### 9. Optimize Bundle Size
- Code splitting by route
- Dynamic imports for heavy components
- Remove unused dependencies

#### 10. CDN for Static Assets
Use Azure CDN for faster asset delivery globally

## Implementation Priority

### Phase 1: Emergency Fixes (Today)
- [ ] Combine transcript + analysis API calls
- [ ] Add browser-side caching in FileManagerContext
- [ ] Add Cache-Control headers to API routes

### Phase 2: User Experience (This Week)
- [ ] Loading skeletons everywhere
- [ ] Memoize Portfolio Analytics calculations
- [ ] Error boundaries for graceful failures

### Phase 3: Scalability (Next Week)
- [ ] Pagination for file list
- [ ] Virtual scrolling
- [ ] Bundle size optimization

## Monitoring

Add performance metrics:
```typescript
// Track API call duration
const start = performance.now();
const data = await fetch('/api/files');
console.log(`Files loaded in ${performance.now() - start}ms`);
```

## Expected Results

| Optimization | Current | Target | Improvement |
|-------------|---------|--------|-------------|
| File selection | ~1.5s | ~0.5s | 66% faster |
| Initial load | ~3s | ~1s | 66% faster |
| Re-visiting file | ~1.5s | instant | 100% |
| Portfolio Analytics | ~500ms | ~100ms | 80% |

## Azure-Specific Optimizations

### Static Web Apps Configuration
```json
{
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html",
      "statusCode": 200
    }
  },
  "platform": {
    "apiRuntime": "node:20"
  },
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

### Environment Variables
Add to GitHub Actions:
- `NEXT_PUBLIC_API_CACHE_TTL=300000`
- `NEXT_PUBLIC_ENABLE_FILE_CACHE=true`

## Rollout Plan

1. **Test locally** with Chrome DevTools Network throttling
2. **Deploy to staging** (create staging environment)
3. **Monitor metrics** for 24 hours
4. **Deploy to production** if metrics improve
5. **Rollback plan** - revert Git commit if issues

---

## Implementation Notes

### Combined Endpoint Attempt (2025-10-14)
**Status:** ❌ Removed (Build 14)

Initial implementation of `/api/files/[filename]/complete/route.ts` was created but removed due to:
- Used non-existent `downloadFileContent` method on `BlobStorageService`
- Actual method is `downloadFile()` which returns `Buffer`, not parsed JSON
- Requires refactoring `BlobStorageService` to add new method or change approach

**Action Required Before Re-implementing:**
1. Add `downloadFileContent()` method to `BlobStorageService` that returns parsed JSON
2. OR update combined endpoint to handle Buffer → JSON parsing
3. Test with Next.js 15 async params pattern
4. Verify error handling for missing/corrupt files

**Code Reference:** See commit `08f3cfb` (later removed in `cf10109`)

---
**Created:** October 14, 2025  
**Status:** 🟡 Planning  
**Owner:** Development Team
