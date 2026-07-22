# All Weeks Calendar Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the ambiguous W-number picker with the approved month-calendar week picker and restore every existing 2026 weekly report to the refreshed All Weeks layout.

**Architecture:** Keep `draft-new-ia.html` as the production-style single-page prototype and preserve each report in a static `<template>` keyed by canonical ISO year/week. The picker derives its available state and years from those template keys, renders a Monday–Sunday month calendar, and clones only Internal Updates and External Updates into All Weeks. Existing content in `index.html` is the migration source for Weeks 19–27; each record is assigned by its preserved real date, and no article or Slack content is regenerated.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Node.js built-in test runner.

## Global Constraints

- Use Apple System typography and the approved `#2563EB` blue family.
- Use real ISO week numbers and Monday–Sunday ranges; the legacy page is a source container, not authoritative ISO membership.
- Keep Popular Topics exclusive to Latest Week.
- Keep weeks without reports visible but disabled.
- Preserve all existing Slack permalinks, external URLs, article copy, and checked-in media.
- Do not modify files inside `/Users/zwang5/.agents/skills` or `/Users/zwang5/.codex/skills`.
- Do not publish or push to GitHub.

---

### Task 1: Update the canonical Markdown contracts

**Files:**
- Modify: `design-spec.md`
- Modify: `digest.md`
- Modify: `update-notes.md`
- Test: `tests/draft-new-ia-all-weeks.test.mjs`

**Interfaces:**
- Consumes: approved month-calendar behavior in `docs/superpowers/specs/2026-07-22-newsletter-ui-system-refresh-design.md`
- Produces: canonical rules for calendar rendering and archive preservation

- [ ] **Step 1: Add failing contract assertions**

Add assertions that `design-spec.md` requires a Monday–Sunday month calendar, whole-row week selection, disabled unavailable rows, dimmed cross-month dates, and the `Week 29` / `July 13 to 19, 2026` trigger hierarchy. Add an assertion that `digest.md` says every historical report remains in `availableArchiveWeeks` during refresh.

- [ ] **Step 2: Run the contract test and verify failure**

Run: `node --test tests/draft-new-ia-all-weeks.test.mjs`

Expected: FAIL because the current canonical Markdown still describes the W01–W53 button grid.

- [ ] **Step 3: Replace superseded Markdown rules**

In `design-spec.md`, replace the old “Render all real ISO weeks” button-grid description with the approved month calendar rules. In `digest.md`, require archive keys to be derived from every stored report and explicitly forbid replacing the set with only the two newest weeks. Record the migration and picker change in `update-notes.md`.

- [ ] **Step 4: Run the contract test and verify pass**

Run: `node --test tests/draft-new-ia-all-weeks.test.mjs`

Expected: the Markdown contract assertions PASS.

- [ ] **Step 5: Commit the Markdown contract update**

```bash
git add design-spec.md digest.md update-notes.md tests/draft-new-ia-all-weeks.test.mjs
git commit -m "docs: define month calendar archive picker"
```

### Task 2: Restore all existing reports with canonical ISO metadata

**Files:**
- Modify: `draft-new-ia.html`
- Test: `tests/draft-new-ia-all-weeks.test.mjs`

**Interfaces:**
- Consumes: historical report cards in `index.html` for legacy newsletter weeks 1–9
- Produces: report templates `week-report-2026-W19` through `week-report-2026-W28`; Latest Week remains `2026-W29`

- [ ] **Step 1: Add a failing archive-completeness test**

Assert that `draft-new-ia.html` contains these available keys:

```js
const expectedWeeks = Array.from({ length: 11 }, (_, index) => `2026-W${String(index + 19).padStart(2, '0')}`);
for (const key of expectedWeeks) assert.match(html, new RegExp(key));
```

Also assert that every archived report template contains an Internal Updates header, Slack card container, External Updates header, and external card grid.

- [ ] **Step 2: Run the archive test and verify failure**

Run: `node --test tests/draft-new-ia-all-weeks.test.mjs`

Expected: FAIL because only Weeks 28 and 29 are currently available.

- [ ] **Step 3: Migrate existing records without rewriting content**

Treat `week1` through `week9` as source containers only. For every Slack and external record with a parseable 2026 date, place that record in the real Monday–Sunday ISO template containing the date. Do not assign a complete legacy page to one ISO week.

| Canonical archive key | Date range |
|---|---|
| `2026-W19` | May 4 to 10, 2026 |
| `2026-W20` | May 11 to 17, 2026 |
| `2026-W21` | May 18 to 24, 2026 |
| `2026-W22` | May 25 to 31, 2026 |
| `2026-W23` | June 1 to 7, 2026 |
| `2026-W24` | June 8 to 14, 2026 |
| `2026-W25` | June 15 to 21, 2026 |
| `2026-W26` | June 22 to 28, 2026 |
| `2026-W27` | June 29 to July 5, 2026 |
| `2026-W28` | July 6 to 12, 2026 |
| Latest Week `2026-W29` | July 13 to 19, 2026 |

Keep original URLs, titles, summaries, authors, dates, channels, media paths, and stored original Slack messages. For a record without a safely parseable date, preserve it in its source container and mark `data-date-policy="source-container"`; never invent a date. Do not add a Popular Topics section to any archive template.

- [ ] **Step 4: Derive the available set from all stored report templates**

Replace the two-item set with template-derived keys plus Latest Week:

```js
const latestArchiveWeekKey = '2026-W29';
const availableArchiveWeeks = new Set([
  latestArchiveWeekKey,
  ...Array.from(document.querySelectorAll('template[id^="week-report-"]'))
    .map(template => template.id.replace('week-report-', ''))
]);
```

- [ ] **Step 5: Run archive tests and verify pass**

Run: `node --test tests/draft-new-ia-all-weeks.test.mjs`

Expected: all archive completeness, link safety, and Popular Topic exclusivity tests PASS.

- [ ] **Step 6: Commit the restored archive**

```bash
git add draft-new-ia.html tests/draft-new-ia-all-weeks.test.mjs
git commit -m "feat: restore historical reports to All Weeks"
```

### Task 3: Implement the month-calendar week picker

**Files:**
- Modify: `draft-new-ia.html`
- Test: `tests/draft-new-ia-all-weeks.test.mjs`

**Interfaces:**
- Consumes: `availableArchiveWeeks: Set<string>`, `selectedArchiveWeek`, and `getISOWeekRange(year, week)`
- Produces: `renderMonthWeekPicker(year: number, month: number): void`, `changeWeekPickerMonth(direction: number): void`, and whole-row week selection

- [ ] **Step 1: Replace old grid assertions with failing calendar assertions**

Assert that the HTML contains weekday labels Monday through Sunday, a month label, `renderMonthWeekPicker`, `changeWeekPickerMonth`, row-level `aria-selected`, disabled rows, cross-month date styling, and no `W01` button generation.

- [ ] **Step 2: Run the picker test and verify failure**

Run: `node --test tests/draft-new-ia-all-weeks.test.mjs`

Expected: FAIL because `renderWeekPicker` still builds 52 or 53 independent buttons.

- [ ] **Step 3: Implement calendar month calculations**

Add a UTC-safe helper that creates every Monday–Sunday row intersecting the visible month and attaches the matching ISO year/week. Each row must contain one week-number metadata cell plus seven date cells; dates outside the visible month receive `.is-outside-month`.

- [ ] **Step 4: Implement row states and interaction**

Render these states:

```text
unavailable → neutral text and background, disabled
available   → white row, subtle neutral hover
current     → inset #2563EB outline when not selected
selected    → continuous #2563EB row, white dates, no outer ring
```

Make the entire row one keyboard and pointer target. Selecting a row updates the two-line trigger, closes the popover, and runs `syncArchiveWeekContent()`.

- [ ] **Step 5: Implement month navigation and initial month**

Open on the month containing the selected report's Monday. Derive archive years from available report keys. Year arrows remain disabled for the current single-year dataset and become active automatically when another year has data. Derive the current-week outline from an injectable clock; on July 23, 2026, disabled Week 30 carries the current indicator while Week 29 remains the latest available report.

- [ ] **Step 6: Add responsive calendar behavior**

Keep the seven date columns visible at 390px, use a minimum 44px row height, abbreviate weekday labels, and prevent page-level horizontal scrolling.

- [ ] **Step 7: Run picker tests and verify pass**

Run: `node --test tests/draft-new-ia-all-weeks.test.mjs`

Expected: all picker behavior and responsive contract tests PASS.

- [ ] **Step 8: Commit the picker implementation**

```bash
git add draft-new-ia.html tests/draft-new-ia-all-weeks.test.mjs
git commit -m "feat: add calendar-based week picker"
```

### Task 4: Verify the complete archive visually and functionally

**Files:**
- Modify if needed: `draft-new-ia.html`
- Modify if needed: `tests/draft-new-ia-all-weeks.test.mjs`

**Interfaces:**
- Consumes: completed Markdown contracts, report templates, and month picker
- Produces: a verified local newsletter demo

- [ ] **Step 1: Run the complete test suite**

Run: `node --test tests/*.test.mjs`

Expected: all tests PASS with zero failures.

- [ ] **Step 2: Inspect desktop behavior**

Open `draft-new-ia.html?page=all&picker=open` locally. Verify month navigation, Weeks 19–29 availability, disabled surrounding weeks, selected/current states, and report switching.

- [ ] **Step 3: Inspect mobile behavior**

At 390px width, verify all seven day columns remain legible, each row is at least 44px, navigation and filter rows do not force page-level horizontal scrolling, and archived cards use the refreshed single-column layout.

- [ ] **Step 4: Spot-check migrated content**

Open one report from May, June, and July. Confirm Slack cards open their detail dialog, `View in Slack` opens the original permalink, external cards open their original article, and All Weeks never displays Popular Topics.

- [ ] **Step 5: Commit any verification fixes**

```bash
git add draft-new-ia.html tests/draft-new-ia-all-weeks.test.mjs
git commit -m "fix: polish calendar archive behavior"
```
