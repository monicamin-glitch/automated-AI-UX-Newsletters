import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../draft-new-ia.html', import.meta.url), 'utf8');
const legacyHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const designSpec = readFileSync(new URL('../design-spec.md', import.meta.url), 'utf8');
const digest = readFileSync(new URL('../digest.md', import.meta.url), 'utf8');
const slackSpotlight = readFileSync(new URL('../slack-spotlight.md', import.meta.url), 'utf8');
const implementationPlan = readFileSync(new URL('../docs/superpowers/plans/2026-07-23-all-weeks-calendar-archive.md', import.meta.url), 'utf8');

const archiveWeeks = [
  { legacyWeek: 1, key: '2026-W19', start: '2026-05-04', end: '2026-05-10', range: 'May 4 to 10, 2026', slack: 1, external: 6 },
  { legacyWeek: 2, key: '2026-W20', start: '2026-05-11', end: '2026-05-17', range: 'May 11 to 17, 2026', slack: 3, external: 9 },
  { legacyWeek: 3, key: '2026-W21', start: '2026-05-18', end: '2026-05-24', range: 'May 18 to 24, 2026', slack: 4, external: 12 },
  { legacyWeek: 4, key: '2026-W22', start: '2026-05-25', end: '2026-05-31', range: 'May 25 to 31, 2026', slack: 3, external: 10 },
  { legacyWeek: 5, key: '2026-W23', start: '2026-06-01', end: '2026-06-07', range: 'June 1 to 7, 2026', slack: 6, external: 1 },
  { legacyWeek: 6, key: '2026-W24', start: '2026-06-08', end: '2026-06-14', range: 'June 8 to 14, 2026', slack: 8, external: 11 },
  { legacyWeek: 7, key: '2026-W25', start: '2026-06-15', end: '2026-06-21', range: 'June 15 to 21, 2026', slack: 6, external: 3 },
  { legacyWeek: 8, key: '2026-W26', start: '2026-06-22', end: '2026-06-28', range: 'June 22 to 28, 2026', slack: 9, external: 4 },
  { legacyWeek: 9, key: '2026-W27', start: '2026-06-29', end: '2026-07-05', range: 'June 29 to July 5, 2026', slack: 9, external: 5 },
  { key: '2026-W28', start: '2026-07-06', end: '2026-07-12', range: 'July 6 to 12, 2026', slack: 8, external: 8 }
];

const modernDestinationRecords = [
  ['slack', 'https://booking.enterprise.slack.com/archives/C0DBLGXMJ/p1783505667422479'],
  ['slack', 'https://booking.enterprise.slack.com/archives/C08F5QRGFDG/p1783412257586729?thread_ts=1783412257.586729&cid=C08F5QRGFDG'],
  ['slack', 'https://booking.enterprise.slack.com/archives/C09RJTFTMA5/p1783428393300619'],
  ['slack', 'https://booking.enterprise.slack.com/archives/C0B4CV2EVL6/p1783692599105679'],
  ['slack', 'https://booking.enterprise.slack.com/archives/C09GMG8AL1L/p1783691170547189'],
  ['slack', 'https://booking.enterprise.slack.com/archives/C0DBLGXMJ/p1783582593795409'],
  ['slack', 'https://booking.enterprise.slack.com/archives/C09RJTFTMA5/p1783428393300619'],
  ['external', 'https://www.figma.com/blog/how-decagon-uses-ai-for-design-system-saturation/'],
  ['external', 'https://www.nngroup.com/articles/design-system-maturity/'],
  ['external', 'https://www.nngroup.com/articles/dimensions-of-ai-chatbots/'],
  ['external', 'https://bolt.new/blog/build-custom-software-small-business-ai'],
  ['external', 'https://www.lennysnewsletter.com/p/how-tech-workers-are-feeling-in-2026'],
  ['external', 'https://claude.com/blog/cowork-web-mobile/'],
  ['external', 'https://openai.com/index/chatgpt-for-your-most-ambitious-work/'],
  ['external', 'https://www.figma.com/blog/gpt-5-6-is-now-available-in-figma-make/'],
  ['slack', 'https://booking.enterprise.slack.com/archives/C08F5QRGFDG/p1784276960676419?thread_ts=1784276960.676419&cid=C08F5QRGFDG'],
  ['slack', 'https://booking.enterprise.slack.com/archives/C0ABNJ4NWG6/p1784106984960089'],
  ['slack', 'https://booking.enterprise.slack.com/archives/C0B4CV2EVL6/p1784292900691099?thread_ts=1784292900.691099&cid=C0B4CV2EVL6'],
  ['slack', 'https://booking.enterprise.slack.com/archives/C0DBLGXMJ/p1783940098536739?thread_ts=1783940098.536739&cid=C0DBLGXMJ'],
  ['slack', 'https://booking.enterprise.slack.com/archives/C0DBLGXMJ/p1783928849351589'],
  ['slack', 'https://booking.enterprise.slack.com/archives/C08F5QRGFDG/p1784100504738449?thread_ts=1784100504.738449&cid=C08F5QRGFDG'],
  ['external', 'https://www.figma.com/release-notes/'],
  ['external', 'https://bolt.new/blog/introducing-bolt-slides'],
  ['external', 'https://openai.com/products/release-notes/'],
  ['external', 'https://www.anthropic.com/news/claude-for-teachers'],
  ['external', 'https://www.figma.com/release-notes/'],
  ['external', 'https://openai.com/products/release-notes/'],
  ['external', 'https://openai.com/products/release-notes/']
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

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function getLegacyArray(name) {
  const declaration = `const ${name} = [`;
  const start = legacyHtml.indexOf(declaration);
  assert.notEqual(start, -1, `${name} declaration must exist`);
  const arrayStart = legacyHtml.indexOf('[', start);
  let depth = 0;
  let quote = '';
  let escaped = false;

  for (let index = arrayStart; index < legacyHtml.length; index += 1) {
    const character = legacyHtml[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = '';
      continue;
    }
    if (character === "'" || character === '"' || character === '`') {
      quote = character;
      continue;
    }
    if (character === '[') depth += 1;
    if (character === ']') {
      depth -= 1;
      if (depth === 0) return runInNewContext(`(${legacyHtml.slice(arrayStart, index + 1)})`);
    }
  }
  assert.fail(`Could not parse ${name}`);
}

function findDestinationCard(archive, className, destination) {
  const escapedDestination = destination.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = [...archive.matchAll(new RegExp(`<a class="${className}"[^>]*href="${escapedDestination}"[^>]*>[\\s\\S]*?<\\/a>`, 'g'))];
  assert.equal(matches.length, 1, `${destination} must map to exactly one ${className}`);
  return matches[0][0];
}

function getStaticSourceRecords() {
  return archiveWeeks.filter(week => week.legacyWeek).flatMap(week => {
    const legacy = getLegacyWeek(week.legacyWeek);
    const lines = legacy.split('\n');
    const external = lines.filter(line => line.includes('<a class="article-card"')).map(card => {
      const metadata = card.match(/<div class="article-card-meta"><span>([\s\S]*?)<\/span><span>([\s\S]*?)<\/span>/);
      assert.ok(metadata, `${week.key} external metadata must exist`);
      return {
        type: 'external',
        key: week.key,
        destination: getAttribute(card, 'href'),
        title: getClassText(card, 'article-card-title'),
        summary: getClassText(card, 'article-card-desc'),
        publisher: metadata[1],
        date: metadata[2],
        media: getAttribute(card, 'data-img')
      };
    });
    const slack = lines.filter(line => line.includes('<div class="article-card article-card--slack"')).map(card => ({
      type: 'slack',
      key: week.key,
      destination: getAttribute(card, 'data-slack-link'),
      title: getAttribute(card, 'data-slack-title'),
      summary: getClassText(card, 'article-card-desc'),
      channel: getAttribute(card, 'data-slack-channel'),
      date: getAttribute(card, 'data-slack-date'),
      author: getAttribute(card, 'data-slack-author'),
      quote: getAttribute(card, 'data-slack-quote'),
      content: getAttribute(card, 'data-slack-content')
    }));
    return [...slack, ...external];
  });
}

function getEffectiveSourceRecords() {
  const keysByLegacyWeek = new Map(archiveWeeks.filter(week => week.legacyWeek).map(week => [`week${week.legacyWeek}`, week.key]));
  const backfilledSlack = getLegacyArray('backfilledSlackCards').map(card => ({
    type: 'slack',
    key: keysByLegacyWeek.get(card.week),
    destination: escapeHtml(card.link),
    title: escapeHtml(card.title),
    summary: escapeHtml(card.desc),
    channel: escapeHtml(card.channel),
    date: escapeHtml(card.date),
    author: escapeHtml(card.author),
    quote: escapeHtml(card.quote),
    content: escapeHtml(card.content)
  }));
  const backfilledExternal = getLegacyArray('backfilledPublicCards').map(card => ({
    type: 'external',
    key: keysByLegacyWeek.get(card.week),
    destination: escapeHtml(card.link),
    title: escapeHtml(card.title),
    summary: escapeHtml(card.desc),
    publisher: escapeHtml(card.source),
    date: escapeHtml(card.date),
    media: ''
  }));
  return [...getStaticSourceRecords(), ...backfilledSlack, ...backfilledExternal];
}

const monthNumbers = new Map([
  ['Jan', 0], ['January', 0], ['Feb', 1], ['February', 1], ['Mar', 2], ['March', 2],
  ['Apr', 3], ['April', 3], ['May', 4], ['Jun', 5], ['June', 5], ['Jul', 6], ['July', 6],
  ['Aug', 7], ['August', 7], ['Sep', 8], ['Sept', 8], ['September', 8], ['Oct', 9],
  ['October', 9], ['Nov', 10], ['November', 10], ['Dec', 11], ['December', 11]
]);

function parseStored2026Date(value) {
  const normalized = String(value ?? '').trim();
  let match = normalized.match(/^(2026)[/-](\d{2})[/-](\d{2})$/);
  if (match) {
    const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
    return date.getUTCFullYear() === 2026
      && date.getUTCMonth() === Number(match[2]) - 1
      && date.getUTCDate() === Number(match[3]) ? date : null;
  }

  match = normalized.match(/^([A-Za-z]+)\s+(\d{1,2})(?:,\s*(2026))?$/);
  const month = match ? monthNumbers.get(match[1]) : undefined;
  if (!match || month === undefined) return null;
  const date = new Date(Date.UTC(2026, month, Number(match[2])));
  return date.getUTCMonth() === month && date.getUTCDate() === Number(match[2]) ? date : null;
}

function getISOKeyForDate(date) {
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const year = target.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil((((target - yearStart) / 86400000) + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

function stripMarkup(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function getStoredReportRecords() {
  const latestStart = html.indexOf('<div class="page active" id="page-latest">');
  const latestEnd = html.indexOf('<template id="week-report-2026-W19"');
  const reports = [
    ...archiveWeeks.map(({ key }) => ({ key, markup: getArchiveTemplate(key) })),
    { key: '2026-W29', markup: html.slice(latestStart, latestEnd) }
  ];

  return reports.flatMap(({ key, markup }) => [
    ...[...markup.matchAll(/<a class="slack-card"[^>]*>[\s\S]*?<\/a>/g)].map(match => {
      const card = match[0];
      const metadata = stripMarkup(card.match(/class="slack-card-meta">([\s\S]*?)<\/div>/)?.[1]);
      const explicitDate = getAttribute(card, 'data-slack-date')
        || getAttribute(card.match(/<time[^>]*>[\s\S]*?<\/time>/)?.[0] ?? '', 'datetime')
        || metadata.match(/,\s*((?:2026[/-]\d{2}[/-]\d{2})|(?:[A-Za-z]+\s+\d{1,2}(?:,\s*2026)?))/)?.[1]
        || '';
      return {
        key,
        type: 'slack',
        card,
        date: explicitDate,
        destination: decodeAttribute(getAttribute(card, 'href')),
        policy: getAttribute(card, 'data-date-policy')
      };
    }),
    ...[...markup.matchAll(/<a class="masonry-card"[^>]*>[\s\S]*?<\/a>/g)].map(match => {
      const card = match[0];
      const source = stripMarkup(card.match(/class="masonry-card-source">([\s\S]*?)<\/div>/)?.[1]);
      return {
        key,
        type: 'external',
        card,
        date: source.includes('·') ? source.split('·').at(-1).trim() : '',
        destination: decodeAttribute(getAttribute(card, 'href')),
        policy: getAttribute(card, 'data-date-policy')
      };
    })
  ]);
}

class CalendarTestElement {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = ownerDocument;
    this.attributes = new Map();
    this.children = [];
    this.className = '';
    this.dataset = {};
    this.disabled = false;
    this.hidden = false;
    this.listeners = new Map();
    this.tabIndex = -1;
    this.textContent = '';
    this.classList = {
      contains: token => this.className.split(/\s+/).filter(Boolean).includes(token)
    };
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  replaceChildren(...children) {
    this.children = children;
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  dispatchEvent(event) {
    event.target ??= this;
    event.defaultPrevented = false;
    event.preventDefault ??= () => { event.defaultPrevented = true; };
    for (const listener of this.listeners.get(event.type) ?? []) listener.call(this, event);
    return !event.defaultPrevented;
  }

  click() {
    this.dispatchEvent({ type: 'click' });
  }

  focus() {
    this.ownerDocument.activeElement = this;
  }
}

function createCalendarRuntime({ templateKeys = [], now = new Date('2026-07-23T12:00:00Z') } = {}) {
  const elements = new Map();
  const templates = templateKeys.map(key => ({ id: `week-report-${key}` }));
  const document = {
    activeElement: null,
    createElement: tagName => new CalendarTestElement(tagName, document),
    getElementById: id => elements.get(id) ?? null,
    querySelectorAll(selector) {
      if (selector === 'template[id^="week-report-"]') return templates;
      if (!selector.startsWith('#week-picker-grid ')) return [];
      const requiredClasses = selector.split(' ').at(-1).split('.').filter(Boolean);
      return elements.get('week-picker-grid').children.filter(element =>
        requiredClasses.every(className => element.classList.contains(className))
      );
    },
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] ?? null;
    }
  };

  for (const id of [
    'week-picker-grid',
    'week-picker-year',
    'week-picker-month',
    'week-picker-year-previous',
    'week-picker-year-next',
    'week-picker-month-previous',
    'week-picker-month-next',
    'week-picker-trigger',
    'week-picker-trigger-week',
    'week-picker-trigger-range',
    'week-picker-popover',
    'week-picker-detail'
  ]) {
    const element = new CalendarTestElement(id.includes('button') ? 'button' : 'div', document);
    element.id = id;
    elements.set(id, element);
  }
  elements.get('week-picker-popover').hidden = true;

  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';
  const calendarStart = Math.min(...[
    script.indexOf('const availableArchiveYears = [2026];'),
    script.indexOf("const latestArchiveWeekKey = '2026-W29';")
  ].filter(index => index >= 0));
  const calendarEnd = script.indexOf('function syncArchiveWeekContent()');
  assert.notEqual(calendarStart, -1, 'calendar source start must exist');
  assert.notEqual(calendarEnd, -1, 'calendar source end must exist');

  const state = { syncCount: 0 };
  const calendarSource = script.slice(calendarStart, calendarEnd) + `
    function syncArchiveWeekContent() { harnessState.syncCount += 1; }
    globalThis.calendarApi = {
      addAvailable: key => availableArchiveWeeks.add(key),
      changeWeekPickerYear,
      changeWeekPickerMonth,
      getDisplay: () => ({ year: weekPickerDisplayYear, month: weekPickerDisplayMonth }),
      getAvailableYears: () => [...availableArchiveYears],
      getCurrent: () => ({ ...currentArchiveWeek }),
      getCurrentArchiveWeek: typeof getCurrentArchiveWeek === 'function' ? getCurrentArchiveWeek : undefined,
      getISOWeekForDate,
      getISOWeekRange,
      getMonthWeekRows,
      getSelection: () => ({ ...selectedArchiveWeek }),
      getWeekPickerMonthBounds: typeof getWeekPickerMonthBounds === 'function' ? getWeekPickerMonthBounds : undefined,
      renderMonthWeekPicker,
      setCurrent: (year, week) => { currentArchiveWeek.year = year; currentArchiveWeek.week = week; },
      setSelected: (year, week) => { selectedArchiveWeek = { year, week }; },
      toggleWeekPicker
    };
  `;
  const context = {
    document,
    harnessState: state,
    console,
    Date,
    Intl,
    Math,
    Set,
    __NEWSLETTER_ARCHIVE_CLOCK__: () => new Date(now)
  };
  runInNewContext(calendarSource, context);
  return {
    api: context.calendarApi,
    document,
    element: id => elements.get(id),
    state
  };
}

function calendarRow(runtime, key) {
  return runtime.element('week-picker-grid').children.find(row => row.dataset.weekKey === key);
}

test('defines the approved month-calendar archive contract', () => {
  assert.match(designSpec, /Monday through Sunday columns/);
  assert.match(designSpec, /each complete calendar row as one selectable report week/);
  assert.match(designSpec, /Weeks without reports remain visible for calendar context but are muted and disabled/);
  assert.match(designSpec, /previous or next month remain visible at reduced opacity/);
  assert.match(designSpec, /prominent `Week 29` label and the supporting date range `July 13 to 19, 2026`/);
  assert.doesNotMatch(designSpec, /Render all real ISO weeks for the selected year/);
});

test('documents date-first ISO migration and a deterministic undated-record exception', () => {
  assert.match(implementationPlan, /legacy page is a source container, not authoritative ISO membership/i);
  assert.match(implementationPlan, /parseable 2026 date[\s\S]*real Monday–Sunday ISO/i);
  assert.match(implementationPlan, /without a safely parseable date[\s\S]*source container/i);
  assert.doesNotMatch(implementationPlan, /\| `week1` \| `2026-W19` \|/);
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

test('uses Apple System without loading or preferring Inter', () => {
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com|family=Inter/);
  assert.match(html, /body \{ font-family: -apple-system, BlinkMacSystemFont, sans-serif;/);
  assert.doesNotMatch(html, /font-family: 'Inter'/);
});

test('uses the 14px reading scale for newsletter and dialog copy', () => {
  assert.match(html, /\.slack-card-desc \{[^}]*font-size: 14px/);
  assert.match(html, /\.masonry-card-summary \{[^}]*font-size: 14px/);
  assert.match(html, /\.slack-dialog-copy \{[^}]*font-size: 14px/);
  assert.match(html, /\.slack-card-meta \{[^}]*font-size: 12px/);
  assert.match(html, /\.masonry-card-source \{[^}]*font-size: 12px/);
});

test('uses the approved 16px card-title scale', () => {
  assert.match(html, /\.slack-card-title \{[^}]*font-size: 16px;[^}]*font-weight: 700/);
  assert.match(html, /\.masonry-card-title \{[^}]*font-size: 16px;[^}]*font-weight: 700/);
});

test('left-aligns External actions with an 8px content gap', () => {
  assert.match(html, /\.masonry-card-summary \{[^}]*flex: 1/);
  assert.match(html, /\.masonry-card-action \{[^}]*margin-top: 8px;[^}]*padding: 0/);
  assert.doesNotMatch(html, /\.masonry-card-body \.masonry-card-action \{[^}]*margin-top: auto/);
});

test('stores verified full parent Slack messages for every Latest Week card', () => {
  const latestSection = html.match(/<!-- Internal Updates -->([\s\S]*?)<!-- External Updates -->/)?.[1] || '';
  const cards = [...latestSection.matchAll(/<a class="slack-card"[\s\S]*?<\/a>/g)].map(match => match[0]);
  assert.equal(cards.length, 6);
  for (const card of cards) {
    assert.match(card, /data-slack-quote="[^"]+"/);
    assert.match(card, /data-slack-original-verified="true"/);
  }
  assert.match(latestSection, /Introducing the Skills MCP Server/);
  assert.match(latestSection, /Choosing between Sol, Terra, and Luna/);
});

test('keeps the current-week Slack source complete for future refreshes', () => {
  const currentWeekStart = slackSpotlight.indexOf('## Current week output');
  const currentWeekEnd = slackSpotlight.indexOf('\ncoverage:', currentWeekStart);
  const currentWeek = slackSpotlight.slice(currentWeekStart, currentWeekEnd);
  assert.equal((currentWeek.match(/\n    posted_at:/g) || []).length, 6);
  assert.equal((currentWeek.match(/\n    original_message: \|-/g) || []).length, 6);
  assert.match(currentWeek, /Introducing the Skills MCP Server/);
  assert.match(currentWeek, /Choosing between Sol, Terra, and Luna/);
  assert.doesNotMatch(currentWeek, /[?&]pwd=/i);
  assert.doesNotMatch(html, /[?&](?:pwd|password|access_token|api_key)=/i);
});

test('replaces the archive dropdown with an accessible month-calendar week picker', () => {
  assert.doesNotMatch(html, /<select class="week-picker-select"/);
  assert.match(html, /id="week-picker-trigger"/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /id="week-picker-popover"/);
  assert.match(html, /id="week-picker-year"/);
  assert.match(html, /id="week-picker-month"/);
  assert.match(html, /class="[^"]*week-picker-weekdays[^"]*"[^>]*>[\s\S]*?>Mon<[\s\S]*?>Tue<[\s\S]*?>Wed<[\s\S]*?>Thu<[\s\S]*?>Fri<[\s\S]*?>Sat<[\s\S]*?>Sun</);
  assert.match(html, /id="week-picker-grid"[^>]*role="grid"/);
  assert.match(html, /Week 29 - July 13 to 19, 2026/);
});

test('builds UTC-safe Monday-Sunday calendar rows with ISO week metadata', () => {
  assert.match(html, /function getISOWeekRange\(year, week\)/);
  assert.match(html, /function getISOWeekForDate\(date\)/);
  assert.match(html, /function getMonthWeekRows\(year, month\)/);
  assert.match(html, /function renderMonthWeekPicker\(year, month\)/);
  assert.match(html, /week-picker-week-number/);
  assert.match(html, /week-picker-date/);
  assert.match(html, /is-outside-month/);
  assert.doesNotMatch(html, /button\.textContent = 'W' \+ String\(week\)\.padStart/);
});

test('runtime maps UTC dates and ISO week ranges across year boundaries', () => {
  const { api } = createCalendarRuntime();
  const weekOne = api.getISOWeekRange(2026, 1);
  assert.equal(weekOne.monday.toISOString().slice(0, 10), '2025-12-29');
  assert.equal(weekOne.sunday.toISOString().slice(0, 10), '2026-01-04');

  const decemberDate = api.getISOWeekForDate(new Date(Date.UTC(2025, 11, 31)));
  const januaryDate = api.getISOWeekForDate(new Date(Date.UTC(2026, 0, 1)));
  assert.equal(`${decemberDate.year}-W${decemberDate.week}`, '2026-W1');
  assert.equal(`${januaryDate.year}-W${januaryDate.week}`, '2026-W1');
});

test('runtime generates complete month rows with metadata, dates, and cross-month flags', () => {
  const runtime = createCalendarRuntime();
  runtime.api.addAvailable('2026-W01');
  runtime.api.setSelected(2026, 1);
  runtime.api.renderMonthWeekPicker(2025, 11);

  const rows = runtime.element('week-picker-grid').children;
  assert.equal(rows.length, 5);
  for (const row of rows) {
    assert.equal(row.children.length, 8, `${row.dataset.weekKey} needs one week number and seven dates`);
    assert.ok(row.children[0].classList.contains('week-picker-week-number'));
    assert.equal(row.children.slice(1).filter(cell => cell.classList.contains('week-picker-date')).length, 7);
  }

  const weekOne = calendarRow(runtime, '2026-W01');
  assert.equal(weekOne.children.slice(1).map(cell => cell.textContent).join(','), '29,30,31,1,2,3,4');
  assert.equal(weekOne.children.slice(1).filter(cell => cell.classList.contains('is-outside-month')).length, 4);
});

test('runtime keeps unavailable rows inert and activates available rows with Enter or Space', () => {
  const runtime = createCalendarRuntime();
  runtime.api.addAvailable('2025-W52');
  runtime.api.addAvailable('2026-W01');
  runtime.api.setSelected(2026, 1);
  runtime.api.renderMonthWeekPicker(2025, 11);

  const unavailable = calendarRow(runtime, '2025-W49');
  unavailable.click();
  unavailable.dispatchEvent({ type: 'keydown', key: 'Enter' });
  assert.equal(runtime.api.getSelection().year, 2026);
  assert.equal(runtime.api.getSelection().week, 1);
  assert.equal(runtime.state.syncCount, 0);
  assert.equal(unavailable.getAttribute('aria-disabled'), 'true');
  assert.equal(unavailable.tabIndex, -1);

  const available = calendarRow(runtime, '2025-W52');
  available.dispatchEvent({ type: 'keydown', key: 'Enter' });
  assert.equal(runtime.api.getSelection().year, 2025);
  assert.equal(runtime.api.getSelection().week, 52);
  assert.equal(runtime.state.syncCount, 1);

  runtime.api.setSelected(2026, 1);
  runtime.api.renderMonthWeekPicker(2025, 11);
  calendarRow(runtime, '2025-W52').dispatchEvent({ type: 'keydown', key: ' ' });
  assert.equal(runtime.api.getSelection().week, 52);
  assert.equal(runtime.state.syncCount, 2);
});

test('runtime gives one roving tab stop to the selected row and moves it with Arrow keys', () => {
  const runtime = createCalendarRuntime();
  runtime.api.addAvailable('2025-W52');
  runtime.api.addAvailable('2026-W01');
  runtime.api.setSelected(2026, 1);
  runtime.api.renderMonthWeekPicker(2025, 11);

  const week52 = calendarRow(runtime, '2025-W52');
  const weekOne = calendarRow(runtime, '2026-W01');
  assert.equal(runtime.element('week-picker-grid').children.filter(row => row.tabIndex === 0).length, 1);
  assert.equal(weekOne.tabIndex, 0);
  assert.equal(week52.tabIndex, -1);

  weekOne.focus();
  weekOne.dispatchEvent({ type: 'keydown', key: 'ArrowUp' });
  assert.equal(runtime.document.activeElement, week52);
  assert.equal(week52.tabIndex, 0);
  assert.equal(weekOne.tabIndex, -1);

  week52.dispatchEvent({ type: 'keydown', key: 'ArrowDown' });
  assert.equal(runtime.document.activeElement, weekOne);
  assert.equal(weekOne.tabIndex, 0);
});

test('runtime applies selected and current precedence to the same available row', () => {
  const runtime = createCalendarRuntime();
  runtime.api.addAvailable('2026-W01');
  runtime.api.setSelected(2026, 1);
  runtime.api.setCurrent(2026, 1);
  runtime.api.renderMonthWeekPicker(2025, 11);

  const row = calendarRow(runtime, '2026-W01');
  assert.ok(row.classList.contains('is-available'));
  assert.ok(row.classList.contains('is-selected'));
  assert.ok(row.classList.contains('is-current'));
  assert.equal(row.getAttribute('aria-selected'), 'true');
  assert.equal(row.getAttribute('aria-current'), 'date');
  assert.equal(row.getAttribute('aria-disabled'), 'false');
});

test('runtime includes ISO-year spillover months and never enables a dead month button', () => {
  const runtime = createCalendarRuntime();
  runtime.api.addAvailable('2026-W01');
  runtime.api.setSelected(2026, 1);
  assert.equal(typeof runtime.api.getWeekPickerMonthBounds, 'function');
  const bounds = runtime.api.getWeekPickerMonthBounds();
  assert.equal(`${bounds.minimum.year}-${bounds.minimum.month}`, '2025-11');
  assert.equal(`${bounds.maximum.year}-${bounds.maximum.month}`, '2026-11');

  runtime.api.toggleWeekPicker(true);
  assert.equal(runtime.element('week-picker-year').textContent, 2026);
  assert.equal(runtime.element('week-picker-month').textContent, 'December');
  assert.equal(runtime.element('week-picker-month-previous').disabled, true);
  assert.equal(runtime.element('week-picker-month-next').disabled, false);

  runtime.api.changeWeekPickerMonth(1);
  assert.equal(runtime.element('week-picker-year').textContent, 2026);
  assert.equal(runtime.element('week-picker-month').textContent, 'January');
  assert.equal(runtime.element('week-picker-month-previous').disabled, false);

  runtime.api.changeWeekPickerMonth(-1);
  assert.equal(runtime.element('week-picker-year').textContent, 2026);
  assert.equal(runtime.element('week-picker-month').textContent, 'December');
});

test('uses whole calendar rows as accessible selectable or disabled targets', () => {
  assert.match(html, /row\.setAttribute\('role', 'row'\)/);
  assert.match(html, /row\.setAttribute\('aria-selected', String\(isSelected\)\)/);
  assert.match(html, /row\.setAttribute\('aria-disabled', String\(!isAvailable\)\)/);
  assert.match(html, /setWeekPickerRowTabStop/);
  assert.match(html, /row\.addEventListener\('click', selectWeek\)/);
  assert.match(html, /event\.key === 'Enter' \|\| event\.key === ' '/);
  assert.match(html, /selectArchiveWeek\(isoWeek\.year, isoWeek\.week\)/);
});

test('navigates months within the only available archive year', () => {
  assert.match(html, /changeWeekPickerMonth\(-1\)/);
  assert.match(html, /changeWeekPickerMonth\(1\)/);
  assert.match(html, /changeWeekPickerYear\(-1\)/);
  assert.match(html, /changeWeekPickerYear\(1\)/);
  assert.match(html, /weekPickerDisplayMonth/);
  assert.match(html, /function getWeekPickerMonthBounds\(\)/);
  assert.match(html, /getISOWeekRange\(selectedArchiveWeek\.year, selectedArchiveWeek\.week\)\.monday/);
});

test('keeps week 29 as Latest while deriving the current ISO week from an injectable clock', () => {
  assert.match(html, /id="week-report-2026-W28"/);
  assert.match(html, /'2026-W29'/);
  assert.match(html, /selectedArchiveWeek = \{ year: 2026, week: 29 \}/);
  assert.match(html, /function getCurrentArchiveWeek\(now = new Date\(\)\)/);
  assert.match(html, /__NEWSLETTER_ARCHIVE_CLOCK__/);
  assert.doesNotMatch(html, /currentArchiveWeek = \{ year: 2026, week: 29 \}/);
  assert.match(html, /is-current/);
  assert.match(html, /aria-current/);

  const runtime = createCalendarRuntime({ now: new Date('2026-07-23T12:00:00Z') });
  assert.equal(typeof runtime.api.getCurrentArchiveWeek, 'function');
  const calculatedCurrent = runtime.api.getCurrentArchiveWeek(new Date('2026-07-23T12:00:00Z'));
  assert.equal(`${calculatedCurrent.year}-W${calculatedCurrent.week}`, '2026-W30');
  const initializedCurrent = runtime.api.getCurrent();
  assert.equal(`${initializedCurrent.year}-W${initializedCurrent.week}`, '2026-W30');
  runtime.api.renderMonthWeekPicker(2026, 6);
  const currentRow = calendarRow(runtime, '2026-W30');
  assert.ok(currentRow.classList.contains('is-current'));
  assert.ok(!currentRow.classList.contains('is-available'));
  assert.equal(currentRow.getAttribute('aria-disabled'), 'true');
});

test('derives archive years from available week keys and enables synthetic second-year navigation', () => {
  assert.match(html, /function getAvailableArchiveYears\(availableWeeks\)/);
  assert.match(html, /function getWeekPickerISOYear\(year, month\)/);
  assert.match(html, /const availableArchiveYears = getAvailableArchiveYears\(availableArchiveWeeks\)/);
  assert.doesNotMatch(html, /availableArchiveYears = \[2026\]/);
  assert.match(html, /id="week-picker-year-previous"[^>]*disabled/);
  assert.match(html, /id="week-picker-year-next"[^>]*disabled/);
  assert.match(html, /\.week-picker-year-button:disabled/);

  const singleYear = createCalendarRuntime();
  assert.equal(singleYear.api.getAvailableYears().join(','), '2026');
  singleYear.api.renderMonthWeekPicker(2026, 6);
  assert.equal(singleYear.element('week-picker-year-previous').disabled, true);
  assert.equal(singleYear.element('week-picker-year-next').disabled, true);

  const twoYears = createCalendarRuntime({ templateKeys: ['2027-W03'] });
  assert.equal(twoYears.api.getAvailableYears().join(','), '2026,2027');
  twoYears.api.renderMonthWeekPicker(2026, 6);
  assert.equal(twoYears.element('week-picker-year-next').disabled, false);
  twoYears.api.changeWeekPickerYear(1);
  assert.equal(twoYears.api.getDisplay().year, 2027);
  assert.equal(twoYears.element('week-picker-year-previous').disabled, false);
  assert.equal(twoYears.element('week-picker-year-next').disabled, true);
});

test('round-trips leading Week-1 December navigation across adjacent archive years', () => {
  const runtime = createCalendarRuntime({ templateKeys: ['2025-W52', '2027-W03'] });
  runtime.api.addAvailable('2026-W01');
  runtime.api.setSelected(2026, 1);

  runtime.api.renderMonthWeekPicker(2025, 11);
  assert.equal(runtime.element('week-picker-year').textContent, 2026);
  assert.equal(runtime.element('week-picker-year-previous').disabled, false);
  assert.equal(runtime.element('week-picker-year-next').disabled, false);

  runtime.api.changeWeekPickerYear(-1);
  assert.deepEqual({ ...runtime.api.getDisplay() }, { year: 2024, month: 11 });
  assert.equal(runtime.element('week-picker-year').textContent, 2025);
  runtime.api.changeWeekPickerYear(1);
  assert.deepEqual({ ...runtime.api.getDisplay() }, { year: 2025, month: 11 });
  assert.equal(runtime.element('week-picker-year').textContent, 2026);

  runtime.api.changeWeekPickerYear(1);
  assert.deepEqual({ ...runtime.api.getDisplay() }, { year: 2027, month: 0 });
  assert.equal(runtime.element('week-picker-year').textContent, 2027);
  assert.equal(runtime.element('week-picker-year-previous').disabled, false);
  assert.equal(runtime.element('week-picker-year-next').disabled, true);
  runtime.api.changeWeekPickerYear(-1);
  assert.deepEqual({ ...runtime.api.getDisplay() }, { year: 2025, month: 11 });
  assert.equal(runtime.element('week-picker-year').textContent, 2026);

  runtime.api.renderMonthWeekPicker(2026, 0);
  assert.equal(runtime.element('week-picker-year').textContent, 2026);
  assert.equal(runtime.element('week-picker-year-next').disabled, false);
  runtime.api.changeWeekPickerYear(1);
  assert.deepEqual({ ...runtime.api.getDisplay() }, { year: 2027, month: 0 });
  assert.equal(runtime.element('week-picker-year').textContent, 2027);
  assert.equal(runtime.element('week-picker-year-previous').disabled, false);
  assert.equal(runtime.element('week-picker-year-next').disabled, true);
  runtime.api.changeWeekPickerYear(-1);
  assert.deepEqual({ ...runtime.api.getDisplay() }, { year: 2026, month: 0 });
  assert.equal(runtime.element('week-picker-year').textContent, 2026);
  assert.equal(runtime.element('week-picker-year-previous').disabled, false);
  assert.equal(runtime.element('week-picker-year-next').disabled, false);
});

test('round-trips ordinary December navigation December-to-December', () => {
  const runtime = createCalendarRuntime({ templateKeys: ['2027-W03'] });

  runtime.api.renderMonthWeekPicker(2026, 11);
  assert.equal(runtime.element('week-picker-year').textContent, 2026);
  assert.equal(runtime.element('week-picker-year-next').disabled, false);
  runtime.api.changeWeekPickerYear(1);
  assert.deepEqual({ ...runtime.api.getDisplay() }, { year: 2027, month: 11 });
  assert.equal(runtime.element('week-picker-year').textContent, 2027);
  assert.equal(runtime.element('week-picker-year-previous').disabled, false);
  assert.equal(runtime.element('week-picker-year-next').disabled, true);
  runtime.api.changeWeekPickerYear(-1);
  assert.deepEqual({ ...runtime.api.getDisplay() }, { year: 2026, month: 11 });
  assert.equal(runtime.element('week-picker-year').textContent, 2026);
});

test('renders the maximum ISO year final week in December and never exposes trailing January', () => {
  const runtime = createCalendarRuntime({ templateKeys: ['2027-W52'] });
  const rows = runtime.api.getMonthWeekRows(2027, 11);
  const finalRow = rows.at(-1);
  assert.equal(finalRow.monday.toISOString().slice(0, 10), '2027-12-27');
  assert.equal(finalRow.dates.at(-1).toISOString().slice(0, 10), '2028-01-02');
  assert.equal(`${finalRow.isoWeek.year}-W${finalRow.isoWeek.week}`, '2027-W52');
  assert.equal([...finalRow.dates.slice(-2)].map(date => date.getUTCMonth()).join(','), '0,0');

  const bounds = runtime.api.getWeekPickerMonthBounds();
  assert.deepEqual({ ...bounds.maximum }, { year: 2027, month: 11 });
  runtime.api.renderMonthWeekPicker(2027, 11);
  assert.equal(runtime.element('week-picker-month-next').disabled, true);
  runtime.api.changeWeekPickerMonth(1);
  assert.deepEqual({ ...runtime.api.getDisplay() }, { year: 2027, month: 11 });
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

test('rebuckets the complete effective legacy dataset by real date with card-local fidelity', () => {
  const records = getEffectiveSourceRecords();
  assert.equal(records.length, 111);
  assert.equal(records.filter(record => record.type === 'slack').length, 50);
  assert.equal(records.filter(record => record.type === 'external').length, 61);

  const sourceDestinations = [
    ...records.map(record => [record.type, decodeAttribute(record.destination)]),
    ...modernDestinationRecords
  ].map(([type, destination]) => `${type}:${destination}`).sort();
  const targetDestinations = getStoredReportRecords()
    .map(record => `${record.type}:${record.destination}`)
    .sort();
  assert.equal(targetDestinations.length, 139);
  assert.deepEqual(targetDestinations, sourceDestinations);

  for (const record of records) {
    const parsedDate = parseStored2026Date(record.date);
    assert.ok(parsedDate, `${record.destination} must retain its parseable 2026 date`);
    const targetKey = getISOKeyForDate(parsedDate);
    const archive = getArchiveTemplate(targetKey);
    const card = findDestinationCard(archive, record.type === 'slack' ? 'slack-card' : 'masonry-card', record.destination);
    if (record.type === 'slack') {
      assert.ok(card.includes(`data-slack-title="${record.title}"`), `${record.destination} title`);
      assert.ok(card.includes(`data-slack-channel="${record.channel}"`), `${record.destination} channel`);
      assert.ok(card.includes(`data-slack-date="${record.date}"`), `${record.destination} date`);
      assert.ok(card.includes(`data-slack-author="${record.author}"`), `${record.destination} author`);
      assert.match(card, /data-slack-quote="[^"]+"/, `${record.destination} original message`);
      assert.ok(card.includes('data-slack-original-verified="true"'), `${record.destination} verified original message`);
      assert.ok(card.includes(`data-slack-content="${record.content}"`), `${record.destination} stored content`);
      assert.ok(card.includes(`<h3 class="slack-card-title">${record.title}</h3>`), `${record.destination} visible title`);
      assert.ok(card.includes(record.summary), `${record.destination} summary`);
    } else {
      assert.ok(card.includes(`<h3 class="masonry-card-title">${record.title}</h3>`), `${record.destination} title`);
      assert.ok(card.includes(record.summary), `${record.destination} summary`);
      assert.ok(card.includes(record.publisher), `${record.destination} publisher`);
      assert.ok(card.includes(record.date), `${record.destination} date`);
      if (record.media) assert.ok(card.includes(`src="${record.media}"`), `${record.destination} media`);
    }
  }

  for (const week of archiveWeeks) {
    const target = getStoredReportRecords().filter(record => record.key === week.key);
    assert.equal(target.filter(record => record.type === 'slack').length, week.slack, `${week.key} canonical Slack count`);
    assert.equal(target.filter(record => record.type === 'external').length, week.external, `${week.key} canonical external count`);
  }
});

test('places every explicitly dated record in its canonical template and marks undated fallbacks', () => {
  const records = getStoredReportRecords();
  assert.equal(records.length, 139);

  const dated = records.filter(record => parseStored2026Date(record.date));
  assert.equal(dated.length, 131);
  for (const record of dated) {
    const expectedKey = getISOKeyForDate(parseStored2026Date(record.date));
    assert.equal(record.key, expectedKey, `${record.destination} (${record.date}) belongs in ${expectedKey}`);
    assert.equal(record.policy, '', `${record.destination} must not use an exception for a parseable date`);
  }

  const undated = records.filter(record => !parseStored2026Date(record.date));
  assert.equal(undated.length, 8);
  for (const record of undated) {
    assert.equal(record.key, '2026-W28', `${record.destination} keeps its original W28 source container`);
    assert.equal(record.type, 'external');
    assert.equal(record.policy, 'source-container');
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

test('gives every archived external card the refreshed Read article affordance', () => {
  for (const { key, external } of archiveWeeks) {
    const archive = getArchiveTemplate(key);
    const cards = [...archive.matchAll(/<a class="masonry-card"[^>]*>[\s\S]*?<\/a>/g)].map(match => match[0]);
    assert.equal(cards.length, external, `${key} external card count`);
    for (const card of cards) {
      assert.equal((card.match(/class="masonry-card-action"/g) ?? []).length, 1, `${key} external action`);
      assert.match(card, /class="masonry-card-action">Read article/);
    }
  }
  const sharedActionRule = html.match(/\.masonry-card-action, \.view-in-slack \{([^}]*)\}/)?.[1] ?? '';
  const slackActionRule = html.match(/(?:^|\n)\s*\.view-in-slack \{([^}]*)\}/)?.[1] ?? '';
  assert.doesNotMatch(sharedActionRule, /padding:/);
  assert.match(slackActionRule, /padding: 3px 6px/);
  assert.match(sharedActionRule, /border-radius: 6px/);
  assert.match(sharedActionRule, /color: var\(--primary\)/);
  assert.match(sharedActionRule, /font-size: 12px/);
  assert.match(sharedActionRule, /font-weight: 600/);
  assert.match(sharedActionRule, /line-height: 1\.4/);
  assert.match(html, /\.masonry-card:hover \.masonry-card-action, \.view-in-slack:hover, \.view-in-slack:focus-visible \{[^}]*color: var\(--primary-dark\);[^}]*background: var\(--primary-tint\)/);
  assert.doesNotMatch(html, /\.masonry-card-body \.masonry-card-action \{[^}]*padding-top/);
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
  assert.equal(cards.length, 16);
  assert.equal(safeLinks.length, 16);
  assert.doesNotMatch(archive, /href="#"/);
});

test('keeps the rebucketed W28 Slack card in the generic Other filter', () => {
  const archive = getArchiveTemplate('2026-W28');
  assert.match(archive, /filterSlack\('all', this\)">All <span class="chip-count">8<\/span>/);
  assert.match(archive, /filterSlack\('other', this\)">Others<\/span>/);
  const slackCards = [...archive.matchAll(/<a class="slack-card"([^>]*)>/g)].map(match => match[1]);
  assert.equal(slackCards.length, 8);
  const genericCards = slackCards.filter(attributes => /data-cat="other"/.test(attributes));
  assert.equal(genericCards.length, 2);
  assert.match(genericCards[0], /p1783303790590519/);
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

test('shows the required available, current, selected, and unavailable row states', () => {
  assert.match(html, /\.week-picker-row\.is-available \{[^}]*background: #ffffff/);
  assert.match(html, /\.week-picker-row\.is-available:not\(\.is-selected\):hover \{[^}]*background: #f8fafc/);
  assert.doesNotMatch(html, /\.week-picker-row\.is-available:hover/);
  assert.match(html, /\.week-picker-row\.is-current:not\(\.is-selected\) \{[^}]*box-shadow: inset 0 0 0 1px #2563EB/);
  assert.match(html, /\.week-picker-row\.is-selected \{[^}]*color: #ffffff;[^}]*background: #2563EB/);
  assert.match(html, /\.week-picker-row\.is-current\.is-selected \{[^}]*box-shadow: none/);
  assert.match(html, /\.week-picker-row\.is-selected:focus-visible \{[^}]*outline: none;[^}]*box-shadow: inset 0 0 0 2px #ffffff/);
  assert.doesNotMatch(html, /\.week-picker-nav-button:focus-visible, \.week-picker-row:focus-visible/);
  assert.match(html, /\.week-picker-row\[aria-disabled="true"\] \{[^}]*cursor: not-allowed/);
});

test('keeps seven date columns and 44px whole-row targets at 390px', () => {
  assert.match(html, /body \{[^}]*overflow-x: hidden/);
  assert.match(html, /@media \(max-width: 768px\) \{[\s\S]*?\.nav-tabs \{[^}]*min-width: 0;[^}]*overflow-x: auto/);
  assert.match(html, /\.week-picker-calendar-columns \{[^}]*grid-template-columns: minmax\(24px, 0\.55fr\) repeat\(7, minmax\(0, 1fr\)\)/);
  assert.match(html, /\.week-picker-row \{[^}]*min-height: 44px/);
  assert.match(html, /@media \(max-width: 520px\) \{[\s\S]*?\.week-picker-calendar-columns \{[^}]*grid-template-columns: 24px repeat\(7, minmax\(0, 1fr\)\)/);
  assert.match(html, /@media \(max-width: 768px\) \{[\s\S]*?\.filters \{[^}]*flex-wrap: nowrap;[^}]*overflow-x: auto/);
  assert.match(html, /@media \(max-width: 768px\) \{[\s\S]*?\.filter-chip \{[^}]*flex: 0 0 auto;[^}]*min-height: 40px/);
  assert.doesNotMatch(html, /\.week-picker-grid \{ grid-template-columns: repeat\(6/);
});

test('uses one normalized Slack view model and shared hot-zone preparation on both pages', () => {
  assert.match(html, /<dialog id="slack-message-dialog"/);
  assert.match(html, /id="slack-message-dialog-action"/);
  assert.match(html, /function normalizeSlackCard\(card/);
  assert.match(html, /function prepareSlackCard\(card\)/);
  assert.match(html, /const viewModel = normalizeSlackCard\(card\)/);
  assert.match(html, /const preparedCard = card\.tagName === 'ARTICLE' \? card : document\.createElement\('article'\)/);
  assert.match(html, /preparedCard\.setAttribute\('aria-haspopup', 'dialog'\)/);
  assert.match(html, /document\.querySelectorAll\('#page-latest \.slack-card'\)\.forEach\(prepareSlackCard\)/);
  assert.match(html, /clone\.querySelectorAll\('\.slack-card'\)\.forEach\(prepareSlackCard\)/);
  assert.match(html, /dialogAction\.href = viewModel\.permalink/);
  assert.match(html, /slackMessageDialog\.showModal\(\)/);
});

test('centers the archived Slack detail dialog despite the page margin reset', () => {
  assert.match(html, /#slack-message-dialog \{[^}]*margin: auto/);
});

test('keeps the shared Slack dialog outside both switchable pages', () => {
  const latestPage = html.match(/<div class="page active" id="page-latest">([\s\S]*?)<template id="week-report-2026-W19"/)?.[1] ?? '';
  const allWeeksPage = html.match(/<div class="page" id="page-all">([\s\S]*?)<!-- PAGE: Resources Hub -->/)?.[1] ?? '';
  assert.doesNotMatch(latestPage, /<dialog id="slack-message-dialog"/);
  assert.doesNotMatch(allWeeksPage, /<dialog id="slack-message-dialog"/);
  assert.equal((html.match(/<dialog id="slack-message-dialog"/g) ?? []).length, 1);
  assert.match(html, /<\/nav>\s*<dialog id="slack-message-dialog"[\s\S]*?<\/dialog>\s*<div class="main">/);
});

function extractArchiveDialogFunction(name) {
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';
  const start = script.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} must be defined`);
  const bodyStart = script.indexOf('{', start);
  let depth = 0;
  for (let index = bodyStart; index < script.length; index += 1) {
    if (script[index] === '{') depth += 1;
    if (script[index] === '}') {
      depth -= 1;
      if (depth === 0) return script.slice(start, index + 1);
    }
  }
  assert.fail(`${name} must have a complete body`);
}

function decodeAttribute(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function getArchivedSlackCardRecords() {
  const reports = [...archiveWeeks.map(({ key }) => getArchiveTemplate(key))];
  const latestStart = html.indexOf('<div class="page active" id="page-latest">');
  const latestEnd = html.indexOf('<template id="week-report-2026-W19"');
  reports.push(html.slice(latestStart, latestEnd));

  return reports.flatMap(report => [...report.matchAll(/<a class="slack-card"[^>]*>([\s\S]*?)<\/a>/g)].map(match => {
    const card = match[0];
    const metadata = stripMarkup(card.match(/class="slack-card-meta">([\s\S]*?)<\/div>/)?.[1]);
    const visibleAuthor = stripMarkup(card.match(/class="slack-sender-name">([\s\S]*?)<\/span>/)?.[1]);
    const visibleDate = getAttribute(card.match(/<time[^>]*>[\s\S]*?<\/time>/)?.[0] ?? '', 'datetime')
      || metadata.match(/,\s*((?:2026[/-]\d{2}[/-]\d{2})|(?:[A-Za-z]+\s+\d{1,2}(?:,\s*2026)?))/)?.[1]
      || '';
    return {
      permalink: decodeAttribute(getAttribute(card, 'href')),
      original: decodeAttribute(getAttribute(card, 'data-slack-quote')),
      summary: card.match(/<div class="slack-card-desc">([\s\S]*?)<\/div><div class="slack-card-meta">/)?.[1] ?? '',
      channel: card.match(/class="slack-thread-channel">([\s\S]*?)<\/span>/)?.[1] ?? '',
      title: getClassText(card, 'slack-card-title'),
      author: getAttribute(card, 'data-slack-author') || visibleAuthor,
      date: getAttribute(card, 'data-slack-date') || visibleDate,
      replyCount: stripMarkup(card.match(/class="slack-meta-replies">([\s\S]*?)<\/span>/)?.[1]),
      dataSlackLink: decodeAttribute(getAttribute(card, 'data-slack-link')),
      originalVerified: getAttribute(card, 'data-slack-original-verified')
    };
  }));
}

test('normalizes stored-original and href-only Slack cards without inventing metadata', () => {
  const records = getArchivedSlackCardRecords();
  assert.equal(records.length, 63);
  assert.equal(records.filter(record => record.dataSlackLink).length, 50);
  assert.equal(records.filter(record => !record.original).length, 0);
  assert.equal(records.filter(record => record.originalVerified !== 'true').length, 0);
  const runtime = runInNewContext(`
    ${extractArchiveDialogFunction('getSafeSlackUrl')}
    ${extractArchiveDialogFunction('normalizeSlackCard')}
    globalThis.dialogHarness = { normalizeSlackCard };
    dialogHarness;
  `, { URL, document: { baseURI: 'https://newsletter.example/' } });

  for (const record of records) {
    const card = {
      dataset: {
        slackLink: record.dataSlackLink,
        slackQuote: record.original,
        slackChannel: record.dataSlackLink ? record.channel : '',
        slackAuthor: record.dataSlackLink ? record.author : '',
        slackDate: record.dataSlackLink ? record.date : '',
        slackReactions: ''
      },
      getAttribute: name => name === 'href' ? record.permalink : null,
      querySelector(selector) {
        if (selector === '.slack-card-desc') return { innerHTML: record.summary };
        if (selector === '.slack-thread-channel') return { textContent: record.channel };
        if (selector === '.slack-card-title') return { textContent: record.title };
        if (selector === '.slack-sender-name') return { textContent: record.author };
        if (selector === 'time') return record.date ? { textContent: record.date, getAttribute: () => record.date } : null;
        if (selector === '.slack-meta-replies') return record.replyCount ? { textContent: record.replyCount } : null;
        if (selector === '.slack-card-meta') return { textContent: `posted by ${record.author}, ${record.date}` };
        return null;
      },
      querySelectorAll() { return []; }
    };
    const viewModel = runtime.normalizeSlackCard(card, value => `sanitized:${value}`);
    assert.equal(viewModel.permalink, record.permalink, record.permalink);
    assert.equal(viewModel.author, record.author, record.permalink);
    assert.equal(viewModel.date, record.date, record.permalink);
    assert.equal(viewModel.replyCount, record.replyCount, record.permalink);
    assert.equal(viewModel.content, `sanitized:${record.original || record.summary}`, record.permalink);
    assert.equal(viewModel.context, record.original ? 'Original Slack message' : 'Archived summary — original message unavailable', record.permalink);
    assert.equal(viewModel.reactions.length, 0, record.permalink);
  }
});

class ArchiveTestElement {
  constructor(tagName, attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributeMap = new Map(Object.entries(attributes));
    this.dataset = {};
    this.children = [];
    this.parentElement = null;
    this.listeners = new Map();
    this.textContent = '';
    this.innerHTML = '';
  }

  get attributes() {
    return [...this.attributeMap].map(([name, value]) => ({ name, value }));
  }

  get firstChild() {
    return this.children[0] ?? null;
  }

  get className() {
    return this.getAttribute('class') ?? '';
  }

  set className(value) {
    this.setAttribute('class', value);
  }

  get classList() {
    return {
      add: (...names) => {
        const classes = new Set(this.className.split(/\s+/).filter(Boolean));
        names.forEach(name => classes.add(name));
        this.className = [...classes].join(' ');
      }
    };
  }

  get href() { return this.getAttribute('href') ?? ''; }
  set href(value) { this.setAttribute('href', value); }
  get target() { return this.getAttribute('target') ?? ''; }
  set target(value) { this.setAttribute('target', value); }
  get rel() { return this.getAttribute('rel') ?? ''; }
  set rel(value) { this.setAttribute('rel', value); }

  setAttribute(name, value) {
    this.attributeMap.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributeMap.get(name) ?? null;
  }

  appendChild(child) {
    if (child.parentElement) {
      const index = child.parentElement.children.indexOf(child);
      if (index >= 0) child.parentElement.children.splice(index, 1);
    }
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  replaceWith(replacement) {
    const index = this.parentElement?.children.indexOf(this) ?? -1;
    assert.notEqual(index, -1, 'test card must be attached before replacement');
    this.parentElement.children.splice(index, 1, replacement);
    replacement.parentElement = this.parentElement;
    this.parentElement = null;
  }

  querySelector(selector) {
    const match = element => selector.startsWith('.') && element.className.split(/\s+/).includes(selector.slice(1));
    for (const child of this.children) {
      if (match(child)) return child;
      const descendant = child.querySelector(selector);
      if (descendant) return descendant;
    }
    return null;
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  dispatch(type, event = {}) {
    this.listeners.get(type)?.({ currentTarget: this, ...event });
  }
}

function createArchiveSlackCard(record) {
  const container = new ArchiveTestElement('div');
  const card = new ArchiveTestElement('a', {
    class: 'slack-card',
    href: record.permalink,
    'data-cat': 'slack'
  });
  card.dataset = {
    slackLink: record.dataSlackLink,
    slackQuote: record.original,
    slackChannel: record.channel,
    slackAuthor: record.author,
    slackDate: record.date
  };
  const body = new ArchiveTestElement('div', { class: 'slack-card-body' });
  const summary = new ArchiveTestElement('div', { class: 'slack-card-desc' });
  summary.innerHTML = record.summary;
  const meta = new ArchiveTestElement('div', { class: 'slack-card-meta' });
  body.appendChild(summary);
  body.appendChild(meta);
  card.appendChild(body);
  container.appendChild(card);
  return { container, card };
}

test('places the direct Slack action after replies inside metadata', () => {
  assert.match(html, /function prepareSlackCard\(card\)/);
  assert.match(html, /const metadata = preparedCard\.querySelector\('\.slack-card-meta'\)/);
  assert.match(html, /metadata\.appendChild\(directLink\)/);
  assert.match(html, /directLink\.innerHTML = 'View in Slack <span aria-hidden="true">↗<\/span>'/);
  assert.doesNotMatch(html, /preparedCard\.appendChild\(directLink\)/);
});

test('documents conditional Slack metadata without inventing historical replies', () => {
  assert.match(designSpec, /When a verified reply count exists:[\s\S]*date · replies · `View in Slack ↗`/);
  assert.match(designSpec, /When reply metadata is unavailable:[\s\S]*date · `View in Slack ↗`/);
  assert.match(designSpec, /Do not infer or invent reply counts/);
  assert.match(html, /let replyMetadata = metadata\.querySelector\('\.slack-meta-replies'\)/);
  assert.match(html, /if \(viewModel\.replyCount\) \{[\s\S]*metadata\.appendChild\(replyMetadata\)/);
  assert.match(html, /else \{[\s\S]*replyMetadata\?\.remove\(\)/);
  assert.match(html, /\.view-in-slack::before \{[^}]*content: "·"/);
  assert.match(html, /\.slack-meta-replies::before \{[^}]*content: "·"/);
});

test('makes the article root the accessible dialog trigger', () => {
  assert.match(html, /preparedCard\.setAttribute\('role', 'button'\)/);
  assert.match(html, /preparedCard\.setAttribute\('tabindex', '0'\)/);
  assert.match(html, /preparedCard\.addEventListener\('click',[\s\S]*openSlackMessageDialog/);
  assert.match(html, /preparedCard\.addEventListener\('keydown',[\s\S]*event\.key === 'Enter'[\s\S]*event\.key === ' '/);
  assert.match(html, /directLink\.addEventListener\('click', preventSlackActionPropagation\)/);
});

test('sanitizes Slack message HTML with a structural allowlist and safe link protocols', () => {
  assert.match(html, /function sanitizeSlackHtml\(unsafeHtml\)/);
  assert.match(html, /new Set\(\['p', 'br', 'ul', 'ol', 'li', 'blockquote', 'strong', 'b', 'em', 'i', 'a', 'code', 'pre'\]\)/);
  assert.match(html, /function getSafeSlackUrl\(value\)/);
  assert.match(html, /protocol === 'https:' \|\| protocol === 'http:'/);
  assert.match(html, /document\.getElementById\('slack-message-dialog-copy'\)\.innerHTML = viewModel\.content/);
  assert.doesNotMatch(html, /\.innerHTML = details\.content/);
});

test('implements the mobile bottom-sheet, scroll-lock, metadata, and focus-restoration contract', () => {
  assert.match(html, /id="slack-message-dialog-reply-count"/);
  assert.match(html, /id="slack-message-dialog-reactions"/);
  assert.match(html, /@media \(max-width: 768px\) \{[\s\S]*?#slack-message-dialog \{[^}]*width: 100%;[^}]*inset: auto 0 0 0;[^}]*max-height: min\(88(?:d|s)vh, 720px\)/);
  assert.doesNotMatch(html, /\.archive-slack-card-detail/);
  assert.match(html, /@media \(max-width: 768px\) \{[\s\S]*?\.slack-thread-tile \{[^}]*border-radius: 999px/);
  assert.match(html, /body\.is-slack-dialog-open \{[^}]*position: fixed;[^}]*overflow: hidden/);
  assert.match(html, /function lockPageScroll\(\)/);
  assert.match(html, /function restorePageScroll\(\)/);
  assert.match(html, /slackMessageDialog\.addEventListener\('cancel'/);
  assert.match(html, /slackMessageDialog\.addEventListener\('close',[\s\S]*restorePageScroll\(\)[\s\S]*slackMessageDialogTrigger\?\.focus\(\)/);
});

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function waitFor(check, timeout = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    const value = await check();
    if (value) return value;
    await wait(50);
  }
  throw new Error(`Timed out after ${timeout}ms`);
}

async function openChromeRuntime({ width = 390, height = 844 } = {}) {
  const profileDirectory = mkdtempSync(join(tmpdir(), 'calendar-archive-chrome-'));
  const browserProcess = spawn(chromePath, [
    '--headless=new',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-gpu',
    '--disable-sync',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=0',
    `--user-data-dir=${profileDirectory}`,
    'about:blank'
  ], { stdio: 'ignore' });

  const portFile = join(profileDirectory, 'DevToolsActivePort');
  const port = await waitFor(() => {
    if (!existsSync(portFile)) return null;
    return Number(readFileSync(portFile, 'utf8').split('\n')[0]);
  });
  const targets = await waitFor(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await response.json();
      return list.some(target => target.type === 'page') ? list : null;
    } catch {
      return null;
    }
  });
  const target = targets.find(candidate => candidate.type === 'page');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let commandId = 0;
  const pending = new Map();
  const runtimeErrors = [];
  socket.addEventListener('message', event => {
    const message = JSON.parse(String(event.data));
    if (message.method === 'Runtime.exceptionThrown') {
      runtimeErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      runtimeErrors.push(message.params.args.map(argument => argument.value || argument.description || '').join(' '));
    }
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++commandId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (response.exceptionDetails) {
      throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
    }
    return response.result.value;
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: width,
    screenHeight: height
  });
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `globalThis.__NEWSLETTER_ARCHIVE_CLOCK__ = () => new Date('2026-07-23T12:00:00Z');`
  });
  await send('Page.navigate', { url: new URL('../draft-new-ia.html', import.meta.url).href });
  await waitFor(async () => await evaluate('document.readyState') === 'complete');

  return {
    evaluate,
    getRuntimeErrors: () => [...runtimeErrors],
    send,
    setViewport: (nextWidth, nextHeight) => send('Emulation.setDeviceMetricsOverride', {
      width: nextWidth,
      height: nextHeight,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: nextWidth,
      screenHeight: nextHeight
    }),
    async close() {
      socket.close();
      browserProcess.kill('SIGTERM');
      await Promise.race([
        new Promise(resolve => browserProcess.once('exit', resolve)),
        wait(2000)
      ]);
      rmSync(profileDirectory, { recursive: true, force: true });
    }
  };
}

test('browser runtime sanitizes malicious Slack content and enforces the 390px interaction geometry', {
  skip: process.env.RUN_BROWSER_TESTS !== '1' || !existsSync(chromePath)
}, async () => {
  const browser = await openChromeRuntime();
  try {
    const malicious = '<p onclick="steal()" style="color:red">Safe <strong data-x="1">bold</strong><script>alert(1)</script><iframe src="https://evil.test"></iframe><a href="javascript:alert(1)" onmouseover="steal()">bad</a><a href="https://example.com/path" style="display:none">good</a></p><blockquote><em>quote</em></blockquote><ul><li>one</li></ul><pre class="evil"><code onclick="steal()">const x = 1;</code></pre>';
    const sanitized = await browser.evaluate(`sanitizeSlackHtml(${JSON.stringify(malicious)})`);
    assert.match(sanitized, /<p>Safe <strong>bold<\/strong>/);
    assert.match(sanitized, /<a>bad<\/a>/);
    assert.match(sanitized, /href="https:\/\/example\.com\/path"/);
    assert.match(sanitized, /<blockquote><em>quote<\/em><\/blockquote>/);
    assert.match(sanitized, /<ul><li>one<\/li><\/ul>/);
    assert.match(sanitized, /<pre><code>const x = 1;<\/code><\/pre>/);
    assert.doesNotMatch(sanitized, /script|iframe|javascript:|onclick|onmouseover|style=|data-x|class=/i);

    const boundaryYears = await browser.evaluate(`(() => {
      availableArchiveWeeks.add('2025-W52');
      availableArchiveWeeks.add('2027-W03');
      availableArchiveYears.unshift(2025);
      availableArchiveYears.push(2027);
      selectedArchiveWeek = { year: 2026, week: 29 };
      renderMonthWeekPicker(2025, 11);
      const next = document.getElementById('week-picker-year-next');
      const previous = document.getElementById('week-picker-year-previous');
      const result = {
        decemberLabel: document.getElementById('week-picker-year').textContent,
        decemberNextEnabled: !next.disabled,
        decemberPreviousEnabled: !previous.disabled
      };
      next.click();
      result.forwardDisplay = [weekPickerDisplayYear, weekPickerDisplayMonth];
      result.forwardLabel = document.getElementById('week-picker-year').textContent;
      result.forwardPreviousEnabled = !previous.disabled;
      result.forwardNextDisabled = next.disabled;
      previous.click();
      result.returnDisplay = [weekPickerDisplayYear, weekPickerDisplayMonth];
      result.returnLabel = document.getElementById('week-picker-year').textContent;
      renderMonthWeekPicker(2026, 11);
      next.click();
      result.ordinaryDecemberForwardDisplay = [weekPickerDisplayYear, weekPickerDisplayMonth];
      result.ordinaryDecemberForwardLabel = document.getElementById('week-picker-year').textContent;
      previous.click();
      result.ordinaryDecemberReturnDisplay = [weekPickerDisplayYear, weekPickerDisplayMonth];
      result.ordinaryDecemberReturnLabel = document.getElementById('week-picker-year').textContent;
      renderMonthWeekPicker(2027, 11);
      const finalRow = [...document.querySelectorAll('#week-picker-grid .week-picker-row')].at(-1);
      const finalDates = [...finalRow.querySelectorAll('.week-picker-date')];
      const nextMonth = document.getElementById('week-picker-month-next');
      result.trailingJanuaryDates = finalDates.slice(-2).map(date => date.textContent);
      result.trailingJanuaryDimmed = finalDates.slice(-2).every(date => date.classList.contains('is-outside-month'));
      result.trailingMonthDisabled = nextMonth.disabled;
      nextMonth.click();
      result.trailingMonthDisplay = [weekPickerDisplayYear, weekPickerDisplayMonth];
      renderMonthWeekPicker(2026, 0);
      next.click();
      result.januaryForwardDisplay = [weekPickerDisplayYear, weekPickerDisplayMonth];
      result.januaryForwardLabel = document.getElementById('week-picker-year').textContent;
      result.januaryForwardPreviousEnabled = !previous.disabled;
      result.januaryForwardNextDisabled = next.disabled;
      previous.click();
      result.januaryReturnDisplay = [weekPickerDisplayYear, weekPickerDisplayMonth];
      result.januaryReturnLabel = document.getElementById('week-picker-year').textContent;
      result.januaryReturnPreviousEnabled = !previous.disabled;
      result.januaryReturnNextEnabled = !next.disabled;
      availableArchiveYears.shift();
      availableArchiveYears.pop();
      availableArchiveWeeks.delete('2025-W52');
      availableArchiveWeeks.delete('2027-W03');
      renderMonthWeekPicker(2026, 6);
      return result;
    })()`);
    assert.equal(boundaryYears.decemberLabel, '2026');
    assert.equal(boundaryYears.decemberNextEnabled, true);
    assert.equal(boundaryYears.decemberPreviousEnabled, true);
    assert.deepEqual(boundaryYears.forwardDisplay, [2027, 0]);
    assert.equal(boundaryYears.forwardLabel, '2027');
    assert.equal(boundaryYears.forwardPreviousEnabled, true);
    assert.equal(boundaryYears.forwardNextDisabled, true);
    assert.deepEqual(boundaryYears.returnDisplay, [2025, 11]);
    assert.equal(boundaryYears.returnLabel, '2026');
    assert.deepEqual(boundaryYears.ordinaryDecemberForwardDisplay, [2027, 11]);
    assert.equal(boundaryYears.ordinaryDecemberForwardLabel, '2027');
    assert.deepEqual(boundaryYears.ordinaryDecemberReturnDisplay, [2026, 11]);
    assert.equal(boundaryYears.ordinaryDecemberReturnLabel, '2026');
    assert.deepEqual(boundaryYears.trailingJanuaryDates, ['1', '2']);
    assert.equal(boundaryYears.trailingJanuaryDimmed, true);
    assert.equal(boundaryYears.trailingMonthDisabled, true);
    assert.deepEqual(boundaryYears.trailingMonthDisplay, [2027, 11]);
    assert.deepEqual(boundaryYears.januaryForwardDisplay, [2027, 0]);
    assert.equal(boundaryYears.januaryForwardLabel, '2027');
    assert.equal(boundaryYears.januaryForwardPreviousEnabled, true);
    assert.equal(boundaryYears.januaryForwardNextDisabled, true);
    assert.deepEqual(boundaryYears.januaryReturnDisplay, [2026, 0]);
    assert.equal(boundaryYears.januaryReturnLabel, '2026');
    assert.equal(boundaryYears.januaryReturnPreviousEnabled, true);
    assert.equal(boundaryYears.januaryReturnNextEnabled, true);

    const latest = await browser.evaluate(`(async () => {
      const cards = [...document.querySelectorAll('#page-latest .archive-slack-card')];
      const first = cards[0];
      const direct = first?.querySelector('.slack-card-meta .view-in-slack');
      const replies = first?.querySelector('.slack-meta-replies');
      window.scrollTo(0, 480);
      const beforeScroll = window.scrollY;
      const dialog = document.getElementById('slack-message-dialog');
      direct?.addEventListener('click', event => event.preventDefault(), { once: true });
      direct?.click();
      const directLeftDialogClosed = !dialog.open;
      first?.click();
      const rect = dialog.getBoundingClientRect();
      const tile = first?.querySelector('.slack-thread-tile');
      const result = {
        cardCount: cards.length,
        inlineActionAfterReplies: Boolean(replies && direct && replies.nextElementSibling === direct),
        directLeftDialogClosed,
        open: dialog.open,
        locked: document.body.classList.contains('is-slack-dialog-open'),
        bottomGap: Math.abs(window.innerHeight - rect.bottom),
        widthGap: Math.abs(window.innerWidth - rect.width),
        maxHeightSafe: rect.height <= window.innerHeight * 0.88 + 1,
        bodyScrolls: getComputedStyle(document.querySelector('.slack-dialog-body')).overflowY === 'auto',
        mobileReadingLayout: getComputedStyle(first).flexDirection === 'column',
        channelPill: getComputedStyle(tile).borderRadius === '999px' && tile.getBoundingClientRect().height < 50,
        noOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        truthfulContext: document.getElementById('slack-message-dialog-context').textContent,
        author: document.getElementById('slack-message-dialog-author').textContent,
        date: document.getElementById('slack-message-dialog-date').textContent,
        replies: document.getElementById('slack-message-dialog-reply-count').textContent,
        beforeScroll
      };
      document.getElementById('slack-message-dialog-close').click();
      await new Promise(resolve => requestAnimationFrame(resolve));
      result.closed = !dialog.open;
      result.unlocked = !document.body.classList.contains('is-slack-dialog-open');
      result.focusRestored = document.activeElement === first;
      result.scrollRestored = Math.abs(window.scrollY - beforeScroll) <= 1;
      return result;
    })()`);
    assert.equal(latest.cardCount, 6);
    assert.equal(latest.inlineActionAfterReplies, true);
    assert.equal(latest.directLeftDialogClosed, true);
    assert.equal(latest.open, true);
    assert.equal(latest.locked, true);
    assert.ok(latest.bottomGap <= 1);
    assert.ok(latest.widthGap <= 1);
    assert.equal(latest.maxHeightSafe, true);
    assert.equal(latest.bodyScrolls, true);
    assert.equal(latest.mobileReadingLayout, true);
    assert.equal(latest.channelPill, true);
    assert.equal(latest.noOverflow, true);
    assert.equal(latest.truthfulContext, 'Original Slack message');
    assert.ok(latest.author);
    assert.ok(latest.date);
    assert.ok(latest.replies);
    assert.equal(latest.closed, true);
    assert.equal(latest.unlocked, true);
    assert.equal(latest.focusRestored, true);
    assert.equal(latest.scrollRestored, true);

    const archive = await browser.evaluate(`(() => {
      document.querySelector('.nav-tab[data-page="all"]').click();
      const cards = [...document.querySelectorAll('#archive-week-content .archive-slack-card')];
      const first = cards[0];
      const direct = first?.querySelector('.slack-card-meta .view-in-slack');
      const replies = first?.querySelector('.slack-meta-replies');
      first?.click();
      const current = document.querySelector('[data-week-key="2026-W30"]');
      return {
        cardCount: cards.length,
        conditionalActionOrder: Boolean(direct && (!replies || replies.nextElementSibling === direct)),
        currentDisabled: current?.classList.contains('is-current') && current?.getAttribute('aria-disabled') === 'true',
        noOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth
      };
    })()`);
    assert.equal(archive.cardCount, 6);
    assert.equal(archive.conditionalActionOrder, true);
    assert.equal(archive.currentDisabled, true);
    assert.equal(archive.noOverflow, true);

    await browser.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await browser.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await wait(50);
    const escapeState = await browser.evaluate(`(() => {
      const detail = document.querySelector('#archive-week-content .archive-slack-card');
      return {
        closed: !document.getElementById('slack-message-dialog').open,
        unlocked: !document.body.classList.contains('is-slack-dialog-open'),
        focusRestored: document.activeElement === detail
      };
    })()`);
    assert.equal(escapeState.closed, true);
    assert.equal(escapeState.unlocked, true);
    assert.equal(escapeState.focusRestored, true);

    const keyboardActivation = await browser.evaluate(`(async () => {
      const card = document.querySelector('#archive-week-content .archive-slack-card');
      const dialog = document.getElementById('slack-message-dialog');
      const close = document.getElementById('slack-message-dialog-close');
      const activate = async key => {
        card.focus();
        const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
        const dispatchResult = card.dispatchEvent(event);
        const opened = dialog.open;
        close.click();
        await new Promise(resolve => requestAnimationFrame(resolve));
        return {
          opened,
          defaultPrevented: event.defaultPrevented && dispatchResult === false,
          focusRestored: document.activeElement === card
        };
      };
      return {
        enter: await activate('Enter'),
        space: await activate(' ')
      };
    })()`);
    assert.deepEqual(keyboardActivation.enter, {
      opened: true,
      defaultPrevented: true,
      focusRestored: true
    });
    assert.deepEqual(keyboardActivation.space, {
      opened: true,
      defaultPrevented: true,
      focusRestored: true
    });

    const conditionalMetadata = await browser.evaluate(`(() => {
      const current = document.querySelector('#page-latest .archive-slack-card');
      const currentReplies = current.querySelector('.slack-meta-replies');
      const currentAction = current.querySelector('.view-in-slack');
      selectArchiveWeek(2026, 19);
      const historical = document.querySelector('#archive-week-content .archive-slack-card');
      const historicalMeta = historical.querySelector('.slack-card-meta');
      const historicalReplies = historicalMeta.querySelector('.slack-meta-replies');
      const historicalAction = historicalMeta.querySelector('.view-in-slack');
      return {
        currentHasVerifiedReplies: Boolean(currentReplies?.textContent.trim()),
        currentOrder: currentReplies?.nextElementSibling === currentAction,
        historicalHasNoReplyMetadata: historicalReplies === null,
        historicalActionFollowsDate: historicalAction?.previousElementSibling === historicalMeta.children[1],
        historicalActionText: historicalAction?.textContent.trim()
      };
    })()`);
    assert.equal(conditionalMetadata.currentHasVerifiedReplies, true);
    assert.equal(conditionalMetadata.currentOrder, true);
    assert.equal(conditionalMetadata.historicalHasNoReplyMetadata, true);
    assert.equal(conditionalMetadata.historicalActionFollowsDate, true);
    assert.equal(conditionalMetadata.historicalActionText, 'View in Slack ↗');

    const mobileFiltersAndActions = await browser.evaluate(`(() => {
      selectArchiveWeek(2026, 28);
      const root = document.getElementById('archive-week-content');
      const filters = root.querySelector('.filters');
      const chips = [...filters.querySelectorAll('.filter-chip')];
      const other = chips.find(chip => chip.textContent.trim() === 'Others');
      const all = chips.find(chip => chip.textContent.trim().startsWith('All'));
      const cards = [...root.querySelectorAll('.archive-slack-card')];
      other.click();
      const visibleAfterOther = cards.filter(card => getComputedStyle(card).display !== 'none');
      const readAction = root.querySelector('.masonry-card-action');
      const slackAction = root.querySelector('.view-in-slack');
      const readStyle = getComputedStyle(readAction);
      const slackStyle = getComputedStyle(slackAction);
      const filterRect = filters.getBoundingClientRect();
      const result = {
        allCount: all.querySelector('.chip-count').textContent,
        genericCardCount: cards.filter(card => card.dataset.cat === 'other').length,
        visibleAfterOther: visibleAfterOther.length,
        onlyGenericVisible: visibleAfterOther.every(card => card.dataset.cat === 'other'),
        oneRow: getComputedStyle(filters).flexWrap === 'nowrap',
        scrollsHorizontally: getComputedStyle(filters).overflowX === 'auto' && filters.scrollWidth > filters.clientWidth,
        chipTouchHeight: Math.min(...chips.map(chip => chip.getBoundingClientRect().height)),
        filtersWithinViewport: filterRect.left >= 0 && filterRect.right <= window.innerWidth,
        actionParity: ['borderRadius', 'color', 'fontSize', 'fontWeight', 'lineHeight']
          .every(property => readStyle[property] === slackStyle[property]),
        externalZeroPadding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
          .every(property => readStyle[property] === '0px'),
        slackCompactPadding:
          slackStyle.paddingTop === '3px'
          && slackStyle.paddingRight === '6px'
          && slackStyle.paddingBottom === '3px'
          && slackStyle.paddingLeft === '6px',
        noOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth
      };
      all.click();
      return result;
    })()`);
    assert.equal(mobileFiltersAndActions.allCount, '8');
    assert.equal(mobileFiltersAndActions.genericCardCount, 2);
    assert.equal(mobileFiltersAndActions.visibleAfterOther, 2);
    assert.equal(mobileFiltersAndActions.onlyGenericVisible, true);
    assert.equal(mobileFiltersAndActions.oneRow, true);
    assert.equal(mobileFiltersAndActions.scrollsHorizontally, true);
    assert.ok(mobileFiltersAndActions.chipTouchHeight >= 40);
    assert.equal(mobileFiltersAndActions.filtersWithinViewport, true);
    assert.equal(mobileFiltersAndActions.actionParity, true);
    assert.equal(mobileFiltersAndActions.externalZeroPadding, true);
    assert.equal(mobileFiltersAndActions.slackCompactPadding, true);
    assert.equal(mobileFiltersAndActions.noOverflow, true);

    const reportChecks = await browser.evaluate(`(() => {
      const expected = [[19, 1, 6], [24, 8, 11], [28, 8, 8], [29, 6, 7]];
      return expected.map(([week, slack, external]) => {
        selectArchiveWeek(2026, week);
        const root = document.getElementById('archive-week-content');
        const externalCards = [...root.querySelectorAll('.masonry-card')];
        return {
          week,
          slack: root.querySelectorAll('.archive-slack-card').length,
          external: externalCards.length,
          expectedSlack: slack,
          expectedExternal: external,
          actions: externalCards.filter(card => card.querySelector('.masonry-card-action')).length,
          popularTopics: root.querySelectorAll('.weekly-topic').length,
          destinationsSafe: [...root.querySelectorAll('.archive-slack-card .slack-card-meta .view-in-slack, .masonry-card')]
            .every(link => link.href.startsWith('https://'))
        };
      });
    })()`);
    for (const report of reportChecks) {
      assert.equal(report.slack, report.expectedSlack, `W${report.week} Slack count`);
      assert.equal(report.external, report.expectedExternal, `W${report.week} external count`);
      assert.equal(report.actions, report.expectedExternal, `W${report.week} Read article actions`);
      assert.equal(report.popularTopics, 0, `W${report.week} archive topics`);
      assert.equal(report.destinationsSafe, true, `W${report.week} destinations`);
    }

    await browser.setViewport(1440, 1000);
    const desktop = await browser.evaluate(`(async () => {
      selectArchiveWeek(2026, 24);
      const detail = document.querySelector('#archive-week-content .archive-slack-card');
      detail.click();
      const dialog = document.getElementById('slack-message-dialog');
      const rect = dialog.getBoundingClientRect();
      const result = {
        centered: Math.abs((rect.left + rect.right) / 2 - window.innerWidth / 2) <= 1,
        widthSafe: rect.width <= 680,
        originalContext: document.getElementById('slack-message-dialog-context').textContent,
        noOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth
      };
      dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await new Promise(resolve => requestAnimationFrame(resolve));
      result.backdropClosed = !dialog.open;
      result.unlocked = !document.body.classList.contains('is-slack-dialog-open');
      result.focusRestored = document.activeElement === detail;
      return result;
    })()`);
    assert.equal(desktop.centered, true);
    assert.equal(desktop.widthSafe, true);
    assert.equal(desktop.originalContext, 'Original Slack message');
    assert.equal(desktop.noOverflow, true);
    assert.equal(desktop.backdropClosed, true);
    assert.equal(desktop.unlocked, true);
    assert.equal(desktop.focusRestored, true);
    assert.deepEqual(browser.getRuntimeErrors(), []);
  } finally {
    await browser.close();
  }
});
