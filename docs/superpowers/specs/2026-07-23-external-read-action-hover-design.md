# External Read Action Hover Design

## Goal

Keep the External Update card action visually stable during hover and keyboard focus.

## Approved behavior

- `Read article` keeps its default primary-blue text color.
- Hovering the External card does not change the action text color or add a tinted background.
- Hovering or focusing the action itself does not change its text color or add a tinted background.
- The existing subtle arrow movement may remain.
- Slack’s `View in Slack` hover and focus treatment remains unchanged.
- The rule applies to External cards on both Latest Week and All Weeks.

## Implementation

Separate the External action from the shared Slack hover selector. Give `.masonry-card-action` an explicit transparent background and preserve its default primary color across card hover, direct hover, and focus-visible states.

## Verification

- Add a static regression test confirming that External actions are excluded from the Slack blue-tint hover selector.
- Confirm the External action states preserve `color: var(--primary)` and `background: transparent`.
- Run the complete static suite and the opt-in browser interaction test.
