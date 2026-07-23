# Week-aware Slack Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide Slack category pills that have no cards in the currently displayed week while keeping `All` accurate and preserving the completed archive-media fallback.

**Architecture:** Add one DOM helper that derives available categories from the rendered `.slack-card[data-cat]` elements inside a page. Run it after Latest Week initializes and after All Weeks replaces its cloned report content; keep filtering scoped to the active page.

**Tech Stack:** Single-file HTML/CSS/JavaScript, Node.js built-in test runner, local Chromium runtime test.

## Global Constraints

- Keep `All` visible and update its count.
- Hide only empty category pills.
- Reset to `All` if an unavailable category had been active.
- Apply behavior to Latest Week and every All Weeks report.
- Keep all changes local; do not commit or push.

---

### Task 1: Document the long-topic fallback

**Files:**
- Modify: `design-spec.md`

**Produces:** Canonical desktop and mobile compact typography rules for long popular-topic words.

- [ ] Add the following rules under Popular-topic Center content:

```markdown
- Topic words use 28px on desktop and 25px on mobile by default.
- When a topic is longer than 18 characters, keep the compact state after the transition completes: 24px on desktop and 21px on mobile.
- Apply the same compact decision to both the current and next topic cards so the animated and settled states match.
```

- [ ] Run `git diff --check` and confirm exit code 0.

### Task 2: Add the filter regression test

**Files:**
- Modify: `tests/draft-new-ia-all-weeks.test.mjs`

**Produces:** A failing test for `syncSlackCategoryFilters(page)`.

- [ ] Add assertions that the helper derives categories from rendered cards, keeps `All`, updates `.chip-count`, hides empty chips, resets unavailable active filters, and is called for Latest Week and cloned archive content.
- [ ] Run:

```bash
node --test --test-name-pattern='hides empty Slack category filters' tests/draft-new-ia-all-weeks.test.mjs
```

Expected: FAIL because `syncSlackCategoryFilters` is not defined.

### Task 3: Implement dynamic filter visibility

**Files:**
- Modify: `draft-new-ia.html`

**Produces:** `syncSlackCategoryFilters(page)` and calls from both render paths.

- [ ] Implement:

```js
function syncSlackCategoryFilters(page) {
  const filters = page?.querySelector('.filters');
  if (!filters) return;
  const cards = [...page.querySelectorAll('.slack-card')];
  const available = new Set(cards.map(card => card.dataset.cat).filter(Boolean));
  const allChip = filters.querySelector('[onclick*="filterSlack(\\'all\\'"]');
  const activeChip = filters.querySelector('.filter-chip.active');

  filters.querySelectorAll('.filter-chip').forEach(chip => {
    const category = chip.getAttribute('onclick')?.match(/filterSlack\('([^']+)'/)?.[1];
    chip.hidden = Boolean(category && category !== 'all' && !available.has(category));
  });

  allChip?.querySelector('.chip-count')?.replaceChildren(String(cards.length));
  if (activeChip?.hidden && allChip) filterSlack('all', allChip);
}
```

- [ ] Call it after Latest Week Slack cards are prepared.
- [ ] Call it after `archiveContent.replaceChildren(fragment)`.
- [ ] Run the targeted test and confirm PASS.

### Task 4: Verify the full local digest preview

**Files:**
- Verify: `draft-new-ia.html`
- Verify: `slack-spotlight.md`
- Verify: `media-strategy.md`
- Verify: `design-spec.md`

- [ ] Run:

```bash
git diff --check && node --test tests/*.test.mjs
```

Expected: all non-browser tests pass with only the browser test skipped.

- [ ] Run the real-browser test:

```bash
RUN_BROWSER_TESTS=1 node --test --test-name-pattern='browser runtime' tests/draft-new-ia-all-weeks.test.mjs
```

Expected: PASS, including Week 24 image restoration/fallback and week-aware filters.

- [ ] Open:

```text
http://127.0.0.1:53216/draft-new-ia.html?page=all
```

Do not run the publishing/finalizer steps because the user requested a local preview only.
