# Remove Popular Topics from All Weeks

## Goal

Keep **What colleagues are talking about this week?** exclusive to Latest Week. All Weeks should show only the selected week's Internal Updates and External Updates.

Ensure every Slack and external card rendered in All Weeks opens its original destination rather than a `#` placeholder.

## Behavior

- Latest Week keeps the illustrated Popular Topics block, Top 10 topic data, and “Show next topic” interaction unchanged.
- All Weeks does not render, clone, reserve space for, or visually hide a Popular Topics block.
- Selecting Week 28 or Week 29 in All Weeks updates only Internal Updates, filters, Slack cards, External Updates, and external cards.
- Historical topic data may remain in archived source markup for preservation, but the All Weeks rendering path must not copy it into the page.
- Resources Hub remains unchanged.
- Every archived Slack card uses its verified Slack permalink.
- Every archived external card uses the official article URL when available.
- Archived card links open in a new tab with `rel="noopener noreferrer"`.

## Implementation

Remove `.weekly-topic` from the list of nodes copied by `syncArchiveWeekContent()`. Do not solve the issue with CSS because hidden duplicate content would remain in the document and accessibility tree unless additional handling were added.

Replace the Week 28 archive template's placeholder links with verified Slack permalinks and official public URLs. Week 29 already contains real destinations and should remain unchanged.

## Verification

- Assert that `#archive-week-content` never receives `.weekly-topic`.
- Assert that Latest Week still contains exactly one `.weekly-topic` and retains its topic interaction.
- Assert that the Week 28 archive template contains no `href="#"` and that all 15 archived cards use safe new-tab attributes.
- Run the complete existing test suite and visually check Latest Week and All Weeks.
