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
  iso_week: 29
  start_date: 2026-07-13
  end_date: 2026-07-19

popular_topics:
  - { word: 'Agent Fabric', mentions: '16', channels: 13 }
  - { word: 'Skills MCP', mentions: '8', channels: 2 }
  - { word: 'Design+AI Summit', mentions: '2', channels: 2 }
  - { word: 'AI Illustration Generator', mentions: '1', channels: 1 }

internal_updates:
  - title: Skills MCP Server Makes Booking Skills Discoverable Inside AI Coding Tools
    category: tools
    channel: genai_engineering
    author: Ahmed Kamal
    date: 2026-07-17
    replies: 14
    permalink: https://booking.enterprise.slack.com/archives/C08F5QRGFDG/p1784276960676419?thread_ts=1784276960.676419&cid=C08F5QRGFDG
    posted_at: 2026-07-17T16:29:20+08:00
    original_message: |-
      :rocket: Introducing the Skills MCP Server — give your AI agent access to <http://Booking.com|Booking.com>’s shared knowledge

       The Skills MCP Server helps AI agents discover and use relevant skills while working on a task. It loads the right instructions exactly when they’re
       needed.

       With the Skills MCP Server, your agent can:

       • Search the Skills Catalog based on the current task
       • Load the most relevant skill and follow its workflow
       • Access Booking.com-specific tools and engineering knowledge
       • Use skills without permanently installing them—the temporary copy is removed immediately after loading

       The server is powered by the bk Skills Catalog, with skills available in the Coding Agent Tools repository.

       This is a community project, so contributions, improvements, bug reports, and new ideas are very welcome in the <https://gitlab.com/booking-com/genai-eng/skills-mcp-server|Skills MCP repository>. :handshake:

       Before installing

       Make sure this command works:

       `bk genai:skill:list --search adr --output json`

       Also ensure your npm registry points to <http://Booking.com|Booking.com>’s JFrog.

       Claude Code

       `claude mcp add --scope user skills -- npx -y --prefix=/tmp @bookingcom/skills-mcp@latest`

       Codex

      `codex mcp add skills -- npx -y --prefix=/tmp @bookingcom/skills-mcp@latest`

       Cursor

       Add the following to ~/.cursor/mcp.json:
      ``` {
        "mcpServers": {
         "skills": {
          "type": "stdio",
          "command": "npx",
          "args": [
           "-y",
           "--prefix=/tmp",
           "@bookingcom/skills-mcp@latest"
          ]
         }
        }
       }```
       Restart your coding agent, then try this prompt:

       > Search the Skills Catalog for guidance on creating an Architecture Decision Record (ADR).

       The agent will use search_skills to discover relevant guidance and get_skill_content to load and follow it. :sparkles:

       Questions, feedback, or interested in trying it out? Feel free to reach out to me!
    what_is_the_update: The community-launched Skills MCP Server lets Claude Code, Codex, and Cursor search the Booking Skills Catalog semantically and load only the skills needed for the current task.
    why_valuable_for_uxers: Design technologists and prototypers can discover reusable internal workflows in context without loading or remembering the entire catalogue.
  - title: Agent Fabric Becomes One Home for Agents, MCP Servers, Skills, and Profiles
    category: tools
    channel: agent-fabric
    author: Rami Heikel
    date: 2026-07-15
    replies: 1
    permalink: https://booking.enterprise.slack.com/archives/C0ABNJ4NWG6/p1784106984960089
    posted_at: 2026-07-15T17:16:24+08:00
    original_message: |-
      :tada: We are excited to introduce Agent Fabric. A single home for agents, skills & MCP servers at<http://booking.com| Booking.com>.
      This brings together <http://agents.booking.com|agents.booking.com> and<http://genai.booking.com| genai.booking.com> into a single platform: <http://fabric.booking.com|fabric.booking.com>

      Discover, build, and run agents, MCP servers, skills, and profiles, all in one place.
      :handshake: A real milestone in collaboration between the GenAI Engineering Platform team and the ABU GenAI Tech Enablement team. Two surfaces, one experience.

      A huge thanks to everyone who made this happen  :heart::rocket:

      :point_right: What to do now
      • Bookmark <http://fabric.booking.com|fabric.booking.com>
      • <http://genai.booking.com|genai.booking.com> &<http://agents.booking.com| agents.booking.com> will now automatically redirect you to<http://fabric.booking.com| fabric.booking.com>
      • Learn more <https://booking.atlassian.net/wiki/spaces/GENAIENG/pages/1704395963/Introducing+Agent+Fabric|here>
      :speech_balloon: Share any questions you have here in the thread
    what_is_the_update: Agent Fabric launched a single internal destination for discovering, building, and running agents alongside MCP servers, skills, and reusable profiles.
    why_valuable_for_uxers: It reduces fragmented entry points and makes AI-enabled design and prototyping workflows easier to find, share, and hand over.
  - title: AI for UX Session 4 Shares Claude Commands Recording and Handout
    category: learning
    channel: ai-for-ux
    author: Tim McKnight
    date: 2026-07-17
    replies: 8
    permalink: https://booking.enterprise.slack.com/archives/C0B4CV2EVL6/p1784292900691099?thread_ts=1784292900.691099&cid=C0B4CV2EVL6
    posted_at: 2026-07-17T20:55:00+08:00
    original_message: |-
      :sparkles:*AI for UX: Grounding and Understanding: Session 4*:sparkles:
      starts in 5 minutes - if you had/have any issues with the invite... <https://booking.zoom.us/j/96066881143|here is the zoom link> [access code redacted]

      Today we'll be looking at useful Claude commands: -
      • Know the key commands available in Claude Code and what each one does
      • Understand when and why to use specific commands in your workflow
    what_is_the_update: The AI for UX community published the Session 4 material on Claude Commands, including the recording and a reusable handout after the live workshop.
    why_valuable_for_uxers: Teams can turn repeated research, critique, and prototype tasks into shared commands without relying on live attendance.
  - title: Booking Design+AI Summit Opens a Hands-On Community Showcase
    category: learning
    channel: design
    author: Nicole Winestock
    date: 2026-07-13
    replies: 1
    permalink: https://booking.enterprise.slack.com/archives/C0DBLGXMJ/p1783940098536739?thread_ts=1783940098.536739&cid=C0DBLGXMJ
    posted_at: 2026-07-13T18:54:58+08:00
    original_message: |-
      :goose-announce-right: *Designers, get your calendars ready!* :goose-announce-left:
      The Booking Design+AI Summit is officially happening on *September 2nd (instead of July 29th*:grey_exclamation: *).*
      Here's what to expect:

      • *Our own designers* will facilitate and present multiple learnings, such as:
          ◦ AI-assisted UX work processes
          ◦ Case studies (personal or in-team)
          ◦ Demonstrate tools, workflows, and practical walkthroughs.
          ◦ Deep-dives into AI topics, UX design evolution, collaboration, and more.
      • *External speakers (from AI-tool companies)*, will join the event to share best practices, and valuable insights.
      • Curated hands-on *workshops* for you to choose from.
      • Social breakfast to fuel our brains. Breaks during the event itself, and a social outing at the end of the day.
      Let us know if you can make it: respond to the poll forwarded below + to the calendar invite that will be sent-out in the following days. :sparkling: <!channel>
    what_is_the_update: The Design+AI Summit moved to September 2 and invited designers to share AI-assisted processes, cases, tools, and workflows alongside talks and workshops.
    why_valuable_for_uxers: It creates a practical venue for comparing what works across teams and turning individual experiments into reusable community knowledge.
  - title: Production-Ready AI Illustration Tool Recruits Community Testers
    category: practices
    channel: design
    author: Pim Strengers
    date: 2026-07-13
    replies: 0
    permalink: https://booking.enterprise.slack.com/archives/C0DBLGXMJ/p1783928849351589
    posted_at: 2026-07-13T15:47:29+08:00
    original_message: |-
      Good morning everyone! :sun_smile:

      We're close to releasing a tool to *generate production-ready illustrations with AI!* Now, before we do, we would like to run some final user testing with people from the community.

      If you are able to help out for 30 minutes somewhere in the coming weeks, please respond to this post through either an emoji, reply or DM :slightly_smiling_face:

      Thank you! :art:
    what_is_the_update: A near-release internal tool for generating production-ready illustrations with AI opened a round of 30-minute community user-testing sessions.
    why_valuable_for_uxers: Designers can influence the workflow before launch and evaluate whether generated visuals meet real production and brand-quality needs.
  - title: GPT-5.6 Guide Maps Practical Model and Agent Workflow Choices
    category: practices
    channel: genai_engineering
    author: Adrian Badarau
    date: 2026-07-15
    replies: 1
    permalink: https://booking.enterprise.slack.com/archives/C08F5QRGFDG/p1784100504738449?thread_ts=1784100504.738449&cid=C08F5QRGFDG
    posted_at: 2026-07-15T15:28:24+08:00
    original_message: |-
      Good morning all,

      I put together a practical guide for getting better, more consistent results from the new GPT-5.6 models. They are very powerful, but they need to be prompted a bit differently to get amazing results without breaking the bank :fire::money_with_wings:

      It’s designed for both engineers and everyday ChatGPT users, and covers:

      •  Choosing between Sol, Terra, and Luna
      • Setting the right reasoning effort
      • Writing clearer, more effective prompts
      • Controlling token usage and subagents
      • Configuring reusable `AGENTS.md` guidance
      • Verifying results without overworking the model
      The recommendations combine official OpenAI guidance with practical advice from experienced AI engineering creators.

      Feedback and examples from your own workflows are very welcome—especially anything that has noticeably improved quality, consistency, or cost.
    what_is_the_update: A practical internal guide explains the Sol, Terra, and Luna variants, reasoning effort, token usage, subagents, AGENTS.md, and verification patterns.
    why_valuable_for_uxers: UX technologists can make more deliberate model, cost, and quality choices when building or evaluating AI-assisted prototypes.

coverage:
  checked_channels: [ai-for-ux, genai_engineering, dev-china, china-ai-workstream, mp-ai-engineering, mp-tpch-ai-guild-weekly, ai-studio-updates, ai-gateway-updates, design, design-systems, design-language, ai-design-curriculum, uxw-genai, ai-uxers-of-fintech, conversational-ai-traveller-all-ux, agent-fabric]
  included_items: 6
  skipped_channels: [dev-china, china-ai-workstream, mp-ai-engineering, mp-tpch-ai-guild-weekly, ai-studio-updates, ai-gateway-updates, design-systems, design-language, ai-design-curriculum, uxw-genai, ai-uxers-of-fintech, conversational-ai-traveller-all-ux]
  blocked_access: []
  manual_review: [Popular-topic counts are based on normalized Slack search results and should be treated as observed weekly counts rather than an exhaustive workspace-wide linguistic corpus.]
```
