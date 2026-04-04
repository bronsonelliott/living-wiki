# Example: URL Ingestion

This shows what happens when you ingest an article into the wiki.

---

## Your Input

```
/ingest https://example.com/articles/intermittent-fasting-guide
```

Or naturally: "Save this article about intermittent fasting."

## What Claude Does

### 1. Fetches the Content

Claude uses its available web fetch tools to retrieve the article. The full article content is captured.

### 2. Saves Raw Content

**`raw/2026-04-20-intermittent-fasting-guide.md`**
```yaml
---
type: raw
source: url
source_url: https://example.com/articles/intermittent-fasting-guide
ingested: 2026-04-20
compiled_to: [life/health/intermittent-fasting.md]
tags: [fasting, nutrition, health]
---

# Intermittent Fasting: A Complete Guide

[Full article text preserved here verbatim -- everything the fetch returned.
This is the unprocessed source material. It may be thousands of words long.
The wiki note below is the compiled, structured version.]

...
```

### 3. Compiles Wiki Note

Claude reads the raw content and produces a structured note:

**`life/health/intermittent-fasting.md`**
```yaml
---
type: reference
domain: health
created: 2026-04-20
source: ingestion
source_url: https://example.com/articles/intermittent-fasting-guide
compiled_from: [raw/2026-04-20-intermittent-fasting-guide.md]
tags: [fasting, nutrition, diet, health]
related: []
aliases: [IF, intermittent fasting, time-restricted eating]
---

# Intermittent Fasting

*Compiled from: [source article](https://example.com/articles/intermittent-fasting-guide)*

## Key Points

- 16:8 method (16 hours fasting, 8 hours eating) is the most common approach
- Benefits: weight management, metabolic health, reduced inflammation
- Not recommended for: pregnant women, people with eating disorders, 
  those on certain medications
- Start gradually -- begin with 12:10 and work up to 16:8

## Common Protocols

| Protocol | Fasting | Eating | Difficulty |
|----------|---------|--------|------------|
| 16:8 | 16 hours | 8 hours | Moderate |
| 5:2 | 2 days/week | 5 days/week | Moderate |
| OMAD | 23 hours | 1 hour | Hard |

## What to Watch

- Hydration is critical during fasting windows
- Coffee and tea (black) don't break a fast
- Break fasts with balanced meals, not junk food
```

### 4. Searches for Connections

Claude searches the vault for related notes:
- Finds `life/health/health-overview.md` -- adds a wiki-link
- No existing nutrition notes -- this is the first

### 5. Updates Daily Log

**`log/2026-04-20.md`**
```markdown
## 15:00 Ingestion

- [[intermittent-fasting]] -- reference article about IF protocols, compiled 
  from [source URL](https://example.com/articles/intermittent-fasting-guide)
```

### 6. Git Commit

```
ingest 2026-04-20: url -> 1 note
```

---

## Key Differences from /dump

| | /dump | /ingest |
|---|---|---|
| Input | Your own thoughts | External content |
| Source preservation | Not needed (it's your words) | Raw saved to `raw/` |
| Compilation | Minimal -- captures your voice | Heavy -- extracts key points from long content |
| Frontmatter | `source: brain-dump` | `source: ingestion` + `compiled_from` + `source_url` |
| Voice | Preserves your language | Summarizes external content |

## Why Both Matter

`/dump` captures what you think. `/ingest` captures what you read. Together, they build a knowledge base that combines your insights with external information. When you later run `/recall`, the LLM synthesizes across both -- connecting your thoughts to the articles you've ingested.
