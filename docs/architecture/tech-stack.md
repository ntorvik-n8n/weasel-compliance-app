# Tech Stack
# Weasel Compliance Monitor App

## Frontend Stack

### Core Framework
- **Next.js 14**
  - App Router (not Pages Router)
  - React Server Components
  - API Routes for serverless functions
  - Built-in optimization (images, fonts, scripts)

### Language
- **TypeScript 5.x**
  - Strict mode enabled
  - Full type safety
  - Better IDE support and autocomplete

### UI & Styling
- **React 18**
  - Functional components with hooks
  - Context API for state management
  - Concurrent rendering features

- **Tailwind CSS 3.x**
  - Utility-first CSS framework
  - Custom configuration for brand colors
  - Responsive design utilities
  - Dark mode support (future)

- **shadcn/ui** (Optional)
  - Accessible component library
  - Built on Radix UI primitives
  - Customizable with Tailwind

### File Upload
- **React-Dropzone**
  - Drag-and-drop file upload
  - File validation
  - Multi-file support
  - Progress tracking

### Data Visualization
- **Recharts** (Primary choice)
  - React-based charting library
  - Responsive charts
  - Good TypeScript support
  - Alternatives: Chart.js, Victory

### State Management
- **React Context API**
  - Upload state management
  - Global UI state
  - No additional library needed for POC

## Backend Stack

### Runtime
- **Node.js 20+**
  - LTS version for stability
  - Native ESM support
  - Performance improvements

### API Framework
- **Next.js API Routes**
  - Serverless functions
  - Deployed as Azure Functions
  - Built-in request/response handling

### AI Integration
- **Anthropic Claude API**
  - Model: Claude-3-Sonnet or Claude-3.5-Sonnet
  - REST API integration
  - Streaming support for long responses
  - Rate limiting awareness

### File Storage
- **Azure Blob Storage**
  - Scalable object storage
  - Built-in encryption
  - Hierarchical organization
  - Lifecycle management
  - SDK: @azure/storage-blob

### Monitoring & Logging
- **Azure Application Insights**
  - Performance monitoring
  - Error tracking
  - Custom events and metrics
  - Distributed tracing

### Security
- **Azure Key Vault**
  - Secret management
  - API key storage
  - Connection string storage
  - SDK: @azure/keyvault-secrets

## Development Tools

### Package Management
- **npm** or **pnpm**
  - Dependency management
  - Script runner
  - Lockfile for consistency

### Code Quality
- **ESLint 8.x**
  - JavaScript/TypeScript linting
  - Next.js recommended config
  - Custom rules for project

- **Prettier 3.x**
  - Code formatting
  - Consistent style across team
  - Editor integration

### Testing (Optional for POC)
- **Jest**
  - Unit testing framework
  - Snapshot testing
  - Code coverage

- **React Testing Library**
  - Component testing
  - User-centric testing approach
  - Integration with Jest

### Version Control
- **Git**
  - Distributed version control
  - GitHub for hosting
  - Branch protection rules

## Cloud Infrastructure

### Hosting
- **Azure Static Web Apps**
  - Automatic deployment
  - Global CDN
  - Integrated API functions
  - Custom domains
  - SSL certificates

### Storage
- **Azure Blob Storage**
  - Hot tier for active files
  - Cool tier for archives
  - Redundancy options (LRS, GRS)

### CI/CD
- **GitHub Actions**
  - Automated builds
  - Automated testing
  - Automated deployment
  - Environment secrets

## External Services

### AI Provider
- **Anthropic**
  - Claude API access
  - Pay-per-use pricing
  - Rate limits based on tier
  - API dashboard for monitoring

## Key Dependencies

### Production Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "@anthropic-ai/sdk": "^0.10.0",
  "@azure/storage-blob": "^12.17.0",
  "@azure/keyvault-secrets": "^4.7.0",
  "@azure/monitor-opentelemetry": "^1.0.0",
  "react-dropzone": "^14.2.0",
  "recharts": "^2.10.0",
  "zod": "^3.22.0"
}
```

### Development Dependencies
```json
{
  "typescript": "^5.3.0",
  "@types/node": "^20.0.0",
  "@types/react": "^18.0.0",
  "@types/react-dom": "^18.0.0",
  "eslint": "^8.55.0",
  "eslint-config-next": "^14.0.0",
  "prettier": "^3.1.0",
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0"
}
```

## Browser Support

### Target Browsers
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)

### Required Features
- ES2020+ JavaScript
- CSS Grid and Flexbox
- File API for uploads
- Fetch API for HTTP requests
- LocalStorage for client state

## Performance Characteristics

### Bundle Size Targets
- Initial load: <500 KB (gzipped)
- Per-page code splitting
- Dynamic imports for heavy components
- Tree-shaking for unused code

### Runtime Performance
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Lighthouse Score: >90

## Security Considerations

### Dependencies
- Regular security audits (`npm audit`)
- Automated dependency updates (Dependabot)
- No known critical vulnerabilities

### API Security
- HTTPS only
- API key rotation policy
- Rate limiting on all endpoints
- Input validation with Zod

## Scalability

### Current Limits (POC)
- 5,000 call logs
- 5 concurrent uploads
- 10 MB max file size
- Single region deployment

### Future Scaling Options
- Azure Functions Premium plan
- Azure Cosmos DB for metadata
- Azure CDN for global delivery
- Redis for caching

## Cost Estimates (Monthly)

### Azure Services
- Static Web Apps: $0 (Free tier sufficient for POC)
- Blob Storage: ~$5 (100 GB, hot tier)
- Application Insights: ~$10 (5 GB logs)
- Key Vault: ~$1 (10K transactions)

### Anthropic API
- ~$50-200 depending on usage
- Claude-3-Sonnet: $3 per million input tokens, $15 per million output tokens
- Estimate: 100-500 analyses per month

### Total: ~$66-216/month for POC

## Technology Decisions

### Why Next.js?
- Full-stack React framework
- Excellent DX and performance
- Built-in API routes
- Easy Azure deployment
- Strong ecosystem

### Why TypeScript?
- Type safety reduces bugs
- Better IDE support
- Self-documenting code
- Easier refactoring

### Why Azure?
- Integration with existing infrastructure (if applicable)
- Comprehensive services
- Good Node.js support
- Static Web Apps perfect for Next.js

### Why Anthropic Claude?
- State-of-the-art language understanding
- Strong reasoning capabilities
- Good API documentation
- Reliable service

## Alternatives Considered

### Hosting
- **Vercel**: Excellent Next.js support, but requirement is Azure
- **AWS Amplify**: Good option, but Azure preferred
- **Netlify**: Simpler but less powerful

### AI Provider
- **OpenAI GPT-4**: Similar capabilities, higher cost
- **Google Gemini**: Good performance, less mature API
- **AWS Bedrock**: More complex setup

### Frontend Framework
- **Vanilla React with Vite**: More flexibility, less structure
- **Remix**: Similar to Next.js, smaller ecosystem
- **SvelteKit**: Excellent performance, smaller community

---

All technology choices align with project requirements and team expertise.
