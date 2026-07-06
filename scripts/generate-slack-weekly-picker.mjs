#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  buildPickerMessage,
  buildPickerMessageChunks,
  repoRoot,
} from './slack-weekly-lib.mjs';

const options = parseArgs(process.argv.slice(2));
const draftPath = path.resolve(repoRoot, options.draftPath);
const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
const message = buildPickerMessage(draft);
const chunks = buildPickerMessageChunks(draft);
const outPath = path.resolve(repoRoot, options.out || draftPath.replace(/\.json$/i, '.picker.md'));

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${message}\n`);

if (options.dryRun) {
  console.log(message);
  process.exit(0);
}

if (!options.post) {
  console.log(`Created ${path.relative(repoRoot, outPath)}`);
  console.log('\nPreview or send it with:');
  console.log(`node scripts/generate-slack-weekly-picker.mjs --dry-run ${path.relative(repoRoot, draftPath)}`);
  console.log(`node scripts/generate-slack-weekly-picker.mjs --post --reviewer-id U... ${path.relative(repoRoot, draftPath)}`);
  process.exit(0);
}

const token = process.env.SLACK_BOT_TOKEN;
const reviewerId = options.reviewerId || process.env.SLACK_REVIEWER_ID;

if (!token) {
  throw new Error('Missing SLACK_BOT_TOKEN. Store the bot token in the environment; do not commit it.');
}

if (!reviewerId) {
  throw new Error('Missing reviewer ID. Pass --reviewer-id U... or set SLACK_REVIEWER_ID.');
}

for (const chunk of chunks) {
  await callSlackApi('chat.postMessage', {
    channel: reviewerId,
    text: chunk,
    unfurl_links: false,
    unfurl_media: false,
  }, token);
}

console.log(`Sent ${chunks.length} private picker message${chunks.length === 1 ? '' : 's'} to ${reviewerId}`);
console.log(`Saved picker copy at ${path.relative(repoRoot, outPath)}`);

async function callSlackApi(method, payload, token) {
  const response = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json();
  if (!response.ok || !body.ok) {
    throw new Error(`Slack API ${method} failed: ${JSON.stringify(body)}`);
  }
  return body;
}

function parseArgs(args) {
  const options = {
    dryRun: false,
    post: false,
    reviewerId: '',
    out: '',
    draftPath: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--post') {
      options.post = true;
    } else if (arg === '--reviewer-id') {
      options.reviewerId = next;
      index += 1;
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
  console.log(`Generate or send the private Slack picker message for weekly highlights.

Usage:
  node scripts/generate-slack-weekly-picker.mjs drafts/slack-weekly-highlights-YYYY-MM-DD.json
  node scripts/generate-slack-weekly-picker.mjs --dry-run drafts/slack-weekly-highlights-YYYY-MM-DD.json
  node scripts/generate-slack-weekly-picker.mjs --post --reviewer-id U123 drafts/slack-weekly-highlights-YYYY-MM-DD.json

Environment:
  SLACK_BOT_TOKEN    Bot User OAuth token with chat:write
  SLACK_REVIEWER_ID  Reviewer user ID for the private DM
`);
}
