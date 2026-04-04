---
description: Daily briefing -- tasks, recent captures, patterns, time-sensitive items
---

# /today -- Daily Briefing

A quick snapshot of what's relevant today. Also triggers pattern detection and stale-item checks.

## Flow

### 1. Get Today's Date

Use `date` command. Never assume the date.

### 2. Tasks Due

Search all notes with `type: task` and `status: active`:
- Tasks due today or overdue -> **highlight these first**
- Tasks due this week -> list
- Tasks with no due date but marked active -> mention if relevant

Format:
```
## Due Today
- [[task-name]] -- [brief description] (overdue by X days / due today)

## This Week
- [[task-name]] -- due YYYY-MM-DD
```

If no tasks due: "No tasks due today or this week."

### 3. Recent Captures

Show what was captured in the last 3 days:
- New notes created
- Notes updated
- Daily log highlights

Format:
```
## Recent (last 3 days)
- [[note]] -- [type] [domain] (new/updated YYYY-MM-DD)
```

If nothing recent: "No captures in the last 3 days."

### 4. Pattern Detection

Run pattern checks per `system/synthesis_engine.md`:
- Any topics hitting the 3+ threshold?
- Any cross-domain correlations?
- Any drift from stated intentions?

Format:
```
## Patterns
[Pattern description with evidence]
```

If no patterns: skip this section.

### 5. Stale Check (Weekly)

If it's been 7+ days since the last stale check:
- Tasks not updated in 14+ days
- Ideas not revisited in 30+ days
- Inbox items sitting unprocessed

Format:
```
## Stale Items
- [[item]] -- last touched YYYY-MM-DD (X days ago)
```

If nothing stale or checked recently: skip this section.

### 6. Domain Activity Summary

Show a quick breakdown of vault activity by domain:

```
## Vault Pulse
| Domain     | Notes | Last Activity |
|------------|-------|---------------|
| health     | 4     | 2026-03-24    |
| career     | 4     | 2026-04-03    |
| ...        | ...   | ...           |
```

Highlight domains that have been silent for 30+ days (observation, not guilt).

### 7. Time-Sensitive Items

Check for anything with upcoming deadlines or time relevance:
- Appointments this week
- Deadlines approaching
- Seasonal/recurring items

### 8. Health Check Summary

If a health check or gap analysis ran since the last /today, briefly surface the top findings:
- "Last health check (YYYY-MM-DD): N findings -- [top 1-2 items]"

Skip if no health check has run recently.

### 9. Wrap Up

End with a brief, no-pressure sign-off:
- "That's today. Want to dump anything or dig into something?"
- Or just end with the briefing if it's clear.

## Tone

- Quick, scannable, no fluff
- Lead with what matters most (overdue items first)
- Don't guilt-trip about stale items -- just surface them
- Keep the whole briefing short enough to read in 30 seconds
- Skip empty sections entirely (don't say "no patterns detected")

## Critical Rules

- ALWAYS use `date` command for today's date
- Run pattern detection every time
- Run stale check if 7+ days since last one
- Don't create or modify notes during /today (read-only except for stale-check timestamp)
- Keep it brief -- this is a glance, not a report
