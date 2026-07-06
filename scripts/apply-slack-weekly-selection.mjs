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

applySelection(draft.internal, options.internal, 'internal');
applySelection(draft.external, options.external, 'external');

if (options.approve) {
  draft.approved = true;
  draft.status = 'approved';
}

if (options.output) {
  draft.publish = draft.publish || {};
  draft.publish.output = options.output;
}

writeJson(draftPath, draft);
writeMarkdownPreview(draftPath.replace(/\.json$/i, '.md'), draft);

console.log(`Updated ${path.relative(repoRoot, draftPath)}`);
console.log(`Internal selected: ${selectedCount(draft.internal)}`);
console.log(`External selected: ${selectedCount(draft.external)}`);
console.log(`Approved: ${Boolean(draft.approved)}`);
if (options.output) console.log(`Preferred output: ${options.output}`);

function applySelection(items, indexes, label) {
  if (!indexes.length) return;
  items.forEach(item => {
    item.selected = false;
  });

  indexes.forEach(index => {
    const item = items[index - 1];
    if (!item) {
      throw new Error(`${label} selection ${index} is out of range.`);
    }
    item.selected = true;
  });
}

function selectedCount(items) {
  return items.filter(item => item.selected).length;
}

function parseArgs(args) {
  const options = {
    internal: [],
    external: [],
    approve: false,
    output: '',
    draftPath: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === '--internal') {
      options.internal = parseIndexes(next);
      index += 1;
    } else if (arg === '--external') {
      options.external = parseIndexes(next);
      index += 1;
    } else if (arg === '--approve') {
      options.approve = true;
    } else if (arg === '--output') {
      if (!['message', 'canvas'].includes(next)) {
        throw new Error('--output must be "message" or "canvas".');
      }
      options.output = next;
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

  if (!options.draftPath) {
    throw new Error('Missing draft JSON path.');
  }
  if (!options.internal.length && !options.external.length) {
    throw new Error('Pass at least one selection: --internal 1,3 or --external 2,4.');
  }

  return options;
}

function parseIndexes(value) {
  return String(value || '')
    .split(',')
    .map(part => Number.parseInt(part.trim(), 10))
    .filter(Number.isFinite);
}

function printHelp() {
  console.log(`Apply reviewer number picks to a weekly Slack highlights draft.

Usage:
  node scripts/apply-slack-weekly-selection.mjs --internal 1,3,6 --external 2,4,5 --output canvas --approve drafts/slack-weekly-highlights-YYYY-MM-DD.json

Notes:
  Numbers match the private picker message.
  --approve marks the draft ready for the final Slack message or Canvas generation.
`);
}
