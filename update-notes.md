# Update Notes

## 2026-10-12

### Weeks 39–41 publication approval

- User explicitly approved publishing the prepared 55-card catch-up batch and Week 39–40 source-original image refinements to the existing GitHub and Booking-only B.Pages destinations.
- This approval supersedes the local-only boundary recorded below. Public GitHub content remains summary-only; verified Slack originals remain confined to the Booking-only build. Google Docs, Slack notifications, and automation schedules are outside this publication scope.
- Publish only referenced batch assets and their provenance; preserve unrelated working-tree files and unreferenced fallback artwork. Publication outcome is recorded by the guarded finalizer and automation run memory.

### Week 39–40 Anthropic and OpenAI image re-audit

- Rechecked all 13 matching external cards against `media-strategy.md`, including original article HTML, embedded media, linked official product/developer pages, and actual image contents. Source-native media takes priority over generated fallbacks.
- Replaced five generated SVGs with locally cached originals: Week 39 Claude Opus 5.5 launch OG artwork; Week 40 Claude Sonnet 5.5 launch OG artwork, OpenAI Space/Pages collaboration visual, Dots task-activity visual, and plugin-extension surface diagram. Anthropic's OG alt metadata misleadingly said "Anthropic logo"; visual inspection confirmed item-specific launch artwork. These official OG images should not have been rejected on metadata alone.
- Retained two verified originals: Claude's plugin-submission interface and the page-specific Codex Cloud documentation OG image. No unrelated image, generic homepage logo, blocked-page screenshot, or third-party rehost was substituted.
- Six OpenAI cards still use explicit local conceptual fallbacks: Voice plugins, Sol/Luna, Flashcards, Privacy Center, Security History, and Meetings. The Sol/Luna launch page was readable through indexed text but direct HTML/browser access was challenged, preventing retrieval of its original artwork. Other checked pages exposed no suitable item-specific image; the Education newsletter's images depict different features. This is a retrieval limitation, not a claim that no original artwork exists.
- Recorded a per-card decision, source page, asset URL when available, and fallback reason in `assets/media-provenance-weeks39-40.json` and synchronized the two weekly checkpoints. Only five image paths and their alt text changed in `index.html`; all article text, destinations, dates, counts, other weeks, and UI remain unchanged. Superseded fallback files are retained but no longer referenced by these five cards.
- Fresh validation: media audit reports 190 cards, 152 OK, 38 warnings, and 0 errors (five fewer fallback warnings). All 23 week date buckets, local artifact build, and whitespace check pass. Desktop/mobile archive checks confirm all images load, dialogs work, and no overflow or runtime errors occur. Local changes only; nothing published.

### Weeks 39–41 catch-up batch (local preview; not published)

- Reconciled all three completed ISO weeks: Week 39 (September 21–27) has 6 internal + 11 external updates; Week 40 (September 28–October 4) has 6 internal + 12 external; Week 41 (October 5–11) has 8 internal + 12 external. Total: 55 cards, including 20 internal and 35 external.
- Added the missing Week 39 archive, expanded Week 40 by six external items and Week 41 by four, and corrected Latest Week Popular Topics to Week 41. Existing Week 40/41 selections were retained rather than duplicated. Earlier archives, Resources Hub, Learning Plan, CSS, navigation, and dialog behavior were preserved.
- This audit supersedes the October 10 claim that OpenAI and NN/g had no in-range Week 40 updates. The September 29 OpenAI release bundle and October 2 NN/g article were missed previously and are included now. Week 39 is now available locally; the earlier note about its missing published report remains a historical publication record.
- Audited all 15 configured Slack channels for each week. Selected exact dated parent messages, deduplicated cross-posts and bot rewrites, and excluded support questions, unshipped proposals, operational notices, and items without a concrete UX contribution. Reply/reaction counts reflect retrieval time, not historical week-end totals. Private parent text remains in the ignored Booking-only store with meeting credentials redacted; public dialogs contain labeled summaries only.

### External source coverage, by week

| Configured source | Week 39 | Week 40 | Week 41 |
| --- | --- | --- | --- |
| Anthropic / Claude | Included: Opus 5.5; plugin-building guide | Included: Sonnet 5.5 | Included: Haiku/credits; unintended actions; dashboards/motion; Google Workspace |
| OpenAI | Included: five items covering voice plugins, Sol/Luna, flashcards, privacy, security history | Included: five items covering Pages/Space, Dots, cloud environments, interactive plugins, Meetings | Included: intelligent UI, audio, composer |
| Figma | Included: vertical auto-layout wrap | Included: Motion, Community riffs, mobile collaboration | Included: Agent and multi-repository GitHub workflows |
| Google Stitch | No verified new UX-relevant update | No verified new UX-relevant update | No verified new UX-relevant update |
| Miro | No verified new UX-relevant update | Included: MCP adoption | Included: MCP update |
| Bolt | No new UX-relevant update | Acquisition checked; no released UX workflow | Marketing comparison checked; no released UX workflow |
| YouTube tutorials | Needs manual review: no exactly dated qualifying result verified | Needs manual review: no exactly dated qualifying result verified | Needs manual review: no exactly dated qualifying result verified |
| UX Collective / Medium Bootcamp | Needs manual review: archive/article access incomplete | Needs manual review: candidate dates/content not verified | Needs manual review: candidate dates/content not verified |
| Nielsen Norman Group | Included: PACED disclosure; AI-functionality study guide | Included: agentic-system fragility | Included: context libraries; assistant context |
| Lenny's Newsletter | Included: advanced evals | Included: Summit talk archive | No verified new UX-relevant item in accessible archive; feed unavailable |
| Google Design | Needs manual review: no verifiable in-window date | Needs manual review: no verifiable in-window date | Needs manual review: no verifiable in-window date |
| Google PAIR | No verified new UX-relevant update | No verified new UX-relevant update | No verified new UX-relevant update |

- Official dated release notes, article pages, archives, and date-bounded searches were used. Figma crawler restrictions were resolved through indexed releases and direct retrieval. Search and access limitations mean this is the verified curated set, not a claim of exhaustive internet coverage.
- OpenAI reached the configured five-items-per-source cap in Weeks 39 and 40. Week 40 candidates not promoted include GPT-6.1 Sol, plan changes, Sites editing/scheduling, app events, code review, profile/sign-in improvements, shopping, and document scanning. Related Pages/Space changes were grouped. No filler cards were added for inaccessible sources.
- Added 10 downloaded first-party/source-native images and 11 explicitly labeled conceptual SVG illustrations. Fallbacks were used where item-specific art was unavailable or direct image discovery was blocked. The Claude Workspace image is official article artwork, not a product screenshot.

### Publication boundary

- Fresh validation: all 23 weekly date buckets pass; media audit checks 190 external cards with 147 OK, 43 non-blocking fallback/aspect/size warnings, and 0 errors. Browser checks pass for Weeks 39, 40, and 41 at 1440px and 390px: expected card counts, all 35 current-batch images loaded, no horizontal overflow, functioning Slack dialogs, and no runtime errors. The HTML diff is exactly the four intended replacements; older archives and other pages remain byte-for-byte unchanged.
- Existing test-suite baseline and current version both report 50 passed, 26 failed, 1 skipped, with the same failing-test names. These include stale Week 30 expectations and legacy parser fixtures; no new failing test was introduced. Those unrelated tests were not rewritten. The dedicated current-batch browser checks, full date validation, artifact build, and diff whitespace check pass.
- Generated local public and Booking-only artifacts for review. No Git push, B.Pages deployment, Google Doc append, Slack message, or scheduling change is part of this approved batch.
- The existing failed publication status remains unchanged; it must not be interpreted as a successfully published batch. Review the three local editions before authorizing publication.

## 2026-10-10

### Week 40 weekly refresh

- Refreshed Latest Week to ISO Week 40 for September 28-October 4, 2026 and archived the former Week 38 latest report without deleting or renumbering earlier history. Week 39 has no published report and remains disabled in the calendar.
- Included six verified internal updates: two Design+AI Summit methods, the BUI-based Animation Kit, image-to-Lingo, the UX Writing GenAI workflow recap, and the Design AI success-story library. Stored exact parent-message metadata and Booking-only originals; redacted the Zoom passcode in the workflow recap.
- Included six verified external updates: Anthropic Claude Sonnet 5.5; Figma Motion, Community riffs, and mobile collaboration updates; Miro MCP adoption evidence; and the Lenny & Friends Summit talk archive. Every card uses checked-in local media under `assets/week40/`.

### Source coverage checklist

- Internal checked: `#ai-for-ux`, `#genai_engineering`, `#dev-china`, `#china-ai-sdlc`, `#mp-ai-engineering`, `#mp-tpch-ai-guild-weekly`, `#ai-studio-updates`, `#ai-gateway-updates`, `#design`, `#design-systems`, `#design-language`, `#ai-design-curriculum`, `#uxw-genai`, `#ai-uxers-of-fintech`, and `#conversational-ai-traveller-all-ux`. No watchlist channel was access-blocked.
- Internal skipped: no in-range messages in the China AI SDLC, MP AI Engineering, TPCH AI Guild, AI Studio, Design Language, Fintech, or Conversational AI channels; `#dev-china` was operational/non-UX; `#design-systems` was non-AI support; other `#genai_engineering` posts were support questions, unshipped proposals, backend operations, or external links without a completed internal UX artifact.
- External included: Anthropic / Claude, Figma, Miro, and Lenny's Newsletter.
- External checked and skipped as `no new UX-relevant update`: OpenAI, Google Stitch, Bolt, Nielsen Norman Group, YouTube workflow searches, UX Collective, Medium Design Bootcamp, Google Design, and Google PAIR. Bolt's in-range acquisition was company news without a concrete UX workflow change. Google Design surfaced a relevant article but no verifiable in-range publication date.
- External access notes: Figma's official release page was verified through its indexed release feed despite direct crawler restrictions; Lenny's archive and article pages were both checked. No filler cards were added.

## 2026-09-21

### Learning Plan maintenance

- Removed the cancelled Sep 18 `AI Product Sharing` session from the canonical Learning Plan source and rendered page.

## 2026-09-14

### Week 37 weekly refresh

- Refreshed Latest Week to `Week 37` for `Sep 7-Sep 13, 2026` and archived the former latest report as template `Week 36` without duplicating or deleting history.
- Expanded the completed Week 37 report to 17 verified cards: 9 internal Slack Spotlights and 8 external AI-and-UX updates, after the initial run proved too restrictive.
- Preserved Resources Hub, Learning Plan, navigation, archive picker, Slack detail-dialog behavior, responsive rules, and empty-filter hiding.

### Source coverage checklist

- Internal watchlist checked: `#ai-for-ux`, `#genai_engineering`, `#dev-china`, `#china-ai-workstream`, `#mp-ai-engineering`, `#mp-tpch-ai-guild-weekly`, `#ai-studio-updates`, `#ai-gateway-updates`, `#design`, `#design-systems`, `#design-language`, `#ai-design-curriculum`, `#uxw-genai`, `#ai-uxers-of-fintech`, and `#conversational-ai-traveller-all-ux`.
- Internal items included: AI Studio navigation and information-architecture redesign, ET MCP copy-tag search, Design AI Summit recording and slides, the craft-led Astra UX benchmark, the Media Library-to-Figma plugin proof of concept, the LPS Destination Performance Copilot UX/accessibility refresh, AI-powered booking-flow test automation, BReview's cross-functional Markdown review workflow, and the Trip Grouping human-evaluation tool.
- External sources checked: OpenAI, Anthropic, Figma, Google Design and PAIR, Miro, Bolt, Nielsen Norman Group, UX Collective, Lenny's Newsletter, Medium Design Bootcamp, and workflow-tutorial searches.
- External items included: OpenAI GPT-Live-1 for full-duplex voice interaction, Nielsen Norman Group's human-accountable AI editorial workflow, OpenAI's Agents API for durable agent experiences, UX Magazine's agentic-interface patterns, Eidos Design's product-design comparison of Claude Fable 5.1 and GPT-6 Astra, OpenAI's perspective on newly reachable work, 1Password's Codex operating model, and Cognition's evidence-led agent testing workflow.
- The expansion relaxed source breadth and the inclusion threshold for distinct workflow evidence, while preserving the exact date window, direct-link checks, UX-relevance requirement, deduplication, and no-filler rule.

### Validation and publication

- Verified the ISO week, exact date range, Slack authors, dates, reply counts, reactions, permalinks, full original-message dialogs, external publication dates, article links, local image fallbacks, archive uniqueness, responsive CSS, hidden empty filters, and guarded production build.
- Reused already checked-in, source-compatible media for all eight external cards so the no-GitHub-push B.Pages run could resolve every image through the existing public asset paths.
- Published the Booking-only artifact to the stable `AI UX Newsletter` destination at `https://bpages.booking.com/rbpQL/ai-ux-newsletter`.
- Created a new English Week 37 Slack Canvas and an attached English draft in `#china-ux-group-internal`; the draft was not sent or scheduled.
- Media validation completed with no errors. Existing archive warnings remain for generated title-card fallbacks, one unusually wide historical image, and one historical large image; no warning blocks publication.

## 2026-09-11

### Learning Plan page

- Added `Learning Plan` as the fourth top-navigation page with direct `?page=learning` routing.
- Added a manually curated September-and-August 2026 archive using a quiet month rail and independent responsive agenda cards instead of a table.
- Removed the page-level Learning Plan title, illustration, month dividers, and unavailable-action placeholders after visual review.
- Standardized video type copy to `Video Course` and consolidated all internal sessions under one green `Internal Sharing` badge; removed the DDP-specific variant.
- Added verified actions for Echo's PP Demand Page slides and both Obsidian + Claude Code sessions, with the two sessions intentionally sharing one YouTube recording.
- Added [`learning-plan.md`](learning-plan.md) as the single source of truth for manually maintained Learning Plan content, while routine weekly refreshes preserve the page unchanged.
- Added focused source and real-browser coverage for navigation, resource destinations, visual hierarchy, desktop/tablet/mobile geometry, and keyboard accessibility.
- Synchronized tab selection with the shareable `page` URL, browser Back/Forward state, and `aria-current`, and darkened small year/presenter text to meet the intended accessible contrast.
- Added a guarded `--learning` release mode that runs the focused source and real-browser tests and stages Learning Plan files without broadening the routine weekly staging scope.

## 2026-09-07

### Week 36 weekly refresh

- Refreshed Latest Week to `Week 36` for `Aug 31-Sep 6, 2026` and archived the former latest as template `Week 35` without deleting or renumbering history.
- Published 21 verified cards: 9 internal Slack Spotlights and 12 external AI-and-design updates, all within the completed Monday-Sunday window.
- Preserved the collaborator UI contract: top navigation, `AI × Design` with `Shanghai`, Latest Week topics, `.slack-card`, `.masonry-card`, calendar archives, shared detail dialog, All Weeks, and Resources Hub.

### Source coverage checklist

- Section A checked: Anthropic / Claude, OpenAI, Figma, Google Stitch, Miro, and Bolt.
- Section A included: Anthropic (`Claude Fable 5.1 and Mythos 5.1`); OpenAI (`GPT-6 Astra`, `Zendesk & OneNote Plugins`, named external sharing for ChatGPT Sites, and WebMCP website tools); Figma (generative plugin and interactive shader publishing); Miro (August Miroverse AI workflow templates); and Bolt (Visual Edits and its prompting workflow guide).
- Section A skipped: Google Stitch had no verified in-window official update. Figma's Sep 3 opacity-at-scale release was verified but skipped because it was not materially AI-related. OpenAI's sticker packs, lock-screen voice content, broader browser-extension support, pronunciation help, and Healthcare Public Data were verified but stayed below the UX-work relevance threshold or were too domain-specific.
- Section B checked: YouTube tutorial queries, UX Collective, and Medium Design Bootcamp.
- Section B included: UX Collective (`When the canvas starts acting, who’s really in control?`).
- Section B skipped: YouTube and Medium Design Bootcamp did not surface a verified in-window workflow artifact strong enough for inclusion.
- Section C checked: Nielsen Norman Group, Lenny's Newsletter, Google Design, and Google PAIR.
- Section C included: NN/g (`Using AI for UX Work: Study Guide`) and Lenny's Newsletter (`How to turn your AI into a world-class designer`).
- Section C skipped: Google Design and Google PAIR did not surface a fresh, dated in-window update.
- Section D checked: `#ai-for-ux`, `#genai_engineering`, `#dev-china`, `#china-ai-sdlc` (the active channel matching the configured China workstream), `#mp-ai-engineering`, `#mp-tpch-ai-guild-weekly`, `#ai-studio-updates`, `#ai-gateway-updates`, `#design`, `#design-systems`, `#design-language`, `#ai-design-curriculum`, `#uxw-genai`, `#ai-uxers-of-fintech`, and `#conversational-ai-traveller-all-ux`.
- Section D included: `#ai-for-ux` (UX AI Hub and /washup); `#agent-fabric` as the original source for the Google Docs MCP announcement forwarded into a watched channel; `#genai_engineering` (Fabric App 0.0.30, Project Lightning, and the EM Agentic Profile success story); `#design` (Page Builder workshop); `#ai-gateway-updates` (Google generative media models); and `#unlock-order-program-all` as the original source for the Unlock Knowledge Assistant forwarded into a watched channel.
- Section D skipped: `#dev-china` contained a China AI Workstream Bot digest and event material, but the digest rewrote other parents and was not treated as an original; `#china-ai-sdlc` contained planning and amplification rather than a completed UX artifact; `#mp-ai-engineering` contained operational review requests and open questions; `#design-systems` contained an unfinished AI-label discussion and a duplicate Page Builder share; `#uxw-genai` duplicated the UX AI Hub and included an operational model-setup workaround; `#ai-uxers-of-fintech` contained questions and lower-signal links; `#mp-tpch-ai-guild-weekly`, `#ai-studio-updates`, `#design-language`, `#ai-design-curriculum`, and `#conversational-ai-traveller-all-ux` had no qualifying in-window parent post.
- Stable internal reference sources checked: AI-UX Hub @ Fintech, UX AI Use Case Sharing, and Claude Code Case Study remained reference-only except where the new cross-UX UX AI Hub launch qualified as a current update.

### Validation notes

- Verified every included Slack card against its exact parent message, named author, timestamp, permalink, date, and reply count. Cross-posts and rewritten bot digests were deduplicated in favor of original parents.
- Stored verified parent text only in the Booking-only build path; public GitHub dialogs are generated as labeled newsletter summaries. No credentials or reply-thread secrets were included.
- Added checked-in media under `assets/week36/` for every external card. First-party article artwork is used where fetchable; the four OpenAI cards use distinct local branded fallbacks because automated OpenAI page fetches exposed no usable item media.
- The local source-access preflight returned warnings for YouTube, Figma, Anthropic, OpenAI, NN/g, Lenny, and Bolt in the restricted runtime. Dates and claims were therefore verified through authenticated web access, and first-party media was downloaded only from the verified article metadata where available.
- GitHub origin was fetched before editing and was already synchronized with local `main`; unrelated collaborator changes and untracked files were preserved.

### Known follow-ups

- The mandatory finalizer must still validate, commit, push, publish Booking-only B.Pages artifact `4de2388206`, enforce `Wang Zi` / `booking` / `Created by Monica Min · Wang Zi`, and notify review group `C0BJTN197PH` before this run is complete.

## 2026-08-31

### Week 35 weekly refresh

- Refreshed the latest website week to `Week 35` for `Aug 24-Aug 30, 2026` and archived the former latest week as template `Week 34` without deleting or renumbering earlier history.
- Rebuilt the latest set around 14 validated cards total, with 6 internal Slack Spotlights and 8 external updates that all belong to the completed Monday-Sunday window.
- Kept the collaborator UI contract unchanged: top navigation, `AI × Design` with `Shanghai`, the Latest Week topic module, `.slack-card`, `.masonry-card`, calendar archive templates, the shared detail dialog, All Weeks, and the Resources Hub.
- Added checked-in local media under `assets/week35/` for every external card and kept the Booking-only publish path ready to swap summary dialogs for verified Slack originals at artifact build time.

### Source coverage checklist

- Section A checked: Anthropic / Claude, OpenAI, Figma, Google Stitch, Miro, and Bolt.
- Section A included: Figma release notes (`Enterprise-managed authorization for MCP is now generally available`, `Open the agent chat panel in a new window`); OpenAI release notes (`Scheduled tasks can respond to app updates and be shared`, `ChatGPT Work can now complete tasks on signed-in websites`); Anthropic release notes (`Memory in Claude Cowork, editable topics, and a sensitive topics setting`); and Bolt blog (`Prompt queueing is live: queue your next idea while Bolt.new builds`).
- Section A skipped: Google Stitch had no fresh official Aug 24-Aug 30 update in the configured sources; Miro AI/blog and newsroom checks did not surface a stronger in-window UX-relevant update than the selected set.
- Section B checked: YouTube tutorial queries plus the configured Community sources.
- Section B included: none. No in-window workflow tutorial or community write-up was stronger than the selected official product updates and internal reusable artifacts.
- Section B skipped: YouTube did not surface a stronger completed Aug 24-Aug 30 workflow artifact; UX Collective and Medium Design Bootcamp did not produce a qualifying in-window AI x UX article worth publishing as a standalone card.
- Section C checked: Nielsen Norman Group, Lenny's Newsletter feed/archive, Google Design, and Google PAIR.
- Section C included: Nielsen Norman Group (`The Custodial Era of UX: Cleaning Up After AI`) because it is a dated in-window strategic read with direct implications for AI evaluation, quality control, and UX practice; and Lenny's Newsletter (`I spent $20,000 on Devin in a month. Here’s what I learned | Ryan Carson (solo founder)`) because it documents a concrete Devin / Claude / Codex workflow with direct frontend and design-spec implications.
- Section C skipped: Google Design and Google PAIR did not surface a fresh dated in-window library update.
- Section D checked: `#ai-for-ux`, `#genai_engineering`, `#dev-china`, `#china-ai-workstream`, `#mp-ai-engineering`, `#mp-tpch-ai-guild-weekly`, `#ai-studio-updates`, `#ai-gateway-updates`, `#design`, `#design-systems`, `#design-language`, `#ai-design-curriculum`, `#uxw-genai`, `#ai-uxers-of-fintech`, and `#conversational-ai-traveller-all-ux`.
- Section D included: `#ai-for-ux` the animation toolkit tester call and the Design AI Summit update; `#dev-china` the Cross-BU learning session deck and recording share; `#mp-ai-engineering` the meetup artifacts covering skills telemetry, architecture support, and `bctl`; `#ai-studio-updates` the Atlassian MCP retirement workaround for Flow Builder; and `#genai_engineering` the AI Tips notification launch.
- Section D skipped: `#genai_engineering`, `#china-ai-workstream`, `#mp-tpch-ai-guild-weekly`, `#ai-gateway-updates`, `#design`, `#design-systems`, `#design-language`, `#ai-design-curriculum`, `#uxw-genai`, `#ai-uxers-of-fintech`, and `#conversational-ai-traveller-all-ux` were audited but did not surface a stronger completed UX-relevant update than the selected cards; duplicate or older-context Design AI Summit mentions were deduplicated in favor of the Aug 26 `#ai-for-ux` update that included the registration-rule change and recording confirmation.
- Stable internal reference sources checked: AI-UX Hub @ Fintech, UX AI Use Case Sharing, and Claude Code Case Study remained reference-only for this run and were not published as standalone cards.

### Validation notes

- Verified the target refresh window as `Aug 24-Aug 30, 2026` because Monday, August 31, 2026 should publish the completed previous Monday-Sunday week per `digest.md`.
- Verified each included Slack card has a permalink, named author, exact parent-thread timestamp context, date, and reply count, and stored a Booking-only original-message excerpt in `automation-status/private-slack-originals.json` with credentials redacted where needed.
- Verified every latest external card uses checked-in local media under `assets/week35/` rather than runtime-only preview dependencies.
- Reconciled the authoritative draft JSON with the latest website so the structured card inventory and latest UI now describe the same 14-card Week 35 set.
- Updated the archive picker state so All Weeks opens on archived `Week 34` while still allowing `Week 35` to render from the live latest page.

### Known follow-ups

- The mandatory finalizer still needs to integrate newer remote commits safely, commit/push, publish the Booking-only B.Pages artifact `4de2388206`, update status, and notify review group `C0BJTN197PH` before this refresh can be treated as published.

## 2026-08-31 (follow-up)

### Media re-audit and source coverage check

- Re-audited every Week 35 external card against `media-strategy.md` after follow-up feedback about repeated first-version image issues.
- Replaced four generated Week 35 fallback visuals with checked-in first-party assets from the original source websites: Figma release-notes imagery for the MCP authorization and agent-chat cards, the NN/g article artwork for `The Custodial Era of UX`, Bolt's product visual for prompt queueing, and Anthropic's Help Center release-notes OG image.
- OpenAI remains the only Week 35 image-source exception. Rechecked the official release-notes URL plus the feature-specific Help Center pages for Scheduled Tasks and Cloud Browser, but direct CLI fetches still returned a Cloudflare challenge page instead of the article HTML or screenshots. The two OpenAI cards therefore remain on the local generated fallback until a source-native asset can be captured from an authenticated browser path.

### Missed-source re-audit

- Re-read the target week directly in `#ai-for-ux`, `#design`, and `#design-systems` for `Aug 24-Aug 30, 2026` instead of relying only on earlier search passes.
- `#ai-for-ux` did not surface a missed qualifying card beyond the two already published items: Flora Thiam's animation toolkit tester call and Matthew Pennell's Design AI Summit update with the recording confirmation in-thread.
- `#design` was rechecked and contained the same Design AI Summit cross-post already covered from `#ai-for-ux`, plus non-newsletter-eligible items such as a general Design Newsletter issue share, non-AI research recruitment, and non-AI platform/design updates. No additional Week 35 internal card cleared the Slack Spotlight eligibility rules.
- `#design-systems` was rechecked and did not surface a completed AI-related or UX-AI workflow artifact in the target window. The visible posts were component support, chart-pattern discussion, and illustration maintenance rather than a qualifying AI x UX update.
- Rechecked Lenny's Newsletter archive and `How I AI` feed for `Aug 24-Aug 30, 2026`. The visible Aug 25 career-planning post remained out of scope, but the Aug 24 Ryan Carson workflow episode qualified and was added because it documents a concrete Devin / Claude / Codex split that affects frontend and design-system work. Google Stitch, Miro, Google Design, and Google PAIR were also rechecked; none produced a stronger in-window UX-relevant update than the published Week 35 set.

## 2026-08-31 (question-driven correction)

### China workstream digest and OpenAI media follow-up

- Rechecked `#dev-china` specifically for `Aug 24-Aug 30, 2026` after the follow-up question about the China workstream bot and found the `China AI Workstream Bot` digest posted on `2026-08-24`.
- Audited that bot digest against `slack-spotlight.md` and kept it out of the published Week 35 cards on purpose: it repackaged earlier source threads such as Documentation Updater Agent, Fabric `v0.0.25`, the Atlassian/Sourcegraph MCP migration note, Arize observability, and Review Readiness. Per the internal rules, a rewritten digest is not treated as the original source and duplicate weekly signals should not be republished as a second Slack card.
- Replaced the Week 35 `Scheduled tasks can respond to app updates and be shared` fallback visual with the official OpenAI Help Center Scheduled Tasks product image at `assets/week35/02-openai-scheduled-tasks-official.webp`.
- Kept the separate Week 35 `ChatGPT Work can now complete tasks on signed-in websites` card on its local fallback for now. The official cloud-browser Help Center page did not expose a usable image through automation fetch, so the next better replacement would be a checked-in screenshot of the real OpenAI article page captured from a browser session rather than another generated image.

## 2026-08-31 (source recheck expansion)

### Added missed external and internal cards

- Added a new Week 35 external card from Lenny's Newsletter: `I spent $20,000 on Devin in a month. Here’s what I learned | Ryan Carson (solo founder)`, published `2026-08-24`, using checked-in source-native media at `assets/week35/07-lenny-ryan-carson.jpg`.
- Added a new Week 35 internal Slack Spotlight from `#genai_engineering`: `AI Tips Notifications Make Internal AI Discoveries Easier to Follow`, based on Deborah Davis-DeWitt's `2026-08-27` parent message announcing notification support for `tips.booking.com`.
- Rechecked Lenny's Newsletter more broadly than the archive list alone. The Aug 24 AI workflow item qualified; the Aug 25 career piece and other non-UX or non-in-window items stayed out.

## 2026-08-24

### Week 34 weekly refresh

- Refreshed the latest website week to `Week 34` for `Aug 17-Aug 23, 2026` and archived the former latest week as template `Week 33` without deleting or renumbering any earlier history.
- Corrected the initial Week 34 pass after a full source re-audit: the latest week now carries 17 validated cards total, with 9 internal Slack Spotlights and 8 external updates.
- Rechecked the image inventory against `media-strategy.md` and replaced the latest external set with checked-in `assets/week34/` media, including source-native Figma, Miro, OpenAI, and Lenny's Newsletter images plus a local fallback only where an item-specific official image was not cleanly exposed.
- Preserved the collaborator UI contract: top navigation, `AI × Design` with `Shanghai`, the Latest Week topic module, `.slack-card`, `.masonry-card`, the calendar archive, the shared detail dialog, All Weeks, and the Resources Hub.

### Source coverage checklist

- Section A checked: Anthropic / Claude, OpenAI, Figma, Google Stitch, Miro, and Bolt.
- Section A included: Figma blog (`Sightlines issue no.2`) plus the Aug 17 Figma release-note item (`Recommend the best resource for the job`); OpenAI blog (`Zero Data Retention`, `ChatGPT for Teens`, and `ChatGPT Ads expands across Europe`); and Miro blog (`Rebuilding Jobs to Be Done with AI`, `New Enterprise pricing`).
- Section A skipped: Anthropic had no stronger Aug 17-Aug 23 official product or workflow update in the configured sources; Google Stitch had no fresh official in-window update; Bolt had no qualifying in-window blog or changelog item.
- Section B checked: YouTube tutorial queries plus the configured Community sources.
- Section B included: none. No in-window workflow tutorial or community write-up was stronger than the selected official-source and internal artifacts.
- Section B skipped: YouTube did not surface a stronger completed Aug 17-Aug 23 reusable workflow artifact; the configured community sources did not produce a qualifying in-window AI x UX article worth publishing as a standalone card.
- Section C checked: Nielsen Norman Group, Lenny's Newsletter, Google Design, and Google PAIR.
- Section C included: Lenny's Newsletter (`Announcing Lenny's Jobs`) because the Aug 18 launch targets designers and product builders with embedded AI fit, interview, resume, coaching, and recommendation tools.
- Section C skipped: NN/g had no verified in-window item strong enough for this digest; Lenny's Aug 22 paid community roundup and Aug 23 enterprise-sales podcast did not clear the standalone AI x UX threshold; Google Design and Google PAIR did not surface a fresh dated in-window library update.
- Section D checked: `#ai-for-ux`, `#genai_engineering`, `#dev-china`, `#china-ai-sdlc`, `#mp-ai-engineering`, `#mp-tpch-ai-guild-weekly`, `#ai-studio-updates`, `#ai-gateway-updates`, `#design`, `#design-systems`, `#design-language`, `#ai-design-curriculum`, `#uxw-genai`, `#ai-uxers-of-fintech`, and `#conversational-ai-traveller-all-ux`.
- Section D included: `#ai-for-ux` Dieter evaluation testing and the agent loophole/proxy-metrics case study; `#ai-studio-updates` token streaming for Flow Builder; `#genai_engineering` Fabric App `v0.0.25`; `#genai_engineering` Documentation Updater Agent; `#genai_engineering` Review Readiness skill; `#uxw-genai` AI Guidelines for UX Writing; `#design` Design AI Summit workshop registration and helpdesk opening; and `#dev-china` the Arize observability SOP share.
- Section D skipped: `#ai-for-ux` Design AI Summit cross-posts were deduplicated against the selected `#design` parent, and its Claude system-prompts share pointed to an older official resource rather than an in-window release; `#china-ai-sdlc` was checked, but the strongest items were training amplification or reference material rather than a stronger completed UX-facing update; `#mp-ai-engineering` mainly contained MR review requests and open workflow questions; `#mp-tpch-ai-guild-weekly`, `#ai-gateway-updates`, `#design-language`, `#ai-design-curriculum`, `#ai-uxers-of-fintech`, and `#conversational-ai-traveller-all-ux` had no in-window posts in the target range; `#design-systems` had useful discussion, but the strongest AI-related posts were implementation support rather than a completed reusable artifact.
- Stable internal reference sources checked: AI-UX Hub @ Fintech, UX AI Use Case Sharing, and Claude Code Case Study remained reference-only for this run and were not published as standalone cards.

### Validation notes

- Verified the target refresh window as `Aug 17-Aug 23, 2026`, because Monday, August 24, 2026 should publish the completed previous Monday-Sunday week per `digest.md`.
- Verified each included Slack card has a permalink, named author, exact parent-message timestamp, reply count, verified original parent-message excerpt, and a public-safe visible summary.
- Verified every latest external card uses checked-in local media under `assets/week34/` rather than runtime-only preview dependencies.
- Reconciled the authoritative draft JSON with the corrected website so the structured card inventory, coverage checklist, and latest UI now describe the same 17-card Week 34 set.
- Added a publish-path fix so the finalizer stages current collaborator `src="assets/..."` media and generates a cleaner week-based commit message.

### Known follow-ups

- The guarded finalizer still needs to complete fetch integration with any newer remote GitHub commits, commit/push, B.Pages publish, status-file update, and Slack notification before this refresh can be treated as published.

## 2026-08-17

### Canonical definitions and scheduler alignment

- Replaced the retired sidebar/article-card documentation with the collaborator top-navigation, calendar-template, Slack-card, masonry-card, and Resources Hub contracts.
- Defined a two-artifact publish boundary: public GitHub receives summary-only Slack dialogs; Booking-only B.Pages receives verified parent messages from an ignored private store.
- Added `scripts/build-publish-artifacts.mjs` and wired the finalizer to generate `automation-status/bpages-index.html`, enforce B.Pages title `Wang Zi`, preserve access `booking`, use absolute GitHub Pages media, and sanitize the public artifact before staging.
- Updated date-bucket and media validators for the current collaborator markup.
- Aligned the Monday/Thursday 09:00 auth preflight, Monday 10:00 refresh, and Monday 11:30 Slack picker definitions and live automation prompts.
- Preserved the B.Pages website header contract: `AI × Design`, `Shanghai`, and far-right `Created by Monica Min · Wang Zi`.

### Week 33 weekly refresh

- Refreshed the latest website week to `Week 33` for `Aug 10-Aug 16, 2026` and archived the previous latest page as template `Week 32` without deleting any older archive templates.
- Added 14 validated Week 33 cards: 7 internal Slack Spotlights and 7 public product/design updates, with all public cards backed by checked-in `assets/week33/` media.
- Restored the complete 14-card Week 33 report on Aug 24 after the Week 34 archive step was found to have copied an outdated 8-card snapshot; the repair reinstates the six later verified additions and their final source-native media without changing Week 34 or older history.
- Kept the refresh scoped to the completed Monday-Sunday window from `digest.md` even though the pre-existing `Week 32` page already used the irregular range `Aug 4-Aug 10, 2026`.

### Source coverage checklist

- Section A checked: Anthropic / Claude, OpenAI, Figma, Google Stitch, Miro, and Bolt.
- Section A included: Figma release notes (`Community agent skills`, `Figma MCP for Weave tools`, `responsive text wrap`), OpenAI release notes (`Google Drive in Library`, `ChatGPT app experience updates`), and Bolt blog (`Dictation is live, Bolt.new is ready to listen`).
- Section A skipped: Anthropic had no fresh Aug 10-Aug 16 official product or release-note item after the Aug 6 skill/plugin scanning entry; Google Stitch had no fresh official in-window update in the configured sources; Miro had no new dated Aug 10-Aug 16 product or newsroom update stronger than the existing May and July archive coverage.
- Section B checked: YouTube tutorial queries, UX Collective newsletter, and Medium Design Bootcamp.
- Section B included: none. The in-window results were either absent, weakly sourced, or opinion-heavy compared with the stronger official-source product and internal workflow cards.
- Section B skipped: YouTube did not surface a stronger completed Aug 10-Aug 16 tutorial artifact than the selected internal recordings and official Figma/OpenAI updates; UX Collective and Medium Design Bootcamp did not surface a qualifying in-window AI/UX article worth publishing as a standalone card.
- Section C checked: Nielsen Norman Group, Lenny's Newsletter feed/archive, Google Design library, and Google PAIR.
- Section C included: Lenny's Newsletter (`OpenAI's Head of Design: This is the best time in history to be a designer`).
- Section C skipped: NN/g search and article/video checks did not surface a verified new Aug 10-Aug 16 item in the configured sources; the other Lenny Aug 11 candidate on startup storytelling remained below the AI x UX inclusion threshold; Google Design and Google PAIR did not surface a fresh dated in-window library update.
- Section D checked: `#ai-for-ux`, `#genai_engineering`, `#dev-china`, `#china-ai-workstream`, `#mp-ai-engineering`, `#mp-tpch-ai-guild-weekly`, `#ai-studio-updates`, `#ai-gateway-updates`, `#design`, `#design-systems`, `#design-language`, `#ai-design-curriculum`, `#uxw-genai`, `#ai-uxers-of-fintech`, and `#conversational-ai-traveller-all-ux`.
- Section D included: `#ai-studio-updates` unified evaluation for agents and inference configs; `#genai_engineering` Agent Fabric success stories; `#ai-design-curriculum` Session 9 and 10 recording release; `#mp-ai-engineering` meetup recording plus AIAP Skills deck; `#uxw-genai` a quantitative evaluation pipeline for AI-generated partner responses; `#design` the Aug 13 Design AI Summit programme announcement and branded event artifact; and `#design-systems` the Aug 14 BUI Figma Library update with new icons, traveler illustrations, and stronger table defaults.
- Section D skipped: `#ai-for-ux` was audited, but the strongest in-window post was a future summit announcement rather than a completed reusable artifact; `#dev-china` and `#china-ai-workstream` were checked, but the strongest digest-style items overlapped with already-selected original source posts or fell outside the strongest completed UX workflow threshold; `#mp-tpch-ai-guild-weekly`, `#ai-gateway-updates`, `#design-language`, `#ai-uxers-of-fintech`, and `#conversational-ai-traveller-all-ux` had no stronger completed in-window UX-facing AI update than the selected set.
- Stable internal reference sources checked: AI-UX Hub @ Fintech, UX AI Use Case Sharing, and Claude Code Case Study remained reference-only for this run and were not published as standalone cards.

### Validation notes

- Verified the target refresh window as `Aug 10-Aug 16, 2026` because Monday, August 17, 2026 should publish the completed previous Monday-Sunday week per `digest.md`.
- Verified each included Slack card has a permalink, a named author, an original quoted snippet, and a public-safe visible summary aligned to the source message.
- Verified each public card uses a checked-in local image under `assets/week33/` rather than a runtime preview dependency.
- Used the official Figma and OpenAI release-notes URLs because the relevant entries are present on those pages and no cleaner stable direct-entry URLs were surfaced during validation.
- Re-audited external rows after publication and corrected the week by adding three initially missed cards: OpenAI's Aug 14 app experience updates, Bolt's Aug 13 dictation launch, and Lenny's Aug 16 Ian Silber interview.
- Refined Week 33 external media after publication by replacing five generated fallback assets with source-native checked-in images from Figma release notes, Bolt, and Lenny's Newsletter; kept the OpenAI Aug 14 app-experience card on a generated fallback because the help-center release notes still did not expose a stronger item-specific hero.
- Re-audited the internal Slack sources after publication and added one missed Week 33 Slack Spotlight from `#uxw-genai`: Andrew Matthews' Aug 14 quantitative response-evaluation workflow for Partner AI.
- Re-checked `#design` and `#design-systems` after follow-up review: `#design-systems` surfaced Lena Zubareva's Aug 14 BUI Figma Library update; the `#design` Summit announcement was initially down-ranked as a future event, then included after editorial review confirmed its branded artifact, concrete programme, Figma workshop, participation modes, owner, and September 2 next action.
- Verified the new `#design` card against Nicole Winestock's Aug 13 parent announcement and attached `Design AI Summit - brand.png`; the website keeps the standard channel tile for internal cards per `media-strategy.md`, while the card links to the original Slack post and its attachment.
- Preserved the existing `Week 32` archive content exactly as it appeared before this run, even though its displayed range remains a pre-existing nonstandard bucket.

### Known follow-ups

- `Week 32` still shows the pre-existing irregular displayed range `Aug 4-Aug 10, 2026`; this run did not retcon the prior week because the request was to refresh the current target week only.
- The mandatory finalizer still needs to complete commit, push, B.Pages publish, status-file update, and Slack notification before this refresh can be treated as published.

## 2026-08-10

## 2026-08-12

### Three-week UI, content, and B.Pages handoff

- Published the collaborator UI with Week 30–32 content and the checked-in Week 30–32 media set.
- Kept public GitHub Slack dialogs summary-only while publishing verified original parent messages to the Booking-only B.Pages artifact.
- Finalized the B.Pages header as `AI × Design / Shanghai`, with `Created by Monica Min · Wang Zi` at the far right and the B.Pages shell title set to `Wang Zi`.
- Added the complete privacy boundary, final interaction decisions, publishing state, and next-update checklist in [`docs/handoffs/2026-08-12-three-week-ui-and-bpages-handoff.md`](docs/handoffs/2026-08-12-three-week-ui-and-bpages-handoff.md).

## 2026-07-27

### Week 30 manual refresh

- Refreshed Latest Week to `Week 30 - July 20 to 26, 2026` and archived the former Week 29 report without adding the popular-topic block to All Weeks.
- Added five verified Slack Spotlights with complete parent-message content for Structural Clarity, the Fabric MCP Gateway beta, the Design AI Summit, China GenAI upskilling, and Codex Lab.
- Extracted five internal community topics from observed weekly Slack search results and kept the existing local, non-navigating topic-card interaction.
- Added six external updates from Google Design, OpenAI, Bolt, and Figma; retained the unified card hierarchy, separate summary paragraphs, and Top 3 badges.
- Added checked-in Week 30 media, using official source-native previews where available and branded local fallbacks for OpenAI pages that did not expose a usable preview image.
- Audited the configured source list and skipped sources without a sufficiently strong, verifiable, in-window UX update rather than adding filler.
- Published the verified report as a new Booking-internal B.Pages artifact at `https://bpages.booking.com/rbpQL/ai-ux-newsletter-week30` without generating or sending a Slack picker.
- Kept Monica’s existing B.Pages artifact unchanged because B.Pages only allows its owner to replace that page in place.
- Replaced the over-compressed popular-topic banner with an 1800px publishing asset and kept it below 500 KB so the B.Pages version stays sharp without exceeding the bundle limit.
- Changed interactive Slack-card roots from semantic `article` elements to accessible button-like `div` elements, preserving the full-message dialog and `View in Slack` action.
- Added a page-local override for B.Pages’ injected `.bp-comment-icon` affordances so Slack and External card hover states do not reveal platform comment bubbles, without changing the viewer’s annotation preference on other B.Pages artifacts.

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
- Archived the previous latest Week 4 page while preserving Week 3, Week 2, and Week 1.
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

- 2026-09-21: Generated Week 38 (September 14–20), archived Week 37, refreshed internal Slack spotlights and popular topics, added eight verified external updates with local media, and prepared the stable B.Pages publication workflow.

## Week 41 refresh — October 5 to 11, 2026

- Target: ISO Week 41, Monday October 5 through Sunday October 11, 2026 (Asia/Shanghai). Archived Week 40 intact and promoted Week 41 to Latest Week. Resources Hub and Learning Plan preserved.
- Internal coverage: included 8 verified parents from #ai-for-ux, #uxw-genai, #genai_engineering, and #ai-studio-updates. Exact parents, authors, dates, permalinks, reactions, and reply counts were verified; public dialogs remain labeled newsletter summaries and Booking-only originals are stored separately.
- Checked with no included item: #dev-china, #china-ai-sdlc, #mp-ai-engineering, #mp-tpch-ai-guild-weekly, #ai-gateway-updates, #design, #design-systems, #design-language, #ai-uxers-of-fintech, and #conversational-ai-traveller-all-ux. #ai-design-curriculum was not discoverable through the authenticated public-channel lookup and is recorded as access blocked.
- Deduplicated/skipped: #design Figma MCP and Design+AI cross-posts (kept primary #ai-for-ux parents); semantic-layer discussion (no completed artifact); raw Haiku gateway notice (model-only); event reminders and speaker calls; maintenance, approval, support, and backend-only messages.
- External coverage checklist: Anthropic — included Haiku 5.5 with monthly API credits and the report on unintended agent actions; skipped the Cyber Verification Program and Usage Policy update as security/policy announcements without a stronger standalone UX-practice implication; OpenAI — included audio uploads, Intelligent UI, and Codex composer predictions; Figma — included agent general availability and multiple GitHub organizations; Google Stitch — no new verified update; Miro — included 19M MCP usage report; Bolt — no in-range update; YouTube — no stronger verified standalone workflow item; Community — no verified in-range item; Nielsen Norman Group — no in-range update; Lenny's Newsletter — archive showed no in-range entry; Google Design — the current Design Company of the Year page exposed no verifiable publication date and needs manual review; Google PAIR — no in-range update.
- Media: every external card uses a checked-in Week 41 asset. Source-native official images are used for both Figma cards, OpenAI audio, and Miro; deterministic local branded fallbacks are used for Intelligent UI, Codex composer predictions, and Claude API credits because those official pages exposed no suitable item-specific image.
- Google Docs delivery: the Week 41 append to the shared digest document was rejected by the connector as an unapproved disclosure of internal Slack-derived summaries. The write was not retried or bypassed; the website publication remains eligible because this delivery failure is isolated from fetch, validation, git, artifact-safety, and B.Pages gates.

## Week 43 refresh — October 19 to 25, 2026

- Target: ISO Week 43, Monday October 19 through Sunday October 25, 2026 (Asia/Shanghai). Archived Week 42 intact and promoted Week 43 to Latest Week. Resources Hub and Learning Plan preserved exactly.
- Internal coverage: audited all 15 configured channels and included 8 verified parent messages from #ai-for-ux, #genai_engineering, #dev-china, #ai-gateway-updates, and #claude_code (the original parent behind an #ai-for-ux forward). Exact parents, authors, dates, permalinks, reactions, and reply counts were checked; public dialogs are labeled newsletter summaries and Booking-only originals are stored separately.
- Included internal items: Codex Figma plugin/MCP enablement; Claude Code image inspection through the GenAI Gateway; Washup’s four project-memory skills; the Figma Claude Assistant MCP benchmark; Fabric as the consolidated skills home; the experimental `air` router with its governance discussion; seven AI Summit lead-up learning sessions; and controlled non-production evaluation of decision models.
- Slack source checklist: #ai-for-ux — included Figma plugin, Washup, and Figma MCP benchmark; #genai_engineering — included Fabric and `air`; #dev-china — included AI Summit lead-up sessions; #ai-gateway-updates — included decision-model evaluation; #china-ai-sdlc — checked, Project Lightning link was too thin for a standalone card; #ai-studio-updates — checked, Flow Builder deprecation was a forwarded notice without stronger original context; #design — checked, discussion was non-AI, speculative, or already represented; #design-systems — checked, questions and an unverified Gemini workaround did not constitute a completed artifact; #mp-ai-engineering — checked, no stronger qualifying parent; #mp-tpch-ai-guild-weekly, #design-language, #ai-design-curriculum, #uxw-genai, #ai-uxers-of-fintech, and #conversational-ai-traveller-all-ux — no qualifying in-range parent.
- Internal skips: the China AI Workstream Bot weekly digest rewrote earlier parents and was never treated as an original; cross-posts, event reminders without reusable artifacts, support questions, link-only shares, and incomplete experiments were excluded. The `air` card explicitly carries the contract, security, ownership, and GenAI-intake caveat raised in its 13-reply thread.
- External source checklist — Anthropic / Claude: included Claude Duet, Duet safety/privacy/security, and the Cowork/Chat enterprise integration; OpenAI: included Locked Chats and audited but skipped the Decisions API, profile sharing, and service-tier settings as less directly UX-relevant for this issue; Figma: included enterprise-admin controls and iPhone Duo/iPhone 18 frame presets; Google Stitch: no verified in-range update; Miro: October summary lacked an exact in-range day and needs manual review; Bolt: in-range marketing, comparison, and security material did not clear the direct UX-workflow threshold; YouTube: no exact-date workflow item could be verified and needs manual review; Community: included UX Collective’s “Nobody Feels Heard by a Report”; Medium’s “Designing for Doubt” had conflicting date signals and was skipped; Nielsen Norman Group: included the AI-in-UX practitioner survey; Lenny’s Newsletter: included the Claude Duet review and the Claude/FFmpeg/Whisper creator workflow; Google Design: “Illustrating the Gemini App” lacked a verified in-range publication date and was skipped; Google PAIR: no new in-range update.
- Media: all 10 latest external cards use checked-in local Week 43 assets. Seven use source-native article artwork; Locked Chats, Figma device frames, and the Claude Cowork/Chat enterprise integration use distinct local fallbacks because no clean item-specific source asset was available.
- Anthropic media follow-up: replaced the visually blank Cowork/Chat Open Graph PNG with a restrained generated illustration showing a unified conversation across mobile, desktop, cloud work, and finished artifacts. Anthropic's declared Open Graph endpoint returned only a flat background and the article exposed no relevant item-specific hero, matching the generated-fallback condition in `media-strategy.md`. Also corrected the card permalink to Anthropic's live canonical `/resources/articles/unified-claude-enterprise` URL and relabeled the image alt text so the fallback is never represented as official artwork.
- Archive and UI: preserved top navigation, AI × Design / Shanghai identity, Latest Week topic module, .slack-card and .masonry-card structures, shared detail dialog, calendar templates, All Weeks, Resources Hub, and Learning Plan. Week 42 was archived without deleting or renumbering history.
- Collaborator sync: fetched and fast-forwarded `main` through collaborator commits `6cf3f34` (Week 42 refresh) and `7d8467c` (October Learning Plan sessions) before editing, preserving both changes.
- Google Docs delivery: appended the approved Week 43 digest to the shared `Weekly AI & Design Digest` document and verified the inserted Week 43 heading in the target tab.
