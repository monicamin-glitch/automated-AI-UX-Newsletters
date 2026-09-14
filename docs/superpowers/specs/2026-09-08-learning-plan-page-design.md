# Learning Plan Page Design

**Status:** Implemented; canonical content moved to [`../../../learning-plan.md`](../../../learning-plan.md)
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

The Learning Plan page container is inserted immediately before the Resources Hub container so the existing Resources Hub parser continues to treat Resources Hub as the final page container. This source order does not change the visible navigation order.

## Page structure

The page follows an agenda-style archive inspired by the earlier Google Calendar agenda view.

The page begins directly with September 2026, followed by August 2026. It does not render a page-level heading, supporting subtitle, hero, or illustration.

Each month group uses two desktop columns:

- A narrow left rail containing the month and year
- A wider right column containing the month's learning rows

The month rail is the visual anchor, not a separate card or illustrated banner. Month groups are separated with whitespace and no divider rules.

## Learning rows

Each row contains four required fields and one optional action:

1. Date
2. Learning topic
3. Estimated time
4. Type
5. Action, when a verified destination exists

The date is displayed as a compact day block. The topic is the strongest text in the row. Presenter information, when supplied, appears as muted supporting text below the topic. Estimated time is regular body text. Type appears as a low-emphasis status pill.

The optional action contains one compact course-resource control. Use `Watch` for video destinations and `View` for slides, folders, or other learning materials. Active actions are links that open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`. When no verified URL exists, omit the action instead of guessing a destination or showing a disabled placeholder.

The Type pill remains non-interactive and separate from the Action link.

## Content

Course content and verified destinations live only in [`learning-plan.md`](../../../learning-plan.md). This implementation record does not duplicate that inventory.

## Visual system

Reuse the existing website design tokens and typography from `design-spec.md`:

- Apple system font stack
- `#2563EB` primary blue
- Existing neutral page background, text, border, and card colors
- 22px month name on desktop and 20px on mobile
- 16px learning-topic text
- 14px supporting copy
- 12px metadata and type labels

Use blue as the default type-label accent. Green distinguishes every internal sharing session and orange distinguishes roundtable discussion. There is no separate DDP variant. These colors remain soft supporting signals and must not compete with the month and topic hierarchy.

## Responsive behavior

At desktop widths, preserve the month rail and agenda-card structure.

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

- Use semantic headings for each month; the active navigation item provides the page label
- Represent each month schedule with semantic list or table markup; prefer a list when the mobile transformation would make a table misleading
- Treat type pills as text because they are not interactive
- Omit unavailable actions; do not use disabled placeholders, empty links, or guessed destinations
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
- Every row displays date, topic, time, and type; verified resources also display an action
- Presenter information is displayed for the three supplied sharing entries
- Type pills are non-interactive
- Eight rows use verified resource links; the two Obsidian sessions intentionally share one YouTube URL
- Three rows without verified source URLs omit the action entirely
- Active links open in a new tab
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
