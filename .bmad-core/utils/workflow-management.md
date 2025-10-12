# Workflow Management Utilities
<!-- Powered by BMAD™ Core -->

## Purpose
Utilities for discovering, executing, and managing BMad workflows with varying autonomy levels.

---

## Workflow Discovery

### List All Available Workflows
```javascript
// Pseudo-code for agent use
function discoverWorkflows() {
  const workflowDir = '.bmad-core/workflows/';
  const workflows = glob(`${workflowDir}*.md`);

  return workflows.map(file => {
    const content = readFile(file);
    const metadata = extractYamlBlock(content);
    return {
      id: metadata.id,
      name: metadata.name,
      description: metadata.description,
      autonomyLevel: metadata.autonomyLevel,
      whenToUse: metadata.whenToUse
    };
  });
}
```

### Match User Intent to Workflow
```javascript
function matchWorkflow(userRequest) {
  const keywords = {
    'autonomous': 'auto-resolve',
    'silent': 'silent-execute',
    'minimal input': 'auto-resolve',
    'no questions': 'silent-execute',
    'fix quickly': 'silent-execute',
    'debug': 'auto-resolve'
  };

  // Check for keyword matches
  for (const [keyword, workflowId] of Object.entries(keywords)) {
    if (userRequest.toLowerCase().includes(keyword)) {
      return workflowId;
    }
  }

  return null; // No match, ask user
}
```

---

## Workflow Execution Engine

### Execute Workflow
```javascript
async function executeWorkflow(workflowId, params = {}) {
  const workflow = loadWorkflow(workflowId);
  const phases = workflow.phases;

  const state = {
    currentPhase: 0,
    todos: [],
    results: [],
    blocked: false,
    blockReason: null
  };

  for (const phase of phases) {
    try {
      state.currentPhase++;

      // Create todos for phase
      if (workflow.autonomyLevel !== 'maximum') {
        updateTodos(phase.actions);
      }

      // Execute phase actions
      const result = await executePhase(phase, state);
      state.results.push(result);

      // Check if user input required
      if (phase.requiresInput && !params.yoloMode) {
        const response = await promptUser(phase.prompt);
        if (response === 'no' || response === 'exit') {
          return { status: 'cancelled', state };
        }
      }

    } catch (error) {
      state.blocked = true;
      state.blockReason = error.message;
      return { status: 'blocked', state, error };
    }
  }

  return { status: 'complete', state };
}
```

### Resume Workflow
```javascript
function resumeWorkflow() {
  const savedState = loadState('.bmad-core/.workflow-state.json');

  if (!savedState) {
    return { error: 'No workflow to resume' };
  }

  return executeWorkflow(
    savedState.workflowId,
    { resumeFrom: savedState.currentPhase, state: savedState }
  );
}
```

---

## TodoWrite Integration

### Generate Todos from Workflow
```javascript
function generateWorkflowTodos(workflow, params) {
  const todos = [];

  for (const phase of workflow.phases) {
    for (const action of phase.actions) {
      todos.push({
        content: action.description,
        activeForm: action.activeDescription,
        status: 'pending'
      });
    }
  }

  return todos;
}
```

### Update Todo Status During Execution
```javascript
function updateWorkflowProgress(todoIndex, status) {
  // Read current todos
  const currentTodos = getCurrentTodos();

  // Update status
  currentTodos[todoIndex].status = status;

  // Write back
  TodoWrite({ todos: currentTodos });
}
```

---

## Autonomy Level Management

### Decision Matrix
```javascript
const AUTONOMY_RULES = {
  'maximum': {
    autoApprove: [
      'file-read', 'file-write', 'file-edit',
      'run-tests', 'fix-linting', 'git-commit',
      'install-deps', 'update-docs'
    ],
    requireApproval: [
      'delete-data', 'deploy', 'modify-security'
    ],
    neverDo: [
      'delete-database', 'production-deploy-without-confirm'
    ]
  },
  'high': {
    autoApprove: [
      'file-read', 'file-write', 'file-edit',
      'run-tests', 'fix-linting', 'update-docs'
    ],
    requireApproval: [
      'git-commit', 'install-deps', 'delete-files',
      'api-calls', 'modify-config'
    ],
    neverDo: [
      'delete-database', 'production-deploy'
    ]
  },
  'medium': {
    autoApprove: [
      'file-read', 'run-tests', 'update-docs'
    ],
    requireApproval: [
      'file-write', 'file-edit', 'git-commit',
      'install-deps', 'api-calls'
    ],
    neverDo: [
      'delete-files', 'delete-database', 'production-deploy'
    ]
  }
};

function shouldAutoApprove(action, autonomyLevel) {
  const rules = AUTONOMY_RULES[autonomyLevel];

  if (rules.neverDo.includes(action.type)) {
    return false; // Always stop
  }

  if (rules.autoApprove.includes(action.type)) {
    return true; // Proceed without asking
  }

  if (rules.requireApproval.includes(action.type)) {
    return false; // Ask user
  }

  return false; // Default to safe
}
```

---

## State Persistence

### Save Workflow State
```javascript
function saveWorkflowState(workflowId, state) {
  const stateFile = '.bmad-core/.workflow-state.json';

  const data = {
    workflowId,
    timestamp: new Date().toISOString(),
    currentPhase: state.currentPhase,
    todos: state.todos,
    results: state.results,
    blocked: state.blocked,
    blockReason: state.blockReason
  };

  writeFile(stateFile, JSON.stringify(data, null, 2));
}
```

### Clear Workflow State
```javascript
function clearWorkflowState() {
  const stateFile = '.bmad-core/.workflow-state.json';
  if (fileExists(stateFile)) {
    deleteFile(stateFile);
  }
}
```

---

## Reporting

### Generate Completion Report
```javascript
function generateCompletionReport(workflow, state) {
  const { results, todos } = state;

  const report = {
    summary: generateSummary(results),
    filesChanged: extractFilesChanged(results),
    testsStatus: extractTestResults(results),
    commits: extractCommits(results),
    nextSteps: recommendNextSteps(workflow, results)
  };

  return formatReport(report);
}

function formatReport(report) {
  return `
✅ Complete.

${report.summary}

Changes:
${report.filesChanged.map(f => `- ${f.name}: ${f.change}`).join('\n')}

Tests: ${report.testsStatus}
Commits: "${report.commits.join('", "')}"

${report.nextSteps}
  `.trim();
}
```

### Generate Blocked Report
```javascript
function generateBlockedReport(workflow, state) {
  const { currentPhase, blockReason, results } = state;

  const completedSteps = results.map(r => `✅ ${r.description}`);
  const blockedStep = `🛑 ${workflow.phases[currentPhase].description}`;
  const pendingSteps = workflow.phases
    .slice(currentPhase + 1)
    .map(p => `⏸️ ${p.description}`);

  return `
⚠️ Blocked at ${blockedStep}

Issue: ${blockReason}
Required: ${getSolutionHint(blockReason)}

Progress:
${completedSteps.join('\n')}
${blockedStep}
${pendingSteps.join('\n')}

Resume with: *workflow resume
  `.trim();
}
```

---

## Workflow Commands Implementation

### *workflow [name]
```javascript
function handleWorkflowCommand(name, params) {
  if (!name) {
    // List all workflows
    return listWorkflows();
  }

  const workflow = loadWorkflow(name);
  if (!workflow) {
    return `Workflow '${name}' not found. Use *workflow to list available workflows.`;
  }

  return executeWorkflow(workflow.id, params);
}
```

### *workflow-guidance
```javascript
function handleWorkflowGuidance() {
  const workflows = discoverWorkflows();
  const projectState = analyzeProjectState();

  const recommendations = workflows
    .map(w => ({
      workflow: w,
      score: calculateRelevanceScore(w, projectState)
    }))
    .sort((a, b) => b.score - a.score);

  return presentGuidance(recommendations, projectState);
}
```

### *plan
```javascript
function handlePlanCommand(workflowId) {
  const workflow = loadWorkflow(workflowId);
  const todos = generateWorkflowTodos(workflow);

  // Display plan without executing
  return `
📋 Workflow Plan: ${workflow.name}

${todos.map((t, i) => `${i+1}. ${t.content}`).join('\n')}

Estimated time: ${workflow.estimatedTime}
Autonomy level: ${workflow.autonomyLevel}

Ready to execute? Use: *workflow ${workflowId}
  `.trim();
}
```

### *plan-status
```javascript
function handlePlanStatus() {
  const state = loadWorkflowState();
  const todos = getCurrentTodos();

  if (!todos || todos.length === 0) {
    return 'No active workflow plan.';
  }

  const completed = todos.filter(t => t.status === 'completed').length;
  const inProgress = todos.filter(t => t.status === 'in_progress').length;
  const pending = todos.filter(t => t.status === 'pending').length;

  return `
📊 Workflow Progress

✅ Completed: ${completed}
🔄 In Progress: ${inProgress}
⏸️ Pending: ${pending}

Current task:
${todos.find(t => t.status === 'in_progress')?.activeForm || 'None'}

${formatTodoList(todos)}
  `.trim();
}
```

---

## Helper Functions

### Analyze Project State
```javascript
function analyzeProjectState() {
  return {
    hasBlockers: checkForBlockers(),
    currentEpic: getCurrentEpic(),
    testsPassing: checkTestStatus(),
    uncommittedChanges: checkGitStatus(),
    documentationStatus: checkDocs(),
    nextMilestone: getNextMilestone()
  };
}
```

### Calculate Workflow Relevance
```javascript
function calculateRelevanceScore(workflow, projectState) {
  let score = 0;

  // Blockers detected -> recommend auto-resolve
  if (projectState.hasBlockers && workflow.id === 'auto-resolve') {
    score += 50;
  }

  // Tests failing -> recommend auto-resolve
  if (!projectState.testsPassing && workflow.id === 'auto-resolve') {
    score += 30;
  }

  // Routine task -> recommend silent-execute
  if (isRoutineTask() && workflow.id === 'silent-execute') {
    score += 40;
  }

  return score;
}
```

---

## Integration Points

### With BMad Agents
```javascript
function transformAndExecuteWorkflow(workflowId) {
  const workflow = loadWorkflow(workflowId);
  const requiredAgents = workflow.requiredAgents || ['dev'];

  // Transform to first required agent
  const primaryAgent = requiredAgents[0];
  transformToAgent(primaryAgent);

  // Execute workflow in agent context
  return executeWorkflow(workflowId);
}
```

### With Status Tracking
```javascript
function updateStatusDocuments(workflow, results) {
  const statusFile = 'STATUS_RESUME.md';

  const updates = {
    completedTasks: extractCompletedTasks(results),
    resolvedIssues: extractResolvedIssues(results),
    timestamp: new Date().toISOString()
  };

  appendToStatusFile(statusFile, updates);
}
```

---

## Best Practices

1. **Always load workflow file at runtime** - Never pre-load
2. **Use TodoWrite for progress tracking** - Keeps user informed
3. **Save state frequently** - Enable resume capability
4. **Match autonomy to task complexity** - Higher risk = lower autonomy
5. **Generate clear reports** - User should understand what happened
6. **Handle errors gracefully** - Always provide recovery path

---

*Created: 2025-10-11*
*Last Updated: 2025-10-11*
