#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3456;
const VAULT_PATH = path.resolve(path.join(__dirname, '..'));

function getClaudePath() {
  const paths = [
    path.join(process.env.HOME, '.local', 'bin', 'claude'),
    '/usr/local/bin/claude',
    'claude'
  ];
  for (const p of paths) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {}
  }
  return 'claude';
}

const CLAUDE_BIN = getClaudePath();

function serveIndex(res) {
  const indexPath = path.join(__dirname, 'index.html');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Failed to load index.html');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function buildPrompt(action, text) {
  if (action === 'capture') {
    // Detect if the input contains a URL
    const urlPattern = /https?:\/\/[^\s]+/;
    if (urlPattern.test(text)) {
      return `Ingest this content into the wiki:\n\n${text}`;
    }
    return `Brain dump -- parse and file this:\n\n${text}`;
  }
  if (action === 'ask') {
    return `Recall and synthesize from the wiki: ${text}`;
  }
  return text;
}

function streamClaude(action, text, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  const prompt = buildPrompt(action, text);

  const args = [
    '-p', prompt,
    '--output-format', 'stream-json',
    '--include-partial-messages',
    '--verbose',
    '--dangerously-skip-permissions',
    '--model', 'sonnet',
    '--add-dir', VAULT_PATH
  ];

  const child = spawn(CLAUDE_BIN, args, {
    cwd: VAULT_PATH,
    env: { ...process.env }
  });

  let buffer = '';

  child.stdout.on('data', (data) => {
    buffer += data.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep incomplete line in buffer

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const event = JSON.parse(line);

        if (event.type === 'assistant' && event.message) {
          // Final or partial message
          const content = event.message.content;
          if (Array.isArray(content)) {
            for (const block of content) {
              if (block.type === 'text') {
                res.write(`data: ${JSON.stringify({ type: 'text', content: block.text })}\n\n`);
              }
            }
          }
        } else if (event.type === 'content_block_delta') {
          if (event.delta && event.delta.text) {
            res.write(`data: ${JSON.stringify({ type: 'delta', content: event.delta.text })}\n\n`);
          }
        }
      } catch {}
    }
  });

  child.stderr.on('data', (data) => {
    // Log but don't send to client
    console.error('[claude stderr]', data.toString());
  });

  child.on('close', (code) => {
    res.write(`data: ${JSON.stringify({ type: 'done', code })}\n\n`);
    res.end();
  });

  child.on('error', (err) => {
    res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
    res.end();
  });

  // Handle client disconnect
  req = res.req || {};
  res.on('close', () => {
    child.kill('SIGTERM');
  });
}

function getVaultStats() {
  let noteCount = 0;
  const domains = new Set();

  function walk(dir, depth = 0) {
    if (depth > 3) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'ui') continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (depth === 0) domains.add(entry.name);
          walk(fullPath, depth + 1);
        } else if (entry.name.endsWith('.md')) {
          noteCount++;
        }
      }
    } catch {}
  }

  walk(VAULT_PATH);
  return { noteCount, domainCount: domains.size, vaultPath: VAULT_PATH };
}

const server = http.createServer(async (req, res) => {
  // CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Serve the frontend
  if (url.pathname === '/' && req.method === 'GET') {
    return serveIndex(res);
  }

  // Status endpoint
  if (url.pathname === '/api/status' && req.method === 'GET') {
    const stats = getVaultStats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, ...stats }));
    return;
  }

  // Capture endpoint
  if (url.pathname === '/api/capture' && req.method === 'POST') {
    try {
      const { text } = await parseBody(req);
      if (!text || !text.trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No text provided' }));
        return;
      }
      streamClaude('capture', text.trim(), res);
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // Ask endpoint
  if (url.pathname === '/api/ask' && req.method === 'POST') {
    try {
      const { text } = await parseBody(req);
      if (!text || !text.trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No text provided' }));
        return;
      }
      streamClaude('ask', text.trim(), res);
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n  Living Wiki UI`);
  console.log(`  ──────────────`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  Vault: ${VAULT_PATH}`);
  console.log(`  Claude: ${CLAUDE_BIN}\n`);
});
