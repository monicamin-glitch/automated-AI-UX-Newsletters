# Weekly AI & Design Digest

Generate a weekly digest of the latest AI and design news, filtered for UX relevance, and publish it as a website via GitHub.

## Who this is for

A UX design team that wants to stay current on AI tools (Claude, OpenAI, Figma, Google Stitch) and design thinking — without spending time manually searching. The digest is written for designers, not developers: every item explains **how it impacts UX work**, not just what it is.

## Usage

```
/digest
/digest figma          <- only Figma updates
/digest section-b      <- only Practical Workflows
/digest full           <- all sections (default)
```

## Instructions

Search the sources in [`sources.md`](sources.md) for content published in the **last 7 days**. For each item found:
- Write the **title** as a clickable markdown link to the original source URL
- Include the **source name** and **date**
- Write a **4-5 sentence UX impact description**: what changed, how it affects UX work, and why designers should care
- Assign **exactly one tag** from the allowed tag list below
- If no new content was found for a source this week, do not publish filler content; include the skipped source in the run summary coverage note

### When done, do these things:

1. Append the digest to the Google Doc: `https://docs.google.com/document/d/1H_Sec7iPUkGR9SyGg-iHieUNwsaS2P4PKrHVZiyn650/edit`

2. Update the `index.html` file following the **HTML Structure Rules** and **Weekly Archive Logic** below

3. Push the updated HTML to GitHub by running:
   ```
   cd "/Users/ymin/claude_project/UX AI newslettler/digest" && git add index.html && git commit -m "Digest: Week of [Monday's date]" && git push
   ```

---

## Fetch Rules

### Link priority
Always link to the **official source URL** (e.g. `anthropic.com/news/...`, `openai.com/blog/...`, `figma.com/release-notes/`). Use third-party sites (TechCrunch, TechRadar, etc.) only to discover what was released — never as the link destination.

### Search strategy
For each source, search the official URL first (e.g. `site:openai.com/blog`). If no results, broaden to general web. Always trace back to the original announcement.

For newsletter and Substack-style sources, check the RSS feed and archive page before using search snippets. For Lenny's Newsletter specifically, audit `https://www.lennysnewsletter.com/feed` and the archive for the target date range so "How I AI" episodes, community posts, and case studies are not missed.

### Items per source
Include all relevant items found per source, up to 5. Do not pick just 1 highlight — if a source published 3 relevant updates this week, include all 3.

### Source coverage audit
Before writing the digest, read every source row in `sources.md` and create a working coverage checklist for the exact week being updated. For each source row:
- Search the exact source locations listed in `sources.md` first.
- Search or filter the target week date range with the source name and product name.
- Check every relevant feed/archive entry whose published date falls inside that week, not only the newest item from that source.
- Mark the source as `included`, `no new UX-relevant update`, `access blocked`, or `needs manual review`.
- If an item is included, use the original/official URL whenever possible.
- If a source has no qualifying item, do not create filler content, but mention the skipped source in the run summary so the user can see coverage.

Do not silently skip defined sources. The final run summary should include a compact "Source coverage" note listing included sources and sources with no relevant update.

### Date bucketing
Every article card must live in the week that matches its published date.

- Confirm the card date falls inside the page hero date range before publishing.
- Do not use a post from a different week to satisfy source coverage for the current week.
- If an item has only a month-level date, verify the exact published day before placing it in a weekly archive. If the day cannot be verified, exclude it or mark it for manual review.
- When backfilling archives, audit each retained week independently instead of copying the latest-week results backward or forward.

### Link and summary validation
Before publishing or preserving a fetched item, verify that the URL and card content point to the same thing.

- Open or fetch every public `href` and confirm the page title, metadata, or visible page text matches the card title and summary.
- For YouTube links, verify the video ID resolves to the expected video title. Do not keep placeholder or unrelated video IDs.
- For Slack Spotlight cards, verify the Slack permalink opens the intended message or thread and that the card title/summary reflects the actual message.
- Prefer exact article/help/changelog URLs over generic landing pages. Use a generic release-notes page only when the relevant entry is present on that page and there is no stable direct anchor.
- If the page blocks automated fetch but search/browser validation confirms the page title and claims, mark it as manually validated in the run notes.
- If a URL cannot be validated or the summary describes different content, fix the URL or summary. If neither can be made reliable, remove the card instead of leaving a misleading archive item.

### Minimum content threshold
Each section must meet this minimum. If under threshold, search harder with different queries before giving up:
- **Section A:** At least 1 item per active source; skip a source only if truly nothing new
- **Section B:** At least 2 YouTube videos, 3 Medium/Community articles, and 2 newsletter items
- **Section C:** At least 2 sources represented with content
- **Section D:** Include Slack Spotlight items only when a valid Slack export/input is available

### Display rules
Use the article card formats below. Do not reintroduce old compact link-row cards; the current site uses standard article cards, YouTube video cards, and Slack Spotlight modal cards.

---

## HTML Structure Rules

The website uses a **two-column layout** with a sidebar and multi-page architecture.

### Website architecture
- Left sidebar with fixed navigation (auto-generated by JavaScript -- do NOT edit the sidebar HTML)
- Right content area with multiple "pages" switched via JavaScript
- The `page-latest` section always shows the current week
- Archive weeks are separate `<div class="page">` sections
- Past weeks remain stored inside `index.html` so the website can be revisited by week

### Weekly Archive Logic

The website is the archive. Every digest run must preserve previous fetched news so readers can revisit older weeks from the sidebar and the "Explore All" page.

For the current demo, week numbers are the May archive sequence, not calendar/ISO week numbers. Treat May 5-11, 2026 as `Week 1` / `week1`, May 12-18 as `Week 2` / `week2`, and May 19-25 as `Week 3` / `week3`. Do not reintroduce April fetched content or use calendar labels such as `Week 21` unless the user explicitly changes the demo scope.

1. **Never replace history with only the newest week.**
   - Do not delete existing `page-weekXX` archive sections.
   - Do not remove older article cards unless the user explicitly asks for cleanup.
   - Keep older Slack Spotlight cards and their modal data intact.

2. **Detect whether this is a new week or a rerun.**
   - If the Monday date for the new digest is the same as the current `page-latest` date range, update `page-latest` in place.
   - If the Monday date is newer than the current `page-latest`, archive the current `page-latest` before writing the new one.
   - If the target week already exists as `page-weekXX`, update that existing week instead of creating a duplicate.

3. **Archive the old latest week before creating the new latest week.**
   - Convert the old `page-latest` into a normal archive page.
   - Give it a unique ID like `id="page-weekXX"`.
   - Add `data-week="weekXX"`, `data-week-label="Week XX"`, and `data-week-date="Mon DD"`.
   - Remove `active` from its class list.
   - Change the hero to the archive format: label `Previously`, title `Week XX`, subtitle with the date range.

4. **Create the new latest week as the only active page.**
   - Keep `id="page-latest"` for the newest week only.
   - Set `data-week="weekXX"`, `data-week-label="Week XX"`, and `data-week-date="Mon DD"` so the archive and Explore All picker can read the week metadata.
   - Add `class="page active"`.
   - Use the latest hero format: label `New This Week`, title `Week XX — ✨ Fresh Picks`, subtitle with the date range.
   - Update the "All" filter chip count to the total number of cards in that latest week.

5. **Let JavaScript rebuild navigation and all-article views.**
   - Do not manually edit the sidebar archive links.
   - Do not manually edit the "Explore All" week picker or grid.
   - The existing JavaScript reads every `.page[data-week]` and generates archive navigation, week picker options, and all-article cards automatically.

6. **Keep week IDs stable.**
   - Do not renumber old weeks after they are published.
   - If a week label/date is wrong, correct that specific page's metadata without shifting other archive IDs.
   - For this May demo archive, keep using the sequential May week IDs (`week1`, `week2`, `week3`, etc.) instead of calendar week IDs.
   - Use the same `weekXX` value in the page ID, `data-week`, archive nav, and week picker.

### To add a new week's articles:

1. **Move the current "Latest" content to an archive page:**
   - Change `id="page-latest"` content into a new archive page
   - Give it an ID like `id="page-weekXX"` with attributes: `data-week="weekXX"` `data-week-label="Week XX"` `data-week-date="Mon DD"`
   - Remove the `class="active"` from it
   - Change hero to archive format (see below)

2. **Create new "Latest" content:**
   - Update the hero section with the new week number and date range
   - Update the `data-week="weekXX"`, `data-week-label="Week XX"`, and `data-week-date="Mon DD"` attributes on the `page-latest` div
   - Add article cards in the `articles-list` div
   - Update the "All" chip count to match total article count

3. **Do NOT edit:**
   - The sidebar HTML (it auto-generates from page data attributes)
   - The "All Articles" page (it auto-populates from all week pages via JavaScript)
   - The CSS styles
   - The JavaScript at the bottom

---

## Article Card Formats

### Standard article card:

```html
<a class="article-card" href="[URL]" target="_blank" rel="noopener noreferrer" data-tags="[tag]">
  <div class="article-card-image" data-section="[a|b|c|d]" data-label="[Source Name]" data-img="[optional direct image URL]"><div class="placeholder-icon"><svg viewBox="0 0 24 24" fill="none" stroke="[ICON_COLOR]" stroke-width="1.5">[SVG_PATH]</svg></div></div>
  <div class="article-card-body">
    <div class="article-card-tags"><span class="article-tag tag-[tag]">[Tag Display Name]</span></div>
    <h3 class="article-card-title">[Title]</h3>
    <p class="article-card-desc">[4-5 sentence UX impact description]</p>
    <div class="article-card-meta"><span>[Source Name]</span><span>[Date]</span></div>
  </div>
</a>
```

### YouTube video card:

Same as standard but with `data-yt-id` on the image div (enables thumbnail + play button):

```html
<a class="article-card" href="https://www.youtube.com/watch?v=[VIDEO_ID]" target="_blank" rel="noopener noreferrer" data-tags="[tag]">
  <div class="article-card-image" data-yt-id="[VIDEO_ID]"><div class="placeholder-icon"><svg viewBox="0 0 24 24" fill="none" stroke="[ICON_COLOR]" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg></div></div>
  <div class="article-card-body">
    ...same structure as standard...
  </div>
</a>
```

### Media requirements:

- Every `.article-card-image` must include `data-section` and `data-label`.
- Use `data-img` when you can identify a stable direct image or OG image URL during fetching.
- If only the article URL is known, the site will show a generated branded visual quickly, then upgrade to Microlink OG image or thum.io screenshot when those services return a usable image.
- Do not use old `.card-image` or `.link-thumb` selectors; the current site uses `.article-card-image` and generated `.article-grid-image` blocks.

### Slack Spotlight card:

Uses a `<div>` (not `<a>`) — clicking opens a modal, not a URL:

```html
<div class="article-card article-card--slack" data-tags="slack"
     data-slack-title="[Title]"
     data-slack-channel="[#channel-name]"
     data-slack-date="[Date]"
     data-slack-link="[Slack permalink URL]"
     data-slack-content="[Full HTML summary — HTML-encoded]">
  <div class="article-card-image" data-section="d" data-label="Slack"><div class="placeholder-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div></div>
  <div class="article-card-body">
    <div class="article-card-tags"><span class="article-tag tag-slack">Slack Spotlights</span></div>
    <h3 class="article-card-title">[Title]</h3>
    <p class="article-card-desc">[Short preview — auto-clamped to 5 lines by CSS]</p>
    <div class="article-card-meta"><span>[#channel-name]</span><span>[Date]</span></div>
  </div>
</div>
```

**Slack card rules:**
- No author attribution anywhere — only channel name and date
- `data-slack-link`: Slack permalink (`https://workspace.slack.com/archives/CHANNEL_ID/pTIMESTAMP`). If provided, the modal shows a "View in Slack" button. If unavailable, omit the attribute entirely.
- `data-slack-content`: Full summary as HTML-encoded string (`&lt;` `&gt;` `&amp;` `&quot;`)
- Inline links use `<a href="..." target="_blank">` tags
- Clicking the card opens a modal — it does NOT navigate to an external URL

---

## Tags

| Tag value (`data-tags`) | Display name (card + filter) | CSS class | Icon stroke color |
|---|---|---|---|
| `product` | Product Updates | `tag-product` | `#6366f1` (indigo) |
| `workflows` | Workflows | `tag-workflows` | `#0d9488` (teal) |
| `thinking` | Deeper Thinking | `tag-thinking` | `#7c3aed` (purple) |
| `slack` | Slack Spotlights | `tag-slack` | `#d97706` (amber) |

Each article gets exactly ONE tag. Tag display names must match the filter chip names exactly.

---

## Image attributes

The `data-section` and `data-label` attributes on `.article-card-image` control the fallback gradient:
- `data-section="a"` = blue gradient (product)
- `data-section="b"` = teal gradient (workflows)
- `data-section="c"` = purple gradient (thinking)
- `data-section="d"` = amber gradient (slack)
- `data-label="[Source Name]"` = text shown on the gradient

For YouTube cards, use `data-yt-id="[VIDEO_ID]"` instead of `data-section`/`data-label`. This loads the YouTube thumbnail with a play button overlay.

---

## Filters format:

```html
<div class="filters">
  <span class="filter-chip active" onclick="filterArticles('all', this)">All <span class="chip-count">[TOTAL]</span></span>
  <span class="filter-chip" onclick="filterArticles('product', this)">Product Updates</span>
  <span class="filter-chip" onclick="filterArticles('workflows', this)">Workflows</span>
  <span class="filter-chip" onclick="filterArticles('thinking', this)">Deeper Thinking</span>
  <span class="filter-chip" onclick="filterArticles('slack', this)">Slack Spotlights</span>
</div>
```

Include all 5 filter chips regardless — chips with no matching articles are auto-hidden by JavaScript.

---

## Hero sections

**Latest week:**
```html
<div class="hero"><div class="hero-content"><div class="hero-label">New This Week</div><h1 class="hero-title">Week XX — ✨ Fresh Picks</h1><p class="hero-subtitle">[Month DD] – [Month DD], [Year]</p></div></div>
```

**Archive week:**
```html
<div class="hero"><div class="hero-content"><div class="hero-label">Previously</div><h1 class="hero-title">Week XX</h1><p class="hero-subtitle">[Month DD] – [Month DD], [Year]</p></div></div>
```

---

## UX relevance filter

Only include items relevant to at least one of these:
- AI design tools (Figma, Stitch, Claude, OpenAI in design contexts)
- UX research methods or tools
- Design systems and component libraries
- Prototyping and design-to-dev handoff
- Product design strategy and career
- AI product design (designing AI-powered experiences)

Skip items about: finance, legal, hardware specs, unrelated industries.

---

## Related files

| File | Purpose |
|------|---------|
| [`sources.md`](sources.md) | What to search and where — add/remove sources here |
| [`media-strategy.md`](media-strategy.md) | How images and media are displayed on the website |
| [`design-spec.md`](design-spec.md) | Layout, navigation, and visual design decisions |
| `index.html` | The published website |
