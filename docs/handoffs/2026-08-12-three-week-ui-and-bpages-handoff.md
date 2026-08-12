# AI × Design newsletter handoff — 2026-08-12

This note compacts the work completed with Monica during the July 25–August 10 review. It is the starting point for the next collaborator update.

## Current published state

- GitHub Pages: `https://monicamin-glitch.github.io/automated-AI-UX-Newsletters/`
- Booking Pages: `https://bpages.booking.com/048eM/ai-ux-newsletter`
- B.Pages artifact ID: `4de2388206`
- B.Pages access: `booking`
- B.Pages shell title: `Wang Zi`
- Public website commit: `62406e4` (`Publish collaborator UI and three-week digest`)

The published website now follows the collaborator UI and includes Week 30, Week 31, and Week 32. Week 32 covers August 4–10, 2026.

## Final UI decisions

- Keep the collaborator navigation, typography, spacing, cards, filters, calendar archive, Resources Hub, and Slack-detail dialog.
- The website header shows `AI × Design` with `Shanghai` underneath.
- The far-right header credit reads `Created by Monica Min · Wang Zi` on B.Pages.
- The Booking Pages shell displays `Wang Zi by Monica Min`; `by Monica Min` is supplied by the B.Pages owner metadata.
- Internal-update cards open an in-page detail dialog. The dialog title, author, date, reply count, content, and original Slack link remain visible.
- External cards keep the collaborator hover/read interaction and the source-led media strategy.

## Content merged

- Week 30: July 20–26
- Week 31: July 27–August 2 — 6 internal and 10 external cards
- Week 32: August 4–10 — 10 internal and 9 external cards
- Weeks 30–32 are available through the calendar archive without changing older week content.

## Slack detail policy

The two destinations intentionally differ because this GitHub repository is public:

- **B.Pages:** Booking-only version. Recent Week 31–32 cards use verified original Slack parent messages in the detail dialog. Thread replies are represented by reply counts and remain available through `View in Slack`.
- **GitHub Pages:** public-safe version. It uses the same UI and editorial card content, but Slack dialogs show newsletter summaries instead of internal original messages.
- Do not commit original internal Slack text, private-channel data, access codes, or the private B.Pages build artifact to this repository.
- Recording passwords/passcodes are omitted from the B.Pages dialog; readers can open the original Slack post when authorized.

## Media policy

- Weeks 30–32 use checked-in local media under `assets/week30`, `assets/week31`, and `assets/week32`.
- The topic banner is `assets/internal/colleagues-topic-banner-v4.jpg`.
- B.Pages loads these non-sensitive images from GitHub Pages to avoid its artifact-size limit and its security block on embedded `data:` image URIs.
- Preserve source-native media where available; generated fallbacks remain labelled in the weekly source data.

## Next update checklist

1. Fetch the next Monday–Sunday week using the definitions in `digest.md` and `sources.md`.
2. Keep the collaborator UI unchanged; replace only the latest-week content and add the previous latest week to the archive.
3. Verify original Slack parent messages for internal cards. Keep them out of the public GitHub build.
4. Prepare and validate local media before publishing.
5. Publish the summary-only version to GitHub Pages.
6. Publish the Booking-only version to B.Pages artifact `4de2388206` without changing its URL or access level.
7. Confirm the B.Pages header credit remains `Created by Monica Min · Wang Zi` and the shell title remains `Wang Zi`.

## Privacy boundary for future collaborators

The local preview/build workspace contains internal-only source material used to assemble the B.Pages version. It is deliberately not tracked. If that material is unavailable, refetch the selected parent messages from their Slack permalinks rather than copying them from public GitHub.
