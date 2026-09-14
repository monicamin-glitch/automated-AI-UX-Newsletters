# Learning Plan Page Implementation Plan

> Historical plan: implementation is complete. The final content and maintenance contract lives in [`../../../learning-plan.md`](../../../learning-plan.md); later reviewed UI refinements intentionally supersede some early values below.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive, static Learning Plan page with September and August 2026 schedules, verified course-resource actions, and disabled fallbacks for missing URLs.

**Architecture:** Keep the feature inside the existing single-file `index.html` application. Add one routeable page, page-scoped agenda CSS, and semantic month/row markup; protect the behavior with a focused Node test that parses the production HTML contract.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js built-in test runner.

## Global Constraints

- Keep `index.html` as the canonical production entry; do not add a framework, API, database, calendar integration, or build system.
- Add `Learning Plan` after `Resources Hub` and use page identifier `learning` with direct URL support through `?page=learning`.
- Show September 2026 before August 2026 on the same page.
- Use the existing Apple system font stack, `#2563EB` primary blue, and existing neutral tokens.
- Active course actions open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.
- Missing resource URLs use disabled `Link coming soon` controls; never guess a URL or emit an empty link.
- Preserve every existing newsletter, archive, and Resources Hub entry.
- Do not publish to B.Pages until the local page is reviewed and production checks pass.

---

### Task 1: Add the Learning Plan contract and page

**Files:**
- Create: `tests/learning-plan-page.test.mjs`
- Modify: `index.html`
- Modify: `docs/superpowers/specs/2026-09-08-learning-plan-page-design.md`

**Interfaces:**
- Consumes: existing `.nav-tab`, `.page`, `showPage(pageId, tabEl)`, query-parameter initialization, typography tokens, and mobile navigation behavior in `index.html`.
- Produces: `#page-learning`, `.learning-plan-page`, `.learning-month`, `.learning-row`, `.learning-action`, and `.learning-action-disabled`; expands the initial-page allowlist to `['latest', 'all', 'resources', 'learning']`.

- [ ] **Step 1: Write the failing production-contract test**

Create `tests/learning-plan-page.test.mjs` with the following assertions:

```js
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
```

- [ ] **Step 2: Run the focused test and verify the feature is absent**

Run:

```bash
node --test tests/learning-plan-page.test.mjs
```

Expected: FAIL because `page-learning`, the navigation tab, the action links, and the `learning` route are not yet present.

- [ ] **Step 3: Add page-scoped agenda styles to `index.html`**

Insert styles after the Resources Hub rules. Use these responsibilities and values:

```css
.learning-plan-page { display: flex; flex-direction: column; gap: 34px; }
.learning-page-header { margin-bottom: 2px; }
.learning-month { display: grid; grid-template-columns: 132px minmax(0, 1fr); gap: 28px; padding-top: 26px; border-top: 1px solid var(--border); }
.learning-month:first-of-type { padding-top: 0; border-top: 0; }
.learning-month-label { position: sticky; top: 86px; align-self: start; }
.learning-month-name { display: block; color: var(--text-primary); font-size: 22px; font-weight: 700; line-height: 1.15; }
.learning-month-year { display: block; margin-top: 5px; color: var(--text-muted); font-size: 13px; line-height: 1.4; }
.learning-list { overflow: hidden; border: 1px solid var(--border); border-radius: 16px; background: var(--card-bg); }
.learning-list-header, .learning-row { display: grid; grid-template-columns: 84px minmax(240px, 1fr) 108px 150px 112px; align-items: center; column-gap: 18px; }
.learning-list-header { min-height: 45px; padding: 0 20px; color: var(--text-muted); background: var(--surface-subtle, #f8fafc); font-size: 12px; font-weight: 600; }
.learning-row { min-height: 92px; padding: 16px 20px; border-top: 1px solid var(--border-light); }
.learning-date { color: var(--primary); font-size: 14px; font-weight: 650; }
.learning-topic { margin: 0; color: var(--text-primary); font-size: 16px; font-weight: 650; line-height: 1.4; }
.learning-presenter { margin: 4px 0 0; color: var(--text-muted); font-size: 12px; line-height: 1.4; }
.learning-duration { color: var(--text-secondary); font-size: 14px; }
.learning-type { width: fit-content; padding: 6px 10px; border-radius: 999px; color: var(--primary); background: var(--primary-tint); font-size: 12px; font-weight: 500; white-space: nowrap; }
.learning-type-internal { color: #15803d; background: #dcfce7; }
.learning-type-ddp { color: #7e22ce; background: #f3e8ff; }
.learning-type-roundtable { color: #c2410c; background: #ffedd5; }
.learning-action, .learning-action-disabled { display: inline-flex; align-items: center; justify-content: center; min-height: 34px; padding: 7px 12px; border-radius: 9px; font-size: 12px; font-weight: 600; line-height: 1; white-space: nowrap; }
.learning-action { color: #fff; background: var(--primary); text-decoration: none; transition: background 0.15s ease, transform 0.15s ease; }
.learning-action:hover { background: var(--primary-dark, #1d4ed8); transform: translateY(-1px); }
.learning-action:focus-visible { outline: 3px solid rgba(var(--primary-rgb), 0.25); outline-offset: 2px; }
.learning-action-disabled { border: 0; color: var(--text-muted); background: #f1f5f9; cursor: not-allowed; }
```

Inside the existing `@media (max-width: 768px)` block, add:

```css
.learning-plan-page { gap: 28px; }
.learning-month { grid-template-columns: 1fr; gap: 14px; padding-top: 24px; }
.learning-month-label { position: static; }
.learning-month-name { display: inline; font-size: 20px; }
.learning-month-year { display: inline; margin: 0 0 0 6px; }
.learning-list-header { display: none; }
.learning-row { grid-template-columns: 58px minmax(0, 1fr); gap: 8px 12px; padding: 16px; }
.learning-date { grid-column: 1; grid-row: 1 / span 3; align-self: start; }
.learning-topic-wrap { grid-column: 2; }
.learning-duration { grid-column: 2; }
.learning-type-wrap { grid-column: 2; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.learning-action, .learning-action-disabled { min-height: 36px; }
```

- [ ] **Step 4: Add the navigation item and semantic Learning Plan markup**

Add this tab immediately after Resources Hub:

```html
<a class="nav-tab" data-page="learning" onclick="showPage('learning', this)">Learning Plan</a>
```

Add `<!-- PAGE: Learning Plan -->` and `<div class="page" id="page-learning">` immediately before `<!-- PAGE: Resources Hub -->`. This preserves the existing Resources Hub parser's assumption that Resources Hub is the final page container while the visible navigation still places Learning Plan fourth. Inside it:

- Render the page heading `Learning Plan` and subtitle `Design CN monthly learning archive`.
- Render two `<section class="learning-month" aria-labelledby="learning-september-2026">` month groups in September-then-August order.
- Use one `.learning-row` article per course, with `.learning-topic-wrap`, `.learning-duration`, `.learning-type-wrap`, and the Action field.
- Give every active link an accessible name such as `aria-label="Watch Write a well-structured prompt in a new tab"`.
- Reuse the Preserving Learning recording URL for both Part 1 and Part 2.
- Render six missing resources as `<button class="learning-action-disabled" type="button" disabled aria-disabled="true">Link coming soon</button>`.
- Use the exact eleven rows and exact URLs in `docs/superpowers/specs/2026-09-08-learning-plan-page-design.md`.

- [ ] **Step 5: Extend direct-page routing**

Change:

```js
if (!['latest', 'all', 'resources'].includes(initialPage)) return;
```

to:

```js
if (!['latest', 'all', 'resources', 'learning'].includes(initialPage)) return;
```

- [ ] **Step 6: Run the focused test and fix only Learning Plan failures**

Run:

```bash
node --test tests/learning-plan-page.test.mjs
```

Expected: 4 tests pass.

- [ ] **Step 7: Commit the test, specification refinement, and feature**

```bash
git add index.html tests/learning-plan-page.test.mjs docs/superpowers/specs/2026-09-08-learning-plan-page-design.md
git commit -m "Feat: add monthly learning plan page"
```

### Task 2: Verify regressions and responsive rendering

**Files:**
- Verify: `index.html`
- Verify: `tests/learning-plan-page.test.mjs`
- Verify: `tests/publishing-entry.test.mjs`
- Verify: `tests/draft-new-ia-resources.test.mjs`

**Interfaces:**
- Consumes: completed Learning Plan page and existing production-entry/Resources Hub contracts.
- Produces: evidence that the new static page does not replace or break the three existing pages and is ready for local visual review.

- [ ] **Step 1: Run the focused regression suite**

Run:

```bash
node --test tests/learning-plan-page.test.mjs tests/publishing-entry.test.mjs tests/draft-new-ia-resources.test.mjs
```

Expected: all tests in these three files pass. If an existing baseline test fails because its route allowlist expects exactly three pages, update only that assertion to include `learning`, rerun, and include the changed test in the feature commit.

- [ ] **Step 2: Run the repository-wide test suite and record baseline-only failures**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: the new Learning Plan test passes and no failure is attributable to `page-learning`, Learning Plan CSS, navigation, or routing. Existing historical-week fixture failures already present on `origin/main` must be reported separately and must not be rewritten as part of this feature.

- [ ] **Step 3: Run production validation**

Run:

```bash
node scripts/finalize-weekly-refresh.mjs
```

Expected: the script finishes with `Weekly refresh validated.`. With no `--commit`, `--push`, `--publish-bpages`, or `--notify` flags, it performs the repository's validation/build checks without publishing, pushing, committing, or messaging Slack; weekly source content remains unchanged.

- [ ] **Step 4: Review the page at desktop and 390px widths**

Serve the repository locally, open `index.html?page=learning`, and verify:

```text
Desktop: month rail remains left of the five-column agenda; no text or action overlaps.
390px: month label moves above the list; date remains left; topic, metadata, type, and action remain visible; documentElement.scrollWidth equals documentElement.clientWidth.
Keyboard: Tab reaches every active Watch/View action; focus ring is visible; disabled actions are skipped.
Navigation: Latest Week, All Weeks, Resources Hub, and Learning Plan all switch correctly.
```

- [ ] **Step 5: Commit any verification-only test adjustment**

If Step 1 required changing an existing route assertion:

```bash
git add tests/publishing-entry.test.mjs tests/draft-new-ia-resources.test.mjs
git commit -m "Test: cover Learning Plan navigation"
```

If no file changed, do not create an empty commit.

## Self-review results

- Spec coverage: navigation, routing, two-month ordering, eleven courses, presenter metadata, type pills, active and unavailable actions, accessibility, responsive layout, and no-publish boundary each map to explicit steps above.
- Placeholder scan: every implementation and verification step contains concrete commands, values, and expected outcomes.
- Type consistency: page id `learning` and all class names are consistent between the test, CSS, HTML, and route change.
