# Media & Image Strategy

Every item on the website **must** have a corresponding image or visual. Use the following priority system:

---

## Full cards (hero images)

These are the large image areas on featured items (Section A highlights, Section C deep reads).

| Priority | Method | When to use |
|----------|--------|-------------|
| 1 | **YouTube thumbnail** | If the item has a related YouTube video, use `https://img.youtube.com/vi/[VIDEO_ID]/maxresdefault.jpg` with `hqdefault.jpg` as onerror fallback |
| 2 | **thum.io screenshot** | For blogs/articles: `https://image.thum.io/get/width/1200/crop/675/[article-url]` — takes a screenshot of the actual page |
| 3 | **Microlink OG image** | Add `data-url="[article-url]"` — JS fetches the og:image at runtime via `api.microlink.io`. Reject images < 300px wide |
| 4 | **Branded gradient fallback** | If all above fail: show a gradient in the section color (blue/green/purple) with a source label |

**Important notes:**
- thum.io does NOT work for Substack (returns black) — use microlink or podcast cover for those
- For podcast episodes (e.g. Lenny's), add `data-accept-any="true"` to accept square cover art regardless of dimensions. Display with `width: 55%`, centered on a warm background, padded
- Add `.img-overlay` with podcast name + guest name when displaying podcast covers

---

## Link-row thumbnails (88×58px)

These are small thumbnails on the right side of link-row items.

| Priority | Method | When to use |
|----------|--------|-------------|
| 1 | **YouTube thumbnail** | If `data-yt-id` is set, use `img.youtube.com/vi/[id]/mqdefault.jpg` |
| 2 | **Microlink OG image** | Fetch via `api.microlink.io` — reject if < 200px wide (tiny logos/avatars) |
| 3 | **Brand icon** | Use `https://logo.clearbit.com/[domain]?size=72` — a clean square logo centered on light gray |
| 4 | **Gray gradient** | Neutral fallback |

---

## HTML data attributes reference

| Attribute | On | Purpose |
|-----------|-----|---------|
| `data-url` | `.card-image`, `.link-thumb` | URL to fetch OG image from via microlink |
| `data-yt-id` | `.card-image`, `.link-thumb` | YouTube video ID for thumbnail |
| `data-section` | `.card-image` | Section letter (a/b/c) for gradient fallback color |
| `data-label` | `.card-image` | Source name shown on gradient fallback |
| `data-domain` | `.link-thumb` | Domain for Clearbit brand icon fallback |
| `data-accept-any` | `.card-image` | Accept any image size (for podcast covers) |

---

## Web search tool

Use `mcp__web-search__web_search` (Toolbox MCP) for all searches. Built-in WebSearch and subagent tools do not work in this environment.

---

## CSS card types

| Class | Description |
|-------|-------------|
| `.card-image` | Standard 16:9 hero image |
| `.card-image.is-video` | YouTube card with play button overlay |
| `.card-image[data-accept-any]` | Podcast/square cover — adapts frame to image |
| `.card-image.fallback.fallback-a/b/c` | Branded gradient when no image loads |
| `.card-image.text-card` | Title-as-image card (for articles with no usable media) |
| `.link-thumb` | Small 88×58px thumbnail in link rows |
| `.link-thumb.brand-icon` | Square logo centered on light background |

---

## Website file

**Path:** `/Users/ymin/claude_project/UX AI newslettler/digest/index.html`

The site is a single static HTML file with:
- 3-section layout: A (Product), B (Workflows), C (Deeper Thinking)
- Tab navigation
- Responsive design (mobile breakpoint at 600px)
- CSS shimmer loading animation
- Client-side JavaScript for image loading (microlink + fallbacks)
- YouTube thumbnail fallback chain (maxresdefault → hqdefault)
