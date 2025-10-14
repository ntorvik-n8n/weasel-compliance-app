# Azure AI Inference Fix - October 14, 2025

## Problem Summary

**Issue**: Files uploaded through Azure Static Web App and Container App deployments were not being processed by Anthropic AI. Files remained stuck in `uploaded` status and never transitioned to `analyzed`.

**Symptoms**:
- Files uploaded via Azure endpoints remained in "uploaded" status indefinitely
- Metadata never updated with risk scores or processing completion timestamps  
- No AI analysis results generated in the processed container
- Local development environment worked correctly

## Root Cause Analysis

### Initial Investigation
1. ✅ Environment variables (`ANTHROPIC_API_KEY`, `AZURE_STORAGE_CONNECTION_STRING`) were correctly configured in both deployments
2. ✅ Anthropic SDK and API connectivity worked when manually triggering the `/api/process` endpoint
3. ❌ Automatic processing trigger from upload endpoint was failing silently

### The Actual Problem

The upload endpoint (`app/api/upload/route.ts`) was attempting to trigger AI processing by making a server-to-server `fetch()` call to the `/api/process` endpoint:

```typescript
// OLD CODE - CAUSED TIMEOUT
const processResponse = await fetch(processUrl.toString(), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Why this failed in Azure**:
- AI inference takes 5-10 seconds to complete
- Azure Static Web Apps has request timeout limitations
- The upload request would timeout before the AI processing completed
- The processing endpoint's work would be killed when the upload request timed out

## Solution

**Decouple upload from processing** by moving the processing trigger from backend to frontend:

### Backend Change (`app/api/upload/route.ts`)
Removed the server-to-server fetch() call entirely. Upload now completes immediately after storing the file.

### Frontend Change (`contexts/UploadProgressContext.tsx`)
Added processing trigger in the upload success handler:

```typescript
xhr.onload = async () => {
  if (xhr.status >= 200 && xhr.status < 300) {
    updateState(fileId, 'complete');
    
    // Trigger processing asynchronously (fire-and-forget)
    try {
      const responseData = JSON.parse(xhr.responseText);
      const filename = responseData.file?.name || file.name;
      
      fetch(`/api/process/${encodeURIComponent(filename)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(err => {
        console.error(`Failed to trigger analysis for ${filename}:`, err);
      });
    } catch (err) {
      console.error('Failed to trigger processing:', err);
    }
    
    if (onComplete) {
      onComplete();
    }
  }
  // ...
};
```

## Benefits of This Approach

1. **Upload completes immediately** - User gets fast feedback
2. **Processing runs independently** - No timeout constraints on AI inference
3. **Better separation of concerns** - Upload and analysis are truly decoupled
4. **Matches Azure SWA patterns** - Frontend-triggered async operations work better
5. **Error resilience** - Upload success is not dependent on processing trigger

## Testing Performed

### Manual Testing
1. ✅ Uploaded file via Azure Static Web App endpoint
2. ✅ Verified file metadata updated through processing states: `uploaded` → `processing` → `analyzed`
3. ✅ Confirmed AI analysis with proper risk scores and violation detection
4. ✅ Tested on both Static Web App and Container App deployments

### Test Results
```bash
# Upload test file
curl -X POST "https://salmon-hill-0c0adfc0f.2.azurestaticapps.net/api/upload" \
  -F "file=@sample-files/high-risk-call.json"

# Result: File uploaded successfully

# Check analysis (after ~5 seconds)
curl "https://salmon-hill-0c0adfc0f.2.azurestaticapps.net/api/analysis/high-risk-call.json"

# Result: Full AI analysis with violations, risk scores, and recommendations
{
  "riskScore": 8,
  "fdcpaScore": 2,
  "violations": [...],
  "summary": "This debt collection call contains several significant FDCPA violations..."
}
```

## Deployment Information

- **Static Web App**: https://salmon-hill-0c0adfc0f.2.azurestaticapps.net
- **Container App**: https://billcollector.happybeach-985d7362.westus2.azurecontainerapps.io
- **Resource Group**: tavant
- **Storage Account**: weaselcallstorage

## Commits

- `e043796` - fix: Move AI processing trigger from backend to frontend to fix Azure SWA timeout

## Next Steps

1. Monitor Azure deployments for successful file processing
2. Test with multiple concurrent uploads
3. Consider adding user notification when analysis completes
4. Optional: Add retry logic for failed processing triggers

## Notes

- The Anthropic AI API itself works perfectly - this was purely an orchestration issue
- Both Azure Static Web App and Container App deployments are now fully functional
- Files uploaded before this fix may need manual processing trigger
