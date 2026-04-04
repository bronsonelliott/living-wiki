---
description: Search the vault for everything related to a topic
argument-hint: <topic to search for>
---

# /recall -- Vault Search

Search the entire vault for everything related to a topic, then synthesize and present results.

## Flow

### 1. Understand the Query

If the user provides a topic: search for it.
If no topic provided: ask "What are you looking for?"

### 2. Search Strategy

**Primary search:**
- Search the vault using your available tools (grep, glob, file reading)
- Search by frontmatter fields: `type`, `domain`, `tags`
- Search `aliases:` for alternate names
- Search `related:` for connected notes
- Search file names for topic keywords
- Check `system/domain_registry.md` for synonyms to expand search
- Search daily logs for mentions

**People search:**
- If searching for a person, check `people/` first
- Then search all notes for mentions of that name

### 3. Synthesize Results

Don't just dump a file list. Present results as a coherent summary:

```
## [Topic] -- What I Found

**Notes:**
- [[note-1]] (life/health/) -- [brief summary of relevant content]
- [[note-2]] (ideas/) -- [brief summary]

**Tasks:**
- [[task-1]] -- status: active, due: YYYY-MM-DD

**Daily Log Mentions:**
- YYYY-MM-DD: [relevant excerpt]
- YYYY-MM-DD: [relevant excerpt]

**Patterns:**
- [Any patterns from synthesis/patterns.md related to this topic]

**Related Topics:**
- [[related-note-1]], [[related-note-2]]
```

### 4. Auto-File Synthesis (REQUIRED -- Filing Loop)

**This step is mandatory, not optional.** If your answer drew from 2 or more notes, you MUST file the synthesis back into the wiki. This is what makes the wiki self-improving.

**How to file:**

1. Create a new note in the appropriate domain folder (or `synthesis/` for cross-domain):
   ```yaml
   ---
   type: synthesis
   domain: [primary domain]
   created: YYYY-MM-DD
   source: recall-query
   query: "[the original question]"
   tags: []
   related: [source-note-1, source-note-2]
   aliases: []
   ---

   # [Descriptive title]

   *Synthesized from [[source-note-1]], [[source-note-2]] on YYYY-MM-DD*

   [The synthesized answer content]
   ```
2. The body text MUST include `[[wiki-links]]` to all source notes (these are clickable in Obsidian)
3. Update daily log with a reference to the new synthesis note
4. Git commit: `recall-synthesis YYYY-MM-DD: [brief description]`
5. Tell the user: "Filed this synthesis to [[note-name]]"

**Only skip filing when:**
- The answer came from a single note (no synthesis occurred)
- The query was trivial ("how many notes do I have?")

### 5. Cross-Domain Connections

If the recall results span multiple domains, describe the connections:
- "This topic touches health and career -- here's how they connect: [description]"
- Surface non-obvious relationships between notes in different domains

### 6. Offer Follow-Up

After presenting results:
- "Want me to go deeper on any of these?"
- "Want to see the full content of any note?"
- "Anything to add or update based on this?"

## Search Tips

- Cast a wide net first, then narrow if too many results
- Include domain synonyms from the registry
- Check for common misspellings or alternate phrasings
- Search both file names and file contents
- Daily logs often have context not in standalone notes

## Tone

- Efficient, organized presentation
- Lead with the most relevant results
- Group by type (notes, tasks, ideas, log mentions)
- Include enough context to be useful without reading the full note
