# External Read Action Hover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep External Update `Read article` actions visually stable across card hover, direct hover, and keyboard focus.

**Architecture:** Adjust the existing single-file CSS so External actions no longer share Slack’s blue-tint hover selector. Protect the distinction with static regression tests and document the finalized interaction in the existing design specification.

**Tech Stack:** HTML, CSS, Node.js built-in test runner, headless Chrome runtime test.

## Global Constraints

- `Read article` keeps its default `var(--primary)` text color.
- Card hover, direct hover, and focus-visible do not change its color or add a tinted background.
- The External arrow’s subtle movement may remain.
- Slack `View in Slack` hover and focus treatment remains unchanged.
- Latest Week and All Weeks share the same External card CSS.

---

### Task 1: Stabilize the External action hover state

**Files:**
- Modify: `draft-new-ia.html:177-182`
- Modify: `design-spec.md:269-278`
- Test: `tests/draft-new-ia-all-weeks.test.mjs:918-939`

**Interfaces:**
- Consumes: `.masonry-card-action`, `.masonry-card:hover`, `.view-in-slack:hover`, and `.view-in-slack:focus-visible`.
- Produces: A stable External action state and an unchanged Slack action hover state.

- [ ] **Step 1: Write the failing regression test**

Replace the shared hover assertion with:

```js
test('keeps External Read article styling stable during hover and focus', () => {
  assert.match(
    html,
    /\.masonry-card:hover \.masonry-card-action, \.masonry-card-action:hover, \.masonry-card-action:focus-visible \{[^}]*color: var\(--primary\);[^}]*background: transparent/
  );
  assert.match(
    html,
    /\.view-in-slack:hover, \.view-in-slack:focus-visible \{[^}]*color: var\(--primary-dark\);[^}]*background: var\(--primary-tint\)/
  );
  assert.doesNotMatch(
    html,
    /\.masonry-card:hover \.masonry-card-action, \.view-in-slack:hover/
  );
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test --test-name-pattern='External Read article styling' tests/draft-new-ia-all-weeks.test.mjs
```

Expected: failure because External and Slack actions currently share the blue-tint hover rule.

- [ ] **Step 3: Separate the CSS states**

Use:

```css
.masonry-card:hover .masonry-card-action,
.masonry-card-action:hover,
.masonry-card-action:focus-visible {
  color: var(--primary);
  background: transparent;
  outline: none;
}

.view-in-slack:hover,
.view-in-slack:focus-visible {
  color: var(--primary-dark);
  background: var(--primary-tint);
  outline: none;
}
```

Keep `.masonry-card:hover .masonry-card-action svg` unchanged.

- [ ] **Step 4: Update the design specification**

Document that `Read article` stays primary blue without a tinted hover/focus background, while Slack keeps its separate interactive treatment.

- [ ] **Step 5: Run focused and complete verification**

Run:

```bash
node --test --test-name-pattern='External Read article styling' tests/draft-new-ia-all-weeks.test.mjs
node --test tests/*.test.mjs
RUN_BROWSER_TESTS=1 node --test --test-name-pattern='browser runtime' tests/draft-new-ia-all-weeks.test.mjs
```

Expected: focused test passes; all static tests pass with the opt-in browser test skipped in the normal suite; the explicit browser test passes.

- [ ] **Step 6: Commit**

```bash
git add draft-new-ia.html design-spec.md tests/draft-new-ia-all-weeks.test.mjs
git commit -m "fix: stabilize external article action hover"
```
