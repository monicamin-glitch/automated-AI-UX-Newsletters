# Modern Newsletter Publishing Entry Design

## Goal

Make the approved Latest Week / All Weeks / Resources Hub website the single production entry point so the next weekly refresh, GitHub default page, B.Pages publication, media gate, and Slack digest generation all use the same layout and content.

## Root cause

The repository currently has two competing entry files:

- `draft-new-ia.html` contains the approved modern website.
- `index.html` contains the superseded legacy website.

The media gate reads the modern draft, while B.Pages publication, date-bucket validation, and Slack digest parsing still read `index.html`. Therefore validation can pass for one page while publication serves another.

## Considered approaches

### A. Make the modern page the canonical `index.html` — selected

Move the existing legacy page to `legacy-index.html`, promote the modern page to `index.html`, update every consumer to read `index.html`, and remove `draft-new-ia.html`.

This creates one production source of truth while preserving the old page only for migration regression tests.

### B. Publish `draft-new-ia.html` directly

This requires special cases in B.Pages, GitHub default-page behavior, validation, and Slack extraction. It preserves the two-source problem and is rejected.

### C. Keep `index.html` as a redirect

This is unreliable for single-file B.Pages publication and still leaves content split across two files. It is rejected.

## File roles after migration

| File | Responsibility |
|---|---|
| `index.html` | The only production website and weekly content archive |
| `legacy-index.html` | Read-only migration fixture for tests that verify historical rebucketing |
| `design-spec.md` | Visual and interaction contract |
| `digest.md` | Weekly orchestration and document routing |
| `slack-spotlight.md` | Internal Update and Popular Topic rules/data |
| `media-strategy.md` | External image preparation and fallback rules |

`draft-new-ia.html` no longer exists after migration.

## Consumer migration

The following must read canonical `index.html`:

- `scripts/prepare-media.mjs`
- `scripts/finalize-weekly-refresh.mjs`
- `scripts/validate-week-buckets.mjs`
- `scripts/slack-weekly-lib.mjs`
- Slack draft generation and refresh-readiness checks
- B.Pages publication
- all modern UI and browser tests

Only historical migration tests may read `legacy-index.html`.

## Slack parsing

Slack weekly generation must parse the modern structures:

- Internal Updates: `.slack-card`
- External Updates: `.masonry-card`
- Latest Week boundary: `#page-latest`

It must preserve the current data contract: title, source/channel, author, date, permalink, complete stored original Slack message, summaries, and image path. It must not fall back to the legacy `.article-card` layout for production.

## Publication behavior

The guarded finalizer validates and publishes `index.html`. The media command becomes:

```bash
node scripts/prepare-media.mjs --html index.html --write-manifest
```

B.Pages continues receiving `index.html`, but that file now contains the approved modern UI. GitHub’s default document and the reviewed local page therefore match.

## Version record

Update `update-notes.md` under `2026-07-23` to record:

- the GitHub Week 11 merge into the approved current layout;
- the unique Miro article and higher-quality Week 11 media carried into the current report;
- the deduplication decision for overlapping Slack and External cards;
- the decision to hold the Dieter Slack card until its complete original message is available;
- the promotion of the modern page to canonical `index.html`;
- the migration of all publication, validation, and Slack-generation consumers to the canonical entry.

After verification, commit and push the implementation and version record together to `origin/main`. Do not publish B.Pages or send Slack as part of this migration.

## Migration safety

- Preserve the current modern page byte-for-byte before adapting path references.
- Preserve the old `index.html` as `legacy-index.html`.
- Do not alter stored weekly content merely because the entry filename changes.
- Keep every archived ISO week and local image.
- Do not publish B.Pages or send Slack during migration verification.

## Verification

The migration is complete only when:

1. no production script or Markdown workflow references `draft-new-ia.html`;
2. no production script parses `legacy-index.html`;
3. `index.html` contains Latest Week, All Weeks, and Resources Hub;
4. the full automated suite passes;
5. real-browser desktop/mobile regression passes against `index.html`;
6. the media gate validates every Latest Week and All Weeks External card from `index.html`;
7. Slack digest dry-run parses the modern Latest Week;
8. `git diff --check` passes.
