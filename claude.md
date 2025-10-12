# Collections Call Monitor Evaluation App - "Weasel"

## Project Overview

**Project Name:** Collections Call Monitor Evaluation App
**Code Name:** Weasel
**Status:** Proof of Concept (POC) - Initial Development
**Target Deployment:** Microsoft Azure Static Web Apps
**Framework:** Next.js 14 with Anthropic API integration

### Purpose
AI-powered monitoring tool that analyzes debt collection calls for FDCPA (Fair Debt Collection Practices Act) compliance. The application transcribes calls, evaluates agent behavior, identifies violations, and provides recommendations for improved communication practices.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (recommended for type safety)
- **Styling:** Tailwind CSS
- **File Upload:** React-Dropzone for drag-and-drop functionality
- **State Management:** React Context API
- **Charts/Visualization:** Recharts or Chart.js
- **UI Components:** shadcn/ui (recommended) or custom components

### Backend
- **API Routes:** Next.js API routes (serverless functions)
- **AI Integration:** Anthropic Claude API (Claude-3 or Claude-3.5)
- **File Storage:** Azure Blob Storage
- **Monitoring:** Azure Application Insights
- **Security:** Azure Key Vault for secrets management

### Development Tools
- **Package Manager:** npm or pnpm
- **Code Quality:** ESLint, Prettier
- **Testing:** Jest + React Testing Library (optional for POC)
- **Git:** Version control (repository not yet initialized)

---

## Project Structure (Planned)

```
billcollector-app/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Dashboard home page
│   │   ├── api/                # API routes
│   │   │   ├── upload/         # File upload endpoints
│   │   │   ├── analyze/        # AI analysis endpoints
│   │   │   └── storage/        # Azure Blob Storage interaction
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   ├── upload/             # File upload components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── transcript/         # Call transcript display
│   │   └── sidebar/            # Navigation sidebar
│   ├── lib/                    # Utility functions
│   │   ├── anthropic.ts        # Anthropic API client
│   │   ├── azure-storage.ts    # Azure Blob Storage client
│   │   ├── validators.ts       # JSON validation
│   │   └── utils.ts            # Helper functions
│   ├── types/                  # TypeScript type definitions
│   │   ├── call-log.ts         # Call log data structure
│   │   └── analysis.ts         # AI analysis response types
│   └── contexts/               # React contexts
│       └── upload-context.tsx  # Upload state management
├── public/                     # Static assets
├── .env.local                  # Environment variables (not in git)
├── .env.example                # Environment variables template
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
├── billcollector_PRD.txt       # Full Product Requirements Document
├── UI-calllog.png              # UI mockup - Call log view
├── UI-dashboard.png            # UI mockup - Dashboard view
└── claude.md                   # This file
```

---

## Environment Variables

Required environment variables (create `.env.local`):

```bash
# Anthropic API
ANTHROPIC_API_KEY=your_api_key_here

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=your_connection_string_here
AZURE_STORAGE_CONTAINER_NAME=call-logs

# Application Settings
MAX_FILE_SIZE_MB=10
MAX_CONCURRENT_UPLOADS=5

# Azure Application Insights (Optional)
APPLICATIONINSIGHTS_CONNECTION_STRING=your_insights_connection_string
```

---

## Key Features to Implement

### Phase 1: Foundation (Priority 1)
1. **Next.js Setup**
   - Initialize Next.js 14 with TypeScript
   - Configure Tailwind CSS
   - Set up basic project structure
   - Configure Azure Static Web Apps deployment

2. **File Upload System**
   - Drag-and-drop interface with React-Dropzone
   - File validation (JSON format, size limits)
   - Progress indicators
   - Multi-file upload support

3. **Azure Blob Storage Integration**
   - Storage client setup
   - Upload to blob storage
   - File organization by date
   - Metadata management

### Phase 2: Core Features (Priority 2)
4. **Filename Collision Handling**
   - Collision detection
   - Multiple resolution strategies:
     - Timestamp append: `chatlog1_20251009_143027.json`
     - Incremental: `chatlog1_001.json`
     - User prompt with preview
   - Backup before replacement

5. **Call Log Management**
   - List uploaded files with metadata
   - File selection and navigation
   - Search and filter by filename, date, agent, risk score
   - Status indicators (uploaded, processing, analyzed)

6. **AI Compliance Analysis**
   - Anthropic API integration
   - FDCPA compliance evaluation
   - Risk scoring (0-10 scale)
   - Violation identification:
     - Abusive language
     - Threatening statements
     - Excessive pressure
     - FDCPA-specific violations

### Phase 3: Enhancement (Priority 3)
7. **Dashboard & Visualization**
   - Real-time metrics display
   - Risk scores and compliance metrics
   - Charts showing trends over time
   - Agent performance summaries

8. **Response Evaluation System**
   - Input alternative agent responses
   - AI evaluation of improvements
   - Comparative analysis (original vs. suggested)
   - Response quality scoring

9. **Compliance Reporting**
   - Detailed violation explanations
   - Exportable reports
   - Audit trail maintenance

---

## Call Log JSON Schema

Expected structure for uploaded JSON files:

```json
{
  "callId": "string (unique identifier)",
  "timestamp": "ISO 8601 datetime",
  "agent": {
    "id": "string",
    "name": "string"
  },
  "client": {
    "id": "string",
    "name": "string (optional for privacy)"
  },
  "duration": "number (seconds)",
  "transcript": [
    {
      "timestamp": "number (seconds from start)",
      "speaker": "agent | client",
      "text": "string (what was said)"
    }
  ],
  "outcome": "string (call resolution)",
  "metadata": {
    "recordingId": "string",
    "campaignId": "string"
  }
}
```

---

## Azure Blob Storage Structure

```
/call-logs/
  /raw/                           # Original uploaded files
    /2024/10/09/                  # Date-based organization
      chatlog1.json
      chatlog1_001.json           # Collision resolution
  /processed/                     # AI-analyzed files
    /2024/10/09/
      chatlog1_analysis.json
  /backups/                       # Backups before replacement
    /2024/10/09/
      chatlog1_backup_20251009_143027.json
```

---

## Anthropic API Integration

### Analysis Prompt Strategy

For each call transcript, send a structured prompt to Claude:

```
Analyze this debt collection call for FDCPA compliance.

Call Transcript:
[Insert full transcript]

Evaluate:
1. FDCPA Violations (list specific violations)
2. Risk Score (0-10, where 10 is highest risk)
3. Abusive or Threatening Language (flag specific quotes)
4. Excessive Pressure Tactics (identify instances)
5. Recommended Alternative Responses (for flagged segments)

Return analysis in structured JSON format.
```

### Response Format

```json
{
  "riskScore": 5.4,
  "fdcpaScore": 7.2,
  "violations": [
    {
      "type": "abusive_language",
      "severity": "high",
      "timestamp": 125,
      "quote": "...",
      "explanation": "...",
      "regulation": "FDCPA Section 806"
    }
  ],
  "suggestedResponses": [
    {
      "originalTimestamp": 125,
      "originalText": "...",
      "suggestedText": "...",
      "rationale": "..."
    }
  ]
}
```

---

## UI Design Reference

Two UI mockups are provided in the project root:
- **[UI-dashboard.png](UI-dashboard.png)** - Main dashboard layout
- **[UI-calllog.png](UI-calllog.png)** - Call log list view

### Key UI Components

**Left Sidebar:**
- Upload section (drag-and-drop area at top)
- Upload progress indicators
- Scrollable list of call logs with:
  - Filename
  - Upload timestamp
  - Risk level indicators
  - Processing status icons
- Search and filter controls

**Main Dashboard:**
- Call analysis summary card
  - Risk score (large display, e.g., "5.4/10")
  - FDCPA compliance score
  - Duration and violation counts
  - Compliance flags (badges for issues)
  - File metadata (upload date, size, processing time)
- Transcript viewer
  - Chronological conversation
  - Speaker labels (Agent/Client)
  - Timestamps
  - Highlighted problematic segments
- Response evaluation panel
  - Text input for alternative responses
  - "Suggest Better Response" button
  - "Evaluate My Response" button
  - Comparison view

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

---

## Code Conventions

1. **File Naming:**
   - Components: PascalCase (e.g., `UploadZone.tsx`)
   - Utilities: kebab-case (e.g., `azure-storage.ts`)
   - API routes: lowercase (e.g., `upload/route.ts`)

2. **TypeScript:**
   - Use strict mode
   - Define types in `/src/types/` directory
   - Prefer interfaces over types for object shapes
   - Use type inference where possible

3. **Components:**
   - Functional components with hooks
   - Extract reusable logic into custom hooks
   - Keep components focused (single responsibility)
   - Use TypeScript prop types

4. **API Routes:**
   - Validate all inputs
   - Return consistent error responses
   - Use try-catch for error handling
   - Log errors for monitoring

5. **Error Handling:**
   - User-friendly error messages
   - Detailed logging for debugging
   - Graceful degradation
   - Retry mechanisms for transient failures

---

## Security Considerations

1. **File Upload:**
   - Validate JSON structure strictly
   - Enforce file size limits
   - Sanitize filenames
   - Scan for malware (Azure Security Center integration)

2. **Data Protection:**
   - Encrypt data at rest (Azure Blob Storage encryption)
   - Encrypt data in transit (HTTPS)
   - Secure API keys in Azure Key Vault
   - Implement access logging

3. **API Security:**
   - Rate limiting on API routes
   - Input validation and sanitization
   - CORS configuration
   - Authentication (Azure AD for production)

---

## Performance Targets

- File upload: <10 seconds for files up to 5MB
- Call analysis: <30 seconds for 10-minute transcripts
- Dashboard updates: <2 seconds
- Concurrent uploads: Support up to 5 files simultaneously

---

## Success Metrics

### Technical
- File upload success rate: >99%
- API uptime: >95%
- Upload processing: <30 seconds for 5MB files
- Dashboard load: <2 seconds

### Functional
- Accurate FDCPA violation detection
- Meaningful risk scoring
- Useful AI-generated suggestions
- Intuitive upload UX

### Business
- Stakeholder approval for POC
- Demonstration of AI-powered compliance monitoring
- Clear pathway to production
- Cost-effective operation within budget

---

## Known Constraints

1. **POC Scope:**
   - Limited scalability requirements
   - Azure Static Web Apps 250MB deployment limit
   - Database-free architecture

2. **Azure Limits:**
   - Static Web Apps function timeout limits
   - Blob Storage pricing considerations
   - Application Insights data limits

3. **Anthropic API:**
   - Rate limits (tier-dependent)
   - Cost per token
   - Response time variability

---

## Next Steps (Implementation Order)

1. ✅ **Project Planning Complete** (PRD and claude.md created)
2. ⬜ Initialize Next.js 14 project with TypeScript
3. ⬜ Set up Tailwind CSS and basic layout
4. ⬜ Create file upload component with React-Dropzone
5. ⬜ Implement Azure Blob Storage integration
6. ⬜ Build API route for file upload
7. ⬜ Add filename collision detection and resolution
8. ⬜ Integrate Anthropic API for call analysis
9. ⬜ Build dashboard UI components
10. ⬜ Implement transcript viewer with highlighting
11. ⬜ Create response evaluation system
12. ⬜ Add search and filter functionality
13. ⬜ Implement error handling and logging
14. ⬜ Deploy to Azure Static Web Apps
15. ⬜ Testing and refinement

---

## Full Product Requirements

For complete details on all features, user stories, technical architecture, and business requirements, see [billcollector_PRD.txt](billcollector_PRD.txt).

---

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Anthropic API Docs:** https://docs.anthropic.com/
- **Azure Static Web Apps:** https://learn.microsoft.com/en-us/azure/static-web-apps/
- **Azure Blob Storage:** https://learn.microsoft.com/en-us/azure/storage/blobs/
- **React-Dropzone:** https://react-dropzone.js.org/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **FDCPA Reference:** https://www.ftc.gov/legal-library/browse/rules/fair-debt-collection-practices-act-text

---

*Last Updated: 2025-10-10*
