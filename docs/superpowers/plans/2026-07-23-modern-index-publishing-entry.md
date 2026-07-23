# Modern Newsletter Publishing Entry Implementation Plan

> Execute this plan in the current branch, using tests before implementation and preserving the legacy page only as a migration fixture.

**Goal:** Make the reviewed modern newsletter the canonical `index.html`, migrate every production consumer to its markup, record the release, and push the verified result to `origin/main`.

**Architecture:** `index.html` becomes the only production website source. The former published page moves to `legacy-index.html` for migration regression tests only; `draft-new-ia.html` is removed. Media, week validation, weekly status, Slack-draft generation, documentation, and browser tests all consume the canonical modern entry.

**Tech stack:** Static HTML/CSS/JavaScript, Node.js ESM scripts, Node test runner, Chrome DevTools Protocol browser checks, Git.

---

## Task 1: Lock the canonical-entry contract with tests

**Files:**
- Modify: `tests/draft-new-ia-all-weeks.test.mjs`
- Modify: `tests/draft-new-ia-topic-module.test.mjs`
- Modify: `tests/draft-new-ia-resources.test.mjs`
- Create: `tests/publishing-entry.test.mjs`

- [x] Add assertions that the modern page is read from `index.html`, the historical page is read from `legacy-index.html`, and no production script or operational Markdown references `draft-new-ia.html`.
- [x] Update browser and media-test paths to `index.html`.
- [x] Run `node --test tests/publishing-entry.test.mjs` and confirm it fails before the entry files move.

## Task 2: Promote the modern page and preserve the legacy fixture

**Files:**
- Move: `index.html` → `legacy-index.html`
- Move: `draft-new-ia.html` → `index.html`

- [x] Perform the two lossless file moves.
- [x] Re-run the publishing-entry test and the three UI suites.
- [x] Confirm the modern latest week, All Weeks archive, Resource Hub, Slack modal, responsive layout, and media fallback logic remain present in canonical `index.html`.

## Task 3: Migrate weekly parsing and validation

**Files:**
- Modify: `scripts/slack-weekly-lib.mjs`
- Modify: `scripts/weekly-refresh-status.mjs`
- Modify: `scripts/validate-week-buckets.mjs`
- Create: `tests/weekly-modern-parsers.test.mjs`

- [x] Add failing parser tests for the modern latest-week heading, six Slack cards, ten external cards, complete Slack links, and external images.
- [x] Parse the active modern page through the first archive template boundary.
- [x] Derive the week ID and date range from the modern heading/current archive key.
- [x] Parse `.slack-card` metadata, summaries, sender, date, channel, link, and modal quote attributes.
- [x] Parse `.masonry-card` source/date, summaries, link, and image/fallback data.
- [x] Update status counts/range extraction for modern markup.
- [x] Update week-bucket validation for latest-card ISO dates and modern source dates while retaining checked-in archive validation.
- [x] Run parser tests, the status diagnostic, and week-bucket validation until all pass.

## Task 4: Point every publishing/media consumer to `index.html`

**Files:**
- Modify: `scripts/finalize-weekly-refresh.mjs`
- Modify: `scripts/materialize-archive-media.mjs`
- Modify: `digest.md`
- Modify: `media-strategy.md`

- [x] Change the finalizer media gate to `node scripts/prepare-media.mjs --html index.html --write-manifest`.
- [x] Change archive-media materialization to canonical `index.html`.
- [x] Replace operational `draft-new-ia.html` references in the workflow documentation.
- [x] Verify the finalizer still publishes `index.html` and that no production consumer reads `legacy-index.html`.

## Task 5: Record the merged release and canonical-entry migration

**Files:**
- Modify: `update-notes.md`

- [x] Add a dated 2026-07-23 release entry covering the GitHub Week 11 merge, Miro/media integration, Slack deduplication, held Dieter item pending complete original text, modern-entry promotion, and production-consumer migration.
- [x] Keep the note factual and distinguish repository publication from B.Pages/Slack publication.

## Task 6: Full verification and push

**Files:**
- Verify all changed files

- [x] Run `node --test tests/*.test.mjs`.
- [x] Run the real-browser regression command used by the project.
- [x] Run `node scripts/prepare-media.mjs --html index.html --no-strict`.
- [x] Run `node scripts/validate-week-buckets.mjs`.
- [x] Run the Slack weekly draft generator with `--skip-refresh-guard` to a temporary output and verify parsed counts/content.
- [x] Search production files to confirm there are no remaining `draft-new-ia.html` references and no production references to `legacy-index.html`.
- [x] Review `git diff`, commit the implementation and release note, and push `main` to `origin/main`.
- [x] Do not publish B.Pages and do not send Slack messages.
