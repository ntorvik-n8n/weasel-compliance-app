# Bill Collector App - API Reference

## File Management APIs

### GET `/api/files`
**Purpose:** List all files with optional filtering  
**Query Parameters:** 
- `status` - Filter by file status
- `containerType` - Filter by container (e.g., `raw`)
- Date range filters

**Response:** JSON array of file metadata

---

### GET `/api/files/[filename]`
**Purpose:** Get details and transcript of a specific file  
**Query Parameters:**
- `uploadedAt` - ISO timestamp for file identification

**Response:** Call log data with transcript

---

### PATCH `/api/files/[filename]`
**Purpose:** Update file metadata  
**Body:** JSON with status, notes, or other metadata updates

**Response:** Updated file metadata

---

### DELETE `/api/files/[filename]`
**Purpose:** Delete a specific file  
**Query Parameters:**
- `uploadedAt` - ISO timestamp for file identification

**Response:** Success confirmation

---

### POST `/api/files/status`
**Purpose:** Batch check status of multiple files  
**Body:** JSON array of file objects with `name` and `uploadedAt`

**Response:** Array of status updates with risk scores

---

## Upload APIs

### POST `/api/upload`
**Purpose:** Upload a new call log file  
**Body:** FormData with file attachment

**Response:** Upload confirmation with filename

**Special:** Uses XMLHttpRequest for progress tracking

---

### POST `/api/upload/replace`
**Purpose:** Replace an existing file  
**Body:** FormData with file attachment

**Response:** Upload confirmation

---

## Processing APIs

### POST `/api/process/[filename]`
**Purpose:** Trigger AI analysis of a call log file  
**Body:** JSON with `uploadedAt` timestamp

**Response:** Processing status

**Note:** Long-running operation - use status polling

---

## Analysis & Evaluation APIs

### GET `/api/analysis/[filename]`
**Purpose:** Get AI analysis results for a file  
**Query Parameters:**
- `uploadedAt` - ISO timestamp for file identification

**Response:** Analysis result with violations and risk score

---

### POST `/api/evaluate`
**Purpose:** Evaluate alternative responses using AI  
**Body:** JSON with:
- `originalResponse` - The problematic response
- `alternativeResponse` - Proposed better response
- `violationContext` - Violation details

**Response:** Evaluation with scores and comparison

---

## Admin APIs

### POST `/api/admin/init-storage`
**Purpose:** Initialize storage with sample data  

**Response:** Initialization status

---

### GET `/api/admin/init-storage`
**Purpose:** Check if storage has been initialized  

**Response:** Boolean initialization status

---

### DELETE `/api/admin/clear-storage`
**Purpose:** Clear all storage data (danger!)  

**Response:** Success confirmation

---

## Utility APIs

### GET `/api/version`
**Purpose:** Get application version information  

**Response:** JSON with version number and build info

---

## Common Patterns

### URL Encoding
Filenames are encoded: `encodeURIComponent(filename)`

### Timestamps
Passed as ISO strings: `uploadedAt=${date.toISOString()}`

### Error Handling
All endpoints return appropriate HTTP status codes:
- `200` - Success
- `404` - Not Found
- `409` - Conflict (file exists)
- `500` - Server Error

### Authentication
Currently uses Azure Static Web Apps authentication (if configured)

---

## Implementation Details

### Technology Stack
- **Framework:** Next.js 14 (App Router)
- **HTTP Client:** Native `fetch()` API
- **Upload Progress:** XMLHttpRequest
- **Storage:** Azure Blob Storage
- **AI:** Azure OpenAI / Anthropic Claude

### Request Headers
```
Content-Type: application/json
```

### Response Format
All responses follow consistent structure:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```
