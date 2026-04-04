---
description: Periodic review -- reflect on recent period, surface gaps, update memory
argument-hint: (no arguments -- Claude picks the cadence)
---

# /review -- Periodic Review

A structured reflection on a recent period. Claude picks the cadence (weekly or monthly) based on when the last review happened.

## Cadence Logic

1. Check `synthesis/monthly/` and `synthesis/quarterly/` for last review date
2. If no review in 7-13 days -> weekly mini-review
3. If no review in 14+ days -> monthly review
4. If no review in 90+ days -> quarterly review (monthly + big picture)
5. First-ever review -> monthly scope

Tell the user: "Running a [weekly/monthly/quarterly] review covering [date range]."

## Weekly Mini-Review (5 min)

Ask these 3 questions, one at a time:

1. "What's the highlight of the past week?"
2. "Anything bugging you or unresolved?"
3. "What's your focus for the coming week?"

After:
- Update daily log with review notes
- Run pattern detection
- Flag anything noteworthy
- Done. Keep it light.

## Monthly Review (10-15 min)

Ask these 5 questions, one at a time:

1. "What were the big themes this month? What took up your headspace?"
2. "Any wins or progress worth remembering?"
3. "What's been frustrating or draining?"
4. "Anything you said you'd do but didn't? (No judgment -- just checking.)"
5. "What do you want next month to look like?"

After:
- Generate `synthesis/monthly/YYYY-MM.md` with:
  - Themes and highlights
  - Domain activity breakdown (which domains got attention, which went silent)
  - Patterns detected
  - Open threads
  - Stated intentions for next month
- Run domain health check (per `system/cascading_updates.md`)
- Update `memory.md` if new patterns or preferences emerged
- Flag stale items (tasks >14 days, ideas >30 days)
- Auto-commit: `review YYYY-MM: monthly review`

## Quarterly Review (15-20 min)

Run monthly review PLUS these additional questions:

6. "Zooming out -- how are you feeling about life in general right now?"
7. "Any big decisions coming up or hanging over you?"
8. "What would make the next quarter feel like a win?"

After (in addition to monthly outputs):
- Generate `synthesis/quarterly/YYYY-QX.md` with:
  - Cross-month trends
  - Domain balance assessment
  - Big-picture life trajectory
  - Pattern evolution (what grew, what resolved, what's new)
- Update `memory.md` with quarterly insights
- Auto-commit: `review YYYY-QX: quarterly review`

## Tone

- Conversational, not clinical
- Curious, not interrogating
- Ask one question at a time -- let the user think
- No guilt about gaps, missed intentions, or silent domains
- "No judgment" means no judgment -- even subtle disappointment cues
- If the user is brief, that's fine. Don't push for more.

## Critical Rules

- ALWAYS use `date` command for dates
- Ask questions ONE AT A TIME
- Preserve the user's voice in synthesis documents
- Update `memory.md` only with genuine new insights (not boilerplate)
- Auto-commit after review
- Don't force patterns -- "no clear patterns this month" is valid
- Respect if the user wants to skip questions or cut it short
