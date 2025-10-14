# Sample Call Log Files

This directory contains sample call log JSON files for testing the Weasel Collections Call Monitor application.

## File Overview

### Original Test Files (3 files)

| File | Risk Level | FDCPA Score | Description |
|------|------------|-------------|-------------|
| `standard-call.json` | Moderate (4-5/10) | Medium (6-7/10) | Standard collection call with minor issues |
| `compliant-call.json` | Low (1-2/10) | High (9-10/10) | Professional, compliant call with proper disclosures |
| `high-risk-call.json` | High (8-9/10) | Low (2-3/10) | Call with serious FDCPA violations |

### Extended Test Dataset (20 files)

Generated 2025-10-12 and 2025-10-14 to provide comprehensive testing coverage.

#### Compliant / Low Risk Calls (8 files)

**`call-log-001.json`** - Professional Payment Plan Negotiation
- **Agent:** Michael Torres (AGT-1023)
- **Duration:** 420 seconds (7:00)
- **Scenario:** Respectful agent offers payment plan, acknowledges customer's financial difficulties
- **Expected Analysis:** Low risk (1-2/10), High FDCPA compliance (8-9/10)
- **Key Features:** Empathetic approach, flexible payment options, no pressure tactics

**`call-log-003.json`** - Excellent FDCPA Compliance
- **Agent:** David Park (AGT-3892)
- **Duration:** 312 seconds (5:12)
- **Scenario:** Agent explicitly mentions FDCPA rights, offers written verification, collaborative tone
- **Expected Analysis:** Very low risk (1/10), Excellent FDCPA compliance (9-10/10)
- **Key Features:**
  - Mentions Fair Debt Collection Practices Act by name
  - Offers written verification
  - Explains dispute process
  - Professional payment plan setup

**`call-log-007.json`** - Respectful Scheduling
- **Agent:** Lisa Martinez (AGT-7821)
- **Duration:** 445 seconds (7:25)
- **Scenario:** Agent respects customer's work schedule, schedules convenient callback
- **Expected Analysis:** Very low risk (0-1/10), High compliance (9-10/10)
- **Key Features:** Respects customer's time, confirms preferences, courteous

**`call-log-010.json`** - Proper Dispute Process
- **Agent:** Jonathan Lee (AGT-1067)
- **Duration:** 367 seconds (6:07)
- **Scenario:** Customer doesn't recognize debt, agent properly explains validation notice process
- **Expected Analysis:** Low risk (1-2/10), High compliance (8-9/10)

**`call-log-011.json`** - Understanding & Flexible ✨ NEW
- **Agent:** Lisa Martinez (AGT-3401)
- **Duration:** 245 seconds (4:05)
- **Scenario:** Agent accommodates customer's job loss, sets up affordable payment plan
- **Expected Analysis:** Low risk (1-2/10), High compliance (8-9/10)
- **Key Features:** Shows empathy, flexible payment options, no pressure

**`call-log-013.json`** - Efficient & Professional ✨ NEW
- **Agent:** Rachel Green (AGT-1567)
- **Duration:** 198 seconds (3:18)
- **Scenario:** Quick, professional setup of two-payment plan aligned with payday
- **Expected Analysis:** Low risk (1/10), High compliance (9/10)
- **Key Features:** Efficient, respectful, customer-focused

**`call-log-016.json`** - Empathetic & Solution-Focused ✨ NEW
- **Agent:** Amanda Rodriguez (AGT-3156)
- **Duration:** 221 seconds (3:41)
- **Scenario:** Agent shows understanding, offers to waive late fees, flexible adjustment policy
- **Expected Analysis:** Very low risk (1/10), Excellent compliance (9-10/10)
- **Key Features:** Highly empathetic, proactive help, builds trust

**`call-log-020.json`** - Proactive Customer Service ✨ NEW
- **Agent:** Samantha Brooks (AGT-2967)
- **Duration:** 189 seconds (3:09)
- **Scenario:** Customer has payment plan, agent places account hold to prevent calls
- **Expected Analysis:** Very low risk (0-1/10), Excellent compliance (9-10/10)
- **Key Features:** Customer-first approach, prevents harassment, helpful
- **Key Features:**
  - Explains 30-day dispute period
  - Mentions written notice requirement
  - No pressure when customer requests documentation
  - Proper FDCPA disclosures

#### Moderate Risk Calls (2 files)

**`call-log-005.json`** - Acceptable with Good Disclosures
- **Agent:** Kevin Liu (AGT-5634)
- **Duration:** 398 seconds (6:38)
- **Scenario:** Professional call with proper debt collection disclosures
- **Expected Analysis:** Low-moderate risk (2-3/10), Good compliance (7-8/10)
- **Key Features:**
  - "This is an attempt to collect a debt" disclosure
  - Mentions right to dispute within 30 days
  - Offers written verification
  - Collaborative problem-solving

**`call-log-008.json`** - Settlement Offer with Rights Explanation
- **Agent:** Brandon Miller (AGT-8934)
- **Duration:** 523 seconds (8:43)
- **Scenario:** Comprehensive rights explanation, settlement offer, multiple payment options
- **Expected Analysis:** Low-moderate risk (2-3/10), Good compliance (7-8/10)
- **Key Features:**
  - Detailed FDCPA rights explanation
  - Right to request written validation
  - Right to cease communication
  - Settlement option (40% reduction)
  - Multiple payment alternatives

#### Moderate Risk / Some Violations (6 files)

**`call-log-012.json`** - Aggressive Urgency Tactics ✨ NEW
- **Agent:** Marcus Thompson (AGT-2211)
- **Duration:** 312 seconds (5:12)
- **Scenario:** Demanding immediate payment, threats of legal action, somewhat disrespectful
- **Expected Analysis:** Moderate-high risk (6/10), Fair compliance (4/10)
- **Issues:** Excessive pressure ("need payment TODAY"), disrespectful tone, legal threats

**`call-log-014.json`** - Dispute Handling Issues ✨ NEW
- **Agent:** Brian Foster (AGT-4892)
- **Duration:** 278 seconds (4:38)
- **Scenario:** Initially ignores dispute claim, pressures for payment, eventually handles correctly
- **Expected Analysis:** Moderate risk (5/10), Fair compliance (5/10)
- **Issues:** Poor initial response to dispute, pressure tactics before verification

**`call-log-015.json`** - Condescending & Dismissive ✨ NEW
- **Agent:** Jessica Park (AGT-2789)
- **Duration:** 355 seconds (5:55)
- **Scenario:** Suggests customer get second job, dismissive of financial hardship, threats
- **Expected Analysis:** Moderate-high risk (6/10), Poor compliance (4/10)
- **Issues:** "Maybe you should get a second job", "I hear that a lot", legal team threats

**`call-log-017.json`** - Unreasonable Demands & Property Threats ✨ NEW
- **Agent:** Derek Williams (AGT-5021)
- **Duration:** 292 seconds (4:52)
- **Scenario:** Dismisses customer's payments, suggests selling possessions, wage garnishment threats
- **Expected Analysis:** High risk (7/10), Poor compliance (3/10)
- **Issues:** "Sell something", wage garnishment threats, lien threats, intimidation

**`call-log-018.json`** - Minor Pressure with Good Recovery ✨ NEW
- **Agent:** Nicole Harper (AGT-1834)
- **Duration:** 267 seconds (4:27)
- **Scenario:** Initial urgency but works with customer, flexible payment arrangement
- **Expected Analysis:** Low-moderate risk (4/10), Good compliance (6/10)
- **Issues:** Some pressure but shows empathy and flexibility

**`call-log-019.json`** - Aggressive Deadline Demands ✨ NEW
- **Agent:** Christopher Lee (AGT-4423)
- **Duration:** 318 seconds (5:18)
- **Scenario:** Ignores customer's outreach attempts, unreasonable deadline, lawsuit threats
- **Expected Analysis:** High risk (7-8/10), Poor compliance (3/10)
- **Issues:** "Final notice", 24-hour deadline, immediate lawsuit threat, dismissive

#### High Risk / Critical Violation Calls (6 files)

**`call-log-002.json`** - Severe Threats and Abusive Language
- **Agent:** Sarah Chen (AGT-2145)
- **Duration:** 185 seconds (3:05)
- **Scenario:** Immediate aggression, threats of property seizure, abusive language
- **Expected Analysis:** Critical risk (9-10/10), Poor compliance (1-2/10)
- **FDCPA Violations:**
  - Section 806: Harassment and abuse ("tired of your excuses", "don't play dumb")
  - Section 807: False representations (threats to garnish wages and seize house without legal process)
  - Section 808: Unfair practices (excessive pressure, threats)
- **Key Issues:**
  - "We're going to garnish your wages and take everything you own"
  - "You'll lose your house!"
  - "We can make your life very difficult"
  - No identification of debt collection purpose
  - No FDCPA disclosures

**`call-log-004.json`** - Workplace & Neighbor Threats
- **Agent:** Amanda Rodriguez (AGT-4721)
- **Duration:** 267 seconds (4:27)
- **Scenario:** Threats to contact employer and neighbors, intimidation, harassment
- **Expected Analysis:** Critical risk (9-10/10), Poor compliance (1-2/10)
- **FDCPA Violations:**
  - Section 806(5): Threat to publicize debt ("contact all your neighbors")
  - Section 806(2): Abusive language ("deadbeat", "thief")
  - Section 807: False threats ("I've got connections", implied extrajudicial action)
  - Section 805: Prohibited contact threats (employer, neighbors)
- **Key Issues:**
  - Threat to call employer
  - Threat to contact neighbors about debt
  - Called consumer a "deadbeat" and "thief"
  - Intimidation tactics ("I've got connections")

**`call-log-006.json`** - Implicit Family Threats
- **Agent:** Rachel Thompson (AGT-6789)
- **Duration:** 156 seconds (2:36)
- **Scenario:** Mentions knowledge of where children attend school, veiled threats
- **Expected Analysis:** Critical risk (9-10/10), Poor compliance (0-1/10)
- **FDCPA Violations:**
  - Section 806: Harassment through implied threats to family
  - Section 807(5): Threats that cannot legally be taken
  - Section 808: Unfair intimidation practices
- **Key Issues:**
  - "We know where your kids go to school" (implicit threat)
  - "We have our ways of finding people"
  - Sarcastic, dismissive tone ("Smart move, genius")
  - Threatening undertones throughout call

**`call-log-009.json`** - Criminal Threats and False Arrest Claims
- **Agent:** Christine Davis (AGT-9045)
- **Duration:** 221 seconds (3:41)
- **Scenario:** False arrest threats, criminal accusations, workplace humiliation threats
- **Expected Analysis:** Critical risk (10/10), Poor compliance (0-1/10)
- **FDCPA Violations:**
  - Section 807(3): False threat of criminal prosecution
  - Section 807(4): Threat of arrest (payday loan debts are civil, not criminal)
  - Section 806: Severe harassment and abuse
  - Section 805(b): Threat to contact employer about debt
- **Key Issues:**
  - "We can have you arrested for this!" (false criminal threat)
  - "You're a criminal!" (defamation)
  - Threat to have sheriff serve papers at workplace
  - "Everyone at your workplace will know you're a criminal!"
  - Yelling, aggressive tone ("Pay NOW or face criminal charges!")

## Testing Scenarios

### Use Cases

1. **Compliance Testing**: Upload compliant calls (001, 003, 007, 010) to verify low risk scores
2. **Violation Detection**: Upload high-risk calls (002, 004, 006, 009) to test FDCPA violation identification
3. **Severity Assessment**: Compare AI scoring across low/medium/high risk calls
4. **Batch Upload**: Upload all 10 files simultaneously to test concurrent processing
5. **Retry Logic Testing**: Files may occasionally trigger JSON parse errors from Claude API - verify automatic retry mechanism works

### Expected AI Analysis Focus Areas

**Low Risk Calls Should Identify:**
- Proper FDCPA disclosures
- Professional language
- Respectful tone
- Customer-focused approach
- Clear payment options
- No pressure tactics

**High Risk Calls Should Identify:**
- Harassment and abuse (Section 806)
- False or misleading representations (Section 807)
- Unfair practices (Section 808)
- Prohibited contact threats (Section 805)
- Specific threatening quotes
- Suggested alternative responses

## File Structure

Each JSON file follows this schema:

```json
{
  "callId": "string",
  "timestamp": "ISO 8601 datetime",
  "agent": {
    "id": "string",
    "name": "string"
  },
  "client": {
    "id": "string",
    "name": "string (first name + initial for privacy)"
  },
  "duration": "number (seconds)",
  "transcript": [
    {
      "timestamp": "number (seconds from call start)",
      "speaker": "agent | client",
      "text": "string"
    }
  ],
  "outcome": "string (call resolution)",
  "metadata": {
    "recordingId": "string",
    "campaignId": "string"
  }
}
```

## FDCPA Reference

### Common Violations in Sample Files

**Section 805** - Communication in connection with debt collection
- 805(b): Prohibited communication with third parties (employer, neighbors)

**Section 806** - Harassment or abuse
- 806(2): Use of obscene or profane language
- 806(5): Causing telephone to ring repeatedly or continuously

**Section 807** - False or misleading representations
- 807(3): False representation or implication that nonpayment may result in arrest
- 807(4): Representation that nonpayment will result in seizure, garnishment, attachment, or sale of property
- 807(5): Threat to take action that cannot legally be taken

**Section 808** - Unfair practices
- 808(1): Collection of any amount unless expressly authorized

## Upload Instructions

### Via UI
1. Navigate to the application dashboard
2. Drag and drop files into the upload zone
3. Or click "select files" to browse
4. Files will be automatically uploaded to Azure Blob Storage
5. AI analysis will begin processing in the background

### Via PowerShell (Sample File Upload)
```powershell
# Upload single file
curl -X POST http://localhost:3001/api/upload `
  -F "file=@sample-files/call-log-001.json"

# Upload multiple files (PowerShell)
$files = 1..10 | ForEach-Object {
  "sample-files/call-log-$('{0:d3}' -f $_).json"
}
foreach ($file in $files) {
  curl -X POST http://localhost:3001/api/upload -F "file=@$file"
}
```

## Maintenance

When adding new sample files:
1. Follow the naming convention: `call-log-XXX.json`
2. Ensure JSON schema compliance
3. Update this README with file description
4. Add to appropriate risk category
5. Document expected analysis outcomes

---

*Last Updated: 2025-10-12*
