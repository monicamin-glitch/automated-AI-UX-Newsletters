# Newsletter UI System Refresh — Design Specification

**Date:** 2026-07-22 (updated 2026-07-23)
**Status:** Ready for user review  
**Scope:** Latest Week, All Weeks, Resources Hub, Slack detail dialog, and responsive behavior

## Objective

Turn the approved local explorations into one coherent UI system, remove superseded rules, apply the system to the real newsletter pages, and then run the weekly digest workflow locally to verify that the refreshed Markdown contracts and layout work together.

This work does not publish or push to GitHub without a separate explicit request.

## Typography

Use Apple System everywhere, including form controls, buttons, dialogs, filters, and calendar controls:

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
```

Remove the Google Inter import and all Inter-first declarations.

### Type scale

| Role | Size | Weight | Line height | Color |
|---|---:|---:|---:|---|
| Supporting metadata | 12px | 400–500 | 1.5 | `#64748B` |
| Filter label | 12px | 500 in every state | 20px | state-dependent |
| Body and primary UI copy | 14px | 400 | 1.56 (about 22px) | `#595959` |
| Secondary text action | 12px | 600 | 1.4 | theme primary |
| Card title | 18px | 700 | 1.35 | `#1A1A1A` |
| Section title | 20px | 800 | 1.3 | `#1A1A1A` |
| Page/week title | 26px desktop; 22px mobile | 800 | 1.28 | `#1A1A1A` |
| Popular-topic word | 30px default | 800 | 1.08–1.12 | deep theme blue |

Use typography, color, and spacing—not many nearby font sizes—to express hierarchy.

## Color system

All UI blues must use this family:

| Token | Value | Use |
|---|---|---|
| Primary | `#2563EB` | Main buttons, active filters, links, active navigation |
| Primary light | `#3B82F6` | Supporting accent and hover borders |
| Primary dark | `#1D4ED8` | Hover and pressed states |
| Primary deeper | `#1E40AF` | Popular-topic words and Slack channel names |
| Primary soft | `#BFDBFE` | Themed borders and gradient endpoint |
| Primary tint | `#EFF6FF` | Soft themed surfaces |
| Text primary | `#1A1A1A` | Titles and bold labels |
| Text body | `#595959` | Article and card body copy |
| Text muted | `#64748B` | Metadata, dates, reply counts |
| Text subtle | `#94A3B8` | Disabled and tertiary text only |

Slack's multicolor logo, editorial images, and the checked-in colleagues illustration retain their own colors. Everything else that communicates a UI state must use the theme tokens.

## Navigation and page grid

- Keep the content maximum width at 960px.
- On wide desktop screens, align the `Latest Week` tab text with the left edge of the page content. Place the brand in the available left rail.
- At intermediate desktop widths, keep brand and tabs in normal flow within a centered navigation container.
- Do not manually nudge individual page titles; navigation and content share the same grid calculation.

## Filters

- Font: 12px Apple System, weight 500 in default, hover, and selected states.
- Desktop padding: 4px 10px; approximately 29px visual height.
- Default: white background, `#D1D5DB` border, `#595959` text.
- Hover: `#F8FAFC` background, `#9CA3AF` border, `#1A1A1A` text.
- Selected: solid `#2563EB` background and border, white text.
- Count uses the same 500 weight. Its default background is neutral; its selected background is translucent white.
- Keyboard focus retains a visible theme-blue focus ring.

## Popular-topic experience

- Keep the checked-in illustrated layout, stacked topic cards, and `Show next topic` interaction.
- Remove the button border; use a pure primary-blue fill with dark-blue hover and a separate keyboard focus ring.
- Popular-topic words use `#1E40AF`.
- The front card and pale next card use theme borders and surfaces.
- Detect real text wrapping after initial render, topic changes, and viewport resizes:
  - Desktop front: 30px single line, 26px wrapped, 22px tightly wrapped.
  - Desktop next card: 26px single line, 24px wrapped, 21px tightly wrapped.
  - Mobile front: 28px single line, 24px wrapped, 21px tightly wrapped.
  - Mobile next card: 24px single line, 22px wrapped, 20px tightly wrapped.
- Calculate the next card's fit before animation starts so the pale-blue transition word never flashes at an oversized value.
- Preserve reduced-motion behavior and the normal cursor/static icon during the animation.

## Slack cards and dialog

### Card layout

- Desktop card padding: 24px; gap: 20px.
- Title: 18px/700.
- Body: 14px/400 with 1.56 line height; the two summary paragraphs remain separate.
- Metadata: 12px and muted grey.
- Metadata order: Slack icon, poster/date, grey reply count, blue `View in Slack`.
- Reply count must never be blue.
- `View in Slack` is 12px/600 with a compact 3px 6px rounded hover surface.

### Channel tile

- Desktop size remains 80×80px.
- Background uses a theme-only gradient: `#EFF6FF → #DBEAFE → #BFDBFE` at approximately 145 degrees.
- Channel name uses `#1E40AF`.
- Do not add a border or shadow.

### Two hot zones

- The card is a keyboard-accessible button-like article and opens the Slack detail dialog.
- `View in Slack` stops propagation and opens the permalink in a new tab.
- Apply the same structure to Latest Week and archived All Weeks Slack cards.

### Detail dialog

- Use the approved Slack-style dialog, approximately 680px maximum width.
- Display channel, real author, original timestamp, reply count, reactions when available, and the complete stored parent message.
- Do not include thread replies in the dialog body.
- Preserve safe paragraphs, lists, labelled links, inline code, and code blocks.
- Code blocks use `#F1F5F9` background, `#B42318` text, and `#E2E8F0` border.
- Footer includes `View in Slack`.
- Support close button, Escape, backdrop close, scroll lock, and focus restoration.
- Newly generated Slack records must provide `posted_at` and `original_message`; never invent missing originals.

## External Updates

- Retain the equal-height three/two/one-column responsive grid.
- Card body follows the Dieter-inspired spacing: approximately 22px horizontal and 24px bottom padding.
- Title: 18px/700; body: 14px/400; source metadata: 12px.
- `Read article` exactly matches `View in Slack`: 12px/600, theme blue, compact rounded hover surface.
- Top-pick badge is intentionally secondary: 10px/700, 4px 8px padding, reduced dark-background opacity, and tighter letter spacing.

## Resources Hub

- Apply the same Apple System, 18px category-title, 14px link, text colors, and Dieter-inspired spacing.
- Keep Foundations full width and the two lower categories side by side on desktop.
- `The UX AI Hub` appears only in UX AI Foundations.
- Add `AI UX Case Hub` to Workflow / playbooks / use cases with the supplied internal URL.
- Keep the resource Markdown as the canonical manually curated content source.

## All Weeks calendar picker

- Replace the abstract `W01`–`W53` grid with a familiar month-calendar view.
- Use Monday through Sunday columns and treat each complete calendar row as one selectable report week.
- Show the ISO week number as small supporting metadata at the start of each row, while the seven calendar dates provide the primary orientation.
- Selecting any available date or empty area within a row selects the entire week.
- Keep the selected report visible below the calendar as two lines: a prominent `Week 29` label and the supporting date range `July 13 to 19, 2026`.
- Weeks with reports use the normal interactive state. Weeks without reports remain visible for calendar context but are muted and disabled.
- The selected week uses one continuous solid-primary-blue row with white dates; do not add a separate outer ring around that selected row.
- If the current week is not selected, identify it with a restrained theme-blue inset outline. When current and selected are the same week, only the selected filled state is shown.
- Dates belonging to the previous or next month remain visible at reduced opacity so each Monday–Sunday range stays complete.
- Month controls change the visible calendar month. Year navigation remains unavailable until reports exist in another year.
- Initial state opens the month containing the currently displayed report and selects that report's week.
- Preserve the page-level title format as `Week 29` followed by `July 13 to 19, 2026`; do not reintroduce ambiguous labels such as `Week 10–14 updates`.

## Responsive behavior

At 768px and below:

- Use a two-row sticky navigation: brand row followed by a 44px horizontally scrollable tab row.
- Use 16px page side padding.
- Prevent page-level horizontal scrolling.
- Keep the Popular Topic content inside its component bounds and center the card stack.
- Filters remain one line and scroll horizontally; their mobile touch height is 40px.
- `Show next topic` and key calendar controls are at least 44px high.
- Slack cards become a full-width reading layout; the channel tile becomes a compact pill above the body.
- External Updates and Resources Hub become one column.
- The All Weeks calendar keeps all seven date columns visible. Each week row is at least 44px high and is selected as one touch target; the small week-number column is supporting information rather than a separate control.
- The Slack detail dialog uses a mobile bottom-sheet layout.

## Markdown ownership

- `design-spec.md`: all final visual tokens, typography, component states, interaction behavior, and responsive rules. Remove superseded Inter, 10/12px body, old filter, old blue, and direct-card-link rules.
- `slack-spotlight.md`: Slack discovery and required parent-message data only. Keep `original_message`, `posted_at`, permalink, reply count, reactions, and safety handling; do not duplicate visual CSS values.
- `resources-hub.md`: canonical links and category placements. Keep the new Case Hub and remove the duplicated Workflow placement of The UX AI Hub.
- `digest.md`: orchestration and external-news workflow only. It references the specialized Markdown files and must not duplicate their detailed rules.

## Verification and digest rerun

1. Add regression tests for typography tokens, filter states, topic fitting, Slack hot zones/dialog, external action parity, blue-token usage, resource placement, and responsive breakpoints.
2. Update the production-style newsletter page from the approved preview rules.
3. Run the complete local test suite and inspect desktop plus 390px mobile screenshots.
4. Run the digest skill locally against the latest Markdown contracts.
5. Fetch real Slack parent messages for any generated modal data; do not invent missing content.
6. Confirm Latest Week, All Weeks, and Resources Hub render correctly.
7. Stop before GitHub push or publication unless the user explicitly requests it.

## Out of scope

- Recoloring illustration or editorial image assets.
- Changing weekly editorial selection solely for visual reasons.
- Publishing, pushing, or opening a pull request.
