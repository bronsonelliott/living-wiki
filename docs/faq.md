# FAQ

## General

**Do I need Claude Code specifically?**
Claude Code is the primary target because CLAUDE.md is designed for it. But the framework is just markdown files with instructions. Any LLM that can read files, write files, and follow instructions should work. You may need to adapt some tool-specific references (like slash commands) for other environments.

**Do I need Obsidian?**
Recommended but not required. Obsidian gives you graph view (visualize connections between notes), automatic backlinks, and powerful search. But the vault is just a folder of markdown files -- any text editor works for reading and writing.

**Is this a note-taking app?**
No. You don't take notes. You talk, and the LLM creates structured notes for you. The key difference: you never manually organize, file, or tag anything. The LLM does all of that following the rules in CLAUDE.md and the system/ folder.

**How is this different from ChatGPT/Claude memory?**
Chat memory stores summaries in a black box you can't inspect or edit. Living Wiki stores full-fidelity notes in markdown files you own, version-controlled with git, viewable in Obsidian, and fully portable. You can read, edit, or delete any note. The LLM's "memory" is literally files on your disk.

**Can I use this for work?**
The default domains include "career" for work-related content. You can add work-specific domains (e.g., "projects", "meetings", "stakeholders"). Just be mindful of sensitive information -- the "no secrets" rule in CLAUDE.md exists for a reason.

## Setup

**The LLM isn't following the parsing rules.**
Make sure CLAUDE.md is in the root of the directory you opened in Claude Code. It loads automatically as project instructions. If you're using a different LLM, you may need to explicitly paste or reference the instructions.

**Git commits aren't happening automatically.**
The vault needs to be initialized as a git repo. If you started from a zip download instead of `git clone`, run `git init` in the vault directory.

**The health check script fails.**
Run `npm install` in the `scripts/` directory first. The script requires the `glob` package.

## Usage

**What if I dump something and it gets classified wrong?**
Tell the LLM. "Move that to ideas instead of tasks" or "That's not health, it's career." The LLM will reclassify and re-commit.

**Can I manually edit notes?**
Yes. They're your files. But the system works best when the LLM handles organization. If you manually edit frontmatter or move files, the LLM will adapt on the next interaction.

**What if the vault gets messy?**
Run a health check: `npx tsx scripts/health-check.ts`. It finds broken links, orphaned notes, stale content, and missing connections. The LLM can also clean things up if you ask: "Hey, my vault feels messy. Run a health check and fix what you find."

**How do I delete notes?**
Move them to `archive/` rather than deleting. This preserves history and avoids breaking wiki-links. The LLM follows a "never delete" policy -- archive instead.

**Can multiple people use the same vault?**
Not recommended. Living Wiki builds a personalized knowledge model in `memory.md`. It's designed for one person's brain. Multiple users would create conflicting patterns and memory.

## Advanced

**How do I add search (vector/semantic)?**
The core framework uses the LLM's native ability to read and search files. For larger vaults (500+ notes), you may want a dedicated search tool. QMD, Ollama with embeddings, or any vector search tool that indexes markdown files will work. Add search instructions to CLAUDE.md to tell the LLM which tool to use.

**Can I connect this to Telegram/Discord?**
Yes, but that requires additional infrastructure (a bot process, message routing). This is outside the scope of the core framework. The core is designed for direct Claude Code interaction.

**How do I schedule health checks?**
Set up a cron job:
```cron
0 10 * * 0 cd /path/to/living-wiki && npx tsx scripts/health-check.ts .
```
This runs every Sunday at 10 AM.

**Can the LLM update notes on a schedule (without me)?**
Not in the core framework. This would require a persistent agent process. See the "Advanced Extensions" section in the README for pointers.

**How big can the vault get?**
The framework itself has no size limits. Performance depends on your LLM's context window and file-reading capabilities. At 100-200 notes, everything works smoothly. At 500+, you'll want a search tool to help the LLM find relevant notes without reading everything.
