# Learning Plan

Canonical content and maintenance rules for the manually curated **Learning Plan** page.

The page is independent of the weekly newsletter archive. Routine weekly refreshes must preserve it unchanged.

---

## Ownership and update model

- Design CN owns the course list.
- Content is updated manually and occasionally; do not discover or add courses automatically.
- The planning spreadsheet is a reference source, not a runtime dependency: [Design CN learning plan](https://docs.google.com/spreadsheets/d/1Q1VurFiFBMKT5wwcI_mP0O9TTEk_Lv8GY5qy-shkOuw/edit?gid=578146574#gid=578146574).
- Only publish resource URLs supplied or verified by a human. Never guess a missing destination.
- Newest month appears first. Older months remain on the same page as a static archive.

## Entry schema

Each learning entry contains:

```yaml
date: YYYY-MM-DD
display_date: Sep 8
topic: Course or session title
duration: 30 min
type: Video Course | Internal Sharing | Roundtable Discussion
presenter: Optional person or people
action_label: Watch | View # optional
url: https://verified-destination.example # optional
```

When `url` is unavailable, omit the action entirely. Do not render `Link coming soon`, an empty link, or a disabled placeholder.

## September 2026

| Date | Topic | Duration | Type | Presenter | Action |
|---|---|---:|---|---|---|
| Sep 1 | Rebuilding booking.com guest experience pages with code-first | 25 min | Video Course | — | [View](https://drive.google.com/drive/folders/1VaNwxBUOhNfyCJ7U0c4249cU0o-LXqhJ) |
| Sep 8 | PP Demand Page Prototype First Workflow | 30 min | Internal Sharing | Echo | [View](https://docs.google.com/presentation/d/1kMiVRRVZslieJJZruMM0s4f35s5t6meCGRqQY9EiPfA/edit?usp=sharing) |
| Sep 15 | How I use Obsidian + Claude Code to run my life (Part 1) | 30 min | Video Course | — | [Watch](https://www.youtube.com/watch?v=6MBq1paspVU) |
| Sep 18 | AI Product Sharing | 30 min | Internal Sharing | Alroy and Allen | — |
| Sep 22 | How I use Obsidian + Claude Code to run my life (Part 2) | 30 min | Video Course | — | [Watch](https://www.youtube.com/watch?v=6MBq1paspVU) |
| Sep 29 | Using Claude Code to Create Animations for YIT | 30 min | Internal Sharing | Shiwen | — |

## August 2026

The July 28 kickoff remains grouped with August because it belongs to the supplied August learning plan.

| Date | Topic | Duration | Type | Presenter | Action |
|---|---|---:|---|---|---|
| Jul 28 | Write a well-structured prompt | 20 min | Video Course | — | [Watch](https://drive.google.com/file/d/17awpWPaVAt9FRTKKRI_x1TWryk0Zf86e/view?usp=sharing) |
| Aug 4 | Preserving Learning and Critical Thinking While Using Claude Code, Codex, and NotebookLM (Part 1) | 30 min | Video Course | — | [Watch](https://drive.google.com/file/d/1J7uIh1-cy2QfKf-TEIRx-KJINfV_YRwM/view) |
| Aug 11 | Preserving Learning and Critical Thinking While Using Claude Code, Codex, and NotebookLM (Part 2) | 30 min | Video Course | — | [Watch](https://drive.google.com/file/d/1J7uIh1-cy2QfKf-TEIRx-KJINfV_YRwM/view) |
| Aug 18 | Discussion: How to eliminate manual fixing of AI-generated Figma designs | 30 min | Roundtable Discussion | — | — |
| Aug 25 | Turning a Rough Idea into Reality with AI Page Builder | 30 min | Video Course | — | [Watch](https://drive.google.com/file/d/1NmLID0vCYnoV3naLds5idkKAp-VOpGEw/view?t=1.482) |

## Rendering contract

Visual and interaction rules live in [`design-spec.md`](design-spec.md). In summary:

- Use the fourth top-navigation tab, `Learning Plan`, with direct route `?page=learning`.
- Start directly with the newest month; do not add a page-level title, subtitle, or illustration.
- Show the month in a quiet left rail and independent agenda cards on the right.
- Separate months with whitespace, not divider lines.
- Use `Video Course` for video-learning type badges.
- Use one green `Internal Sharing` badge treatment for all internal sharing sessions; there is no DDP-specific variant.
- Keep the action visually separate from the type badge and open verified resources in a safe new tab.
- Preserve a readable, non-overlapping layout at 390px without horizontal scrolling.

## Update checklist

1. Update this file first.
2. Mirror the approved content in `index.html` without changing weekly reports or Resources Hub content.
3. Add or update tests for any new action URL or behavior.
4. Run the focused Learning Plan tests and the repository validation suite.
5. Update the existing B.Pages artifact; do not create a second newsletter URL.

