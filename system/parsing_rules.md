# Parsing Rules

How to split stream-of-consciousness brain dumps into organized notes.

---

## Rule #1: Search Before Create

Before creating ANY new note:

1. **Query vault** for existing notes with similar topic, domain, or tags
2. **Check aliases** — the same topic might be referenced with different words
3. If a relevant note exists → **update it** instead of creating a duplicate
4. If updating, add new aliases to frontmatter when the topic was referenced differently

This is the most important rule. Duplicates make the vault useless.

---

## Topic Segmentation

A brain dump may contain multiple topics. Split when you detect:

- **Subject shift** — talking about health → talking about a project
- **Temporal shift** — past event → future plan
- **Domain shift** — family → finances
- **Action-type shift** — reflecting → requesting action

Keep segments atomic but not too granular. "I need to call the dentist and also schedule my annual physical" is ONE health segment, not two.

---

## Classification Matrix

For each segment, classify using this decision tree:

| Pattern | Type | Route |
|---------|------|-------|
| "I need to..." / has deadline / has due date | task | domain folder |
| "I've been thinking..." / reflective | idea | `ideas/` or domain folder |
| "[Person] said/did..." / about someone | note | domain folder (people file only if 2+ mentions) |
| "I decided to..." / explicit choice made | note + `#decision` tag | domain folder |
| "Appointment on [date]" / calendar item | task | domain folder |
| "I read/saw/heard..." / external content | reference | `reference/` |
| Random observation / shower thought | note | daily log only (no standalone) |
| Vague / ambiguous ("I should probably...") | -- | daily log only |
| Ingested external content (URL, PDF, image) | raw + compiled note | `raw/` + domain folder |
| Auto-filed /recall synthesis (2+ source notes) | synthesis | domain folder or `synthesis/` |

### Tie-Breaker Rules

When classification is ambiguous:

1. **Actionable + time-bound** → task (even if it sounds reflective)
2. **Reflective but not actionable** → note or idea
3. **Unresolved possibility** → idea
4. **Low-signal or can't decide** → daily log only
5. **Topic mentioned 2x within 14-30 days** → promote from log-only to standalone note

When in doubt about where to route: **capture to daily log**. It's always better to have something in the log than to misroute it or lose it.

---

## Signal Filtering: The "Future-You" Test

For each segment, ask: **"Would future-you want to find this?"**

- **Yes, specifically** → standalone note with proper frontmatter and links
- **Maybe, as context** → daily log entry with wiki-link if referencing an existing note
- **No** → still capture in daily log (it's free), but don't create a standalone note

Never discard content the user said. The daily log is the safety net.

---

## Domain Routing

When a topic maps to a life domain:

1. Check `system/domain_registry.md` for the domain and its synonyms
2. Route to the matching `life/[domain]/` folder
3. If no domain matches and it's a clear new domain → check creation threshold (3+ mentions or user confirmation)
4. If unclear → route to `inbox/` or daily log

Cross-domain topics (e.g., "career stress affecting health"):
- Route to the **primary** domain (whichever is most actionable)
- Add wiki-links to notes in the secondary domain
- Tag with both domains

---

## People Mentions

People are mentioned all the time in brain dumps. Don't auto-create files for everyone.

- **First casual mention** → log only, no people file
- **Create `people/[name].md`** only when:
  - Mentioned 2+ times across different dumps
  - OR relationship context is provided ("my manager", "my sister")
  - OR an action directly involves them ("need to call Dr. Smith about results")

---

## Output: What Gets Created

After parsing a brain dump, Claude produces:

1. **New or updated notes** in appropriate locations with full frontmatter
2. **Updated daily log** (`log/YYYY-MM-DD.md`) with wiki-link references to all notes touched
3. **Wiki-links** connecting related notes
4. **Pattern detection results** (if any thresholds met)
5. **Git commit** of all changes
6. **Summary** showing what was captured and where
