#!/usr/bin/env node

import path from 'node:path';
import {
  assertRefreshReady,
  latestDigestSnapshot,
  readRefreshStatus,
  repoRoot,
  statusPath,
} from './weekly-refresh-status.mjs';

const options = parseArgs(process.argv.slice(2));

try {
  const { status, snapshot } = assertRefreshReady({ requireBpages: !options.skipBpages });
  console.log('Weekly refresh is ready for picker generation.');
  console.log(`Week: ${snapshot.week.label} (${snapshot.range})`);
  console.log(`Cards: ${snapshot.cardCount} (${snapshot.internalCount} internal, ${snapshot.externalCount} external)`);
  console.log(`Status: ${path.relative(repoRoot, statusPath)} updated at ${status.publishedAt || status.checkedAt}`);
} catch (error) {
  console.error(error.message);
  const status = readRefreshStatus();
  if (status) {
    console.error(`\nCurrent status file: ${path.relative(repoRoot, statusPath)}`);
    console.error(JSON.stringify(status, null, 2));
  } else {
    const snapshot = latestDigestSnapshot();
    console.error(`\nLatest local website week: ${snapshot.week.label} (${snapshot.range})`);
  }
  process.exit(1);
}

function parseArgs(args) {
  return {
    skipBpages: args.includes('--skip-bpages'),
  };
}
