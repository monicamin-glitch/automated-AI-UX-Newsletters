# Slack Weekly Highlights Bot

Use this workflow to publish a simplified weekly AI x UX highlight into an internal UX Slack channel after manual approval.

The Slack post is intentionally shorter than the website. It is split into two categories:

- **Internal Slack updates**: selected Slack Spotlight items with source channel and direct Slack permalink.
- **External AI updates**: selected public AI/design updates with source link.

For a richer output like a Slack doc/canvas, generate **Canvas-flavored Markdown** from the approved draft. A Canvas is better when you want a persistent newsletter-style page with headings, sections, columns, and richer formatting. A normal Slack message is better when you want a short announcement in the channel.

---

## One-Time Setup

Create a Slack app/bot and install it to the workspace with:

- `chat:write`
- Optional: `chat:write.public` only if the bot must post to public channels without being invited

Invite the bot to the target internal UX channel, then keep these values outside git:

```bash
export SLACK_BOT_TOKEN="xoxb-..."
export SLACK_CHANNEL_ID="C03NSF0EGFQ"
export SLACK_REVIEWER_ID="U07UFBBSZ9D"
```

The current target channel is `#china-ux-group-internal` (`C03NSF0EGFQ`).
Use the channel ID instead of the channel name so posting stays stable if the channel is renamed.
Use the reviewer ID for the private approval picker before the final channel share is created.

---

## Weekly Workflow

The main newsletter website refresh runs every Monday at 10:00. Generate the Slack highlights draft only after that refresh has completed and `automation-status/weekly-refresh-status.json` says `status: "published"`, so your manual picks come from the newly updated B.Pages website. The recommended Slack draft window is Monday around 11:30 to leave room for source fetching, media preparation, GitHub push, and B.Pages publishing.

For the next weekly share, use the Canvas version represented by `https://booking.enterprise.slack.com/docs/T0AMUUBC7/F0BEHNEPZT9`: two columns for Internal Slack updates and External AI updates, concise headlines, one `Why UXers care` line per item, direct Slack message links for internal items, source links/media-preview links for external items, and an `SH` title prefix.

The active Codex automation for the Monday picker is `weekly-ai-ux-slack-highlights-picker`. It runs after the website refresh and sends Monica the private candidate picker. Final sharing to `#china-ux-group-internal` still requires Monica's selected item numbers and approval.

1. Confirm the website refresh completed:

```bash
node scripts/check-weekly-refresh-ready.mjs
```

If this fails, do not generate a picker. Send Monica the status failure and rerun or repair the website refresh first.

2. Generate the editable Slack draft:

```bash
node scripts/generate-slack-weekly-draft.mjs
```

This creates:

```text
drafts/slack-weekly-highlights-YYYY-MM-DD.json
drafts/slack-weekly-highlights-YYYY-MM-DD.md
```

By default, the draft includes up to 50 candidates per category so the private picker acts as a complete weekly review list, not only a short auto-ranked shortlist. The generator reads both static website cards and cards injected from the website's backfilled source arrays.

3. Send Monica a private picker message:

```bash
node scripts/generate-slack-weekly-picker.mjs --post --reviewer-id U07UFBBSZ9D drafts/slack-weekly-highlights-YYYY-MM-DD.json
```

The private picker is a simple numbered list based on all candidates fetched into the refreshed website. Monica can reply in Slack with:

```text
Internal: 1, 3, 6
External: 2, 4, 5
Output: message
```

Use `Output: canvas` when the final share should be a Slack Canvas instead of a compact channel message. For `#china-ux-group-internal`, Canvas is the default output format unless Monica explicitly asks for a message-only share.
If the complete weekly picker is too long for one Slack message, the sender splits it into numbered preview parts while keeping the item numbers stable.

To preview the picker locally without sending:

```bash
node scripts/generate-slack-weekly-picker.mjs --dry-run drafts/slack-weekly-highlights-YYYY-MM-DD.json
```

4. Apply Monica's picks to the draft:

```bash
node scripts/process-slack-weekly-selection.mjs --selection "Internal: 1, 3, 6 External: 2, 4, 5 Output: canvas" drafts/slack-weekly-highlights-YYYY-MM-DD.json
```

This updates:

```text
drafts/slack-weekly-highlights-YYYY-MM-DD.json
drafts/slack-weekly-highlights-YYYY-MM-DD.md
```

For manual CLI-only selection, `scripts/apply-slack-weekly-selection.mjs` is still available, but `process-slack-weekly-selection.mjs` matches Monica's Slack reply format directly.

5. If needed, manually review the JSON draft:

- Keep `selected: true` only on the items you want to publish.
- Keep up to 3 internal Slack updates.
- Keep up to 3 external AI updates.
- Set `approved: true` only when the message is ready.
- Optionally set `publish.channelId` if you do not want to use `SLACK_CHANNEL_ID`.

6. Preview the Slack message:

```bash
node scripts/publish-slack-weekly.mjs --dry-run drafts/slack-weekly-highlights-YYYY-MM-DD.json
```

7. Post immediately:

```bash
node scripts/publish-slack-weekly.mjs --post drafts/slack-weekly-highlights-YYYY-MM-DD.json
```

Or schedule the approved post for later on Monday:

```bash
node scripts/publish-slack-weekly.mjs --schedule-at 2026-07-06T15:00:00+08:00 drafts/slack-weekly-highlights-YYYY-MM-DD.json
```

The publisher refuses to post or schedule unless `approved` is `true`.

---

## Canvas Output

The linked HITL example is a Slack Canvas. It uses Canvas-flavored Markdown, especially:

```markdown
::: {.layout}
::: {.column}
### Column one
Content here
:::
::: {.column}
### Column two
Content here
:::
:::
```

Generate a Canvas-ready version of the approved weekly draft:

```bash
node scripts/generate-slack-weekly-canvas.mjs drafts/slack-weekly-highlights-YYYY-MM-DD.json
```

This creates:

```text
drafts/slack-weekly-highlights-YYYY-MM-DD.canvas.md
```

The generated Canvas has:

- a short intro
- a callout linking the Canvas back to the full website digest
- a two-column layout:
  - Internal Slack updates
  - External AI updates
- clickable source links for each selected item

Use this when the weekly Slack output should look like a lightweight internal newsletter doc instead of a compact channel post.

---

## Selection Guidance

Choose highlights that help UXers decide what to try, read, or discuss this week.

For **internal Slack updates**, prioritize:

- shipped or available internal tools
- reusable recordings, decks, templates, workflows, or prompts
- research, design, content, prototyping, or design-system impact
- direct Slack source links that readers can inspect

For **external AI updates**, prioritize:

- major Figma, Claude, OpenAI, Google, or design-tool changes
- workflow examples close to UX/product roles
- strategic reads from NN/g, Lenny's Newsletter, UX Collective, or similar sources
- items that sharpen UX judgment, critique, research, or AI-builder practices

Avoid long lists. The Slack bot should be a doorway into the full digest, not a duplicate of it.
