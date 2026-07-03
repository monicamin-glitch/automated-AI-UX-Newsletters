#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = path.join(repoRoot, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const allPages = parsePages(html);
const validateAll = process.argv.includes('--all');
const pages = validateAll ? allPages : allPages.filter(page => page.isLatest);
const issues = [];

for (const page of pages) {
  if (!page.week || !page.range) continue;
  const range = parseRange(page.range);
  if (!range) {
    issues.push(`${page.week}: could not parse hero date range "${page.range}"`);
    continue;
  }

  for (const card of page.cards) {
    validateCard(page.week, range, card);
  }
}

for (const card of [
  ...extractArray(html, 'backfilledSlackCards').map(card => ({ ...card, type: 'backfilledSlackCards' })),
  ...extractArray(html, 'backfilledPublicCards').map(card => ({ ...card, type: 'backfilledPublicCards' })),
]) {
  const page = pages.find(candidate => candidate.week === card.week);
  if (!page?.range) continue;
  const range = parseRange(page.range);
  if (!range) continue;
  validateCard(card.week, range, {
    title: card.title || '(untitled backfilled card)',
    date: card.date || '',
    type: card.type,
  });
}

if (issues.length) {
  console.error('Weekly date-bucket validation failed:');
  issues.forEach(issue => console.error(`- ${issue}`));
  process.exit(1);
}

console.log(`Weekly date-bucket validation passed for ${pages.length} weekly page${pages.length === 1 ? '' : 's'}.`);

function validateCard(week, range, card) {
  const date = parseCardDate(card.date, range);
  if (!date) {
    issues.push(`${week}: could not parse ${card.type} date "${card.date}" for "${card.title}"`);
    return;
  }
  if (date < range.start || date > range.end) {
    issues.push(`${week}: ${card.type} "${card.title}" is dated ${card.date}, outside ${formatDate(range.start)} - ${formatDate(range.end)}`);
  }
}

function parsePages(source) {
  const pageStarts = [...source.matchAll(/<div class="page[^"]*"[^>]*>/g)]
    .map(match => ({ index: match.index, tag: match[0] }));
  return pageStarts
    .map((start, index) => {
      const end = pageStarts[index + 1]?.index ?? source.indexOf('</main>', start.index);
      const block = source.slice(start.index, end === -1 ? source.length : end);
      const pageStart = start.tag.match(/data-week="([^"]+)"/);
      if (!pageStart) return null;
      const range = firstMatch(block, /<p class="hero-subtitle">([^<]+)<\/p>/);
      return {
        week: pageStart[1],
        isLatest: /id="page-latest"/.test(start.tag),
        range,
        cards: parseStaticCards(block),
      };
    })
    .filter(Boolean);
}

function parseStaticCards(block) {
  const cards = [];
  const slackPattern = /<div class="article-card article-card--slack"([\s\S]*?)<\/div><\/div><\/div>/g;
  let match;
  while ((match = slackPattern.exec(block))) {
    const card = match[0];
    cards.push({
      type: 'Slack card',
      title: attr(card, 'data-slack-title') || text(card, /<h3 class="article-card-title">([\s\S]*?)<\/h3>/),
      date: attr(card, 'data-slack-date') || metaDate(card),
    });
  }

  const publicPattern = /<a class="article-card"([\s\S]*?)<\/a>/g;
  while ((match = publicPattern.exec(block))) {
    const card = match[0];
    cards.push({
      type: 'public card',
      title: text(card, /<h3 class="article-card-title">([\s\S]*?)<\/h3>/),
      date: metaDate(card),
    });
  }
  return cards;
}

function parseRange(value) {
  const match = String(value || '').match(/([A-Z][a-z]{2})\s+(\d{1,2})\s+[–-]\s+([A-Z][a-z]{2})?\s*(\d{1,2}),\s*(\d{4})/);
  if (!match) return null;
  const [, startMonth, startDay, explicitEndMonth, endDay, year] = match;
  const endMonth = explicitEndMonth || startMonth;
  const start = makeDate(year, startMonth, startDay);
  const end = makeDate(year, endMonth, endDay);
  if (!start || !end) return null;
  return { start, end };
}

function parseCardDate(value, range) {
  const match = String(value || '').match(/^([A-Z][a-z]{2})\s+(\d{1,2})$/);
  if (!match) return null;
  const year = range.start.getUTCFullYear();
  const date = makeDate(year, match[1], match[2]);
  if (!date) return null;
  if (date < range.start && range.end.getUTCFullYear() > year) {
    return makeDate(year + 1, match[1], match[2]);
  }
  return date;
}

function makeDate(year, month, day) {
  const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
  if (monthIndex === -1) return null;
  return new Date(Date.UTC(Number(year), monthIndex, Number(day)));
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function metaDate(card) {
  const spans = [...card.matchAll(/<div class="article-card-meta">([\s\S]*?)<\/div>/g)]
    .flatMap(match => [...match[1].matchAll(/<span>([\s\S]*?)<\/span>/g)].map(span => decodeHtml(stripTags(span[1]))));
  return spans.at(-1) || '';
}

function attr(source, name) {
  return decodeHtml(firstMatch(source, new RegExp(`${name}="([^"]*)"`)));
}

function text(source, pattern) {
  return decodeHtml(stripTags(firstMatch(source, pattern)));
}

function firstMatch(source, pattern) {
  const match = String(source || '').match(pattern);
  return match ? match[1] : '';
}

function stripTags(value) {
  return String(value || '').replace(/<[^>]+>/g, '').trim();
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'");
}

function extractArray(source, variableName) {
  const match = source.match(new RegExp(`const\\s+${variableName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`));
  if (!match) return [];
  try {
    const value = vm.runInNewContext(match[1], Object.freeze({}), { timeout: 1000 });
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
