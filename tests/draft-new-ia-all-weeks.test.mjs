import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../draft-new-ia.html', import.meta.url), 'utf8');
const legacyHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const designSpec = readFileSync(new URL('../design-spec.md', import.meta.url), 'utf8');
const digest = readFileSync(new URL('../digest.md', import.meta.url), 'utf8');

const archiveWeeks = [
  { legacyWeek: 1, key: '2026-W19', start: '2026-05-04', end: '2026-05-10', range: 'May 4 to 10, 2026', slack: 0, external: 8 },
  { legacyWeek: 2, key: '2026-W20', start: '2026-05-11', end: '2026-05-17', range: 'May 11 to 17, 2026', slack: 4, external: 9 },
  { legacyWeek: 3, key: '2026-W21', start: '2026-05-18', end: '2026-05-24', range: 'May 18 to 24, 2026', slack: 0, external: 12 },
  { legacyWeek: 4, key: '2026-W22', start: '2026-05-25', end: '2026-05-31', range: 'May 25 to 31, 2026', slack: 0, external: 8 },
  { legacyWeek: 5, key: '2026-W23', start: '2026-06-01', end: '2026-06-07', range: 'June 1 to 7, 2026', slack: 4, external: 2 },
  { legacyWeek: 6, key: '2026-W24', start: '2026-06-08', end: '2026-06-14', range: 'June 8 to 14, 2026', slack: 6, external: 5 },
  { legacyWeek: 7, key: '2026-W25', start: '2026-06-15', end: '2026-06-21', range: 'June 15 to 21, 2026', slack: 5, external: 2 },
  { legacyWeek: 8, key: '2026-W26', start: '2026-06-22', end: '2026-06-28', range: 'June 22 to 28, 2026', slack: 12, external: 4 },
  { legacyWeek: 9, key: '2026-W27', start: '2026-06-29', end: '2026-07-05', range: 'June 29 to July 5, 2026', slack: 6, external: 5 },
  { key: '2026-W28', start: '2026-07-06', end: '2026-07-12', range: 'July 6 to 12, 2026', slack: 7, external: 8 }
];

function getArchiveTemplate(key) {
  return html.match(new RegExp(`<template id="week-report-${key}"[^>]*>([\\s\\S]*?)<\\/template>`))?.[1] ?? '';
}

function getLegacyWeek(week) {
  const start = legacyHtml.indexOf(`id="page-week${week}"`);
  const followingWeeks = Array.from({ length: 9 }, (_, index) => legacyHtml.indexOf(`id="page-week${index + 1}"`, start + 1))
    .filter(index => index >= 0);
  const end = Math.min(...followingWeeks, legacyHtml.indexOf('</main>', start));
  return legacyHtml.slice(start, end);
}

function getAttribute(markup, name) {
  return markup.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? '';
}

function getClassText(markup, className) {
  return markup.match(new RegExp(`class="${className}"[^>]*>([\\s\\S]*?)<\\/[^>]+>`))?.[1] ?? '';
}

test('defines the approved month-calendar archive contract', () => {
  assert.match(designSpec, /Monday through Sunday columns/);
  assert.match(designSpec, /each complete calendar row as one selectable report week/);
  assert.match(designSpec, /Weeks without reports remain visible for calendar context but are muted and disabled/);
  assert.match(designSpec, /previous or next month remain visible at reduced opacity/);
  assert.match(designSpec, /prominent `Week 29` label and the supporting date range `July 13 to 19, 2026`/);
  assert.doesNotMatch(designSpec, /Render all real ISO weeks for the selected year/);
});

test('preserves every stored report in availableArchiveWeeks during refresh', () => {
  assert.match(digest, /Every historical report remains in `availableArchiveWeeks` during refresh/);
  assert.match(digest, /Never replace `availableArchiveWeeks` with only the two newest weeks/);
});

test('keeps Popular Topics exclusive to Latest Week in the archive refresh contract', () => {
  assert.match(digest, /Render only Internal Updates and External Updates in the selected archive report/);
  assert.doesNotMatch(digest, /Render Popular Topics, Internal Updates, and External Updates in the selected archive report/);
});

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
  assert.match(html, /id="week-report-2026-W28"/);
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

test('stores every historical report under its canonical ISO week metadata', () => {
  const expectedWeeks = Array.from({ length: 11 }, (_, index) => `2026-W${String(index + 19).padStart(2, '0')}`);
  for (const key of expectedWeeks) assert.match(html, new RegExp(key));

  for (const week of archiveWeeks) {
    const templateTag = html.match(new RegExp(`<template id="week-report-${week.key}"[^>]*>`))?.[0] ?? '';
    assert.match(templateTag, new RegExp(`data-week-start="${week.start}"`));
    assert.match(templateTag, new RegExp(`data-week-end="${week.end}"`));
    assert.match(templateTag, new RegExp(`data-week-range="${week.range}"`));
  }
});

test('gives every archived report the two required update sections and no Popular Topics', () => {
  for (const { key } of archiveWeeks) {
    const archive = getArchiveTemplate(key);
    assert.match(archive, /class="section-title">Internal Updates<\/h2>/, `${key} needs Internal Updates`);
    assert.match(archive, /class="slack-cards">/, `${key} needs a Slack card container`);
    assert.match(archive, /class="section-title">External Updates<\/h2>/, `${key} needs External Updates`);
    assert.match(archive, /class="external-card-grid">/, `${key} needs an external card grid`);
    assert.doesNotMatch(archive, /Popular Topics|weekly-topic/, `${key} must remain topic-free`);
  }
});

test('preserves every legacy report record while moving it into refreshed card structures', () => {
  for (const week of archiveWeeks.filter(item => item.legacyWeek)) {
    const legacy = getLegacyWeek(week.legacyWeek);
    const archive = getArchiveTemplate(week.key);
    const externalCards = legacy.split('\n').filter(line => line.includes('<a class="article-card"'));
    const slackCards = legacy.split('\n').filter(line => line.includes('<div class="article-card article-card--slack"'));

    assert.equal(externalCards.length, week.external, `${week.key} source external count`);
    assert.equal(slackCards.length, week.slack, `${week.key} source Slack count`);
    assert.equal((archive.match(/<a class="masonry-card"/g) ?? []).length, week.external, `${week.key} migrated external count`);
    assert.equal((archive.match(/<a class="slack-card"/g) ?? []).length, week.slack, `${week.key} migrated Slack count`);

    for (const card of externalCards) {
      const preservedValues = [
        getAttribute(card, 'href'),
        getAttribute(card, 'data-img'),
        getClassText(card, 'article-card-title'),
        getClassText(card, 'article-card-desc'),
        ...Array.from(card.matchAll(/<div class="article-card-meta"><span>([\s\S]*?)<\/span><span>([\s\S]*?)<\/span>/g)).flatMap(match => match.slice(1))
      ].filter(Boolean);
      for (const value of preservedValues) assert.ok(archive.includes(value), `${week.key} lost external value: ${value}`);
    }

    for (const card of slackCards) {
      const preservedValues = [
        'data-slack-link',
        'data-slack-title',
        'data-slack-channel',
        'data-slack-date',
        'data-slack-author',
        'data-slack-quote',
        'data-slack-content'
      ].map(name => `${name}="${getAttribute(card, name)}"`);
      preservedValues.push(getClassText(card, 'article-card-desc'));
      for (const value of preservedValues) assert.ok(archive.includes(value), `${week.key} lost Slack value: ${value}`);
    }
  }
});

test('gives every archived card a safe original destination', () => {
  for (const week of archiveWeeks) {
    const archive = getArchiveTemplate(week.key);
    const cards = archive.match(/<a class="(?:slack-card|masonry-card)"[^>]*>/g) ?? [];
    assert.equal(cards.length, week.slack + week.external, `${week.key} card count`);
    for (const card of cards) {
      assert.match(card, /href="https:\/\/[^"]+"/);
      assert.match(card, /target="_blank"/);
      assert.match(card, /rel="noopener noreferrer"/);
    }
    assert.doesNotMatch(archive, /href="#"/);
  }
});

test('derives available archive weeks from stored templates plus Latest Week', () => {
  assert.match(html, /const latestArchiveWeekKey = '2026-W29';/);
  assert.match(html, /const availableArchiveWeeks = new Set\(\[[\s\S]*?latestArchiveWeekKey,[\s\S]*?document\.querySelectorAll\('template\[id\^="week-report-"\]'\)[\s\S]*?template\.id\.replace\('week-report-', ''\)[\s\S]*?\]\);/);
  assert.doesNotMatch(html, /new Set\(\['2026-W28', '2026-W29'\]\)/);
});

test('keeps popular topics exclusive to Latest Week', () => {
  assert.match(html, /id="page-latest"[\s\S]*?<section class="weekly-topic"/);
  assert.doesNotMatch(html, /\[weeklyTopic, internalHeader, filters, slackCards, externalHeader, externalGrid\]/);
  assert.match(html, /\[internalHeader, filters, slackCards, externalHeader, externalGrid\]/);
});

test('gives every Week 28 archive card a real safe destination', () => {
  const archive = getArchiveTemplate('2026-W28');
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
