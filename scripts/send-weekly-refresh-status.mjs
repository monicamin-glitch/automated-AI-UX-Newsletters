#!/usr/bin/env node

import {
  defaultSlackReviewerId,
  readRefreshStatus,
  slackConfig,
  statusPath,
} from './weekly-refresh-status.mjs';

const status = readRefreshStatus();
if (!status) {
  throw new Error(`Missing refresh status file: ${statusPath}`);
}

const slack = slackConfig();
if (!slack.botTokenPresent) {
  throw new Error('Missing SLACK_BOT_TOKEN. Cannot send the status DM.');
}
if (slack.reviewerIdSource === 'default') {
  console.log(`Using default reviewer fallback ${defaultSlackReviewerId}. Set SLACK_REVIEWER_ID in the automation runtime to make the DM target explicit.`);
}

const isPublished = status.status === 'published';
const text = isPublished
  ? [
    '*Weekly AI x UX website refresh is ready*',
    `Week: ${status.week?.label} (${status.week?.range})`,
    `Cards: ${status.counts?.cards} (${status.counts?.internal} internal, ${status.counts?.external} external)`,
    `B.Pages: ${status.bpages?.url}`,
  ].join('\n')
  : [
    '*Weekly AI x UX website refresh is not ready*',
    `Status: ${status.status}`,
    `Week: ${status.week?.label || '(unknown)'} (${status.week?.range || 'no range'})`,
    ...(status.errors?.length ? ['', ...status.errors.map(error => `- ${error}`)] : []),
    '',
    'The picker should be skipped until this is fixed.',
  ].join('\n');

const response = await fetch('https://slack.com/api/chat.postMessage', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    'Content-Type': 'application/json; charset=utf-8',
  },
  body: JSON.stringify({
    channel: slack.reviewerId,
    text,
    unfurl_links: false,
    unfurl_media: false,
  }),
});

const body = await response.json();
if (!response.ok || !body.ok) {
  throw new Error(`Slack API chat.postMessage failed: ${JSON.stringify(body)}`);
}

console.log(`Sent weekly refresh status to ${slack.reviewerId}`);

const groupChatId = process.env.SLACK_PICKER_CHANNEL_ID;
if (groupChatId && groupChatId !== slack.reviewerId) {
  const groupResponse = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      channel: groupChatId,
      text,
      unfurl_links: false,
      unfurl_media: false,
    }),
  });
  const groupBody = await groupResponse.json();
  if (!groupResponse.ok || !groupBody.ok) {
    console.error(`Warning: failed to send status to group chat ${groupChatId}: ${JSON.stringify(groupBody)}`);
  } else {
    console.log(`Sent weekly refresh status to group chat ${groupChatId}`);
  }
}
