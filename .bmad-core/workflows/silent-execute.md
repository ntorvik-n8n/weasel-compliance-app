# Silent Execute Workflow
<!-- Powered by BMAD™ Core -->

## Workflow Metadata
```yaml
id: silent-execute
name: Silent Autonomous Execution
version: 1.0
icon: 🔇
description: Zero-input workflow that executes tasks silently and reports only when complete or blocked
whenToUse: For routine tasks, bug fixes, or implementation where you trust the agent completely
requiredAgents: [dev, qa]
estimatedTime: variable
autonomyLevel: maximum
userInputRequired: none
reportingMode: summary-only
```

## Overview

**The most autonomous workflow available.**

Once initiated, this workflow:
- Operates completely silently
- Makes all decisions independently
- Only reports when complete or critically blocked
- Maximizes throughput by eliminating interruptions
- Uses TodoWrite to track progress (user can monitor if desired)

**Perfect for:**
- Routine bug fixes
- Implementing well-defined stories
- Refactoring tasks
- Documentation updates
- Test creation
- Code quality improvements

---

## How It Works

### Initiation
```
User: *workflow silent-execute <task-description>
Agent: 🔇 Silent execution started. Working...
[Agent works autonomously]
Agent: ✅ Complete. [Summary report]
```

### During Execution
- **No status updates** (unless requested with `*plan-status`)
- **No confirmation requests** (auto-approves all standard operations)
- **No questions** (makes best-judgment decisions)
- **Silent commits** (with descriptive messages)
- **Background testing** (validates without announcing)

### User Can Check Progress
While workflow runs silently, user can optionally:
- `*plan-status` - Check current progress
- `*exit` - Stop workflow and get current state
- Otherwise, just wait for completion report

---

## Autonomous Decision Framework

### What the workflow WILL do automatically:
✅ Read any files needed
✅ Write/edit code to implement features or fix bugs
✅ Run tests and fix failures
✅ Install dependencies if needed
✅ Update documentation
✅ Commit changes with clear messages
✅ Create new files when necessary
✅ Refactor code for quality
✅ Add error handling
✅ Fix linting/type errors
✅ Update types/interfaces

### What the workflow will NOT do (stops and reports):
🛑 Delete databases or production data
🛑 Deploy to production without explicit instruction
🛑 Make API calls that incur significant cost
🛑 Modify authentication/security systems without review
🛑 Change environment variables for sensitive services

### When Blocked
If workflow encounters an unresolvable issue:
```
⚠️ Silent execution blocked at step 4/7
Issue: Missing AZURE_STORAGE_CONNECTION_STRING
Required: User must provide environment variable
Progress saved. Resume with: *workflow resume
```

---

## Workflow Phases

### Phase 1: Silent Planning (Auto)
1. Parse task description
2. Identify required agents/tasks
3. Break into concrete steps
4. Create todo list (visible with `*plan-status`)
5. Begin execution immediately

### Phase 2: Silent Execution (Auto)
1. Execute each step sequentially
2. Update todo list as progress occurs
3. Handle errors and retry automatically
4. Make judgment calls on ambiguous decisions
5. Optimize for completion over perfection

### Phase 3: Silent Validation (Auto)
1. Run relevant tests
2. Verify acceptance criteria met
3. Check code quality (lint, types)
4. Validate documentation updated

### Phase 4: Silent Completion (Report)
1. Commit all changes
2. Generate concise summary
3. Report to user with:
   - What was accomplished
   - Files changed
   - Tests status
   - Next recommended steps

---

## Usage Examples

### Example 1: Fix Known Bug
```
User: *workflow silent-execute fix the upload failure described in STATUS_RESUME.md

Agent: 🔇 Silent execution started. Working...
[20 minutes pass]
Agent: ✅ Complete.

Fixed upload failure caused by duration parsing.
- Modified: lib/callLogParsing.ts
- Tests: 15/15 passing
- Verified: End-to-end upload works
- Committed: "fix: handle HH:MM:SS duration format in call logs"

Ready for Epic 3 QA validation.
```

### Example 2: Implement Story
```
User: *workflow silent-execute implement story 4.1 dashboard layout

Agent: 🔇 Silent execution started. Working...
[45 minutes pass]
Agent: ✅ Complete.

Implemented Story 4.1: Dashboard Layout
- Created: components/dashboard/DashboardLayout.tsx
- Created: components/dashboard/MetricsCard.tsx
- Created: components/dashboard/ComplianceOverview.tsx
- Modified: app/page.tsx (integrated dashboard)
- Tests: Created 12 unit tests, all passing
- Committed: "feat: add dashboard layout with metrics cards (Story 4.1)"

Next: Story 4.2 - Analysis Summary Visualization
```

### Example 3: Multiple Tasks
```
User: *workflow silent-execute fix all linting errors, update documentation, and add missing unit tests

Agent: 🔇 Silent execution started. Working...
[35 minutes pass]
Agent: ✅ Complete.

Completed 3 tasks:
1. Linting: Fixed 47 errors across 12 files
2. Documentation: Updated README.md and 4 story files
3. Testing: Added 23 unit tests (coverage: 67% → 89%)

All commits pushed. Build passing.
```

---

## Integration with TodoWrite

The workflow uses TodoWrite internally to track progress:

```yaml
todos:
  - content: "Analyze STATUS_RESUME.md for context"
    status: completed
  - content: "Test upload with sample file"
    status: completed
  - content: "Fix parseCallLogMetadata duration handling"
    status: in_progress
  - content: "Verify background processing"
    status: pending
  - content: "Run end-to-end tests"
    status: pending
```

User can check with `*plan-status` anytime.

---

## Safety Features

Despite being autonomous, the workflow includes safeguards:

1. **Automatic Rollback** - If critical test fails, reverts changes
2. **Checkpoint Commits** - Commits after each major step
3. **Error Logging** - All errors logged to `.ai/debug-log.md`
4. **State Preservation** - Can resume if interrupted
5. **Validation Gates** - Must pass tests before marking complete

---

## When to Use This Workflow

### ✅ Great for:
- Well-defined bug fixes
- Implementing completed designs
- Routine maintenance tasks
- Code quality improvements
- Documentation updates
- Adding tests
- Refactoring with clear goals

### ❌ Not recommended for:
- Exploratory work
- Architectural decisions
- First-time implementations
- Security-critical changes
- When you want to learn the process
- Ambiguous requirements

---

## Comparison with Other Workflows

| Feature | Silent Execute | Auto-Resolve | Standard Dev |
|---------|---------------|--------------|--------------|
| User Input | None | Minimal | Frequent |
| Status Updates | End only | Per phase | Per action |
| Confirmations | None | 1-2 | Multiple |
| Speed | Fastest | Fast | Moderate |
| Control | Lowest | Medium | Highest |
| Best For | Routine tasks | Critical bugs | Complex work |

---

## Advanced Usage

### Resume After Interruption
```
*workflow resume
```

### Check Progress Without Interrupting
```
*plan-status
```

### Chain Multiple Silent Workflows
```
*workflow silent-execute fix upload bug
*workflow silent-execute run Epic 3 QA
*workflow silent-execute start Epic 4 Story 1
```

### Combine with YOLO Mode (Maximum Speed)
```
*yolo
*workflow silent-execute implement all remaining Epic 3 stories
```

---

## Output Format

### Completion Report Structure:
```
✅ Complete.

<One-line summary of what was accomplished>

Changes:
- <File1>: <What changed>
- <File2>: <What changed>

Tests: <X/Y passing>
Quality: <Lint/Type status>
Commits: "<Commit message>"

<Next recommended action>
```

### Blocked Report Structure:
```
⚠️ Blocked at <step description>

Issue: <Clear explanation>
Required: <What user must provide>

Progress:
- ✅ <Completed steps>
- 🛑 <Blocked step>
- ⏸️ <Pending steps>

Resume with: *workflow resume
```

---

## Tips for Success

1. **Provide clear initial instructions** - The clearer your task description, the better the results
2. **Trust the process** - Resist urge to check status constantly
3. **Review commits afterward** - Understand what changed and why
4. **Use for appropriate tasks** - Match task complexity to workflow autonomy level
5. **Maintain good status docs** - Helps workflow understand context

---

## Troubleshooting

**Q: Workflow completed but missed something?**
A: Run again with more specific instructions, or switch to standard dev workflow for precision.

**Q: Workflow seems stuck?**
A: Check `*plan-status` - it may be working on a long step. Wait for completion or blocked report.

**Q: Want to stop mid-workflow?**
A: Use `*exit` to gracefully stop and get current progress report.

**Q: Results not what you expected?**
A: This workflow optimizes for speed over perfection. Review output and refine if needed, or use auto-resolve for more control.

---

*Created: 2025-10-11*
*Last Updated: 2025-10-11*
