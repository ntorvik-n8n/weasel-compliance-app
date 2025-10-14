# 🎨 UX Mockups - Improved Layout & Organization

**Date:** October 14, 2025  
**Designer:** Sally (UX Expert)  
**Status:** Proposal for Review

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Main Dashboard - No File Selected](#mockup-1-main-dashboard---no-file-selected)
3. [Call Detail - Overview Tab](#mockup-2-call-detail---overview-tab)
4. [Call Detail - Transcript Tab](#mockup-3-call-detail---transcript-tab)
5. [Call Detail - Violations Tab](#mockup-4-call-detail---violations-tab)
6. [Sidebar with Search & Filters](#mockup-5-sidebar-with-search--filters)
7. [Mobile Responsive View](#mockup-6-mobile-responsive-view)
8. [Component Specifications](#component-specifications)

---

## Overview

### Current Problems:
- ❌ Too much information displayed at once
- ❌ No aggregate analytics across all calls
- ❌ Poor information hierarchy
- ❌ No search or filtering
- ❌ Transcript takes up space even when not needed
- ❌ No actionable insights or recommendations

### Proposed Solutions:
- ✅ Tabbed interface for progressive disclosure
- ✅ Portfolio analytics dashboard when no file selected
- ✅ Search and filter sidebar
- ✅ Quick insights and AI recommendations
- ✅ Better visual hierarchy with cards
- ✅ Export and action buttons

---

## Mockup 1: Main Dashboard - No File Selected

### Purpose: 
Show aggregate analytics across all uploaded calls

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║ 🦡 Weasel Compliance Monitor                     v0.1.0 Build 12  ⚙️ Settings ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  ┌────────────────────┐  ┌─────────────────────────────────────────────────┐ ║
║  │ 📁 CALL LOGS       │  │ 📊 PORTFOLIO ANALYTICS                          │ ║
║  │                    │  ├─────────────────────────────────────────────────┤ ║
║  │ 🔍 [Search...]     │  │                                                 │ ║
║  │                    │  │  ┌──────────────┬──────────────┬──────────────┐ │ ║
║  │ 📂 Filter by Risk: │  │  │ Total Calls  │ Avg Risk     │  High Risk   │ │ ║
║  │ ☑ Critical (2)     │  │  │              │              │              │ │ ║
║  │ ☑ High (5)         │  │  │     47       │    4.2/10    │   8 (17%)   │ │ ║
║  │ ☑ Medium (18)      │  │  │              │              │              │ │ ║
║  │ ☑ Low (22)         │  │  │   Analyzed   │ Warning!     │  Flagged     │ │ ║
║  │                    │  │  └──────────────┴──────────────┴──────────────┘ │ ║
║  │ 📅 Date Range:     │  │                                                 │ ║
║  │ [Last 30 Days ▼]   │  │  ┌──────────────────────────────────────────┐  │ ║
║  │                    │  │  │ 📈 RISK TREND (LAST 30 DAYS)              │  │ ║
║  │ 👤 Agent:          │  │  │                                           │  │ ║
║  │ [All Agents ▼]     │  │  │  Risk                                     │  │ ║
║  │                    │  │  │   10 │                                    │  │ ║
║  │ ───────────────    │  │  │    8 │    ●                              │  │ ║
║  │                    │  │  │    6 │  ●   ●     ●                       │  │ ║
║  │ • chatlog1.json    │  │  │    4 │      ● ●     ● ●                  │  │ ║
║  │   Risk: 5.4 🟡     │  │  │    2 │            ●     ● ● ●            │  │ ║
║  │   2 violations     │  │  │    0 └──────────────────────────────────  │  │ ║
║  │                    │  │  │       Week 1   2   3   4                  │  │ ║
║  │ • chatlog2.json    │  │  │                                           │  │ ║
║  │   Risk: 8.2 🔴     │  │  │  ✅ 23% improvement this month            │  │ ║
║  │   3 violations     │  │  └──────────────────────────────────────────┘  │ ║
║  │                    │  │                                                 │ ║
║  │ • chatlog3.json    │  │  ┌──────────────────┬──────────────────────┐   │ ║
║  │   Risk: 2.1 🟢     │  │  │ 🔥 TOP VIOLATIONS│ 👤 AGENT LEADERBOARD │   │ ║
║  │   0 violations     │  │  ├──────────────────┼──────────────────────┤   │ ║
║  │                    │  │  │                  │                      │   │ ║
║  │ • chatlog4.json    │  │  │ Abusive Lang  12 │ 1. Sarah M.  2.1 ⭐ │   │ ║
║  │   Risk: 6.8 🟠     │  │  │ Pressure       8 │ 2. John K.   3.4 ✅ │   │ ║
║  │   1 violation      │  │  │ Threats        5 │ 3. Mike R.   4.8 ⚠️ │   │ ║
║  │                    │  │  │ False Info     3 │ 4. David M.  6.2 🔴 │   │ ║
║  │ [+ Upload File]    │  │  │                  │ 5. Lisa P.   7.1 🔴 │   │ ║
║  │                    │  │  │ [View All ▶]     │ [View All ▶]        │   │ ║
║  └────────────────────┘  │  └──────────────────┴──────────────────────┘   │ ║
║                          │                                                 │ ║
║                          │  ┌──────────────────────────────────────────┐  │ ║
║                          │  │ 🚨 RECENT HIGH-RISK ALERTS               │  │ ║
║                          │  ├──────────────────────────────────────────┤  │ ║
║                          │  │ • chatlog2.json - Critical violations    │  │ ║
║                          │  │   Agent: David M. | Risk: 8.2 | Today    │  │ ║
║                          │  │   [Review →]                             │  │ ║
║                          │  │                                          │  │ ║
║                          │  │ • chatlog4.json - Excessive pressure     │  │ ║
║                          │  │   Agent: David M. | Risk: 6.8 | Today    │  │ ║
║                          │  │   [Review →]                             │  │ ║
║                          │  └──────────────────────────────────────────┘  │ ║
║                          └─────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

**Key Features:**
- **Left Sidebar (280px):** Search, filters, and scrollable call list
- **Main Area:** Portfolio analytics with aggregate metrics
- **Metrics Cards:** Total calls, average risk, high-risk percentage
- **Trend Chart:** Visual risk progression over time
- **Violation Heatmap:** Most common compliance issues
- **Agent Leaderboard:** Best/worst performers ranked
- **Recent Alerts:** Quick access to flagged calls

---

## Mockup 2: Call Detail - Overview Tab

### Purpose: 
Show key metrics and insights for a selected call

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║ 🦡 Weasel Compliance Monitor                     v0.1.0 Build 12  ⚙️ Settings ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  ┌────────────────────┐  ┌─────────────────────────────────────────────────┐ ║
║  │ 📁 CALL LOGS       │  │ 📞 Call Analysis: chatlog2.json  🔴 HIGH RISK   │ ║
║  │                    │  ├─────────────────────────────────────────────────┤ ║
║  │ 🔍 [Search...]     │  │                                                 │ ║
║  │                    │  │  📊 Overview  │  📝 Transcript  │  🚨 Violations │ ║
║  │ ─────────────────  │  │  ═══════════                                    │ ║
║  │                    │  ├─────────────────────────────────────────────────┤ ║
║  │ [Active Filters]   │  │                                                 │ ║
║  │ ☑ High Risk        │  │  ┌────────────────────────────────────────────┐ │ ║
║  │                    │  │  │ 💡 QUICK INSIGHTS (AI Generated)            │ │ ║
║  │ ───────────────    │  │  ├────────────────────────────────────────────┤ │ ║
║  │                    │  │  │ • Agent escalated unnecessarily at 00:28   │ │ ║
║  │ • chatlog1.json    │  │  │ • Customer showed willingness at 01:15     │ │ ║
║  │   5.4 🟡           │  │  │ • Missed opportunity for payment plan      │ │ ║
║  │                    │  │  │ • Recommend: De-escalation training        │ │ ║
║  │ ▶ chatlog2.json    │  │  └────────────────────────────────────────────┘ │ ║
║  │   8.2 🔴           │  │                                                 │ ║
║  │   SELECTED         │  │  ┌──────────┬──────────┬──────────┬──────────┐ │ ║
║  │                    │  │  │ Risk     │ FDCPA    │ Duration │Violations│ │ ║
║  │ • chatlog3.json    │  │  │          │          │          │          │ │ ║
║  │   2.1 🟢           │  │  │   8.2    │   3.5    │   6:08   │    3     │ │ ║
║  │                    │  │  │  /10     │  /10     │   min    │  found   │ │ ║
║  │ • chatlog4.json    │  │  │  🔴      │   🔴     │          │          │ │ ║
║  │   6.8 🟠           │  │  └──────────┴──────────┴──────────┴──────────┘ │ ║
║  │                    │  │                                                 │ ║
║  │ [+ Upload File]    │  │  ┌────────────────────────────────────────────┐ │ ║
║  │                    │  │  │ ⏱️ RISK TIMELINE                            │ │ ║
║  └────────────────────┘  │  ├────────────────────────────────────────────┤ │ ║
║                          │  │ 00:00 ━━●━━━━━━●━━━━━━━━━━━●━━━━━ 06:08   │ │ ║
║                          │  │       ↑        ↑              ↑            │ │ ║
║                          │  │    Threat  Abusive        Pressure         │ │ ║
║                          │  │    00:28    01:42          04:15           │ │ ║
║                          │  └────────────────────────────────────────────┘ │ ║
║                          │                                                 │ ║
║                          │  ┌──────────────────────┬─────────────────────┐ │ ║
║                          │  │ 🏆 COMPARISON        │ ✅ ACTIONS          │ │ ║
║                          │  ├──────────────────────┼─────────────────────┤ │ ║
║                          │  │ vs Team Average:     │ □ Schedule Coaching │ │ ║
║                          │  │                      │ □ Flag for Review   │ │ ║
║                          │  │ Risk: 8.2 vs 4.2    │ □ Send to Training  │ │ ║
║                          │  │ ⚠️ 95% worse         │ □ Add to Case File  │ │ ║
║                          │  │                      │                     │ │ ║
║                          │  │ Duration: 6:08 vs    │ [Take Action ▼]     │ │ ║
║                          │  │ 4:32 avg             │                     │ │ ║
║                          │  │ ⚠️ 35% longer        │ 📤 Export:          │ │ ║
║                          │  │                      │ • PDF Report        │ │ ║
║                          │  │ [View Details]       │ • CSV Data          │ │ ║
║                          │  └──────────────────────┴─────────────────────┘ │ ║
║                          │                                                 │ ║
║                          │  ┌────────────────────────────────────────────┐ │ ║
║                          │  │ 👤 AGENT: David Miller                     │ │ ║
║                          │  ├────────────────────────────────────────────┤ │ ║
║                          │  │ ID: DM-4521  │  Total Calls: 23            │ │ ║
║                          │  │ Avg Risk: 6.2 │  Violation Rate: 43%       │ │ ║
║                          │  │ Team Rank: 12/15 │ Trend: ↗️ Improving     │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ [View Full Agent Profile →]                │ │ ║
║                          │  └────────────────────────────────────────────┘ │ ║
║                          └─────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

**Key Features:**
- **Tabbed Navigation:** Overview | Transcript | Violations
- **Quick Insights:** AI-generated key findings at top
- **Metric Cards:** Large, scannable numbers with color coding
- **Risk Timeline:** Visual representation of when violations occurred
- **Comparison Card:** How this call compares to averages
- **Action Checklist:** Recommended next steps
- **Agent Card:** Quick agent performance snapshot
- **Export Options:** Download reports in various formats

---

## Mockup 3: Call Detail - Transcript Tab

### Purpose: 
Detailed transcript view with search and highlighting

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║ 🦡 Weasel Compliance Monitor                     v0.1.0 Build 12  ⚙️ Settings ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  ┌────────────────────┐  ┌─────────────────────────────────────────────────┐ ║
║  │ 📁 CALL LOGS       │  │ 📞 Call Analysis: chatlog2.json  🔴 HIGH RISK   │ ║
║  │ [Collapsed]        │  ├─────────────────────────────────────────────────┤ ║
║  │                    │  │                                                 │ ║
║  │ ▶ chatlog2.json    │  │  📊 Overview  │  📝 Transcript  │  🚨 Violations │ ║
║  │   8.2 🔴           │  │                  ═══════════                     │ ║
║  │   SELECTED         │  ├─────────────────────────────────────────────────┤ ║
║  └────────────────────┘  │                                                 │ ║
║                          │  🔍 [Search transcript...]  ☑ Highlight Violations│ ║
║                          │                                                 │ ║
║                          │  ┌────────────────────────────────────────────┐ │ ║
║                          │  │ 🎯 SPEAKER TIMELINE                        │ │ ║
║                          │  │ 00:00 ━Agent━Customer━Agent━Agent━━━ 06:08│ │ ║
║                          │  │        └─────┘ └─────┘ └─────────┘         │ │ ║
║                          │  └────────────────────────────────────────────┘ │ ║
║                          │                                                 │ ║
║                          │  ┌────────────────────────────────────────────┐ │ ║
║                          │  │ 📝 CALL TRANSCRIPT                         │ │ ║
║                          │  ├────────────────────────────────────────────┤ │ ║
║                          │  │                                            │ │ ║
║                          │  │ ┌────────────────────────────────────────┐ │ │ ║
║                          │  │ │ 🎤 AGENT          00:05                │ │ │ ║
║                          │  │ │ This is David calling from Metro       │ │ │ ║
║                          │  │ │ Recovery Services for Maria Lopez.     │ │ │ ║
║                          │  │ └────────────────────────────────────────┘ │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ ┌────────────────────────────────────────┐ │ │ ║
║                          │  │ │ 👤 CUSTOMER       00:10                │ │ │ ║
║                          │  │ │ Yes, what do you want?                 │ │ │ ║
║                          │  │ └────────────────────────────────────────┘ │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ ┌────────────────────────────────────────┐ │ │ ║
║                          │  │ │ 🎤 AGENT          00:13   ⚠️ THREAT    │ │ │ ║
║                          │  │ │ I'm calling about your outstanding     │ │ │ ║
║                          │  │ │ balance of $2,318.77. This needs to   │ │ │ ║
║                          │  │ │ be resolved today or this will         │ │ │ ║
║                          │  │ │ escalate.                              │ │ │ ║
║                          │  │ │                                        │ │ │ ║
║                          │  │ │ 💡 Suggestion: "Let's work together   │ │ │ ║
║                          │  │ │ to find a payment solution..."         │ │ │ ║
║                          │  │ └────────────────────────────────────────┘ │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ ┌────────────────────────────────────────┐ │ │ ║
║                          │  │ │ 👤 CUSTOMER       00:21                │ │ │ ║
║                          │  │ │ I can't pay that all at once. I'm a   │ │ │ ║
║                          │  │ │ single mother with three kids.         │ │ │ ║
║                          │  │ └────────────────────────────────────────┘ │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ ┌────────────────────────────────────────┐ │ │ ║
║                          │  │ │ 🎤 AGENT          00:28   🔴 ABUSIVE   │ │ │ ║
║                          │  │ │ Look, I don't care about your excuses.│ │ │ ║
║                          │  │ │ Everyone has problems. You need to    │ │ │ ║
║                          │  │ │ figure this out and call me back with │ │ │ ║
║                          │  │ │ a payment today or this will escalate.│ │ │ ║
║                          │  │ │                                        │ │ │ ║
║                          │  │ │ 💡 Suggestion: "I understand. Many of │ │ │ ║
║                          │  │ │ our clients are in similar situations.│ │ │ ║
║                          │  │ │ Let's discuss payment options..."      │ │ │ ║
║                          │  │ └────────────────────────────────────────┘ │ │ ║
║                          │  │                                            │ │ ║
║                          │  │        [...more transcript...]             │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ ┌──────────────────────────────────────┐   │ │ ║
║                          │  │ │ [Export Transcript] [Download Audio] │   │ │ ║
║                          │  │ └──────────────────────────────────────┘   │ │ ║
║                          │  └────────────────────────────────────────────┘ │ ║
║                          └─────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

**Key Features:**
- **Search Functionality:** Find specific words or phrases
- **Violation Highlighting:** Auto-highlight problematic statements
- **Speaker Timeline:** Visual representation of conversation flow
- **Inline Suggestions:** AI-powered alternative phrases
- **Violation Tags:** Clear markers on problematic turns
- **Export Options:** Download transcript or audio
- **Color Coding:** Agent (red-tinted), Customer (neutral)

---

## Mockup 4: Call Detail - Violations Tab

### Purpose: 
Detailed violation analysis with training resources

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║ 🦡 Weasel Compliance Monitor                     v0.1.0 Build 12  ⚙️ Settings ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  ┌────────────────────┐  ┌─────────────────────────────────────────────────┐ ║
║  │ 📁 CALL LOGS       │  │ 📞 Call Analysis: chatlog2.json  🔴 HIGH RISK   │ ║
║  │ [Collapsed]        │  ├─────────────────────────────────────────────────┤ ║
║  │                    │  │                                                 │ ║
║  │ ▶ chatlog2.json    │  │  📊 Overview  │  📝 Transcript  │  🚨 Violations │ ║
║  │   8.2 🔴           │  │                                   ═══════════    │ ║
║  │   SELECTED         │  ├─────────────────────────────────────────────────┤ │ ║
║  └────────────────────┘  │                                                 │ ║
║                          │  🚨 3 Compliance Violations Found               │ ║
║                          │                                                 │ ║
║                          │  ┌────────────────────────────────────────────┐ │ ║
║                          │  │ 🔴 VIOLATION #1: Abusive Language          │ │ ║
║                          │  ├────────────────────────────────────────────┤ │ ║
║                          │  │ Severity: HIGH  │  Time: 00:28             │ │ ║
║                          │  │ Regulation: FDCPA §806(2) - Harassment     │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ 📝 Quote from Transcript:                  │ │ ║
║                          │  │ "Look, I don't care about your excuses.   │ │ ║
║                          │  │ Everyone has problems."                    │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ ❌ Issue:                                  │ │ ║
║                          │  │ Dismissive language and lack of empathy   │ │ ║
║                          │  │ constitutes harassment under FDCPA.        │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ ✅ Suggested Alternative:                  │ │ ║
║                          │  │ "I understand you're in a difficult       │ │ ║
║                          │  │ situation. Many of our clients face       │ │ ║
║                          │  │ similar challenges. Let's work together   │ │ ║
║                          │  │ to find a solution that works for you."   │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ 📚 Training Resources:                     │ │ ║
║                          │  │ • Empathetic Communication Module          │ │ ║
║                          │  │ • FDCPA Harassment Guidelines              │ │ ║
║                          │  │ • De-escalation Techniques                 │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ [View in Transcript →]  [Assign Training]  │ │ ║
║                          │  └────────────────────────────────────────────┘ │ ║
║                          │                                                 │ ║
║                          │  ┌────────────────────────────────────────────┐ │ ║
║                          │  │ 🟠 VIOLATION #2: Excessive Pressure        │ │ ║
║                          │  ├────────────────────────────────────────────┤ │ ║
║                          │  │ Severity: MEDIUM  │  Time: 01:42           │ │ ║
║                          │  │ Regulation: FDCPA §807(5) - Threats        │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ 📝 Quote from Transcript:                  │ │ ║
║                          │  │ "This needs to be resolved today or this  │ │ ║
║                          │  │ will escalate."                            │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ ❌ Issue:                                  │ │ ║
║                          │  │ Creating false sense of urgency and       │ │ ║
║                          │  │ implied threats without clear explanation.│ │ ║
║                          │  │                                            │ │ ║
║                          │  │ ✅ Suggested Alternative:                  │ │ ║
║                          │  │ "I'd like to help you resolve this today. │ │ ║
║                          │  │ If we can't reach a solution, the account │ │ ║
║                          │  │ may proceed to the next stage of the      │ │ ║
║                          │  │ collection process. Would you like to     │ │ ║
║                          │  │ discuss payment options?"                  │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ [View in Transcript →]  [Assign Training]  │ │ ║
║                          │  └────────────────────────────────────────────┘ │ ║
║                          │                                                 │ ║
║                          │  ┌────────────────────────────────────────────┐ │ ║
║                          │  │ 🔴 VIOLATION #3: False Information         │ │ ║
║                          │  ├────────────────────────────────────────────┤ │ ║
║                          │  │ Severity: HIGH  │  Time: 04:15             │ │ ║
║                          │  │ Regulation: FDCPA §807(10) - False Threats│ │ ║
║                          │  │                                            │ │ ║
║                          │  │ [...violation details...]                  │ │ ║
║                          │  └────────────────────────────────────────────┘ │ ║
║                          │                                                 │ ║
║                          │  ┌────────────────────────────────────────────┐ │ ║
║                          │  │ 📊 VIOLATION SUMMARY                       │ │ ║
║                          │  ├────────────────────────────────────────────┤ │ ║
║                          │  │ High Severity: 2   │  Medium: 1  │ Low: 0  │ │ ║
║                          │  │                                            │ │ ║
║                          │  │ [Export Full Report] [Schedule Review]     │ │ ║
║                          │  └────────────────────────────────────────────┘ │ ║
║                          └─────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

**Key Features:**
- **Detailed Violation Cards:** Each violation gets full explanation
- **Regulation References:** Specific FDCPA code citations
- **Quoted Text:** Exact problematic statements
- **Suggested Alternatives:** Better ways to phrase
- **Training Resources:** Links to relevant modules
- **Action Buttons:** Jump to transcript, assign training
- **Summary Stats:** Quick overview of severity distribution

---

## Mockup 5: Sidebar with Search & Filters

### Purpose: 
Enhanced file list with filtering and search capabilities

```
┌────────────────────────────────┐
│ 📁 CALL LOGS                   │
├────────────────────────────────┤
│                                │
│ 🔍 Search                      │
│ ┌────────────────────────────┐ │
│ │ [Type to search...]  🔍    │ │
│ └────────────────────────────┘ │
│                                │
│ 📂 Filter by Risk Level:       │
│ ┌────────────────────────────┐ │
│ │ ☑ Critical (7-10)  2 calls │ │
│ │ ☑ High (5-6)       5 calls │ │
│ │ ☑ Medium (3-4)    18 calls │ │
│ │ ☑ Low (0-2)       22 calls │ │
│ └────────────────────────────┘ │
│                                │
│ 📅 Date Range:                 │
│ ┌────────────────────────────┐ │
│ │ [Last 30 Days      ▼]      │ │
│ │                            │ │
│ │ Options:                   │ │
│ │ • Today                    │ │
│ │ • Last 7 Days              │ │
│ │ • Last 30 Days ✓           │ │
│ │ • Last 90 Days             │ │
│ │ • Custom Range...          │ │
│ └────────────────────────────┘ │
│                                │
│ 👤 Filter by Agent:            │
│ ┌────────────────────────────┐ │
│ │ [All Agents        ▼]      │ │
│ │                            │ │
│ │ • All Agents ✓             │ │
│ │ • David Miller (12)        │ │
│ │ • Sarah Martinez (8)       │ │
│ │ • John Kim (15)            │ │
│ │ • Mike Rodriguez (7)       │ │
│ │ • Lisa Park (5)            │ │
│ └────────────────────────────┘ │
│                                │
│ 🚨 Violation Type:             │
│ ┌────────────────────────────┐ │
│ │ ☐ Abusive Language         │ │
│ │ ☐ Excessive Pressure       │ │
│ │ ☐ Threats                  │ │
│ │ ☐ False Information        │ │
│ │ ☐ Other                    │ │
│ └────────────────────────────┘ │
│                                │
│ [Clear All Filters]  [Apply]  │
│                                │
│ ────────────────────────────── │
│                                │
│ 📊 Showing 47 of 47 calls      │
│ Sort by: [Risk ▼]             │
│                                │
│ ┌────────────────────────────┐ │
│ │ • chatlog2.json            │ │
│ │   🔴 8.2  Risk: HIGH        │ │
│ │   3 violations             │ │
│ │   Agent: David M.          │ │
│ │   Today, 2:30 PM           │ │
│ │   ━━━━━━━━━━━━━━━ SELECTED│ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ • chatlog4.json            │ │
│ │   🟠 6.8  Risk: MEDIUM      │ │
│ │   1 violation              │ │
│ │   Agent: David M.          │ │
│ │   Today, 1:15 PM           │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ • chatlog1.json            │ │
│ │   🟡 5.4  Risk: MEDIUM      │ │
│ │   2 violations             │ │
│ │   Agent: Sarah M.          │ │
│ │   Yesterday, 3:45 PM       │ │
│ └────────────────────────────┘ │
│                                │
│         [...more calls...]     │
│                                │
│ ┌────────────────────────────┐ │
│ │ [+ Upload New Call Log]    │ │
│ └────────────────────────────┘ │
│                                │
│ 📥 Bulk Actions:               │
│ • Export Selected              │
│ • Delete Selected              │
│ • Assign to Supervisor         │
│                                │
└────────────────────────────────┘
```

**Key Features:**
- **Search Box:** Real-time filtering by filename or content
- **Risk Level Filters:** Show/hide by severity with counts
- **Date Range Picker:** Predefined ranges or custom dates
- **Agent Filter:** Filter by specific agent
- **Violation Type Filter:** Show calls with specific violations
- **Sort Options:** Risk, date, agent, duration, etc.
- **Enhanced Call Cards:** More metadata visible
- **Bulk Actions:** Select multiple calls for batch operations
- **Call Count:** Shows filtered vs total
- **Clear Filters:** Reset to default view

---

## Mockup 6: Mobile Responsive View

### Purpose: 
Ensure usability on tablets and mobile devices

```
┌────────────────────────────────┐
│ ☰  Weasel Compliance  ⚙️      │
├────────────────────────────────┤
│                                │
│ 🔍 [Search calls...]           │
│                                │
│ ┌────────────────────────────┐ │
│ │ 📊 PORTFOLIO STATS         │ │
│ ├────────────────────────────┤ │
│ │ Calls: 47  │ Avg Risk: 4.2│ │
│ │ High Risk: 8 (17%)         │ │
│ └────────────────────────────┘ │
│                                │
│ 📂 [Filters ▼]  🗄️ [Sort ▼]   │
│                                │
│ ┌────────────────────────────┐ │
│ │ chatlog2.json    🔴 8.2    │ │
│ │ 3 violations │ David M.    │ │
│ │ Today 2:30 PM              │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ chatlog4.json    🟠 6.8    │ │
│ │ 1 violation  │ David M.    │ │
│ │ Today 1:15 PM              │ │
│ └────────────────────────────┘ │
│                                │
│         [...more calls...]     │
│                                │
│ ┌────────────────────────────┐ │
│ │ [+ Upload Call Log]        │ │
│ └────────────────────────────┘ │
│                                │
└────────────────────────────────┘

CALL DETAIL VIEW (Mobile):
┌────────────────────────────────┐
│ ← Back  chatlog2.json  🔴 8.2  │
├────────────────────────────────┤
│                                │
│ 📊 Overview  📝 Transcript...  │
│ ═══════════                    │
│                                │
│ ┌────────────────────────────┐ │
│ │ 💡 QUICK INSIGHTS          │ │
│ │ • Escalated at 00:28       │ │
│ │ • Missed payment plan      │ │
│ └────────────────────────────┘ │
│                                │
│ ┌──────┬──────┬──────┬──────┐ │
│ │ Risk │FDCPA │ Time │Viol. │ │
│ │ 8.2  │ 3.5  │ 6:08 │  3   │ │
│ └──────┴──────┴──────┴──────┘ │
│                                │
│ ⏱️ Risk Timeline:              │
│ ━━●━━━━●━━━━━━━●━━━━━━        │
│                                │
│ [View Full Details ▼]         │
│                                │
└────────────────────────────────┘
```

**Key Features:**
- **Hamburger Menu:** Collapsible navigation
- **Stacked Layout:** Single column for small screens
- **Swipeable Tabs:** Easy navigation between views
- **Simplified Cards:** Essential info only
- **Touch-Friendly:** Larger tap targets
- **Collapsible Sections:** Progressive disclosure

---

## Component Specifications

### Color Palette (Dark Theme)

```css
/* Backgrounds */
--dark-bg: #1a1b1e
--dark-surface: #2b2d31
--dark-elevated: #36373d
--dark-border: #3f4147

/* Text */
--text-primary: #ffffff
--text-secondary: #b5bac1
--text-muted: #80848e

/* Risk Colors */
--risk-critical: #ed4245  /* 7-10 */
--risk-high: #f26522      /* 5-6 */
--risk-medium: #faa61a    /* 3-4 */
--risk-low: #57f287       /* 1-2 */
--risk-none: #3ba55d      /* 0 */

/* Badges */
--badge-abusive: #ed4245
--badge-pressure: #5865f2
--badge-threat: #eb459e
--badge-success: #23a55a
```

### Typography

```css
/* Headers */
h1: 24px, Bold, --text-primary
h2: 20px, Bold, --text-primary
h3: 16px, Semibold, --text-primary
h4: 14px, Semibold, --text-secondary

/* Body */
body: 14px, Regular, --text-secondary
small: 12px, Regular, --text-muted
```

### Spacing System

```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
xxl: 48px
```

### Card Styles

```css
.metric-card {
  background: var(--dark-surface);
  border: 1px solid var(--dark-border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  transition: box-shadow 0.2s;
}

.metric-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}
```

### Button Styles

```css
/* Primary Action */
.btn-primary {
  background: var(--badge-pressure);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
}

/* Secondary Action */
.btn-secondary {
  background: var(--dark-elevated);
  color: var(--text-primary);
  border: 1px solid var(--dark-border);
}

/* Danger */
.btn-danger {
  background: var(--risk-critical);
  color: white;
}
```

---

## Implementation Priority

### Phase 1: Core Reorganization (Week 1)
- ✅ Add tabbed interface to call detail view
- ✅ Create Portfolio Analytics dashboard
- ✅ Add Quick Insights panel
- ✅ Implement Risk Timeline

### Phase 2: Search & Filters (Week 2)
- ⏳ Add search functionality
- ⏳ Implement filter controls
- ⏳ Add sort options
- ⏳ Enhanced call cards in sidebar

### Phase 3: Advanced Features (Week 3)
- ⏳ Agent performance tracking
- ⏳ Comparison metrics
- ⏳ Action checklists
- ⏳ Export functionality

### Phase 4: Polish & Mobile (Week 4)
- ⏳ Violation training resources
- ⏳ Mobile responsive layout
- ⏳ Bulk actions
- ⏳ User preferences

---

## Questions for Review

Before implementing, please provide feedback on:

1. **Layout Preference:** Do you prefer the tabbed interface or a different organization?
2. **Portfolio Dashboard:** Is the analytics view when no file is selected valuable?
3. **Information Density:** Too much info or just right?
4. **Feature Priority:** Which features are most important to you?
5. **Color Scheme:** Happy with the dark theme colors or want adjustments?
6. **Missing Features:** Anything else you'd like to see?

---

## Next Steps

Once approved, I'll:
1. Create the new component structure
2. Implement Phase 1 features
3. Test thoroughly
4. Update documentation
5. Deploy to feature branch

**Ready to proceed? Let me know your feedback!** 🎨✨

