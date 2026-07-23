#!/usr/bin/env node

import path from 'node:path';
import {
  buildRefreshStatus,
  defaultBpagesBin,
  defaultBpagesId,
  defaultBpagesUrl,
  gitCommitMessage,
  gitInfo,
  latestDigestSnapshot,
  repoRoot,
  runCommand,
  stagedFilesForLatest,
  validateLatestSnapshot,
  writeRefreshStatus,
} from './weekly-refresh-status.mjs';

const options = parseArgs(process.argv.slice(2));
const statusBase = buildRefreshStatus({ status: 'running', startedAt: new Date().toISOString() });
writeRefreshStatus(statusBase);

try {
  console.log('Preparing media manifest...');
  runCommand('node', ['scripts/prepare-media.mjs', '--html', 'index.html', '--write-manifest'], { stdio: 'inherit' });

  console.log('Validating latest week date bucket...');
  runCommand('node', ['scripts/validate-week-buckets.mjs'], { stdio: 'inherit' });

  const snapshot = latestDigestSnapshot();
  const snapshotErrors = validateLatestSnapshot(snapshot);
  if (snapshotErrors.length) {
    throw new Error(`Latest week structure failed:\n- ${snapshotErrors.join('\n- ')}`);
  }

  console.log('Checking whitespace/conflict markers...');
  runCommand('git', ['diff', '--check'], { stdio: 'inherit' });

  const finalStatus = buildRefreshStatus({
    status: 'validated',
    startedAt: statusBase.startedAt,
    validatedAt: new Date().toISOString(),
    bpages: {
      id: options.bpagesId,
      url: options.bpagesUrl,
      updated: false,
    },
  });
  writeRefreshStatus(finalStatus);

  if (options.commit || options.push) {
    const files = stagedFilesForLatest();
    console.log(`Staging ${files.length} refresh file(s)...`);
    runCommand('git', ['add', ...files], { stdio: 'inherit' });

    const hasStagedChanges = runCommand('git', ['diff', '--cached', '--name-only']).trim();
    if (hasStagedChanges) {
      const message = options.message || gitCommitMessage();
      console.log(`Committing: ${message}`);
      runCommand('git', ['commit', '-m', message], { stdio: 'inherit' });
    } else {
      console.log('No staged changes to commit.');
    }
  }

  if (options.push) {
    console.log('Pushing to origin...');
    runCommand('git', ['push'], { stdio: 'inherit' });
  }

  let bpagesUpdated = false;
  if (options.publishBpages) {
    console.log('Updating B.Pages...');
    runCommand(options.bpagesBin, [
      'update',
      options.bpagesId,
      '--content',
      path.join(repoRoot, 'index.html'),
    ], { stdio: 'inherit' });
    bpagesUpdated = true;
  }

  const publishedStatus = buildRefreshStatus({
    status: options.publishBpages ? 'published' : 'validated',
    startedAt: statusBase.startedAt,
    validatedAt: finalStatus.validatedAt,
    publishedAt: options.publishBpages ? new Date().toISOString() : '',
    git: gitInfo(),
    bpages: {
      id: options.bpagesId,
      url: options.bpagesUrl,
      updated: bpagesUpdated,
    },
  });
  writeRefreshStatus(publishedStatus);
  if (options.notify) await notifyReviewer(publishedStatus);
  console.log(`Weekly refresh ${publishedStatus.status}.`);
  console.log(`Status file: ${path.relative(repoRoot, path.join(repoRoot, 'automation-status/weekly-refresh-status.json'))}`);
} catch (error) {
  const failedStatus = buildRefreshStatus({
    status: 'failed',
    startedAt: statusBase.startedAt,
    failedAt: new Date().toISOString(),
    errors: [error.message],
    bpages: {
      id: options.bpagesId,
      url: options.bpagesUrl,
      updated: false,
    },
  });
  writeRefreshStatus(failedStatus);
  if (options.notify) await notifyReviewer(failedStatus);
  console.error(error.message);
  process.exit(1);
}

async function notifyReviewer(status) {
  const token = process.env.SLACK_BOT_TOKEN;
  const reviewerId = process.env.SLACK_REVIEWER_ID || 'U07UFBBSZ9D';
  if (!token || !reviewerId) {
    console.log('Skipped Slack status DM because SLACK_BOT_TOKEN or reviewer ID is missing.');
    return;
  }
  const ok = status.status === 'published';
  const text = ok
    ? [
      '*Weekly AI x UX website refresh completed*',
      `Week: ${status.week?.label} (${status.week?.range})`,
      `Cards: ${status.counts?.cards} (${status.counts?.internal} internal, ${status.counts?.external} external)`,
      `B.Pages: ${status.bpages?.url}`,
      '',
      'Picker automation can run now.',
    ].join('\n')
    : [
      '*Weekly AI x UX website refresh failed*',
      `Week: ${status.week?.label || '(unknown)'} (${status.week?.range || 'no range'})`,
      `Failed at: ${status.failedAt || status.checkedAt}`,
      '',
      ...(status.errors || []).map(error => `- ${error}`),
      '',
      'Picker automation should not run until the website refresh is repaired.',
    ].join('\n');

  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      channel: reviewerId,
      text,
      unfurl_links: false,
      unfurl_media: false,
    }),
  });
  const body = await response.json();
  if (!response.ok || !body.ok) {
    throw new Error(`Slack status DM failed: ${JSON.stringify(body)}`);
  }
}

function parseArgs(args) {
  const options = {
    commit: false,
    push: false,
    publishBpages: false,
    notify: false,
    message: '',
    bpagesBin: defaultBpagesBin,
    bpagesId: defaultBpagesId,
    bpagesUrl: defaultBpagesUrl,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === '--commit') {
      options.commit = true;
    } else if (arg === '--push') {
      options.push = true;
      options.commit = true;
    } else if (arg === '--publish-bpages') {
      options.publishBpages = true;
    } else if (arg === '--notify') {
      options.notify = true;
    } else if (arg === '--message') {
      options.message = next;
      index += 1;
    } else if (arg === '--bpages-bin') {
      options.bpagesBin = next;
      index += 1;
    } else if (arg === '--bpages-id') {
      options.bpagesId = next;
      index += 1;
    } else if (arg === '--bpages-url') {
      options.bpagesUrl = next;
      index += 1;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Finalize the weekly AI x UX website refresh.

Usage:
  node scripts/finalize-weekly-refresh.mjs
  node scripts/finalize-weekly-refresh.mjs --commit --push --publish-bpages --notify

This validates media, date buckets, labels, Slack links, writes automation-status/weekly-refresh-status.json,
and optionally commits, pushes, and updates B.Pages.
`);
}
