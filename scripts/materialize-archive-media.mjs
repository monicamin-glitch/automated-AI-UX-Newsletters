#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = path.join(repoRoot, 'draft-new-ia.html');
const shouldWrite = process.argv.includes('--write');
const source = fs.readFileSync(htmlPath, 'utf8');
const imageMap = parseImageMap(source);
let inserted = 0;

const updated = source.replace(
  /(<template id="week-report-[^"]+"[^>]*>)([\s\S]*?)(<\/template>)/g,
  (template, opening, body, closing) => {
    const nextBody = body.replace(
      /(<div class="external-card-grid">)([\s\S]*?)(<\/div>\s*)$/,
      (grid, gridOpening, cardMarkup, gridClosing) => {
        let cardIndex = 0;
        const nextCards = cardMarkup.replace(
          /(<a class="masonry-card"[^>]*href="([^"]+)"[^>]*>)([\s\S]*?<\/a>)/g,
          (card, cardOpening, encodedHref, cardBody) => {
            const currentIndex = cardIndex;
            cardIndex += 1;
            if (cardBody.includes('class="masonry-card-image"')) return card;

            const href = decodeHtml(encodedHref);
            const imagePath = imageMap.get(normalizeUrl(href));
            if (!imagePath) {
              throw new Error(`No checked-in image mapping for ${href}`);
            }
            const absoluteImagePath = path.join(repoRoot, imagePath);
            if (!fs.existsSync(absoluteImagePath)) {
              throw new Error(`Mapped image does not exist: ${imagePath}`);
            }

            const title = textContent(cardBody.match(/class="masonry-card-title">([\s\S]*?)<\/h3>/)?.[1] || 'External article');
            const rank = currentIndex < 3
              ? `<span class="masonry-card-rank">Top pick · ${currentIndex + 1}</span>`
              : '';
            const image = `<div class="masonry-card-image"><img src="${escapeAttribute(imagePath)}" alt="${escapeAttribute(`${title} visual`)}">${rank}</div>`;
            inserted += 1;
            return `${cardOpening}${image}${cardBody}`;
          }
        );
        return `${gridOpening}${nextCards}${gridClosing}`;
      }
    );
    return `${opening}${nextBody}${closing}`;
  }
);

console.log(`Archive images ready to materialize: ${inserted}`);
if (shouldWrite && inserted > 0) {
  fs.writeFileSync(htmlPath, updated);
  console.log(`Updated ${path.relative(repoRoot, htmlPath)}`);
}

function parseImageMap(html) {
  const block = html.match(/const externalCardImagesByUrl = \{([\s\S]*?)\n    \};/)?.[1] || '';
  return new Map(
    [...block.matchAll(/'([^']+)':\s*'([^']+)'/g)]
      .map(([, url, imagePath]) => [normalizeUrl(url), imagePath])
  );
}

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = '';
    return url.href.replace(/\/$/, '');
  } catch {
    return String(value || '').replace(/\/$/, '');
  }
}

function textContent(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
