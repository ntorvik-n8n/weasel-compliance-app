# Epic 2: Call Log Management System

## Epic Overview

**Epic ID:** EPIC-2
**Epic Name:** Call Log Management System
**Priority:** P0 (Critical - Foundation)
**Status:** Not Started
**Target Phase:** Phase 2 - Core Features

## Epic Goal

Build a comprehensive call log management interface that displays uploaded files in an organized, searchable sidebar, enables users to select individual logs for detailed analysis, and provides real-time status indicators showing upload, processing, and analysis states.

## Business Value

This epic transforms uploaded files into an actionable workspace for compliance officers. It provides the navigation and organization layer that allows users to efficiently manage and access their call logs, making the application usable for daily compliance work.

**Key Benefits:**
- Quick access to all uploaded call logs
- Easy identification of files needing attention
- Efficient search and filtering saves time
- Clear status visibility reduces confusion
- Organized workspace improves productivity

## User Stories Included

### Planned Stories
- ✅ **Story 2.1:** Call Log List Display with Metadata (Done)
- ✅ **Story 2.2:** File Selection and Navigation (Done)
- ✅ **Story 2.3:** Search and Filter Functionality (Done)
- ✅ **Story 2.4:** Status Indicators and Processing States (In Progress)
- ✅ **Story 2.5:** Recently Uploaded Section
- ✅ **Story 2.6:** Risk Level Visual Indicators

## Technical Scope

### Components
- Sidebar navigation component with scrollable list
- Call log list item component with metadata display
- Search and filter controls
- Status badge components (uploaded, processing, analyzed, error)
- File selection state management
- Metadata fetching from Azure Blob Storage

### Integration Points
- Azure Blob Storage metadata API
- Upload system state from Epic 1
- Analysis system state from Epic 3 (future)
- Dashboard display coordination

### Data Requirements
**Call Log Metadata:**
- Filename (original and stored)
- Upload timestamp
- File size
- Processing status (uploaded, processing, analyzed, error)
- Analysis results summary (risk score, violation count)
- Agent ID/name (from JSON content)
- Call duration
- Last accessed timestamp

## Acceptance Criteria

### Functional Requirements
- [ ] Sidebar displays scrollable list of all uploaded call logs
- [ ] Each list item shows filename, upload date, and status
- [ ] Risk level indicators are color-coded and visible at a glance
- [ ] Users can click a call log to view full details in main panel
- [ ] Active selection is visually highlighted
- [ ] Search functionality filters by filename, date, agent, or client
- [ ] Filter options include status (uploaded, processing, analyzed, error)
- [ ] Filter options include risk level (low, medium, high, critical)
- [ ] Recently uploaded section shows last 5 uploads
- [ ] List updates in real-time when new files are uploaded
- [ ] Status indicators update automatically during processing

### Performance Requirements
- [ ] List loads within 2 seconds for up to 1,000 files
- [ ] Search results appear within 500ms
- [ ] Filter application is instantaneous (<100ms)
- [ ] Real-time status updates appear within 3 seconds of state change
- [ ] Smooth scrolling even with 5,000+ files (virtualization)

### Usability Requirements
- [ ] Clear visual hierarchy distinguishes file states
- [ ] Color-coding follows accessibility standards (WCAG 2.1 AA)
- [ ] Icons supplement text for status indicators
- [ ] Hover states provide additional context
- [ ] Empty states guide users to upload files

## UI Component Structure

### Left Sidebar Layout
```
┌─────────────────────────────┐
│  Upload Zone (Epic 1)       │
├─────────────────────────────┤
│  Recently Uploaded          │
│  • chatlog1.json            │
│  • chatlog2.json            │
├─────────────────────────────┤
│  Search & Filters           │
│  [Search box]               │
│  [Status: All ▼]            │
│  [Risk: All ▼]              │
├─────────────────────────────┤
│  All Call Logs (124)        │
│  ┌───────────────────────┐ │
│  │ 🔴 chatlog3.json      │ │
│  │ Oct 10, 2:43 PM       │ │
│  │ Risk: 8.2 • 4 issues  │ │
│  ├───────────────────────┤ │
│  │ 🟡 chatlog4.json      │ │
│  │ Oct 10, 2:41 PM       │ │
│  │ Risk: 5.4 • 2 issues  │ │
│  └───────────────────────┘ │
│  (scrollable list...)       │
└─────────────────────────────┘
```

### Status Indicators
- 🔵 **Uploaded** - File received, awaiting processing
- 🟡 **Processing** - AI analysis in progress
- 🟢 **Analyzed** - Analysis complete, ready for review
- 🔴 **High Risk** - Critical violations detected
- ⚪ **Error** - Processing failed, action needed

### Risk Level Color Coding
- **Low Risk (0-3.0):** Green 🟢
- **Medium Risk (3.1-6.0):** Yellow 🟡
- **High Risk (6.1-8.0):** Orange 🟠
- **Critical Risk (8.1-10.0):** Red 🔴

## Dependencies

### External Dependencies
- None

### Internal Dependencies
- **Epic 1 (File Upload):** Required - Need files to display
- **Epic 3 (AI Analysis):** Partial - Risk scores and status updates depend on analysis

### Blocking Dependencies
- Epic 1 must be complete before starting this epic

## Success Metrics

### Technical Metrics
- List load time: **<2 seconds** for 1,000 files
- Search performance: **<500ms** response time
- Real-time updates: **<3 seconds** latency
- Scroll performance: **60 FPS** with virtualization

### User Experience Metrics
- Users can locate specific call log within **10 seconds**
- Search feature reduces navigation time by **70%**
- Status indicators rated clear by **90%** of users
- Overall navigation experience rated **4/5** or higher

### Business Metrics
- Improved productivity for compliance officers
- Reduced time to locate and review specific calls
- Better visibility into processing status
- Enhanced ability to prioritize high-risk calls

## Risk Assessment

### Technical Risks

**Risk:** Performance degradation with large file counts
**Impact:** High
**Mitigation:** Implement virtual scrolling, pagination, lazy loading

**Risk:** Real-time updates cause excessive API calls
**Impact:** Medium
**Mitigation:** Implement WebSocket connections or polling with exponential backoff

**Risk:** Search performance slow with complex queries
**Impact:** Medium
**Mitigation:** Implement client-side caching, consider search indexing

### Business Risks

**Risk:** Complex filter UI confuses users
**Impact:** Medium
**Mitigation:** Start with simple filters, add advanced options progressively

**Risk:** Status indicators not intuitive
**Impact:** Low
**Mitigation:** User testing with target audience, iterate on design

## Definition of Done

### Epic Completion Criteria
- [ ] All user stories in epic completed with acceptance criteria met
- [ ] Sidebar displays all uploaded files with metadata
- [ ] Search and filter functionality working correctly
- [ ] Status indicators update in real-time
- [ ] Risk level visualization implemented
- [ ] File selection triggers dashboard update
- [ ] Performance benchmarks achieved
- [ ] Accessibility requirements met
- [ ] Documentation updated (component docs, user guide)
- [ ] Code reviewed and merged to main branch
- [ ] Deployed to Azure Static Web Apps staging environment
- [ ] User acceptance testing completed successfully

### Quality Gates
- [ ] Unit tests pass (>80% coverage)
- [ ] Component tests pass for all UI elements
- [ ] Performance tests meet targets
- [ ] Accessibility audit passes (WCAG 2.1 AA)
- [ ] Visual regression tests pass
- [ ] Cross-browser testing completed

## Notes

- This epic focuses on navigation and organization, not detailed analysis
- Consider virtual scrolling early to avoid performance issues later
- Status updates should be efficient to avoid excessive API calls
- Design should match UI mockups provided in project root
- Empty states are important for first-time user experience

## Related Documentation

- [PRD](../prd.md) - Product Requirements Document
- [Architecture](../architecture.md) - Technical Architecture
- [UI Mockups](../../UI-calllog.png) - Call Log UI Reference
- [Epic 1](./epic-1-file-upload-storage.md) - File Upload & Storage (prerequisite)
- [Epic 3](./epic-3-ai-compliance-analysis.md) - AI Analysis (provides status data)

---

*Epic created: 2025-10-10*
*Last updated: 2025-10-10*
*Product Owner: Sarah*
