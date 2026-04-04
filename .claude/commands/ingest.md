---
description: Ingest external content (URLs, PDFs, images, text) into the wiki
argument-hint: <URL, file path, or paste content>
---

# /ingest -- Content Ingestion

Ingest external content into the wiki. Accepts URLs, PDFs, images, and raw text. Preserves raw source material and compiles structured wiki entries.

## Flow

### 1. Identify Content Type

Determine what was provided:
- **URL** -- a web address to fetch
- **PDF** -- a document to extract text from
- **Image** -- a screenshot or photo to interpret
- **Raw text** -- copy-pasted content from elsewhere

Natural language triggers also work: "save this", "add this", "look at this", "check this out" all signal ingest intent.

### 2. Fetch/Extract Content

- **URLs:** Use your available web fetch tools to retrieve the page content
- **PDFs:** Extract text content
- **Images:** Interpret using vision capabilities
- **Raw text:** Use as-is

If the content can't be fetched (paywall, 404, etc.), report the issue and stop. Don't create empty notes.

### 3. Save Raw

Save the original content to `raw/YYYY-MM-DD-slug.md` (use `date` command for date):

```yaml
---
type: raw
source: url | pdf | image | text
source_url: https://...    # if applicable
ingested: YYYY-MM-DD
compiled_to: []            # updated after compilation
tags: []
---

[Raw content preserved verbatim here]
```

The slug should be a descriptive kebab-case summary of the content (e.g., `intermittent-fasting-guide`, `team-meeting-notes`).

### 4. Compile Wiki Notes

Read the raw content and produce structured wiki entries:

1. **Determine domain(s)** -- use `system/domain_registry.md` synonyms for routing
2. **Extract key points** -- facts, insights, actionable items
3. **Search before create** -- check if existing notes cover this topic. Update rather than duplicate.
4. **Create notes** with proper frontmatter AND body links:
   ```yaml
   ---
   type: reference | note
   domain: [matched domain]
   created: YYYY-MM-DD
   source: ingestion
   source_url: https://...
   compiled_from: [raw/YYYY-MM-DD-slug.md]
   tags: []
   related: []
   aliases: []
   ---

   # [Title]

   *Compiled from: [[raw/YYYY-MM-DD-slug]]*
   *Source: [URL or description](https://...)*

   [Compiled content here]
   ```
   Note: The `compiled_from` in frontmatter is for data. The `[[wiki-link]]` in the body is for Obsidian clickability. Both are required.
5. **Add wiki-links** to related existing notes
6. **Update the raw file's `compiled_to`** with the paths of created notes, AND add clickable links in the raw file's body:
   ```markdown
   **Compiled to:** [[note-name-1]], [[note-name-2]]

   ---

   [Raw content below]
   ```

### 5. Multi-Topic Content

If the source material spans multiple domains:
- Create separate wiki notes for each domain
- All notes link back to the same raw file
- Cross-link the notes to each other

### 6. Update Daily Log

Add an entry to `log/YYYY-MM-DD.md`:

```markdown
## HH:MM Ingestion

- [[note-title]] -- [type] [domain], compiled from [source type]
```

### 7. Git Commit

```
ingest YYYY-MM-DD: [source type] -> [N] notes
```

### 8. Show Summary

```
Ingested: [source description]
Raw saved: raw/YYYY-MM-DD-slug.md

Compiled to:
- [[note-1]] (life/health/) -- [brief description]
- [[note-2]] (reference/) -- [brief description]

Linked to existing: [[related-note]]
Committed.
```

## Tone

- Quick confirmation, not a book report
- Show what was created and where
- Mention any connections found to existing notes

## Critical Rules

- ALWAYS preserve raw content in `raw/` (never skip this step)
- ALWAYS use `date` command for dates
- ALWAYS search before create (update existing notes if topic is covered)
- ALWAYS maintain bidirectional links (compiled_from / compiled_to)
- NEVER create empty notes from failed fetches
- NEVER modify the raw content after saving (it's a source-of-truth archive)
- NEVER skip the daily log update
