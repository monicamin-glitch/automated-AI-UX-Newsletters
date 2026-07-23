# Shared Card Actions and Slack Dialog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved card typography, inline Slack action, dialog author identity, and External action spacing consistently to Latest Week and All Weeks.

**Architecture:** Keep the single-file website architecture and enhance every Slack source anchor through the shared `prepareSlackCard(card)` path. Replace the inner full-width button with a keyboard-operable article root containing a real nested Slack link in the metadata row; keep the existing normalized view model and dialog sanitizer.

**Tech Stack:** HTML, CSS, browser JavaScript, Node.js built-in test runner, headless Chrome DevTools runtime test.

## Global Constraints

- Slack and External Update titles are exactly 16px at weight 700.
- Slack summaries and dialog copy remain 14px; metadata remains 12px.
- Slack metadata ends with `reply count · View in Slack ↗`.
- Card click and Enter/Space open the dialog; `View in Slack ↗` opens only the verified permalink.
- Dialog avatar is 36×36px and falls back to deterministic author initials.
- Dialog supporting metadata is exactly `[date] · [reply count]`.
- External `Read article ↗` has no horizontal padding and begins 8px after the summary region.
- Latest Week and All Weeks use the same enhancement functions and CSS.
- Do not change summaries, filters, archive membership, destinations, or stored Slack parent-message content.

---

### Task 1: Shared title and External action rhythm

**Files:**
- Modify: `draft-new-ia.html:150-182`
- Modify: `design-spec.md:94-110`
- Test: `tests/draft-new-ia-all-weeks.test.mjs:460-470`
- Test: `tests/draft-new-ia-all-weeks.test.mjs:905-930`

**Interfaces:**
- Consumes: Existing `.slack-card-title`, `.masonry-card-title`, `.masonry-card-summary`, and `.masonry-card-action` classes.
- Produces: Shared 16px title scale and an External action whose left edge matches `.masonry-card-body`.

- [ ] **Step 1: Write failing typography and spacing tests**

Add assertions:

```js
test('uses the approved 16px card-title scale', () => {
  assert.match(html, /\.slack-card-title \{[^}]*font-size: 16px;[^}]*font-weight: 700/);
  assert.match(html, /\.masonry-card-title \{[^}]*font-size: 16px;[^}]*font-weight: 700/);
});

test('left-aligns External actions with an 8px content gap', () => {
  assert.match(html, /\.masonry-card-summary \{[^}]*flex: 1/);
  assert.match(html, /\.masonry-card-action \{[^}]*margin-top: 8px;[^}]*padding: 0/);
  assert.doesNotMatch(html, /\.masonry-card-body \.masonry-card-action \{[^}]*margin-top: auto/);
});
```

- [ ] **Step 2: Run the focused tests and confirm RED**

Run:

```bash
node --test --test-name-pattern='16px card-title|left-aligns External' tests/draft-new-ia-all-weeks.test.mjs
```

Expected: both tests fail because titles are 14px and the action uses `3px 6px` padding with automatic top margin.

- [ ] **Step 3: Apply the minimal CSS**

Use:

```css
.slack-card-title {
  font-size: 16px;
  font-weight: 700;
}

.masonry-card-title {
  font-size: 16px;
  font-weight: 700;
}

.masonry-card-summary {
  flex: 1;
}

.masonry-card-action {
  width: fit-content;
  margin-top: 8px;
  padding: 0;
}
```

Keep `.view-in-slack` padding independent so its hover target remains compact.

- [ ] **Step 4: Update the typography table and External card rules**

Set `Slack/article title` to `16px | 700`. State that External actions use zero horizontal padding, align with card copy, and have an 8px summary gap.

- [ ] **Step 5: Run focused tests and commit**

Run:

```bash
node --test --test-name-pattern='16px card-title|left-aligns External' tests/draft-new-ia-all-weeks.test.mjs
```

Expected: 2 passing tests.

Commit:

```bash
git add draft-new-ia.html design-spec.md tests/draft-new-ia-all-weeks.test.mjs
git commit -m "style: unify card titles and article actions"
```

---

### Task 2: Inline Slack action and accessible card root

**Files:**
- Modify: `draft-new-ia.html:145-160`
- Modify: `draft-new-ia.html:214-220`
- Modify: `draft-new-ia.html:1388-1425`
- Modify: `design-spec.md:216-238`
- Test: `tests/draft-new-ia-all-weeks.test.mjs:1015-1030`
- Test: `tests/draft-new-ia-all-weeks.test.mjs:1235-1270`
- Test: `tests/draft-new-ia-all-weeks.test.mjs:1490-1590`

**Interfaces:**
- Consumes: `normalizeSlackCard(card)`, `openSlackMessageDialog(card, trigger)`, `.slack-card-meta`, and verified `viewModel.permalink`.
- Produces: `prepareSlackCard(card): HTMLElement` returning an article with `role="button"`, `tabindex="0"`, and a nested `.view-in-slack` anchor.

- [ ] **Step 1: Write failing structural and interaction tests**

Replace the detached-link expectations with:

```js
test('places the direct Slack action after replies inside metadata', () => {
  assert.match(html, /const metadata = preparedCard\.querySelector\('\.slack-card-meta'\)/);
  assert.match(html, /metadata\.appendChild\(directLink\)/);
  assert.match(html, /directLink\.innerHTML = 'View in Slack <span aria-hidden="true">↗<\/span>'/);
  assert.doesNotMatch(html, /preparedCard\.appendChild\(directLink\)/);
});

test('makes the article root the accessible dialog trigger', () => {
  assert.match(html, /preparedCard\.setAttribute\('role', 'button'\)/);
  assert.match(html, /preparedCard\.setAttribute\('tabindex', '0'\)/);
  assert.match(html, /preparedCard\.addEventListener\('click',[\s\S]*openSlackMessageDialog/);
  assert.match(html, /preparedCard\.addEventListener\('keydown',[\s\S]*event\.key === 'Enter'[\s\S]*event\.key === ' '/);
});
```

Update the runtime harness to select:

```js
const direct = first.querySelector('.slack-card-meta .view-in-slack');
```

Assert the link is after `.slack-meta-replies`, clicking the article opens the dialog, and clicking the link leaves the dialog closed.

- [ ] **Step 2: Run focused tests and confirm RED**

Run:

```bash
node --test --test-name-pattern='direct Slack action|article root|sibling detail' tests/draft-new-ia-all-weeks.test.mjs
```

Expected: failures reference the current `.archive-slack-card-detail` button and detached `:scope > .view-in-slack`.

- [ ] **Step 3: Refactor `prepareSlackCard`**

Implement the shared root:

```js
function prepareSlackCard(card) {
  const viewModel = normalizeSlackCard(card);
  const preparedCard = card.tagName === 'ARTICLE' ? card : document.createElement('article');

  if (preparedCard !== card) {
    Array.from(card.attributes).forEach(attribute => {
      if (!['href', 'target', 'rel'].includes(attribute.name)) {
        preparedCard.setAttribute(attribute.name, attribute.value);
      }
    });
    while (card.firstChild) preparedCard.appendChild(card.firstChild);
    card.replaceWith(preparedCard);
  }

  const metadata = preparedCard.querySelector('.slack-card-meta');
  const directLink = metadata.querySelector('.view-in-slack') || document.createElement('a');
  directLink.className = 'view-in-slack';
  directLink.target = '_blank';
  directLink.rel = 'noopener noreferrer';
  directLink.innerHTML = 'View in Slack <span aria-hidden="true">↗</span>';
  directLink.href = viewModel.permalink;
  directLink.hidden = !viewModel.permalink;
  if (!directLink.parentElement) metadata.appendChild(directLink);

  preparedCard.classList.add('archive-slack-card');
  preparedCard.setAttribute('role', 'button');
  preparedCard.setAttribute('tabindex', '0');
  preparedCard.setAttribute('aria-haspopup', 'dialog');
  preparedCard.setAttribute('aria-label', 'View details for ' + viewModel.title);
  preparedCard.addEventListener('click', event => {
    if (event.target.closest('.view-in-slack')) return;
    openSlackMessageDialog(preparedCard, preparedCard);
  });
  preparedCard.addEventListener('keydown', event => {
    if (event.target !== preparedCard) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openSlackMessageDialog(preparedCard, preparedCard);
  });
  directLink.addEventListener('click', preventSlackActionPropagation);
  slackViewModels.set(preparedCard, viewModel);
  return preparedCard;
}
```

Preserve the existing dataset assignments for permalink, author, date, and reply count.

- [ ] **Step 4: Replace detached-link CSS**

Remove `.archive-slack-card-detail` and detached `.view-in-slack` margin rules. Use:

```css
.slack-card.archive-slack-card {
  cursor: pointer;
}

.slack-card.archive-slack-card:focus-visible {
  outline: 3px solid rgba(var(--primary-rgb), 0.24);
  outline-offset: 3px;
}

.view-in-slack {
  margin-left: 0;
  white-space: nowrap;
}

.view-in-slack::before {
  content: "·";
  margin-right: 7px;
  color: var(--text-muted);
}
```

- [ ] **Step 5: Update the design contract and run tests**

Document the article root, nested metadata link, arrow, and Enter/Space behavior in `design-spec.md`.

Run:

```bash
node --test --test-name-pattern='direct Slack action|article root|Slack cards as sibling' tests/draft-new-ia-all-weeks.test.mjs
```

Expected: all matching tests pass.

- [ ] **Step 6: Commit**

```bash
git add draft-new-ia.html design-spec.md tests/draft-new-ia-all-weeks.test.mjs
git commit -m "fix: place Slack action in card metadata"
```

---

### Task 3: Slack dialog avatar and compact metadata

**Files:**
- Modify: `draft-new-ia.html:188-205`
- Modify: `draft-new-ia.html:315-333`
- Modify: `draft-new-ia.html:1320-1380`
- Modify: `draft-new-ia.html:1427-1450`
- Modify: `design-spec.md:239-250`
- Modify: `update-notes.md:3-15`
- Test: `tests/draft-new-ia-all-weeks.test.mjs:1260-1290`
- Test: `tests/draft-new-ia-all-weeks.test.mjs:1400-1675`

**Interfaces:**
- Consumes: `viewModel.author`, `viewModel.date`, `viewModel.replyCount`, and optional `card.dataset.slackAvatar`.
- Produces: `getAuthorInitials(name): string` and dialog elements `#slack-message-dialog-avatar`, `#slack-message-dialog-author`, and `#slack-message-dialog-supporting`.

- [ ] **Step 1: Write failing avatar and metadata tests**

Add:

```js
test('renders a dialog author avatar and one supporting metadata line', () => {
  assert.match(html, /id="slack-message-dialog-avatar"/);
  assert.match(html, /id="slack-message-dialog-supporting"/);
  assert.match(html, /function getAuthorInitials\(name\)/);
  assert.match(html, /avatar\.textContent = getAuthorInitials\(viewModel\.author\)/);
  assert.match(html, /supporting\.textContent = \[viewModel\.date, viewModel\.replyCount\]\.filter\(Boolean\)\.join\(' · '\)/);
});
```

Extend the Chrome runtime assertion:

```js
assert.match(result.avatar, /^[A-Z]{1,2}$/);
assert.equal(result.supporting, `${result.date} · ${result.replies}`);
```

- [ ] **Step 2: Run focused tests and confirm RED**

Run:

```bash
node --test --test-name-pattern='dialog author avatar|mobile bottom-sheet' tests/draft-new-ia-all-weeks.test.mjs
```

Expected: missing avatar, supporting line, and `getAuthorInitials`.

- [ ] **Step 3: Add dialog markup and CSS**

Use:

```html
<div class="slack-dialog-author-row">
  <div class="slack-dialog-avatar" id="slack-message-dialog-avatar" aria-hidden="true"></div>
  <div class="slack-dialog-author-copy">
    <p class="slack-dialog-author" id="slack-message-dialog-author"></p>
    <p class="slack-dialog-supporting" id="slack-message-dialog-supporting"></p>
  </div>
</div>
```

Keep reactions in `.slack-dialog-meta` below this row. Apply:

```css
.slack-dialog-author-row {
  display: flex;
  align-items: center;
  gap: 11px;
}

.slack-dialog-avatar {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--primary-ink);
  background: var(--primary-soft);
  font-size: 12px;
  font-weight: 700;
}

.slack-dialog-supporting {
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 12px;
}
```

- [ ] **Step 4: Populate avatar and supporting metadata**

Add:

```js
function getAuthorInitials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts.at(-1)[0] : '')).toUpperCase();
}
```

In `openSlackMessageDialog`:

```js
const avatar = document.getElementById('slack-message-dialog-avatar');
const supporting = document.getElementById('slack-message-dialog-supporting');
avatar.textContent = getAuthorInitials(viewModel.author);
supporting.textContent = [viewModel.date, viewModel.replyCount].filter(Boolean).join(' · ');
```

Remove the separate visible date and reply-count elements. Keep reaction rendering unchanged.

- [ ] **Step 5: Update documentation and run all tests**

Update `design-spec.md` and add an `update-notes.md` entry covering the 16px titles, inline Slack action, dialog avatar, and External action alignment.

Run:

```bash
node --test tests/*.test.mjs
```

Expected: all non-browser tests pass with only the explicit browser test skipped.

Run:

```bash
RUN_BROWSER_TESTS=1 node --test --test-name-pattern='browser runtime' tests/draft-new-ia-all-weeks.test.mjs
```

Expected: the Chrome runtime test passes at 390px with no overflow, correct hot zones, initials avatar, combined metadata, and focus restoration.

- [ ] **Step 6: Commit**

```bash
git add draft-new-ia.html design-spec.md update-notes.md tests/draft-new-ia-all-weeks.test.mjs
git commit -m "feat: polish shared cards and Slack dialog identity"
```

---

### Task 4: Final merged-page verification

**Files:**
- Verify: `draft-new-ia.html`
- Verify: `design-spec.md`
- Verify: `tests/draft-new-ia-all-weeks.test.mjs`

**Interfaces:**
- Consumes: All outputs from Tasks 1–3.
- Produces: A browser-ready Latest Week and All Weeks implementation.

- [ ] **Step 1: Run whitespace and repository checks**

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; only intentional files are modified or the working tree is clean after commits.

- [ ] **Step 2: Run the complete verification suite**

```bash
node --test tests/*.test.mjs
RUN_BROWSER_TESTS=1 node --test --test-name-pattern='browser runtime' tests/draft-new-ia-all-weeks.test.mjs
```

Expected: all static tests and the opt-in Chrome test pass.

- [ ] **Step 3: Start and inspect the merged preview**

```bash
python3 -m http.server 53216 --bind 127.0.0.1
```

Open:

```text
http://localhost:53216/draft-new-ia.html?page=latest
http://localhost:53216/draft-new-ia.html?page=all
```

Verify visually that the inline Slack action, 16px titles, avatar identity row, combined dialog metadata, and left-aligned External action appear on both pages.
