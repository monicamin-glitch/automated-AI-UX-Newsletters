# Internal Topic Slack Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show four Booking-specific weekly topics and turn each topic's metadata row into a week-bounded Booking Slack search link.

**Architecture:** `slack-spotlight.md` remains the source of truth for extraction rules and current-week output. `draft-new-ia.html` renders that output, generates an exact-phrase Slack search URL from each topic and the Week 29 date boundaries, and applies the approved full-row hover/focus treatment. Static Node tests protect content, link safety, interaction, and existing topic cycling behavior.

**Tech Stack:** Markdown, single-file HTML/CSS/JavaScript, Node.js built-in test runner.

## Global Constraints

- Keep only named Booking.com platforms, internal integrations, community events, or internally built tools.
- Exclude vendor products, public model names, open protocols, and broad industry concepts.
- Show four Week 29 topics; do not pad the list with generic terms.
- Search only Monday July 13 through Sunday July 19, 2026 using `after:2026-07-12 before:2026-07-20`.
- The complete metadata row is one link and uses safe new-tab behavior.
- Preserve the existing card animation, reduced-motion support, and Latest Week-only placement.
- Keep all changes local; do not commit, push, or publish.

---

### Task 1: Protect the new topic set and search behavior

**Files:**
- Modify: `tests/draft-new-ia-topic-module.test.mjs`
- Test: `tests/draft-new-ia-topic-module.test.mjs`

**Interfaces:**
- Consumes: the `weeklyTopics` array and `buildSlackTopicSearchUrl(topic)` function embedded in `draft-new-ia.html`.
- Produces: regression coverage requiring four internal topics and a safe, week-bounded metadata link.

- [ ] **Step 1: Replace the Top 10 assertion with a failing internal-topic assertion**

```js
test('keeps only four Booking-specific weekly topics', () => {
  const topicEntries = html.match(/\{ word: '[^']+', mentions: '[^']+', channels: \d+ \}/g) ?? [];
  assert.equal(topicEntries.length, 4);
  assert.match(html, /\{ word: 'Agent Fabric', mentions: '16', channels: 13 \}/);
  assert.match(html, /\{ word: 'Skills MCP', mentions: '8', channels: 2 \}/);
  assert.match(html, /\{ word: 'Design\+AI Summit', mentions: '2', channels: 2 \}/);
  assert.match(html, /\{ word: 'AI Illustration Generator', mentions: '1', channels: 1 \}/);
  assert.doesNotMatch(html, /\{ word: 'Claude Code'/);
  assert.doesNotMatch(html, /\{ word: 'GPT-5\.6'/);
  assert.doesNotMatch(html, /\{ word: 'AI Agents'/);
  assert.doesNotMatch(html, /\{ word: 'MCP Servers'/);
});
```

- [ ] **Step 2: Add a failing test for the metadata search link**

```js
test('links the complete topic metadata row to the matching Week 29 Slack search', () => {
  assert.match(html, /id="topic-card-search"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /function buildSlackTopicSearchUrl\(topic\)/);
  assert.match(html, /after:2026-07-12 before:2026-07-20/);
  assert.match(html, /booking\.enterprise\.slack\.com\/search\?q=/);
  assert.match(html, /encodeURIComponent\(query\)/);
  assert.match(html, /topicSearch\.href = buildSlackTopicSearchUrl\(topic\.word\)/);
});
```

- [ ] **Step 3: Run the focused tests and confirm they fail**

Run: `node --test tests/draft-new-ia-topic-module.test.mjs`

Expected: FAIL because ten topics remain and `topic-card-search` / `buildSlackTopicSearchUrl` do not exist.

---

### Task 2: Implement internal topics and Slack search in the Demo

**Files:**
- Modify: `draft-new-ia.html`
- Test: `tests/draft-new-ia-topic-module.test.mjs`

**Interfaces:**
- Consumes: `weeklyTopics: Array<{word: string, mentions: string, channels: number}>` and the fixed Week 29 boundaries.
- Produces: `buildSlackTopicSearchUrl(topic: string): string` and `#topic-card-search`, updated by `renderTopicCard(index)`.

- [ ] **Step 1: Replace the current topic array with four internal topics**

```js
const weeklyTopics = [
  { word: 'Agent Fabric', mentions: '16', channels: 13 },
  { word: 'Skills MCP', mentions: '8', channels: 2 },
  { word: 'Design+AI Summit', mentions: '2', channels: 2 },
  { word: 'AI Illustration Generator', mentions: '1', channels: 1 }
];
```

- [ ] **Step 2: Turn the complete metadata row into one accessible link**

```html
<a class="topic-card-meta" id="topic-card-search" href="https://booking.enterprise.slack.com/search?q=%22Agent%20Fabric%22%20after%3A2026-07-12%20before%3A2026-07-20" target="_blank" rel="noopener noreferrer" aria-label="Search Agent Fabric in Booking Slack for Week 29">
  <span id="topic-card-mentions">16 mentions</span>
  <span aria-hidden="true">·</span>
  <span id="topic-card-channels">13 channels</span>
  <svg class="topic-search-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
</a>
```

- [ ] **Step 3: Generate an exact-phrase Week 29 URL and refresh it when topics cycle**

```js
function buildSlackTopicSearchUrl(topic) {
  const query = '"' + topic + '" after:2026-07-12 before:2026-07-20';
  return 'https://booking.enterprise.slack.com/search?q=' + encodeURIComponent(query);
}

function renderTopicCard(index) {
  const topic = topicAt(index);
  const topicSearch = document.getElementById('topic-card-search');
  document.getElementById('topic-card-word').textContent = topic.word;
  document.getElementById('topic-card-mentions').textContent = topic.mentions + ' mentions';
  document.getElementById('topic-card-channels').textContent = topic.channels + ' channels';
  topicSearch.href = buildSlackTopicSearchUrl(topic.word);
  topicSearch.setAttribute('aria-label', 'Search ' + topic.word + ' in Booking Slack for Week 29');
  document.getElementById('topic-card-next-word').textContent = topicAt(index + 1).word;
}
```

- [ ] **Step 4: Add approved hover and keyboard-focus styling**

```css
.topic-card-meta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 9px;
  border-radius: 9px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color .15s ease, background .15s ease;
}
.topic-search-arrow {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  transition: transform .15s ease;
}
.topic-card-meta:hover,
.topic-card-meta:focus-visible {
  color: var(--booking-blue);
  background: #eef6ff;
}
.topic-card-meta:hover .topic-search-arrow,
.topic-card-meta:focus-visible .topic-search-arrow {
  transform: translateX(2px);
}
```

- [ ] **Step 5: Initialize the default topic link**

Keep the real Agent Fabric URL in the initial HTML and call `renderTopicCard(topicCardIndex);` once after defining `showNextWeeklyTopic()` so content and accessibility attributes are initialized consistently before any interaction.

- [ ] **Step 6: Run focused tests and confirm they pass**

Run: `node --test tests/draft-new-ia-topic-module.test.mjs`

Expected: all focused tests PASS.

---

### Task 3: Align Markdown rules and complete regression verification

**Files:**
- Modify: `slack-spotlight.md`
- Modify: `design-spec.md`
- Test: `tests/*.test.mjs`

**Interfaces:**
- Consumes: the approved internal-topic eligibility and metadata search behavior.
- Produces: authoritative weekly extraction and display rules for future digest runs.

- [ ] **Step 1: Update the popular-topic extraction rule in `slack-spotlight.md`**

Replace the broad Top 10 output rule with:

```markdown
8. Keep only Booking-specific named platforms, internal integrations, community events, and internally built tools. Exclude vendor products, public model names, open protocols, and broad industry concepts.
9. Return up to five distinct internal topics. Do not pad the list with generic terms when fewer than five qualify.
```

Replace the current Week 29 `popular_topics` output with the same four objects used by `weeklyTopics` in the Demo.

- [ ] **Step 2: Update `design-spec.md` display behavior**

Document that the mentions/channels row includes a right arrow, acts as one link, turns Booking blue on hover/focus, and opens an exact-phrase Slack search constrained to the displayed week.

- [ ] **Step 3: Run the complete test suite**

Run: `node --test tests/*.test.mjs`

Expected: all tests PASS with zero failures.

- [ ] **Step 4: Check formatting and placeholder links**

Run: `git diff --check && test "$(rg -o 'href="#"' draft-new-ia.html | wc -l | tr -d ' ')" = "0"`

Expected: exit code 0 with no output.

- [ ] **Step 5: Visually verify the Demo**

Open `draft-new-ia.html?page=latest`, hover and keyboard-focus the metadata link, cycle through all four topics, and confirm each URL contains its active exact phrase plus the Week 29 boundaries.
