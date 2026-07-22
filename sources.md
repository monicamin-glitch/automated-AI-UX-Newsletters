# External Digest Sources

Public sources searched for the weekly **External Updates** section. Internal Slack discovery is defined separately in [`slack-spotlight.md`](slack-spotlight.md), and evergreen internal links are maintained in [`resources-hub.md`](resources-hub.md).

Do not add Slack channels, internal Drive documents, or Resource Hub links to this file.

---

## Section A — Product and release updates

*Goal: What AI tools and features are newly available for UX teams?*

| Source | Where to look |
|---|---|
| Anthropic / Claude | anthropic.com/news · support.claude.com/en/articles/12138966-release-notes |
| OpenAI | openai.com/blog · help.openai.com/en/articles/6825453-chatgpt-release-notes |
| Figma | figma.com/release-notes · figma.com/blog |
| Google Stitch | blog.google (search: Stitch) · labs.google |
| Miro | miro.com/blog/ai · miro.com/newsroom |
| Bolt | bolt.new/blog · docs.bolt.new/changelog |

## Section B — Practical workflows and examples

*Goal: How are designers actually using these tools day to day?*

| Source | Where to look |
|---|---|
| YouTube | Search: "Claude Code Figma MCP tutorial", "Figma Make design tutorial", "Figma Make AI prototype", "Google Stitch design tutorial", "Miro AI workflow tutorial" |
| Community | newsletter.uxdesign.cc · medium.com/design-bootcamp |

## Section C — Deeper thinking and case studies

*Goal: Strategic reads worth discussing as a UX team.*

| Source | Where to look |
|---|---|
| Nielsen Norman Group | nngroup.com/articles |
| Lenny's Newsletter | lennysnewsletter.com/feed · lennysnewsletter.com/archive |
| Google Design | design.google/library |
| Google PAIR | pair.withgoogle.com |

---

## Coverage rules

- Audit every source row for the target Monday–Sunday date range.
- Prefer official source URLs. Third-party coverage may be used for discovery but not as the final link when an official page exists.
- Mark each source as `included`, `no new UX-relevant update`, `access blocked`, or `needs manual review` in the run summary.
- Include all validated UX-relevant items, up to five per source. Do not create filler content.
- Confirm every publication date belongs to the selected ISO calendar week.
- Verify that the link, title, source, image, and summary all describe the same update.

## UX relevance filter

Include an external update only when it materially helps at least one of these audiences or activities:

- UX or product design
- UX research and synthesis
- UX writing and content design
- AI product experience and trust
- Prototyping and design-to-development handoff
- Design systems, accessibility, or UI engineering
- AI-tool adoption, governance, setup, cost, or model choice when it changes UX practice

Skip finance, legal, hardware, backend-only, and unrelated industry news unless there is a concrete UX implication.

## External-card output

Each selected item must provide:

```yaml
- title: Exact article title
  source: Source name
  published_date: YYYY-MM-DD
  url: https://official-source.example/article
  image: assets/weekXX/example.ext
  top_pick_rank: 1 # optional; only 1, 2, or 3
  what_is_the_update: One concise explanation of what changed.
  why_valuable_for_uxers: One concise explanation of the UX value.
```

The first three editorial picks receive badges. All remaining items stay in the same card grid without a separate “More articles” section.
