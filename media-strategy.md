# Media & Image Strategy

Every website item should render an effective visual. The current site uses `.article-card-image` on weekly cards and generates `.article-grid-image` blocks for Explore All.

---

## Media Prepare Step

Run the media prepare step before publishing a weekly update:

```bash
node scripts/prepare-media.mjs --write-manifest
```

This checks every public update card in `index.html`, confirms the card resolves to a checked-in local image, and writes `assets/media-manifest.json` with the source URL, selected local media, dimensions, file size, and any quality warnings.

Treat the script as a pre-publish quality gate:

- **Errors must be fixed before publishing**: missing local media, broken asset paths, blocked/login screenshots, unsupported files, or cards that would rely on Microlink/thum.io/runtime fallback.
- **Warnings should be reviewed**: unusual aspect ratio, tiny logo-like files, very small images, or large files that may push B.Pages over the upload limit.
- **Slack Spotlight cards are intentionally excluded** from the public-card media gate because their generated internal-source visual is acceptable unless a reviewed internal image is explicitly available.

The value of this step is consistency: the public website should show the same relevant, high-quality media on local preview, GitHub Pages, and B.Pages. Runtime thumbnail services can remain as backup for unknown future links, but current published cards should use local, validated media.

### Media Selection Priority

When adding new cards, choose media in this order:

| Priority | Use | Why |
|---|---|---|
| 1 | Existing `assets/weekXX/` image via `data-img` | Most stable for weekly product/release cards |
| 2 | Cached source-native image in `assets/external/` via `localPreviewImagesByUrl` | Best for articles/newsletters where the source has a useful hero or OG image |
| 3 | Cached YouTube thumbnail | Better than runtime YouTube dependency for important workflow videos |
| 4 | Generated branded fallback | Acceptable for internal/Slack cards or when no good source image exists |
| 5 | Microlink/thum.io runtime fetch | Backup only; do not rely on this for published cards |

### Source-Specific Rules

- **Figma**: prefer Figma Blog, Config, product, or event visuals. Avoid investor-page and help-center screenshots when they produce logos, blocked pages, or generic support UI.
- **Lenny's Newsletter, UX Collective, Substack**: cache the Substack/OG hero image locally; do not depend on runtime CDN preview fetching.
- **Nielsen Norman Group**: cache article or video thumbnail media from the source page.
- **YouTube**: cache the thumbnail locally for high-priority workflow cards; `data-yt-id` is acceptable only as a fallback.
- **Slack/internal updates**: use the generated Slack/internal visual by default. Only use real internal images when reviewed for publication.

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
