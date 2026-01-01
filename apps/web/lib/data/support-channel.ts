import type { ChannelHeaderItemVM, ChannelVM } from '@iconicedu/shared-types';
import { CHANNEL_IDS, ORG_ID, PROFILE_IDS } from './ids';
import { GUARDIAN_MORGAN, STAFF_SUPPORT } from './profiles';
import { EMPTY_FILES } from './channel-files';
import { EMPTY_MEDIA } from './channel-media';
import { SUPPORT_MESSAGES_CONNECTION } from './channel-messages';

const SUPPORT_HEADER_ITEMS: ChannelHeaderItemVM[] = [
  {
    key: 'saved',
    label: 'Saved',
    tooltip: 'Saved messages',
  },
  {
    key: 'last-seen',
    label: 'Support is online',
    tooltip: 'Support availability',
  },
];

export const SUPPORT_CHANNEL: ChannelVM = {
  ids: {
    id: CHANNEL_IDS.dmSupport,
    orgId: ORG_ID,
  },
  basics: {
    kind: 'channel',
    topic: 'Iconic Support',
    topicIconKey: 'life-buoy',
    description: 'Support chat for scheduling and product questions.',
    visibility: 'private',
    purpose: 'support',
  },
  lifecycle: {
    status: 'active',
    createdBy: PROFILE_IDS.staff,
    createdAt: '2026-02-06T21:00:00.000Z',
    archivedAt: null,
  },
  postingPolicy: {
    kind: 'members-only',
    allowThreads: true,
    allowReactions: true,
  },
  headerItems: SUPPORT_HEADER_ITEMS,
  context: {
    capabilities: null,
  },
  collections: {
    participants: [GUARDIAN_MORGAN, STAFF_SUPPORT],
    messages: SUPPORT_MESSAGES_CONNECTION,
    media: EMPTY_MEDIA,
    files: EMPTY_FILES,
    readState: {
      channelId: CHANNEL_IDS.dmSupport,
      lastReadMessageId: SUPPORT_MESSAGES_CONNECTION.items[1]?.ids.id,
      lastReadAt: '2026-02-06T21:10:00.000Z',
      unreadCount: 0,
    },
  },
  ui: {
    defaultRightPanelOpen: false,
  },
};
