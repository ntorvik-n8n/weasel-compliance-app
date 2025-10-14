# Docker Deployment Guide

## ✅ Current Status

**Docker deployment is FULLY OPERATIONAL** ✅
- ✅ Upload via web UI works correctly
- ✅ Frontend auto-triggers AI processing
- ✅ Anthropic Claude inference working perfectly
- ✅ Real-time analysis with accurate risk scores and violations
- ✅ Complete feature parity with Azure deployments

## 🏗️ Quick Start

### Build and Run

```powershell
# Build the Docker image
docker build -t billcollector-app:latest --build-arg COMMIT_HASH=$(git rev-parse --short HEAD) .

# Run the container
docker run -d --name billcollector -p 3000:3000 --env-file .env.local billcollector-app:latest
```

### Required Environment Variables

Create `.env.local` with:
```bash
ANTHROPIC_API_KEY=sk-ant-...
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
AZURE_STORAGE_CONTAINER_RAW=call-logs-raw
AZURE_STORAGE_CONTAINER_PROCESSED=call-logs-processed
AZURE_STORAGE_CONTAINER_BACKUPS=call-logs-backups
MAX_FILE_SIZE_MB=10
MAX_CONCURRENT_UPLOADS=5
```

## 🔄 Workflow

### Complete Auto-Processing (✅ Working)
1. **Upload file via web UI** at http://localhost:3000
2. **Frontend automatically triggers processing** (no manual intervention needed)
3. **AI analysis runs** with Anthropic Claude
4. **Results appear in dashboard** with real risk scores and violations

### Manual API Testing
For testing via command line, you can manually trigger processing:
```powershell
curl -X POST "http://localhost:3000/api/process/your-file.json"
```

**Note**: The analysis endpoint returns mock data when accessed directly via curl if the file hasn't been processed yet. Always upload through the web UI for the complete automated workflow.

## 🐛 Troubleshooting

### Issue: No auto-processing after upload

**Solution**: Rebuild Docker image to include latest code
```powershell
docker stop billcollector
docker rm billcollector
docker build -t billcollector-app:latest --build-arg COMMIT_HASH=$(git rev-parse --short HEAD) .
docker run -d --name billcollector -p 3000:3000 --env-file .env.local billcollector-app:latest
```

✅ **Verified Working**: As of 2025-10-14, auto-processing works correctly after rebuild

## ✅ Verification

### Web UI Test (Recommended)
1. Open http://localhost:3000 in your browser
2. Upload a sample file from `sample-files/` directory
3. Watch the file automatically process (status: uploaded → processing → analyzed)
4. View AI-generated analysis in the dashboard with real risk scores

### API Test (Manual Processing)
For API testing or troubleshooting:

```powershell
# Upload a file
$file = Get-Content "sample-files/high-risk-call.json" -Raw
$boundary = [System.Guid]::NewGuid().ToString()
$headers = @{ 'Content-Type' = "multipart/form-data; boundary=$boundary" }
$filename = "test-$(Get-Date -Format 'yyyyMMddHHmmss').json"
$bodyLines = @(
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"$filename`"",
    'Content-Type: application/json',
    '',
    $file,
    "--$boundary--"
)
$body = $bodyLines -join "`r`n"
Invoke-WebRequest -Uri "http://localhost:3000/api/upload" -Method POST -Headers $headers -Body $body

# Trigger processing
curl -X POST "http://localhost:3000/api/process/$filename"

# Wait for analysis
Start-Sleep -Seconds 5

# Check results
curl "http://localhost:3000/api/analysis/$filename" | ConvertFrom-Json
```

Expected output:
- `riskScore`: 8-9 (for high-risk-call.json)
- `fdcpaScore`: 2-3
- `violations`: Array with 3+ items
- `summary`: Detailed AI-generated compliance assessment

## 📊 Test Results

### Latest Docker Test (2025-10-14) ✅
**Status**: FULLY OPERATIONAL

**Web UI Upload Test**:
- ✅ File upload via browser UI: Working
- ✅ Automatic AI processing trigger: Working
- ✅ Real-time analysis generation: Working
- ✅ Anthropic Claude inference: Working
- ✅ Risk scoring and violation detection: Accurate
- ✅ Complete feature parity with Azure deployments: Confirmed

**Sample Results**:
- High-risk calls: Risk Score 8-9, FDCPA Score 2-3, Multiple violations detected
- Compliant calls: Risk Score 1-2, FDCPA Score 8-9, No violations
- Standard calls: Risk Score 3-5, FDCPA Score 6-8, Minor issues detected

**Previous Manual Trigger Test**:
```
File: docker-final-test-20251014-152926.json
Risk Score: 2 (compliant call)
FDCPA Score: 8
Violations: 0
Summary: "The call transcript demonstrates a professional and FDCPA-compliant..."
Status: ✅ PASSED
```

## 🔧 Troubleshooting

### Container won't start
```powershell
# Check logs
docker logs billcollector

# Verify environment variables
docker exec billcollector env | grep -E "ANTHROPIC|AZURE"
```

### Upload fails
- Verify `.env.local` has correct Azure Storage connection string
- Check file size is under MAX_FILE_SIZE_MB
- Ensure file is valid JSON with transcript array

### Processing doesn't complete
- Check container logs: `docker logs billcollector --tail 50`
- Verify ANTHROPIC_API_KEY is set
- Check Azure Storage container exists
- Try manual trigger as workaround

### Analysis returns mock data
- If analysis shows generic scores (4.5, 6.8), it's mock data
- Solution: Manually trigger processing OR rebuild Docker image

## 🚀 Production Considerations

1. **Use Docker Compose** for easier management
2. **Add health checks** to monitor container status
3. **Implement volume mounts** for persistent data
4. **Set up log aggregation** for troubleshooting
5. **Use secrets management** instead of .env files
6. **Configure restart policy**: `--restart unless-stopped`

## 📝 Related Documentation

- [Azure AI Inference Fix](./AZURE_AI_INFERENCE_FIX.md) - Details on the upload/processing decoupling
- [Architecture](./architecture.md) - System design overview
- [PRD](./prd.md) - Product requirements
