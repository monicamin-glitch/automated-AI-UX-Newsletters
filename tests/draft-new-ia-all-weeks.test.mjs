import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../draft-new-ia.html', import.meta.url), 'utf8');

test('removes the meaningless newsletter sequence from Latest Week', () => {
  assert.doesNotMatch(html, /Week 10 — 14 updates/);
});

test('replaces the archive dropdown with an accessible year and ISO week picker', () => {
  assert.doesNotMatch(html, /<select class="week-picker-select"/);
  assert.match(html, /id="week-picker-trigger"/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /id="week-picker-popover"/);
  assert.match(html, /id="week-picker-year"/);
  assert.match(html, /id="week-picker-grid"/);
  assert.match(html, /Week 29 - July 13 to 19, 2026/);
});

test('builds a scalable 52 or 53 week grid with year navigation', () => {
  assert.match(html, /function getISOWeeksInYear\(year\)/);
  assert.match(html, /function getISOWeekRange\(year, week\)/);
  assert.match(html, /function renderWeekPicker\(year\)/);
  assert.match(html, /weeksInYear/);
  assert.match(html, /changeWeekPickerYear\(-1\)/);
  assert.match(html, /changeWeekPickerYear\(1\)/);
});

test('keeps week 28 archived and promotes real calendar week 29 to Latest Week', () => {
  assert.match(html, /'2026-W28'/);
  assert.match(html, /'2026-W29'/);
  assert.match(html, /selectedArchiveWeek = \{ year: 2026, week: 29 \}/);
  assert.match(html, /currentArchiveWeek = \{ year: 2026, week: 29 \}/);
  assert.match(html, /is-current/);
  assert.match(html, /aria-current/);
});

test('only enables navigation when another archive year has content', () => {
  assert.match(html, /availableArchiveYears = \[2026\]/);
  assert.match(html, /id="week-picker-year-previous"[^>]*disabled/);
  assert.match(html, /id="week-picker-year-next"[^>]*disabled/);
  assert.match(html, /\.week-picker-year-button:disabled/);
});

test('uses the same full calendar week name across both pages', () => {
  const fullWeekNames = html.match(/Week 29 - July 13 to 19, 2026/g) ?? [];
  assert.ok(fullWeekNames.length >= 3);
  assert.doesNotMatch(html, /Week of Jul 7, 2026/);
  assert.match(html, /function formatArchiveWeekName\(year, week\)/);
});

test('syncs internal and external updates for each selected archive week', () => {
  assert.match(html, /id="archive-week-content"/);
  assert.match(html, /id="week-report-2026-W28"/);
  assert.match(html, /function syncArchiveWeekContent\(\)/);
  assert.match(html, /selectedWeekKey/);
  assert.match(html, /source\.querySelector\('\.slack-cards'\)/);
  assert.match(html, /source\.querySelector\('\.external-card-grid'\)/);
  assert.match(html, /archiveContent\.replaceChildren/);
});

test('keeps popular topics exclusive to Latest Week', () => {
  assert.match(html, /id="page-latest"[\s\S]*?<section class="weekly-topic"/);
  assert.doesNotMatch(html, /\[weeklyTopic, internalHeader, filters, slackCards, externalHeader, externalGrid\]/);
  assert.match(html, /\[internalHeader, filters, slackCards, externalHeader, externalGrid\]/);
});

test('gives every Week 28 archive card a real safe destination', () => {
  const archive = html.match(/<template id="week-report-2026-W28">([\s\S]*?)<\/template>/)?.[1] ?? '';
  const cards = archive.match(/<a class="(?:slack-card|masonry-card)"/g) ?? [];
  const safeLinks = archive.match(/<a class="(?:slack-card|masonry-card)"[^>]*href="https:\/\/[^\"]+"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/g) ?? [];
  assert.equal(cards.length, 15);
  assert.equal(safeLinks.length, 15);
  assert.doesNotMatch(archive, /href="#"/);
});

test('keeps Slack filtering scoped to the active page', () => {
  assert.match(html, /const page = chipEl\.closest\('\.page'\)/);
  assert.match(html, /page\.querySelectorAll\('\.slack-card'\)/);
});

test('supports a direct All Weeks preview URL', () => {
  assert.match(html, /data-page="all"/);
  assert.match(html, /new URLSearchParams\(window\.location\.search\)\.get\('page'\)/);
  assert.match(html, /new URLSearchParams\(window\.location\.search\)\.get\('picker'\)/);
  assert.match(html, /function activateInitialPageFromQuery\(\)/);
});

test('uses the selected week as the All Weeks page starter without a Calendar Archive heading', () => {
  assert.doesNotMatch(html, /class="archive-picker-title"/);
  assert.match(html, /id="week-picker-trigger-week">Week 29<\/span>/);
  assert.match(html, /id="week-picker-trigger-range">July 13 to 19, 2026<\/span>/);
  assert.match(html, /\.week-picker-trigger-week \{[^}]*font-size: 20px;[^}]*font-weight: 800/);
  assert.match(html, /\.week-picker-trigger-range \{[^}]*font-size: 11px;[^}]*color: var\(--text-muted\)/);
  assert.match(html, /function formatArchiveWeekParts\(year, week\)/);
  assert.doesNotMatch(html, /class="archive-week-heading"/);
  assert.doesNotMatch(html, /id="archive-week-heading"/);
});

test('renders external update and UX value as separate summary paragraphs', () => {
  const latestPage = html.match(/id="page-latest"([\s\S]*?)<template id="week-report/)?.[1] ?? '';
  const updates = latestPage.match(/class="masonry-card-summary-update"/g) ?? [];
  const values = latestPage.match(/class="masonry-card-summary-value"/g) ?? [];
  assert.equal(updates.length, 7);
  assert.equal(values.length, 7);
  assert.match(html, /\.masonry-card-summary p \{ margin: 0; \}/);
  assert.match(html, /\.masonry-card-summary-value \{ margin-top: 8px !important; \}/);
});

test('shows the current week ring only while it is not selected', () => {
  assert.match(html, /\.week-picker-option\.is-current:not\(\.is-selected\) \{[^}]*background: #ffffff;[^}]*box-shadow: inset 0 0 0 1px var\(--primary\)/);
  assert.match(html, /\.week-picker-option\.is-current\.is-selected \{[^}]*box-shadow: none/);
});
