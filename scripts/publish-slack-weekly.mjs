#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  buildFallbackText,
  buildMarkdownPreview,
  buildSlackBlocks,
  repoRoot,
  selectedItems,
  validateApprovedDraft,
} from './slack-weekly-lib.mjs';

const options = parseArgs(process.argv.slice(2));
const draftPath = path.resolve(repoRoot, options.draftPath);
const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
const errors = options.force ? [] : validateApprovedDraft(draft);

if (errors.length) {
  console.error('Draft is not ready to publish:');
  errors.forEach(error => console.error(`- ${error}`));
  console.error('\nRun a dry run after editing:');
  console.error(`node scripts/publish-slack-weekly.mjs --dry-run ${path.relative(repoRoot, draftPath)}`);
  process.exit(1);
}

const payload = {
  channel: options.channelId || draft.publish?.channelId || process.env.SLACK_CHANNEL_ID || '',
  text: buildFallbackText(draft),
  blocks: buildSlackBlocks(draft),
  unfurl_links: false,
  unfurl_media: false,
};

if (options.dryRun) {
  console.log(buildDryRunReport(draft, payload));
  process.exit(0);
}

if (!payload.channel) {
  throw new Error('Missing Slack channel ID. Set SLACK_CHANNEL_ID, add publish.channelId in the draft, or pass --channel-id.');
}

const token = process.env.SLACK_BOT_TOKEN;
if (!token) {
  throw new Error('Missing SLACK_BOT_TOKEN. Store the bot token in the environment; do not commit it.');
}

if (options.scheduleAt) {
  const postAt = Math.floor(new Date(options.scheduleAt).getTime() / 1000);
  if (!Number.isFinite(postAt) || postAt <= Math.floor(Date.now() / 1000)) {
    throw new Error('--schedule-at must be a future ISO date/time, for example 2026-07-06T15:00:00+08:00');
  }
  payload.post_at = postAt;
  await callSlackApi('chat.scheduleMessage', payload, token);
  console.log(`Scheduled Slack weekly highlights for ${options.scheduleAt}`);
} else if (options.post) {
  await callSlackApi('chat.postMessage', payload, token);
  console.log('Posted Slack weekly highlights.');
} else {
  throw new Error('Choose --dry-run, --post, or --schedule-at <iso-date-time>.');
}

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

function buildDryRunReport(draft, payload) {
  const selectedInternal = selectedItems(draft.internal);
  const selectedExternal = selectedItems(draft.external);
  const lines = [
    'Slack weekly highlights dry run',
    `Draft: ${path.relative(repoRoot, draftPath)}`,
    `Approved: ${draft.approved}`,
    `Channel: ${payload.channel || '(missing)'}`,
    `Internal selected: ${selectedInternal.length}`,
    `External selected: ${selectedExternal.length}`,
    '',
    'Markdown preview',
    '---',
    buildMarkdownPreview(draft),
    '---',
    '',
    'Slack payload',
    JSON.stringify(payload, null, 2),
  ];
  return lines.join('\n');
}

function parseArgs(args) {
  const options = {
    dryRun: false,
    post: false,
    force: false,
    scheduleAt: '',
    channelId: '',
    draftPath: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--post') {
      options.post = true;
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--schedule-at') {
      options.scheduleAt = next;
      index += 1;
    } else if (arg === '--channel-id') {
      options.channelId = next;
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

  const publishModes = [options.dryRun, options.post, Boolean(options.scheduleAt)].filter(Boolean).length;
  if (publishModes !== 1) {
    throw new Error('Choose exactly one mode: --dry-run, --post, or --schedule-at <iso-date-time>.');
  }

  return options;
}

function printHelp() {
  console.log(`Publish an approved weekly Slack highlights draft.

Usage:
  node scripts/publish-slack-weekly.mjs --dry-run drafts/slack-weekly-highlights-YYYY-MM-DD.json
  node scripts/publish-slack-weekly.mjs --post drafts/slack-weekly-highlights-YYYY-MM-DD.json
  node scripts/publish-slack-weekly.mjs --schedule-at 2026-07-06T15:00:00+08:00 drafts/slack-weekly-highlights-YYYY-MM-DD.json

Environment:
  SLACK_BOT_TOKEN   Bot User OAuth token with chat:write
  SLACK_CHANNEL_ID  Target internal UX channel ID, unless supplied in the draft or --channel-id

Safety:
  Drafts must contain approved=true before posting or scheduling. Use --force only for local testing.
`);
}
