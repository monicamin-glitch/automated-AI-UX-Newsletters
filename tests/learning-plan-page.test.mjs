import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const page = html.match(/<!-- PAGE: Learning Plan -->[\s\S]*?<div class="page" id="page-learning">([\s\S]*?)<!-- PAGE: Resources Hub -->/)?.[1] ?? '';

const topics = [
  'Rebuilding booking.com guest experience pages with code-first',
  'PP Demand Page Prototype First Workflow',
  'How I use Obsidian + Claude Code to run my life (Part 1)',
  'AI Product Sharing',
  'How I use Obsidian + Claude Code to run my life (Part 2)',
  'Using Claude Code to Create Animations for YIT',
  'Write a well-structured prompt',
  'Preserving Learning and Critical Thinking While Using Claude Code, Codex, and NotebookLM (Part 1)',
  'Preserving Learning and Critical Thinking While Using Claude Code, Codex, and NotebookLM (Part 2)',
  'Discussion: How to eliminate manual fixing of AI-generated Figma designs',
  'Turning a Rough Idea into Reality with AI Page Builder',
];

const verifiedUrls = [
  'https://drive.google.com/drive/folders/1VaNwxBUOhNfyCJ7U0c4249cU0o-LXqhJ',
  'https://drive.google.com/file/d/17awpWPaVAt9FRTKKRI_x1TWryk0Zf86e/view?usp=sharing',
  'https://drive.google.com/file/d/1J7uIh1-cy2QfKf-TEIRx-KJINfV_YRwM/view',
  'https://drive.google.com/file/d/1NmLID0vCYnoV3naLds5idkKAp-VOpGEw/view?t=1.482',
];

test('adds the fourth Learning Plan route and page', () => {
  assert.match(html, /data-page="learning"[^>]*>Learning Plan<\/a>/);
  assert.match(html, /id="page-learning"/);
  assert.match(html, /\['latest', 'all', 'resources', 'learning'\]\.includes\(initialPage\)/);
});

test('shows the latest month first and every supplied course once', () => {
  assert.ok(page.indexOf('September 2026') < page.indexOf('August 2026'));
  topics.forEach(topic => {
    assert.equal((page.match(new RegExp(topic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []).length, 1, topic);
  });
  assert.equal((page.match(/class="learning-row"/g) ?? []).length, 11);
});

test('uses only verified links and accessible disabled fallbacks', () => {
  verifiedUrls.forEach(url => assert.ok(page.includes(url), `missing ${url}`));
  assert.equal((page.match(/class="learning-action"/g) ?? []).length, 5);
  assert.equal((page.match(/class="learning-action-disabled"/g) ?? []).length, 6);
  assert.equal((page.match(/target="_blank" rel="noopener noreferrer"/g) ?? []).length, 5);
  assert.equal((page.match(/aria-disabled="true"/g) ?? []).length, 6);
  assert.doesNotMatch(page, /href=""|href="#"/);
});

test('keeps type and action as separate fields and defines mobile layout', () => {
  assert.equal((page.match(/class="learning-type /g) ?? []).length, 11);
  assert.match(html, /@media \(max-width: 768px\) \{[\s\S]*?\.learning-month \{[^}]*grid-template-columns: 1fr/);
  assert.match(html, /\.learning-action:focus-visible/);
});

test('uses semantic monthly lists around every learning row', () => {
  const months = page.match(/<section class="learning-month"[\s\S]*?<\/section>/g) ?? [];
  assert.equal(months.length, 2);
  [6, 5].forEach((expectedRows, index) => {
    const month = months[index];
    assert.match(month, /<ol class="learning-list-items">/);
    assert.equal((month.match(/<li class="learning-list-item">/g) ?? []).length, expectedRows);
    assert.equal((month.match(/<article class="learning-row">/g) ?? []).length, expectedRows);
  });
});
