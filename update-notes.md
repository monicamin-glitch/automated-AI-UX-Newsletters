# Update Notes

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
