# Customization

Living Wiki ships with sensible defaults. Everything is configurable by editing markdown files.

## Adding Life Domains

The default domains are: health, family, finances, home, career, learning.

To add a new domain:

1. **Edit `system/domain_registry.md`** -- add a new entry:
   ```markdown
   ### fitness
   - **Folder:** `life/fitness/`
   - **Synonyms:** exercise, gym, running, workout, training, yoga, sports, lifting
   - **Covers:** Exercise routines, fitness goals, workout logs, sports activities
   ```

2. **Create the folder:** `mkdir life/fitness`

3. **Done.** The LLM will now route fitness-related topics to `life/fitness/`.

### Tips
- Check for overlap with existing domains before creating new ones. "Fitness" overlaps with "health" -- decide where exercise topics should go.
- Add synonyms generously. The more synonyms, the better the LLM routes content.
- You can remove default domains you don't use. Just delete the entry from the registry and the folder.

## Modifying Parsing Rules

Edit `system/parsing_rules.md` to change how brain dumps are classified.

### Classification Matrix

The default matrix determines how topics get routed:

| Pattern | Type | Route |
|---------|------|-------|
| Actionable + time-bound | task | domain folder |
| Reflective | idea | `ideas/` or domain folder |
| About a person | note | domain folder |
| External content | reference | `reference/` |
| Random thought | -- | daily log only |

You can:
- **Add new patterns:** e.g., "Contains a URL = reference" or "Mentions money = finances"
- **Change routing:** e.g., route all ideas to domain folders instead of `ideas/`
- **Adjust the tie-breaker rules:** the matrix includes rules for when classification is ambiguous

### Segmentation Rules

You can adjust when the LLM splits topics. By default, it splits on:
- Subject shifts
- Temporal shifts (past to future)
- Domain shifts
- Action-type shifts (reflecting to requesting)

If you want fewer, larger segments: add a note to the rules saying "only split on clear domain shifts."

### People File Threshold

By default, a person needs 2+ mentions across different dumps before getting a `people/` file. Change this threshold in the parsing rules.

## Tuning Pattern Detection

Edit `system/synthesis_engine.md` to adjust how patterns are detected.

### Occurrence Threshold

Default: 3+ mentions in 30 days triggers a pattern flag.

To make it more sensitive: change to 2+ mentions.
To make it less sensitive: change to 5+ mentions.

### Suppression Period

When you dismiss a pattern, it's suppressed for 30 days by default. You can change this to any duration.

### Quality Gates

Before flagging a pattern, the system checks three gates:
1. 3+ clear data points
2. Non-obvious (reveals something you might not see yourself)
3. Actionable (you can do something about it)

You can remove gates for a more aggressive pattern detector, or add gates for more conservative behavior.

## Customizing the Frontmatter Schema

Edit the note format section in `CLAUDE.md` to add custom frontmatter fields.

### Adding Fields

Add new fields to the YAML template:

```yaml
---
type: note
domain: health
created: YYYY-MM-DD
source: brain-dump
tags: []
related: []
priority: low | medium | high    # your custom field
energy: high | low               # another custom field
---
```

The LLM will include these fields when creating new notes.

### Changing Types

The default types are: note, task, idea, person, log, reference, raw, synthesis.

You can add custom types (e.g., "decision", "question", "habit") and add corresponding routing rules in the parsing matrix.

## Adjusting Cascading Updates

Edit `system/cascading_updates.md` to change what happens automatically when notes change.

### Disabling Cascades

If a cascade is too noisy, comment it out or delete it. For example, if you don't want automatic stale-item detection, remove the stale check section.

### Adding Cascades

You can add custom cascades. For example:
- "When a task is marked done, check if the parent project has all tasks done"
- "When a financial note is created, update the monthly spending summary"

### Cascade Depth

By default, cascades stop after 2 levels deep (a cascade triggers another cascade, but not a third). You can increase or decrease this.

## Changing the Vault Structure

The folder structure is defined in `CLAUDE.md`. You can:

- **Rename folders:** change `life/` to `areas/` or `domains/`
- **Add folders:** create new top-level categories
- **Remove folders:** delete categories you don't use
- **Change nesting:** the default max is 2 levels deep (`life/health/`). You can allow deeper nesting if needed.

Make sure to update both the vault structure section in CLAUDE.md and the actual folder structure on disk.

## Changing the Voice

The "Your Voice" section in CLAUDE.md defines how the LLM communicates. Adjust it to match your preferences:

```markdown
## Your Voice

- Formal and detailed
- Include sources and citations
- Use headers and subheaders extensively
- Explain reasoning behind classifications
```

Or keep it casual. Your vault, your rules.
