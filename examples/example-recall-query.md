# Example: Recall Query with Auto-Filed Synthesis

This shows what happens when you run `/recall` and the answer gets filed back into the wiki.

---

## Context

You've been using Living Wiki for a few weeks. Your vault contains:
- `life/health/sleep-issues.md` -- mentions stress and 3am wake-ups
- `life/health/caffeine-and-sleep.md` -- notes about coffee intake increasing
- `life/career/quarterly-review-prep.md` -- work presentation stress
- `life/career/workload-concerns.md` -- notes about feeling overwhelmed at work
- `life/health/exercise-log.md` -- mentions that running helps with stress

## Your Query

```
/recall Is my work stress affecting my health?
```

## What Claude Does

### 1. Searches the Vault

Claude searches for notes related to "work stress" and "health":
- Finds `sleep-issues.md` (mentions stress from quarterly review)
- Finds `caffeine-and-sleep.md` (increased coffee during project crunch)
- Finds `quarterly-review-prep.md` (work presentation stress)
- Finds `workload-concerns.md` (feeling overwhelmed)
- Finds `exercise-log.md` (running helps with stress)

### 2. Synthesizes an Answer

```
## Work Stress and Health -- What I Found

**Short answer:** Yes, there's a clear connection across 5 notes.

**The pattern:**
Your work stress (quarterly review, project crunch) is showing up in your 
health in two ways:

1. **Sleep disruption** -- You've been waking at 3am since the quarterly review 
   pressure started ([[sleep-issues]]). You explicitly linked this to work stress.

2. **Increased caffeine** -- Coffee intake went up during the project crunch 
   ([[caffeine-and-sleep]]), which may be compounding the sleep issues.

**What's working:**
Running appears to help with stress ([[exercise-log]]). You've noted better 
energy and mood on days you run.

**Cross-domain summary:**
Career stress → poor sleep → more caffeine → worse sleep. But exercise 
breaks the cycle. The data suggests prioritizing runs during high-stress 
work periods.

**Sources:** [[sleep-issues]], [[caffeine-and-sleep]], [[quarterly-review-prep]], 
[[workload-concerns]], [[exercise-log]]
```

### 3. Auto-Files the Synthesis

Since this answer pulled from 5 notes and produced genuine insight, it auto-files:

**`life/health/work-stress-health-connection.md`**
```yaml
---
type: synthesis
domain: health
created: 2026-04-22
source: recall-query
query: "Is my work stress affecting my health?"
tags: [stress, sleep, caffeine, exercise, cross-domain]
related: [sleep-issues, caffeine-and-sleep, quarterly-review-prep, workload-concerns, exercise-log]
aliases: [work stress health, stress health connection]
---

# Work Stress and Health Connection

**Query:** Is my work stress affecting my health?

Career stress (quarterly review, project crunch) is showing up in health via:

1. **Sleep disruption** -- waking at 3am since quarterly review pressure 
   started ([[sleep-issues]])
2. **Increased caffeine** -- coffee intake up during project crunch 
   ([[caffeine-and-sleep]]), compounding sleep issues

**Mitigating factor:** Running helps with stress ([[exercise-log]]). Better 
energy and mood on run days.

**Pattern:** Career stress -> poor sleep -> more caffeine -> worse sleep. 
Exercise breaks the cycle.

*Synthesized from 5 notes on 2026-04-22.*
```

### 4. Confirmation

```
Filed this synthesis to [[work-stress-health-connection]].

Want to go deeper on any of these notes?
```

---

## The Compound Effect

Next time you ask about stress, health, sleep, or career pressure, this synthesis note is now available as source material. The vault got smarter because you asked a question.

If this pattern persists (stress -> sleep -> caffeine), the synthesis engine will eventually flag it as a recurring cross-domain pattern in `synthesis/patterns.md`.
