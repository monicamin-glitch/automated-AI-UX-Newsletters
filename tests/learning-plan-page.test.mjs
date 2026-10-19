import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { stagedFilesForLatest } from '../scripts/weekly-refresh-status.mjs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const page = html.match(/<!-- PAGE: Learning Plan -->[\s\S]*?<div class="page" id="page-learning">([\s\S]*?)<!-- PAGE: Resources Hub -->/)?.[1] ?? '';

const topics = [
  'Rebuilding booking.com guest experience pages with code-first',
  'PP Demand Page Prototype First Workflow',
  'How I use Obsidian + Claude Code to run my life (Part 1)',
  'How I use Obsidian + Claude Code to run my life (Part 2)',
  'Using Claude Code to Create Animations for YIT',
  'How AI Works: Understanding the Mechanisms Behind It',
  'Write a well-structured prompt',
  'Preserving Learning and Critical Thinking While Using Claude Code, Codex, and NotebookLM (Part 1)',
  'Preserving Learning and Critical Thinking While Using Claude Code, Codex, and NotebookLM (Part 2)',
  'Discussion: How to eliminate manual fixing of AI-generated Figma designs',
  'Turning a Rough Idea into Reality with AI Page Builder',
];

const expectedActionUrls = [
  'https://docs.google.com/presentation/d/11lCVzJIL4pS7lBx_8M7crzed9oMQ-7se3BIh3JmAYEI/edit?slide=id.p1#slide=id.p1',
  'https://drive.google.com/file/d/1jZ3QfEbW_1tAZQwEP0fcOyILzxFsuKc-/view',
  'https://drive.google.com/drive/folders/1VaNwxBUOhNfyCJ7U0c4249cU0o-LXqhJ',
  'https://docs.google.com/presentation/d/1kMiVRRVZslieJJZruMM0s4f35s5t6meCGRqQY9EiPfA/edit?usp=sharing',
  'https://www.youtube.com/watch?v=6MBq1paspVU',
  'https://www.youtube.com/watch?v=6MBq1paspVU',
  'https://drive.google.com/file/d/17awpWPaVAt9FRTKKRI_x1TWryk0Zf86e/view?usp=sharing',
  'https://drive.google.com/file/d/1J7uIh1-cy2QfKf-TEIRx-KJINfV_YRwM/view',
  'https://drive.google.com/file/d/1J7uIh1-cy2QfKf-TEIRx-KJINfV_YRwM/view',
  'https://drive.google.com/file/d/1NmLID0vCYnoV3naLds5idkKAp-VOpGEw/view?t=1.482',
];

test('adds the fourth Learning Plan route and page', () => {
  const nav = html.match(/<div class="nav-tabs">([\s\S]*?)<\/div>/)?.[1] ?? '';
  const links = [...nav.matchAll(/<a class="nav-tab(?: active)?" data-page="([^"]+)" href="([^"]+)"([^>]*)>([^<]+)<\/a>/g)]
    .map(([, pageId, href, attributes, label]) => ({
      pageId,
      href,
      onclick: attributes.match(/onclick="([^"]+)"/)?.[1] ?? '',
      label,
    }));
  assert.deepEqual(links.map(({ pageId, href, label }) => ({ pageId, href, label })), [
    { pageId: 'latest', href: '?page=latest', label: 'Latest Week' },
    { pageId: 'all', href: '?page=all', label: 'All Weeks' },
    { pageId: 'resources', href: '?page=resources', label: 'Resources Hub' },
    { pageId: 'learning', href: '?page=learning', label: 'Learning Plan' },
  ]);
  links.forEach(({ pageId, onclick }) => {
    assert.match(onclick, new RegExp(`showPage\\('${pageId}', this\\)`));
    assert.match(onclick, /return false/);
  });
  assert.match(html, /id="page-learning"/);
  assert.match(html, /const validPageIds = \['latest', 'all', 'resources', 'learning'\]/);
  assert.match(html, /validPageIds\.includes\(initialPage\)/);
});

test('shows the latest month first and every supplied course once', () => {
  assert.ok(page.indexOf('October 2026') < page.indexOf('September 2026'));
  assert.ok(page.indexOf('September 2026') < page.indexOf('August 2026'));
  topics.forEach(topic => {
    assert.equal((page.match(new RegExp(topic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []).length, 1, topic);
  });
  assert.equal((page.match(/class="learning-row"/g) ?? []).length, 11);
});

test('moves Shiwen sharing to October 13 and adds the October 20 video session', () => {
  const october = page.match(/<section class="learning-month"[^>]*aria-labelledby="learning-october-2026"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(october, /datetime="2026-10-13"[\s\S]*Using Claude Code to Create Animations for YIT[\s\S]*Shared by Shiwen/);
  assert.match(october, /href="https:\/\/docs\.google\.com\/presentation\/d\/11lCVzJIL4pS7lBx_8M7crzed9oMQ-7se3BIh3JmAYEI\/edit\?slide=id\.p1#slide=id\.p1"/);
  assert.match(october, /datetime="2026-10-20"[\s\S]*How AI Works: Understanding the Mechanisms Behind It[\s\S]*Video Course/);
  assert.match(october, /href="https:\/\/drive\.google\.com\/file\/d\/1jZ3QfEbW_1tAZQwEP0fcOyILzxFsuKc-\/view"/);
  assert.doesNotMatch(page, /datetime="2026-09-29"[\s\S]{0,500}Using Claude Code to Create Animations for YIT/);
});

test('uses only verified links and omits unavailable actions', () => {
  const actionUrls = [...page.matchAll(/<a class="learning-action" href="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(actionUrls, expectedActionUrls);
  assert.equal((page.match(/class="learning-action"/g) ?? []).length, 10);
  assert.equal((page.match(/target="_blank" rel="noopener noreferrer"/g) ?? []).length, 10);
  assert.doesNotMatch(page, /learning-action-disabled|Link coming soon/);
  assert.doesNotMatch(page, /href=""|href="#"/);
});

test('uses official video type copy', () => {
  assert.equal((page.match(/>Video Course<\/span>/g) ?? []).length, 8);
  assert.doesNotMatch(page, />Watch video<\/span>/i);
});

test('uses split month labels and an agenda list without table headers', () => {
  assert.equal((page.match(/class="learning-month-heading"/g) ?? []).length, 3);
  assert.deepEqual([...page.matchAll(/<span class="learning-month-name">([^<]+)<\/span>\s*<span class="learning-month-year">([^<]+)<\/span>/g)]
    .map(([, month, year]) => ({ month, year })), [
    { month: 'October', year: '2026' },
    { month: 'September', year: '2026' },
    { month: 'August', year: '2026' },
  ]);
  assert.doesNotMatch(page, /class="learning-list-header"/);
});

test('keeps type and action as separate fields and defines mobile layout', () => {
  assert.equal((page.match(/class="learning-type /g) ?? []).length, 11);
  assert.match(html, /@media \(max-width: 1024px\) \{[\s\S]*?\.learning-month \{[^}]*grid-template-columns: 1fr/);
  assert.match(html, /@media \(max-width: 768px\) \{[\s\S]*?\.learning-month \{[^}]*grid-template-columns: 1fr/);
  const focusRule = html.match(/\.learning-action:focus-visible\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(focusRule, /outline:\s*3px solid var\(--primary-dark\)/);
  assert.match(focusRule, /outline-offset:\s*2px/);
  assert.doesNotMatch(focusRule, /rgba?\(/);
});

test('uses semantic monthly lists around every learning row', () => {
  const months = page.match(/<section class="learning-month"[\s\S]*?<\/section>/g) ?? [];
  assert.equal(months.length, 3);
  [2, 4, 5].forEach((expectedRows, index) => {
    const month = months[index];
    assert.match(month, /<ol class="learning-list-items">/);
    assert.equal((month.match(/<li class="learning-list-item">/g) ?? []).length, expectedRows);
    assert.equal((month.match(/<article class="learning-row">/g) ?? []).length, expectedRows);
  });
});

test('stages canonical Learning Plan files only when learning mode is requested', () => {
  const weeklyFiles = stagedFilesForLatest();
  const learningFiles = stagedFilesForLatest({ includeLearningPlan: true });
  const requiredLearningFiles = [
    'learning-plan.md',
    'design-spec.md',
    'tests/learning-plan-page.test.mjs',
    'tests/learning-plan-browser.test.mjs',
  ];
  requiredLearningFiles.forEach(file => {
    assert.equal(weeklyFiles.includes(file), false, `${file} must not be staged by a routine weekly refresh`);
    assert.equal(learningFiles.includes(file), true, `${file} must be staged in Learning Plan mode`);
  });
});
