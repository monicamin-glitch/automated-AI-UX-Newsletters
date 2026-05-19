# Design Spec — AI UX Weekly

This document describes the visual design, layout, and component decisions for the AI UX Weekly newsletter website. Use it as a reference when adding content or making design changes.

**Owner:** zwang5
**Last updated:** May 19, 2026

---

## Overview

A single-page static website with a modern, glassmorphism-inspired aesthetic. The design uses soft gradients, subtle grid textures, and glowing card effects to create a premium editorial feel. The layout is a fixed sidebar + scrollable content area.

**Visual tone:** Clean, professional, slightly futuristic — designed for a UX audience that appreciates good visual craft.

---

## Layout Structure

```
┌──────────────────────────────────────────────────┐
│ ┌──────────┐  ┌──────────────────────────────┐   │
│ │           │  │                              │   │
│ │  Sidebar  │  │       Main Content           │   │
│ │  (fixed)  │  │       (scrollable)           │   │
│ │           │  │                              │   │
│ │  260px    │  │  max-width: 1100px           │   │
│ │           │  │  padding: 32px 40px          │   │
│ │           │  │                              │   │
│ └──────────┘  └──────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

- **Sidebar:** Fixed left, 260px wide, frosted glass background with blur
- **Main content:** Scrolls independently, padded, max 1100px wide
- **Background:** Soft blue-tinted base (`#f0f4ff`) with layered radial gradients and a subtle 60px grid pattern

---

## Color System

### Core palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#2563EB` | Links, active states, main accent |
| `--primary-light` | `#3b82f6` | Hover states |
| `--primary-dark` | `#1d4ed8` | Pressed states |
| `--secondary` | `#A855F7` | Purple accent (hero gradient, deep thinking) |
| `--tertiary` | `#06B6D4` | Cyan accent (hero gradient, tools) |
| `--neutral` | `#64748B` | Neutral secondary elements |

### Backgrounds

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#f0f4ff` | Page background |
| `--bg-sidebar` | `rgba(255, 255, 255, 0.85)` | Sidebar (semi-transparent for blur) |
| `--bg-content` | `#f5f8ff` | Content area |
| `--card-bg` | `#ffffff` | Card backgrounds |

### Text

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#0f172a` | Headings, titles |
| `--text-secondary` | `#475569` | Body text, descriptions |
| `--text-muted` | `#94a3b8` | Meta info, dates, labels |

### Glows & effects

| Token | Value | Usage |
|-------|-------|-------|
| `--glow-primary` | `rgba(37, 99, 235, 0.15)` | Blue glow on hover/active |
| `--glow-secondary` | `rgba(168, 85, 247, 0.12)` | Purple background glow |
| `--glow-tertiary` | `rgba(6, 182, 212, 0.12)` | Cyan background glow |
| `--border` | `rgba(37, 99, 235, 0.08)` | Subtle borders on cards |

---

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Body | Inter | 16px (base) | 400 |
| Hero title | Inter | 32px | 800 |
| Hero subtitle | Inter | 15px | 400 |
| Hero label | Inter | 11px uppercase | 600 |
| Article title | Inter | 16px | 700 |
| Article description | Inter | 13px | 400 |
| Article meta (source, date) | Inter | 11px | 400 |
| Tag labels | Inter | 10px uppercase | 600 |
| Sidebar nav items | Inter | 13px | 500 |
| Section labels | Inter | 10px uppercase | 600 |
| Filter chips | Inter | 12px | 500 |

**Font stack:** `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
**Letter spacing:** Titles use -0.2px to -0.5px; uppercase labels use 0.1–0.15em

---

## Components

### Sidebar Navigation

- Fixed left panel with frosted glass effect (blur 20px)
- **Logo:** Gradient icon (blue → cyan) + "AI UX Weekly" text + "Design + Intelligence" subtitle
- **Nav items:** Icon + label, 10px 12px padding, rounded 10px
- **Active state:** Blue tinted background, left edge bar (3px wide), bold text
- **Sections:** "Browse" (Latest + All Articles) and "Archive" (auto-generated from weeks)
- Archive only shows weeks that have articles, max 5 shown

### Hero Banner

Two variants:

**Latest week (full):**
- Gradient background: navy → blue → purple → cyan
- Animated glow overlay (8s pulse)
- Grid texture overlay
- Shows: label, title (Week XX), subtitle, date badge pill

**Archive week (compact):**
- Same gradient background
- Shows: "Weekly Archive" label, week number, date range
- No animation, no badge

### Filter Chips

- Pill-shaped buttons, white background, subtle border
- Active state: filled blue background, white text
- Hover: lifts up 1px, blue border glow
- "All" chip shows article count in a mini badge
- Chips with no matching articles are automatically hidden

### Article Cards — List View

- Horizontal card: full width, white background, rounded 12px
- **Left side: 200×130px image thumbnail** with rounded corners
- Right side: tags → title → description (max 5 lines) → meta (source + date)
- Hover: lifts 2px, blue glow shadow, blue border
- On mobile: card stacks vertically (image on top, full width, 160px tall)
- Staggered fade-in animation (0.05s delay between cards)

### Article Cards — Grid View (All Articles page)

- Responsive grid: auto-fill, minimum 280px columns
- Vertical card layout with 160px image header
- Slightly smaller text (title 14px, desc 12px, max 4 lines)
- Hover: lifts 3px, stronger glow

### Tags

| Tag | Display name | Background | Text color |
|-----|-------------|-----------|-----------|
| `product` | Product & Release Updates | `#dbeafe` | `#1d4ed8` |
| `workflows` | Practical Workflows & Examples | `#ccfbf1` | `#0d9488` |
| `thinking` | Deeper Thinking & Case Studies | `#ede9fe` | `#6d28d9` |

Tags appear as small rounded pills (6px border-radius, 3px 8px padding). Each article has exactly one tag.

### Week Picker (All Articles page)

- Label "Week:" + dropdown select
- Styled select with custom arrow icon
- Options: "All Weeks" + each week listed by number and date
- Works in combination with tag filters

---

## Page Types

### 1. Latest Week (default/home)
- Full hero with animation
- Filter chips with count
- Article cards in list view
- This is the page visitors see first

### 2. Archive Weeks
- Compact hero (no animation)
- Filter chips
- Article cards in list view
- Accessed via sidebar navigation

### 3. All Articles
- Compact hero ("Complete Archive")
- Week picker dropdown + tag filters
- Articles shown in grid view (cards from all weeks combined)
- Filters by both week AND tag simultaneously

---

## Image Loading System

Every article card displays an image thumbnail. Images are loaded automatically via JavaScript using a priority-based fallback chain:

### Priority order (list view cards)

| Priority | Method | When it's used |
|----------|--------|----------------|
| 1 | **YouTube thumbnail** | If the card has a `data-yt-id` attribute — uses maxresdefault, falls back to hqdefault |
| 2 | **thum.io screenshot** | Takes a live screenshot of the article's URL (skipped for Substack — returns black) |
| 3 | **Microlink OG image** | Fetches the article's Open Graph image via `api.microlink.io` — rejects images smaller than 300px |
| 4 | **Branded gradient fallback** | Shows a colored gradient matching the section (blue/teal/purple) with the source name as a label |

### Fallback gradient colors

| Section | Gradient |
|---------|----------|
| A (Product & Release Updates) | Blue: `#1d4ed8` → `#3b82f6` |
| B (Practical Workflows & Examples) | Teal: `#0d9488` → `#14b8a6` |
| C (Deeper Thinking & Case Studies) | Purple: `#7c3aed` → `#a78bfa` |

### How it works (non-technical summary)

1. When the page loads, JavaScript looks at each article card
2. It pulls the article URL from the card's link
3. It tries to load an image using the priority chain above
4. If an image loads successfully, it replaces the placeholder icon
5. If all methods fail, it shows a colored gradient with the source name

### Data attributes on image containers

| Attribute | Purpose |
|-----------|---------|
| `data-url` | The article URL to fetch an image for (auto-populated from card href) |
| `data-yt-id` | YouTube video ID (for YouTube thumbnails) |
| `data-section` | Section letter (a/b/c) — determines fallback gradient color |
| `data-label` | Source name shown on gradient fallback |

---

## Responsive Behavior

**Breakpoint: 900px**

| Desktop (> 900px) | Mobile (≤ 900px) |
|---|---|
| Sidebar visible, fixed left | Sidebar hidden off-screen (slides in) |
| Main content offset by sidebar width | Main content full width |
| Hero padding: 48px 40px | Hero padding: 32px 24px |
| Hero title: 32px | Hero title: 24px |
| Main padding: 32px 40px | Main padding: 20px |
| Hamburger menu hidden | Hamburger menu visible (top-left) |
| Card image: 200×130px on the left | Card image: full width, 160px tall on top |

The hamburger toggle button appears at 900px and opens/closes the sidebar with a slide animation.

---

## Animations & Interactions

| Element | Effect | Details |
|---------|--------|---------|
| Hero glow | Pulsing radial gradients | 8s ease-in-out, alternating opacity + scale |
| Article cards | Fade-in on load | 0.4s, staggered 0.05s between cards |
| Card hover | Lift + glow | translateY(-2px list / -3px grid), blue box-shadow |
| Filter chip hover | Lift + border glow | translateY(-1px), blue border + shadow |
| Sidebar nav hover | Background tint | Blue-tinted background on hover |
| Page transitions | Instant swap | No animation between pages (show/hide) |

---

## Spacing & Sizing Reference

| Element | Value |
|---------|-------|
| Sidebar width | 260px |
| Border radius (cards) | 12px |
| Border radius (hero) | 20px |
| Card padding | 20px 24px |
| Card gap (list) | 16px |
| Card gap (grid) | 20px |
| Filter chip padding | 8px 16px |
| Hero padding | 48px 40px |
| Main content padding | 32px 40px |
| Nav item padding | 10px 12px |
| Scrollbar width | 6px |
| Grid min column width | 280px |

---

## SVG Icons

Each article card has a placeholder icon colored by section:

| Section | Icon stroke color |
|----------|-----------------|
| Product & Release Updates | `#6366f1` (indigo) |
| Practical Workflows & Examples | `#0d9488` (teal) |
| Deeper Thinking & Case Studies | `#7c3aed` (purple) |

---

## Notes for contributors

- **Don't edit the sidebar HTML** — it auto-generates from page data attributes
- **Don't edit the "All Articles" page** — it auto-populates from all week pages via JavaScript
- **Don't edit the CSS or JavaScript** unless discussing a design change first
- **Tag display names must match filter chip names exactly** — see the Tags table above
- When adding articles, follow the card HTML format in the SKILL.md file
