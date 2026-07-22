import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../draft-new-ia.html', import.meta.url), 'utf8');

function extractFunctionSource(name) {
  const functionMatch = html.match(new RegExp(`function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n    \\}`));
  assert.ok(functionMatch, `expected ${name} to be defined`);
  return functionMatch[0];
}

function extractWeeklyTopics() {
  const arrayMatch = html.match(/const weeklyTopics = (\[[\s\S]*?\]);/);
  assert.ok(arrayMatch, 'expected weeklyTopics array to be defined');
  const evaluatedTopics = vm.runInNewContext(`(${arrayMatch[1]})`);
  return JSON.parse(JSON.stringify(evaluatedTopics));
}

function extractLatestPage() {
  const pageMatch = html.match(/<div class="page active" id="page-latest">([\s\S]*?)<!-- Internal Updates -->/);
  assert.ok(pageMatch, 'expected Latest Week page to be defined');
  return pageMatch[0];
}

test('renders one illustrated weekly-topic experience with the approved copy', () => {
  assert.match(html, /What colleagues are talking about this week\?/);
  assert.match(html, /class="topic-card-stack"/);
  assert.match(html, /class="topic-card topic-card-current"/);
  assert.match(html, /class="topic-card topic-card-next"/);
  assert.match(html, /id="topic-next-button"/);
  assert.match(html, />Show next topic</);
  assert.match(html, /assets\/internal\/colleagues-topic-banner-v4\.png/);
});

test('removes the old comparison experiences from the page', () => {
  assert.doesNotMatch(html, /topic-top3/);
  assert.doesNotMatch(html, /topic-slot-machine/);
  assert.doesNotMatch(html, /topic-flip-card-experience/);
});

test('keeps only four Booking-specific weekly topics', () => {
  assert.deepEqual(extractWeeklyTopics(), [
    { word: 'Agent Fabric', mentions: '16', channels: 13 },
    { word: 'Skills MCP', mentions: '8', channels: 2 },
    { word: 'Design+AI Summit', mentions: '2', channels: 2 },
    { word: 'AI Illustration Generator', mentions: '1', channels: 1 }
  ]);
});

test('renders topic metadata as non-interactive text without a search arrow', () => {
  const latestPage = extractLatestPage();
  const metadataMatch = latestPage.match(/<div class="topic-card-meta">[\s\S]*?id="topic-card-mentions"[\s\S]*?id="topic-card-channels"[\s\S]*?<\/div>/);
  assert.ok(metadataMatch, 'expected non-interactive topic metadata');
  assert.match(metadataMatch[0], /<span id="topic-card-mentions">16 mentions<\/span>/);
  assert.match(metadataMatch[0], /<span aria-hidden="true">·<\/span>/);
  assert.match(metadataMatch[0], /<span id="topic-card-channels">13 channels<\/span>/);
  assert.doesNotMatch(latestPage, /id="topic-card-search"|topic-search-arrow|booking\.enterprise\.slack\.com\/search/);
  assert.doesNotMatch(html, /function buildSlackTopicSearchUrl\(topic\)/);
  assert.doesNotMatch(extractFunctionSource('renderTopicCard'), /topicSearch|buildSlackTopicSearchUrl/);
});

test('keeps topic initialization but removes loading cursor and icon rotation', () => {
  assert.match(html, /\n    renderTopicCard\(topicCardIndex\);\n    renderWeekPicker\(weekPickerDisplayYear\);/);
  assert.match(html, /\.topic-action:disabled \{[^}]*cursor: default;[^}]*opacity:/);
  assert.doesNotMatch(html, /\.topic-action:disabled \{[^}]*cursor: wait/);
  assert.doesNotMatch(html, /\.topic-action:disabled svg[^}]*transform: rotate/);
});

test('announces topic changes and supports reduced motion', () => {
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /prefers-reduced-motion: reduce/);
  assert.match(html, /\.weekly-topic \*, \.topic-action \{ animation: none !important; transition: none !important; \}/);
  const showNextWeeklyTopic = extractFunctionSource('showNextWeeklyTopic');
  assert.match(showNextWeeklyTopic, /window\.matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches/);
  assert.match(showNextWeeklyTopic, /if \(reduceMotion\) \{[\s\S]*?completeChange\(\);[\s\S]*?\} else \{/);
  assert.doesNotMatch(showNextWeeklyTopic.match(/if \(reduceMotion\) \{[\s\S]*?\} else \{/)[0], /setTimeout/);
});

test('runs the normal-motion topic transition before completing the change', () => {
  assert.match(html, /\.topic-card-stack\.is-changing \.topic-card-current/);
  assert.match(html, /\.topic-card-stack\.is-changing \.topic-card-next/);
  assert.match(html, /@keyframes topic-card-out/);
  assert.match(html, /@keyframes topic-card-forward/);
  const normalMotionBranch = extractFunctionSource('showNextWeeklyTopic').match(/else \{[\s\S]*?\n      \}/)[0];
  assert.match(normalMotionBranch, /stack\.classList\.add\('is-changing'\)/);
  assert.match(normalMotionBranch, /window\.setTimeout\(completeChange, 530\)/);
});

test('shows the weekly topic module on Latest Week only', () => {
  const latestPage = extractLatestPage();
  const allWeeksPage = html.match(/<div class="page" id="page-all">([\s\S]*?)<!-- PAGE: Resources Hub -->\s*<div class="page" id="page-resources">/);
  const resourcesPage = html.match(/<div class="page" id="page-resources">([\s\S]*?)\n    <\/div>\n\n  <\/div>\n\n  <script/);
  const syncArchiveWeekContent = extractFunctionSource('syncArchiveWeekContent');
  assert.ok(allWeeksPage, 'expected All Weeks page to be defined');
  assert.ok(resourcesPage, 'expected Resources page to be defined');
  assert.equal((latestPage.match(/<section class="weekly-topic"/g) ?? []).length, 1);
  assert.doesNotMatch(allWeeksPage[0], /<section class="weekly-topic"/);
  assert.doesNotMatch(resourcesPage[0], /<section class="weekly-topic"/);
  assert.match(syncArchiveWeekContent, /const internalHeader = sectionHeaders\.find\(header => header\.querySelector\('\.section-title'\)\?\.textContent\.trim\(\) === 'Internal Updates'\)/);
  assert.match(syncArchiveWeekContent, /\[internalHeader, filters, slackCards, externalHeader, externalGrid\]\.forEach/);
  assert.doesNotMatch(syncArchiveWeekContent, /weekly-topic/);
});

test('constrains the heading to the available width on narrow screens', () => {
  assert.match(html, /\.topic-title \{[^}]*width: min\(100%, 420px\)/);
});

test('uses compact flat cards and keeps the illustration secondary', () => {
  assert.match(html, /\.topic-card-stack \{[^}]*height: 108px/);
  assert.match(html, /\.topic-illustration-banner \{[^}]*object-fit: cover/);
  assert.match(html, /\.topic-card-current \{[^}]*background: #ffffff;[^}]*border: 1px solid #bfdbfe;[^}]*box-shadow: none/);
  assert.match(html, /\.topic-card-next \{[^}]*background: #dbeafe;[^}]*box-shadow: none/);
});

test('does not show ranking progress on the topic card', () => {
  assert.doesNotMatch(html, /topic-card-rank/);
  assert.doesNotMatch(html, /Top \$\{index \+ 1\} of/);
  assert.doesNotMatch(html, /Top \d+ of \d+/);
});

test('uses one continuous full-width office illustration', () => {
  assert.match(html, /class="topic-illustration-banner"/);
  assert.match(html, /\.topic-illustration-banner \{[^}]*position: absolute[^}]*inset: 0[^}]*width: 100%[^}]*height: 100%[^}]*object-fit: cover/);
  assert.doesNotMatch(html, /topic-illustration-side/);
  assert.doesNotMatch(html, /topic-illustration-left/);
  assert.doesNotMatch(html, /topic-illustration-right/);
});

test('shows the original illustration colors without a white mask', () => {
  assert.match(html, /\.weekly-topic \{[^}]*height: 268px[^}]*padding: 24px 24px 32px/);
  assert.doesNotMatch(html, /\.weekly-topic::after/);
  assert.doesNotMatch(html, /mask-image/);
  assert.doesNotMatch(html, /radial-gradient\(ellipse at center/);
});

test('removes the old symmetrical overlay accents', () => {
  assert.doesNotMatch(html, /topic-office-accent/);
  assert.doesNotMatch(html, /<svg[^>]*topic-office-accent/);
});

test('uses one typographic voice for page, section, and topic headings', () => {
  assert.match(html, /\.page-header h1 \{[^}]*font-family: inherit;[^}]*font-weight: 800;[^}]*letter-spacing: -0\.5px/);
  assert.match(html, /\.section-title \{[^}]*font-family: inherit;[^}]*font-weight: 800;[^}]*letter-spacing: -0\.5px/);
  assert.match(html, /\.topic-title \{[^}]*font-family: inherit;[^}]*font-weight: 800;[^}]*letter-spacing: -0\.5px/);
});

test('removes the internal updates subtitle', () => {
  assert.doesNotMatch(html, /Slack spotlights from across the org/);
  assert.doesNotMatch(html, /Slack's spotlight across the org/);
});

test('places the weekly topic directly below the week header and above internal updates', () => {
  const weekHeader = html.indexOf('<div class="page-header">');
  const weeklyTopic = html.indexOf('<section class="weekly-topic"');
  const internalUpdates = html.indexOf('<h2 class="section-title">Internal Updates</h2>');
  const filters = html.indexOf('<div class="filters">');

  assert.ok(weekHeader < weeklyTopic);
  assert.ok(weeklyTopic < internalUpdates);
  assert.ok(internalUpdates < filters);
});
