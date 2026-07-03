#!/usr/bin/env node

import path from 'node:path';
import {
  defaultDigestUrl,
  parseCards,
  parseLatestWeek,
  pickCandidates,
  readHtml,
  repoRoot,
  writeJson,
  writeMarkdownPreview,
} from './slack-weekly-lib.mjs';

const options = parseArgs(process.argv.slice(2));
const html = readHtml();
const week = parseLatestWeek(html);
const cards = parseCards(week.html);

const internal = pickCandidates(cards.internal, options.candidates, options.internalCount);
const external = pickCandidates(cards.external, options.candidates, options.externalCount);
const draftDate = options.date || new Date().toISOString().slice(0, 10);
const baseName = `slack-weekly-highlights-${draftDate}`;
const outPath = path.resolve(repoRoot, options.out || path.join('drafts', `${baseName}.json`));
const previewPath = outPath.replace(/\.json$/i, '.md');

const draft = {
  version: 1,
  status: 'draft',
  approved: false,
  generatedAt: new Date().toISOString(),
  instructions: [
    'Review the candidate lists below.',
    'Keep selected=true for the items you want to publish and set selected=false for the rest.',
    `Choose up to ${options.internalCount} internal Slack updates and up to ${options.externalCount} external AI updates.`,
    'Set approved=true only when the message is ready to post.',
    'Run: node scripts/publish-slack-weekly.mjs --dry-run <this-file>',
    'Then run: node scripts/publish-slack-weekly.mjs --post <this-file>',
  ],
  week: {
    id: week.id,
    label: week.label,
    date: week.date,
  },
  publish: {
    target: 'internal UX Slack channel',
    channelId: process.env.SLACK_CHANNEL_ID || '',
    digestUrl: options.digestUrl,
    maxInternal: options.internalCount,
    maxExternal: options.externalCount,
  },
  internal,
  external,
};

writeJson(outPath, draft);
writeMarkdownPreview(previewPath, draft);

console.log(`Created ${path.relative(repoRoot, outPath)}`);
console.log(`Created ${path.relative(repoRoot, previewPath)}`);
console.log(`Internal candidates: ${internal.length}`);
console.log(`External candidates: ${external.length}`);
console.log('\nNext: edit selected flags, set approved=true, then run:');
console.log(`node scripts/publish-slack-weekly.mjs --dry-run ${path.relative(repoRoot, outPath)}`);

function parseArgs(args) {
  const options = {
    candidates: 8,
    internalCount: 3,
    externalCount: 3,
    digestUrl: defaultDigestUrl,
    out: '',
    date: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === '--candidates') {
      options.candidates = Number.parseInt(next, 10);
      index += 1;
    } else if (arg === '--internal-count') {
      options.internalCount = Number.parseInt(next, 10);
      index += 1;
    } else if (arg === '--external-count') {
      options.externalCount = Number.parseInt(next, 10);
      index += 1;
    } else if (arg === '--digest-url') {
      options.digestUrl = next;
      index += 1;
    } else if (arg === '--out') {
      options.out = next;
      index += 1;
    } else if (arg === '--date') {
      options.date = next;
      index += 1;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isFinite(options.candidates) || options.candidates < 1) throw new Error('--candidates must be a positive number');
  if (!Number.isFinite(options.internalCount) || options.internalCount < 1) throw new Error('--internal-count must be a positive number');
  if (!Number.isFinite(options.externalCount) || options.externalCount < 1) throw new Error('--external-count must be a positive number');
  return options;
}

function printHelp() {
  console.log(`Generate a manual approval draft for the weekly Slack highlights.

Usage:
  node scripts/generate-slack-weekly-draft.mjs [options]

Options:
  --candidates <n>       Number of candidates per category to include. Default: 8
  --internal-count <n>   Recommended internal selections. Default: 3
  --external-count <n>   Recommended external selections. Default: 3
  --digest-url <url>     Full digest URL. Default: ${defaultDigestUrl}
  --date <YYYY-MM-DD>    Date used in the draft filename. Default: today
  --out <path>           Output JSON path. Default: drafts/slack-weekly-highlights-<date>.json
`);
}
