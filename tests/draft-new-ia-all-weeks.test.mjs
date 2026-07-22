import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../draft-new-ia.html', import.meta.url), 'utf8');
const legacyHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const designSpec = readFileSync(new URL('../design-spec.md', import.meta.url), 'utf8');
const digest = readFileSync(new URL('../digest.md', import.meta.url), 'utf8');

const archiveWeeks = [
  { legacyWeek: 1, key: '2026-W19', start: '2026-05-04', end: '2026-05-10', range: 'May 4 to 10, 2026', slack: 2, external: 8 },
  { legacyWeek: 2, key: '2026-W20', start: '2026-05-11', end: '2026-05-17', range: 'May 11 to 17, 2026', slack: 6, external: 9 },
  { legacyWeek: 3, key: '2026-W21', start: '2026-05-18', end: '2026-05-24', range: 'May 18 to 24, 2026', slack: 1, external: 12 },
  { legacyWeek: 4, key: '2026-W22', start: '2026-05-25', end: '2026-05-31', range: 'May 25 to 31, 2026', slack: 4, external: 8 },
  { legacyWeek: 5, key: '2026-W23', start: '2026-06-01', end: '2026-06-07', range: 'June 1 to 7, 2026', slack: 6, external: 4 },
  { legacyWeek: 6, key: '2026-W24', start: '2026-06-08', end: '2026-06-14', range: 'June 8 to 14, 2026', slack: 7, external: 9 },
  { legacyWeek: 7, key: '2026-W25', start: '2026-06-15', end: '2026-06-21', range: 'June 15 to 21, 2026', slack: 6, external: 2 },
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

function createCalendarRuntime() {
  const elements = new Map();
  const document = {
    activeElement: null,
    createElement: tagName => new CalendarTestElement(tagName, document),
    getElementById: id => elements.get(id) ?? null,
    querySelectorAll(selector) {
      if (selector === 'template[id^="week-report-"]') return [];
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
  const calendarStart = script.indexOf('const availableArchiveYears = [2026];');
  const calendarEnd = script.indexOf('function syncArchiveWeekContent()');
  assert.notEqual(calendarStart, -1, 'calendar source start must exist');
  assert.notEqual(calendarEnd, -1, 'calendar source end must exist');

  const state = { syncCount: 0 };
  const calendarSource = script.slice(calendarStart, calendarEnd) + `
    function syncArchiveWeekContent() { harnessState.syncCount += 1; }
    globalThis.calendarApi = {
      addAvailable: key => availableArchiveWeeks.add(key),
      changeWeekPickerMonth,
      getDisplay: () => ({ year: weekPickerDisplayYear, month: weekPickerDisplayMonth }),
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
  const context = { document, harnessState: state, console, Date, Intl, Math, Set };
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
  assert.equal(`${bounds.maximum.year}-${bounds.maximum.month}`, '2027-0');

  runtime.api.toggleWeekPicker(true);
  assert.equal(runtime.element('week-picker-year').textContent, 2025);
  assert.equal(runtime.element('week-picker-month').textContent, 'December');
  assert.equal(runtime.element('week-picker-month-previous').disabled, true);
  assert.equal(runtime.element('week-picker-month-next').disabled, false);

  runtime.api.changeWeekPickerMonth(1);
  assert.equal(runtime.element('week-picker-year').textContent, 2026);
  assert.equal(runtime.element('week-picker-month').textContent, 'January');
  assert.equal(runtime.element('week-picker-month-previous').disabled, false);

  runtime.api.changeWeekPickerMonth(-1);
  assert.equal(runtime.element('week-picker-year').textContent, 2025);
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

test('migrates the complete effective legacy dataset with card-local fidelity', () => {
  const records = getEffectiveSourceRecords();
  assert.equal(records.length, 111);
  assert.equal(records.filter(record => record.type === 'slack').length, 50);
  assert.equal(records.filter(record => record.type === 'external').length, 61);

  const sourceDestinations = records.map(record => `${record.key}:${record.type}:${record.destination}`).sort();
  const targetDestinations = archiveWeeks.filter(week => week.legacyWeek).flatMap(week => {
    const archive = getArchiveTemplate(week.key);
    return [...archive.matchAll(/<a class="(slack-card|masonry-card)"[^>]*href="([^"]+)"/g)]
      .map(match => `${week.key}:${match[1] === 'slack-card' ? 'slack' : 'external'}:${match[2]}`);
  }).sort();
  assert.deepEqual(targetDestinations, sourceDestinations);

  for (const week of archiveWeeks.filter(item => item.legacyWeek)) {
    const weekRecords = records.filter(record => record.key === week.key);
    assert.equal(weekRecords.filter(record => record.type === 'slack').length, week.slack, `${week.key} effective Slack count`);
    assert.equal(weekRecords.filter(record => record.type === 'external').length, week.external, `${week.key} effective external count`);
  }

  for (const record of records) {
    const archive = getArchiveTemplate(record.key);
    const card = findDestinationCard(archive, record.type === 'slack' ? 'slack-card' : 'masonry-card', record.destination);
    if (record.type === 'slack') {
      assert.ok(card.includes(`data-slack-title="${record.title}"`), `${record.destination} title`);
      assert.ok(card.includes(`data-slack-channel="${record.channel}"`), `${record.destination} channel`);
      assert.ok(card.includes(`data-slack-date="${record.date}"`), `${record.destination} date`);
      assert.ok(card.includes(`data-slack-author="${record.author}"`), `${record.destination} author`);
      assert.ok(card.includes(`data-slack-quote="${record.quote}"`), `${record.destination} original message`);
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
  assert.doesNotMatch(html, /\.week-picker-grid \{ grid-template-columns: repeat\(6/);
});

test('opens archived Slack cards in a detail dialog with their original permalink', () => {
  assert.match(html, /<dialog id="slack-message-dialog"/);
  assert.match(html, /id="slack-message-dialog-action"/);
  assert.match(html, /event\.target\.closest\('#archive-week-content \.slack-card\[data-slack-link\]'\)/);
  assert.match(html, /dialogAction\.href = card\.dataset\.slackLink/);
  assert.match(html, /slackMessageDialog\.showModal\(\)/);
});

test('centers the archived Slack detail dialog despite the page margin reset', () => {
  assert.match(html, /#slack-message-dialog \{[^}]*margin: auto/);
});

test('keeps the archived Slack dialog in the active All Weeks page', () => {
  const allWeeksPage = html.match(/<div class="page" id="page-all">([\s\S]*?)<!-- PAGE: Resources Hub -->/)?.[1] ?? '';
  assert.match(allWeeksPage, /<dialog id="slack-message-dialog"/);
});
