import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('..', import.meta.url);

test('uses the modern newsletter as the canonical production entry', () => {
  const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(index, /id="page-latest"/);
  assert.match(index, /class="masonry-card"/);
  assert.match(index, /class="slack-card"/);
  assert.match(index, /id="page-resources"/);
  assert.equal(existsSync(new URL('../legacy-index.html', import.meta.url)), true);
  assert.equal(existsSync(new URL('../draft-new-ia.html', import.meta.url)), false);
});

test('keeps obsolete entry names out of production consumers', () => {
  const files = [
    'scripts/finalize-weekly-refresh.mjs',
    'scripts/materialize-archive-media.mjs',
    'scripts/prepare-media.mjs',
    'scripts/slack-weekly-lib.mjs',
    'scripts/validate-week-buckets.mjs',
    'scripts/weekly-refresh-status.mjs',
    'digest.md',
    'media-strategy.md',
    'draft-new-ia-top3.html',
    'draft-new-ia-proposal-b.html',
    'draft-new-ia-flip-card.html',
    'draft-new-ia-slot-machine.html',
  ];

  for (const file of files) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /draft-new-ia\.html/, `${file} still references the draft entry`);
    assert.doesNotMatch(source, /legacy-index\.html/, `${file} uses the migration fixture in production`);
  }
});
