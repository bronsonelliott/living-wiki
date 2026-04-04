# Living Wiki

**A self-improving knowledge base powered by LLM + Obsidian.**

You talk. The LLM organizes. Every query makes the wiki smarter.

Inspired by [Andrej Karpathy's vision](https://x.com/karpathy/status/2039805659525644595) of LLM-maintained knowledge bases.

---

## What is this?

Living Wiki is an open-source framework that turns [Claude Code](https://claude.ai/code) (or any LLM with file access) and an [Obsidian](https://obsidian.md) vault into a living, self-improving knowledge base. You brain-dump thoughts, ingest content from anywhere, and ask questions -- the LLM organizes, connects, and maintains everything. Your queries compound: every good question adds knowledge back to the wiki.

You never manually organize files. You never fill templates. You never worry about where things go. You talk, the system works.

---

## The Three Loops

```
┌───────────────────────────────────────────────────┐
│                   LIVING WIKI                     │
│                                                   │
│  LOOP 1: INGESTION                                │
│  You talk / paste URL / share PDF                 │
│  -> LLM segments, classifies, routes, links       │
│  -> Structured notes in your vault                │
│                                                   │
│  LOOP 2: QUERY + FILING                           │
│  You ask a question                               │
│  -> LLM searches vault, synthesizes answer        │
│  -> Synthesis auto-filed back to wiki             │
│  -> Your curiosity grows the knowledge base       │
│                                                   │
│  LOOP 3: MAINTENANCE                              │
│  Health checks run on demand or on schedule       │
│  -> Fix broken links, find orphans                │
│  -> Detect patterns, flag stale content           │
│  -> Surface connections you'd never see           │
│                                                   │
│          Every interaction compounds.             │
└───────────────────────────────────────────────────┘
```

**Loop 1** turns chaos into structure. **Loop 2** turns questions into knowledge. **Loop 3** keeps it all healthy.

---

## Quick Start

```
1. Clone this repo into your Obsidian vault folder
   git clone https://github.com/bronsonelliott/living-wiki.git

2. Open the folder in Obsidian (File > Open Vault)

3. Open the folder in Claude Code
   cd living-wiki && claude

4. Run /dump and start talking
   "I need to schedule a dentist appointment. Also, I've been
    thinking about switching careers. Oh, and remind me to call
    Mom this weekend."

5. That's it. The wiki builds itself.
```

After your first dump, check the vault -- you'll see organized notes in domain folders, a daily log with wiki-links, and YAML frontmatter on every file.

---

## What You Get

### Capture and Organize
- **10-step brain dump parsing** -- stream-of-consciousness input gets segmented, classified, routed, linked, logged, and committed
- **Automatic domain routing** -- topics match to life domains via configurable synonym registry
- **Wiki-link maintenance** -- related notes get connected automatically
- **Universal ingestion** -- URLs, PDFs, images, and raw text compiled into structured wiki entries
- **Raw source preservation** -- original content kept in `raw/` with bidirectional links to compiled notes

### Query and Compound
- **Vault-wide recall** -- search everything related to a topic, get a synthesized answer
- **Self-filing query loop** -- substantive answers auto-file back to the wiki as synthesis notes
- **Cross-domain connections** -- queries that span multiple domains describe how they connect
- **Compound knowledge** -- every question you ask makes future answers better

### Maintain and Grow
- **Health checks** -- automated link integrity, orphan detection, stale content flagging
- **Pattern detection** -- recurring topics (3+), cross-domain correlations, temporal cycles, intention drift
- **Cascading updates** -- one note changes, related notes update
- **Periodic reviews** -- weekly, monthly, and quarterly synthesis with domain activity tracking

---

## Commands

| Command | What It Does |
|---------|-------------|
| `/dump` | Brain dump mode. Talk about anything, the LLM organizes it. |
| `/recall <topic>` | Search the vault for everything related to a topic. Auto-files syntheses. |
| `/ingest` | Ingest external content (URLs, PDFs, images, text) into the wiki. |
| `/today` | Daily briefing: tasks due, recent captures, patterns, domain activity. |
| `/review` | Periodic review: surfaces gaps, detects patterns, updates memory. |

Natural language works too: "let me brain dump", "save this article", "what do I know about..." all route to the right command.

---

## How It Works

The system is powered by a single file: `CLAUDE.md`. This is the operating contract between you and the LLM. It defines:

- How to parse brain dumps (the 10-step flow)
- How to classify and route notes (via `system/parsing_rules.md`)
- How to detect patterns (via `system/synthesis_engine.md`)
- How to maintain connections (via `system/cascading_updates.md`)
- How to route to domains (via `system/domain_registry.md`)
- When to file query results back to the wiki (the filing loop)
- How to ingest external content (the ingestion pipeline)

The LLM reads these instructions and follows them. No database, no server, no API keys. Just markdown files and git commits.

For a deep dive, see [docs/how-it-works.md](docs/how-it-works.md).

---

## Customization

Living Wiki ships with sensible defaults, but everything is configurable:

- **Add life domains** -- edit `system/domain_registry.md` to add domains that match your life (e.g., "fitness", "spirituality", "side-hustle")
- **Modify parsing rules** -- adjust the classification matrix in `system/parsing_rules.md` to change how content gets routed
- **Tune pattern detection** -- change thresholds in `system/synthesis_engine.md` (e.g., flag patterns after 2 occurrences instead of 3)
- **Extend the frontmatter schema** -- add custom fields to the note format in `CLAUDE.md`

For the full guide, see [docs/customization.md](docs/customization.md).

---

## Vault Structure

```
living-wiki/
├── CLAUDE.md              # The brain -- operating instructions for the LLM
├── memory.md              # Accumulated knowledge about you (builds over time)
├── inbox/                 # Temporary holding
├── raw/                   # Preserved source material from /ingest
├── life/                  # Life domains (customizable)
│   ├── health/
│   ├── career/
│   ├── finances/
│   ├── home/
│   ├── family/
│   └── learning/
├── projects/              # Active work with defined outcomes
├── ideas/                 # Seeds that aren't projects yet
├── people/                # Notes about people (2+ mentions required)
├── log/                   # Daily logs (YYYY-MM-DD.md)
├── reference/             # Stuff to look up later
├── synthesis/             # Auto-generated patterns and insights
├── archive/               # Completed/stale items (never deleted)
├── system/                # Operating rules
│   ├── parsing_rules.md
│   ├── synthesis_engine.md
│   ├── cascading_updates.md
│   └── domain_registry.md
└── scripts/               # Automation (health checks)
```

---

## Health Checks

Run a health check to find broken links, orphaned notes, stale content, and missing connections:

```bash
cd scripts && npm install
npx tsx health-check.ts ..
```

The report is saved to `synthesis/health-check-YYYY-MM-DD.md` and committed to git.

Schedule this weekly for a self-maintaining vault.

---

## Advanced Extensions

The core framework works with just Claude Code + Obsidian. For power users:

- **Local search engine** -- tools like [QMD](https://github.com/tobilu/qmd) add BM25 + vector search over your vault for faster, smarter `/recall`
- **Chat interface** -- connect via Telegram, Discord, or other messaging platforms for mobile access
- **Scheduled health checks** -- set up cron jobs to run health checks automatically
- **Multi-agent architecture** -- delegate specialist tasks (research, writing, code) to separate LLM instances

These are optional enhancements. The core system runs on nothing but markdown files and an LLM.

---

## Philosophy

1. **You talk, the LLM organizes** -- zero manual file management
2. **Zero friction** -- if it requires discipline, it will fail
3. **Queries compound knowledge** -- asking questions makes the wiki smarter
4. **The wiki heals itself** -- health checks, pattern detection, cascading updates
5. **Markdown is the interface** -- no database, no server, fully portable, fully inspectable

---

## Prerequisites

- [Obsidian](https://obsidian.md) (recommended for viewing, not strictly required -- any markdown editor works)
- [Claude Code](https://claude.ai/code) or any LLM tool with file system access
- [Git](https://git-scm.com/) (for version control and commit history)
- [Node.js](https://nodejs.org/) (optional, for running the health check script)

---

## Examples

See the [examples/](examples/) folder for:
- A multi-topic brain dump session with expected output
- A `/recall` query with auto-filed synthesis
- A URL ingestion flow end-to-end

---

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) -- free to use, share, and adapt with attribution.

---

## Credits

Inspired by [Andrej Karpathy's LLM Knowledge Bases post](https://x.com/karpathy/status/2039805659525644595) (April 2026):

> "I think there is room here for an incredible new product instead of a hacky collection of scripts."

Built by [Bronson Elliott](https://github.com/bronsonelliott).
