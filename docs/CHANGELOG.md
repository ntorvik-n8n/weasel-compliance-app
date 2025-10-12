# Changelog - Weasel Collections Call Monitor

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added (2025-10-12)

#### AI Reliability & Error Handling
- **Anthropic API Retry Logic** (Story 3.1 Enhancement)
  - Automatic retry mechanism with up to 3 attempts on JSON parse failures
  - Exponential backoff timing (1s, 2s, 4s) to prevent API rate limiting
  - JSON repair strategies to handle common formatting issues from Claude API:
    - Removes markdown code blocks (```json)
    - Extracts JSON from surrounding text
    - Fixes trailing commas before closing braces/brackets
    - Fixes missing commas between object properties
  - Schema validation using TypeScript type guards
  - Comprehensive error logging showing first 500 chars of malformed responses
  - Configurable `maxRetries` parameter for flexibility

#### UI Enhancements
- **Violation Severity Metric** (Story 4.2 Enhancement)
  - Added dynamic "Violation Severity" display in Analysis Summary Card
  - Shows highest severity level (Critical/High/Medium/Low) with color coding:
    - Critical: Red
    - High: Orange
    - Medium: Yellow
    - Low: Blue
  - Intelligent fallback cascade:
    1. Highest violation severity (if violations exist)
    2. Call duration (if no violations but duration available)
    3. "None" in green (for clean calls)
  - Ensures consistent UI layout with no blank spaces

#### Test Data
- **Sample Call Log Files** (Testing Enhancement)
  - Generated 10 diverse sample call logs: `call-log-001.json` through `call-log-010.json`
  - Mix of compliance scenarios:
    - 4 compliant/low-risk calls (proper FDCPA disclosures, professional tone)
    - 2 moderate-risk calls (acceptable but could be improved)
    - 4 high-risk/critical calls (major FDCPA violations, harassment, threats)
  - Realistic scenarios covering:
    - Abusive language and threatening statements
    - Threats to contact employer/neighbors
    - False arrest and legal threats
    - Professional payment plan negotiations
    - Proper rights disclosure
    - Harassment and intimidation tactics

### Technical Improvements

#### Error Handling
- Retry mechanism prevents need to re-upload files when AI responses are malformed
- Better user experience - automatic recovery from transient API issues
- Detailed logging for debugging production issues

#### Code Quality
- Type-safe JSON validation using TypeScript guards
- Clean separation of concerns (repair → parse → validate)
- Comprehensive inline documentation

### Files Modified

#### Components
- `components/dashboard/AnalysisSummaryCard.tsx` - Added Violation Severity metric display

#### Libraries
- `lib/anthropic/client.ts` - Enhanced with retry logic and JSON repair

#### Test Data
- `sample-files/call-log-001.json` through `call-log-010.json` - New comprehensive test dataset

### Documentation Updated

- `docs/stories/3.1.anthropic-api-integration.md` - Added enhancement details
- `docs/stories/4.2.analysis-summary-visualization.md` - Documented Violation Severity metric
- `docs/CHANGELOG.md` - Created comprehensive change log

---

## [0.1.0] - 2025-10-11 - Initial POC Release

### Core Features Implemented

#### File Management (Epic 1)
- ✅ Story 1.1: Next.js 14 Project Initialization
- ✅ Story 1.2: File Upload Component
- ✅ Story 1.3: File Management System Enhancement
- ✅ Story 1.4: Filename Collision Detection & Resolution
- ✅ Story 1.5: Azure Blob Storage Integration
- ✅ Story 1.6: Upload Progress & Error Handling
- ✅ Story 1.7: Multi-file Batch Upload
- ✅ Story 1.8: File Validation & Security

#### Call Log Management (Epic 2)
- ✅ Story 2.1: Call Log List Display
- ✅ Story 2.2: File Selection & Navigation
- ✅ Story 2.3: Search & Filter Functionality
- ✅ Story 2.4: Status Indicators & Processing States

#### AI Compliance Analysis (Epic 3)
- ✅ Story 3.1: Anthropic API Integration
- ✅ Story 3.2: Call Transcript Processing Pipeline
- ✅ Story 3.3: Analysis Result Storage
- ✅ Story 3.4: Risk Level Indicators
- ✅ Story 3.5: Detailed Analysis View

#### Dashboard & Visualization (Epic 4)
- ✅ Story 4.1: Dashboard Layout
- ✅ Story 4.2: Analysis Summary & Risk Score Visualization
- ✅ Story 4.3: Interactive Call Transcript
- ⏸️ Story 4.4: Compliance Trend Charts (Deferred to v1.2)

#### Response Evaluation (Epic 5)
- ✅ Story 5.1: Alternative Response Input
- ✅ Story 5.2: Display Evaluation Results

### Known Limitations (POC Scope)
- Authentication not implemented (planned for production)
- Rate limiting not implemented
- Trend charts deferred to v1.2
- E2E testing pending

---

## Version History

- **v0.1.0** - 2025-10-11: Initial POC Release
- **Enhancements** - 2025-10-12: AI reliability improvements, UI polish

---

*Last Updated: 2025-10-12*
