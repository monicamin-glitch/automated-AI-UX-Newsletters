# Update Notes

## 2026-07-23

### GitHub merge and canonical modern publishing entry

- Merged the latest GitHub Week 11 work with the reviewed local Latest Week / All Weeks / Resources Hub experience, preserving the modern information architecture and interaction design.
- Added the unique Miro shared-canvas article and reused the stronger checked-in Week 11 Figma, Miro, Bolt, and OpenAI media in the current External Updates layout.
- Deduplicated overlapping Agent Fabric, Skills MCP, and AI for UX Session 4 Slack items in favour of the local cards with complete verified parent messages.
- Held the GitHub Dieter Slack item out of the merged report because its complete parent message was not available; it can be added after the original is fetched and stored under the Slack Spotlight rules.
- Promoted the reviewed modern website to the canonical `index.html`; retained the former published page as `legacy-index.html` only for historical migration regression tests and removed the obsolete draft entry.
- Migrated media preparation, archive materialization, date-bucket validation, weekly status, Slack candidate generation, browser tests, and operational documentation to the canonical modern entry.
- Updated the Slack parser for modern `.slack-card` and `.masonry-card` structures, including current-week metadata, summaries, links, dates, and checked-in images.
- This repository release updates GitHub only. It does not publish B.Pages and does not send a Slack newsletter.

### Calendar archive contract refresh

- Replaced the superseded W01–W53 archive button-grid rule with the approved Monday–Sunday month calendar, whole-row selection, disabled unavailable rows, and dimmed cross-month dates.
- Updated the archive trigger hierarchy to `Week 29` with `July 13 to 19, 2026` as the supporting range.
- Required refreshes to derive `availableArchiveWeeks` from every stored report and prohibited reducing the archive to only the two newest weeks.
- Corrected the historical migration to bucket each dated record by its real 2026 ISO week instead of treating a legacy page as authoritative membership; undated W28 records remain in their source container under an explicit no-invented-date policy.
- Derived archive years and the current-week indicator from report keys and an injectable clock, leaving Week 30 disabled but current on July 23, 2026.
- Unified Latest Week and All Weeks Slack hot zones, sanitized dialog content through a structural allowlist, added the mobile bottom sheet and scroll restoration, and added `Read article` to every archived external card without changing destinations.
- Polished shared cards with 16px Slack and External titles, inline `View in Slack ↗` metadata actions, and left-aligned External actions separated from summaries by 8px.
- Added a 36×36 Slack author avatar with safe profile-image support and deterministic initials fallback; combined date and reply count into one compact supporting line while keeping reactions beneath it.
- Raised newsletter reading copy to the approved 14px scale and supporting metadata to 12px while retaining Apple System throughout.
- Re-fetched every Slack parent message represented in Latest Week and All Weeks so all 63 detail dialogs show verified original content rather than card summaries; stored the six current-week originals in `slack-spotlight.md` for the next refresh.

## 2026-07-22

### Markdown architecture aligned with the latest website design

- Replaced the old fixed-sidebar / Explore All documentation with the approved top navigation: Latest Week, All Weeks, and Resources Hub.
- Standardized the archive on real ISO calendar weeks and Monday–Sunday date ranges, including the `Week 28` / `July 6 to 12, 2026` hierarchy.
- Documented the current page order: week heading, “What colleagues are talking about this week?”, Internal Updates, and External Updates.
- Documented the illustrated top-ten topic card, the 80×80 Slack channel tiles, unified metadata line, separate summary paragraphs, equal-height External Update cards, Top 3 badges, and All Weeks calendar states.

### Responsibility split

- Added `slack-spotlight.md` as the single source of truth for Slack channels, eligibility, scoring, deduplication, Popular Topic extraction, Internal Update fields, and replaceable current-week output.
- Added `resources-hub.md` as the manually curated source of truth for the Booking.com UX AI Knowledge Hub.
- Reduced `sources.md` to public External Update sources only.
- Slimmed `digest.md` into the weekly orchestrator and added conditional document routing so routine refreshes do not read or rewrite the Resource Hub.
- Updated `media-strategy.md` for the full-width Popular Topic illustration, UI-native Slack tiles, checked-in External Update media, and All Weeks reuse.
- Updated `slack-weekly-bot.md` to consume the separated internal and external outputs while excluding evergreen resources from the weekly picker.

### Resource Hub content

- Preserved the approved three-category hierarchy: UX AI Foundations, Workflow / playbooks / use cases, and AI tools / prototyping / setup.
- Added canonical resource IDs so repeated category placement does not duplicate URLs.
- Kept Dieter in AI tools / prototyping / setup and kept AI Page Builder removed.
- Recorded that Resource Hub links are human-curated and must never be searched for or added automatically.

### Scope

- No Skill-directory Markdown was changed.
- No website HTML, CSS, JavaScript, or content assets were changed in this documentation migration.

## 2026-07-20

### Week 11 weekly refresh from GitHub

- Refreshed the legacy website to `Week 11` for `Jul 14-Jul 20, 2026` and archived the previous latest page as `Week 10`.
- Added 8 validated Week 11 cards: 1 workflow, 1 deeper-thinking article, 4 Slack Spotlights, and 2 product updates.
- Added checked-in media under `assets/week11/` for Figma code-backed screens, the Miro shared-canvas article, OpenAI desktop updates, and Bolt Slides.
- Covered Figma, Miro, OpenAI, Bolt, `#ai-for-ux`, `#dieter`, and `#genai_engineering`; the source audit skipped lower-signal or duplicate items instead of adding filler.
- Recorded Agent Fabric, Skills MCP, AI for UX Session 4, and the Dieter connector guide as the strongest internal signals.
- Added a retryable Fetch → Build → Publish workflow proposal with JSON checkpoints between phases.

### Integration into the current layout

- Preserved the current Latest Week / All Weeks / Resources Hub architecture instead of restoring the superseded legacy layout.
- Reused the higher-quality Week 11 Figma, Miro, Bolt, and OpenAI images in the current External Update cards.
- Added the unique Miro article to the current External Updates grid; the other three GitHub External cards already existed in the current report.
- Did not duplicate Agent Fabric, Skills MCP, or Session 4 because the current cards already contain fuller verified Slack originals.
- Kept the GitHub Dieter card out of the current Slack list until its complete parent message can be fetched and stored according to `slack-spotlight.md`.
- Adapted the checkpoint workflow into `digest.md` without duplicating Slack extraction rules, source lists, or Resource Hub content.

## 2026-07-13

### Week 10 weekly refresh

- Refreshed the latest website week to `Week 10` for `Jul 7-Jul 13, 2026` and archived the previous latest page as `Week 9` without changing older archive weeks.
- Added 14 validated Week 10 cards with Product Updates kept last in the weekly ordering: 2 workflows, 3 deeper-thinking reads, 6 Slack Spotlights, and 3 product updates.
- Added checked-in public media under `assets/week10/` for all new public cards so the latest week can pass the local-media gate before publishing.

### Source coverage checklist

- Section A checked: Anthropic / Claude, OpenAI, Figma, Google Stitch, Miro, Bolt.
- Section A included: Anthropic release notes (Cowork on web/mobile + Microsoft 365 write tools), OpenAI release notes (ChatGPT Work, Sites, unified desktop app), Figma Blog (GPT-5.6 in Figma Make), Bolt Blog (custom software with AI workflow).
- Section A skipped: Google Stitch had no fresh Jul 7-Jul 13 official update found in the configured sources; Miro AI/newsroom had no new Jul 7-Jul 13 release/update in the configured sources; Figma release notes had no new in-window release-note entry beyond blog coverage.
- Section B checked: YouTube tutorial queries, UX Collective newsletter, Medium Design Bootcamp, Figma Blog workflow/case-study posts.
- Section B included: Figma Blog case study on Decagon using AI for design-system saturation.
- Section B skipped: YouTube, UX Collective, and Medium Design Bootcamp did not surface a stronger in-window UX-relevant item than the Figma case study.
- Section C checked: Nielsen Norman Group, Lenny's Newsletter archive/feed, Google Design library, Google PAIR.
- Section C included: NN/g's design-system maturity framework and site-specific AI chatbot qualities, plus Lenny's Newsletter's 2026 tech-worker sentiment survey as a people-and-culture signal for AI adoption in UX teams.
- Section C skipped: Google Design library returned no fresh library result in the configured source; PAIR surfaced no dated in-window update in the configured source.
- Section D checked: `#ai-for-ux`, `#genai_engineering`, `#dev-china`, `#mp-ai-engineering`, `#mp-tpch-ai-guild-weekly`, `#ai-studio-updates`, `#ai-gateway-updates`, `#design`, `#design-systems`, `#design-language`, `#ai-design-curriculum`, `#uxw-genai`, `#ai-uxers-of-fintech`, and `#conversational-ai-traveller-all-ux`.
- Section D included: `#design` Claude Assistant / Dieter release and Figma Make prompting cheatsheet, `#genai_engineering` Sourcegraph Official MCP rollout, `#ai-studio-updates` row-level PII guardrail feedback, `#ai-design-curriculum` Session 8 videos/transcripts, and `#ai-for-ux` Session 3 model/agent landscape recording.
- Section D skipped: `#dev-china` weekly digest because the strongest items duplicated direct source coverage and other Slack signals; `#china-ai-workstream` had deck-review and video-share traffic but no standalone completed UX update; `#ai-gateway-updates` GPT-5.6 availability because the public OpenAI/Figma coverage plus other Slack items gave a cleaner week; `#mp-ai-engineering` meetup invite because it was still pre-event and the other posts were skill-review or external-reading signals; `#mp-tpch-ai-guild-weekly`, `#design-language`, and `#conversational-ai-traveller-all-ux` had no in-window messages; `#design-systems`, `#uxw-genai`, and `#ai-uxers-of-fintech` had in-window traffic but no qualifying completed UX-relevant AI update.
- Stable internal reference sources checked: AI-UX Hub @ Fintech, UX AI Use Case Sharing, Claude Code Case Study were treated as reference-only for this run and not published as standalone cards.

### Validation notes

- Verified the target week range as `Jul 7-Jul 13, 2026`, which is newer than the previous latest `Week 9` range `Jun 30-Jul 6, 2026`, so the flow archives Week 9 and creates Week 10 as the only active latest page.
- Verified each included Slack card has a permalink, real author name, original-message quote, and public-safe summary.
- Verified every new public card uses a checked-in local image under `assets/week10/`.
- Rechecked Lenny's Newsletter on request and added the Jul 7 workforce-sentiment survey as a Deeper Thinking card, using checked-in Substack OG media.
- Completed a second Slack-only audit across all defined Section D channels before Slack picker handoff and added two missed reusable artifacts: the Figma Make prompting cheatsheet from `#design` and the AI for UX Session 3 recording from `#ai-for-ux`.
- Media retry: compared Week 10 against Weeks 9 and 8 and found Week 10 originally used generated SVG title cards for all seven public cards, unlike prior weeks that used mostly source-native PNG/JPG media.
- Replaced five Week 10 SVG fallback visuals with source-native checked-in media from Figma, Bolt, and NN/g, and updated their card links to exact article permalinks.
- Added a media validator warning for generated SVG title cards so future runs distinguish acceptable local fallback media from preferred source-native public-card media.

### Known follow-ups

- Claude and OpenAI release-note cards still use generated SVG fallback media because the accessible release-note pages expose generic/support-page media rather than item-specific source-native visuals.
- The mandatory finalizer must be rerun after this media retry so GitHub, B.Pages, and `automation-status/weekly-refresh-status.json` reflect the updated media state.

## 2026-07-06

### Automation pipeline hardening

- Added `scripts/finalize-weekly-refresh.mjs` to validate media, date buckets, summary labels, Slack links, Git diff cleanliness, optional commit/push, B.Pages publishing, and refresh status writing in one final gate.
- Added `scripts/check-weekly-refresh-ready.mjs` and wired `scripts/generate-slack-weekly-draft.mjs` to refuse picker generation unless the latest website refresh is marked `published`.
- Added `scripts/process-slack-weekly-selection.mjs` so Monica's picker reply format can be applied directly to the weekly Slack draft.
- Added optional Slack status notification support for refresh success/failure and ignored generated `automation-status/` files.
- Updated `digest.md` and `slack-weekly-bot.md` so the website refresh and Slack picker automations use a gated handoff instead of two independent time-based jobs.

### Week 9 manual refresh

- Manually refreshed the latest digest for Jun 30-Jul 6, 2026 after the scheduled Monday automation blocked on source-fetch network approval.
- Added Week 9 public updates from Anthropic, Lenny's Newsletter / How I AI, and Nielsen Norman Group.
- Added validated Slack Spotlight updates from #ai-for-ux, #dev-china, #ai-gateway-updates, and #mp-ai-engineering, including China AI Workstream Bot's weekly digest.
- Archived the prior Week 8 latest page unchanged and kept Product Updates last.
- Prepared local media assets for Week 9 so B.Pages can display the public-card images consistently.

## 2026-07-03

### Week 8 date-bucket repair

- Restored the latest Week 8 page range to Jun 23-Jun 29, 2026.
- Removed Jun 30 and Jul 1 items from Week 8 so they can be considered for the next weekly update published on Jul 6.
- Added `scripts/validate-week-buckets.mjs` and documented it in `digest.md` as a pre-publish guard for the latest week.
- Verified the repaired latest week has 16 cards and no Jun 30/Jul 1 items.

## 2026-07-01

### Internal AI source merge

- Merged the internal AI weekly-refresh sources into the active Slack Spotlight source category instead of keeping a separate Internal AI tab/category.
- Added priority Slack sources, stable UX reference sources, completion gates, include/exclude signals, scoring rules, and summary-format rules to `sources.md` and `digest.md`.
- Updated the website so all cards render with `What is the update:` and `Why it's valuable for UXers:` labels, and Slack cards show source attribution plus original-message links.
- Updated `design-spec.md` to document the labeled card summaries and Slack source rows.

## 2026-06-29

### Week 8 manual refresh

- Refreshed the latest website week for Jun 23-Jun 29, 2026 and rebuilt Week 8 with 12 validated cards.
- Added official source updates from Figma Config 2026, Anthropic Claude Tag / Claude release notes, OpenAI ChatGPT and Codex release notes, and Lenny's Newsletter.
- Added validated Slack Spotlight items for AI for UX prompt training, Quest Signal beta, scheduled agents, Claude Assistant skill integration, and the Figma + Claude Config watch party.
- Preserved collaborator updates already on GitHub, including the Week 7 Vercel Connect card and related update notes.
- Removed the previous local Jun 18 Claude draft card from Week 8 because it fell outside the Jun 23-Jun 29 date bucket.
- Fixed the existing Week 4 archive chip count so its filter count matches the actual number of cards.
- OpenAI Help Center links returned 403 to command-line fetch but were manually validated via browser-accessible release notes.

## 2026-06-22

### Slack Spotlight modal redesign

- Redesigned Slack card modals to show real author names with avatar initials instead of generic icons.
- Added highlighted original messages as blockquotes inside the modal, preserving the author's full words.
- Updated `design-spec.md`, `digest.md`, `sources.md`, and `index.html` to support the new modal structure.
- Added content filtering rules so only AI-related Slack discussions qualify for Spotlight cards.

### Vercel Connect card

- Added a Vercel Connect card to the Week 7 Product Updates section (total cards now 15).

### Slack fetch rules

- Refined `digest.md` Slack Spotlight rules so future runs include AI tool operations that materially affect UX work: cost caps, usage budgets, model-selection guidance, access/governance, approved tooling, usage dashboards, statusline/cost tracking, and setup constraints.
- Added a thread-review rule: parent posts that look like policy, cost, or access updates can qualify when replies contain practical guidance that changes how UX teams plan, track, justify, or execute AI-assisted work.
- Updated `sources.md` Section D goal to include operational changes, not only shared resources and discussions.

### Week 7 Slack backfill

- Rechecked all Slack source channels defined in `sources.md` for Jun 16-Jun 22, 2026 after the Slack connector was refreshed.
- Added five validated AI/UX Slack Spotlight cards to Week 7: Figma comments MCP, Claude prototype collaboration models, Claude Code cost-management/governance, AI fundamentals for UX prompting, and AI-assisted Android XML-to-BUI Compose migration.
- Checked but skipped sources without a qualifying AI/UX update for this week: #design-systems, #design-language, #ai-design-curriculum, #uxw-genai, and #ai-uxers-of-fintech.
- Corrected the Slack backfill after review to include Claude Code governance and cost-tracking guidance from #ai-for-ux, because usage caps and session-cost visibility directly affect AI prototyping planning for UX teams.
- Kept Product Updates last by relying on the existing weekly and Explore All tab-order sorting: Workflows, Deeper Thinking, Slack Spotlights, then Product Updates.

### GitHub sync

- Integrated collaborator commits `a813cab` and `fd2b111` before publishing local changes, preserving the Week 7 latest digest and Slack Spotlight modal updates.
- Published the remaining local updates on top of the remote work: Monday auto-refresh rules, Week 5 archive preservation, update notes, and Product Updates-last ordering for weekly card lists and Explore All.
- Known follow-up: newer archive weeks still need the media fallback fix or checked-in `data-img` assets to avoid the paid thum.io placeholder image.
- Fixed archive navigation to show all archived weeks instead of capping the sidebar at five items, so Week 1 remains reachable after Week 7 is added.

## 2026-06-12

### Local iteration

- Added `digest.md` Monday auto-refresh logic so future runs know how to fetch, archive, validate, and deploy the weekly site update.
- Updated the filter-chip generation rule so `Product Updates` displays last after `All`, `Workflows`, `Deeper Thinking`, and `Slack Spotlights`.
- Added Week 5 as the latest digest for Jun 2-Jun 8, 2026.
- Archived the previous latest week as Week 4 while preserving Week 3, Week 2, and Week 1.
- Kept the June refresh scoped to the completed Jun 2-Jun 8 window; Jun 9+ updates belong to the following week.

### Manual Jun 9-Jun 12 source refresh

- Added Week 6 as an in-progress manual refresh covering Jun 9-Jun 12, 2026, with 17 validated cards.
- Archived the prior latest Week 5 page while preserving Week 4, Week 3, Week 2, and Week 1.
- Included sources with qualifying updates: Anthropic / Claude, OpenAI, Figma, Cursor, GitHub Copilot, Vercel, Sidebar, Addy Osmani, Lenny's Newsletter, and Slack #design.
- No qualifying Jun 9-Jun 12 UX-relevant update found or validated for: Google Stitch, Vercel v0, Bolt, Framer, Uizard, Google NotebookLM, Google Gemini, YouTube, X/Twitter, Dense Discovery, AI Design Feeds, UX Collective, Medium Design Bootcamp, Nielsen Norman Group, Brad Frost, Google Design, Pinterest Engineering, Airbnb Design, Spotify Design, #design-systems, and #design-language.
- Slack Spotlight cards were based on read-only validation from #design threads for AI slide-deck workflows and the AI Page Builder workshop.
- Updated weekly card lists and the Explore All display order to keep each week grouped together while following the tab sequence within that week: Workflows, Deeper Thinking, Slack Spotlights, then Product Updates last.

## 2026-06-01

### Digest workflow and source rules

- Expanded `sources.md` with additional active sources: Cursor, Vercel v0, Bolt, Framer, Uizard, GitHub Copilot, Google NotebookLM, and Google Gemini.
- Updated `digest.md` to require source coverage audits, official-source links, weekly date bucketing, link/summary validation, and no filler content for sources without relevant updates.
- Documented the May demo week sequence: Week 1 is May 5-11, Week 2 is May 12-18, Week 3 is May 19-25, and Week 4 is May 26-Jun 1.
- Added archive rules so older weeks remain available in the site and Explore All view.

### Media strategy

- Reworked `media-strategy.md` around the current `.article-card-image` and generated `.article-grid-image` system.
- Added a priority order for visuals: local `data-img`, YouTube thumbnails, Microlink OG images, thum.io screenshots, then generated branded visuals.
- Added guidance to prefer checked-in local media assets for published/latest weeks to avoid blank cards from rate limits or blocked external preview services.

### Website updates

- Added persistent weekly archive logic to `index.html`, with Week 1, Week 2, Week 3, and Week 4 available by week.
- Added the Week 4 digest for May 26-Jun 1, 2026 with 13 validated cards and local media under `assets/week4/`.
- Archived the previous latest week as Week 3 and kept Week 1 and Week 2 intact.
- Updated Explore All so it rebuilds the week picker and grid from all weekly pages.
- Added `rel="noopener noreferrer"` handling for external links.

### Content and media fixes

- Renamed the Google Design card to match the visible page title `Simulating Intelligence`.
- Repaired Week 3 missing media by adding local images for Lenny's Newsletter, Google Stitch, Cursor, NN/g, Google Design, and Slack Spotlight cards.
- Hardened the image loader so direct `data-img` assets render eagerly and do not wait on external preview services.

### Validation performed

- Verified Week 4 latest page in headless Chrome: 13 cards and 13 rendered images.
- Verified Explore All Week 4 in headless Chrome: 13 cards and 13 rendered images.
- Verified archive navigation shows Week 3, Week 2, and Week 1.
- Verified `git diff --check` passes.
