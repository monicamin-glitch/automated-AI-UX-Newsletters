# Design Spec — AI × Design Weekly

Visual design and component reference for the newsletter website.

**Owner:** zwang5 | **Updated:** May 20, 2026

---

## Layout

Fixed sidebar (260px) + scrollable main content (max 1100px, padded 32px 40px). Background: `#f0f4ff` with radial gradients and a grid texture.

On mobile (≤ 900px): sidebar hides off-screen with a hamburger toggle, main content goes full width.

---

## Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#2563EB` | Links, active states |
| `--primary-light` | `#3b82f6` | Hover |
| `--primary-dark` | `#1d4ed8` | Pressed |
| `--secondary` | `#A855F7` | Purple accent |
| `--tertiary` | `#06B6D4` | Cyan accent |
| `--bg` | `#f0f4ff` | Page background |
| `--card-bg` | `#ffffff` | Cards |
| `--text-primary` | `#0f172a` | Headings |
| `--text-secondary` | `#475569` | Body text |
| `--text-muted` | `#94a3b8` | Meta, dates |
| `--border` | `rgba(37, 99, 235, 0.08)` | Card borders |

---

## Typography

Font: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`

| Element | Size | Weight |
|---------|------|--------|
| Hero title | 32px | 800 |
| Article title | 16px | 700 |
| Article description | 13px | 400 |
| Meta (source, date) | 11px | 400 |
| Tag labels | 10px uppercase | 600 |
| Filter chips | 12px | 500 |
| Sidebar nav | 13px | 500 |

---

## Tags

| Value | Display name | Background | Text | Icon stroke |
|-------|-------------|-----------|------|-------------|
| `product` | Product Updates | `#dbeafe` | `#1d4ed8` | `#6366f1` |
| `workflows` | Workflows | `#ccfbf1` | `#0d9488` | `#0d9488` |
| `thinking` | Deeper Thinking | `#ede9fe` | `#6d28d9` | `#7c3aed` |
| `slack` | Slack Spotlights | `#fef3c7` | `#b45309` | `#d97706` |

Each article has exactly one tag. Tags render as small pills (6px radius, 3px 8px padding).

---

## Components

### Sidebar

- Frosted glass (blur 20px, semi-transparent white)
- Logo + "AI × Design Weekly" + "Curated for UX teams"
- Nav: "This Week" + "Explore All" + "Archive" (auto-generated, max 5 weeks shown)
- Active state: blue background tint + left edge bar
- **Icons:** "This Week" = document with text lines, "Explore All" = grid, Archive weeks = document with folded corner

### Hero Banner

All hero banners use the same compact format: label, title, and date range.

- Gradient: navy → blue → purple → cyan, with grid texture overlay (static, no animation)
- **Latest week:** Label "New This Week", title includes "✨ Fresh Picks"
- **Archive weeks:** Label "Previously", title is the week number
- **All Articles:** Label "The Full Collection", title "Explore All"

### Filter Chips (Sticky)

- Pill buttons, white background, subtle border
- Active: blue fill, white text
- **Sticky behavior:** Filters are `position: sticky; top: 0`. Background is transparent by default. When stuck (scrolled past hero), they get `background: var(--bg)` and `box-shadow: 0 2px 8px rgba(0,0,0,0.06)` with a 0.3s transition. Full viewport width (minus sidebar).
- Chips with no matching articles are auto-hidden
- On page switch: `is-stuck` class is cleared and transitions disabled momentarily to prevent flash
- On filter click: scrolls so the first article sits below the filter bar (no jump)
- `min-height: 100vh` on articles list prevents layout shifts when filtering to few results

### Article Cards — List View

- Full width, white background, rounded 12px
- Left: 200×130px image thumbnail (gradient fallback shown immediately, real image loads on top)
- Right: tag → title → description (max 5 lines) → meta
- Hover: lifts 2px, blue glow
- Mobile: stacks vertically (image on top, 160px tall)
- Gap between cards: 16px
- YouTube cards show a play button overlay (bottom-left corner, dark circle with white triangle)

### Article Cards — Grid View (All Articles)

- Auto-fill grid, min 280px columns, 20px gap
- Vertical layout with 160px image header
- Smaller text (title 14px, desc 12px, max 4 lines)

### Slack Spotlights Modal

Slack cards open a modal (no external URL):

- **Trigger:** Click any Slack Spotlights card
- **Modal:** White, rounded 16px, max 640px wide, max 80vh tall, scrollable
- **Header:** Tag pill ("Slack Spotlights")
- **Title:** Large bold heading
- **Author section:** Real Slack profile name (bold) + date + initials on amber gradient (40px, rounded 8px). Author name and message are fetched from Slack using the Toolbox Slack MCP tools based on the permalink URL.
- **Highlighted quote:** The full original Slack message. Styled as a blockquote (amber left border 3px, warm `#fffbeb` background, rounded right corners 10px, italic text). Must be the author's actual words — not rewritten. Links from the original message should be preserved as clickable `<a>` tags.
- **Channel name:** Shown below the quote as context (e.g. "#design"), muted text
- **Footer:** "View in Slack" button (white background, blue text, blue border). Opens permalink in new tab. Hidden if no `data-slack-link` attribute.
- **Close:** X button (turns blue on hover), overlay click, or Escape key
- **Mobile:** Bottom sheet style

Data attributes per Slack card: `data-slack-author`, `data-slack-avatar` (optional URL), `data-slack-quote` (key excerpt).

**Important:** The `data-slack-quote` must contain the **full original message** from the Slack author — not a rewritten or summarized version. Fetch the message from Slack using the Toolbox Slack MCP (`slack_slack_read_channel` or `slack_slack_read_thread` with channel_id and timestamp from the permalink). Preserve all links from the original message as clickable HTML `<a href="..." target="_blank">` tags. Use `slack_slack_read_user_profile` to get the real author name for `data-slack-author`.

**AI relevance required:** Only include Slack messages that are directly about AI in the context of UX/design work — such as new AI tools or platforms, AI skills or workflows, AI-related documentation, or AI community initiatives. Do not include general design discussions (e.g. data visualization patterns, accessibility, design system components) that are not specifically about AI.

---

## Page Types

1. **This Week** — Compact hero with "✨ Fresh Picks", sticky filters with count, list view
2. **Archive Weeks** — Compact hero with "Previously", sticky filters, list view
3. **Explore All** — Compact hero, week picker + tag filters, grid view

Each page has `min-height: 100vh` to prevent jumps when switching between pages of different lengths.

---

## Image Loading

Gradient fallback shows immediately on all cards. Real images load on top when available:

1. YouTube thumbnail (if `data-yt-id` present) — with play button overlay
2. thum.io screenshot (skipped for Substack)
3. Microlink OG image (rejects < 300px)
4. Branded gradient stays visible if all above fail

Fallback gradients by section: blue (product), teal (workflows), purple (thinking), amber (slack). Source name displayed as a label on the gradient.

All image containers have `data-section` and `data-label` attributes pre-set in HTML for reliable fallback rendering.

---

## Animations

| Element | Effect |
|---------|--------|
| Page/filter switch | Smooth 0.3s opacity fade on articles list |
| Card hover | Lift + blue glow shadow |
| Filter chip hover | Lift + blue border |
| Sticky filter | 0.3s background + shadow transition |
| Modal | Fade + slide up (0.25s) |
| Page navigation | Instant swap, no scroll animation |

---

## Spacing Reference

| Element | Value |
|---------|-------|
| Sidebar width | 260px |
| Card border radius | 12px |
| Card padding | 20px 24px |
| Card gap | 16px |
| Filter-to-articles gap | 16px |
| Filter margin-bottom | 12px |
| Hero border radius | 20px |
| Main padding | 32px 40px |
| Filter chip padding | 8px 16px |

---

## Rules for Contributors

- Don't edit sidebar HTML — auto-generated from page data attributes
- Don't edit "Explore All" page — auto-populated via JavaScript
- Don't edit CSS/JS without discussing first
- Tag display names must match filter chip names exactly
- Follow the card HTML format in `digest.md`
