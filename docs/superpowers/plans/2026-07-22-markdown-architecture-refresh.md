# Markdown Architecture Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the project Markdown documentation with the approved Latest Week, All Weeks, Internal Updates, External Updates, Popular Topics, and Resources Hub design.

**Architecture:** Keep orchestration in `digest.md`, presentation in `design-spec.md`, public source discovery in `sources.md`, Slack discovery and current-week internal output in `slack-spotlight.md`, and manually curated evergreen links in `resources-hub.md`. Preserve deployment and Slack publishing workflows while removing obsolete sidebar, Explore All, sequential demo-week, and duplicated Slack instructions.

**Tech Stack:** Markdown, YAML-shaped data examples, existing static HTML/CSS/JavaScript website workflow.

## Global Constraints

- Do not modify Markdown files inside any Skill directory.
- Do not modify the website demo or production HTML in this task.
- Keep Resource Hub maintenance manual; never auto-search or auto-add links.
- Use real ISO calendar week labels such as `Week 28` and `July 6 to 12, 2026`.
- Keep the two visible summary labels exactly `What is the update:` and `Why it's valuable for UXers:`.
- Do not commit or push changes.

---

### Task 1: Separate Slack content ownership

**Files:**
- Create: `slack-spotlight.md`
- Modify: `sources.md`

**Interfaces:**
- Consumes: existing Section D Slack source list and filtering rules.
- Produces: one authoritative Slack workflow and a public-only external source registry.

- [ ] **Step 1:** Create `slack-spotlight.md` with channel watchlist, scan order, eligibility, scoring, deduplication, popular-topic extraction, output schema, and current-week output rules.
- [ ] **Step 2:** Remove Section D and stable internal reference material from `sources.md`; add a pointer to `slack-spotlight.md`.
- [ ] **Step 3:** Verify Slack source and scoring rules appear only in `slack-spotlight.md`.

Run: `rg -n "Section D|Slack Spotlight AI Update Filter|popular_topics" sources.md slack-spotlight.md`

Expected: detailed Slack rules occur in `slack-spotlight.md`; `sources.md` contains only the pointer.

### Task 2: Create the manually curated Resources Hub source

**Files:**
- Create: `resources-hub.md`

**Interfaces:**
- Consumes: the approved three-category Resource Hub content from `draft-new-ia.html`.
- Produces: canonical resource IDs and category placements used by the Resources Hub page.

- [ ] **Step 1:** Define manual-maintenance and no-auto-discovery rules.
- [ ] **Step 2:** Define each URL once under canonical resources.
- [ ] **Step 3:** Reference resource IDs from the three approved categories, including the intentional repeated placement of `The UX AI Hub`.
- [ ] **Step 4:** Verify AI Page Builder, UX Home, Governance, Next.js starter kit, and removed learning links are absent.

Run: `rg -n "AI Page Builder|UX Home|Governance|Next.js|Generative AI for UX|Employee AI" resources-hub.md`

Expected: no matches.

### Task 3: Replace the obsolete visual specification

**Files:**
- Modify: `design-spec.md`

**Interfaces:**
- Consumes: approved layout and UI behavior in `draft-new-ia.html`.
- Produces: the authoritative presentation contract for all three pages.

- [ ] **Step 1:** Replace fixed-sidebar architecture with sticky top navigation and the three approved pages.
- [ ] **Step 2:** Document the unified blue token system, typography, week picker states, popular-topic card, Slack card metadata, external equal-height cards, and Resource Hub layout.
- [ ] **Step 3:** Add responsive and accessibility behavior.
- [ ] **Step 4:** Verify obsolete `Explore All`, amber Slack-card, and sequential archive language is absent.

Run: `rg -n "Fixed sidebar|Explore All|amber|May demo" design-spec.md`

Expected: no matches.

### Task 4: Slim and reroute the weekly digest workflow

**Files:**
- Modify: `digest.md`

**Interfaces:**
- Consumes: `sources.md`, `slack-spotlight.md`, `design-spec.md`, `media-strategy.md`, and conditionally `resources-hub.md`.
- Produces: current-week Internal Updates, External Updates, Popular Topics, All Weeks metadata, and a preserved Resources Hub.

- [ ] **Step 1:** Keep weekly scheduling, source validation, deployment, and archive preservation requirements.
- [ ] **Step 2:** Replace duplicated Slack details with an explicit call to `slack-spotlight.md`.
- [ ] **Step 3:** Replace sequential demo weeks and Explore All instructions with ISO week labels and the All Weeks calendar picker contract.
- [ ] **Step 4:** Make `resources-hub.md` conditional so routine weekly refreshes do not read or rewrite it.
- [ ] **Step 5:** Refresh the related-files table and current card output fields.

Run: `rg -n "May demo|Explore All|Week 1|Slack card rules" digest.md`

Expected: no obsolete workflow matches.

### Task 5: Align media guidance and record the migration

**Files:**
- Modify: `media-strategy.md`
- Modify: `update-notes.md`

**Interfaces:**
- Consumes: current external-card and popular-topic illustration design.
- Produces: current media rules and a dated architecture migration record.

- [ ] **Step 1:** Replace Explore All media terminology with Latest Week and All Weeks archive behavior.
- [ ] **Step 2:** Document the checked-in popular-topic banner and 80×80 Slack channel tile behavior.
- [ ] **Step 3:** Add a 2026-07-22 update note covering the new document ownership model.
- [ ] **Step 4:** Check all Markdown links and stale architecture terms.

Run: `rg -n "Explore All|fixed sidebar|Section D" *.md`

Expected: no stale architecture instructions except historical statements in `update-notes.md`.

### Task 6: Verify the documentation set

**Files:**
- Verify: `digest.md`
- Verify: `design-spec.md`
- Verify: `slack-spotlight.md`
- Verify: `resources-hub.md`
- Verify: `sources.md`
- Verify: `media-strategy.md`
- Verify: `slack-weekly-bot.md`
- Verify: `update-notes.md`

**Interfaces:**
- Consumes: all documentation changes from Tasks 1–5.
- Produces: a consistent, non-redundant Markdown architecture.

- [ ] **Step 1:** Confirm every relative Markdown link resolves.
- [ ] **Step 2:** Confirm removed Resource Hub links are absent and approved links are present once canonically.
- [ ] **Step 3:** Confirm no Skill Markdown changed.
- [ ] **Step 4:** Review `git diff --check` and the scoped diff.

Run: `git diff --check`

Expected: exit code 0 with no output.
