# Getting Started

A step-by-step guide to setting up your Living Wiki.

## Prerequisites

- **Obsidian** -- [Download](https://obsidian.md) (free for personal use). Not strictly required but strongly recommended for graph view, backlinks, and search.
- **Claude Code** -- [Get started](https://claude.ai/code). This is the primary LLM interface. Other LLMs with file system access should also work.
- **Git** -- For version control. Every dump, ingestion, and health check auto-commits.
- **Node.js** (optional) -- Only needed if you want to run the health check script.

## Step 1: Clone the Repo

```bash
git clone https://github.com/bronsonelliott/living-wiki.git
cd living-wiki
```

## Step 2: Open in Obsidian

1. Open Obsidian
2. Click "Open another vault" (or File > Open Vault)
3. Select "Open folder as vault"
4. Navigate to the `living-wiki` directory and select it

You should see the vault structure in the left sidebar: `life/`, `ideas/`, `projects/`, `system/`, etc.

## Step 3: Open in Claude Code

In a terminal:

```bash
cd living-wiki
claude
```

Claude Code will load `CLAUDE.md` as project instructions. This is the brain of the system -- it tells Claude how to manage your vault.

## Step 4: Your First Brain Dump

Type `/dump` or just start talking:

```
/dump

I've been thinking about learning Python more seriously. Also, I need to schedule 
a dentist appointment -- it's been way too long. Oh, and Sarah mentioned a great 
Italian restaurant downtown, we should try it this weekend.
```

Claude will:
1. Segment this into 3 topics (learning, health, reference/social)
2. Search the vault for existing notes on each topic
3. Create notes in the appropriate folders with YAML frontmatter
4. Add wiki-links between related notes
5. Update today's daily log
6. Auto-commit to git
7. Show you a summary of what was captured

Check your vault -- you'll see new files in `life/learning/`, `life/health/`, and possibly `reference/` or the daily log.

## Step 5: Your First Recall

```
/recall dentist
```

Claude searches the vault for everything related to "dentist" and presents a synthesized summary. Since you just dumped a dentist thought, it'll find that note plus any other health-related content.

## Step 6: Your First Ingestion

Find an article you want to save:

```
/ingest https://example.com/interesting-article
```

Claude will:
1. Fetch the article content
2. Save the raw content to `raw/`
3. Compile it into a structured wiki note in the appropriate domain
4. Add wiki-links to related existing notes
5. Update the daily log
6. Commit to git

## Step 7: Verify It Works

After your first session, check:

- [ ] Notes exist in domain folders (e.g., `life/health/dentist-appointment.md`)
- [ ] Each note has YAML frontmatter (type, domain, created, source, tags)
- [ ] A daily log exists at `log/YYYY-MM-DD.md` with wiki-link references
- [ ] Git log shows commits: `git log --oneline`
- [ ] In Obsidian: graph view shows connections between notes

## Next Steps

- **Customize your domains** -- edit `system/domain_registry.md` to add domains that match your life. See [customization.md](customization.md).
- **Run a review** -- after a few dump sessions, try `/review` to get a synthesis of what's been captured.
- **Set up health checks** -- see the [scripts/](../scripts/) directory for automated vault maintenance.
- **Keep dumping** -- the system gets smarter the more you use it. Your queries compound into knowledge.

## Troubleshooting

**Claude doesn't follow the parsing rules:**
Make sure CLAUDE.md is in the root of the directory you opened in Claude Code. It should load automatically as project instructions.

**Notes aren't showing in Obsidian:**
Check that you opened the correct folder as an Obsidian vault. The root should be the `living-wiki` directory.

**Git commits aren't happening:**
The vault needs to be a git repository. Run `git init` if you started from scratch instead of cloning.

**Health check script fails:**
Make sure you've run `npm install` in the `scripts/` directory first.
