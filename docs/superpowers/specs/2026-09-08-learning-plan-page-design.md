# Learning Plan Page Design

**Status:** Approved for implementation  
**Date:** September 8, 2026  
**Project:** AI × Design Weekly

## Goal

Add a static Learning Plan page to the existing newsletter website so Design CN colleagues can scan the current and previous months' planned learning sessions in one place. The newest month appears first, and older months continue below it on the same page.

## Scope

The first version contains the September 2026 and August 2026 plans supplied in the reference images. Content is maintained manually in the website source. It does not fetch calendar data, generate recommendations, track attendance, or manage registrations.

The August plan retains the July 28 kickoff entry because it belongs to the supplied August learning-plan schedule.

## Information architecture

Add a fourth top-level navigation item after Resources Hub:

1. Latest Week
2. All Weeks
3. Resources Hub
4. Learning Plan

The visible tab label is **Learning Plan**. The corresponding page identifier is `learning`, and the page supports direct loading with `?page=learning` using the site's existing query-parameter routing.

No existing newsletter, archive, or resource content changes as part of this feature.

## Page structure

The page follows an agenda-style archive inspired by the earlier Google Calendar agenda view.

1. Page heading: `Learning Plan`
2. Supporting text: `Design CN monthly learning archive`
3. September 2026 month group
4. August 2026 month group

Each month group uses two desktop columns:

- A narrow left rail containing the month and year
- A wider right column containing the month's learning rows

The month rail is the visual anchor, not a separate card or illustrated banner. Month groups are separated with neutral rules and spacing. The page does not repeat a large hero image for every month.

## Learning rows

Each row contains five fields:

1. Date
2. Learning topic
3. Estimated time
4. Type
5. Action

The date is displayed as a compact day block. The topic is the strongest text in the row. Presenter information, when supplied, appears as muted supporting text below the topic. Estimated time is regular body text. Type appears as a low-emphasis status pill.

The Action column contains one compact course-resource control. Use `Watch` for video destinations and `View` for folders or other learning materials. Active actions are links that open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`. When the source spreadsheet identifies the learning-plan row but does not provide an embedded resource URL, show a disabled `Link coming soon` control instead of guessing a destination.

The Type pill remains non-interactive and separate from the Action link.

## Content

### September 2026

| Date | Learning topic | Estimated time | Type | Action |
|---|---|---:|---|---|
| Sep 1 | Rebuilding booking.com guest experience pages with code-first | 25 min | Watch video | [View](https://drive.google.com/drive/folders/1VaNwxBUOhNfyCJ7U0c4249cU0o-LXqhJ) |
| Sep 8 | PP Demand Page Prototype First Workflow — Shared by Echo | 30 min | Internal Sharing | Link coming soon |
| Sep 15 | How I use Obsidian + Claude Code to run my life (Part 1) | 30 min | Watch video | Link coming soon |
| Sep 18 | AI Product Sharing — Shared by Alroy and Allen | 30 min | Sharing in DDP | Link coming soon |
| Sep 22 | How I use Obsidian + Claude Code to run my life (Part 2) | 30 min | Watch video | Link coming soon |
| Sep 29 | Using Claude Code to Create Animations for YIT — Shared by Shiwen | 30 min | Internal Sharing | Link coming soon |

### August 2026

| Date | Learning topic | Estimated time | Type | Action |
|---|---|---:|---|---|
| Jul 28 | Write a well-structured prompt | 20 min | Watch video | [Watch](https://drive.google.com/file/d/17awpWPaVAt9FRTKKRI_x1TWryk0Zf86e/view?usp=sharing) |
| Aug 4 | Preserving Learning and Critical Thinking While Using Claude Code, Codex, and NotebookLM (Part 1) | 30 min | Watch video | [Watch](https://drive.google.com/file/d/1J7uIh1-cy2QfKf-TEIRx-KJINfV_YRwM/view) |
| Aug 11 | Preserving Learning and Critical Thinking While Using Claude Code, Codex, and NotebookLM (Part 2) | 30 min | Watch video | [Watch](https://drive.google.com/file/d/1J7uIh1-cy2QfKf-TEIRx-KJINfV_YRwM/view) |
| Aug 18 | Discussion: How to eliminate manual fixing of AI-generated Figma designs | 30 min | Roundtable Discussion | Link coming soon |
| Aug 25 | Turning a Rough Idea into Reality with AI Page Builder | 30 min | Watch video | [Watch](https://drive.google.com/file/d/1NmLID0vCYnoV3naLds5idkKAp-VOpGEw/view?t=1.482) |

## Visual system

Reuse the existing website design tokens and typography from `design-spec.md`:

- Apple system font stack
- `#2563EB` primary blue
- Existing neutral page background, text, border, and card colors
- 26px page heading
- 16px learning-topic text
- 14px supporting copy
- 12px metadata and type labels

Use blue as the default type-label accent. Green distinguishes internal sharing, purple distinguishes DDP sharing, and orange distinguishes roundtable discussion. These colors remain soft supporting signals and must not compete with the month and topic hierarchy.

## Responsive behavior

At desktop widths, preserve the month rail and four-field row structure.

At mobile widths:

- Move the month and year above its list
- Keep the date in a compact left column
- Place the topic in the main column
- Wrap estimated time and type below the topic
- Keep the Action control reachable without horizontal scrolling
- Avoid horizontal page scrolling
- Keep all text readable without truncating topic names

The navigation retains the site's existing horizontally scrollable mobile behavior so the new tab remains reachable.

## Accessibility

- Use semantic headings for the page and each month
- Represent each month schedule with semantic list or table markup; prefer a list when the mobile transformation would make a table misleading
- Treat type pills as text because they are not interactive
- Render unavailable actions as disabled buttons with `aria-disabled="true"`; do not use empty or placeholder links
- Give active Action links a visible keyboard focus state and a meaningful accessible name that includes the course topic
- Preserve visible keyboard focus on the navigation tab
- Maintain WCAG AA contrast for all text and status labels
- Do not communicate session type through color alone; always show its text label

## Implementation boundary

The first version stays inside the existing static `index.html` architecture:

- Add one navigation tab
- Add one page container
- Add page-scoped CSS using existing tokens
- Extend the existing direct-page routing allowlist with `learning`

Do not add a framework, API, database, calendar integration, or separate build system for this static content.

## Publishing

The intended destination is the existing B.Pages artifact at:

`https://bpages.booking.com/048eM/ai-ux-newsletter`

Updating that artifact preserves its URL and ownership. Publication requires the current user to have editor access to the artifact's internal B.Pages ID. If editor access is unavailable, the colleague who owns the artifact must grant it with `bpages share <artifact-id> --email <editor-email> --editor` or perform the final `bpages update` herself.

No B.Pages update occurs until the local page is reviewed and the production checks pass.

## Testing and acceptance criteria

Add focused automated coverage before implementation. The tests must initially fail because the page does not yet exist, then pass after implementation.

Acceptance criteria:

- The fourth navigation tab reads `Learning Plan`
- `?page=learning` opens the new page directly
- September 2026 appears before August 2026
- All eleven supplied learning entries are present once
- Every row displays date, topic, time, type, and action
- Presenter information is displayed for the three supplied sharing entries
- Type pills are non-interactive
- Five rows use the four verified source URLs from the `AI topic` sheet; the two Preserving Learning rows intentionally share one recording URL
- Six rows without verified source URLs display disabled `Link coming soon` controls
- Active links open in a new tab and disabled controls cannot navigate
- Existing Latest Week, All Weeks, and Resources Hub pages remain available
- The layout fits a 390px-wide viewport without horizontal page overflow
- The production validation/build completes without introducing new failures
- Publishing updates the existing B.Pages artifact rather than creating a duplicate

## Out of scope

- Automatic monthly content collection
- Calendar synchronization
- Course-detail pages
- Search or filtering
- Attendance and completion tracking
- Slack reminders
- Editing content in the browser
- Changing the existing weekly newsletter workflow
