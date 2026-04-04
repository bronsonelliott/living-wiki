# Cascading Updates — Automatic Sync Rules

When something changes in the vault, related things may need updating too. These rules define what happens automatically.

---

## Core Principle

When a note is created or updated, check and apply cascading updates to related notes. The user doesn't manually maintain connections — you do.

---

## NOTE CREATION/UPDATE CASCADES

### When Any Note Is Created or Updated

**Wiki-Link Maintenance:**
- Scan for references to existing notes → add `[[wiki-links]]`
- Scan existing notes for references to this topic → add backlinks
- If this note relates to another note's topic, add to both notes' `related:` frontmatter

**Domain Cross-Reference:**
- If note touches multiple domains, ensure wiki-links exist in both directions
- Example: health note mentions work stress → link to relevant career note if one exists

---

### When a Task Is Created

**Due Date Tracking:**
- If task has a due date, it will appear in `/today` briefing when due
- If task is overdue, flag in `/today` briefing

**Project Association:**
- If task relates to an active project in `projects/`, add wiki-link
- Update project note with reference to new task

---

### When a Person File Is Created

**Backfill References:**
- Search vault for prior mentions of this person
- Add wiki-links to the person file from those notes
- Add those notes to the person file's `related:` frontmatter

---

## DAILY LOG CASCADES

### When Daily Log Updated (via /dump)

**Recurring Friction Detection:**
- If same friction/complaint appears 3+ times in 30 days
  → Flag: "You've mentioned [topic] 3 times this month. Worth a standalone note?"

**Energy Tracking:**
- If energy or mood mentions appear, track informally
- 3+ negative energy mentions in 14 days → Flag: "Noticing a low-energy pattern. What's going on?"

**Topic Promotion:**
- If a log-only topic appears 2+ times within 14-30 days
  → Promote to standalone note
  → Flag: "You've mentioned [topic] a few times now. Created a note for it."

---

## PATTERN DETECTION CASCADES

### When Pattern Detection Runs (during /dump and /today)

**3+ Occurrences in 30 Days:**
- Same topic, friction, or theme mentioned 3+ times
  → Add to `synthesis/patterns.md`
  → Flag to user in summary

**Cross-Domain Correlation:**
- If two domains show related patterns (e.g., poor sleep + low productivity)
  → Flag: "Noticing [domain A] and [domain B] might be connected. [evidence]"

**Stale Item Detection (weekly):**
- Tasks with no updates in 14+ days → flag as potentially stale
- Ideas with no follow-up in 30+ days → suggest archive or revisit
- Run during `/today` if last stale-check was 7+ days ago

---

## PERIOD-BASED CASCADES

### Weekly (during /today when 7+ days since last check)

**Stale Check:**
- Flag tasks not updated in 14+ days
- Flag ideas not revisited in 30+ days
- No guilt — just visibility

### Monthly (during /review)

**Synthesis Trigger:**
- Generate monthly synthesis in `synthesis/monthly/YYYY-MM.md`
- Identify top themes, patterns, and gaps for the month
- Update `memory.md` if new patterns emerge

**Domain Health Check:**
- Which domains got attention this month?
- Which domains went silent?
- Flag: "No captures in [domain] this month. Intentional or blind spot?"

### Quarterly (during /review when 3+ months since last quarterly)

**Big-Picture Synthesis:**
- Generate quarterly synthesis in `synthesis/quarterly/YYYY-QX.md`
- Cross-domain pattern analysis
- Life trajectory assessment
- Update `memory.md` with quarterly insights

---

## CASCADING UPDATE EXECUTION

When executing cascades:

1. **Detect trigger** — note created/updated, period elapsed, command run
2. **Identify applicable rules** from this document
3. **Read source files** needed to make decisions
4. **Execute updates** if criteria met
5. **Tell user** what cascaded and why (in summary, not interruptively)
6. **Don't cascade infinitely** — if an update triggers another cascade, execute it but stop after 2 levels deep

---

## Anti-Patterns

- **Don't cascade silently** — always mention what was updated in the summary
- **Don't skip cascades** — they keep the vault connected and alive
- **Don't force connections** — only link things that are genuinely related
- **Don't guilt-trip about gaps** — silent domains are information, not failures
- **Don't over-cascade** — if unsure whether a cascade applies, skip it

---

## Cascade Frequency Summary

| Trigger | What Happens |
|---------|-------------|
| Every `/dump` | Wiki-links, pattern detection, topic promotion, daily log update |
| Every `/ingest` | Raw file saved, wiki notes compiled, wiki-links, daily log, git commit |
| Every `/recall` (substantive) | Auto-file synthesis note, wiki-links to sources, daily log |
| Every `/today` | Stale check (if 7+ days), pattern detection, due date surfacing |
| Every `/review` | Monthly synthesis, domain health, memory update |
| Quarterly `/review` | Big-picture synthesis, cross-domain analysis, trajectory check |
| Note created | Wiki-links, backlinks, domain cross-reference |
| Task created | Due date tracking, project association |
| Person file created | Backfill references from vault |
| Health check (weekly) | Link integrity, consistency fixes, orphan detection |
| Gap analysis (biweekly) | Missing coverage identification, new article suggestions |
| Enrichment pass (monthly) | Web search for updates, content suggestions (10 search cap) |
