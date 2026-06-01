# Media & Image Strategy

Every website item should render an effective visual. The current site uses `.article-card-image` on weekly cards and generates `.article-grid-image` blocks for Explore All.

---

## Runtime Priority

For each card image, the JavaScript loader tries this order:

| Priority | Method | Required attribute |
|---|---|---|
| 1 | Explicit direct image URL | `data-img="[image-url]"` |
| 2 | YouTube thumbnail | `data-yt-id="[VIDEO_ID]"` |
| 3 | Microlink OG image | parent card `href` or image `data-url` |
| 4 | thum.io page screenshot | parent card `href` or image `data-url` |
| 5 | Generated branded visual | `data-section` + `data-label` |

The generated visual is intentional: if external image services are slow, rate-limited, or blocked, the card still shows a polished source-specific image instead of a blank or plain gradient.

---

## Required Attributes

Every image block should include:

```html
<div class="article-card-image"
     data-section="a"
     data-label="OpenAI"
     data-img="https://optional-direct-image-url.jpg">
```

| Attribute | On | Purpose |
|---|---|---|
| `data-section` | `.article-card-image`, `.article-grid-image` | Section color: `a` product, `b` workflows, `c` thinking, `d` Slack |
| `data-label` | `.article-card-image`, `.article-grid-image` | Source label used in fallback/generated visuals |
| `data-img` | `.article-card-image`, `.article-grid-image` | Optional stable direct image/OG image URL |
| `data-url` | `.article-card-image`, `.article-grid-image` | Optional URL for OG/screenshot lookup; auto-filled from card `href` |
| `data-yt-id` | `.article-card-image`, `.article-grid-image` | YouTube thumbnail ID |

Do not use old `.card-image` or `.link-thumb` selectors. They belong to the previous site structure.

---

## Fetching Guidance

- For the published/latest week, prefer checked-in local media assets under `assets/weekXX/` and wire them with `data-img`. This avoids blank cards when external image services are slow, blocked, or rate-limited.
- Prefer official article images or stable OG images when available.
- For YouTube, set `data-yt-id` so the loader can use YouTube thumbnails.
- For Substack/newsletter sources, prefer `data-img` from the OG image because screenshot services often return poor results.
- For Slack Spotlight cards, use `data-section="d"` and `data-label="Slack"`; the generated visual is acceptable unless a specific shared image is available.
- Avoid depending on Microlink or thum.io as the only visual path. They are runtime enhancement services and can be rate-limited.

---

## Explore All

The Explore All grid is generated from weekly `.article-card` elements. Do not manually edit grid cards. The script clones each weekly card image into `.article-grid-image`, then runs the same media loader so all views have matching visuals.

---

## Verification

After updating `index.html`, run a browser check and confirm:

- Latest cards with images equals latest card count.
- Explore All grid cards with images equals Explore All card count.
- YouTube cards show either a thumbnail or generated YouTube visual.
- Slack cards show a generated Slack visual if no direct media exists.
