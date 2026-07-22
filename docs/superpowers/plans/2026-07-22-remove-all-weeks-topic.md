# Remove Popular Topics from All Weeks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent All Weeks from rendering the Popular Topics block and restore working destinations for every archived Slack and external card.

**Architecture:** Keep the archived week source data intact, but change `syncArchiveWeekContent()` so its render list begins with the Internal Updates heading instead of `.weekly-topic`. Replace Week 28 placeholder anchors with verified source links, and protect both behaviors with static regression tests.

**Tech Stack:** Static HTML, browser JavaScript, Node.js built-in test runner.

## Global Constraints

- Do not modify Markdown files inside any Skill directory.
- Do not change Latest Week Popular Topics behavior, Resources Hub, Internal Updates, or External Updates.
- Do not create a Git commit, push, publish, or send a Slack notification.

---

### Task 1: Remove Popular Topics from the All Weeks render path

**Files:**
- Modify: `tests/draft-new-ia-all-weeks.test.mjs`
- Modify: `draft-new-ia.html`

**Interfaces:**
- Consumes: `syncArchiveWeekContent()` and the `#archive-week-content` container.
- Produces: All Weeks archive content containing Internal Updates and External Updates without `.weekly-topic`.
- Produces: Fifteen Week 28 archive cards with real safe new-tab destinations.

- [ ] **Step 1: Write the failing regression test**

Add this test to `tests/draft-new-ia-all-weeks.test.mjs`:

```js
test('keeps popular topics exclusive to Latest Week', () => {
  assert.match(html, /id="page-latest"[\s\S]*?<section class="weekly-topic"/);
  assert.doesNotMatch(html, /\[weeklyTopic, internalHeader, filters, slackCards, externalHeader, externalGrid\]/);
  assert.match(html, /\[internalHeader, filters, slackCards, externalHeader, externalGrid\]/);
});

test('gives every Week 28 archive card a real safe destination', () => {
  const archive = html.match(/<template id="week-report-2026-W28">([\s\S]*?)<\/template>/)?.[1] ?? '';
  const cards = archive.match(/<a class="(?:slack-card|masonry-card)"/g) ?? [];
  const safeLinks = archive.match(/<a class="(?:slack-card|masonry-card)"[^>]*href="https:\/\/[^\"]+"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/g) ?? [];
  assert.equal(cards.length, 15);
  assert.equal(safeLinks.length, 15);
  assert.doesNotMatch(archive, /href="#"/);
});
```

- [ ] **Step 2: Run the focused test and verify the failure**

Run:

```bash
node --test tests/draft-new-ia-all-weeks.test.mjs
```

Expected: both new tests fail because `syncArchiveWeekContent()` still includes `weeklyTopic` and the Week 28 archive still contains `href="#"` placeholders.

- [ ] **Step 3: Implement the minimal rendering change**

In `draft-new-ia.html`, remove the weekly-topic query and render entry:

```js
const filters = source.querySelector('.filters');
const slackCards = source.querySelector('.slack-cards');
const externalGrid = source.querySelector('.external-card-grid');
const fragment = document.createDocumentFragment();

[internalHeader, filters, slackCards, externalHeader, externalGrid].forEach(node => {
  if (!node) return;
  const clone = node.cloneNode(true);
  clone.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
  fragment.appendChild(clone);
});
```

Replace the seven Slack placeholders with verified `booking.enterprise.slack.com` permalinks and the eight external placeholders with official source URLs. Every card must include `target="_blank" rel="noopener noreferrer"`.

- [ ] **Step 4: Run all tests**

Run:

```bash
node --test tests/*.test.mjs
git diff --check
```

Expected: 34 tests pass and `git diff --check` prints no errors.

- [ ] **Step 5: Visually verify both pages**

Open `draft-new-ia.html` locally. Confirm Latest Week still shows the illustrated topic block and All Weeks begins its selected report with Internal Updates immediately below the week picker.
