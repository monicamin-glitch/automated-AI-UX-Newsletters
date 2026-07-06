import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(__dirname, '..');
export const indexPath = path.join(repoRoot, 'index.html');
export const defaultDigestUrl = 'https://bpages.booking.com/048eM/ai-ux-newsletter';
export const defaultMediaBaseUrl = 'https://raw.githubusercontent.com/monicamin-glitch/automated-AI-UX-Newsletters/main';

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

export function parseCards(pageHtml, options = {}) {
  const weekId = options.weekId || '';
  const fullHtml = options.fullHtml || '';
  return {
    internal: parseSlackCards(pageHtml, fullHtml, weekId),
    external: parseExternalCards(pageHtml, fullHtml, weekId),
  };
}

export function parseSlackCards(pageHtml, fullHtml = '', weekId = '') {
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
      image: cardImageUrl(block),
      update: summary.update,
      why: summary.why,
      score: scoreCandidate({ title: attrs['data-slack-title'] || '', desc, source: attrs['data-slack-channel'] || '', internal: true }),
      selected: false,
    });
  }
  extractBackfilledArray(fullHtml, 'backfilledSlackCards')
    .filter(card => !weekId || card.week === weekId)
    .forEach(card => {
      const desc = card.desc || textContent(card.content || '');
      const summary = splitSummary(desc);
      cards.push({
        id: makeId(card.title),
        title: card.title || '',
        category: 'internal',
        source: card.channel || '',
        author: card.author || '',
        date: card.date || '',
        link: card.link || '',
        image: '',
        update: summary.update,
        why: summary.why,
        score: scoreCandidate({ title: card.title || '', desc, source: card.channel || '', internal: true }),
        selected: false,
      });
    });
  return dedupeByLink(cards);
}

export function parseExternalCards(pageHtml, fullHtml = '', weekId = '') {
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
      image: cardImageUrl(block) || localPreviewImageForUrl(fullHtml, attrs.href || ''),
      update: summary.update,
      why: summary.why,
      tags: attrs['data-tags'] || '',
      score: scoreCandidate({ title: firstTitle(block), desc, source, internal: false }),
      selected: false,
    });
  }
  extractBackfilledArray(fullHtml, 'backfilledPublicCards')
    .filter(card => !weekId || card.week === weekId)
    .forEach(card => {
      const desc = card.desc || '';
      const summary = splitSummary(desc);
      cards.push({
        id: makeId(card.title),
        title: card.title || '',
        category: 'external',
        source: card.source || '',
        date: card.date || '',
        link: card.link || '',
        image: card.image || localPreviewImageForUrl(fullHtml, card.link || ''),
        update: summary.update,
        why: summary.why,
        tags: card.tags || '',
        score: scoreCandidate({ title: card.title || '', desc, source: card.source || '', internal: false }),
        selected: false,
      });
    });
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

export function buildPickerMessage(draft) {
  return buildPickerMessageParts(draft).join('\n');
}

export function buildPickerMessageParts(draft) {
  const digestUrl = draft.publish?.digestUrl || defaultDigestUrl;
  const weekLabel = [draft.week?.label, draft.week?.date].filter(Boolean).join(' - ');
  const header = [
    '**AI x UX weekly highlights picker**',
    weekLabel ? `Website refresh: ${weekLabel}` : 'Website refresh: latest digest',
    '',
    'Please pick the top highlights for the UX channel.',
    'Reply in this format:',
    '`Internal: 1, 3, 6`',
    '`External: 2, 4, 5`',
    '`Output: message` or `Output: canvas`',
    '',
    `Full website digest: [Open digest](${digestUrl})`,
    '',
  ].join('\n');

  return [
    header,
    ['**Internal Slack updates**', ...pickerItems(draft.internal, 'Slack')].join('\n'),
    ['**External AI updates**', ...pickerItems(draft.external, '')].join('\n'),
  ];
}

export function buildPickerMessageChunks(draft, maxLength = 4500) {
  const [header, internal, external] = buildPickerMessageParts(draft);
  const chunks = [];
  appendChunk(chunks, `${header}\n\n${internal}`, maxLength);
  appendChunk(chunks, external, maxLength);
  return chunks.map((chunk, index) => (
    chunks.length > 1
      ? `**Picker preview ${index + 1}/${chunks.length}**\n\n${chunk}`
      : chunk
  ));
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

export function buildCanvasMarkdown(draft) {
  const internal = selectedItems(draft.internal);
  const external = selectedItems(draft.external);
  const digestUrl = draft.publish?.digestUrl || defaultDigestUrl;
  const weekLabel = [draft.week?.label, draft.week?.date].filter(Boolean).join(' - ');
  const lines = [
    weekLabel ? `Top picks from the refreshed digest for **${escapeCanvas(weekLabel)}**.` : 'Top picks from the refreshed weekly digest.',
    'Internal workflows to reuse; external AI shifts to watch.',
    '',
    '::: {.callout}',
    'Use this as a quick weekly scan: what internal teams are already doing with AI, and what external AI/design updates may change UX practice.',
    ':::',
    '',
    '---',
    '',
    '## Top highlights',
    '',
    '::: {.layout}',
    '::: {.column}',
    '### Internal Slack updates',
    '',
    ...canvasItems(internal, 'internal'),
    ':::',
    '::: {.column}',
    '### External AI updates',
    '',
    ...canvasItems(external, 'external'),
    ':::',
    ':::',
    '',
    '---',
    '',
    '## Full digest',
    '',
    `[Open the full AI x UX weekly digest](${digestUrl})`,
  ];

  return lines.join('\n');
}

export function buildCanvasTitle(draft) {
  const internal = selectedItems(draft.internal);
  const external = selectedItems(draft.external);
  const weekLabel = draft.week?.label || 'Weekly';
  if (internal.length && external.length) {
    return `SH ${weekLabel} AI x UX Highlights: what to try and watch`;
  }
  if (internal.length) return `SH ${weekLabel} AI x UX Highlights: internal workflows to try`;
  if (external.length) return `SH ${weekLabel} AI x UX Highlights: AI shifts to watch`;
  return `SH ${weekLabel} AI x UX Highlights`;
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

function canvasItems(items, category) {
  if (!items.length) return ['_No items selected._', ''];
  return items.flatMap((item, index) => {
    const source = category === 'internal' ? `Slack ${item.source}` : item.source;
    const mediaUrl = absoluteImageUrl(item.image || fallbackCanvasImage(item), item.mediaBaseUrl);
    const sourceLinkLabel = category === 'internal' ? 'Open Slack message' : 'Open source';
    const links = mediaUrl
      ? `[${sourceLinkLabel}](${item.link}) · [Media preview](${mediaUrl})`
      : `[${sourceLinkLabel}](${item.link})`;
    return [
      `**${index + 1}. [${escapeCanvas(canvasItemTitle(item, category))}](${item.link})**`,
      '',
      `**Why UXers care:** ${escapeCanvas(canvasWhyUxersCare(item))}`,
      '',
      links,
      '',
      `_${escapeCanvas(source)}_`,
      '',
    ];
  });
}

function canvasItemTitle(item, category) {
  const title = String(item.title || '');
  if (/China AI Workstream Bot/i.test(title)) return 'China AI digest: reusable agent workflow patterns';
  if (/Agents Can Publish Results Directly to Bpages/i.test(title)) return 'agents.booking.com: publish AI outputs to B.Pages';
  if (/AI for UX Prompt Session Recording/i.test(title)) return 'AI for UX: prompt session recording is available';
  if (/How Top PMs Increase Their Leverage with AI/i.test(title)) return "Lenny's: AI leverage playbook for UXers";
  if (/Figma Config 2026/i.test(title)) return 'Figma Config: design-to-build AI workspace';
  if (/Claude Tag/i.test(title)) return 'Claude Tag: AI delegation inside Slack';
  if (category === 'internal') return title.replace(/\b(Updates?|Adds?|Is Available)\b/gi, '').trim() || title;
  return title;
}

function canvasWhyUxersCare(item) {
  const title = String(item.title || '');
  if (/China AI Workstream Bot/i.test(title)) return 'UX technologists can reuse proven internal AI workflow patterns faster.';
  if (/Agents Can Publish Results Directly to Bpages/i.test(title)) return 'UX teams can turn recurring research or prototype summaries into shareable pages.';
  if (/AI for UX Prompt Session Recording/i.test(title)) return 'Designers, writers, and researchers get a shared prompting baseline.';
  if (/How Top PMs Increase Their Leverage with AI/i.test(title)) return 'It helps UXers shift toward AI-builder habits: framing, delegation, and judgment.';
  if (/Figma Config 2026/i.test(title)) return 'Design and build work is moving into one AI-assisted canvas.';
  return firstSentence(item.why);
}

function fallbackCanvasImage(item) {
  const title = String(item.title || '');
  if (/How Top PMs Increase Their Leverage with AI/i.test(title)) return 'assets/external/top-pms-leverage-ai.jpg';
  if (/Figma Config 2026/i.test(title)) return 'assets/week8/00-figma-config-2026-code-layers-motion.png';
  return '';
}

function firstSentence(value) {
  const sentence = splitSentences(String(value || ''))[0] || String(value || '');
  return sentence.replace(/\s+/g, ' ').trim();
}

function pickerItems(items, sourcePrefix) {
  if (!items?.length) return ['_No candidates found._'];
  return items.flatMap((item, index) => {
    const source = [sourcePrefix, item.source].filter(Boolean).join(' ');
    const recommended = item.recommended ? ' Recommended' : '';
    return [
      `${index + 1}. [${item.title}](${item.link})${recommended}`,
      `   Why UXers care: ${item.why}`,
      `   Source: ${source || 'Unknown source'}`,
      '',
    ];
  });
}

function appendChunk(chunks, text, maxLength) {
  if (text.length <= maxLength) {
    chunks.push(text);
    return;
  }

  const paragraphs = text.split(/\n\n+/);
  let current = '';
  paragraphs.forEach(paragraph => {
    const next = current ? `${current}\n\n${paragraph}` : paragraph;
    if (next.length > maxLength && current) {
      chunks.push(current);
      current = paragraph;
    } else {
      current = next;
    }
  });
  if (current) chunks.push(current);
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

function cardImageUrl(block) {
  const attrs = parseAttrs(firstMatch(block, /<div class="article-card-image"([^>]*)>/));
  return attrs['data-img'] || '';
}

function absoluteImageUrl(image, mediaBaseUrl = defaultMediaBaseUrl) {
  if (!image) return '';
  if (/^https?:\/\//i.test(image)) return image;
  return `${mediaBaseUrl.replace(/\/$/, '')}/${String(image).replace(/^\//, '')}`;
}

function localPreviewImageForUrl(html, url) {
  if (!html || !url) return '';
  const images = extractObjectLiteral(html, 'localPreviewImagesByUrl');
  return images[url] || images[normalizeUrl(url)] || '';
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    return parsed.href;
  } catch {
    return url || '';
  }
}

function extractBackfilledArray(html, variableName) {
  if (!html) return [];
  const pattern = new RegExp(`const\\s+${variableName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`);
  const match = html.match(pattern);
  if (!match) return [];
  try {
    const value = vm.runInNewContext(match[1], Object.freeze({}), { timeout: 1000 });
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function extractObjectLiteral(html, variableName) {
  if (!html) return {};
  const pattern = new RegExp(`const\\s+${variableName}\\s*=\\s*(\\{[\\s\\S]*?\\n\\s*\\});`);
  const match = html.match(pattern);
  if (!match) return {};
  try {
    const value = vm.runInNewContext(`(${match[1]})`, Object.freeze({}), { timeout: 1000 });
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
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
    'bpages', 'multilingual', 'design system', 'ux', 'ai builder', 'builder',
    'product work', 'pm', 'pms', 'leverage', 'practice model', 'judgment'
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

function escapeCanvas(value) {
  return String(value || '').replace(/[\[\]]/g, '\\$&');
}
