# Example: Brain Dump Session

This shows what happens when you run `/dump` with a multi-topic brain dump.

---

## Your Input

```
/dump

I've been sleeping terribly this week, waking up at 3am every night. Probably 
stress from the quarterly review at work. Speaking of which, I need to prep 
my slides for Thursday's presentation -- the data refresh isn't done yet.

Oh, and Marcus texted me about a hiking trip next month. Sounds fun but I need 
to check if it conflicts with anything. He wants to do the Guadalupe Peak trail.

Random thought: I wonder if there's a connection between my sleep and my 
caffeine intake. I've been drinking way more coffee since the project crunch 
started.
```

## What Claude Does

### 1. Segments into Topics

Claude identifies 4 distinct topics:
- Sleep issues (health)
- Work presentation prep (career)
- Hiking trip with Marcus (reference + social)
- Coffee/caffeine observation (health, connects to sleep topic)

### 2. Searches the Vault

Claude searches for existing notes on each topic:
- No existing sleep notes found
- No existing presentation notes found
- "Marcus" mentioned once before in a daily log (not enough for a people file yet)
- No caffeine notes found

### 3. Creates Notes

**`life/health/sleep-issues.md`**
```yaml
---
type: note
domain: health
created: 2026-04-15
source: brain-dump
tags: [sleep, stress, insomnia]
related: [caffeine-and-sleep]
aliases: [sleep problems, waking up early, insomnia]
---

# Sleep Issues

Sleeping terribly this week -- waking up at 3am every night. Likely stress-related 
(quarterly review at work).
```

**`life/career/quarterly-review-prep.md`**
```yaml
---
type: task
domain: career
created: 2026-04-15
source: brain-dump
tags: [presentation, quarterly-review, data]
related: []
aliases: [quarterly review, q2 presentation]
status: active
---

# Quarterly Review Prep

Need to prep slides for Thursday's presentation. Data refresh isn't done yet.
```

**`life/health/caffeine-and-sleep.md`**
```yaml
---
type: note
domain: health
created: 2026-04-15
source: brain-dump
tags: [caffeine, coffee, sleep, stress]
related: [sleep-issues]
aliases: [coffee intake, caffeine]
---

# Caffeine and Sleep

Observation: drinking way more coffee since the project crunch started. 
Wondering if there's a connection to the sleep issues.

Cross-domain link: [[sleep-issues]] may be connected to both work stress 
and increased caffeine intake.
```

**`log/2026-04-15.md`**
```markdown
## 14:30 Brain Dump

- [[sleep-issues]] -- waking up at 3am, stress-related (health)
- [[quarterly-review-prep]] -- slides for Thursday, data refresh pending (career, task)
- [[caffeine-and-sleep]] -- possible connection between coffee and sleep (health)
- Marcus texted about hiking trip next month (Guadalupe Peak trail) -- need to check calendar conflicts. Not enough mentions for a people file yet.
```

### 4. Summary

```
Captured 4 items:

- TASK [career] Quarterly review prep -> life/career/quarterly-review-prep.md (new)
- NOTE [health] Sleep issues -> life/health/sleep-issues.md (new)
- NOTE [health] Caffeine and sleep -> life/health/caffeine-and-sleep.md (new)
- NOTE [--] Marcus hiking trip -> daily log only (1st mention)

No patterns detected (new topics).
Committed: "dump 2026-04-15: 4 items captured"
```

---

## What Happens Next

- If you mention Marcus again in a future dump, a `people/marcus.md` file gets created automatically.
- If sleep issues come up 2 more times in the next 30 days, the synthesis engine flags it as a recurring pattern.
- The caffeine-sleep connection is a cross-domain correlation seed -- if evidence builds, it becomes an active pattern.
- The quarterly review task will appear in `/today` briefings until marked done.
