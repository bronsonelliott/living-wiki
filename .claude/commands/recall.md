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

### 4. Auto-File Synthesis (Filing Loop)

If the answer involved genuine synthesis (pulling insights from 2+ notes to create a new connection or answer), **auto-file the synthesis back into the wiki**:

1. Create a note with frontmatter:
   ```yaml
   type: synthesis
   source: recall-query
   query: "[the original question]"
   ```
2. Add wiki-links to all source notes
3. File in the appropriate domain folder, or `synthesis/` for cross-domain answers
4. Update daily log and git commit
5. Mention to the user: "Filed this synthesis to [[note-name]]"

**Skip filing when:**
- The answer came from a single note (no synthesis occurred)
- The query was trivial or conversational
- The answer is short/simple (no new insight generated)

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
