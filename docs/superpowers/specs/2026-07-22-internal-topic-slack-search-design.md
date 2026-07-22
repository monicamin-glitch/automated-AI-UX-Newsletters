# Internal Popular Topics and Slack Search Design

## Goal

Make “What colleagues are talking about this week?” distinctly Booking-specific and let readers inspect the evidence behind each topic in Slack.

## Topic selection

- Keep only named Booking.com platforms, internal integrations, community events, or internally built tools that appeared in the scanned week's Slack messages.
- Exclude vendor products, public model names, open protocols, and broad industry concepts even when they have more mentions.
- Do not pad the list with generic terms. The component supports fewer than ten topics.
- For Week 29, show these four topics in this order:
  1. Agent Fabric — 16 mentions, 13 channels
  2. Skills MCP — 8 mentions, 2 channels
  3. Design+AI Summit — 2 mentions, 2 channels
  4. AI Illustration Generator — 1 mention, 1 channel

`Skills MCP` remains eligible because it refers to Booking's internal Skills Catalog integration, rather than MCP as a general protocol.

## Slack search interaction

- Treat the complete metadata row—mentions, separator, channels, and right arrow—as one link.
- Default state remains visually quiet and consistent with the current card.
- On hover and keyboard focus, the row uses Booking blue text with a pale-blue background and the arrow shifts slightly to the right.
- The accessible label states the topic and week, for example: “Search Agent Fabric in Booking Slack for Week 29”.
- Open the result in a new tab without giving the new page access to the newsletter tab.

## Search query

Each topic links to the Booking Slack web workspace search with an exact phrase and Week 29 boundaries:

```text
"<topic>" after:2026-07-12 before:2026-07-20
```

The exclusive boundaries cover Monday July 13 through Sunday July 19, 2026. The URL is generated with `encodeURIComponent` and uses the Booking Enterprise Slack workspace. Slack may open in the desktop app when the reader's Slack link preference enables it; otherwise it opens the same search in Slack for web.

## Data ownership

- `slack-spotlight.md` owns the internal-only eligibility rule and the current-week topic output.
- `draft-new-ia.html` renders the current output and creates the search links.
- `design-spec.md` owns the visible hover, focus, arrow, and link behavior.

## Verification

- Assert exactly four current-week topics and confirm generic topics are absent.
- Assert every topic produces a Booking Slack search URL with an exact phrase and correct week boundaries.
- Assert the full metadata row is one accessible link with safe new-tab attributes.
- Preserve topic cycling, animation, reduced-motion behavior, and the rule that this block appears only on Latest Week.
