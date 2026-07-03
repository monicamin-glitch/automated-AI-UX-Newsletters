# Slack Weekly Highlights Bot

Use this workflow to publish a simplified weekly AI x UX highlight into an internal UX Slack channel after manual approval.

The Slack post is intentionally shorter than the website. It is split into two categories:

- **Internal Slack updates**: selected Slack Spotlight items with source channel and direct Slack permalink.
- **External AI updates**: selected public AI/design updates with source link.

---

## One-Time Setup

Create a Slack app/bot and install it to the workspace with:

- `chat:write`
- Optional: `chat:write.public` only if the bot must post to public channels without being invited

Invite the bot to the target internal UX channel, then keep these values outside git:

```bash
export SLACK_BOT_TOKEN="xoxb-..."
export SLACK_CHANNEL_ID="C..."
```

Use the channel ID instead of the channel name so posting stays stable if the channel is renamed.

---

## Weekly Workflow

The main newsletter website refresh runs every Monday at 10:00. Generate the Slack highlights draft only after that refresh has completed, so your manual picks come from the newly updated website. The recommended Slack draft window is Monday around 11:00.

1. Prepare the website media first:

```bash
node scripts/prepare-media.mjs --write-manifest
```

2. Generate the editable Slack draft:

```bash
node scripts/generate-slack-weekly-draft.mjs
```

This creates:

```text
drafts/slack-weekly-highlights-YYYY-MM-DD.json
drafts/slack-weekly-highlights-YYYY-MM-DD.md
```

3. Manually review the JSON draft:

- Keep `selected: true` only on the items you want to publish.
- Keep up to 3 internal Slack updates.
- Keep up to 3 external AI updates.
- Set `approved: true` only when the message is ready.
- Optionally set `publish.channelId` if you do not want to use `SLACK_CHANNEL_ID`.

4. Preview the Slack message:

```bash
node scripts/publish-slack-weekly.mjs --dry-run drafts/slack-weekly-highlights-YYYY-MM-DD.json
```

5. Post immediately:

```bash
node scripts/publish-slack-weekly.mjs --post drafts/slack-weekly-highlights-YYYY-MM-DD.json
```

Or schedule the approved post for later on Monday:

```bash
node scripts/publish-slack-weekly.mjs --schedule-at 2026-07-06T15:00:00+08:00 drafts/slack-weekly-highlights-YYYY-MM-DD.json
```

The publisher refuses to post or schedule unless `approved` is `true`.

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
