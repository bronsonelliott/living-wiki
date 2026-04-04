---
description: Brain dump mode -- talk about anything, Claude organizes it
argument-hint: (just start talking -- any format, any length)
---

# /dump -- Brain Dump

The primary command. You talk, Claude organizes.

## Flow

### 1. Listen

Let the user talk. Any format works:
- Stream of consciousness
- Bullet points
- Voice-to-text rambling
- Single sentence
- Multi-paragraph essay

Don't interrupt. If they're clearly done (asks a question, says "that's it", or the input ends), move to processing. If unclear whether they're done, ask: "Got it. Anything else, or should I process this?"

### 2. Segment

Split the input into distinct topics. A new topic starts when you detect:
- Subject shift (health -> finances)
- Temporal shift (past -> future plan)
- Domain shift (family -> career)
- Action-type shift (reflecting -> requesting action)

Keep segments atomic but not overly granular. Related items in the same domain can stay together.

### 3. Search (CRITICAL)

For EACH topic segment, before creating anything:

1. Search vault for existing notes with similar topic/domain/tags
2. Check `aliases:` in frontmatter for alternate names
3. Use grep as fallback for full-text search

If existing note found -> update it (append new info, update frontmatter if needed).
If no match -> create new note.

### 4. Classify and Route

Use the classification matrix from `system/parsing_rules.md`:

| Pattern | Type | Route |
|---------|------|-------|
| Actionable + time-bound | task | `life/[domain]/` |
| Reflective / thinking | idea | `ideas/` or `life/[domain]/` |
| About a person | note | `life/[domain]/` (people file only if 2+ mentions) |
| Explicit decision | note + #decision | `life/[domain]/` |
| Calendar/appointment | task | `life/[domain]/` |
| External content reference | reference | `reference/` |
| Random observation | -- | daily log only |
| Vague / ambiguous | -- | daily log only |

Use `system/domain_registry.md` to match topics to domains via synonyms.

### 5. Create/Update Notes

For each routed item, create or update the note with:

```yaml
---
type: [from classification]
domain: [from routing]
created: [use `date` command -- YYYY-MM-DD]
source: brain-dump
tags: []
related: []
aliases: []
status: active | someday | done  # only for tasks
---
```

- Preserve the user's voice -- don't rewrite their words into corporate-speak
- Add `[[wiki-links]]` to related existing notes
- File name: descriptive kebab-case

### 6. Update Daily Log

Create or update `log/YYYY-MM-DD.md` (use `date` command for today's date).

Format -- append a timestamped section:

```markdown
## HH:MM Brain Dump

- [[note-title]] -- Brief description
- [[another-note]] -- Brief description
- Observation that stayed in log only (no standalone note)
```

Daily log uses wiki-links to reference notes, NOT duplicated content.

### 7. Pattern Detection

After creating/updating notes, run pattern checks per `system/synthesis_engine.md`:

- Any topic mentioned 3+ times in 30 days? -> Flag pattern
- Any cross-domain correlations? -> Flag connection
- Any log-only items appearing 2+ times in 14-30 days? -> Suggest promotion to standalone note

### 8. Git Commit

Auto-commit all changes:
```
dump YYYY-MM-DD: X items captured
```

### 9. Show Summary

```
Captured X items:
- TYPE [domain] Description -> path/file.md (new|updated)
- TYPE [domain] Description -> path/file.md (new|updated)
- NOTE [domain] Description -> daily log only

Pattern: [if any detected]
Adjust anything?
```

### 10. User Can Adjust

If the user says to move, reclassify, or edit anything -- do it immediately. Then re-commit.

Default: auto-save. The summary is informational. If they say nothing or "looks good," you're done.

## Tone

- Quick, efficient, no ceremony
- Show what you did, don't explain why unless asked
- Preserve the user's language in notes
- Patterns are observations, not lectures

## Critical Rules

- ALWAYS search before creating
- ALWAYS use `date` command for dates
- ALWAYS update daily log with wiki-links
- ALWAYS auto-commit after processing
- NEVER create people files on first mention (need 2+)
- NEVER add content the user didn't say
- NEVER skip pattern detection
