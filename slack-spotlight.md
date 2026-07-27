# Slack Spotlight

Authoritative workflow for the weekly **Internal Updates** section and the **What colleagues are talking about this week?** topic experience.

This file owns Slack discovery, selection, topic extraction, output fields, and the current-week internal result. [`digest.md`](digest.md) calls this workflow but must not duplicate its rules. [`sources.md`](sources.md) contains public external sources only.

---

## Weekly scope

- Scan the completed Monday–Sunday ISO calendar week used by the newsletter.
- Include only Booking.com Slack content that is both AI-related and useful to UX work.
- Read the parent message and relevant replies before evaluating a thread.
- Keep the original permalink, real author name, channel, date/time, reply count, and full parent-message content for every published card.
- Summarize internal messages; do not expose sensitive or unnecessary internal details.
- Publish an item only once when it appears in multiple channels or digests.

## Channel watchlist

| Source | Channel | Best for | Publish when |
|---|---|---|---|
| AI for UX | `#ai-for-ux` | UX workshops, prompts, playbooks, research and prototyping workflows | There is an artifact, owner, next step, workshop, or reusable method |
| GenAI Engineering AI Weekly Digest | `#genai_engineering` | MCPs, agents, coding assistants, platform launches | UX engineers, design technologists, or prototyping workflows can act on it |
| China AI Workstream Bot | `#dev-china`, `#china-ai-workstream` | China/APAC workstream updates, internal tools, meetups, trust lessons | There is a design, research, product-UX, design-system, or responsible-AI implication |
| AI Engineering | `#mp-ai-engineering` | AI skills, UI engineering, design-system migration, frontend agents | The update changes UX engineering, accessibility, handoff, or prototyping work |
| Marketplace TPCH AI Guild Weekly | `#mp-tpch-ai-guild-weekly` | Product AI practices, guild learnings, pilots | There is a reusable practice, case, recording, artifact, or UX learning |
| AI Studio Updates | `#ai-studio-updates` | AI app surfaces, workflow builders, chat interfaces | The release changes how UX teams design, test, govern, or ship AI experiences |
| AI Gateway Updates | `#ai-gateway-updates` | Models, guardrails, Agent Mesh, gateway releases | It unlocks a concrete UX, content, image, trust, prototyping, or feasibility capability |
| Design | `#design` | Broad design-community AI tools, events, and demos | The message is directly AI-related and useful to UX practice |
| Design Systems | `#design-systems` | AI and component systems, tokens, documentation | There is a concrete design-system or UI implementation implication |
| Design Language | `#design-language` | AI implications for language, standards, and UI quality | There is a concrete content, quality, or governance implication |
| AI Design Curriculum | `#ai-design-curriculum` | Learning programs, recordings, curriculum artifacts | A new session, recording, or reusable learning resource is available |
| UX Writing GenAI | `#uxw-genai` | AI content workflows and editorial review | There is a reusable prompt, method, workflow, or quality lesson |
| AI UXers of Fintech | `#ai-uxers-of-fintech` | Fintech UX AI practice and adoption | There is a concrete case, playbook, workflow, or training artifact |
| Conversational AI Traveller UX | `#conversational-ai-traveller-all-ux` | Conversational AI product patterns | There is a product UX, trust, conversation-design, or research implication |

### Scan order

1. Start with `#ai-for-ux`, `#genai_engineering`, `#dev-china` / `#china-ai-workstream`, and `#mp-ai-engineering`.
2. Check `#mp-tpch-ai-guild-weekly`.
3. Check `#ai-studio-updates`; use `#ai-gateway-updates` only when the UX implication is concrete.
4. Check the broader UX channels in the watchlist.
5. Use evergreen resources from [`resources-hub.md`](resources-hub.md) only to validate or contextualize a fresh Slack update. Do not republish an evergreen link as weekly news by itself.

## Eligibility rules

An item needs at least one completion signal and one UX-facing signal.

### Completion signals

- Shipped, released, enabled, published, recorded, available, or open for sign-up
- Reusable artifact such as a playbook, deck, recording, prompt, skill, MCP setup, template, Figma file, dashboard, demo, or source thread
- Pilot evidence, adoption notes, feedback, evaluation results, or a documented limitation
- Clear owner, install step, workshop date, support channel, or next action
- Completed UX, research, design, content, or design-system case

### UX-facing signals

- Design workflow impact
- Product-experience relevance
- UX research value
- UX writing or content-design value
- Design-system, accessibility, or UI-engineering relevance
- Responsible-AI, privacy, explainability, governance, or trust impact
- Hands-on opportunity that UXers can try, reuse, watch, or join

### Exclude or down-rank

- Backend-only infrastructure with no visible UX or workflow implication
- Routine version, dependency, authentication, outage, or maintenance notes
- Raw model announcements without a concrete UX capability
- Speculative discussion without evidence, an owner, an artifact, or a next step
- Duplicates without a meaningful new milestone or learning
- General design discussion that is not actually about AI

## Candidate scoring

Score each candidate from 0 to 10:

| Criterion | Points |
|---|---:|
| Direct UX relevance | 3 |
| Actionability | 2 |
| Evidence or concrete example | 2 |
| Novelty | 1 |
| China/APAC or local-team relevance | 1 |
| Can be explained clearly and concisely | 1 |

- **8–10:** include as a primary Internal Update.
- **5–7:** include when it adds a distinct weekly signal.
- **3–4:** keep in the run summary or watchlist.
- **0–2:** exclude.

## Deduplication

Treat two messages as duplicates when they point to the same release, artifact, recording, event, or workflow outcome. Keep the version with the clearest primary source, strongest UX implication, and most useful original thread. Related messages may contribute evidence to the summary without becoming separate cards.

---

## Popular-topic extraction

The topic experience answers: **What colleagues are talking about this week?**

### Extraction method

1. Collect qualifying AI-related messages and replies from all scanned channels in the target week.
2. Normalize case, singular/plural forms, abbreviations, and obvious aliases within named internal topics. For example, `Skills MCP` and its internal Skills Catalog integration references become one topic; do not normalize generic MCP protocol discussion into an eligible topic.
3. Extract meaningful named internal platforms, integrations, community events, and internally built tools.
4. Remove verbs, filler language, generic terms such as “update”, “tool”, “team”, and “AI” by itself, people’s names, channel names, dates, and boilerplate.
5. Count no more than one mention per topic per message. Replies count only when they add substantive discussion.
6. Record both total mentions and distinct channels.
7. Rank primarily by mentions, then by channel spread, then by relevance to UX practice.
8. Keep only Booking-specific named platforms, internal integrations, community events, and internally built tools. Exclude vendor products, public model names, open protocols, and broad industry concepts.
9. Return up to five distinct internal topics. Do not pad the list with generic terms when fewer than five qualify.

`Skills MCP` remains eligible because it names Booking's internal Skills Catalog integration rather than the general MCP protocol.

### Topic output

```yaml
popular_topics:
  - { word: 'Agent Fabric', mentions: '16', channels: 13 }
  - { word: 'Skills MCP', mentions: '8', channels: 2 }
  - { word: 'Design+AI Summit', mentions: '2', channels: 2 }
  - { word: 'AI Illustration Generator', mentions: '1', channels: 1 }
```

Do not expose a visible `Top N of 10` label in the UI.

---

## Internal-update output

Every published card must provide:

```yaml
internal_updates:
  - title: Clear UX-facing headline
    category: tools # tools | learning | practices | others
    channel: design
    author: Real Slack profile name
    date: YYYY-MM-DD
    posted_at: YYYY-MM-DDTHH:MM:SSZ
    replies: 11
    permalink: https://booking.enterprise.slack.com/archives/...
    original_message: |-
      Full original parent message, with its paragraphs, lists, links, and code preserved.
    reactions:
      - { name: raised_hands, count: 4 }
    what_is_the_update: Concise summary of what changed.
    why_valuable_for_uxers: Concrete value for UX work.
```

Required display behavior is defined in [`design-spec.md`](design-spec.md). Content requirements:

- Fetch the parent message and its thread replies to understand context and calculate the reply count, but store only the parent message in `original_message`.
- `original_message` is the complete parent message used by the detail dialog. Do not replace it with the newsletter summary or silently truncate it.
- Preserve paragraph breaks, lists, labelled links, inline code, and fenced code blocks in a safe renderable form. Store reactions when they are available; omit the optional `reactions` field when none exist.
- Do not append thread replies to `original_message`; replies are represented by the numeric `replies` field only.
- Run the normal internal-content safety review before publishing. Redact credentials, tokens, personal data, or other sensitive values as `[redacted]`; if redaction would materially distort the message, exclude the card instead.
- Keep `What is the update:` and `Why it's valuable for UXers:` as separate paragraphs.
- Do not highlight the sender’s name.
- Keep the Slack icon, `posted by`, author, date, reply count, and `View in Slack` on one metadata line.
- Display the channel name on the 80×80 channel tile.
- The card opens the stored parent message in a detail dialog; only `View in Slack` opens the original permalink directly.

`original_message` and `posted_at` are required for newly generated output after this contract update; `reactions` remains optional. Existing current-week entries must not be backfilled from memory or invented; populate the new fields from Slack during the next verified refresh.

### Category-filter behavior

- Derive available filter categories from the Slack cards currently rendered on the page.
- Keep `All` visible at all times and show the current Slack-card total beside it.
- Show `Tools & Releases`, `Learning & Curriculum`, `Best Practices`, and `Others` only when at least one current card uses the matching `category`.
- Calculate filters when Latest Week initializes and recalculate them whenever All Weeks switches to another week.
- If a previously selected category is unavailable after a week change, reset the active filter to `All` and show every Slack card.
- Do not duplicate per-week category availability in this file, weekly output, or archive metadata.

---

## Current week output

Replace this section on each successful weekly refresh. Do not append historical weeks here; the website archive remains the historical source.

```yaml
week:
  iso_year: 2026
  iso_week: 30
  start_date: 2026-07-20
  end_date: 2026-07-26

popular_topics:
  - { word: 'Codex Lab', mentions: '10', channels: 8 }
  - { word: 'Fabric MCP Gateway', mentions: '7', channels: 5 }
  - { word: 'Design AI Summit', mentions: '3', channels: 2 }
  - { word: 'Structural Clarity', mentions: '2', channels: 1 }
  - { word: 'GenAI Upskill China', mentions: '1', channels: 1 }

internal_updates:
  - title: Structural Clarity Judge Measures Whether AI Answers Are Easy to Scan
    category: practices
    channel: uxw-genai
    author: Niall Hurley
    date: 2026-07-22
    replies: 4
    permalink: https://booking.enterprise.slack.com/archives/C070U2AADCZ/p1784723511399259?thread_ts=1784723511.399259&cid=C070U2AADCZ
    posted_at: 2026-07-22T20:31:51+08:00
    original_message: |-
      Hey gang – a custom judge I created, Structural Clarity™ is now out in the wild 🐕
      • AI Registry: https://bdx.booking.com/ml/asset/configurations/details?asset_id=structural_clarity (structural_clarity v0.3.0) — Prompt: https://bdx.booking.com/ml/asset/prompts/details?asset_id=structural_clarity-agent-system-prompt
      • That means its available in AI Studio/Flow Builder (although I haven't tried using it there)
      • And also available for Eval-suite eval runs as a custom judge - this is where my team and I will be using it (instructions on how to add it that way in the thread)

      What/why is it?
      Scan-ability and basic information design. It's a judge that mostly catches "lazily" structured responses (sans headings, breaks, bullets) and responses that bury the answer. Over in property Q&A Companion (Soon to be dot), user research told us that, amongst other things, our responses were annoyingly structured (or not at all structured, just walls of text). We wanted to guard against that in our new prompt and felt we needed a custom judge to measure any potential gains.

      What the scores mean in a nutshell:
      • 3 — Structurally clear (structure matches question/context scope, leads with the answer)
      • 2 — Mostly clear, one issue (has some structure but doesn't fully meet the bar)
      • 1 — Wall of text answer (single paragraph, zero formatting) - pleasantries/sign offs like "You're welcome..." are exempt
      (there are more details, exceptions within the prompt itself)

      Why am I sharing it here?
      • I'm interested to know if you think it could apply to any use cases you might have, and to see if it "has enough legs" to become a permanent or first-class evaluator.
      • Also keen to know what you think of it in general, any feedback for future versions, etc.

      So yeah, if it makes sense for your work, try using it and let me know how it goes!
    what_is_the_update: Structural Clarity v0.3.0 launched in AI Registry as a custom evaluator for scanability, answer-first structure, and basic information design.
    why_valuable_for_uxers: Teams can now measure whether AI responses avoid walls of text and buried answers instead of relying only on subjective review.
  - title: Fabric MCP Gateway Beta Makes Internal Tools Point-and-Click
    category: tools
    channel: agent-fabric
    author: Rami Heikel
    date: 2026-07-23
    replies: 21
    permalink: https://booking.enterprise.slack.com/archives/C0ABNJ4NWG6/p1784801781561099?thread_ts=1784801781.561099&cid=C0ABNJ4NWG6
    posted_at: 2026-07-23T18:16:21+08:00
    original_message: |-
      🚀 Fabric MCP Gateway BETA App is open!

      Agent Fabric App is ready for you to try: one MCP gateway for Codex, Claude Code, and Cursor. Connect your clients to Booking's MCP catalog without the setup hassle: no terminal commands, no manual auth, no guesswork.

      What's in it for you
      • Set up once, everything works
      • Point and click, not command line
      • Less time lost to sign-ins: Fabric Authenticate using IAM authentication, with auto-auth on by default
      • Want to save tokens? Toggle Tool Search on and off with a single click, no config edits
      • No additional dependencies

      👉 Download the beta: https://fabric.booking.com/app
      macOS 13+, Apple Silicon. Windows support coming.

      💬 Help us polish it: it's a beta, so you might hit a rough edge here and there. When you do, use Send feedback in the app: open Agent Fabric from your menu bar and click Send feedback… Every report goes straight to the team and shapes what we fix next.

      🙏 Huge thanks to the people who made this happen: Matt Sexton and Paulo Pinheiro, incredible work, team!

      Try it, break it, and tell us what you think. We're just getting started! ⚡
    what_is_the_update: The Fabric MCP Gateway beta provides one desktop app for connecting Codex, Claude Code, and Cursor to Booking’s MCP catalogue with IAM authentication and a Tool Search toggle.
    why_valuable_for_uxers: Designers and prototypers can access internal tools without terminal setup while gaining clearer control over context and token use.
  - title: Design AI Summit Confirms September 2 and Opens Community Participation
    category: learning
    channel: design
    author: Aga Stupkiewicz
    date: 2026-07-20
    replies: 1
    permalink: https://booking.enterprise.slack.com/archives/C0DBLGXMJ/p1784560890110689?thread_ts=1784560890.110689&cid=C0DBLGXMJ
    posted_at: 2026-07-20T23:21:30+08:00
    original_message: |-
      Hi everyone <!channel> Dear Design Community, I've been receiving a lot of requests about the event placeholder on the 29th July. We're working with Florian together with IT to remove it from everyone's calendar. It looks like there is a glitch or an error in google calendar and we can't remove it ourselves. Sorry about that! The correct date for our Design AI Summit is the 2nd of September and with our project team we're working on creating an unforgettable experience for you all 🙂
    what_is_the_update: The Design AI Summit confirmed September 2 as the correct date, with the project team continuing to shape talks, workshops, and participation.
    why_valuable_for_uxers: UXers have a clear moment to share real AI workflows and turn individual experiments into reusable community learning.
  - title: China Plans a Multi-Day GenAI Upskilling Programme for October
    category: learning
    channel: china-ai-workstream
    author: Yiyang Lin
    date: 2026-07-21
    replies: 6
    permalink: https://booking.enterprise.slack.com/archives/C0AKE5B4KGU/p1784621359191079?thread_ts=1784621359.191079&cid=C0AKE5B4KGU
    posted_at: 2026-07-21T16:09:19+08:00
    original_message: |-
      Hey Clyde Li, Yini Bao FYI I have been talking with Deborah on bringing GenAI upskill trainings to China. Currently we have agreed on Oct 19 - 22 for their trip to Shanghai.

      The current agenda is:
      • Shanghai (3 Days)
        ◦ 2 Days, 5 session per day 20 people per sessions ~ 200 people
        ◦ 1 Day - train the trainer session for new ambassadors

      There will be 5 trainers coming so we can host more sessions if needed.

      Let me know if you have any thoughts / concerns.

      Next Step:
      Will launch survey in China to see if ppl are interested in any other topics not covered in current list.

      Forwarded message from Deborah Davis-DeWitt:
      Good morning team, due to holidays schedules and local holidays we will be moving the training travel for the ambassadors to October. We will only cover advanced topics listed above. We will also provide virtual sessions for the 101 training in Q3. Based on conversations. I would like to confirm the dates for Bangalore, Shanghai and Singapore.

      Can we confirm:
      Shanghai - Oct 19 - 22
      Singapore Oct 21 -23
      Bangalore Oct 26 - 30

      Let me know if this works. We will cover 3 topics in Intermediate and 3-4 topics in more advanced subjects. We are looking to launch SDD sooner and do hybrid sessions once available.
    what_is_the_update: A tentative October GenAI upskilling programme is being planned for Shanghai, combining small-group advanced sessions with a train-the-trainer day.
    why_valuable_for_uxers: The format could widen practical AI enablement beyond engineering, while the planned survey gives local teams a way to shape the curriculum.
  - title: Codex Lab Pairs Extra Credits with a Hands-On Learning Day
    category: learning
    channel: codex_all
    author: Deborah Davis-DeWitt
    date: 2026-07-23
    replies: 8
    permalink: https://booking.enterprise.slack.com/archives/C09LCDNRK0F/p1784806678410369?thread_ts=1784806678.410369&cid=C09LCDNRK0F
    posted_at: 2026-07-23T19:37:58+08:00
    original_message: |-
      🚀 We Have $1.6 Million Worth of Codex Credits Available — Use Them Before They Run Out!

      Great news! We currently have $1.6 million worth additional Codex credits available now for teams to use. Now's the perfect time to try Codex even more and see how it can boost your workflow. These credits are short lived and will expire in mid-August, so jump in while you can!

      What's coming up?
      • August 11: We're also hosting a Codex Lab, where you are welcome to join, learn practical tips and best practices, and discover how to use Codex and the extra credits more effectively in your day-to-day development work.
        ◦ AMS20-0-002 Auditorium [Video Conferencing]
        ◦ Time: 09:30 - 16:30
      Only 100 spots available—don't miss out! Register now before they're gone or by August 10, whichever comes first: https://docs.google.com/forms/d/1p8DXOGpo1I1SssjQiJV_LHhKT6WhcK6VdQEAjIICg0Y/edit

      Why use Codex?
      Codex can help you:
      ⚡ Generate code, functions, and boilerplate in seconds.
      🐞 Debug issues by explaining errors and suggesting fixes.
      🧪 Create and improve unit tests to increase code quality.
      📝 Understand unfamiliar codebases with clear explanations.
      🔄 Refactor and optimize existing code.
      📚 Explore new frameworks, libraries, and APIs with practical examples.
      🚀 Prototype ideas and features much faster.

      Why use the available tokens?
      Since these tokens are already allocated to us:
      ✅ They're available for everyone to use.
      ⏳ The current allocation expires on August 17, so any unused tokens will be forfeited.
      💡 This is a great opportunity to experiment with AI-assisted development at no additional cost.
      📈 The more we use Codex, the better we can identify high-value use cases and improve our engineering workflows.

      Whether you're building a new feature, fixing bugs, writing tests, refactoring code, or learning a new part of the codebase, now is a great time to put Codex to work.

      Make the most of the current $1.6 million dollars worth of credits before mid August, and don't miss the Codex Lab on August 11 to learn with the OpenAI team on how to get the most value from them!

      GenAI for Engineering Program Team
    what_is_the_update: Booking teams received a short-lived pool of additional Codex credits, paired with a 100-seat hands-on Codex Lab on August 11.
    why_valuable_for_uxers: UX technologists can test faster prototype and implementation workflows while learning practical patterns before the credit window closes.

coverage:
  checked_channels: [ai-for-ux, genai_engineering, dev-china, china-ai-workstream, mp-ai-engineering, mp-tpch-ai-guild-weekly, ai-studio-updates, ai-gateway-updates, design, design-systems, design-language, ai-design-curriculum, uxw-genai, ai-uxers-of-fintech, conversational-ai-traveller-all-ux, agent-fabric]
  included_items: 5
  skipped_channels: [ai-for-ux, dev-china, mp-ai-engineering, mp-tpch-ai-guild-weekly, ai-studio-updates, ai-gateway-updates, design-systems, design-language, ai-design-curriculum, ai-uxers-of-fintech, conversational-ai-traveller-all-ux]
  blocked_access: []
  manual_review: [Popular-topic counts are observed normalized Slack search results; China training dates remain tentative pending schedule confirmation.]
```
