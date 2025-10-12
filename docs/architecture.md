# Architecture Document
# Collections Call Monitor Evaluation App - "Weasel"

## Executive Summary

The Weasel application is a Next.js 14-based web application that analyzes debt collection call transcripts for FDCPA compliance using AI-powered analysis through the Anthropic Claude API deployed to Azure Static Web Apps with Azure Blob Storage for file persistence.

## Technology Stack

### Frontend
- Framework: Next.js 14 with App Router
- Language: TypeScript 5.x
- Styling: Tailwind CSS 3.x
- File Upload: React-Dropzone
- State Management: React Context API
- Charts: Recharts

### Backend
- Runtime: Node.js 20+
- API Routes: Next.js serverless functions
- AI Processing: Anthropic Claude API
- File Storage: Azure Blob Storage
- Monitoring: Azure Application Insights
- Security: Azure Key Vault

## Component Architecture

See claude.md for full directory structure and component organization.

## Data Models

### Call Log Schema
TypeScript interface for uploaded JSON files - see claude.md

### AI Analysis Response Schema
TypeScript interface for analysis results - see claude.md

## API Endpoints

- POST /api/upload - Upload call log files
- POST /api/analyze - Trigger AI analysis
- GET /api/files - List all files
- GET /api/files/[fileId] - Get specific file and analysis

## Security

- Encryption at rest (Azure Blob Storage)
- Encryption in transit (HTTPS/TLS)
- API key management (Azure Key Vault)
- Input validation and sanitization
- Rate limiting

## Performance Targets

- File upload: <10 seconds for 5MB files
- AI analysis: <30 seconds for 10-minute transcripts
- Dashboard load: <2 seconds
- Concurrent uploads: Support up to 5 files

## Deployment

Azure Static Web Apps with GitHub Actions CI/CD pipeline.

See claude.md for complete architectural details.
