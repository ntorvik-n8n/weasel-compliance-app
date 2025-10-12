# Epic 3: AI Compliance Analysis Engine

## Epic Overview

**Epic ID:** EPIC-3
**Epic Name:** AI Compliance Analysis Engine
**Priority:** P0 (Critical - Core Value)
**Status:** Not Started
**Target Phase:** Phase 2 - Core Features

## Epic Goal

Integrate Anthropic Claude API to automatically analyze call transcripts for FDCPA compliance violations, generate risk scores, identify problematic language patterns, and provide detailed violation explanations with regulatory context.

## Business Value

This epic delivers the core AI-powered value proposition of the application. It transforms raw call transcripts into actionable compliance insights, enabling compliance officers to quickly identify violations, assess risk, and take corrective action.

**Key Benefits:**
- Automated compliance monitoring saves hours of manual review
- Consistent violation detection reduces human error
- Risk scoring prioritizes high-risk calls for immediate attention
- Detailed explanations support training and remediation
- Regulatory context ensures alignment with FDCPA requirements

## User Stories Included

### Planned Stories
- ⬜ **Story 3.1:** Anthropic API Integration Setup
- ⬜ **Story 3.2:** Call Transcript Processing Pipeline
- ⬜ **Story 3.3:** FDCPA Compliance Evaluation
- ⬜ **Story 3.4:** Risk Scoring Algorithm
- ⬜ **Story 3.5:** Violation Detection and Classification
- ⬜ **Story 3.6:** Segment-Level Analysis with Timestamps
- ⬜ **Story 3.7:** Analysis Result Storage and Retrieval
- ⬜ **Story 3.8:** Error Handling and Retry Logic

## Technical Scope

### Components
- Anthropic API client wrapper
- Prompt engineering system for FDCPA analysis
- JSON response parser and validator
- Analysis result storage service
- Processing queue management
- Rate limiting and throttling
- Error handling and retry mechanisms
- Cost tracking and monitoring

### Integration Points
- Anthropic Claude API (Claude-3 or Claude-3.5)
- Azure Blob Storage for analysis result persistence
- Azure Key Vault for secure API key storage
- Azure Application Insights for usage monitoring
- File upload system (Epic 1) triggers analysis
- Dashboard (Epic 4) displays results

### Analysis Pipeline Flow
```
1. File Upload Complete (Epic 1)
   ↓
2. Fetch JSON from Azure Blob Storage
   ↓
3. Parse and validate call transcript structure
   ↓
4. Construct analysis prompt with FDCPA context
   ↓
5. Send to Anthropic API with structured output format
   ↓
6. Parse AI response and validate structure
   ↓
7. Calculate overall risk score
   ↓
8. Store analysis results in Azure Blob Storage
   ↓
9. Update call log status to "analyzed"
   ↓
10. Trigger dashboard refresh
```

## Acceptance Criteria

### Functional Requirements
- [ ] System processes uploaded call transcripts automatically
- [ ] Anthropic API returns structured analysis in JSON format
- [ ] Overall risk score (0-10 scale) is calculated accurately
- [ ] FDCPA compliance score reflects regulatory alignment
- [ ] Violations are identified with specific types:
  - Abusive language
  - Threatening statements
  - Excessive pressure tactics
  - FDCPA-specific violations (Sections 806, 807, 808)
- [ ] Each violation includes:
  - Timestamp reference to transcript
  - Direct quote from conversation
  - Severity level (low, medium, high, critical)
  - Explanation of why it violates FDCPA
  - Specific regulation reference
- [ ] Segment-level analysis correlates violations to exact transcript moments
- [ ] Analysis results are stored persistently
- [ ] Failed analyses can be retried
- [ ] Processing status updates in real-time

### Performance Requirements
- [ ] Analysis completes within **30 seconds** for 10-minute transcripts
- [ ] API response time averages **<20 seconds**
- [ ] Queue processing handles up to **5 concurrent analyses**
- [ ] Retry logic limits to **3 attempts** with exponential backoff

### Quality Requirements
- [ ] Violation detection accuracy validated against sample dataset
- [ ] Risk scoring is consistent and reproducible
- [ ] False positive rate is acceptable (<10% for known compliant calls)
- [ ] Conservative flagging ensures high-risk calls are never missed

## AI Prompt Strategy

### Structured Prompt Format

```
Analyze this debt collection call for FDCPA compliance.

Call Transcript:
[Insert full transcript with timestamps and speaker labels]

Evaluate the conversation for:

1. FDCPA Violations
   - Section 806 (Harassment or Abuse)
   - Section 807 (False or Misleading Representations)
   - Section 808 (Unfair Practices)

2. Risk Assessment
   - Overall risk score (0-10, where 10 is highest risk)
   - FDCPA compliance score (0-10, where 10 is fully compliant)

3. Language Analysis
   - Abusive or threatening language
   - Excessive pressure tactics
   - Unprofessional communication

4. Recommended Alternative Responses
   - For each flagged segment, suggest professional alternative

Return analysis in the following JSON structure:
{
  "riskScore": number,
  "fdcpaScore": number,
  "violations": [
    {
      "type": "abusive_language" | "threatening" | "excessive_pressure" | "fdcpa_violation",
      "severity": "low" | "medium" | "high" | "critical",
      "timestamp": number (seconds from start),
      "speaker": "agent" | "client",
      "quote": "exact quote from transcript",
      "explanation": "why this is problematic",
      "regulation": "FDCPA Section reference",
      "suggestedAlternative": "better way to phrase this"
    }
  ],
  "summary": "brief overall assessment",
  "recommendations": ["list of general recommendations"]
}
```

## Expected Response Format

```json
{
  "riskScore": 5.4,
  "fdcpaScore": 7.2,
  "violations": [
    {
      "type": "abusive_language",
      "severity": "high",
      "timestamp": 125,
      "speaker": "agent",
      "quote": "If you don't pay, we'll make sure everyone knows about this debt.",
      "explanation": "This statement constitutes harassment and intimidation, threatening to publicize the debt to damage the consumer's reputation.",
      "regulation": "FDCPA Section 806 - Harassment or Abuse",
      "suggestedAlternative": "We understand this may be difficult. Let's work together to find a payment solution that works for your situation."
    },
    {
      "type": "fdcpa_violation",
      "severity": "critical",
      "timestamp": 237,
      "speaker": "agent",
      "quote": "You'll be arrested if you don't pay immediately.",
      "explanation": "False representation that nonpayment will result in arrest, which is illegal under FDCPA.",
      "regulation": "FDCPA Section 807(4) - False representation that nonpayment will result in arrest",
      "suggestedAlternative": "This account is seriously past due. We need to discuss payment arrangements to resolve this matter."
    }
  ],
  "summary": "Call contains multiple FDCPA violations including threats and false representations. Agent used high-pressure tactics and made illegal threats of arrest.",
  "recommendations": [
    "Provide agent training on FDCPA Section 807 prohibitions against false representations",
    "Implement call monitoring for this agent's future interactions",
    "Review script templates to remove threatening language",
    "Consider remediation contact with consumer"
  ]
}
```

## Dependencies

### External Dependencies
- Anthropic API account with sufficient quota
- Claude-3 or Claude-3.5 model access
- Azure Key Vault for API key storage

### Internal Dependencies
- **Epic 1 (File Upload):** Required - Need uploaded files to analyze
- **Epic 2 (Call Log Management):** Partial - Status updates flow to management UI

### Blocking Dependencies
- Epic 1 must be complete before starting this epic
- API key and Azure Key Vault setup must be complete

## Success Metrics

### Technical Metrics
- Analysis completion rate: **>95%** (excluding malformed input)
- Average processing time: **<30 seconds** per transcript
- API uptime dependency: **>99%**
- Retry success rate: **>80%** for transient failures

### Accuracy Metrics
- Violation detection validated against expert review
- False positive rate: **<10%** for known compliant calls
- False negative rate: **<5%** for known violations
- Risk score consistency: **±0.5 points** on repeated analysis

### Cost Metrics
- Cost per analysis tracked and within budget
- Token usage optimized for prompt length
- Batch processing reduces per-call cost

### Business Metrics
- Time to analyze calls reduced by **90%** vs manual review
- Consistent violation detection improves compliance posture
- Clear explanations support training effectiveness
- Risk prioritization improves response efficiency

## Risk Assessment

### Technical Risks

**Risk:** Anthropic API rate limits exceeded
**Impact:** High
**Mitigation:** Implement queue system, throttling, and graceful degradation

**Risk:** API service interruption
**Impact:** High
**Mitigation:** Retry logic with exponential backoff, queue persistence, user notifications

**Risk:** Unexpected API response format changes
**Impact:** Medium
**Mitigation:** Robust JSON parsing, validation, fallback handling

**Risk:** Token limits exceeded for long transcripts
**Impact:** Medium
**Mitigation:** Transcript chunking strategy, summarization for context

**Risk:** Cost overrun from high API usage
**Impact:** Medium
**Mitigation:** Usage monitoring, alerts, rate limiting, budget controls

### Business Risks

**Risk:** False positives cause unnecessary alarm
**Impact:** Medium
**Mitigation:** Clear severity levels, explanation context, human oversight recommendation

**Risk:** Missed violations (false negatives) create liability
**Impact:** High
**Mitigation:** Conservative flagging approach, continuous model improvement, expert validation

**Risk:** Inconsistent scoring confuses users
**Impact:** Low
**Mitigation:** Standardized prompts, validation testing, calibration against baselines

## FDCPA Compliance Context

### Key Regulations to Detect

**Section 806 - Harassment or Abuse**
- Use of obscene or profane language
- Repeated calls with intent to annoy
- Threats of violence or harm

**Section 807 - False or Misleading Representations**
- False representation of debt amount
- False implication of attorney involvement
- False threats of legal action
- False claims of arrest or imprisonment

**Section 808 - Unfair Practices**
- Collecting amounts not authorized
- Threatening to take property when unable to do so
- Communication designed to look like legal process

## Definition of Done

### Epic Completion Criteria
- [ ] All user stories in epic completed with acceptance criteria met
- [ ] Anthropic API integration fully functional
- [ ] Analysis pipeline processes transcripts end-to-end
- [ ] Risk scoring algorithm validated
- [ ] Violation detection meets accuracy targets
- [ ] FDCPA regulatory context included in all violations
- [ ] Analysis results stored persistently
- [ ] Error handling and retry logic implemented
- [ ] Performance benchmarks achieved
- [ ] Cost tracking and monitoring active
- [ ] Documentation updated (API integration guide, prompt templates)
- [ ] Code reviewed and merged to main branch
- [ ] Deployed to Azure Static Web Apps staging environment
- [ ] Validation testing completed with sample transcripts
- [ ] Expert review confirms violation detection accuracy

### Quality Gates
- [ ] Unit tests pass (>80% coverage)
- [ ] Integration tests pass for Anthropic API
- [ ] End-to-end tests pass for analysis pipeline
- [ ] Accuracy validation against sample dataset
- [ ] Performance tests meet targets
- [ ] Security scan shows no exposed API keys
- [ ] Cost projections within acceptable range

## Notes

- This epic is the core value driver for the entire application
- Prompt engineering is critical to accuracy and consistency
- Conservative violation detection is preferred (better false positive than false negative)
- FDCPA regulatory context must be accurate and current
- Consider expert review panel for validation
- Start with sample transcripts for testing before production use
- Monitor costs closely during development

## Related Documentation

- [PRD](../prd.md) - Product Requirements Document
- [Architecture](../architecture.md) - Technical Architecture
- [Anthropic API Docs](https://docs.anthropic.com/) - API Reference
- [FDCPA Text](https://www.ftc.gov/legal-library/browse/rules/fair-debt-collection-practices-act-text) - Regulatory Reference
- [Epic 1](./epic-1-file-upload-storage.md) - File Upload (prerequisite)
- [Epic 4](./epic-4-dashboard-visualization.md) - Dashboard (consumes analysis results)

---

*Epic created: 2025-10-10*
*Last updated: 2025-10-10*
*Product Owner: Sarah*
