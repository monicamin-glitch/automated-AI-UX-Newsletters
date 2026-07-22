# Weekly AI & Design Digest

Generate the weekly Booking.com AI × Design report for UX teams and publish it as a website.

The report differentiates itself through Booking.com community activity first, followed by curated external industry news.

---

## Audience

UX designers, researchers, writers, design technologists, design-system teams, and UX-facing product partners who want to understand:

- what Booking.com colleagues are discussing and shipping with AI;
- which internal artifacts, recordings, tools, and practices are useful now;
- which external AI changes materially affect UX work.

## Usage

```text
/digest
/digest external      # refresh External Updates only
/digest internal      # refresh Internal Updates and Popular Topics only
/digest full          # refresh the complete selected week
/digest resources     # update Resources Hub only after explicit human edits
```

`full` is the default weekly mode.

---

## Document routing

Read only the documents needed for the requested operation.

| Operation | Required documents |
|---|---|
| Full weekly refresh | [`sources.md`](sources.md), [`slack-spotlight.md`](slack-spotlight.md), relevant rendering rules in [`design-spec.md`](design-spec.md), [`media-strategy.md`](media-strategy.md) |
| External Updates only | [`sources.md`](sources.md), external-card and media sections of [`design-spec.md`](design-spec.md) and [`media-strategy.md`](media-strategy.md) |
| Internal Updates / Popular Topics only | [`slack-spotlight.md`](slack-spotlight.md), relevant Slack and topic sections of [`design-spec.md`](design-spec.md) |
| Resources Hub change | [`resources-hub.md`](resources-hub.md), Resources Hub section of [`design-spec.md`](design-spec.md) |
| Slack channel share after website publication | [`slack-weekly-bot.md`](slack-weekly-bot.md) |

Do not read or rewrite [`resources-hub.md`](resources-hub.md) during a routine weekly refresh. It is manually curated and changes only after explicit human direction.

---

## Weekly output

Each completed weekly report contains, in order:

1. ISO week heading
2. “What colleagues are talking about this week?”
3. Internal Updates
4. External Updates

The All Weeks page renders the same complete report for the selected archived week. The Resources Hub is independent of the weekly archive.

## Calendar convention

Use real ISO calendar weeks with Monday–Sunday date ranges.

Canonical example:

```text
Week 28 - July 6 to 12, 2026
```

Stored week metadata must include:

```yaml
iso_year: 2026
iso_week: 28
start_date: 2026-07-06
end_date: 2026-07-12
display_week: Week 28
display_range: July 6 to 12, 2026
```

Do not use newsletter-sequence numbers, update-count subtitles, or labels such as `Week 10 — 14 updates`.

---

## Monday refresh workflow

Run every Monday after the previous Monday–Sunday week is complete, using the user’s local timezone unless another timezone is configured.

### 1. Determine the target week

- Select the completed ISO week that ended on Sunday.
- Do not include items from the new Monday unless the user explicitly requests a breaking update.
- If the target week already exists, refresh it in place instead of creating a duplicate.
- If it is newer than the current Latest Week, preserve the current report as an archive and promote the new report to Latest Week.
- Never delete older available weeks during a normal refresh.

### 2. Generate Internal Updates and Popular Topics

Run the complete workflow in [`slack-spotlight.md`](slack-spotlight.md).

Required results:

- up to ten ranked noun-phrase topics with mention and distinct-channel counts;
- selected Internal Update cards with category, channel, real author, date, reply count, permalink, update summary, and UX value;
- a coverage note listing checked channels, included items, skipped channels, blocked access, and manual-review cases.

Do not duplicate Slack channel lists, scoring rules, or extraction logic in this document.

### 3. Generate External Updates

Read every source row in [`sources.md`](sources.md) and create a coverage checklist for the exact week.

For each source:

- check the official location first;
- search or filter the exact date range;
- inspect every relevant in-range feed or archive entry, not only the latest entry;
- classify coverage as `included`, `no new UX-relevant update`, `access blocked`, or `needs manual review`;
- include all validated UX-relevant updates, up to five per source;
- do not create filler items.

### 4. Select External Top 3

Choose three editorial picks from the complete External Updates set. Rank them using:

1. impact on UX work;
2. novelty or scope of the change;
3. actionability for UX teams;
4. evidence quality;
5. relevance to current internal conversations.

The first three cards receive badges. They remain in the same External Updates grid as every other article.

### 5. Prepare and validate media

Follow [`media-strategy.md`](media-strategy.md) and run:

```bash
node scripts/prepare-media.mjs --write-manifest
```

Every External Update must resolve to a checked-in local image before publication. Internal Slack cards use the channel tile defined in [`design-spec.md`](design-spec.md), not an external article image.

### 6. Update website content

Update the published HTML while preserving the approved structure and visual rules in [`design-spec.md`](design-spec.md).

- Update Latest Week when the target is new.
- Update the matching archive when rerunning an existing week.
- Derive `availableArchiveWeeks` from every stored report, then add or update the target week in that stored-report set.
- Every historical report remains in `availableArchiveWeeks` during refresh.
- Never replace `availableArchiveWeeks` with only the two newest weeks.
- Keep unavailable calendar weeks disabled.
- Render Popular Topics, Internal Updates, and External Updates in the selected archive report.
- Preserve the Resources Hub exactly as-is unless the run mode is `resources` and a human has supplied explicit changes.

### 7. Append the written digest

Append the approved digest to:

`https://docs.google.com/document/d/1H_Sec7iPUkGR9SyGg-iHieUNwsaS2P4PKrHVZiyn650/edit`

### 8. Finalize and publish

Run the guarded finalizer:

```bash
cd "/Users/ymin/claude_project/UX AI newslettler/digest" && node scripts/finalize-weekly-refresh.mjs --commit --push --publish-bpages --notify
```

The finalizer must validate date buckets, summaries, media, Slack links, Git scope, B.Pages publication, and status output before the Slack picker may run.

If finalization fails:

- write `status: "failed"` to `automation-status/weekly-refresh-status.json`;
- do not run the Slack picker;
- report the failure and the specific blocking validation.

---

## External-content rules

### Link priority

Use the official source URL. Third-party articles may help discovery but should not replace the original announcement when one exists.

For newsletters and Substack-style sources, check RSS and archive pages before relying on search snippets. For Lenny’s Newsletter, check both:

- `https://www.lennysnewsletter.com/feed`
- `https://www.lennysnewsletter.com/archive`

### Date bucketing

- Confirm the publication date falls inside the selected Monday–Sunday range.
- Do not move an item into a different week to satisfy source coverage.
- Verify an exact day when a source exposes only month-level information; otherwise exclude or flag for manual review.
- Audit each archive independently when backfilling.
- Keep stable ISO year/week IDs after publication.

Before publishing, run the finalizer or at minimum:

```bash
node scripts/validate-week-buckets.mjs
```

Use `--all` only for an intentional historical audit.

### Link and summary validation

- Open every public URL and verify that the title, date, source, and visible content match the card.
- Verify YouTube IDs and titles.
- Prefer stable article or changelog URLs over generic landing pages.
- Mark blocked-but-manually-confirmed pages in run notes.
- Remove an item when neither its URL nor summary can be made reliable.

### UX relevance

Include an item only when it affects at least one of:

- AI design tools or AI product design;
- UX research, synthesis, or evaluation;
- UX writing and content design;
- design systems, accessibility, or UI engineering;
- prototyping and design-to-development handoff;
- AI trust, safety, explainability, or governance;
- product-design strategy and AI adoption;
- operational changes that materially affect how UXers use AI tools.

### External-card fields

```yaml
- title: Exact source title
  source: Source name
  published_date: YYYY-MM-DD
  url: https://official-source.example/article
  image: assets/weekXX/example.ext
  top_pick_rank: 1 # optional, 1–3 only
  what_is_the_update: What changed, shipped, launched, or was learned.
  why_valuable_for_uxers: The concrete implication for UX work.
```

Visible summaries always use two separate paragraphs:

- **What is the update:** …
- **Why it’s valuable for UXers:** …

Do not collapse them into one paragraph.

---

## Archive behavior

The website remains the historical archive.

- Latest Week is the newest successfully published ISO week.
- All Weeks exposes every stored report through the month calendar for each year containing data.
- Only years containing at least one report appear.
- Previous and next year buttons stay disabled when no adjacent archive year exists.
- Weeks without reports remain disabled.
- Selecting an available week renders that report without duplicating its heading.
- Current week and selected week states follow [`design-spec.md`](design-spec.md).
- Do not renumber historical weeks.

If a previously published date range is wrong, correct only that week’s metadata and content.

---

## Resources Hub behavior

[`resources-hub.md`](resources-hub.md) is the sole content source for the Resources Hub.

- It is manually curated and occasionally updated.
- It is not a source-discovery list.
- A weekly refresh must not search for, add, remove, rename, or reorder resources.
- When a person requests a Resource Hub change, update the canonical resource once and keep category placements as ID references.
- Validate that every link opens in a safe new tab.

---

## Deployment

### GitHub and hosted website

- Include all website files changed by the refresh, including relevant assets and documentation.
- Use the ISO week in the commit message, for example `Digest: Week 28 (July 6–12, 2026)`.
- Confirm Latest Week, All Weeks, Resources Hub, links, images, filters, and calendar states after deployment.

### B.Pages

- URL: `https://bpages.booking.com/048eM/ai-ux-newsletter`
- Artifact ID: `4de2388206`
- Name: `ai-ux-newsletter`
- Access: `booking`

The guarded finalizer is the preferred publication path. For an explicitly approved emergency manual publication, update the existing artifact rather than creating a new one:

```bash
/Users/ymin/.bpages/bin/bpages update 4de2388206 --content "/Users/ymin/claude_project/UX AI newslettler/digest/index.html"
```

Use `bpages login` if SSO authentication is required.

---

## Run summary

Every successful or blocked run ends with:

- target ISO week and exact date range;
- Internal Updates coverage;
- Popular Topics extraction status;
- External source coverage;
- included and skipped sources;
- validation and media status;
- archive action: updated existing week or created new Latest Week;
- Resources Hub status: `preserved` unless explicitly changed;
- publication status for GitHub and B.Pages;
- Slack picker handoff status.

---

## Related files

| File | Purpose |
|---|---|
| [`sources.md`](sources.md) | Public External Updates sources and coverage rules |
| [`slack-spotlight.md`](slack-spotlight.md) | Slack channels, filtering, scoring, Popular Topics, and Internal Update fields |
| [`resources-hub.md`](resources-hub.md) | Manually curated Resource Hub content |
| [`design-spec.md`](design-spec.md) | Approved page structure, components, visual system, and interactions |
| [`media-strategy.md`](media-strategy.md) | External images, popular-topic illustration, and media verification |
| [`slack-weekly-bot.md`](slack-weekly-bot.md) | Human-approved Slack distribution after website publication |
| [`update-notes.md`](update-notes.md) | Change history and migration notes |
| `index.html` | Published website |
