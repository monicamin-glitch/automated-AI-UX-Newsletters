# Update Notes

## 2026-06-22

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
