import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../draft-new-ia.html', import.meta.url), 'utf8');
const resourcesPage = html.match(/<div class="page" id="page-resources">([\s\S]*?)<\/div>\s*<\/div>\s*<script>/)?.[1] ?? '';

test('uses the approved Knowledge Hub title and three categories', () => {
  assert.match(resourcesPage, /Booking\.com UX AI Knowledge Hub/);
  assert.match(resourcesPage, /UX AI Foundations/);
  assert.doesNotMatch(resourcesPage, />Start here</);
  assert.match(resourcesPage, /Workflow \/ playbooks \/ use cases/);
  assert.match(resourcesPage, /AI tools \/ prototyping \/ setup/);
  assert.doesNotMatch(resourcesPage, /Governance \/ standards/);
  assert.equal((resourcesPage.match(/<section class="resource-category(?: resource-category--wide)?">/g) ?? []).length, 3);
});

test('uses a wide foundations card above two equal category cards', () => {
  assert.match(html, /\.resource-categories \{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(resourcesPage, /<section class="resource-category resource-category--wide">[\s\S]*?UX AI Foundations/);
  assert.match(html, /\.resource-category--wide \{[^}]*grid-column: 1 \/ -1/);
  assert.match(html, /\.resource-category--wide \.resource-links \{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(html, /\.resource-category--wide \.resource-links \{[^}]*column-gap: 68px/);
  assert.match(html, /\.resource-category-heading \{[^}]*align-items: center/);
  assert.doesNotMatch(resourcesPage, /resource-subcategory/);
  assert.doesNotMatch(resourcesPage, /Department and company hubs|Workflow entry points|Workflow playbooks|Use-case and practice hubs|Enablement and showcase|Core AI tools|Prototyping tools|Setup and integrations|Learning and enablement|Policy and standards|Responsible AI<\/h4>/);
  assert.doesNotMatch(resourcesPage, /resource-category--featured/);
});

test('includes every approved resource URL', () => {
  const urls = [
    'https://booking.atlassian.net/wiki/spaces/AIUX/pages/1444709652',
    'https://docs.google.com/document/d/1kAgffC97MTcmlE2efOQwsgCcWYiZSZCFdOQBRlhrOMc',
    'https://booking.atlassian.net/wiki/spaces/GenAI/pages/60623584',
    'https://booking.atlassian.net/wiki/spaces/FINACCAI/pages/1242843761',
    'https://booking.atlassian.net/wiki/spaces/FINACCAI/pages/1065485328',
    'https://aistudio.booking.com/',
    'https://skills.booking.com',
    'https://genai.booking.com/mcps',
    'https://bpages.booking.com/oG3L/introduction-to-dieter?raw=1#tools'
  ];

  urls.forEach(url => assert.ok(resourcesPage.includes(url), `missing ${url}`));
});

test('removes requested links and opens all ten remaining placements in a safe new tab', () => {
  const links = resourcesPage.match(/<a class="resource-link"[\s\S]*?<\/a>/g) ?? [];
  assert.equal(links.length, 10);
  [
    'UX Home',
    'Next.js BUI Starter Kit',
    'Generative AI for UX',
    'Employee AI Live Sessions',
    'AI Page Builder',
    'AI Standard',
    'Responsible AI at Booking.com',
    'What is Responsible AI'
  ].forEach(label => assert.ok(!resourcesPage.includes(label), `unexpected ${label}`));
  assert.doesNotMatch(resourcesPage, /https:\/\/ux\.booking\.com\//);
  links.forEach(link => {
    assert.match(link, /target="_blank"/);
    assert.match(link, /rel="noopener noreferrer"/);
    assert.doesNotMatch(link, /href="#"/);
  });
});

test('places Dieter in the AI tools category', () => {
  const tools = resourcesPage.match(/AI tools \/ prototyping \/ setup[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(tools, />Dieter</);
  assert.match(tools, /href="https:\/\/bpages\.booking\.com\/oG3L\/introduction-to-dieter\?raw=1#tools"/);
});

test('keeps the two shared resources in only the requested categories', () => {
  const foundations = resourcesPage.match(/UX AI Foundations[\s\S]*?<\/section>/)?.[0] ?? '';
  const workflow = resourcesPage.match(/Workflow \/ playbooks \/ use cases[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.doesNotMatch(foundations, /GenAI Playbook for UX/);
  assert.doesNotMatch(workflow, /AI-UX Hub @ Fintech/);
});

test('supports a direct Resources Hub preview URL', () => {
  assert.match(html, /\['latest', 'all', 'resources'\]\.includes\(initialPage\)/);
});
