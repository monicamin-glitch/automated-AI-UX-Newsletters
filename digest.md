# Weekly AI & Design Digest

Generate a weekly digest of the latest AI and design news, filtered for UX relevance, and publish it as a website via GitHub.

## Who this is for

A UX design team that wants to stay current on AI tools (Claude, OpenAI, Figma, Google Stitch) and design thinking — without spending time manually searching. The digest is written for designers, not developers: every item explains **how it impacts UX work**, not just what it is.

## Usage

```
/digest
/digest figma          ← only Figma updates
/digest section-b      ← only Practical Workflows
/digest full           ← all sections (default)
```

## Instructions

Search the sources below for content published in the **last 7 days**. For each item found:
- Write the **title** as a clickable markdown link to the original source URL
- Include the **source name** and **date**
- Write a **2-sentence UX impact summary**: what changed, and how it affects UX work specifically
- If no new content was found for a source this week, skip it silently

Organise everything into the 3 sections below. When done, do two things:
1. Append the digest to the Google Doc: `https://docs.google.com/document/d/1H_Sec7iPUkGR9SyGg-iHieUNwsaS2P4PKrHVZiyn650/edit`
2. Update `/Users/ymin/digest/index.html` with the new week's content, replacing the previous week's items while keeping the same HTML structure and styles

Format the heading as: `## Week of [Monday's date]`

---

## Section A — Product & Release Updates
*Goal: What tools and features are newly available for UX teams?*

| Source | Where to look |
|---|---|
| Anthropic / Claude | anthropic.com/news · support.claude.com/en/articles/12138966-release-notes |
| OpenAI | openai.com/blog · help.openai.com/en/articles/6825453-chatgpt-release-notes |
| Figma | figma.com/release-notes · figma.com/blog |
| Google Stitch | blog.google (search: Stitch) · labs.google |

---

## Section B — Practical Workflows & Examples
*Goal: How are designers actually using these tools day-to-day?*

| Source | Where to look |
|---|---|
| YouTube | Search: "apply Claude Code to Figma design", "UX design AI tools 2026", "AI and UX", "Figma AI workflow", "Google Stitch tutorial" |
| X / Twitter (best effort) | @figma · @steveschoger · @darylginn · @uiuxwren · @emilkowalski_ |
| Newsletters | sidebar.io · densediscovery.com · aidesignfeeds.com |
| Community | newsletter.uxdesign.cc · medium.com/design-bootcamp |

---

## Section C — Deeper Thinking & Case Studies
*Goal: Strategic reads worth discussing as a team.*

| Source | Where to look |
|---|---|
| Nielsen Norman Group | nngroup.com/articles |
| Brad Frost | bradfrost.com/blog |
| Lenny's Newsletter | lennysnewsletter.com |
| Google Design | design.google/library |
| Pinterest Engineering | medium.com/pinterest-engineering |
| Airbnb Design | airbnb.design |
| Spotify Design | spotify.design |

---

## Output format (per item)

```
**[Article Title](exact-url)** · Source · Date
UX impact summary in 2 sentences. First sentence: what changed. Second sentence: how it specifically affects UX design work.
```

---

## UX relevance filter

Only include items relevant to at least one of these:
- AI design tools (Figma, Stitch, Claude, OpenAI in design contexts)
- UX research methods or tools
- Design systems and component libraries
- Prototyping and design-to-dev handoff
- Product design strategy and career
- AI product design (designing AI-powered experiences)

Skip items about: finance, legal, hardware specs, unrelated industries.
