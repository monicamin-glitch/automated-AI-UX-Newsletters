# Weekly AI & Design Digest

Generate a weekly digest of the latest AI and design news, filtered for UX relevance, and publish it as a website via GitHub.

## Who this is for

A UX design team that wants to stay current on AI tools (Claude, Gemini, Figma, Google Stitch) and design thinking — without spending time manually searching. The digest is written for designers, not developers: every item explains **how it impacts UX work**, not just what it is.

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

## Monday Auto-Refresh Logic

The newsletter website is intended to refresh once per week on Monday after the previous week is complete.

### Schedule

- Run the digest workflow every Monday.
- Use the user's local timezone unless another timezone is explicitly configured.
- Recommended run window: Monday morning after sources have had time to publish weekly recaps.
- A website refresh means: fetch sources, validate links and summaries, update `index.html`, preserve the archive, commit the changed files, and push to GitHub so the hosted site can redeploy.

### Target date range

- On each Monday run, generate the digest for the completed 7-day window that just ended, using the date-bucketing convention already established for the site.
- For a normal ongoing schedule, use the previous Monday-Sunday window and publish it on the following Monday.
- For the current May demo archive, keep the existing May week sequence and labels unless the user explicitly asks to switch to strict calendar weeks.
- Do not include new Monday items from the next week unless the user explicitly asks for a same-day breaking update.
- The page subtitle must show the exact covered range, e.g. `May 26 – Jun 1, 2026`.

### Refresh behavior

- If the target Monday date matches the current `page-latest` week, refresh that existing latest page in place.
- If the target Monday date is newer than the current `page-latest`, archive the current latest page first, then create a new `page-latest`.
- If the target week already exists as an archive page, update that archive page instead of creating a duplicate.
- If no validated UX-relevant updates are found after completing the source coverage audit, do not publish filler cards. Leave the current site as-is and record the no-update result in the run summary.

### Deployment requirements

- Include all changed website files in the commit, not only `index.html`. This can include `assets/`, `digest.md`, `sources.md`, `media-strategy.md`, `design-spec.md`, and `update-notes.md` when they were changed.
- The commit message should use the covered week, e.g. `Digest: Week of May 26`.
- After pushing, confirm the hosted site URL loads and that the latest page, archive navigation, Explore All view, links, and media render correctly.
- This markdown defines the workflow. A real unattended refresh still requires a scheduler such as Codex automation, GitHub Actions, Vercel cron, or another Monday job that runs these instructions.

### B.Pages publishing

The newsletter is also published on B.Pages for internal Booking access.

- URL: `https://bpages.booking.com/048eM/ai-ux-newsletter`
- Artifact ID: `4de2388206`
- Name: `ai-ux-newsletter`
- Access: `booking`
- Media: B.Pages loads prepared media from the GitHub Pages asset base to avoid the B.Pages artifact size limit while keeping media consistent with the GitHub/local prepared assets.
- Validate the latest week bucket before publishing:
  ```
  cd "/Users/ymin/claude_project/UX AI newslettler/digest" && node scripts/validate-week-buckets.mjs
  ```
- Push the latest `index.html` and `assets/` changes to GitHub first, then update the existing B.Pages artifact in place:
  ```
  /Users/ymin/.bpages/bin/bpages update 4de2388206 --content "/Users/ymin/claude_project/UX AI newslettler/digest/index.html"
  ```

This preserves the same B.Pages URL and access settings. Use `bpages login` first if the CLI asks for SSO authentication.

If a self-contained B.Pages artifact is needed later, create an optimized package first; uploading the full `assets/` folder can exceed B.Pages request-size limits.

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

For internal AI sources, apply the completion gate from `sources.md` before scoring: the item should be launched/released/available, packaged as a reusable artifact, piloted with learnings, attached to an owner or next step, or documented as a completed UX AI case. Then check for UX relevance. Do not include broad AI discussion, raw backend/platform notes, or model/version announcements unless there is a concrete UX workflow, product experience, research, prototyping, design-system, content, trust, or feasibility implication.

### Date bucketing
Every article card must live in the week that matches its published date.

- Confirm the card date falls inside the page hero date range before publishing.
- Do not use a post from a different week to satisfy source coverage for the current week.
- If an item has only a month-level date, verify the exact published day before placing it in a weekly archive. If the day cannot be verified, exclude it or mark it for manual review.
- When backfilling archives, audit each retained week independently instead of copying the latest-week results backward or forward.
- Before publishing the latest week, run `node scripts/validate-week-buckets.mjs`. This checks the latest page's hero date range against static cards and backfilled card arrays so next-week items cannot slip into the current Monday-Sunday digest.
- Use `node scripts/validate-week-buckets.mjs --all` only when intentionally auditing or cleaning historical archive pages.

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

Every visible card summary should be short and split into two audience-facing labels:
- `What is the update:` explains what changed, shipped, launched, became available, or was learned.
- `Why it's valuable for UXers:` explains the concrete value for designers, researchers, UX writers, design technologists, design-system teams, or UX-facing product work.

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
    <p class="article-card-desc">Update: [what changed]. UX value: [why UXers should care].</p>
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
     data-slack-author="[Real Slack profile name]"
     data-slack-quote="[Original message — cropped to highlights if long — HTML-encoded]"
     data-slack-content="[Rewritten summary for the card preview — HTML-encoded]">
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

**Content filter — AI relevance required:** Only include Slack messages that are directly related to AI and UX work. The message must be about one of:
- A new AI-powered tool, platform, or product (e.g. AI Page Builder, AI design assistants)
- A new AI skill, workflow, or integration for designers
- AI-related documentation, guidelines, or best practices
- AI community channels, events focused on AI in design
- Updates to how the team uses AI in their work
- AI tool operations that materially affect UX work, such as cost caps, usage budgets, credits, model-selection guidance, access/permission changes, governance rules, security constraints, approved tooling, usage dashboards, statusline/cost tracking, or setup requirements for Claude Code, Codex, Cursor, Figma AI, MCPs, or similar tools

For Slack threads, inspect the parent message and replies before deciding. A parent post that looks like policy, access, or cost management can qualify if the thread contains practical guidance that changes how UX teams plan, track, justify, or execute AI-assisted work. Summarize the practical UX implication, not only the administrative announcement.

Do NOT include messages about general design patterns, non-AI tools, or topics that happen to be discussed in AI-adjacent channels but are not themselves about AI. Pure admin FYIs, outages, or policy notes do not qualify unless they materially affect UX usage of AI tools or include a concrete workflow/action for designers.

**Internal AI source rules:** Treat internal AI sources as a prioritized lens within Slack Spotlight, not as a separate content section. Most weekly-refresh internal sources are Slack channels, so deduplicate them against the normal Slack Spotlight scan. Do not copy full internal posts into the public newsletter. Select only the items that are completed enough and useful to UX readers, then rewrite them as concise Slack Spotlight summaries.

Current internal AI sources to check are listed in `sources.md` and include China AI Workstream Bot, GenAI Engineering AI Weekly Digest, Marketplace TPCH AI Guild Weekly, AI for UX, AI Studio Updates, AI Gateway Updates, AI-UX Hub @ Fintech, UX AI Use Case Sharing, and Claude Code Case Study.

Use the internal AI lens this way:
- Weekly refresh Slack watchlist: China AI Workstream Bot, GenAI Engineering AI Weekly Digest, Marketplace TPCH AI Guild Weekly, AI for UX, AI Studio Updates, and AI Gateway Updates.
- Stable UX reference sources: AI-UX Hub @ Fintech, UX AI Use Case Sharing, and Claude Code Case Study.
- If the same Slack item appears in both the general Slack scan and the internal AI watchlist, publish it once as a Slack Spotlight card with the strongest source attribution and original Slack permalink.

Apply this completion gate before scoring:
- Shipped or available: launched, released, available now, rolled out, enabled, published, recorded, or open for sign-up.
- Reusable artifact exists: playbook, deck, recording, prompt, skill, profile, gem, MCP setup, Figma file, template, dashboard, demo, or source thread.
- Pilot has learning: early users, adoption notes, before/after workflow impact, feedback, evaluation results, or a known limitation.
- Clear owner or next action: team, owner, support channel, install step, workshop date, or concrete follow-up.
- UX case completed: a real UX/research/design workflow changed after AI, especially with measurable time saved, quality improvement, or reusable practice.

Include internal AI items with at least one completion signal and at least one of these UX-facing signals:
- Design workflow impact: AI skills, agents, profiles, plugins, prompts, or setup bundles that improve critique, prototyping, design QA, research synthesis, content generation, or handoff.
- Product experience relevance: changes that affect AI assistants, automation, recommendations, search, support, decisioning, or other user-facing AI experiences.
- UX research value: experiments, evaluations, adoption signals, user feedback, benchmarks, failure cases, or learnings about how people use or trust AI.
- Design-system or UI engineering relevance: component generation, accessibility checks, frontend coding agents, UI testing, BUI/design-system migration, or design-to-code workflows.
- Responsible AI and trust: privacy, data retention, explainability, compliance, hallucination risk, safety controls, model governance, or human-review implications.
- Hands-on opportunity: betas, demos, workshops, recordings, templates, playbooks, installable tools, or pilots UX readers can try.

For Drive-based internal sources, use a stricter publishing bar than Slack discovery. Drive docs and decks can enrich a Slack card or validate a trend, but should become standalone newsletter cards only when they are a completed UX AI case study, reusable playbook/template, workshop recording/deck, or shipped workflow artifact. General policy, experimentation, procurement, or governance documents should stay in the run notes unless they include a concrete UX-facing action, artifact, or case outcome readers can reuse.

Exclude or down-rank internal AI items that are backend-only, routine version/auth/dependency updates, raw model/version announcements, duplicate coverage, speculative ideas without evidence, or internal implementation details with no clear UX decision value.

Score internal AI candidates from 0-10 before publishing:
- 3 pts UX relevance
- 2 pts actionability
- 2 pts evidence
- 1 pt novelty
- 1 pt China/APAC or local team relevance
- 1 pt clarity

Publish 8-10 as a highlight-style Slack Spotlight card, 5-7 as a short Slack Spotlight card when useful, keep 3-4 for watchlist/run notes, and exclude 0-2.

For generated cards from internal digest/release sources, use the source name in `data-slack-author`, the source channel in `data-slack-channel`, and the original Slack permalink in `data-slack-link` when available. Use visible titles such as `[Source name] — [UX-facing takeaway]`. In `data-slack-quote`, state that the content is curated from the internal source and list only the selected UX-relevant signals. In `data-slack-content`, lead with why UX teams should care.

For Drive-based internal sources such as AI-UX Hub @ Fintech, UX AI Use Case Sharing, and Claude Code Case Study, use them to enrich or validate a Slack Spotlight card when possible. If a Drive item itself becomes the story, render it as a standard article card only when it can be safely summarized without exposing internal-only details.

**Data attributes:**
- `data-slack-author`: Real Slack profile name — fetched via Toolbox Slack MCP (`slack_slack_read_user_profile`)
- `data-slack-quote`: The **original Slack message** (cropped to key highlights if long). Must be the author's actual words, HTML-encoded. Fetched via `slack_slack_read_channel` or `slack_slack_read_thread` using channel_id and timestamp from the permalink URL.
- `data-slack-content`: Rewritten summary shown on the card in the list view (auto-clamped to 5 lines by CSS)
- `data-slack-link`: Slack permalink (`https://workspace.slack.com/archives/CHANNEL_ID/pTIMESTAMP`). If provided, the modal shows a "View in Slack" button. If unavailable, omit the attribute entirely.
- Clicking the card opens a modal showing the original message — it does NOT navigate to an external URL

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
  <span class="filter-chip" onclick="filterArticles('workflows', this)">Workflows</span>
  <span class="filter-chip" onclick="filterArticles('thinking', this)">Deeper Thinking</span>
  <span class="filter-chip" onclick="filterArticles('slack', this)">Slack Spotlights</span>
  <span class="filter-chip" onclick="filterArticles('product', this)">Product Updates</span>
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
- AI tool adoption operations that change UX practice, including cost management, access/governance, model selection, usage tracking, approved workflows, or setup constraints for AI tools used by designers, researchers, writers, or design-system teams

Skip items about: finance, legal, hardware specs, unrelated industries, unless the item directly changes how UX teams can use AI tools in their work.

---

## Related files

| File | Purpose |
|------|---------|
| [`sources.md`](sources.md) | What to search and where — add/remove sources here |
| [`media-strategy.md`](media-strategy.md) | How images and media are displayed on the website |
| [`design-spec.md`](design-spec.md) | Layout, navigation, and visual design decisions |
| `index.html` | The published website |
