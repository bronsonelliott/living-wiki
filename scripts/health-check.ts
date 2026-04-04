#!/usr/bin/env npx tsx
/**
 * Living Wiki -- Health Check
 *
 * Runs consistency checks, link integrity, and orphan detection on your vault.
 * Outputs a health check report to synthesis/health-check-YYYY-MM-DD.md and commits.
 *
 * Usage: npx tsx scripts/health-check.ts [vault-path]
 *
 * If vault-path is not provided, uses the current working directory.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { glob } from 'glob';

// Configurable: pass vault path as CLI argument or default to cwd
const VAULT = process.argv[2] || process.cwd();
const EXCLUDE_DIRS = ['.obsidian', '.claude', 'raw', 'system', 'scripts', 'docs', 'examples', 'node_modules'];
// Files that intentionally don't have frontmatter
const SYSTEM_FILES = new Set(['claude', 'memory', 'readme', 'license']);

interface NoteInfo {
  path: string;
  name: string; // filename without .md
  frontmatter: Record<string, any>;
  bodyText: string;
  wikiLinks: string[]; // outgoing [[links]]
  hasDate: boolean;
}

function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const fm: Record<string, any> = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const kv = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/);
    if (kv) {
      let val = kv[2].trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1);
        fm[kv[1]] = val ? val.split(',').map(s => s.trim()) : [];
      } else {
        fm[kv[1]] = val;
      }
    }
  }
  return { frontmatter: fm, body: match[2] };
}

function extractWikiLinks(text: string): string[] {
  const links: string[] = [];
  const re = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    links.push(m[1].toLowerCase().trim());
  }
  return links;
}

function loadVault(): NoteInfo[] {
  const files = glob.sync('**/*.md', {
    cwd: VAULT,
    ignore: EXCLUDE_DIRS.map(d => `${d}/**`),
  });

  const notes: NoteInfo[] = [];
  for (const relPath of files) {
    const fullPath = path.join(VAULT, relPath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);
    const name = path.basename(relPath, '.md');

    notes.push({
      path: relPath,
      name: name.toLowerCase(),
      frontmatter,
      bodyText: body,
      wikiLinks: extractWikiLinks(body),
      hasDate: !!frontmatter.created,
    });
  }
  return notes;
}

interface Finding {
  type: 'broken-link' | 'orphan' | 'stale' | 'missing-frontmatter' | 'inconsistency' | 'suggestion';
  severity: 'fix' | 'flag' | 'info';
  file: string;
  detail: string;
}

function checkLinkIntegrity(notes: NoteInfo[]): Finding[] {
  const findings: Finding[] = [];
  const noteNames = new Set(notes.map(n => n.name));

  for (const note of notes) {
    // Skip CLAUDE.md -- it contains example wiki-link syntax, not real links
    if (SYSTEM_FILES.has(note.name)) continue;
    for (const link of note.wikiLinks) {
      if (!noteNames.has(link)) {
        findings.push({
          type: 'broken-link',
          severity: 'fix',
          file: note.path,
          detail: `Broken wiki-link [[${link}]] -- target does not exist`,
        });
      }
    }
  }
  return findings;
}

function checkOrphans(notes: NoteInfo[]): Finding[] {
  const findings: Finding[] = [];

  const incomingLinks = new Map<string, string[]>();
  for (const note of notes) {
    incomingLinks.set(note.name, []);
  }
  for (const note of notes) {
    for (const link of note.wikiLinks) {
      const existing = incomingLinks.get(link);
      if (existing) existing.push(note.path);
    }
  }

  for (const note of notes) {
    if (SYSTEM_FILES.has(note.name)) continue;
    if (note.path.startsWith('log/')) continue;
    if (note.path.startsWith('synthesis/')) continue;

    const incoming = incomingLinks.get(note.name) || [];
    let hasRelatedRef = false;
    for (const other of notes) {
      const related = other.frontmatter.related;
      if (Array.isArray(related) && related.includes(note.name)) {
        hasRelatedRef = true;
        break;
      }
    }

    if (incoming.length === 0 && !hasRelatedRef) {
      findings.push({
        type: 'orphan',
        severity: 'flag',
        file: note.path,
        detail: `Orphaned note -- no incoming wiki-links or related references from other notes`,
      });
    }
  }
  return findings;
}

function checkFrontmatter(notes: NoteInfo[]): Finding[] {
  const findings: Finding[] = [];
  const requiredFields = ['type', 'domain', 'created', 'source', 'tags'];

  for (const note of notes) {
    if (note.path.startsWith('log/')) continue;
    if (SYSTEM_FILES.has(note.name)) continue;

    if (Object.keys(note.frontmatter).length === 0) {
      findings.push({
        type: 'missing-frontmatter',
        severity: 'fix',
        file: note.path,
        detail: 'Missing frontmatter entirely',
      });
      continue;
    }

    for (const field of requiredFields) {
      if (!(field in note.frontmatter)) {
        findings.push({
          type: 'missing-frontmatter',
          severity: 'flag',
          file: note.path,
          detail: `Missing frontmatter field: ${field}`,
        });
      }
    }
  }
  return findings;
}

function checkStaleContent(notes: NoteInfo[]): Finding[] {
  const findings: Finding[] = [];
  const now = new Date();
  const staleWords = ['upcoming', 'next week', 'next month', 'this weekend', 'tomorrow', 'soon'];

  for (const note of notes) {
    const created = note.frontmatter.created;
    if (!created) continue;

    const createdDate = new Date(created);
    const daysSinceCreated = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceCreated > 30) {
      for (const word of staleWords) {
        if (note.bodyText.toLowerCase().includes(word)) {
          findings.push({
            type: 'stale',
            severity: 'flag',
            file: note.path,
            detail: `Note is ${Math.floor(daysSinceCreated)} days old but contains "${word}" -- may need updating`,
          });
          break;
        }
      }
    }
  }
  return findings;
}

function suggestMissingConnections(notes: NoteInfo[]): Finding[] {
  const findings: Finding[] = [];
  const noteNames = new Map(notes.map(n => [n.name, n]));

  for (const note of notes) {
    if (SYSTEM_FILES.has(note.name)) continue;
    if (note.path.startsWith('log/')) continue;
    if (note.path.startsWith('synthesis/')) continue;

    for (const [otherName] of noteNames) {
      if (otherName === note.name) continue;
      if (note.wikiLinks.includes(otherName)) continue;
      if (SYSTEM_FILES.has(otherName)) continue;

      if (otherName.length < 5) continue;

      const termLower = otherName.toLowerCase();
      if (note.bodyText.toLowerCase().includes(termLower)) {
        findings.push({
          type: 'suggestion',
          severity: 'info',
          file: note.path,
          detail: `Mentions "${otherName}" but doesn't link to [[${otherName}]]`,
        });
      }
    }
  }
  return findings;
}

function generateReport(findings: Finding[]): string {
  const date = new Date().toISOString().split('T')[0];
  const fixes = findings.filter(f => f.severity === 'fix');
  const flags = findings.filter(f => f.severity === 'flag');
  const infos = findings.filter(f => f.severity === 'info');

  let report = `---
type: synthesis
domain: meta
created: ${date}
source: health-check
tags: [health-check, maintenance]
related: []
aliases: []
---

# Wiki Health Check -- ${date}

Automated health check of the Living Wiki vault.

## Summary

| Category | Count |
|----------|-------|
| Auto-fixes applied | ${fixes.length} |
| Flagged for review | ${flags.length} |
| Suggestions | ${infos.length} |
| **Total findings** | **${findings.length}** |

`;

  if (fixes.length > 0) {
    report += `## Auto-Fixes Applied\n\n`;
    for (const f of fixes) {
      report += `- **${f.file}**: ${f.detail}\n`;
    }
    report += '\n';
  }

  if (flags.length > 0) {
    report += `## Flagged for Review\n\n`;
    for (const f of flags) {
      report += `- **${f.file}**: ${f.detail}\n`;
    }
    report += '\n';
  }

  if (infos.length > 0) {
    report += `## Suggestions (Missing Connections)\n\n`;
    const byFile = new Map<string, Finding[]>();
    for (const f of infos) {
      const arr = byFile.get(f.file) || [];
      arr.push(f);
      byFile.set(f.file, arr);
    }
    for (const [file, items] of byFile) {
      report += `### ${file}\n`;
      for (const item of items) {
        report += `- ${item.detail}\n`;
      }
      report += '\n';
    }
  }

  if (findings.length === 0) {
    report += `All clear -- no issues found.\n`;
  }

  return report;
}

function main(): void {
  console.log(`Living Wiki Health Check`);
  console.log(`Vault: ${VAULT}`);
  console.log('');

  if (!fs.existsSync(path.join(VAULT, 'CLAUDE.md'))) {
    console.error('Error: CLAUDE.md not found. Are you running this from a Living Wiki vault?');
    process.exit(1);
  }

  console.log('Loading vault...');
  const notes = loadVault();
  console.log(`Loaded ${notes.length} notes`);

  const findings: Finding[] = [];

  console.log('Checking link integrity...');
  findings.push(...checkLinkIntegrity(notes));

  console.log('Checking orphans...');
  findings.push(...checkOrphans(notes));

  console.log('Checking frontmatter...');
  findings.push(...checkFrontmatter(notes));

  console.log('Checking stale content...');
  findings.push(...checkStaleContent(notes));

  console.log('Suggesting missing connections...');
  findings.push(...suggestMissingConnections(notes));

  const report = generateReport(findings);
  const date = new Date().toISOString().split('T')[0];

  // Ensure synthesis directory exists
  const synthesisDir = path.join(VAULT, 'synthesis');
  if (!fs.existsSync(synthesisDir)) {
    fs.mkdirSync(synthesisDir, { recursive: true });
  }

  const reportPath = path.join(synthesisDir, `health-check-${date}.md`);
  fs.writeFileSync(reportPath, report);

  console.log('');
  console.log(`Report: synthesis/health-check-${date}.md`);
  console.log(`Findings: ${findings.length} (${findings.filter(f => f.severity === 'fix').length} fixes, ${findings.filter(f => f.severity === 'flag').length} flags, ${findings.filter(f => f.severity === 'info').length} suggestions)`);

  // Git commit if in a git repo
  try {
    execSync('git rev-parse --git-dir', { cwd: VAULT, stdio: 'ignore' });
    execSync('git add -A', { cwd: VAULT });
    execSync(`git commit -m "health-check ${date}: ${findings.length} findings"`, { cwd: VAULT });
    console.log('Committed to git');
  } catch {
    // Not a git repo or no changes -- that's fine
  }
}

main();
