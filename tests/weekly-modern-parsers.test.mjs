import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  parseCards,
  parseLatestWeek,
  readHtml,
} from '../scripts/slack-weekly-lib.mjs';
import {
  latestDigestSnapshot,
  gitCommitMessage,
  latestHeroRange,
  stagedFilesForLatest,
  validateLatestSnapshot,
} from '../scripts/weekly-refresh-status.mjs';

test('parses the modern latest-week heading and card collections', () => {
  const html = readHtml();
  const week = parseLatestWeek(html);
  const cards = parseCards(week.html, { fullHtml: html, weekId: week.id });

  assert.deepEqual(
    { id: week.id, label: week.label, date: week.date },
    { id: '2026-W29', label: 'Week 29', date: 'July 13 to 19, 2026' },
  );
  assert.equal(cards.internal.length, 6);
  assert.equal(cards.external.length, 10);
  assert.equal(cards.internal[0].source, '#genai_eng');
  assert.equal(cards.internal[0].author, 'Ahmed Kamal');
  assert.equal(cards.internal[0].date, '2026-07-17');
  assert.match(cards.internal[0].link, /^https:\/\/booking\.enterprise\.slack\.com\/archives\//);
  assert.equal(cards.external[0].source, 'Figma');
  assert.equal(cards.external[0].date, 'July 16');
  assert.equal(cards.external[0].image, 'assets/week11/01-figma-code-backed-screens.png');
  assert.equal(
    cards.external[0].update,
    'screens brought into Figma from Make previews, Figma MCP, or the Chrome extension can now bind to existing variables and arrive with more auto layout.',
  );
  assert.match(cards.external[0].why, /^live interfaces can return to the canvas/);
  assert.doesNotMatch(cards.external[0].why, /^Why it/);
  assert.match(cards.internal[5].update, /AGENTS\.md, and verification patterns\.$/);
  assert.doesNotMatch(cards.internal[5].update, /^What is the update:/);
});

test('builds a valid weekly status snapshot from the modern page', () => {
  const snapshot = latestDigestSnapshot();
  assert.equal(latestHeroRange(snapshot.week.html), 'July 13 to 19, 2026');
  assert.equal(snapshot.cardCount, 16);
  assert.equal(snapshot.internalCount, 6);
  assert.equal(snapshot.externalCount, 10);
  assert.equal(snapshot.slackLinkCount, 6);
  assert.equal(snapshot.updateLabelCount, 16);
  assert.equal(snapshot.whyLabelCount, 16);
  assert.deepEqual(validateLatestSnapshot(snapshot), []);
});

test('validates the modern latest week date bucket', () => {
  const result = spawnSync(process.execPath, ['scripts/validate-week-buckets.mjs'], {
    cwd: new URL('..', import.meta.url),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /passed for 1 weekly page\./);
});

test('stages checked-in media referenced by modern latest-week cards', () => {
  const files = stagedFilesForLatest();
  assert.ok(files.includes('assets/week11/01-figma-code-backed-screens.png'));
  assert.ok(files.includes('assets/week11/02-miro-teams-agents-canvas.jpg'));
});

test('derives fallback week years and commit subjects from the displayed range', () => {
  const synthetic = readHtml()
    .replace("const latestArchiveWeekKey = '2026-W29';", '')
    .replace('Week 29 - July 13 to 19, 2026', 'Week 2 - January 4 to 10, 2027');
  assert.equal(parseLatestWeek(synthetic).id, '2027-W02');
  assert.equal(gitCommitMessage(), 'Digest: Week of July 13, 2026');
});

test('fails archive validation when a stored week loses its range metadata', () => {
  const directory = mkdtempSync(join(tmpdir(), 'newsletter-week-range-'));
  const fixture = join(directory, 'missing-range.html');
  const source = readHtml().replace(/\sdata-week-range="May 4 to 10, 2026"/, '');
  writeFileSync(fixture, source);
  try {
    const result = spawnSync(process.execPath, ['scripts/validate-week-buckets.mjs', '--all', '--html', fixture], {
      cwd: new URL('..', import.meta.url),
      encoding: 'utf8',
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /2026-W19: missing date range metadata/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
