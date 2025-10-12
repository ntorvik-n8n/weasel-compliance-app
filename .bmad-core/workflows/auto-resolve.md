# Auto-Resolve Workflow
<!-- Powered by BMAD™ Core -->

## Workflow Metadata
```yaml
id: auto-resolve
name: Autonomous Issue Resolution
version: 1.0
icon: 🤖
description: Minimal-input workflow that autonomously diagnoses issues, executes fixes, and validates results
whenToUse: When you want the agent to take initiative and resolve issues with minimal user interaction
requiredAgents: [dev, qa]
estimatedTime: 30-90 minutes
autonomyLevel: high
userInputRequired: minimal
```

## Overview

This workflow operates in **autonomous mode**, requiring only:
1. **Initial confirmation** to start
2. **Critical decision approval** (optional - can run in YOLO mode)
3. **Final review** of results

The workflow will:
- ✅ Assess current project state automatically
- ✅ Identify blockers and issues
- ✅ Execute fixes with minimal prompts
- ✅ Run tests and validations
- ✅ Document all changes
- ✅ Report results with clear next steps

---

## Workflow Phases

### Phase 1: Autonomous Assessment (No user input)
**Agent:** Developer + QA
**Duration:** 5 minutes

**Actions:**
1. Read STATUS_RESUME.md or equivalent project status
2. Analyze git status for uncommitted changes
3. Review recent error logs and documentation
4. Identify critical blockers and priority issues
5. Generate diagnostic report with recommended actions

**Output:** Issue priority matrix with proposed action plan

---

### Phase 2: Execution Plan (Minimal user input)
**Agent:** Developer
**Duration:** 2 minutes

**Actions:**
1. Present concise action plan (3-5 key steps)
2. Ask for confirmation: "Proceed with auto-resolve? (yes/no/modify)"
3. If "yes" → Execute Phase 3
4. If "no" → Exit workflow
5. If "modify" → Allow user to adjust priorities, then proceed

**User Input:** Single yes/no/modify response

---

### Phase 3: Autonomous Execution (No user input)
**Agent:** Developer
**Duration:** 20-60 minutes

**Actions:**
1. Execute fixes in priority order
2. Run tests after each fix
3. Commit changes with descriptive messages
4. Log all actions to debug log
5. Handle errors gracefully (rollback if needed)
6. Update status documentation

**Output:** Execution log with results for each action

---

### Phase 4: Validation & Reporting (Minimal user input)
**Agent:** QA Engineer
**Duration:** 10-20 minutes

**Actions:**
1. Run end-to-end validation tests
2. Verify all acceptance criteria
3. Document test results
4. Generate summary report
5. Identify any remaining issues
6. Recommend next workflow or epic

**User Input:** Optional - Review final report and approve

---

## Autonomous Decision Rules

The workflow will make these decisions automatically:

### ✅ Auto-approve (No user input needed):
- File reads and analysis
- Running tests
- Fixing linting errors
- Updating documentation
- Creating debug logs
- Non-destructive code changes

### ⚠️ User confirmation required:
- Deleting files or data
- Making API calls to external services
- Committing to git (unless in YOLO mode)
- Modifying critical configuration files
- Deploying to production

### 🛑 Always stop for user input:
- Destructive operations that cannot be undone
- Security-related changes
- Changes that affect billing/costs
- Uncertain situations where multiple valid paths exist

---

## YOLO Mode

Enable with `*yolo` to skip ALL confirmations (use with caution).

In YOLO mode:
- All fixes execute without prompts
- Commits happen automatically
- Only stops if unrecoverable error occurs
- Maximum autonomy, minimum interruption

---

## Workflow Command

To start this workflow:
```
*workflow auto-resolve
```

Or with YOLO mode:
```
*yolo
*workflow auto-resolve
```

---

## Expected Outcomes

### Success Criteria:
- ✅ All identified blockers resolved
- ✅ Tests passing
- ✅ Documentation updated
- ✅ Changes committed (if applicable)
- ✅ Clear next steps identified

### Failure Handling:
- Graceful rollback of partial changes
- Detailed error report
- Recommendations for manual intervention
- Preservation of all logs and state

---

## Integration with BMad Method

This workflow integrates with:
- **Developer agent** tasks and checklists
- **QA agent** testing procedures
- Project status tracking (STATUS_RESUME.md)
- Debug logging (`.ai/debug-log.md`)
- Git workflow and commit standards

---

## Example Session

```
User: *workflow auto-resolve

Agent: 🤖 Auto-Resolve Workflow Activated

[Phase 1: Assessment - 2 min]
✅ Analyzed STATUS_RESUME.md
✅ Identified 1 critical blocker: Upload failure at 115%
✅ Found 3 potential root causes
✅ Generated 5-step action plan

[Phase 2: Execution Plan]
Proposed Actions:
1. Test upload with new filename (eliminate collision)
2. Capture exact error from terminal logs
3. Fix parseCallLogMetadata if validation error
4. Test background processing URL construction
5. Run end-to-end upload test

Estimated time: 25 minutes
Risk: Low (non-destructive, can rollback)

Proceed with auto-resolve? (yes/no/modify): yes

[Phase 3: Execution - 25 min]
✅ Action 1: Testing upload... FOUND ERROR: Duration parsing failure
✅ Action 2: Captured error in debug log
✅ Action 3: Fixed parseCallLogMetadata duration handling
✅ Action 4: Verified background processing URL
✅ Action 5: Upload test PASSED ✅

[Phase 4: Validation - 10 min]
✅ Ran Epic 3 acceptance tests
✅ All tests passing
✅ Documentation updated
✅ STATUS_RESUME.md updated

📊 Final Report:
- Issue: Resolved ✅
- Tests: 15/15 passing
- Files modified: 1
- Time: 28 minutes
- Next: Complete Epic 3 QA gate, proceed to Epic 4

Workflow complete! 🎉
```

---

## Tips for Maximum Autonomy

1. **Maintain clear status docs** - The workflow reads STATUS_RESUME.md to understand context
2. **Use descriptive error logging** - Better logs = better autonomous decisions
3. **Keep acceptance criteria updated** - Helps autonomous validation
4. **Trust the agent** - Review results afterward rather than micromanaging during
5. **Use YOLO mode for routine fixes** - Save time on low-risk changes

---

*Created: 2025-10-11*
*Last Updated: 2025-10-11*
