#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = path.join(repoRoot, 'index.html');
const privateDir = path.join(repoRoot, 'automation-status');
const privateStorePath = path.join(privateDir, 'private-slack-originals.json');
const bpagesPath = path.join(privateDir, 'bpages-index.html');
const writePublic = process.argv.includes('--write-public');
const githubAssetBase = 'https://monicamin-glitch.github.io/automated-AI-UX-Newsletters/';

fs.mkdirSync(privateDir, { recursive: true });

const sourceHtml = fs.readFileSync(indexPath, 'utf8');
const originals = readJson(privateStorePath, {});

// Seed the private store from local-only artifacts when available. These paths are
// deliberately ignored by git and must never be added to the public repository.
for (const candidate of [
  path.join(repoRoot, 'preview', 'three-week-merge', 'bpages.html'),
  bpagesPath,
  indexPath,
]) {
  if (fs.existsSync(candidate)) harvestVerifiedOriginals(fs.readFileSync(candidate, 'utf8'), originals);
}

const publicHtml = removeBpagesOnlyHeader(transformSlackCards(sourceHtml, ({ tag }) => {
  const summary = attr(tag, 'data-slack-content');
  return setAttrs(tag, {
    'data-slack-quote': summary || '',
    'data-slack-detail-kind': 'newsletter-summary',
    'data-slack-original-verified': 'false',
  });
}));

let bpagesHtml = transformSlackCards(sourceHtml, ({ tag, url }) => {
  const original = originals[url];
  if (!original?.quote) return setAttrs(tag, { 'data-slack-original-verified': 'false' });
  return setAttrs(tag, {
    'data-slack-quote': original.quote,
    'data-slack-detail-kind': 'original-slack-message',
    'data-slack-original-verified': 'true',
  });
});
bpagesHtml = addBpagesHeaderCredit(absolutizeAssets(bpagesHtml));

const publicVerifiedCount = count(publicHtml, /data-slack-original-verified="true"/g);
if (publicVerifiedCount) throw new Error(`Public artifact still contains ${publicVerifiedCount} verified original Slack message(s).`);
if (count(bpagesHtml, /data:image/gi)) throw new Error('B.Pages artifact contains blocked data: image URIs.');

fs.writeFileSync(privateStorePath, `${JSON.stringify(originals, null, 2)}\n`);
fs.writeFileSync(bpagesPath, bpagesHtml);
if (writePublic) fs.writeFileSync(indexPath, publicHtml);

console.log(JSON.stringify({
  publicPath: writePublic ? indexPath : '(not written; pass --write-public)',
  bpagesPath,
  privateOriginals: Object.keys(originals).length,
  publicVerifiedOriginals: publicVerifiedCount,
  bpagesVerifiedOriginals: count(bpagesHtml, /data-slack-original-verified="true"/g),
}, null, 2));

function harvestVerifiedOriginals(html, store) {
  transformSlackCards(html, ({ tag, url }) => {
    if (attr(tag, 'data-slack-original-verified') !== 'true' || !url) return tag;
    const quote = attr(tag, 'data-slack-quote');
    if (quote) store[url] = { quote, capturedAt: store[url]?.capturedAt || new Date().toISOString() };
    return tag;
  });
}

function transformSlackCards(html, transform) {
  return html.replace(/<a class="slack-card"[^>]*>/g, tag => {
    const url = normalizeUrl(attr(tag, 'href') || attr(tag, 'data-slack-link'));
    return transform({ tag, url });
  });
}

function addBpagesHeaderCredit(html) {
  let result = html.replace(/\s*<span class="nav-logo-authors"[^>]*>[^<]*<\/span>/g, '');
  if (!result.includes('.nav-logo-authors {')) {
    result = result.replace(
      '</style>',
      '    .nav-logo-authors { margin-left: auto; padding-left: 20px; color: var(--text-muted); font-size: 11px; font-weight: 600; line-height: 1.2; white-space: nowrap; }\n    @media (max-width: 768px) { .nav-logo-authors { position: absolute; top: 20px; right: 16px; margin: 0; padding: 0; font-size: 10px; } }\n  </style>'
    );
  }
  return result.replace(
    /(<div class="nav-tabs">[\s\S]*?<\/div>)(\s*<\/nav>)/,
    '$1\n    <span class="nav-logo-authors">Created by Monica Min · Wang Zi</span>$2'
  );
}

function removeBpagesOnlyHeader(html) {
  return html
    .replace(/\s*<span class="nav-logo-authors"[^>]*>[^<]*<\/span>/g, '')
    .replace(/\s*\.nav-logo-authors\s*\{[^}]*\}/g, '')
    .replace(/\s*@media \(max-width: 768px\)\s*\{\s*\.nav-logo-authors\s*\{[^}]*\}\s*\}/g, '');
}

function absolutizeAssets(html) {
  return html.replace(
    /((?:src|data-img)=")(?!(?:https?:|data:))(assets\/[A-Za-z0-9_./-]+\.(?:gif|jpe?g|png|svg|webp))"/gi,
    (_, prefix, assetPath) => `${prefix}${githubAssetBase}${assetPath}"`
  );
}

function setAttrs(tag, values) {
  let result = tag;
  for (const [name, value] of Object.entries(values)) {
    const escaped = escapeAttr(value);
    const pattern = new RegExp(`${name}="[^"]*"`);
    result = pattern.test(result)
      ? result.replace(pattern, `${name}="${escaped}"`)
      : result.replace(/>$/, ` ${name}="${escaped}">`);
  }
  return result;
}

function attr(tag, name) {
  return decodeAttr(tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] || '');
}

function normalizeUrl(value) {
  return String(value || '').trim();
}

function escapeAttr(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function decodeAttr(value) {
  return String(value)
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}

function count(value, pattern) {
  return (String(value).match(pattern) || []).length;
}
