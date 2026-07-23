# Design Spec — AI × Design Weekly

Authoritative visual and interaction specification for the newsletter website.

**Owner:** zwang5

**Updated:** July 22, 2026

Content and discovery rules live in [`digest.md`](digest.md), [`slack-spotlight.md`](slack-spotlight.md), and [`resources-hub.md`](resources-hub.md). This file defines presentation only.

---

## Information architecture

Use a sticky top navigation with three pages:

1. **Latest Week** — the most recent ISO calendar week
2. **All Weeks** — a calendar-week picker and the selected week’s complete report
3. **Resources Hub** — the manually curated Booking.com UX AI Knowledge Hub

The navigation remains unchanged as weeks change. Weekly content is the primary variable.

### Page order

Latest Week:

1. Week heading
2. “What colleagues are talking about this week?”
3. Internal Updates
4. External Updates

All Weeks:

1. Week picker and selected-week context
2. Internal Updates
3. External Updates

The popular-topic experience is exclusive to Latest Week. It appears below the Latest Week heading and above Internal Updates. All Weeks never renders a Popular Topic block; each selected archive report begins with Internal Updates.

---

## Layout

- Sticky top navigation: 60px high, white background, subtle neutral bottom border
- Main content: maximum width 960px, centered
- Desktop horizontal padding: 40px
- Page background: light blue-grey `#f8fafc`
- Cards: white, rounded, neutral border; avoid blue outlines around entire cards
- Use subtle shadows only for depth and hover feedback
- Maintain generous white space without making the popular-topic block dominate the page

### Responsive behavior

- At tablet widths, External Updates uses two columns.
- At mobile widths, External Updates and Resource Hub use one column.
- Top navigation stays available; reduce horizontal padding before allowing text to wrap.
- Slack cards retain the channel tile at the start of each card; reduce card padding and gap on narrow screens.
- The popular-topic illustration remains decorative and secondary to the topic card.

---

## Color system

Use one coherent blue-led system with warm illustration accents. Purple and amber must not act as competing UI themes.

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#2563EB` | Active states, links, buttons |
| `--primary-rgb` | `37, 99, 235` | Focus and shadow alpha colors |
| `--primary-light` | `#3B82F6` | Hover and gradients |
| `--primary-dark` | `#1D4ED8` | Pressed state |
| `--primary-ink` | `#1E3A8A` | Strong blue text |
| `--primary-soft` | `#BFDBFE` | Soft blue surfaces |
| `--primary-tint` | `#EFF6FF` | Very light blue surfaces |
| `--secondary` | `#60A5FA` | Supporting blue accent |
| `--tertiary` | `#93C5FD` | Illustration and gradient accent |
| `--bg` | `#F8FAFC` | Page background |
| `--card-bg` | `#FFFFFF` | Card surfaces |
| `--text-primary` | `#0F172A` | Headings and bold labels |
| `--text-secondary` | `#475569` | Body text |
| `--text-muted` | `#94A3B8` | Metadata and supporting dates |
| `--border` | `#E2E8F0` | Card and control borders |
| `--border-light` | `#F1F5F9` | Internal separators |

Illustrations may use Booking-style yellow, orange, skin tones, and blue. Do not place a white overlay over characters; preserve original colors.

---

## Typography

Use one typographic voice throughout:

```css
font-family: -apple-system, BlinkMacSystemFont, sans-serif;
```

| Element | Desktop size | Weight |
|---|---:|---:|
| Week/page heading | 26px | 800 |
| Section heading | 21px | 800 |
| Popular-topic question | 20px | 800 |
| Topic word | 30px | 800 |
| Resource category title | 17px | 750 |
| Slack/article title | 16px | 700 |
| Card body and Slack dialog copy | 14px | 400 |
| Metadata | 12px | 400 |
| Filter chip | 11–12px | 600 |

- Page, section, and popular-topic headings must feel like members of the same system.
- Do not add a subtitle below “Internal Updates”.
- Do not emphasize the Slack sender’s name; it inherits the metadata style.
- External article actions use zero horizontal padding so their left edge aligns with the card copy, with an 8px gap after the summary.

---

## Week naming

Use the real ISO calendar week number and Monday–Sunday range.

Latest Week heading:

```text
Week 28 - July 6 to 12, 2026
```

All Weeks selector hierarchy:

```text
Week 29
July 13 to 19, 2026
```

Do not use newsletter-sequence labels such as “Week 10 — 14 updates”. Do not display a redundant archive heading below the selector.

---

## Components

### Top navigation

- Left: AI × Design identity and Shanghai badge
- Right: Latest Week, All Weeks, Resources Hub
- Active page: primary-blue text and bottom border
- Hover: primary-blue text
- Support direct preview URLs such as `?page=all` and `?page=resources`

### Popular-topic experience

Copy:

```text
What colleagues are talking about this week?
```

Structure:

- One full-width illustrated block directly under the week heading
- White-to-light-blue-grey continuous background; no horizontal color seam
- Booking-style woman on the left and man on the right, with different heights
- Characters are approximately two-thirds of the early exploration size and must not compete with the center card
- The woman wears yellow; the man wears a blue shirt
- Office elements may extend inward from both sides: desk edges, notebooks, plants, books, cup, lamp, clock, shelves, or similar details
- Decorative elements should form a natural visual slope toward the center instead of isolated repeated plants
- The illustration asset fills the block without stretching or flattening; redraw or crop to the block aspect ratio rather than changing image proportions

Center content:

- One visible white topic card with a second pale-blue card slightly offset behind it
- Topic word is the primary visual focus
- Metadata appears below as static text: `[mentions] mentions · [channels] channels`.
- The metadata row is informational only. It has no arrow, hover treatment, click action, or Slack search link.
- Do not show `Top N of 10`, proposal labels, internal labels, Slack labels, week badges, or authorization notes
- Centered blue button below: `Show next topic`
- Clicking cycles through the returned internal topics in rank order with a card-change animation
- While the card-change animation runs, the button temporarily ignores repeat clicks but keeps a normal cursor and static icon; do not show a waiting cursor or loading rotation.
- Default state shows rank 1 immediately; no reveal is required on first visit
- Announce topic changes through an `aria-live` region
- Disable nonessential animation for `prefers-reduced-motion`

Recommended block height: approximately 268px on desktop. Keep about 32px below the button.

### Internal Updates filters

Order:

1. All
2. Tools & Releases
3. Learning & Curriculum
4. Best Practices
5. Others

- Pills use white backgrounds and neutral borders.
- Active pill uses primary blue with white text.
- The All pill includes the count.
- Filtering is scoped to the active page.

### Slack notification card

- Full-width horizontal white card
- Neutral border and 15px radius
- 24px × 20px desktop padding; 16px gap
- Subtle neutral shadow; hover may lift 1px without changing the neutral border to blue

Channel tile:

- 80×80px
- Light-blue gradient from `--primary-tint` to `--primary-soft`
- No border and no shadow
- Shows only the channel name, centered, for example `#design`

Body order:

1. Article title
2. `What is the update:` paragraph
3. `Why it's valuable for UXers:` paragraph
4. Metadata row

Both summary labels are bold and each explanation remains on its own line.

Metadata uses one continuous row:

```text
[Slack icon] posted by [name], YYYY/MM/DD · [reply count] replies · View in Slack
```

- Slack icon is small and authentic.
- `posted by`, sender, date, and reply count use the same type size, weight, and muted-grey color.
- Do not highlight the sender's name.
- Reply count follows the date; do not place it alone at the end of the card.
- `View in Slack` follows the reply count. It uses primary-blue text and receives a compact pale-blue rounded background on hover and keyboard focus.

Interaction uses two clearly separated hot zones without changing the card layout:

- The complete card is the primary action and opens a Slack-message detail dialog. Implement the card as a button-like `article` or `div`, not as an outer link, so the nested Slack link remains valid HTML.
- The card must be keyboard accessible with `tabindex="0"`, an appropriate accessible label or `role="button"`, and Enter/Space support.
- `View in Slack` is the secondary action. It opens the original permalink in a new tab with `rel="noopener noreferrer"`, stops event propagation, and must not open the dialog.
- Keep the existing subtle card lift on hover. The inline action's pale-blue hover state makes its smaller click target visibly distinct.
- Apply this behavior and metadata styling to every Slack card on both Latest Week and All Weeks.

### Slack message detail dialog

- Use a clean Slack-style dialog, approximately 680px maximum width, with an internal scroll area for long messages.
- Show the channel, author, original date/time, and reply count as supporting context.
- Show the full original parent message, not the newsletter summary. Do not include thread replies in the dialog body.
- Preserve paragraphs, lists, labelled links, inline code, fenced code blocks, and reactions when they are present in the stored source content.
- Include a primary-blue `View in Slack` action in the footer that opens the original permalink in a new tab.
- Support the close button, Escape key, and backdrop click. Lock page scrolling while open and return focus to the card that opened the dialog after close.
- Code blocks use a flat light-grey background `#F1F5F9`, dark-red text `#B42318`, and border `#E2E8F0`. Inner `code` elements inherit this treatment and must not create a separate white pill.

### External Updates cards

- Desktop: three equal-width columns
- Tablet: two columns
- Mobile: one column
- All cards remain in one grid; do not split into “Top picks” and “More articles” sections
- Cards in each grid row stretch to equal height
- Image area: fixed 170px height with `object-fit: cover`
- Body uses a column layout so the action can align toward the bottom
- The first three editorial picks receive `Top pick · 1`, `Top pick · 2`, and `Top pick · 3` badges over the image

Body order:

1. Source
2. Title
3. `What is the update:` paragraph
4. `Why it’s valuable for UXers:` paragraph
5. Read article action

Do not merge the two summary paragraphs. All links open in a new tab with `rel="noopener noreferrer"`.

### All Weeks calendar picker

Trigger hierarchy:

- Large: `Week 29`
- Small: `July 13 to 19, 2026`

Picker behavior:

- Show only years containing newsletter data.
- If only one year exists, show that year and disable previous/next year buttons.
- Render a familiar month calendar with Monday through Sunday columns; the seven calendar dates provide the primary orientation and the ISO week number is small supporting metadata at the start of each row.
- Treat each complete calendar row as one selectable report week. Selecting any available date or empty area within a row selects the whole row.
- Weeks without reports remain visible for calendar context but are muted and disabled.
- Available rows use the normal interactive state.
- The selected week uses one continuous solid `#2563EB` row with white dates. Do not add a separate outer ring around the selected row.
- When the current week is not selected, identify it with a restrained `#2563EB` inset outline. When current and selected are the same week, show only the selected filled state.
- Dates belonging to the previous or next month remain visible at reduced opacity so each Monday–Sunday range stays complete.
- Month controls change the visible calendar month. Year navigation remains unavailable until reports exist in another year.
- Initially open the month containing the currently displayed report and select that report’s week.
- Keep the selected report visible below the calendar as two lines: a prominent `Week 29` label and the supporting date range `July 13 to 19, 2026`.
- Selecting a week updates the trigger and renders that week’s Internal Updates and External Updates below. Do not render Popular Topic in All Weeks; the selected report begins with Internal Updates.
- Do not show “Calendar Archive” or repeat the selected week in a second heading.

### Resources Hub

Content comes from [`resources-hub.md`](resources-hub.md).

- Page heading: Booking.com UX AI Knowledge Hub
- Subtitle: Curated internal AI resources for UX designers
- Three category cards
- UX AI Foundations is full width at the top
- Workflow / playbooks / use cases and AI tools / prototyping / setup sit side by side below
- Foundations links use the same effective column width as links inside the lower cards
- Category icon and title are vertically centered
- No subcategory labels and no special highlight treatment for Foundations
- Link rows are compact, equal width, and include an external-link icon
- Mobile stacks all categories and changes Foundations to one link column

---

## Media and image behavior

- External card images must use checked-in, validated source-native media where possible.
- The popular-topic illustration is a checked-in full-width asset matched to the component aspect ratio.
- Slack channel tiles are UI elements, not article images, and require no external thumbnail.
- Detailed asset sourcing and validation live in [`media-strategy.md`](media-strategy.md).

---

## Accessibility

- Interactive elements have visible keyboard focus.
- All external links communicate new-tab behavior through standard link semantics.
- Decorative illustration images use empty alt text and `aria-hidden="true"`.
- Topic changes are announced through `aria-live="polite"` and `aria-atomic="true"`.
- Calendar controls expose expanded state, selected state, disabled state, and a meaningful week label.
- Color is not the only indicator for selected, current, or unavailable weeks.
- Respect `prefers-reduced-motion`.

---

## Content ownership

| Content | Source of truth |
|---|---|
| Weekly orchestration and External Updates | [`digest.md`](digest.md) |
| Public discovery sources | [`sources.md`](sources.md) |
| Internal Updates and Popular Topics | [`slack-spotlight.md`](slack-spotlight.md) |
| Resource Hub links and categories | [`resources-hub.md`](resources-hub.md) |
| Images and asset validation | [`media-strategy.md`](media-strategy.md) |

Do not duplicate content URLs or discovery rules in this visual specification.
