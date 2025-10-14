# Silent Auto-Resolve Workflow
<!-- Powered by BMAD™ Core -->

## Workflow Metadata
```yaml
id: silent-auto-resolve
name: Silent Autonomous Resolution
version: 2.0
icon: 🤖🔇
description: Zero-input workflow that autonomously detects, diagnoses, fixes, and validates all project issues silently - specialized for Weasel (Collections Call Monitor) Azure deployment
whenToUse: When you want complete autonomous project health maintenance with zero interaction, especially for fixing Azure deployment issues and simplifying storage architecture
requiredAgents: [dev, qa]
estimatedTime: 15-120 minutes (variable based on findings)
autonomyLevel: maximum
userInputRequired: none
reportingMode: completion-only
projectContext: Weasel Compliance Monitor (Next.js 15 + Anthropic + Azure)
```

## Overview

**The ultimate autonomous workflow - combining intelligence with silence.**

This workflow merges the best of `auto-resolve` (autonomous problem detection) and `silent-execute` (zero-interruption execution):

- 🔍 **Auto-detects** all project issues, blockers, and failing tests
- 🔇 **Operates silently** - no status updates, no confirmations
- 🤖 **Fixes everything** autonomously using best judgment
- ✅ **Validates thoroughly** before reporting
- 📊 **Reports once** - comprehensive summary when done

**Perfect for:**
- **Fixing Azure deployment AI inferencing issues** (local works, cloud fails)
- **Simplifying storage architecture** (removing date partitioning)
- Daily project health maintenance
- Overnight autonomous cleanup
- Pre-deployment health checks
- Post-merge issue resolution
- "Fix everything" scenarios
- When you trust the agent completely

---

## How It Works

### Initiation
```
User: *workflow silent-auto-resolve

Agent: 🤖🔇 Silent auto-resolve activated. Analyzing project...
       Will report when complete or blocked.

[Agent works autonomously for 15-120 minutes]

Agent: ✅ Silent auto-resolve complete.

       [Comprehensive report with all fixes]
```

### During Execution
- **Complete silence** - No updates unless critically blocked
- **Autonomous decisions** - Makes all choices independently
- **Comprehensive scope** - Fixes everything found, not just one issue
- **Smart prioritization** - Handles critical blockers first
- **Continuous validation** - Tests after each fix
- **Rollback safety** - Reverts if validation fails

### User Can (Optionally) Check Progress
While workflow runs silently:
- `*plan-status` - View current progress without interrupting
- `*exit` - Gracefully stop and get current state report
- Otherwise, do other work and wait for completion

---

## Autonomous Detection & Resolution Scope

### What the Workflow Autonomously Detects:

#### 🔴 **Critical Issues** (Fixed First)
- **Azure deployment AI inferencing failures** (Anthropic API not working in Static Web App/Container)
- **Azure Blob Storage architecture issues** (date-partitioned vs flat structure)
- **Local vs Cloud environment parity** (different backend storage accounts)
- Build failures
- Type errors preventing compilation
- Runtime errors in recent commits
- Failed tests blocking progress
- Missing critical environment variables
- Broken API endpoints
- File upload/storage failures
- Database connection issues

#### 🟡 **Quality Issues** (Fixed Second)
- Linting errors and warnings
- Code formatting inconsistencies
- Missing error handling
- Incomplete type definitions
- Unused imports and variables
- Console.log statements in production code
- TODO comments with actionable items

#### 🟢 **Maintenance Tasks** (Fixed Third)
- Outdated documentation
- Missing unit tests for new features
- Code duplication opportunities
- Performance optimization candidates
- Security vulnerabilities (dependency updates)
- Accessibility issues
- Missing or incomplete comments

### What Gets Fixed Automatically:

✅ **Code Issues**
- Type errors and interface mismatches
- Import path corrections
- Missing dependencies installation
- Syntax errors
- Async/await issues
- Error handling gaps

✅ **Tests**
- Failing unit tests
- Broken integration tests
- Missing test coverage for new code
- Outdated test snapshots
- Mock data issues

✅ **Configuration**
- Invalid environment variables (using safe defaults)
- Misconfigured API routes
- Broken build configurations
- Incorrect TypeScript settings

✅ **Documentation**
- Outdated README sections
- Missing API documentation
- Incorrect code examples
- Stale status documents

✅ **Code Quality**
- ESLint violations
- Prettier formatting
- Unused code removal
- Import organization
- Type assertion improvements

---

## Autonomous Decision Framework

### Auto-Approve (No user input):
✅ All code fixes (syntax, types, logic)
✅ Test creation and updates
✅ Documentation updates
✅ Dependency installation (npm/yarn)
✅ Linting and formatting
✅ Git commits with clear messages (triggers auto-deployment to Azure)
✅ File creation/modification
✅ Configuration fixes (non-security)
✅ Performance optimizations
✅ Error handling improvements
✅ Refactoring for code quality
✅ Azure resource verification (read-only checks)

### Auto-Deploy Behavior:
⚡ **Important:** When commits are pushed to the repository, Azure Static Web Apps automatically deploys changes
⚡ The workflow will commit fixes, which triggers Azure CI/CD pipeline
⚡ Validation includes testing in deployed Azure environment after auto-deployment completes
⚡ Both Static Web App and Container App deployments are monitored

### Stop and Report (Requires user):
🛑 Missing critical secrets (API keys not in environment)
🛑 Database schema migrations
🛑 Breaking API changes requiring user decision
🛑 Manual production deployments (auto-deployment via git is OK)
🛑 Cost-incurring operations beyond normal usage
🛑 Destructive data operations
🛑 Security system modifications
🛑 When multiple valid approaches exist with significant trade-offs

---

## Workflow Phases

### Phase 0: Safety Preparation (Auto)
**Duration:** 1 minute

**Actions:**
1. **Create Safety Branch:**
   - Check current git branch (`git branch --show-current`)
   - Create new feature branch with timestamp: `git checkout -b workflow/silent-auto-resolve-YYYYMMDD-HHMMSS`
   - **Purpose:** Preserves the current codebase state for easy rollback
   - **Rollback:** If issues occur, simply `git checkout <original-branch>` to return to pre-workflow state
   - **Branch naming:** `workflow/silent-auto-resolve-20251014-143027` (example)

2. **Verify Clean State:**
   - Run `git status` to check for uncommitted changes
   - If uncommitted changes exist, stash them: `git stash save "Pre-workflow stash at $(date)"`
   - Document stash hash for potential recovery

3. **Safety Notes:**
   - Original branch remains untouched until workflow completes successfully
   - All commits happen on the new feature branch
   - User can merge or discard feature branch after reviewing results
   - Auto-deployment to Azure will occur from feature branch (user can revert if needed)

**Output:** New feature branch created, clean working directory, original state preserved

---

### Phase 1: Silent Project Analysis (Auto)
**Duration:** 3-5 minutes

**Actions:**
1. **Read project context:**
   - STATUS_RESUME.md or equivalent for current blockers
   - CLAUDE.md for project architecture and requirements
   - docs/prd.md for product requirements understanding

2. **Analyze deployment environment:**
   - Check Azure Static Web App status: https://salmon-hill-0ca04f60f.2.azurestaticapps.net
   - Check Azure Container App status: https://billcollector-hill-gvbybeach-985d7362.westus2.azurecontainerapps.io/
   - Compare local vs cloud behavior
   - Identify AI inferencing failures in Azure

3. **Inspect storage architecture:**
   - Review current blob storage structure (date-partitioned)
   - Identify complexity in raw/processed/backups containers
   - Assess impact of simplifying to flat structure

4. **Standard health checks:**
   - Run git status to check uncommitted changes
   - Analyze recent commits for patterns
   - Review error logs and debug files
   - Check build status (npm run build)
   - Run test suite to identify failures
   - Scan for linting errors (npm run lint)
   - Check TypeScript compilation
   - Verify API routes functionality
   - Assess documentation currency

**Output:** Internal priority matrix (not shown to user)

---

### Phase 2: Silent Issue Prioritization (Auto)
**Duration:** 1-2 minutes

**Actions:**
1. Categorize issues by severity (Critical → Quality → Maintenance)
2. Identify dependencies between fixes
3. Create execution plan optimizing for:
   - Unblocking critical functionality first
   - Minimizing rework (fix root causes before symptoms)
   - Maximizing test coverage
4. Initialize TodoWrite tracking (visible with `*plan-status`)

**Output:** Internal execution plan

---

### Phase 3: Silent Autonomous Execution (Auto)
**Duration:** 10-90 minutes (varies by issues found)

**Actions:**

1. **Fix Weasel-Specific Critical Issues:**

   a. **Azure AI Inferencing Fix:**
   - Diagnose why Anthropic API works locally but fails in Azure deployments
   - Check environment variable propagation to Azure (Static Web App and Container App)
   - Verify API key format and accessibility in serverless functions
   - Test API calls in Azure context vs local context
   - Fix any Azure-specific CORS, timeout, or networking issues
   - Ensure proper error handling and logging in production
   - Validate fix works in both deployment targets

   b. **Storage Architecture Simplification:**
   - Refactor blob storage from date-partitioned (`YYYY/MM/DD/`) to flat structure
   - Update from separate containers (`call-logs-raw`, `call-logs-processed`, `call-logs-backups`) to simplified `raw` and `processed`
   - Modify `lib/azure-storage.ts` to remove date segmentation logic
   - Update API routes: `/api/upload`, `/api/process`, `/api/files/[filename]`
   - Ensure local and cloud environments use same storage account (DELETE's appears to be working)
   - No data migration needed (all files are in `sample-files/` directory)
   - Update metadata handling to work with flat structure
   - Simplify filename collision logic without date partitioning

   c. **Environment Parity:**
   - Ensure `.env.local` configuration matches Azure App Settings
   - Verify both local and cloud use same `AZURE_STORAGE_CONNECTION_STRING`
   - Test that storage operations behave identically in both environments

2. **Fix Standard Critical Issues:**
   - Address build failures
   - Fix type errors
   - Resolve runtime errors
   - Fix failing tests
   - Unblock API routes

3. **Improve Code Quality:**
   - Fix linting errors
   - Apply consistent formatting
   - Add missing error handling
   - Complete type definitions
   - Remove unused code

4. **Enhance Maintainability:**
   - Update documentation (CLAUDE.md, README.md, architecture docs)
   - Add missing unit tests for refactored storage code
   - Improve code comments
   - Refactor duplicated code
   - Update dependencies (if safe)

5. **After Each Fix:**
   - Run relevant tests (unit and integration)
   - Test locally with `npm run dev`
   - Verify no regressions
   - Update TodoWrite progress
   - Commit with descriptive message following git conventions
   - Log action to debug log
   - Auto-deploy to Azure via git push triggers

6. **Error Handling:**
   - Retry failures once
   - Rollback if validation fails
   - Skip non-critical failures
   - Document unresolved issues requiring user intervention

---

### Phase 4: Silent Comprehensive Validation (Auto)
**Duration:** 5-15 minutes

**Actions:**

1. **Weasel-Specific Validation:**
   - **Test Azure AI Inferencing:**
     - Upload sample file from `sample-files/standard-call.json`
     - Verify upload progresses through all stages (uploaded → processing → analyzed)
     - Confirm metadata changes from "uploaded" to final analysis state
     - Validate AI analysis completes successfully in Azure (not just locally)
     - Check analysis results appear correctly in processed container

   - **Test Storage Architecture:**
     - Upload test file and verify it lands in flat `raw` container (not date-partitioned)
     - Verify processing moves file to flat `processed` container
     - Test file listing API returns correct files without date logic
     - Confirm filename collision handling works with new flat structure
     - Verify DELETE operations work (already confirmed working)

   - **Test Environment Parity:**
     - Run same test locally (`npm run dev`)
     - Run same test in Azure Static Web App (https://salmon-hill-0ca04f60f.2.azurestaticapps.net)
     - Compare results - should be identical
     - Verify both use same backend storage account

2. **Create/Update Unit Tests:**
   - Unit tests for refactored `lib/azure-storage.ts` (flat structure)
   - Unit tests for updated API routes
   - Unit tests for filename collision handling (without dates)
   - Integration tests for end-to-end upload → process → analyze flow
   - Mock tests for Anthropic API calls

3. **QA Validation Gate:**
   - Run complete test suite (unit + integration)
   - Verify build succeeds (`npm run build`)
   - Check linting passes (`npm run lint`)
   - Validate TypeScript compilation (`tsc --noEmit`)
   - Test critical user flows:
     - File upload via drag-and-drop
     - File processing and AI analysis
     - File listing and viewing
     - File deletion
   - Review git diff for unintended changes
   - Verify documentation accuracy (CLAUDE.md, README.md)
   - Confirm STATUS_RESUME.md reflects current state

**Output:** Validation results (reported in final summary)

---

### Phase 5: Completion Report (Report)
**Duration:** 1 minute

**Generate comprehensive summary:**
- Issues found and resolved
- Files modified with change descriptions
- Test results (before → after)
- Build status
- Commits created
- Unresolved issues (if any)
- Recommended next steps

---

## Integration with BMad Method

### Uses:
- **Developer agent** for code fixes and implementation
- **QA agent** for test creation and validation
- **TodoWrite** for progress tracking (optional monitoring)
- **Debug logging** (`.ai/debug-log.md`) for detailed action log
- **Status documents** (STATUS_RESUME.md) for context and updates
- **Git workflow** for commits and change tracking
- **Azure CLI tools** for deployment verification:
  - `az` - Azure CLI for resource management
  - `swa` - Static Web Apps CLI for deployment
  - `gh` - GitHub CLI for repo management
  - `git` - Version control and auto-deployment trigger

### Updates:
- **STATUS_RESUME.md** with current project state and resolved blockers
- **CLAUDE.md** with updated storage architecture (removing date partition notes)
- **README.md** with current deployment URLs and configuration
- **docs/architecture/** files reflecting simplified storage design
- **Debug log** (`.ai/debug-log.md`) with all actions taken
- **Test coverage metrics** from QA validation
- **Environment configuration** documentation (`.env.example` if needed)

---

## Usage Examples

### Example 1: Weasel Azure AI Inferencing Fix
```
User: *workflow silent-auto-resolve

Agent: 🤖🔇 Silent auto-resolve activated. Analyzing project...
       Created feature branch: workflow/silent-auto-resolve-20251014-143027
       Will report when complete or blocked.

[75 minutes pass - user continues other work]

Agent: ✅ Silent auto-resolve complete.

Weasel Azure Deployment Fix - 75 minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Branch: workflow/silent-auto-resolve-20251014-143027 (main preserved)

🔴 Critical Issues Fixed: 3

1. **Azure AI Inferencing Restored** ✅
   - Diagnosed: Anthropic API timeout in Azure serverless functions (default 30s)
   - Fixed: Updated API route timeout configuration for Azure
   - Fixed: Added proper error handling and retry logic
   - Fixed: Environment variable propagation to Azure Function context
   - Validated: AI analysis now works in both Static Web App and Container App
   - Test Result: Uploaded standard-call.json → analyzed successfully in 28s

2. **Storage Architecture Simplified** ✅
   - Removed: Date-partitioned structure (YYYY/MM/DD/)
   - Implemented: Flat structure in `raw` and `processed` containers
   - Refactored: lib/azure-storage.ts (removed 150 lines of date logic)
   - Updated: All API routes to use flat storage
   - Simplified: Filename collision handling (timestamp append only)
   - Migration: None needed (all files in sample-files/)

3. **Environment Parity Achieved** ✅
   - Verified: Both local and Azure use same storage account
   - Confirmed: AZURE_STORAGE_CONNECTION_STRING matches in all environments
   - Tested: Upload/process/delete operations identical in both environments

🟡 Quality Improvements: 12
- Added comprehensive error logging for Azure diagnostics
- Created unit tests for refactored storage module (18 new tests)
- Added integration tests for upload → analyze flow (5 new tests)
- Improved TypeScript types for storage operations
- Added JSDoc comments to azure-storage.ts functions
- Fixed 7 ESLint warnings

🟢 Maintenance: 6
- Updated CLAUDE.md (removed date partition references, added flat structure notes)
- Updated README.md with current Azure deployment URLs
- Updated docs/architecture/storage.md with simplified design
- Created migration notes (no action needed, documented for reference)
- Updated .env.example with Azure configuration
- Added troubleshooting section to docs for Azure deployment

Files Modified: 15
- src/lib/azure-storage.ts (major refactor: -150 lines, +80 lines)
- src/app/api/upload/route.ts (updated storage calls)
- src/app/api/process/[filename]/route.ts (timeout config, error handling)
- src/app/api/files/route.ts (flat structure listing)
- src/app/api/files/[filename]/route.ts (updated deletion logic)
- tests/azure-storage.test.ts (18 new unit tests)
- tests/integration/upload-flow.test.ts (5 new integration tests)
- CLAUDE.md (architecture updates)
- README.md (deployment info)
- docs/architecture/storage.md (simplified design)
- ... 5 more files

Tests: 68/68 passing (was 45/45, added 23 new) ✅
Build: Success ✅
Lint: Clean ✅
Coverage: 72% → 86%

Azure Validation:
✅ Static Web App (salmon-hill-0ca04f60f.2.azurestaticapps.net): Working
✅ Container App (billcollector-hill-gvbybeach-985d7362.westus2.azurecontainerapps.io): Working
✅ AI Inferencing: Operational in both environments
✅ Storage Operations: Identical behavior local vs cloud
✅ Sample Upload Test: PASSED (end-to-end in Azure)

Commits:
- "fix: resolve Anthropic API timeout in Azure serverless functions"
- "refactor: simplify blob storage from date-partitioned to flat structure"
- "feat: improve error handling and logging for Azure diagnostics"
- "test: add comprehensive unit and integration tests for storage refactor"
- "docs: update architecture docs to reflect simplified storage design"

Next Steps:
- Review changes: `git diff main`
- Test locally on feature branch before merging
- If satisfied, merge to main: `git checkout main && git merge workflow/silent-auto-resolve-20251014-143027`
- If not satisfied, rollback: `git checkout main` (feature branch remains for reference)
- Monitor Azure deployments for 24h to ensure stability
- Consider adding Application Insights for production monitoring
- Test with additional sample files to verify robustness

Rollback Instructions (if needed):
```bash
git checkout main  # Return to original state
git branch -D workflow/silent-auto-resolve-20251014-143027  # Delete feature branch (optional)
```

🎉 The Weasel app is now fully operational in Azure with AI inferencing working correctly!
Both local and cloud environments use the same simplified storage architecture.
Original codebase preserved on 'main' branch for safety.
```

### Example 2: Daily Health Check
```
User: *workflow silent-auto-resolve

Agent: 🤖🔇 Silent auto-resolve activated. Analyzing project...
       Will report when complete or blocked.

[30 minutes pass - user continues other work]

Agent: ✅ Silent auto-resolve complete.

Project Health Check - 30 minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 Critical Issues Fixed: 2
- Build failure due to missing import in analysis.ts
- 3 failing tests in upload.test.ts

🟡 Quality Improvements: 15
- Fixed 12 ESLint errors
- Added error handling to 3 API routes
- Completed TypeScript types in 2 files

🟢 Maintenance: 8
- Updated README with new API endpoints
- Added 5 missing unit tests
- Removed 3 unused utility functions

Files Modified: 12
- lib/analysis.ts (fixed imports, added types)
- components/UploadZone.tsx (linting fixes)
- app/api/upload/route.ts (error handling)
- tests/upload.test.ts (fixed assertions)
- README.md (updated API docs)
- ... 7 more files

Tests: 45/48 passing (was 42/48) ✅
Build: Success ✅
Lint: Clean ✅
Coverage: 78% → 84%

Commits:
- "fix: resolve build failure with missing analysis import"
- "test: fix failing upload test assertions"
- "refactor: improve error handling in API routes"
- "docs: update README with current API endpoints"
- "chore: lint fixes and unused code removal"

Next Steps:
- Review commits and validate changes
- 3 tests still failing in integration suite (require manual review)
- Consider addressing TODO in callLogParsing.ts (performance optimization)

Ready for continued development! 🚀
```

### Example 2: Post-Merge Cleanup
```
User: *workflow silent-auto-resolve

Agent: 🤖🔇 Silent auto-resolve activated. Analyzing project...
       Will report when complete or blocked.

[15 minutes pass]

Agent: ✅ Silent auto-resolve complete.

Post-Merge Resolution - 15 minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 Critical Issues Fixed: 1
- Merge conflict remnants in dashboard.tsx

🟡 Quality Improvements: 8
- Resolved 5 duplicate imports from merge
- Fixed 3 type conflicts from updated interfaces

🟢 Maintenance: 3
- Updated changelog with merge info
- Regenerated package-lock.json
- Updated STATUS_RESUME.md

Files Modified: 6
Tests: 48/48 passing ✅
Build: Success ✅

All merge issues resolved. Clean to proceed! ✨
```

### Example 3: Blocked Scenario
```
User: *workflow silent-auto-resolve

Agent: 🤖🔇 Silent auto-resolve activated. Analyzing project...
       Will report when complete or blocked.

[12 minutes pass]

Agent: ⚠️ Silent auto-resolve blocked at validation phase

Issue: Missing ANTHROPIC_API_KEY prevents integration tests
Required: Set environment variable in .env.local

Progress Completed:
✅ Fixed 3 type errors
✅ Resolved 8 linting issues
✅ Updated 2 test files
✅ Fixed build configuration
✅ All unit tests passing (35/35)

Blocked:
🛑 Integration tests require API key (13 tests skipped)

Commits Created:
- "fix: resolve type errors in analysis components"
- "chore: lint fixes and formatting"
- "test: update test mocks with new interfaces"

Actions Required:
1. Add ANTHROPIC_API_KEY to .env.local
2. Resume with: *workflow resume

Alternatively, run: *workflow silent-auto-resolve --skip-integration
```

---

## Advanced Options

### Skip Integration Tests
```
*workflow silent-auto-resolve --skip-integration
```
Runs only unit tests, skips integration tests requiring external services.

### Focus on Specific Area
```
*workflow silent-auto-resolve --focus=api
*workflow silent-auto-resolve --focus=frontend
*workflow silent-auto-resolve --focus=tests
```
Limits scope to specific project areas.

### Maximum Speed Mode
```
*yolo
*workflow silent-auto-resolve
```
Combines with YOLO mode for absolute maximum speed (skips all safety confirmations).

---

## Safety Features

Despite maximum autonomy, includes robust safeguards:

1. **Feature Branch Isolation** - Creates timestamped feature branch before starting, original branch untouched
2. **Checkpoint Commits** - Commits after each major fix
3. **Automatic Rollback** - Reverts if tests fail after fix
4. **Validation Gates** - Must pass tests before proceeding
5. **Error Logging** - Complete action log in debug file
6. **State Preservation** - Can resume if interrupted
7. **Smart Skipping** - Skips issues that can't be resolved
8. **Change Limits** - Won't modify more than 50 files without warning
9. **Easy Rollback** - Simply checkout original branch to undo all changes
10. **Backup Strategy** - Git history preserves all states

---

## When to Use This Workflow

### ✅ **Perfect for:**
- Daily project maintenance
- Post-merge cleanup
- Pre-deployment health checks
- "Fix everything" requests
- Overnight autonomous work
- Unblocking development
- Routine quality maintenance
- After dependency updates

### ✅ **Also good for:**
- When you're away and want progress
- When you trust the agent completely
- When you have comprehensive tests
- When documentation is current

### ❌ **Not recommended for:**
- First-time project setup
- Major architectural changes
- When learning the codebase
- Security-critical modifications
- Ambiguous requirements
- Projects without tests
- When you want to understand each change

---

## Comparison with Other Workflows

| Feature | Silent Auto-Resolve | Auto-Resolve | Silent Execute |
|---------|-------------------|--------------|----------------|
| User Input | **None** | Minimal (1-2) | None |
| Task Detection | **Autonomous** | Autonomous | User-specified |
| Status Updates | End only | Per phase | End only |
| Scope | **All issues** | All issues | Single task |
| Speed | Fast | Moderate | **Fastest** |
| Intelligence | **Highest** | High | Moderate |
| Control | Lowest | Medium | Low |
| Best For | **Daily maintenance** | Critical blockers | Known tasks |

---

## Monitoring Progress (Optional)

### Check Status Without Interrupting
```
*plan-status
```

Shows current TodoWrite progress:
```yaml
Silent Auto-Resolve Progress
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase: Execution (Phase 3/5)
Time Elapsed: 18 minutes

Todos:
✅ Analyze project state
✅ Prioritize issues
✅ Fix build failure
✅ Fix type errors
✅ Resolve linting issues
🔄 Add missing error handling (in progress)
⏸️ Update documentation
⏸️ Run validation tests
⏸️ Generate completion report

Issues Found: 23
Issues Fixed: 15
Issues Remaining: 8
```

---

## Output Format

### Completion Report Structure:
```
✅ Silent auto-resolve complete.

<Workflow Name> - <Duration>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 Critical Issues Fixed: <count>
<List of critical fixes>

🟡 Quality Improvements: <count>
<List of quality improvements>

🟢 Maintenance: <count>
<List of maintenance tasks>

Files Modified: <count>
<Key files with brief descriptions>

Tests: <passing>/<total> passing (was <previous>) ✅
Build: <status> ✅
Lint: <status> ✅
Coverage: <old>% → <new>%

Commits:
- "<commit message 1>"
- "<commit message 2>"
...

Next Steps:
- <Recommended actions>
- <Unresolved issues requiring attention>

<Encouraging closing statement>
```

### Blocked Report Structure:
```
⚠️ Silent auto-resolve blocked at <phase name>

Issue: <Clear explanation of blocker>
Required: <What user must provide/do>

Progress Completed:
✅ <List of completed fixes>

Blocked:
🛑 <Specific blocker with context>

Commits Created:
- "<commit messages>"

Actions Required:
1. <Step to unblock>
2. Resume with: *workflow resume

Alternatively, <alternative approach if available>
```

---

## Tips for Maximum Success

1. **Workflow creates safety branch automatically** - Original branch preserved, easy rollback
2. **Keep tests updated** - Workflow validates using your test suite
3. **Maintain STATUS_RESUME.md** - Provides critical context
4. **Trust the process** - Avoid checking status constantly
5. **Review commits afterward** - Understand what changed and learn (`git diff main`)
6. **Test before merging** - Workflow completes on feature branch, you control merge to main
7. **Run periodically** - Daily or after merges for best results
8. **Ensure .env.local is configured** - Prevents blocks on missing secrets
9. **Keep dependencies current** - Reduces complex upgrade issues
10. **Easy rollback** - Just `git checkout main` to undo everything

---

## Troubleshooting

**Q: Workflow completed but missed something important?**
A: Run again with `--focus=<area>` to target specific issues, or use `auto-resolve` for more control.

**Q: Too many changes at once?**
A: Use `silent-execute` for specific tasks, or `auto-resolve` to review plans before execution.

**Q: Workflow seems to be taking too long?**
A: Check `*plan-status` - may be fixing many issues. Large cleanups can take 60-90 minutes.

**Q: Want to stop mid-workflow?**
A: Use `*exit` to gracefully stop and receive progress report with completed work.

**Q: Workflow made unexpected changes?**
A: Review commits with `git log` and `git diff`. Revert specific commits if needed. Provide feedback to improve future runs.

**Q: How often should I run this?**
A: Daily is ideal, or after merges/major changes. Prevents issue accumulation.

---

## Integration Example

### Morning Routine
```bash
# Start your day with automated project health check
*workflow silent-auto-resolve

# While that runs, get coffee and check email
# 20-30 minutes later, return to clean, tested, documented codebase

# Review what was fixed
git log --oneline -10

# Continue development with confidence
*agent dev
```

### Pre-Commit Hook
```bash
# Before committing major changes
*workflow silent-auto-resolve --quick

# Ensures your branch is clean before push
```

### CI/CD Integration
```bash
# Include in CI pipeline
*workflow silent-auto-resolve --skip-integration --max-time=15m

# Catches issues before they reach production
```

---

## Philosophy

This workflow embodies the principle: **"Maximize autonomy, minimize interruption, maximize quality."**

It treats your codebase as a living system requiring regular maintenance, applying:
- **Preventive care** (catching issues early)
- **Corrective action** (fixing problems found)
- **Continuous improvement** (enhancing quality over time)

All while respecting your time by working silently and reporting comprehensively.

---

**Trust the agent. Do other work. Return to a healthier codebase.**

---

*Created: 2025-10-14*
*Last Updated: 2025-10-14*
