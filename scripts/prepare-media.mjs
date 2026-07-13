#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const indexPath = path.join(repoRoot, 'index.html');
const manifestPath = path.join(repoRoot, 'assets', 'media-manifest.json');
const args = new Set(process.argv.slice(2));
const shouldWriteManifest = args.has('--write-manifest');
const strict = !args.has('--no-strict');

const html = fs.readFileSync(indexPath, 'utf8');
const localPreviewImagesByUrl = parseLocalPreviewMap(html);
const publicCards = parsePublicCards(html);
const mediaEntries = publicCards.map(resolveMediaForCard);
const findings = auditMedia(mediaEntries);

if (shouldWriteManifest) {
  writeManifest(mediaEntries, findings);
}

printReport(mediaEntries, findings);

if (strict && findings.errors.length) {
  process.exit(1);
}

function parseLocalPreviewMap(source) {
  const match = source.match(/const\s+localPreviewImagesByUrl\s*=\s*\{([\s\S]*?)\n\s*\};/);
  const map = new Map();
  if (!match) return map;

  const entryPattern = /['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g;
  let entry;
  while ((entry = entryPattern.exec(match[1])) !== null) {
    map.set(normalizeUrl(entry[1]), entry[2]);
    map.set(normalizeUrl(entry[1]).replace(/\/$/, ''), entry[2]);
  }
  return map;
}

function parsePublicCards(source) {
  const cards = [];
  const staticMarkup = source.slice(0, source.indexOf('<script>') === -1 ? source.length : source.indexOf('<script>'));
  const cardPattern = /<a\s+class="article-card"([\s\S]*?)<\/a>/g;
  let match;
  while ((match = cardPattern.exec(staticMarkup)) !== null) {
    const block = match[0];
    const openAttrs = match[1];
    const imageMatch = block.match(/<div\s+class="article-card-image"([^>]*)>/);
    const imageAttrs = imageMatch ? parseAttrs(imageMatch[1]) : {};
    cards.push({
      title: textContent(firstMatch(block, /<h3\s+class="article-card-title">([\s\S]*?)<\/h3>/)),
      url: decodeHtml(parseAttrs(openAttrs).href || ''),
      source: textContent(firstMatch(block, /<div\s+class="article-card-meta"><span>([\s\S]*?)<\/span>/)),
      date: textContent(firstMatch(block, /<div\s+class="article-card-meta">[\s\S]*?<span>[\s\S]*?<\/span><span>([\s\S]*?)<\/span>/)),
      section: imageAttrs['data-section'] || '',
      label: imageAttrs['data-label'] || '',
      dataImg: imageAttrs['data-img'] || '',
      youtubeId: imageAttrs['data-yt-id'] || '',
    });
  }
  return cards;
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

function resolveMediaForCard(card) {
  const normalizedUrl = normalizeUrl(card.url);
  const mappedImage = localPreviewImagesByUrl.get(normalizedUrl) || localPreviewImagesByUrl.get(normalizedUrl.replace(/\/$/, '')) || '';
  const mediaPath = card.dataImg || mappedImage;
  const mediaSource = card.dataImg
    ? 'data-img'
    : mappedImage
      ? 'localPreviewImagesByUrl'
      : card.youtubeId
        ? 'youtube'
        : 'runtime-fallback';
  const local = mediaPath.startsWith('assets/');
  const absolutePath = local ? path.join(repoRoot, mediaPath) : '';
  const fileInfo = local ? inspectImageFile(absolutePath) : null;

  return {
    title: card.title,
    source: card.source,
    date: card.date,
    url: card.url,
    label: card.label,
    section: card.section,
    mediaSource,
    localImage: local ? mediaPath : '',
    youtubeId: card.youtubeId,
    validation: validateMedia({ card, mediaSource, mediaPath, local, absolutePath, fileInfo }),
    file: fileInfo,
  };
}

function inspectImageFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false };
  }
  const buffer = fs.readFileSync(filePath);
  const extension = path.extname(filePath).toLowerCase().replace('.', '');
  const format = detectImageFormat(buffer, extension);
  const sizeBytes = buffer.length;
  const dimensions = getImageDimensions(buffer, format);
  const asciiHead = buffer.subarray(0, Math.min(buffer.length, 4096)).toString('utf8').toLowerCase();
  return {
    exists: true,
    extension,
    format,
    sizeBytes,
    width: dimensions.width,
    height: dimensions.height,
    suspiciousText: hasSuspiciousText(asciiHead),
    generatedTitleCard: isGeneratedTitleCard({ filePath, format, asciiHead }),
  };
}

function validateMedia({ card, mediaSource, mediaPath, local, absolutePath, fileInfo }) {
  const errors = [];
  const warnings = [];
  const notes = [];

  if (card.youtubeId && mediaSource === 'youtube') {
    warnings.push('YouTube card uses runtime YouTube thumbnail; consider caching it locally for B.Pages consistency.');
    return { status: 'warning', errors, warnings, notes };
  }

  if (mediaSource === 'runtime-fallback') {
    errors.push('No checked-in local media. This card would depend on Microlink/thum.io/generated runtime fallback.');
    return { status: 'error', errors, warnings, notes };
  }

  if (!local) {
    errors.push(`Media is not a checked-in local asset: ${mediaPath}`);
    return { status: 'error', errors, warnings, notes };
  }

  if (!fileInfo?.exists) {
    errors.push(`Local media file is missing: ${path.relative(repoRoot, absolutePath)}`);
    return { status: 'error', errors, warnings, notes };
  }

  if (!['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'].includes(fileInfo.extension) && !['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'].includes(fileInfo.format)) {
    errors.push(`Unsupported media type: ${fileInfo.extension || fileInfo.format}`);
  }

  if (fileInfo.suspiciousText) {
    errors.push('Media file contains blocked/login/access-denied text.');
  }

  if (fileInfo.generatedTitleCard) {
    warnings.push('Generated SVG title-card media. Prefer a source-native hero, screenshot, or cached OG image for public cards.');
  }

  if (fileInfo.width && fileInfo.height) {
    if (fileInfo.width < 300 || fileInfo.height < 160) {
      warnings.push(`Small image dimensions: ${fileInfo.width}x${fileInfo.height}.`);
    }
    const ratio = fileInfo.width / fileInfo.height;
    if (ratio < 1.2 || ratio > 2.2) {
      warnings.push(`Unusual card aspect ratio: ${ratio.toFixed(2)}.`);
    }
  } else if (fileInfo.format !== 'svg') {
    warnings.push('Could not read image dimensions.');
  }

  if (fileInfo.sizeBytes < 5000 && fileInfo.format !== 'svg') {
    warnings.push(`Very small image file: ${formatBytes(fileInfo.sizeBytes)}. This may be a logo or failed preview.`);
  }

  if (fileInfo.sizeBytes > 600 * 1024) {
    warnings.push(`Large image file: ${formatBytes(fileInfo.sizeBytes)}. Compress before B.Pages upload.`);
  }

  if (isKnownLowQualityPair(card.url, mediaPath)) {
    errors.push('Known low-quality preview pairing. Replace with a source-relevant visual.');
  }

  const status = errors.length ? 'error' : warnings.length ? 'warning' : 'ok';
  return { status, errors, warnings, notes };
}

function auditMedia(entries) {
  const errors = [];
  const warnings = [];
  const counts = {};

  for (const entry of entries) {
    counts[entry.mediaSource] = (counts[entry.mediaSource] || 0) + 1;
    for (const error of entry.validation.errors) {
      errors.push({ title: entry.title, message: error });
    }
    for (const warning of entry.validation.warnings) {
      warnings.push({ title: entry.title, message: warning });
    }
  }

  return { errors, warnings, counts };
}

function writeManifest(entries, findings) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    purpose: 'Pre-publish media decisions for the AI x Design Weekly website.',
    policy: {
      preferred: ['data-img local asset', 'localPreviewImagesByUrl local asset', 'cached YouTube thumbnail'],
      avoidForPublishedCards: ['Microlink runtime fetch', 'thum.io runtime screenshot', 'blocked/login screenshots', 'tiny logo-only previews'],
    },
    summary: {
      cards: entries.length,
      errors: findings.errors.length,
      warnings: findings.warnings.length,
      counts: findings.counts,
    },
    entries: entries.map(entry => ({
      title: entry.title,
      source: entry.source,
      date: entry.date,
      url: entry.url,
      mediaSource: entry.mediaSource,
      localImage: entry.localImage,
      youtubeId: entry.youtubeId,
      dimensions: entry.file?.width && entry.file?.height ? `${entry.file.width}x${entry.file.height}` : '',
      sizeBytes: entry.file?.sizeBytes || 0,
      status: entry.validation.status,
      issues: [...entry.validation.errors, ...entry.validation.warnings],
    })),
  };
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function printReport(entries, findings) {
  const okCount = entries.filter(entry => entry.validation.status === 'ok').length;
  const warningCount = entries.filter(entry => entry.validation.status === 'warning').length;
  const errorCount = entries.filter(entry => entry.validation.status === 'error').length;

  console.log('Media prepare audit');
  console.log(`Cards checked: ${entries.length}`);
  console.log(`OK: ${okCount}  Warnings: ${warningCount}  Errors: ${errorCount}`);
  console.log(`Media sources: ${JSON.stringify(findings.counts)}`);

  if (findings.errors.length) {
    console.log('\nErrors');
    for (const finding of findings.errors) {
      console.log(`- ${finding.title}: ${finding.message}`);
    }
  }

  if (findings.warnings.length) {
    console.log('\nWarnings');
    for (const finding of findings.warnings) {
      console.log(`- ${finding.title}: ${finding.message}`);
    }
  }

  if (shouldWriteManifest) {
    console.log(`\nWrote ${path.relative(repoRoot, manifestPath)}`);
  }
}

function detectImageFormat(buffer, extension) {
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer.toString('ascii', 1, 4) === 'PNG') return 'png';
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpg';
  if (buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6))) return 'gif';
  if (buffer.toString('utf8', 0, Math.min(buffer.length, 256)).trimStart().startsWith('<svg')) return 'svg';
  return extension;
}

function getImageDimensions(buffer, format) {
  if (format === 'png') return getPngDimensions(buffer);
  if (format === 'jpg' || format === 'jpeg') return getJpegDimensions(buffer);
  if (format === 'webp') return getWebpDimensions(buffer);
  if (format === 'gif') return getGifDimensions(buffer);
  if (format === 'svg') return getSvgDimensions(buffer);
  return { width: 0, height: 0 };
}

function getPngDimensions(buffer) {
  if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') return { width: 0, height: 0 };
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function getJpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return { width: 0, height: 0 };
  }

  let offset = 2;
  while (offset < buffer.length - 1) {
    while (offset < buffer.length && buffer[offset] !== 0xff) offset += 1;
    while (offset < buffer.length && buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset];
    offset += 1;

    if (marker === 0xd9 || marker === 0xda) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > buffer.length) break;

    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) break;

    const isStartOfFrame = (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    );
    if (isStartOfFrame && length >= 7) {
      return { width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3) };
    }
    offset += length;
  }
  return { width: 0, height: 0 };
}

function getSvgDimensions(buffer) {
  const text = buffer.toString('utf8', 0, Math.min(buffer.length, 2048));
  const width = firstNumber(text.match(/\bwidth=["']?([\d.]+)/i)?.[1]);
  const height = firstNumber(text.match(/\bheight=["']?([\d.]+)/i)?.[1]);
  if (width && height) return { width, height };
  const viewBox = text.match(/\bviewBox=["'][^"']*?\s([\d.]+)\s+([\d.]+)["']/i);
  return { width: firstNumber(viewBox?.[1]), height: firstNumber(viewBox?.[2]) };
}

function getGifDimensions(buffer) {
  if (buffer.length < 10) return { width: 0, height: 0 };
  return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
}

function getWebpDimensions(buffer) {
  if (buffer.length < 30 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    return { width: 0, height: 0 };
  }

  const chunkType = buffer.toString('ascii', 12, 16);
  if (chunkType === 'VP8 ' && buffer.length >= 30) {
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  }
  if (chunkType === 'VP8L' && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunkType === 'VP8X' && buffer.length >= 30) {
    const width = 1 + buffer[24] + (buffer[25] << 8) + (buffer[26] << 16);
    const height = 1 + buffer[27] + (buffer[28] << 8) + (buffer[29] << 16);
    return { width, height };
  }
  return { width: 0, height: 0 };
}

function hasSuspiciousText(text) {
  return [
    'sorry, you have been blocked',
    'access denied',
    'not authorized',
    'please sign up',
    'sign in',
    'enable cookies',
    'cloudflare',
    'captcha',
  ].some(pattern => text.includes(pattern));
}

function isGeneratedTitleCard({ filePath, format, asciiHead }) {
  const relativePath = path.relative(repoRoot, filePath).replaceAll(path.sep, '/');
  return format === 'svg'
    && /^assets\/week\d+\//.test(relativePath)
    && asciiHead.includes('<text')
    && asciiHead.includes('font-family="arial');
}

function isKnownLowQualityPair(url, mediaPath) {
  return url.includes('investor.figma.com') && mediaPath.includes('figma-config-2026-announced');
}

function firstMatch(source, pattern) {
  return source.match(pattern)?.[1] || '';
}

function textContent(source) {
  return decodeHtml(source.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
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

function firstNumber(value) {
  const parsed = Number.parseFloat(value || '');
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
