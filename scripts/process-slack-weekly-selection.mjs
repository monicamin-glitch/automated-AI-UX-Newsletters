#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  repoRoot,
  writeJson,
  writeMarkdownPreview,
} from './slack-weekly-lib.mjs';

const options = parseArgs(process.argv.slice(2));
const draftPath = path.resolve(repoRoot, options.draftPath);
const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
const selectionText = options.selection || readSelectionFile(options.selectionFile);
const selection = parseSelection(selectionText);

if (!selection.internal.length && !selection.external.length) {
  throw new Error('Could not find Internal or External selections in the provided text.');
}

applySelection(draft.internal, selection.internal, 'internal');
applySelection(draft.external, selection.external, 'external');

draft.approved = true;
draft.status = 'approved';
draft.approvedAt = new Date().toISOString();
draft.approvalSource = options.selectionFile ? path.relative(repoRoot, path.resolve(repoRoot, options.selectionFile)) : 'inline-selection';
draft.publish = draft.publish || {};
draft.publish.output = selection.output || draft.publish.output || 'canvas';

writeJson(draftPath, draft);
writeMarkdownPreview(draftPath.replace(/\.json$/i, '.md'), draft);

console.log(`Updated ${path.relative(repoRoot, draftPath)}`);
console.log(`Internal selected: ${selectedCount(draft.internal)}`);
console.log(`External selected: ${selectedCount(draft.external)}`);
console.log(`Output: ${draft.publish.output}`);
console.log('Next:');
if (draft.publish.output === 'canvas') {
  console.log(`node scripts/generate-slack-weekly-canvas.mjs ${path.relative(repoRoot, draftPath)}`);
} else {
  console.log(`node scripts/publish-slack-weekly.mjs --dry-run ${path.relative(repoRoot, draftPath)}`);
}

function parseSelection(text) {
  return {
    internal: parseIndexes(matchLine(text, /internal\s*:\s*([0-9,\s]+)/i)),
    external: parseIndexes(matchLine(text, /external\s*:\s*([0-9,\s]+)/i)),
    output: normalizeOutput(matchLine(text, /output\s*:\s*(message|canvas)/i)),
  };
}

function applySelection(items, indexes, label) {
  if (!indexes.length) return;
  items.forEach(item => {
    item.selected = false;
  });
  indexes.forEach(index => {
    const item = items[index - 1];
    if (!item) throw new Error(`${label} selection ${index} is out of range.`);
    item.selected = true;
  });
}

function selectedCount(items) {
  return items.filter(item => item.selected).length;
}

function parseIndexes(value) {
  return String(value || '')
    .split(',')
    .map(part => Number.parseInt(part.trim(), 10))
    .filter(Number.isFinite);
}

function matchLine(text, pattern) {
  return String(text || '').match(pattern)?.[1] || '';
}

function normalizeOutput(value) {
  const output = String(value || '').trim().toLowerCase();
  return ['message', 'canvas'].includes(output) ? output : '';
}

function readSelectionFile(selectionFile) {
  if (!selectionFile) return '';
  return fs.readFileSync(path.resolve(repoRoot, selectionFile), 'utf8');
}

function parseArgs(args) {
  const options = {
    selection: '',
    selectionFile: '',
    draftPath: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === '--selection') {
      options.selection = next;
      index += 1;
    } else if (arg === '--selection-file') {
      options.selectionFile = next;
      index += 1;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (!options.draftPath) {
      options.draftPath = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!options.draftPath) throw new Error('Missing draft JSON path.');
  if (!options.selection && !options.selectionFile) {
    throw new Error('Pass --selection "Internal: 1,2 External: 1 Output: canvas" or --selection-file <path>.');
  }
  return options;
}

function printHelp() {
  console.log(`Apply a Slack picker reply to a weekly highlights draft.

Usage:
  node scripts/process-slack-weekly-selection.mjs --selection "Internal: 2, 3, 5 External: 1, 3 Output: canvas" drafts/slack-weekly-highlights-YYYY-MM-DD.json
  node scripts/process-slack-weekly-selection.mjs --selection-file drafts/latest-reply.txt drafts/slack-weekly-highlights-YYYY-MM-DD.json
`);
}
