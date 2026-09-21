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

```yaml
period:
  iso_year: 2026
  iso_week: 38
  start_date: 2026-09-14
  end_date: 2026-09-20
  timezone: Asia/Shanghai

popular_topics:
  - word: Design AI Summit
    mentions: 6
    channels: 2
  - word: Agent Fabric App
    mentions: 4
    channels: 3
  - word: EvalSuite & EaaS
    mentions: 4
    channels: 3
  - word: Fabric Skills Insights
    mentions: 3
    channels: 3
  - word: Juno
    mentions: 1
    channels: 1

internal:
  - title: Design AI Summit: Writing Skills for Yourself Frames AI Knowledge Debt
    category: learning
    channel: ai-for-ux
    author: Nicole Winestock
    date: 2026-09-18
    replies: 0
    permalink: https://booking.enterprise.slack.com/archives/C0B4CV2EVL6/p1789733629042729
    original_message: |-
      Happy Friday, <!channel>. :shibe_nerd:
      Last share-out for the week. We'll be back next week with more content, including our summit workshop recordings.
      Stay tuned and thanks for keeping the discussions going :heart:

      And now, let's talk about:

      Writing Skills for Yourself!

      Does AI lead to knowledge debt? We know AI execution is not cheap, but then there might be an additional fee we are paying when we skip the learning experience.

      <@WFP9VE40H|Sarthak Pranit> is here to discuss the risks of lost knowledge through AI-execution and the costly impact it has, not only deliverable quality, but our communication with stakeholders and teammates. His hot take about the matter - Designers should understand how things work. :eyes:

      And while the concerns he raises are valid, Sarthak also has a solution that can counter these issues and enable you to learn in a way that fits your standard.

      Watch the entire talk to find out: <https://docs.google.com/videos/d/1NFp7LuJDqScnNMqJOjOOxHwde1F-W9OuMEB9gc2L54s/play|Writing Skills for Yourself>

      What is your opinion about the risks?
      Do you see this resonating with other crafts?
      Or to counter that, maybe you’d like to share cool new things you learned while using AI?
    what_is_the_update: Design AI Summit published Sarthak Pranit’s “Writing Skills for Yourself” recording, which examines the knowledge debt designers may accumulate when AI performs the work without preserving understanding.
    why_valuable_for_uxers: It gives UXers a practical lens for balancing execution speed with craft knowledge, deliverable quality, and confident communication with teammates and stakeholders.
  - title: A Miro-to-React Workflow Turns Rough Ideas into Products Without Figma
    category: practices
    channel: ai-for-ux
    author: Nicole Winestock
    date: 2026-09-16
    replies: 6
    permalink: https://booking.enterprise.slack.com/archives/C0B4CV2EVL6/p1789559989149019?thread_ts=1789559989.149019&cid=C0B4CV2EVL6
    original_message: |-
      Hey <!channel>! Time for another talk!

      So here is a scenario:
      You open a blank page and…

      Nothing, nada, zilch!

      You don’t know where to start, and from the blankness, a little whisper comes telling you that everyone will soon find out that you are basically a fake.

      “Faking it” is not really a bad thing according to <@WFP9WDFUH|Oleksii Drozdenko> who, in this sincere and practical talk, demonstrates how a “fake” Miro board, turned into an interactive react prototype and eventually ended as tangible products.

      And here is the catch - no Figma was used during the process :open_mouth: !!!
      Watch the entire talk in this link: <https://docs.google.com/videos/d/102ra3E60PcwyyC7CGylUpLZMaZcmy-4Z5hFcSc4PGnc/play?usp=sharing|Fake it till you Make it>

      How do you feel about this process?
      Are there similar case studies you’d like to share following Oleksii's presentation?
      Or maybe you want to ask him more questions?
    what_is_the_update: “Fake it till you Make it” demonstrates how a rough Miro board became an interactive React prototype and then a shipped product, without using Figma in the core workflow.
    why_valuable_for_uxers: The accompanying eight-step method gives UXers a reusable way to move from wireframe to scalable components, refine visual quality later, and introduce BUI at handoff.
  - title: Design AI Summit Opens a Conversation About AI-Assisted Collaboration
    category: learning
    channel: design
    author: Nicole Winestock
    date: 2026-09-14
    replies: 1
    permalink: https://booking.enterprise.slack.com/archives/C0DBLGXMJ/p1789389019497569?thread_ts=1789389019.497569&cid=C0DBLGXMJ
    original_message: |-
      Hello <!channel>, let's have a chat. :coffee:
      Over the next week, or so, we'll unpack Design AI Summit. Every day a byte or highlight.
      We are curious to hear your thoughts and to dive further into the ideas presented in the summit.
      Engage with it at your pace. Let's go!

      In the first episode, “Boring by Design”, <@U02QM68HWH0|Sam White> and <@WFPQJ0GUT|Leif Parker>, are opening up a sensitive topic - the way AI is reshaping our SDLC process, the potential risks, the trade-offs, and the unavoidable anxiety.

      But instead of giving into the fear, they share a sneak peek into a new AI assisted collaboration process, which according to them, solidifies UXs' space in the beginning of the process.

      Do you agree that AI can empower craft and collaborations rather than dissolving them?
      What is your take on the new way of working together as demonstrated in the talk?
      And In terms of shaping UX - do you agree with the idea that AI makes UX more visible than before?

      Feel free to share your thoughts.
      Watch the session: <https://docs.google.com/videos/d/1zTWIdWlAHELkibc8QDa1JTs_TzvMm1XNQ2sz1SaVocE/play?usp=sharing|here>
    what_is_the_update: The Design AI Summit released “Boring by Design,” a session about how AI is reshaping the SDLC, the trade-offs and anxiety involved, and a collaboration model that brings UX earlier into the process.
    why_valuable_for_uxers: It gives teams a concrete starting point for discussing how AI can strengthen craft and collaboration while keeping UX visible when ways of working change.
  - title: EvalSuite 2.0 and EaaS Create a Shared, Reproducible Evaluation Stack
    category: tools
    channel: ai-studio-updates
    author: Bjorn Burscher
    date: 2026-09-14
    replies: 0
    permalink: https://booking.enterprise.slack.com/archives/C09GMG8AL1L/p1789387833637739
    original_message: |-
      The GEAR (Marketplace AI) and AI Studio (DML) teams have been joining forces on evaluation, consolidating our packages and workflows and now jointly owning EvalSuite and EaaS. Big kudos to everyone across both teams who helped turn this into one shared evaluation stack.

      So, what's new?

      Evaluation as a Service + Unified Eval Config

      Eval SVC
      Introducing Evaluation as a Service (EaaS), a new service for evaluating LLM- and agent-based applications at Booking.com, built on EvalSuite. EaaS lets you load data from custom files, Snowflake, Arize, or AI Studio; run inference against a model, workflow, or agent; score outputs with judges and metrics; and publish evaluation datasets and results.
      Jobs can be submitted and monitored through the Python client, with reports and artifacts available for retrieval. So yes, you can finally close your laptop while that long evaluation job is running.

      Read the docs: https://booking.atlassian.net/wiki/spaces/DMLPBD/pages/1962017441/AI+Evaluation+Service

      Unified Eval Config
      EaaS also supports the new Unified Evaluation Config: one YAML format and one entry point for defining reproducible evaluation pipelines. A version 2 config follows five ordered stages — data → preprocessing → inference → evaluation → post_evaluation — with one or more runs defined over the pipeline. This makes evaluations easier to automate, reuse, and integrate across tools and use cases.

      Read the docs: https://booking-com.gitlab.io/core/content-intelligence/eval-suite/config-reference-v2.html

      EvalSuite 2.0

      BookingBench
      Benchmarks are now governed, versioned tables. All benchmark data has been moved out of the repository and stored into booking_bench_published.shared. It can be read via the GenAI Data SDK. If a data_version is pinned, the evaluation run will be fully reproducible.

      Support for Unified Eval Config
      The important bit: evaluator resolution is explicit now. v1's six-level cascade is replaced by one three-layer merge: use-case defaults → defaults.stages → the run's own stages. A bad config fails at load, naming the fix.

      Translation Fixes
      This transition also fixed some previous issues with fields of the datasets not being reachable or not translating in a synchronised way. Specifically workflow requests and Arize sources are now more robust. Rows are also translated from their own language instead of assuming English: those with no usable language are dropped, and the new lost_in_translation_ratio (default 0.1) fails the run rather than quietly shrinking your eval set. Any valid ISO 639 tag works now.

      Special shout-out to <@U06PMSHU5S8|Amir Bitaraf>, <@U04EPT6BE5V|Ilkcan Keles>, <@U057MLFHC4D|Anastasiia Barchukova>, <@U09L95PQCUD|Shay Arbiv>, <@U09DBJQU0JU|Aratrika Das>, <@U07MBT9S4GJ|Gilad Ilsar>, <@U03MDRBCWFL|Alex Umnov>.
    what_is_the_update: Marketplace AI and AI Studio jointly launched Evaluation as a Service, a unified evaluation configuration, versioned BookingBench data, and stronger multilingual handling in EvalSuite 2.0.
    why_valuable_for_uxers: UX teams working on AI products gain a more reproducible way to compare quality, automate evaluations, expose translation loss, and preserve evidence across models and releases.
  - title: Fabric Skills Dashboard Makes Adoption and Performance Visible
    category: tools
    channel: agent-fabric
    author: Mansi Mittal
    date: 2026-09-14
    replies: 9
    permalink: https://booking.enterprise.slack.com/archives/C0ABNJ4NWG6/p1789395105344869?thread_ts=1789395105.344869&cid=C0ABNJ4NWG6
    original_message: |-
      Launch: Skills invocation & performance data is live: https://grafana.booking.com/d/fabric-ai-traces-skills-v2/fabric-ai-traces-skill-invocations

      Access required. Request subscription to FABRIC_AI_TRACES_REDACTED_V1 in BDX; approval within about one business day. No Immuta access? Request the linked Passport policy first.

      For months, one of the most common asks: how are Skills actually being used, and how well do they perform? Fabric has finally shipped Skills insights in Grafana — real usage and performance data across Claude Code, Cursor, and Codex.

      First look at the data
      • 1,250 unique Skills invoked across 37.5K traces and 5.3K sessions
      • See not only skills invocation volume, but also latency, token usage, and models used when skills are invoked
      • BPages is currently the #1 most-invoked Skill followed by Artifact Design and Using Superpower skill
      • Dashboard shows the top 10 Skills from the last 7 days

      So check out the Skills leaderboard, and big kudos to the BPages team for leading the pack.
    what_is_the_update: A new Grafana dashboard exposes Fabric skill invocation volume, latency, token use, models, and the top skills across 37.5K traces and 5.3K sessions.
    why_valuable_for_uxers: UXers and skill authors can replace anecdotes with evidence about adoption, cost, and performance—and use that evidence to improve reusable workflows over time.
  - title: Juno Can Read Inline Slack Previews to Draft Better Tickets
    category: tools
    channel: genai_engineering
    author: Johanna Longmuir
    date: 2026-09-14
    replies: 0
    permalink: https://booking.enterprise.slack.com/archives/C08F5QRGFDG/p1789380349096649
    original_message: |-
      Juno Update :cherry_blossom:!

      Juno release features:
      • Support reading Slack preview
        ◦ Juno will read the Slack preview of a message shared to help support context/ticket writing.
        ◦ Juno will ONLY see that individual preview and not any other messages around it.
        ◦ Juno will ONLY see that message if the preview is inline/showing.
      • Minor tweaks to wording on feedback flows for users to help understand who consumes that feedback

      Reminder: Juno helps create structured tickets for your team, based on context from Slack threads. Please have a go and keep sending feedback in #juno-support or through the feedback functionality.

      To get started just add Juno to your channel and tag it to get a response.

      Happy ticket creation :cherry_blossom:
    what_is_the_update: Juno can now read an inline Slack message preview as context for ticket writing, alongside clearer feedback-flow wording about who receives submitted feedback.
    why_valuable_for_uxers: It reduces the work of converting a conversation into a structured ticket while making the tool’s visibility boundary explicit: only the single visible preview is read.
  - title: ServiceNow MCP Brings Incident and Change Workflows to Fabric
    category: tools
    channel: genai_engineering
    author: Anushka Bhandari
    date: 2026-09-17
    replies: 12
    permalink: https://booking.enterprise.slack.com/archives/C08F5QRGFDG/p1789638883809539?thread_ts=1789638883.809539&cid=C08F5QRGFDG
    original_message: |-
      New: ServiceNow MCP Server now available on Fabric!

      The ServiceNow MCP Server is now available for teams working with Incident, Request and Change Management processes.
      Use it from your agent workflow to investigate tickets, create and update requests, analyze changes, add comments or work notes, and look up assignment groups and eligible users.

      Get started by downloading the Fabric app, now available on both macOS and Windows: https://fabric.booking.com/app

      Huge thanks to the ServiceNow team, especially <@U04JW4UGVNZ|Chander Bhushan>, <@U06JDQ2RLSG|Özgün Alphan>, <@U0ASF4NJAUW|Rami Heikel> for making this happen.

      Looking forward to building an even more seamless, agentic ServiceNow experience on Fabric.

      Read the thread for more instructions.
    what_is_the_update: Fabric added a ServiceNow MCP server for incident, request, and change-management tasks, including ticket investigation, updates, summaries, comments, work notes, and assignment lookups.
    why_valuable_for_uxers: It shows how operational workflows can become agent-accessible while the active thread also makes current capability gaps, access requirements, and feedback paths visible.
  - title: Review Readiness Skill Prepares Merge Requests Before Review
    category: tools
    channel: genai_engineering
    author: Nilesh Reddy
    date: 2026-09-15
    replies: 0
    permalink: https://booking.enterprise.slack.com/archives/C08F5QRGFDG/p1789476086080049
    original_message: |-
      Hi everyone!

      We’re working to improve the code review experience by reducing long review cycles, avoidable back-and-forth, and unclear reviewer focus.

      As an early step, we’ve built the Review Readiness skill:
      https://fabric.booking.com/skills/common/review-readiness

      Install it through profiles:
      bk plugins:install @bookingcom/genai@latest
      bk genai:profile:install common/review-readiness --global

      It helps authors prepare review-ready MRs by:
      - Running local checks/Unit tests
      - Invoking Claude Code Review
      - Validating CI and eligible issues
      - Generating a clear summary and reviewer focus areas

      We’re looking for teams to test it on real, everyday changes and tell us where it helps—or creates friction.

      Join #code-review-experience to share feedback and help shape the broader experience.

      I’m happy to support your first run or arrange a short walkthrough!
    what_is_the_update: The new Review Readiness skill runs local checks and unit tests, invokes Claude Code Review, validates CI and eligible issues, and generates a reviewer-focused summary.
    why_valuable_for_uxers: UX engineers and design technologists can reduce avoidable review cycles and make handoffs easier to assess by surfacing readiness and reviewer focus before asking for feedback.
  - title: UX Writing Community Shares Practical Notes on Multilingual AI Evaluation
    category: learning
    channel: uxw-genai
    author: Chris Cameron
    date: 2026-09-17
    replies: 0
    permalink: https://booking.enterprise.slack.com/archives/C070U2AADCZ/p1789659521501769
    original_message: |-
      Hi all, todays Biweekly was a great discussion about several things: multi-lingual content generation, judges and evaluation frameworks, identifying obvious mistranslations, as well as info on the Agent Fabric app and the forthcoming Claude desktop app. Thanks to those who made it! Checkout the summary in the meeting notes here: https://docs.google.com/document/d/1tPXo9eRUp12Ahz6k_rmaKMBJPQa4qyiG3pO8FRluRVU/edit?tab=t.0
    what_is_the_update: The UX Writing GenAI biweekly shared notes on multilingual content generation, judges and evaluation frameworks, obvious mistranslations, Agent Fabric, and the forthcoming Claude desktop app.
    why_valuable_for_uxers: Content designers get a reusable record of current evaluation questions and tools, helping teams compare multilingual quality and identify failures more consistently.

coverage:
  checked_channels: [ai-for-ux, genai_engineering, dev-china, china-ai-sdlc, mp-ai-engineering, mp-tpch-ai-guild-weekly, ai-studio-updates, ai-gateway-updates, design, design-systems, design-language, ai-design-curriculum, uxw-genai, ai-uxers-of-fintech, conversational-ai-traveller-all-ux, agent-fabric]
  included_items: 9
  blocked_access: []
  manual_review: [Public channels only; no private-channel search was performed. Popular-topic counts are normalized observations across qualifying public messages.]
```
