# Quick Start Guide
# BMAD-METHOD™ Multi-Agent Development

## 🎉 Setup Complete!

Your Weasel project is now configured with BMAD-METHOD™ for multi-agent AI-driven development.

## What You Have Now

✅ **Documentation**
- [docs/prd.md](docs/prd.md) - Complete Product Requirements Document
- [docs/architecture.md](docs/architecture.md) - System Architecture
- [docs/architecture/coding-standards.md](docs/architecture/coding-standards.md) - Code guidelines
- [docs/architecture/tech-stack.md](docs/architecture/tech-stack.md) - Technology stack
- [docs/architecture/source-tree.md](docs/architecture/source-tree.md) - Project structure

✅ **BMAD Agents** (in .bmad-core/agents/)
- sm.md - Scrum Master (creates development stories)
- dev.md - Developer (implements code)
- qa.md - Quality Assurance (tests implementation)
- architect.md - Architect (system design)
- analyst.md - Analyst (requirements)
- pm.md - Project Manager
- And more...

✅ **Guides**
- [README.md](README.md) - Project overview
- [BMAD-WORKFLOW.md](BMAD-WORKFLOW.md) - Complete workflow guide
- [claude.md](claude.md) - Claude Code context

## Next Steps

### Option 1: Start with Scrum Master (Recommended)

Create your first development story:

```
I want to create the first development story for initializing the Next.js project.

Please read .bmad-core/agents/sm.md and follow the Scrum Master role to create Story 001.
```

The SM agent will:
1. Read the PRD and Architecture
2. Create a detailed story in docs/stories/
3. Include acceptance criteria, technical requirements, and dependencies

### Option 2: Initialize Next.js Manually

If you want to start coding right away:

```bash
# Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# Start development
npm run dev
```

### Option 3: Use BMAD Workflow Step-by-Step

Follow the complete workflow in [BMAD-WORKFLOW.md](BMAD-WORKFLOW.md):

1. **Scrum Master** creates stories
2. **Developer** implements features
3. **QA** tests and validates
4. Repeat until complete

## How to Use BMAD Agents

### With Claude Code (This IDE)

Simply ask me to act as an agent:

```
"Act as the Scrum Master agent (read .bmad-core/agents/sm.md) 
and create a story for implementing the file upload component"
```

### With Other AI Tools (Gemini/ChatGPT)

1. Open agent file (e.g., `.bmad-core/agents/sm.md`)
2. Copy the content
3. Paste into AI chat
4. The AI will adopt that agent's role

## Example Conversation Flow

**You:**
> Read .bmad-core/agents/sm.md and act as the Scrum Master. 
> Create Story 001 for Next.js project initialization.

**Agent (SM):**
> [Creates detailed story with acceptance criteria, 
> technical requirements, and saves to docs/stories/story-001.md]

**You:**
> Read .bmad-core/agents/dev.md and implement story-001.

**Agent (Dev):**
> [Reads story, coding standards, tech stack, 
> implements Next.js project initialization]

**You:**
> Read .bmad-core/agents/qa.md and test the implementation.

**Agent (QA):**
> [Tests implementation against acceptance criteria,
> creates QA report in docs/qa/]

## Key Files Reference

| File | Purpose |
|------|---------|
| `docs/prd.md` | What to build (requirements) |
| `docs/architecture.md` | How to build it (design) |
| `docs/architecture/coding-standards.md` | How to write code |
| `docs/architecture/tech-stack.md` | What technologies to use |
| `docs/stories/` | What to build next (stories) |
| `.bmad-core/agents/sm.md` | Story creation agent |
| `.bmad-core/agents/dev.md` | Implementation agent |
| `.bmad-core/agents/qa.md` | Testing agent |

## Common Commands

### View Agent Capabilities
```
Read .bmad-core/agents/sm.md and show me what commands are available
```

### Create a Story
```
Act as Scrum Master and create a story for [feature name]
```

### Implement a Story
```
Act as Developer and implement story-XXX.md
```

### Test Implementation
```
Act as QA and test the implementation of story-XXX.md
```

## Tips for Success

1. **One Story at a Time**: Focus on completing one story before moving to the next
2. **Load Context First**: Always have the agent read its definition file first
3. **Reference Architecture**: Point agents to coding standards and tech stack
4. **Test Before Moving On**: Use QA agent to validate before next story
5. **Human Oversight**: Review agent output and provide feedback

## Troubleshooting

### Agent Not Following Guidelines
**Solution**: Explicitly reference the document
```
"Following the rules in docs/architecture/coding-standards.md, implement..."
```

### Missing Context
**Solution**: Load all required files first
```
"First read: 1) docs/prd.md, 2) docs/architecture.md, 3) docs/stories/story-001.md
Then implement the story"
```

### Need Help with BMAD
**Solution**: Ask the orchestrator agent
```
Read .bmad-core/agents/bmad-orchestrator.md and explain how to use BMAD
```

## Resources

- **BMAD Documentation**: [BMAD-WORKFLOW.md](BMAD-WORKFLOW.md)
- **Project Documentation**: [docs/](docs/)
- **BMAD GitHub**: https://github.com/bmad-code-org/BMAD-METHOD
- **BMAD Community**: https://discord.gg/gk8jAdXWmj

## Ready to Start? 🚀

Try this command right now:

```
Read .bmad-core/agents/sm.md and create Story 001 
for initializing the Next.js 14 project with TypeScript,
Tailwind CSS, and the basic project structure from 
docs/architecture/source-tree.md
```

---

**Questions?** Check [BMAD-WORKFLOW.md](BMAD-WORKFLOW.md) for detailed workflow guide!
