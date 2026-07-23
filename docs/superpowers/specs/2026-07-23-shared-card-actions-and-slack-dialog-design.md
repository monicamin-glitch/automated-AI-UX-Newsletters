# Shared Card Actions and Slack Dialog Design

## Goal

Restore a consistent card hierarchy and interaction model across Latest Week and All Weeks:

- Slack metadata ends with `replies · View in Slack ↗`.
- Slack and External Update titles use 16px.
- Slack dialogs show an author avatar and one compact `date · replies` line.
- External `Read article ↗` aligns with the card copy and begins 8px after it.

The existing summaries, destinations, filters, archive content, and full Slack parent-message dialog content remain unchanged.

## Shared Slack card structure

Every Slack card is enhanced into a button-like `article`:

1. Channel tile
2. Title
3. Summary
4. One metadata row containing:
   - Slack logo
   - `posted by [name], [date]`
   - reply count
   - `View in Slack ↗`

The article is the primary action. Clicking it, or pressing Enter/Space while it has focus, opens the Slack detail dialog.

`View in Slack ↗` is a real nested anchor and the secondary action. It opens the verified Slack permalink in a new tab and stops click propagation so it never opens the dialog.

This replaces the current full-width inner button plus detached footer link. The new structure avoids invalid nested interactive controls and lets the secondary action sit in the metadata row.

## Slack card visual rules

- Slack title: 16px, weight 700.
- Summary: retain the approved 14px reading size.
- Metadata: retain 12px regular muted text.
- Reply count remains muted grey.
- `View in Slack ↗` uses primary blue, 12px, weight 600.
- The external-link arrow is part of the action and uses the same baseline and hover state as the label.
- The inline action receives the existing pale-blue hover/focus background without shifting the metadata row.

## Slack dialog author block

The dialog body begins with a compact author identity row:

- 36×36px circular avatar.
- Use an available profile image when one is stored with the card.
- Otherwise generate initials from the stored author name.
- Initials use a deterministic soft-blue background and dark-blue text.
- Author name appears on the first line.
- Date and reply count share the second line as `[date] · [reply count]`.
- Reactions remain below the author identity row and are hidden when empty.

The dialog continues to show the complete verified parent message. The existing sanitizer, safe-link handling, scrolling, close controls, focus restoration, and mobile bottom-sheet behavior remain unchanged.

## External Update card rules

- External title: 16px, weight 700.
- Summary remains 14px.
- `Read article ↗` shares the same 12px action typography as `View in Slack ↗`.
- Remove horizontal action padding so the label aligns exactly with the source, title, and summary.
- Keep 8px between the summary region and the action.
- Preserve equal-height rows by letting the summary region grow while the action remains at the bottom.

## Responsive behavior

The same enhanced Slack card and External card styles are used in Latest Week and cloned All Weeks reports.

On mobile:

- Slack metadata may wrap naturally, but reply count and `View in Slack ↗` remain adjacent when space permits.
- The card remains one keyboard focus target plus the nested Slack link.
- The dialog avatar remains 36×36px.
- External actions retain left alignment and the 8px content gap.

## Accessibility

- Slack article uses `role="button"`, `tabindex="0"`, `aria-haspopup="dialog"`, and an action-specific accessible label.
- Enter and Space open the dialog only when the article itself is the active target.
- The nested Slack link remains independently keyboard focusable.
- Focus returns to the Slack article after the dialog closes.
- Both inline actions retain visible hover and focus states.

## Verification

Automated coverage must verify:

- Both title classes use 16px.
- Every prepared Slack card places `View in Slack ↗` inside `.slack-card-meta` after replies.
- Card click and Enter/Space open the dialog; the nested link does not.
- Dialog initials are derived from the author and rendered in the avatar.
- Dialog date and replies share one metadata line.
- External actions have no horizontal padding and have an 8px content gap.
- Latest Week and All Weeks use the same enhancement path.
- Desktop and 390px Chrome runtime tests remain free of overflow and preserve focus restoration.
