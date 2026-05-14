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

Search the sources in [`sources.md`](sources.md) for content published in the **last 7 days**. For each item found:
- Write the **title** as a clickable markdown link to the original source URL
- Include the **source name** and **date**
- Write a **2-sentence UX impact summary**: what changed, and how it affects UX work specifically
- If no new content was found for a source this week, skip it silently

Organise everything into the 3 sections defined in `sources.md`. When done, do three things:
1. Append the digest to the Google Doc: `https://docs.google.com/document/d/1H_Sec7iPUkGR9SyGg-iHieUNwsaS2P4PKrHVZiyn650/edit`
2. Update `/Users/ymin/claude_project/UX AI newslettler/digest/index.html` with the new week's content, replacing the previous week's items while keeping the same HTML structure and styles
3. Push the updated HTML to GitHub by running:
   ```
   cd "/Users/ymin/claude_project/UX AI newslettler/digest" && git add -A && git commit -m "Digest: Week of [Monday's date]" && git push
   ```

Format the heading as: `## Week of [Monday's date]`

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

---

## Related files

| File | Purpose |
|------|---------|
| [`sources.md`](sources.md) | What to search and where — add/remove sources here |
| [`media-strategy.md`](media-strategy.md) | How images and media are displayed on the website |
| [`design-spec.md`](design-spec.md) | Layout, navigation, and visual design decisions (collaborator-owned) |
| `index.html` | The published website |
