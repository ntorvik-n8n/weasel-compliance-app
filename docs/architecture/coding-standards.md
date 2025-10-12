# Coding Standards
# Weasel - Collections Call Monitor App

## General Principles

1. **Write clear, maintainable code** - Code is read more than it's written
2. **Follow TypeScript best practices** - Leverage strong typing
3. **Keep functions small and focused** - Single responsibility principle
4. **Write self-documenting code** - Use descriptive names
5. **Handle errors gracefully** - Always consider failure cases

## File Naming Conventions

### Components
- **Format**: PascalCase
- **Examples**: `UploadZone.tsx`, `MetricsCard.tsx`, `TranscriptViewer.tsx`

### Utilities and Libraries
- **Format**: kebab-case
- **Examples**: `azure-storage.ts`, `format-utils.ts`, `anthropic-client.ts`

### API Routes
- **Format**: lowercase
- **Examples**: `route.ts` in `/api/upload/route.ts`

### Types
- **Format**: kebab-case
- **Examples**: `call-log.ts`, `analysis.ts`, `upload-state.ts`

## TypeScript Guidelines

### Type Definitions
```typescript
// Prefer interfaces for object shapes
interface CallLog {
  callId: string;
  timestamp: string;
  agent: Agent;
}

// Use type for unions, intersections, or complex types
type Status = 'pending' | 'processing' | 'completed' | 'failed';
type ApiResponse<T> = Success<T> | Error;
```

### Type Safety
- Enable strict mode in `tsconfig.json`
- Avoid `any` - use `unknown` if type is truly unknown
- Use type inference where possible
- Define return types for public functions
- Use generics for reusable components

### Example
```typescript
// Good
function parseCallLog(data: unknown): CallLog {
  // validation logic
  return validatedData;
}

// Avoid
function parseCallLog(data: any): any {
  return data;
}
```

## React Component Guidelines

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react';
import type { CallLog } from '@/types/call-log';

// 2. Types/Interfaces
interface Props {
  callLog: CallLog;
  onAnalyze: (id: string) => void;
}

// 3. Component
export function CallLogCard({ callLog, onAnalyze }: Props) {
  // 4. Hooks
  const [isExpanded, setIsExpanded] = useState(false);

  // 5. Event handlers
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  // 6. Render
  return (
    <div onClick={handleClick}>
      {/* JSX */}
    </div>
  );
}
```

### Component Best Practices
- Use functional components with hooks
- Extract complex logic into custom hooks
- Keep components focused (single responsibility)
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback`
- Use TypeScript for prop types

### Custom Hooks
```typescript
// hooks/useFileUpload.ts
export function useFileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const uploadFile = async (file: File) => {
    // upload logic
  };

  return { files, progress, uploadFile };
}
```

## API Route Guidelines

### Structure
```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Validate request
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 2. Process request
    const result = await processFile(file);

    // 3. Return response
    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    // 4. Handle errors
    console.error('Upload failed:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
```

### Best Practices
- Always validate inputs
- Use try-catch for error handling
- Return consistent response formats
- Log errors for debugging
- Use appropriate HTTP status codes

## Error Handling

### Client-Side
```typescript
// Show user-friendly messages
try {
  await uploadFile(file);
  toast.success('File uploaded successfully');
} catch (error) {
  if (error instanceof ValidationError) {
    toast.error(`Invalid file: ${error.message}`);
  } else {
    toast.error('Upload failed. Please try again.');
  }
  console.error('Upload error:', error);
}
```

### Server-Side
```typescript
// Log detailed errors, return generic messages
try {
  await processFile(file);
} catch (error) {
  logger.error('File processing failed', {
    error,
    fileId: file.id,
    userId: user.id,
  });

  return NextResponse.json(
    { error: 'Processing failed' },
    { status: 500 }
  );
}
```

## Testing Guidelines

### Unit Tests
```typescript
describe('parseCallLog', () => {
  it('should parse valid call log', () => {
    const input = { callId: '123', /* ... */ };
    const result = parseCallLog(input);
    expect(result.callId).toBe('123');
  });

  it('should throw on invalid data', () => {
    expect(() => parseCallLog({})).toThrow(ValidationError);
  });
});
```

### Component Tests
```typescript
import { render, screen } from '@testing-library/react';
import { CallLogCard } from './CallLogCard';

test('displays call log information', () => {
  const callLog = mockCallLog();
  render(<CallLogCard callLog={callLog} />);
  expect(screen.getByText(callLog.callId)).toBeInTheDocument();
});
```

## Code Formatting

### Prettier Configuration
- Use project's Prettier config
- Run `npm run format` before committing
- Set up editor to format on save

### ESLint Rules
- Follow project's ESLint configuration
- Fix linting errors before committing
- Run `npm run lint` to check

## Git Commit Guidelines

### Commit Message Format
```
type(scope): brief description

Longer description if needed

- Detail 1
- Detail 2
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(upload): add drag-and-drop file upload
fix(analysis): correct risk score calculation
docs(readme): update installation instructions
refactor(api): simplify error handling logic
```

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Validate all inputs** - Especially file uploads
3. **Sanitize filenames** - Prevent path traversal
4. **Use parameterized queries** - Prevent injection attacks
5. **Implement rate limiting** - Prevent abuse
6. **Log security events** - For audit trail

## Performance Guidelines

1. **Lazy load components** - Use dynamic imports
2. **Memoize expensive operations** - useMemo, useCallback
3. **Optimize images** - Next.js Image component
4. **Minimize bundle size** - Tree-shaking, code splitting
5. **Use virtualization** - For long lists
6. **Cache API responses** - Where appropriate

## Accessibility

1. **Use semantic HTML** - `<button>`, `<nav>`, etc.
2. **Add ARIA labels** - For screen readers
3. **Ensure keyboard navigation** - Tab order, focus states
4. **Maintain color contrast** - WCAG 2.1 AA standards
5. **Test with screen readers** - VoiceOver, NVDA

## Documentation

### Code Comments
```typescript
// Good: Explain WHY, not WHAT
// Use exponential backoff to handle rate limiting
const delay = Math.min(1000 * Math.pow(2, retries), 30000);

// Avoid: State the obvious
// Set delay variable
const delay = 1000;
```

### JSDoc for Public APIs
```typescript
/**
 * Analyzes a call log for FDCPA compliance violations.
 *
 * @param callLog - The call log to analyze
 * @returns Analysis result with risk scores and violations
 * @throws {ValidationError} If call log format is invalid
 */
export async function analyzeCallLog(
  callLog: CallLog
): Promise<AnalysisResult> {
  // implementation
}
```

## Environment Variables

### Naming Convention
- Use UPPERCASE with underscores
- Group related variables with prefixes
- Document all variables in `.env.example`

### Example
```bash
# Anthropic API
ANTHROPIC_API_KEY=sk-...

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=...
AZURE_STORAGE_CONTAINER_NAME=call-logs

# Application
MAX_FILE_SIZE_MB=10
MAX_CONCURRENT_UPLOADS=5
```

## Code Review Checklist

Before submitting code for review:

- [ ] Code follows style guidelines
- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] No console.logs in production code
- [ ] No sensitive data in code
- [ ] Tests pass (if applicable)
- [ ] Linting passes
- [ ] Code is formatted
- [ ] Documentation is updated
- [ ] Environment variables are documented

---

**Remember**: Clean code is not about following rules blindly, but about making code easy to understand and maintain.
