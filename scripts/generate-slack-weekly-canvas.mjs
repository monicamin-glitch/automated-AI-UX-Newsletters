#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  buildCanvasMarkdown,
  buildCanvasTitle,
  repoRoot,
  validateApprovedDraft,
} from './slack-weekly-lib.mjs';

const options = parseArgs(process.argv.slice(2));
const draftPath = path.resolve(repoRoot, options.draftPath);
const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
const errors = options.force ? [] : validateApprovedDraft(draft);

if (errors.length) {
  console.error('Draft is not ready for Canvas generation:');
  errors.forEach(error => console.error(`- ${error}`));
  console.error('\nSet approved=true after selecting the top highlights, or use --force only for local preview.');
  process.exit(1);
}

const canvasMarkdown = buildCanvasMarkdown(draft);
const outPath = path.resolve(
  repoRoot,
  options.out || draftPath.replace(/\.json$/i, '.canvas.md')
);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${canvasMarkdown}\n`);

console.log(`Created ${path.relative(repoRoot, outPath)}`);
console.log('\nCanvas title suggestion:');
console.log(buildCanvasTitle(draft));
console.log('\nCanvas markdown preview:');
console.log('---');
console.log(canvasMarkdown);

function parseArgs(args) {
  const options = {
    force: false,
    out: '',
    draftPath: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === '--force') {
      options.force = true;
    } else if (arg === '--out') {
      options.out = next;
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

  return options;
}

function printHelp() {
  console.log(`Generate Slack Canvas-flavored Markdown from an approved weekly highlights draft.

Usage:
  node scripts/generate-slack-weekly-canvas.mjs drafts/slack-weekly-highlights-YYYY-MM-DD.json
  node scripts/generate-slack-weekly-canvas.mjs --force drafts/slack-weekly-highlights-YYYY-MM-DD.json

Output:
  drafts/slack-weekly-highlights-YYYY-MM-DD.canvas.md

The output can be pasted into a Slack Canvas creation flow or used by an automation that calls a Slack Canvas creation tool.
`);
}
