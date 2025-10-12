Product Requirements Document (PRD)
Collections Call Monitor Evaluation App - "Weasel"

Project Overview
Project Name: Collections Call Monitor Evaluation App
Code Name: Weasel
Status: Proof of Concept (POC)
Target Deployment: Microsoft Azure Static Web Apps
Framework: Next.js with Anthropic API integration
Purpose
The Collections Call Monitor Evaluation App is designed to analyze debt collection calls for compliance with the Fair Debt Collection Practices Act (FDCPA) and identify harmful or threatening language directed at consumers. The application serves as an AI-powered monitoring tool that transcribes calls, evaluates agent behavior, and provides recommendations for improved communication practices.

Business Objectives
Primary Goals
• Compliance Monitoring: Ensure debt collection calls adhere to FDCPA regulations and avoid abusive, threatening, or harassing language
• Risk Assessment: Provide real-time scoring of call content to identify potential regulatory violations
• Performance Improvement: Offer AI-generated suggestions for more professional and compliant agent responses
• Documentation: Maintain comprehensive records of call evaluations for audit and training purposes
Success Metrics
• Accurate detection of FDCPA violations with risk scoring
• Identification of threatening and abusive language patterns
• Successful AI evaluation of alternative response suggestions
• Seamless processing of JSON-structured call transcripts
• Efficient file upload and management system

Stakeholders and Roles
Primary Users:
• Compliance Officers
• Collection Agency Supervisors
• Quality Assurance Teams
• Training Coordinators
Technical Team:
• Product Owner
• Full-stack Developer (Next.js)
• AI Integration Specialist
• Azure DevOps Engineer

User Stories and Use Cases
Core User Stories
As a compliance officer, I want to:
• Upload new call log files through a user-friendly interface
• Review call transcripts with AI-identified compliance issues
• See risk scores and violation summaries for each call
• Access detailed explanations of why language was flagged as problematic
• Generate reports on compliance trends across multiple calls
As a supervisor, I want to:
• Upload call recordings in JSON format for immediate analysis
• Evaluate agent performance through AI analysis
• Provide alternative response suggestions to agents
• Monitor real-time compliance metrics
• Track improvement in agent communication over time
As a quality assurance analyst, I want to:
• Bulk upload multiple call logs for batch processing
• Compare AI evaluations with manual assessments
• Identify patterns in problematic language across agents
• Access comprehensive call logs with searchable metadata
• Export compliance data for regulatory reporting

Functional Requirements
Core Features
1. File Upload System
• Drag-and-drop interface for JSON call log uploads
• Browse and select traditional file picker functionality
• Multi-file upload support for batch processing
• File validation to ensure proper JSON structure and format
• Progress indicators showing upload status and processing
• Upload queue management for multiple concurrent uploads
2. Filename Collision Handling
• Automatic detection of existing filenames in the system
• Smart naming conventions with multiple resolution strategies:
• Append timestamp: chatlog1.json → chatlog1_20251009_143027.json
• Append increment: chatlog1.json → chatlog1_001.json, chatlog1_002.json
• User prompt: Allow user to choose rename, replace, or skip
• Collision prevention UI with clear options and preview
• Backup original files before replacement (when user chooses replace)
• Collision history tracking for audit purposes
3. Enhanced Call Log Management
• Display scrollable list of JSON call files with upload date indicators
• Enable selection of individual call logs for detailed analysis
• Support search and filtering by filename, date, agent, client, or risk score
• Upload status indicators showing recently uploaded, processing, or analyzed files
• Maintain persistent file storage integration with Azure ecosystem
• File metadata display including upload date, file size, and processing status
4. AI-Powered Compliance Analysis
• Process call transcripts using Anthropic API for FDCPA compliance evaluation

### Epic 2: Enhanced Call Log Management

**Goal:** To provide users with a comprehensive interface to view, search, filter, and manage uploaded call logs, enabling efficient access and analysis.

#### Story 2.1: Display a List of Uploaded Call Logs

**As a** compliance officer,
**I want** to see a list of all uploaded call log files,
**so that** I can quickly view what has been processed and is available for review.

**Acceptance Criteria:**
- A new page/section displays a list or table of uploaded files.
- Each item in the list shows: filename, file size, and upload date/time.
- The list is paginated, showing 25 files per page.
- The list is sorted by upload date in descending order (newest first) by default.
- The system fetches file metadata from a server-side API endpoint.

#### Story 2.2: Implement Search Functionality for Call Logs

**As a** quality assurance analyst,
**I want** to search the list of call logs by filename,
**so that** I can quickly find a specific call log I need to review.

**Acceptance Criteria:**
- A search input field is added to the call log list view.
- As I type, the list of files dynamically updates to show results matching the search term.
- The search is performed on the filename.
- The search is case-insensitive.
- Clearing the search input restores the full, unfiltered list.

#### Story 2.3: Implement Advanced Filtering for Call Logs

**As a** supervisor,
**I want** to filter the call log list by date range and agent name,
**so that** I can narrow down the list to a specific set of calls for performance evaluation.

**Acceptance Criteria:**
- Filter controls are added for "Date Range" (start and end date pickers).
- A filter control (e.g., dropdown or text input) is added for "Agent Name".
- Applying a filter updates the list to show only matching call logs.
- Filters can be combined with the search functionality.
- A "Clear Filters" button resets all active filters.

#### Story 2.4: Display Detailed Call Log View

**As a** compliance officer,
**I want** to click on a call log from the list and see its detailed contents,
**so that** I can begin my analysis of the call.

**Acceptance Criteria:**
- Clicking a file in the list navigates to a new page or view for that specific call log.
- The detailed view displays the full contents of the JSON file in a readable format.
- Key metadata (callId, agent, client, duration, timestamp) is prominently displayed.
- The call transcript is displayed in a clear, conversational format.

• Generate overall risk scores (0-10 scale) based on language analysis
• Identify specific violation types:
• Abusive language
• Threatening statements
• Excessive pressure tactics
• FDCPA-specific violations
• Provide segment-level analysis with timestamp correlation
5. Dashboard and Visualization
• Real-time dashboard updating based on selected call log
• Visual representation of:
• Risk scores and compliance metrics
• Call duration and outcome statistics
• Violation frequency and severity trends
• Agent performance summaries
• Upload statistics and processing metrics
• Interactive charts showing compliance patterns over time
6. Response Evaluation System
• Allow users to input alternative agent responses
• AI evaluation of suggested improvements for professionalism and compliance
• Comparative analysis between original and suggested responses
• Scoring system for response quality and regulatory adherence
7. Compliance Reporting
• Detailed violation explanations with regulatory context
• Exportable compliance reports in standard formats
• Audit trail maintenance for regulatory purposes
• Integration with existing compliance management systems
Enhanced Technical Features
File Upload Processing
• JSON structure validation with detailed error reporting
• File size limits (configurable, default 10MB per file)
• Concurrent upload handling with queue management
• Upload retry mechanisms for failed transfers
• Virus scanning integration (Azure Security Center)
• Automatic backup of uploaded files to separate Azure storage container
Filename Management System
• UUID generation for internal file tracking while preserving user-friendly names
• Filename sanitization to prevent security issues
• Case-insensitive collision detection for cross-platform compatibility
• Reserved filename protection (preventing system file overwrites)
• Filename pattern validation ensuring compliance with Azure Blob Storage naming conventions
File Processing Pipeline
• Asynchronous processing of uploaded files
• Processing status tracking with real-time updates
• Error handling and recovery for malformed JSON files
• Automatic cleanup of temporary files and failed uploads
• Processing history with detailed logs for troubleshooting
Azure Integration Enhancement
• Azure Blob Storage for persistent file storage with hierarchical organization
• Azure Service Bus for upload queue management (optional for POC)
• Azure Application Insights for upload monitoring and performance tracking
• Azure Key Vault for secure API key and storage connection string management

Non-Functional Requirements
Performance Requirements
• File upload completion within 10 seconds for files up to 5MB
• Call analysis completion within 30 seconds for transcripts up to 10 minutes
• Dashboard updates within 2 seconds of file selection
• Concurrent upload support for up to 5 files simultaneously
• Responsive design supporting desktop and tablet interfaces
Security Requirements
• Encryption of sensitive call data at rest and in transit
• Secure file upload with anti-malware scanning
• Input validation and sanitization for all uploaded content
• Access logging for audit purposes
• Secure API key management for Anthropic integration
• Data retention policies with automatic cleanup of old files
Scalability Requirements
• Support for up to 5,000 call logs in initial deployment
• Efficient file handling to minimize memory usage during uploads
• Storage optimization with compression for older call logs
• Database-free architecture suitable for POC requirements
• Horizontal scaling capability through Azure Static Web Apps
Usability Requirements
• Intuitive upload interface with clear progress indicators
• Error messaging that guides users toward resolution
• Filename collision resolution with clear options
• Accessibility compliance (WCAG 2.1 AA standards)
• Mobile-responsive design for tablet usage
Compatibility Requirements
• Modern web browser support (Chrome, Firefox, Safari, Edge)
• File format support limited to JSON with defined schema
• Cross-platform filename handling (Windows/Mac/Linux)
• Integration compatibility with Azure ecosystem services

Technical Architecture
Frontend (Next.js)
• Framework: Next.js 14 with App Router
• File Upload: React-Dropzone for drag-and-drop functionality
• State Management: React Context API with file upload state tracking
• Styling: Tailwind CSS with custom upload components
• File Handling: Browser-based JSON parsing and validation
• Progress Tracking: Real-time upload progress with WebSocket connections
• Charts/Visualization: Chart.js or Recharts for dashboard components
Backend Integration
• File Processing: Server-side API routes for file validation and processing
• AI Processing: Direct Anthropic API integration from server-side components
• File Storage: Azure Blob Storage with organized container structure
• Upload Management: Custom upload queue with retry logic
• Monitoring: Azure Application Insights for upload and processing metrics
• Configuration: Environment variables for API keys, storage connections, and processing limits
File Management Architecture

text
Azure Blob Storage Structure:
/call-logs/
  /raw/                    # Original uploaded files
    /2024/10/09/          # Date-based organization
      chatlog1.json
      chatlog1_001.json    # Collision resolution
  /processed/             # AI-analyzed files
    /2024/10/09/
      chatlog1_analysis.json
  /backups/               # Backup copies before replacement
    /2024/10/09/
      chatlog1_backup_timestamp.json
Upload Processing Flow
1. Client uploads file via drag-and-drop or file picker
2. Frontend validation checks file format and size
3. Collision detection checks existing filenames
4. User resolution of any filename conflicts
5. Secure upload to Azure Blob Storage
6. Backend processing validates JSON structure
7. AI analysis processes call content
8. Dashboard update reflects new file availability

User Interface Design
Enhanced Layout Structure
Based on the provided UI mockups with upload functionality:
Left Sidebar (Enhanced):
• Upload section at top with drag-and-drop area
• Upload progress indicators for active transfers
• Scrollable list of call log files with upload timestamps
• File selection highlighting with processing status icons
• Search and filter functionality
• Risk level indicators per file
• Recently uploaded section for quick access
Upload Interface Components:
• Primary upload area with drag-and-drop zone
• File browser button for traditional file selection
• Upload queue showing multiple file progress
• Collision resolution modal with naming options
• Error display area for validation failures
• Upload history showing recent successful uploads
Main Dashboard (Updated):
• Call analysis summary with key metrics including upload metadata
• Risk score display (5.4/10 format)
• FDCPA compliance score
• Duration and violation counts
• Compliance flags (Abusive Language, Excessive Pressure)
• File information panel showing upload date, file size, processing time
Transcript Section:
• Chronological conversation display
• Speaker identification (Agent/Client)
• Timestamp integration
• Highlighted problematic segments
• AI suggestion overlay system
Response Evaluation Panel:
• Text input for alternative responses
• AI evaluation buttons ("Suggest Better Response", "Evaluate My Response")
• Professional response suggestions with compliance tags
• Comparison functionality between original and suggested responses
File Upload User Experience
Upload Process Flow:
1. Initial State: Clean upload area with clear call-to-action
2. Drag Hover: Visual feedback showing drop zone activation
3. File Selection: Immediate validation with success/error indicators
4. Collision Detection: Modal dialog with resolution options
5. Upload Progress: Real-time progress bars with estimated completion
6. Processing Status: Visual indicators showing AI analysis progress
7. Completion: Success notification with quick access to new analysis
Error Handling Interface:
• Clear error messages with specific resolution guidance
• Retry mechanisms for failed uploads
• Validation feedback highlighting specific JSON structure issues
• Help tooltips explaining file format requirements

Integration Requirements
Enhanced File Upload Integration
Azure Blob Storage Integration
• Storage Account: Dedicated container for call logs with lifecycle management
• Access Policies: Secure access with SAS tokens for uploads
• Metadata Management: Custom properties for file tracking and organization
• Backup Strategy: Automated backup to separate container before replacements
• Cleanup Policies: Automatic removal of temporary and failed uploads
Azure Static Web Apps Enhancement
• API Routes: Custom endpoints for file upload processing
• Authentication: Azure AD integration for secure access (optional for POC)
• Configuration: Environment-based settings for upload limits and storage
• Monitoring: Built-in performance tracking for upload operations
Anthropic API Integration
• Model Selection: Claude-3 or Claude-3.5 for optimal performance
• API Endpoints: Messages API for conversation analysis
• Rate Limiting: Implementation of request throttling with upload queue coordination
• Error Handling: Graceful degradation when API is unavailable
• Cost Monitoring: Usage tracking integrated with file upload metrics

File Upload Specifications
Supported File Formats
• Primary: JSON files with .json extension
• Structure Validation: Strict adherence to defined call log schema
• Encoding: UTF-8 character encoding required
• Size Limits: Maximum 10MB per file, configurable
Filename Collision Resolution Strategies
Strategy 1: Timestamp Append (Default)
• Pattern: originalname_YYYYMMDD_HHMMSS.json
• Example: chatlog1.json → chatlog1_20251009_143027.json
• Advantages: Preserves chronological order, human-readable
Strategy 2: Incremental Numbering
• Pattern: originalname_###.json
• Example: chatlog1.json → chatlog1_001.json
• Advantages: Clean naming, sequential organization
Strategy 3: User Choice
• Options: Rename, Replace, Skip
• Interface: Modal dialog with preview of new name
• Safeguards: Backup creation before replacement
Strategy 4: UUID Suffix
• Pattern: originalname_shortUUID.json
• Example: chatlog1.json → chatlog1_a7b2c9.json
• Advantages: Guaranteed uniqueness, compact
Upload Validation Rules
• JSON Schema Validation: Verify required fields and structure
• File Size Checks: Prevent oversized uploads
• Content Scanning: Basic malware detection
• Name Sanitization: Remove special characters and ensure Azure compatibility
• Duplicate Content Detection: Optional MD5 hash comparison

Assumptions and Dependencies
Enhanced Assumptions
• Users will upload files in the specified JSON format
• Network connectivity is sufficient for file uploads and AI processing
• Users have basic familiarity with debt collection compliance requirements
• Modern web browsers with JavaScript enabled and file API support
• Azure Blob Storage provides reliable file persistence
• File upload sizes remain within reasonable limits for POC
Dependencies
• Anthropic API availability and performance
• Azure Static Web Apps service reliability and file handling capabilities
• Azure Blob Storage service availability and performance
• Valid JSON structure for all uploaded call transcripts
• Sufficient API quota for expected usage volumes
• Browser file API support for modern upload functionality
Constraints
• POC scope limits advanced scalability requirements
• Azure Static Web Apps 250MB deployment size limit
• Azure Blob Storage pricing considerations for file storage
• Anthropic API rate limits and cost considerations
• Browser-based processing limitations for large files
• File upload timeouts in Azure Static Web Apps environment

Timeline and Milestones
Phase 1: Foundation (Weeks 1-2)
• Next.js application setup and Azure deployment pipeline
• Basic UI implementation matching provided mockups
• File upload infrastructure with drag-and-drop interface
• Azure Blob Storage integration for file persistence
• JSON file parsing and validation functionality
Phase 2: Core Features (Weeks 3-4)
• Filename collision detection and resolution system
• Upload progress tracking and error handling
• Dashboard implementation with metrics display
• Call log selection and navigation with upload indicators
• Initial Anthropic API integration
Phase 3: Enhancement (Weeks 5-6)
• Advanced upload features (batch processing, retry logic)
• File management system with backup and cleanup
• Advanced compliance analysis features
• Response evaluation system foundation
• UI polish and responsive design implementation
Phase 4: Deployment (Week 7)
• Upload system testing with various file sizes and formats
• Collision resolution testing with edge cases
• Production deployment to Azure Static Web Apps
• Final testing and bug fixes
• Documentation and user guide creation including upload procedures
• Stakeholder demonstration and feedback collection

Success Criteria
Enhanced Technical Success Metrics
• Successful deployment to Azure Static Web Apps with file upload capability
• File upload success rate >99% for valid JSON files under 10MB
• Collision resolution working correctly for all naming strategies
• Integration with Anthropic API achieving >95% uptime
• Upload processing time under 30 seconds for 5MB files
• Dashboard load times under 2 seconds
Enhanced Functional Success Metrics
• Intuitive upload experience validated through user testing
• Accurate collision detection with zero data loss incidents
• Proper file organization in Azure Blob Storage
• Accurate identification of FDCPA violations based on regulatory guidelines
• Meaningful risk scoring aligned with compliance requirements
• Useful AI-generated response suggestions approved by domain experts
Business Success Metrics
• Demonstration of "art of the possible" for AI-powered compliance monitoring with file management
• Streamlined workflow for compliance officers uploading call logs
• Stakeholder approval for concept and technical approach
• Clear pathway identified for potential production implementation
• Cost-effective operation within POC budget constraints including storage costs

Risk Assessment and Mitigation
Enhanced Technical Risks
• File Upload Failures: Network interruptions or Azure service issues
• Mitigation: Implement retry mechanisms, chunked uploads, and progress recovery
• Storage Overflow: Unexpected volume of large file uploads
• Mitigation: Implement storage monitoring, quotas, and cleanup policies
• Filename Collision Bugs: Edge cases in collision detection logic
• Mitigation: Comprehensive testing with various filename patterns and characters
• API Limitations: Anthropic rate limits or service interruptions
• Mitigation: Implement request queuing and retry mechanisms
• Azure Deployment Issues: Static Web Apps configuration challenges
• Mitigation: Early deployment testing and documentation review
Enhanced Business Risks
• Data Security: Sensitive call information in uploaded files
• Mitigation: Encryption implementation, secure storage policies, and access controls
• File Management Complexity: Users confused by collision resolution options
• Mitigation: Intuitive UI design with clear explanations and preview functionality
• Storage Costs: Unexpected Azure Blob Storage charges
• Mitigation: Cost monitoring, storage lifecycle policies, and usage alerts
• Compliance Accuracy: AI misidentification of violations
• Mitigation: Conservative flagging approach and human oversight recommendations
• User Adoption: Interface complexity deterring usage
• Mitigation: Iterative design feedback and simplification focus
