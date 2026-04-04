# How It Works

Living Wiki is built on a simple idea: the LLM writes and maintains your knowledge base. You read it, query it, and dump thoughts into it. Three reinforcing loops make it self-improving.

## The Core: CLAUDE.md

Everything flows from one file: `CLAUDE.md`. This is the operating contract between you and the LLM. When you open your vault in Claude Code, it reads CLAUDE.md as project instructions and follows the rules defined there.

CLAUDE.md defines:
- How to parse brain dumps (the 10-step flow)
- How to classify and route notes
- How to maintain wiki-links
- When to file query results back to the wiki
- How to ingest external content
- The YAML frontmatter schema
- The vault folder structure

The `system/` folder extends CLAUDE.md with detailed rules for parsing, synthesis, cascading updates, and domain routing.

## Loop 1: Ingestion

### Brain Dumps (`/dump`)

The primary input. You talk in any format -- stream-of-consciousness, bullet points, voice-to-text rambling. The LLM:

1. **Listens** without interrupting
2. **Segments** your input into distinct topics (detects subject shifts, domain shifts, temporal shifts)
3. **Searches** the vault for existing notes on each topic (always search before create)
4. **Classifies** each topic using the matrix in `system/parsing_rules.md`:
   - Actionable + time-bound = task
   - Reflective = idea
   - About a person = note (people file only after 2+ mentions)
   - External content = reference
   - Random thought = daily log only
5. **Routes** to the correct folder based on domain matching via `system/domain_registry.md`
6. **Links** related notes with `[[wiki-links]]`
7. **Logs** everything to today's daily log with wiki-link references
8. **Detects** patterns (3+ mentions of the same topic in 30 days)
9. **Commits** to git
10. **Summarizes** what was captured

### External Content (`/ingest`)

URLs, PDFs, images, and raw text can be ingested into the wiki:

1. Content is fetched and saved to `raw/` with metadata frontmatter
2. The LLM compiles the raw content into structured wiki notes
3. Bidirectional links connect raw sources to compiled notes (`compiled_from` / `compiled_to`)
4. The raw content is always preserved -- the wiki note is the LLM's interpretation

### Why Raw Matters

Keeping the original source material means you can always trace a fact back to where it came from. If the LLM misinterpreted something during compilation, the raw source is right there for re-processing.

## Loop 2: Query + Filing

### Recall (`/recall`)

When you ask a question, the LLM searches the vault and synthesizes an answer from multiple notes. But here's the key insight: **the answer gets filed back into the wiki**.

If a recall produces a substantive synthesis (pulling from 2+ notes to create a new insight), it auto-files as a new note with:
- `type: synthesis` in frontmatter
- `source: recall-query`
- `query:` field preserving the original question
- Wiki-links back to all source notes

### The Compound Effect

This is what makes Living Wiki self-improving. Consider:

1. You dump thoughts about your career over several weeks
2. You dump thoughts about your health over the same period
3. You ask: "Is there a connection between my work stress and my health?"
4. The LLM synthesizes an answer from career notes + health notes
5. That synthesis files back to the wiki
6. Next time you ask about either career or health, the synthesis is there as source material

Your curiosity literally grows the knowledge base. Every good question you ask makes future answers better.

### Skip Filing

Not every query deserves a filed note. The LLM skips filing when:
- The answer came from a single note (no synthesis occurred)
- The query was trivial or conversational

## Loop 3: Maintenance

### Pattern Detection

The synthesis engine (`system/synthesis_engine.md`) detects four types of patterns:

1. **Recurring topics** -- same thing mentioned 3+ times in 30 days
2. **Cross-domain correlations** -- patterns spanning two or more life domains
3. **Temporal patterns** -- time-based cycles (e.g., energy dips every Sunday)
4. **Drift** -- gaps between stated intentions and actual behavior

Patterns require 3+ data points, must be non-obvious, and must be actionable. The system doesn't force patterns where none exist.

### Cascading Updates

When a note changes, related things may need updating (`system/cascading_updates.md`):

- New note created = scan for wiki-link opportunities, check for backlinks
- Task created = associate with projects, track due dates
- Person mentioned 2+ times = create people file, backfill references
- Pattern threshold hit = add to `synthesis/patterns.md`

### Health Checks

The health check script (`scripts/health-check.ts`) scans the vault for:

- **Broken links** -- `[[wiki-links]]` pointing to non-existent notes
- **Orphaned notes** -- notes with no incoming links
- **Missing frontmatter** -- notes without required YAML fields
- **Stale content** -- old notes using temporal language ("upcoming", "next week")
- **Missing connections** -- notes that mention each other but aren't linked

Run it manually or schedule it weekly.

### Periodic Reviews

`/today` gives a daily briefing: tasks due, recent captures, domain activity, pattern flags.

`/review` triggers deeper synthesis: monthly summaries, quarterly big-picture analysis, domain health checks, memory updates.

## The Knowledge Stack

```
┌──────────────────────────────┐
│         memory.md            │  Accumulated knowledge about you
├──────────────────────────────┤
│     synthesis/patterns.md    │  Detected patterns across domains
├──────────────────────────────┤
│    synthesis/monthly/*.md    │  Monthly and quarterly rollups
├──────────────────────────────┤
│     Domain notes (life/*)    │  Organized by life domain
├──────────────────────────────┤
│     log/YYYY-MM-DD.md        │  Daily capture log
├──────────────────────────────┤
│     raw/*                    │  Preserved source material
└──────────────────────────────┘
```

Knowledge flows upward: raw captures become domain notes, domain notes surface patterns, patterns update your memory profile. Each layer adds structure and insight.

## No Database Required

Living Wiki runs on markdown files. There's no SQLite, no PostgreSQL, no vector database in the core framework. The LLM reads files, writes files, and searches by reading. Git provides version control.

For power users who want faster search, tools like QMD add BM25 + vector search over the vault. But the core system works without them.
