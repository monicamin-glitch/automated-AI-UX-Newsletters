import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(__dirname, '..');
export const indexPath = path.join(repoRoot, 'index.html');
export const defaultDigestUrl = 'https://bpages.booking.com/048eM/ai-ux-newsletter';

export function readHtml() {
  return fs.readFileSync(indexPath, 'utf8');
}

export function parseLatestWeek(html) {
  const pageMatch = html.match(/<div class="page active" id="page-latest"([^>]*)>([\s\S]*?)\n\s*<\/div>\n\s*\n\s*<!-- ARCHIVE:/);
  if (!pageMatch) {
    throw new Error('Could not find the active latest page in index.html');
  }

  const attrs = parseAttrs(pageMatch[1]);
  const pageHtml = pageMatch[2];
  return {
    id: attrs['data-week'] || 'latest',
    label: attrs['data-week-label'] || 'This Week',
    date: attrs['data-week-date'] || '',
    html: pageHtml,
  };
}

export function parseCards(pageHtml) {
  return {
    internal: parseSlackCards(pageHtml),
    external: parseExternalCards(pageHtml),
  };
}

export function parseSlackCards(pageHtml) {
  const cards = [];
  const pattern = /<div class="article-card article-card--slack"([\s\S]*?)<\/div><\/div><\/div>/g;
  let match;
  while ((match = pattern.exec(pageHtml)) !== null) {
    const block = match[0];
    const attrs = parseAttrs(match[1]);
    const desc = textContent(firstMatch(block, /<p class="article-card-desc">([\s\S]*?)<\/p>/));
    const summary = splitSummary(desc);
    cards.push({
      id: makeId(attrs['data-slack-title'] || firstTitle(block)),
      title: attrs['data-slack-title'] || firstTitle(block),
      category: 'internal',
      source: attrs['data-slack-channel'] || '',
      author: attrs['data-slack-author'] || '',
      date: attrs['data-slack-date'] || '',
      link: attrs['data-slack-link'] || '',
      update: summary.update,
      why: summary.why,
      score: scoreCandidate({ title: attrs['data-slack-title'] || '', desc, source: attrs['data-slack-channel'] || '', internal: true }),
      selected: false,
    });
  }
  return dedupeByLink(cards);
}

export function parseExternalCards(pageHtml) {
  const cards = [];
  const pattern = /<a class="article-card"([\s\S]*?)<\/a>/g;
  let match;
  while ((match = pattern.exec(pageHtml)) !== null) {
    const block = match[0];
    const attrs = parseAttrs(match[1]);
    const desc = textContent(firstMatch(block, /<p class="article-card-desc">([\s\S]*?)<\/p>/));
    const summary = splitSummary(desc);
    const meta = [...block.matchAll(/<div class="article-card-meta">[\s\S]*?<span>([\s\S]*?)<\/span><span>([\s\S]*?)<\/span>/g)][0];
    const source = meta ? textContent(meta[1]) : '';
    const date = meta ? textContent(meta[2]) : '';
    cards.push({
      id: makeId(firstTitle(block)),
      title: firstTitle(block),
      category: 'external',
      source,
      date,
      link: attrs.href || '',
      update: summary.update,
      why: summary.why,
      tags: attrs['data-tags'] || '',
      score: scoreCandidate({ title: firstTitle(block), desc, source, internal: false }),
      selected: false,
    });
  }
  return dedupeByLink(cards);
}

export function pickCandidates(cards, maxCandidates, selectedCount) {
  return cards
    .map((card, index) => ({ ...card, originalOrder: index }))
    .sort((a, b) => b.score - a.score || a.originalOrder - b.originalOrder)
    .slice(0, maxCandidates)
    .map((card, index) => ({
      ...card,
      recommended: index < selectedCount,
      selected: index < selectedCount,
    }));
}

export function buildSlackBlocks(draft) {
  const internal = selectedItems(draft.internal);
  const external = selectedItems(draft.external);
  const digestUrl = draft.publish?.digestUrl || defaultDigestUrl;
  const weekLabel = [draft.week?.label, draft.week?.date].filter(Boolean).join(' - ');

  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'AI x UX Weekly Highlights',
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: weekLabel ? `Curated for UX teams | ${escapeSlack(weekLabel)}` : 'Curated for UX teams',
        },
      ],
    },
    { type: 'divider' },
    sectionBlock('*Internal Slack updates*'),
    ...itemBlocks(internal, 'internal'),
    { type: 'divider' },
    sectionBlock('*External AI updates*'),
    ...itemBlocks(external, 'external'),
    { type: 'divider' },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Read full digest' },
          url: digestUrl,
          action_id: 'open_full_digest',
        },
      ],
    },
  ];

  return blocks;
}

export function buildFallbackText(draft) {
  const internal = selectedItems(draft.internal);
  const external = selectedItems(draft.external);
  const lines = ['AI x UX Weekly Highlights', ''];
  lines.push('Internal Slack updates');
  internal.forEach((item, index) => lines.push(`${index + 1}. ${item.title} - ${item.why}`));
  lines.push('', 'External AI updates');
  external.forEach((item, index) => lines.push(`${index + 1}. ${item.title} - ${item.why}`));
  lines.push('', `Full digest: ${draft.publish?.digestUrl || defaultDigestUrl}`);
  return lines.join('\n');
}

export function selectedItems(items) {
  return (items || []).filter(item => item.selected);
}

export function validateApprovedDraft(draft) {
  const errors = [];
  if (!draft.approved) errors.push('Draft is not approved. Set "approved": true before posting.');
  if (!selectedItems(draft.internal).length) errors.push('No internal Slack updates selected.');
  if (!selectedItems(draft.external).length) errors.push('No external AI updates selected.');
  selectedItems(draft.internal).forEach(item => {
    if (!item.link) errors.push(`Selected internal item is missing a Slack link: ${item.title}`);
  });
  selectedItems(draft.external).forEach(item => {
    if (!item.link) errors.push(`Selected external item is missing a source link: ${item.title}`);
  });
  return errors;
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function writeMarkdownPreview(filePath, draft) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${buildMarkdownPreview(draft)}\n`);
}

export function buildMarkdownPreview(draft) {
  const lines = [
    `# AI x UX Weekly Highlights`,
    '',
    `Week: ${[draft.week?.label, draft.week?.date].filter(Boolean).join(' - ')}`,
    `Approved: ${draft.approved}`,
    '',
    '## Internal Slack Updates',
  ];

  draft.internal.forEach(item => {
    lines.push(`- [${item.selected ? 'x' : ' '}] ${item.title}`);
    lines.push(`  Source: ${item.source}`);
    lines.push(`  Why: ${item.why}`);
    lines.push(`  Link: ${item.link}`);
  });

  lines.push('', '## External AI Updates');
  draft.external.forEach(item => {
    lines.push(`- [${item.selected ? 'x' : ' '}] ${item.title}`);
    lines.push(`  Source: ${item.source}`);
    lines.push(`  Why: ${item.why}`);
    lines.push(`  Link: ${item.link}`);
  });

  lines.push('', `Full digest: ${draft.publish?.digestUrl || defaultDigestUrl}`);
  return lines.join('\n');
}

function itemBlocks(items, category) {
  if (!items.length) {
    return [sectionBlock('_No items selected yet._')];
  }
  return items.map((item, index) => {
    const title = linkText(item.link, `${index + 1}. ${item.title}`);
    const sourceLabel = category === 'internal' ? `Source: ${item.source}` : `Source: ${item.source}`;
    return sectionBlock(`*${title}*\n${escapeSlack(item.why)}\n_${escapeSlack(sourceLabel)}_`);
  });
}

function sectionBlock(text) {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text,
    },
  };
}

function linkText(url, text) {
  if (!url) return escapeSlack(text);
  return `<${url}|${escapeSlack(text)}>`;
}

function parseAttrs(source) {
  const attrs = {};
  const attrPattern = /([\w:-]+)\s*=\s*"([^"]*)"/g;
  let match;
  while ((match = attrPattern.exec(source)) !== null) {
    attrs[match[1]] = decodeHtml(match[2]);
  }
  return attrs;
}

function firstTitle(block) {
  return textContent(firstMatch(block, /<h3 class="article-card-title">([\s\S]*?)<\/h3>/));
}

function firstMatch(source, pattern) {
  return source.match(pattern)?.[1] || '';
}

function textContent(source) {
  return decodeHtml(String(source || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

function splitSummary(desc) {
  const text = desc.trim();
  const compactMatch = text.match(/^Update:\s*(.*?)\s+(?:UX value|Why it(?:'|&#x27;)?s valuable for UXers|Why it is valuable for UXers):\s*(.*)$/i);
  const labeledMatch = text.match(/^What is the update:\s*(.*?)\s+Why it(?:'|&#x27;)?s valuable for UXers:\s*(.*)$/i);
  if (compactMatch) return { update: compactMatch[1], why: compactMatch[2] };
  if (labeledMatch) return { update: labeledMatch[1], why: labeledMatch[2] };
  const sentences = splitSentences(text);
  if (!sentences.length) return { update: '', why: '' };
  const why = sentences.find((sentence, index) => index > 0 && /\b(ux|designer|designers|research|prototype|workflow|handoff|content|accessibility|trust|teams)\b/i.test(sentence)) || sentences[1] || sentences[0];
  return { update: sentences[0], why };
}

function splitSentences(text) {
  const protectedText = text.replace(/\s+/g, ' ').replace(/(\d)\.(\d)/g, '$1__DOT__$2');
  return (protectedText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [])
    .map(sentence => sentence.replace(/__DOT__/g, '.').trim())
    .filter(Boolean);
}

function scoreCandidate({ title, desc, source, internal }) {
  const text = `${title} ${desc} ${source}`.toLowerCase();
  let score = 0;
  [
    'launch', 'launched', 'available', 'recording', 'materials', 'template',
    'workflow', 'prototype', 'research', 'figma', 'claude', 'agent', 'agents',
    'evaluation', 'accessibility', 'governance', 'cost', 'prompt', 'mcp',
    'bpages', 'multilingual', 'design system', 'ux'
  ].forEach(term => {
    if (text.includes(term)) score += 1;
  });
  if (internal && /#ai-for-ux|#design|#genai_engineering|#ai-studio-updates|#mp-ai-engineering|#dev-china|#china-ai-workstream/.test(source)) score += 2;
  if (!internal && /figma|lenny|nielsen|nn\/g|anthropic|claude|ux collective|google/i.test(source)) score += 2;
  if (text.includes('watch party')) score -= 1;
  return score;
}

function dedupeByLink(cards) {
  const seen = new Set();
  return cards.filter(card => {
    const key = card.link || card.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function makeId(title) {
  return String(title || 'item')
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function escapeSlack(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
