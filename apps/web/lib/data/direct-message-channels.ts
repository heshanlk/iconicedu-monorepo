import type { ChannelVM, HeaderQuickMetaAction } from '@iconicedu/shared-types';
import { CHANNEL_IDS, ORG_ID, PROFILE_IDS } from './ids';
import {
  EDUCATOR_ELENA,
  EDUCATOR_KAI,
  EDUCATOR_LEO,
  EDUCATOR_PRIYA,
  EDUCATOR_SOFIA,
  GUARDIAN_MORGAN,
} from './profiles';
import {
  DM_EDU1_MESSAGES_CONNECTION,
  DM_EDU2_MESSAGES_CONNECTION,
  DM_EDU3_MESSAGES_CONNECTION,
  DM_EDU4_MESSAGES_CONNECTION,
  DM_EDU5_MESSAGES_CONNECTION,
} from './channel-messages';
import { DM_EDU1_MEDIA, DM_EDU3_MEDIA, EMPTY_MEDIA } from './channel-media';
import {
  DM_EDU1_FILES,
  DM_EDU2_FILES,
  DM_EDU3_FILES,
  EMPTY_FILES,
} from './channel-files';

const dmKeyFor = (a: string, b: string) => `dm:${[a, b].sort().join('-')}`;

const DM_HEADER_QUICK_META: HeaderQuickMetaAction[] = [
  {
    key: 'saved',
    label: 'Saved',
    tooltip: 'Saved messages',
  },
  {
    key: 'last-seen',
    label: 'Last seen 10m ago',
    tooltip: 'Last active',
  },
];

export const DM_CHANNEL_ELENA: ChannelVM = {
  ids: {
    id: CHANNEL_IDS.dmEducator1,
    orgId: ORG_ID,
  },
  basics: {
    kind: 'dm',
    topic: EDUCATOR_ELENA.profile.displayName,
    iconKey: null,
    description: 'Direct messages with Elena Brooks.',
    visibility: 'private',
    purpose: 'support',
  },
  lifecycle: {
    status: 'active',
    createdBy: PROFILE_IDS.guardian,
    createdAt: '2025-11-01T00:00:00.000Z',
    archivedAt: null,
  },
  postingPolicy: {
    kind: 'members-only',
    allowThreads: true,
    allowReactions: true,
  },
  dm: {
    dmKey: dmKeyFor(PROFILE_IDS.guardian, PROFILE_IDS.educator1),
  },
  collections: {
    participants: [GUARDIAN_MORGAN, EDUCATOR_ELENA],
    messages: DM_EDU1_MESSAGES_CONNECTION,
    media: DM_EDU1_MEDIA,
    files: DM_EDU1_FILES,
    readState: {
      channelId: CHANNEL_IDS.dmEducator1,
      lastReadMessageId: DM_EDU1_MESSAGES_CONNECTION.items[1]?.ids.id,
      lastReadAt: '2026-02-06T18:05:00.000Z',
      unreadCount: 1,
    },
  },
  ui: {
    headerQuickMetaActions: DM_HEADER_QUICK_META,
    headerActions: [
      { key: 'info', label: 'Info', iconKey: 'info' },
      { key: 'saved', label: 'Saved', iconKey: 'saved', intentKey: 'saved' },
    ],
  },
};

export const DM_CHANNEL_KAI: ChannelVM = {
  ids: {
    id: CHANNEL_IDS.dmEducator2,
    orgId: ORG_ID,
  },
  basics: {
    kind: 'dm',
    topic: EDUCATOR_KAI.profile.displayName,
    iconKey: null,
    description: 'Direct messages with Kai Patel.',
    visibility: 'private',
    purpose: 'support',
  },
  lifecycle: {
    status: 'active',
    createdBy: PROFILE_IDS.guardian,
    createdAt: '2025-11-02T00:00:00.000Z',
    archivedAt: null,
  },
  postingPolicy: {
    kind: 'members-only',
    allowThreads: true,
    allowReactions: true,
  },
  dm: {
    dmKey: dmKeyFor(PROFILE_IDS.guardian, PROFILE_IDS.educator2),
  },
  collections: {
    participants: [GUARDIAN_MORGAN, EDUCATOR_KAI],
    messages: DM_EDU2_MESSAGES_CONNECTION,
    media: EMPTY_MEDIA,
    files: DM_EDU2_FILES,
    readState: {
      channelId: CHANNEL_IDS.dmEducator2,
      lastReadMessageId: DM_EDU2_MESSAGES_CONNECTION.items[0]?.ids.id,
      lastReadAt: '2026-02-06T18:55:00.000Z',
      unreadCount: 1,
    },
  },
  ui: {
    headerQuickMetaActions: DM_HEADER_QUICK_META,
    headerActions: [
      { key: 'info', label: 'Info', iconKey: 'info' },
      { key: 'saved', label: 'Saved', iconKey: 'saved', intentKey: 'saved' },
    ],
  },
};

export const DM_CHANNEL_PRIYA: ChannelVM = {
  ids: {
    id: CHANNEL_IDS.dmEducator3,
    orgId: ORG_ID,
  },
  basics: {
    kind: 'dm',
    topic: EDUCATOR_PRIYA.profile.displayName,
    iconKey: null,
    description: 'Direct messages with Priya Natarajan.',
    visibility: 'private',
    purpose: 'support',
  },
  lifecycle: {
    status: 'active',
    createdBy: PROFILE_IDS.guardian,
    createdAt: '2025-11-03T00:00:00.000Z',
    archivedAt: null,
  },
  postingPolicy: {
    kind: 'members-only',
    allowThreads: true,
    allowReactions: true,
  },
  dm: {
    dmKey: dmKeyFor(PROFILE_IDS.guardian, PROFILE_IDS.educator3),
  },
  collections: {
    participants: [GUARDIAN_MORGAN, EDUCATOR_PRIYA],
    messages: DM_EDU3_MESSAGES_CONNECTION,
    media: DM_EDU3_MEDIA,
    files: DM_EDU3_FILES,
    readState: {
      channelId: CHANNEL_IDS.dmEducator3,
      lastReadMessageId: DM_EDU3_MESSAGES_CONNECTION.items[0]?.ids.id,
      lastReadAt: '2026-02-06T19:05:00.000Z',
      unreadCount: 1,
    },
  },
  ui: {
    headerQuickMetaActions: DM_HEADER_QUICK_META,
    headerActions: [
      { key: 'info', label: 'Info', iconKey: 'info' },
      { key: 'saved', label: 'Saved', iconKey: 'saved', intentKey: 'saved' },
    ],
  },
};

export const DM_CHANNEL_LEO: ChannelVM = {
  ids: {
    id: CHANNEL_IDS.dmEducator4,
    orgId: ORG_ID,
  },
  basics: {
    kind: 'dm',
    topic: EDUCATOR_LEO.profile.displayName,
    iconKey: null,
    description: 'Direct messages with Leo Martinez.',
    visibility: 'private',
    purpose: 'support',
  },
  lifecycle: {
    status: 'active',
    createdBy: PROFILE_IDS.guardian,
    createdAt: '2025-11-04T00:00:00.000Z',
    archivedAt: null,
  },
  postingPolicy: {
    kind: 'members-only',
    allowThreads: true,
    allowReactions: true,
  },
  dm: {
    dmKey: dmKeyFor(PROFILE_IDS.guardian, PROFILE_IDS.educator4),
  },
  collections: {
    participants: [GUARDIAN_MORGAN, EDUCATOR_LEO],
    messages: DM_EDU4_MESSAGES_CONNECTION,
    media: EMPTY_MEDIA,
    files: EMPTY_FILES,
    readState: {
      channelId: CHANNEL_IDS.dmEducator4,
      lastReadMessageId: DM_EDU4_MESSAGES_CONNECTION.items[0]?.ids.id,
      lastReadAt: '2026-02-06T19:45:00.000Z',
      unreadCount: 0,
    },
  },
  ui: {
    headerQuickMetaActions: DM_HEADER_QUICK_META,
    headerActions: [
      { key: 'info', label: 'Info', iconKey: 'info' },
      { key: 'saved', label: 'Saved', iconKey: 'saved', intentKey: 'saved' },
    ],
  },
};

export const DM_CHANNEL_SOFIA: ChannelVM = {
  ids: {
    id: CHANNEL_IDS.dmEducator5,
    orgId: ORG_ID,
  },
  basics: {
    kind: 'dm',
    topic: EDUCATOR_SOFIA.profile.displayName,
    iconKey: null,
    description: 'Direct messages with Sofia Rossi.',
    visibility: 'private',
    purpose: 'support',
  },
  lifecycle: {
    status: 'active',
    createdBy: PROFILE_IDS.guardian,
    createdAt: '2025-11-05T00:00:00.000Z',
    archivedAt: null,
  },
  postingPolicy: {
    kind: 'members-only',
    allowThreads: true,
    allowReactions: true,
  },
  dm: {
    dmKey: dmKeyFor(PROFILE_IDS.guardian, PROFILE_IDS.educator5),
  },
  collections: {
    participants: [GUARDIAN_MORGAN, EDUCATOR_SOFIA],
    messages: DM_EDU5_MESSAGES_CONNECTION,
    media: EMPTY_MEDIA,
    files: EMPTY_FILES,
    readState: {
      channelId: CHANNEL_IDS.dmEducator5,
      lastReadMessageId: DM_EDU5_MESSAGES_CONNECTION.items[0]?.ids.id,
      lastReadAt: '2026-02-06T20:10:00.000Z',
      unreadCount: 1,
    },
  },
  ui: {
    headerQuickMetaActions: DM_HEADER_QUICK_META,
    headerActions: [
      { key: 'info', label: 'Info', iconKey: 'info' },
      { key: 'saved', label: 'Saved', iconKey: 'saved', intentKey: 'saved' },
    ],
  },
};

export const DIRECT_MESSAGE_CHANNELS: ChannelVM[] = [
  DM_CHANNEL_ELENA,
  DM_CHANNEL_KAI,
  DM_CHANNEL_PRIYA,
  DM_CHANNEL_LEO,
  DM_CHANNEL_SOFIA,
];

export const DIRECT_MESSAGE_CHANNELS_BY_ID: Record<string, ChannelVM> = {
  [CHANNEL_IDS.dmEducator1]: DM_CHANNEL_ELENA,
  [CHANNEL_IDS.dmEducator2]: DM_CHANNEL_KAI,
  [CHANNEL_IDS.dmEducator3]: DM_CHANNEL_PRIYA,
  [CHANNEL_IDS.dmEducator4]: DM_CHANNEL_LEO,
  [CHANNEL_IDS.dmEducator5]: DM_CHANNEL_SOFIA,
};
