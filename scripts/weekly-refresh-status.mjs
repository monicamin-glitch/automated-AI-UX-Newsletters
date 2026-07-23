import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  defaultDigestUrl,
  parseCards,
  parseLatestWeek,
  readHtml,
  repoRoot,
} from './slack-weekly-lib.mjs';

export const statusDir = path.join(repoRoot, 'automation-status');
export const statusPath = path.join(statusDir, 'weekly-refresh-status.json');
export const defaultBpagesId = '4de2388206';
export const defaultBpagesUrl = defaultDigestUrl;
export const defaultBpagesBin = '/Users/ymin/.bpages/bin/bpages';
export { repoRoot };

export function latestDigestSnapshot() {
  const html = readHtml();
  const week = parseLatestWeek(html);
  const cards = parseCards(week.html, { fullHtml: html, weekId: week.id });
  const range = latestHeroRange(week.html);
  return {
    html,
    week,
    range,
    internalCount: cards.internal.length,
    externalCount: cards.external.length,
    cardCount: cards.internal.length + cards.external.length,
    slackLinkCount: cards.internal.filter(card => card.link).length,
    updateLabelCount: (week.html.match(/What is the update:/g) || []).length,
    whyLabelCount: (week.html.match(/Why it(?:'|’|&#x27;)s valuable for UXers:/g) || []).length,
  };
}

export function latestHeroRange(pageHtml) {
  const heading = firstMatch(pageHtml, /<div class="page-header">[\s\S]*?<h1>Week\s+\d+\s*-\s*([^<]+)<\/h1>/);
  return heading || firstMatch(pageHtml, /<p class="hero-subtitle">([^<]+)<\/p>/);
}

export function buildRefreshStatus(overrides = {}) {
  const snapshot = latestDigestSnapshot();
  return {
    version: 1,
    status: overrides.status || 'unknown',
    checkedAt: new Date().toISOString(),
    week: {
      id: snapshot.week.id,
      label: snapshot.week.label,
      date: snapshot.week.date,
      range: snapshot.range,
    },
    counts: {
      cards: snapshot.cardCount,
      internal: snapshot.internalCount,
      external: snapshot.externalCount,
      slackLinks: snapshot.slackLinkCount,
      updateLabels: snapshot.updateLabelCount,
      whyLabels: snapshot.whyLabelCount,
    },
    contentFingerprint: digestFingerprint(snapshot),
    git: gitInfo(),
    bpages: {
      id: defaultBpagesId,
      url: defaultBpagesUrl,
      updated: false,
    },
    errors: [],
    ...overrides,
  };
}

export function readRefreshStatus() {
  if (!fs.existsSync(statusPath)) return null;
  return JSON.parse(fs.readFileSync(statusPath, 'utf8'));
}

export function writeRefreshStatus(status) {
  fs.mkdirSync(statusDir, { recursive: true });
  fs.writeFileSync(statusPath, `${JSON.stringify(status, null, 2)}\n`);
  return status;
}

export function assertRefreshReady(options = {}) {
  const status = readRefreshStatus();
  const snapshot = latestDigestSnapshot();
  const errors = [];

  if (!status) {
    errors.push(`Missing refresh status file: ${path.relative(repoRoot, statusPath)}`);
  } else {
    if (status.status !== 'published') {
      errors.push(`Refresh status is "${status.status}", expected "published".`);
    }
    if (status.week?.id !== snapshot.week.id) {
      errors.push(`Status week ${status.week?.id || '(missing)'} does not match latest website week ${snapshot.week.id}.`);
    }
    if (status.week?.range !== snapshot.range) {
      errors.push(`Status range "${status.week?.range || '(missing)'}" does not match latest website range "${snapshot.range}".`);
    }
    if (status.contentFingerprint && status.contentFingerprint !== digestFingerprint(snapshot)) {
      errors.push('Published refresh fingerprint does not match the latest local website content.');
    }
    if (options.requireBpages !== false && !status.bpages?.updated) {
      errors.push('B.Pages update is not marked as completed.');
    }
  }

  errors.push(...validateLatestSnapshot(snapshot));

  if (errors.length) {
    const error = new Error(`Weekly refresh is not ready:\n- ${errors.join('\n- ')}`);
    error.errors = errors;
    throw error;
  }

  return { status, snapshot };
}

export function validateLatestSnapshot(snapshot = latestDigestSnapshot()) {
  const errors = [];
  if (!snapshot.week.id || snapshot.week.id === 'latest') errors.push('Latest page is missing a concrete data-week id.');
  if (!snapshot.range) errors.push('Latest page is missing a hero date range.');
  if (snapshot.cardCount < 1) errors.push('Latest page has no cards.');
  if (snapshot.updateLabelCount !== snapshot.cardCount) {
    errors.push(`Latest page has ${snapshot.updateLabelCount} "What is the update" labels for ${snapshot.cardCount} cards.`);
  }
  if (snapshot.whyLabelCount !== snapshot.cardCount) {
    errors.push(`Latest page has ${snapshot.whyLabelCount} "Why it is valuable" labels for ${snapshot.cardCount} cards.`);
  }
  if (snapshot.internalCount && snapshot.slackLinkCount !== snapshot.internalCount) {
    errors.push(`Latest page has ${snapshot.internalCount} Slack cards but ${snapshot.slackLinkCount} Slack links.`);
  }
  return errors;
}

export function gitInfo() {
  return {
    head: optionalGit(['rev-parse', '--short', 'HEAD']),
    branch: optionalGit(['branch', '--show-current']),
  };
}

export function changedFiles() {
  const result = spawnSync('git', ['diff', '--name-only'], { cwd: repoRoot, encoding: 'utf8' });
  if (result.status !== 0) return [];
  return result.stdout.split('\n').map(line => line.trim()).filter(Boolean);
}

export function stagedFilesForLatest() {
  const snapshot = latestDigestSnapshot();
  const assetMatches = [
    ...snapshot.week.html.matchAll(/data-img="([^"]+)"/g),
    ...snapshot.week.html.matchAll(/<img[^>]+src="([^"]+)"/g),
  ]
    .map(match => match[1])
    .filter(value => value.startsWith('assets/'));
  return unique([
    'index.html',
    'update-notes.md',
    'sources.md',
    'digest.md',
    'design-spec.md',
    'media-strategy.md',
    'assets/media-manifest.json',
    ...assetMatches,
  ]).filter(relativePath => fs.existsSync(path.join(repoRoot, relativePath)));
}

export function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: options.stdio || 'pipe',
    env: { ...process.env, ...options.env },
  });
  if (result.status !== 0) {
    const details = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
    throw new Error(`${command} ${args.join(' ')} failed${details ? `:\n${details}` : ''}`);
  }
  return result.stdout || '';
}

export function gitCommitMessage() {
  const snapshot = latestDigestSnapshot();
  const rangeMatch = snapshot.range?.match(/^(.+?)\s+(?:to|[–-])\s+.+,\s*(\d{4})$/);
  const rangeStart = rangeMatch ? `${rangeMatch[1]}, ${rangeMatch[2]}` : snapshot.week.date || 'latest';
  return `Digest: Week of ${rangeStart}`;
}

function optionalGit(args) {
  try {
    return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function firstMatch(source, pattern) {
  return String(source || '').match(pattern)?.[1] || '';
}

function unique(values) {
  return [...new Set(values)];
}

function digestFingerprint(snapshot) {
  const payload = JSON.stringify({
    week: snapshot.week.id,
    range: snapshot.range,
    cardCount: snapshot.cardCount,
    internalCount: snapshot.internalCount,
    externalCount: snapshot.externalCount,
    slackLinkCount: snapshot.slackLinkCount,
    updateLabelCount: snapshot.updateLabelCount,
    whyLabelCount: snapshot.whyLabelCount,
    html: snapshot.week.html,
  });
  return crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(buildRefreshStatus({ status: 'diagnostic' }), null, 2));
}
