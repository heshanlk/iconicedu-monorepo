import type { ChannelHeaderItemVM, ChannelVM } from '@iconicedu/shared-types';
import {
  CHANNEL_IDS,
  LEARNING_SPACE_IDS,
  ORG_ID,
  PROFILE_IDS,
} from './ids';
import {
  CHILD_AVA,
  CHILD_MAYA,
  CHILD_MILO,
  EDUCATOR_ELENA,
  EDUCATOR_KAI,
  EDUCATOR_LEO,
  EDUCATOR_PRIYA,
  GUARDIAN_MORGAN,
} from './profiles';
import {
  CHESS_FILES,
  ELA_FILES,
  MATH_FILES,
  SCIENCE_FILES,
} from './channel-files';
import {
  CHESS_MEDIA,
  ELA_MEDIA,
  MATH_MEDIA,
  SCIENCE_MEDIA,
} from './channel-media';
import {
  CHESS_MESSAGES_CONNECTION,
  ELA_MESSAGES_CONNECTION,
  MATH_MESSAGES_CONNECTION,
  SCIENCE_MESSAGES_CONNECTION,
} from './channel-messages';

const makeHeaderItems = (nextSessionLabel: string): ChannelHeaderItemVM[] => [
  {
    key: 'saved',
    label: 'Saved',
    tooltip: 'Saved messages',
  },
  {
    key: 'homework',
    label: 'Homework',
    tooltip: 'Homework updates',
  },
  {
    key: 'session-summary',
    label: 'Session summaries',
    tooltip: 'Session summaries',
  },
  {
    key: 'next-session',
    label: nextSessionLabel,
    tooltip: 'Next session',
  },
];

export const MATH_CHANNEL: ChannelVM = {
  ids: {
    id: CHANNEL_IDS.math,
    orgId: ORG_ID,
  },
  basics: {
    kind: 'channel',
    topic: `Math • ${EDUCATOR_KAI.profile.displayName} • Wed 5:30 PM`,
    iconKey: 'square-pi',
    description: 'Weekly math mastery sessions.',
    visibility: 'private',
    purpose: 'learning-space',
  },
  lifecycle: {
    status: 'active',
    createdBy: PROFILE_IDS.educator2,
    createdAt: '2025-09-10T00:00:00.000Z',
    archivedAt: null,
  },
  postingPolicy: {
    kind: 'members-only',
    allowThreads: true,
    allowReactions: true,
  },
  context: {
    primaryEntity: { kind: 'learning_space', id: LEARNING_SPACE_IDS.math },
    capabilities: ['has_schedule', 'has_homework', 'has_summaries'],
  },
  collections: {
    participants: [GUARDIAN_MORGAN, CHILD_AVA, EDUCATOR_KAI],
    messages: MATH_MESSAGES_CONNECTION,
    media: MATH_MEDIA,
    files: MATH_FILES,
    readState: {
      channelId: CHANNEL_IDS.math,
      lastReadMessageId: MATH_MESSAGES_CONNECTION.items[2]?.ids.id,
      lastReadAt: '2026-02-09T22:20:00.000Z',
      unreadCount: 2,
    },
  },
  ui: {
    defaultRightPanelOpen: true,
    defaultRightPanelKey: 'channel_info',
    headerItems: makeHeaderItems('Wed Mar 4 • 5:30 PM'),
    headerActions: [
      { key: 'info', label: 'Info', iconKey: 'info' },
      { key: 'saved', label: 'Saved', iconKey: 'saved', intentKey: 'saved' },
    ],
  },
};

export const SCIENCE_CHANNEL: ChannelVM = {
  ids: {
    id: CHANNEL_IDS.science,
    orgId: ORG_ID,
  },
  basics: {
    kind: 'channel',
    topic: `Science • ${EDUCATOR_PRIYA.profile.displayName} • Tue 5:00 PM`,
    iconKey: 'earth',
    description: 'Lab-based science explorations.',
    visibility: 'private',
    purpose: 'learning-space',
  },
  lifecycle: {
    status: 'active',
    createdBy: PROFILE_IDS.educator3,
    createdAt: '2025-09-12T00:00:00.000Z',
    archivedAt: null,
  },
  postingPolicy: {
    kind: 'members-only',
    allowThreads: true,
    allowReactions: true,
  },
  context: {
    primaryEntity: { kind: 'learning_space', id: LEARNING_SPACE_IDS.science },
    capabilities: ['has_schedule', 'has_homework', 'has_summaries'],
  },
  collections: {
    participants: [GUARDIAN_MORGAN, CHILD_MILO, EDUCATOR_PRIYA],
    messages: SCIENCE_MESSAGES_CONNECTION,
    media: SCIENCE_MEDIA,
    files: SCIENCE_FILES,
    readState: {
      channelId: CHANNEL_IDS.science,
      lastReadMessageId: SCIENCE_MESSAGES_CONNECTION.items[1]?.ids.id,
      lastReadAt: '2026-02-08T20:12:00.000Z',
      unreadCount: 2,
    },
  },
  ui: {
    defaultRightPanelOpen: true,
    defaultRightPanelKey: 'channel_info',
    headerItems: makeHeaderItems('Tue Mar 3 • 5:00 PM'),
    headerActions: [
      { key: 'info', label: 'Info', iconKey: 'info' },
      { key: 'saved', label: 'Saved', iconKey: 'saved', intentKey: 'saved' },
    ],
  },
};

export const ELA_CHANNEL: ChannelVM = {
  ids: {
    id: CHANNEL_IDS.ela,
    orgId: ORG_ID,
  },
  basics: {
    kind: 'channel',
    topic: `ELA • ${EDUCATOR_ELENA.profile.displayName} • Fri 4 PM`,
    iconKey: 'languages',
    description: 'Reading circles and writing workshops.',
    visibility: 'private',
    purpose: 'learning-space',
  },
  lifecycle: {
    status: 'active',
    createdBy: PROFILE_IDS.educator1,
    createdAt: '2025-09-15T00:00:00.000Z',
    archivedAt: null,
  },
  postingPolicy: {
    kind: 'members-only',
    allowThreads: true,
    allowReactions: true,
  },
  context: {
    primaryEntity: { kind: 'learning_space', id: LEARNING_SPACE_IDS.ela },
    capabilities: ['has_schedule', 'has_homework', 'has_summaries'],
  },
  collections: {
    participants: [GUARDIAN_MORGAN, CHILD_MAYA, EDUCATOR_ELENA],
    messages: ELA_MESSAGES_CONNECTION,
    media: ELA_MEDIA,
    files: ELA_FILES,
    readState: {
      channelId: CHANNEL_IDS.ela,
      lastReadMessageId: ELA_MESSAGES_CONNECTION.items[0]?.ids.id,
      lastReadAt: '2026-02-07T18:35:00.000Z',
      unreadCount: 3,
    },
  },
  ui: {
    defaultRightPanelOpen: true,
    defaultRightPanelKey: 'channel_info',
    headerItems: makeHeaderItems('Fri Mar 6 • 4:00 PM'),
    headerActions: [
      { key: 'info', label: 'Info', iconKey: 'info' },
      { key: 'saved', label: 'Saved', iconKey: 'saved', intentKey: 'saved' },
    ],
  },
};

export const CHESS_CHANNEL: ChannelVM = {
  ids: {
    id: CHANNEL_IDS.chess,
    orgId: ORG_ID,
  },
  basics: {
    kind: 'channel',
    topic: `Chess • ${EDUCATOR_LEO.profile.displayName} • Sat 3 PM`,
    iconKey: 'chef-hat',
    description: 'Tactics, openings, and game review.',
    visibility: 'private',
    purpose: 'learning-space',
  },
  lifecycle: {
    status: 'active',
    createdBy: PROFILE_IDS.educator4,
    createdAt: '2025-09-18T00:00:00.000Z',
    archivedAt: null,
  },
  postingPolicy: {
    kind: 'members-only',
    allowThreads: true,
    allowReactions: true,
  },
  context: {
    primaryEntity: { kind: 'learning_space', id: LEARNING_SPACE_IDS.chess },
    capabilities: ['has_schedule', 'has_homework', 'has_summaries'],
  },
  collections: {
    participants: [GUARDIAN_MORGAN, CHILD_AVA, EDUCATOR_LEO],
    messages: CHESS_MESSAGES_CONNECTION,
    media: CHESS_MEDIA,
    files: CHESS_FILES,
    readState: {
      channelId: CHANNEL_IDS.chess,
      lastReadMessageId: CHESS_MESSAGES_CONNECTION.items[0]?.ids.id,
      lastReadAt: '2026-02-12T17:05:00.000Z',
      unreadCount: 1,
    },
  },
  ui: {
    defaultRightPanelOpen: true,
    defaultRightPanelKey: 'channel_info',
    headerItems: makeHeaderItems('Sat Mar 7 • 3:00 PM'),
    headerActions: [
      { key: 'info', label: 'Info', iconKey: 'info' },
      { key: 'saved', label: 'Saved', iconKey: 'saved', intentKey: 'saved' },
    ],
  },
};

export const LEARNING_SPACE_CHANNELS: ChannelVM[] = [
  MATH_CHANNEL,
  SCIENCE_CHANNEL,
  ELA_CHANNEL,
  CHESS_CHANNEL,
];

export const LEARNING_SPACE_CHANNELS_BY_ID: Record<string, ChannelVM> = {
  [CHANNEL_IDS.math]: MATH_CHANNEL,
  [CHANNEL_IDS.science]: SCIENCE_CHANNEL,
  [CHANNEL_IDS.ela]: ELA_CHANNEL,
  [CHANNEL_IDS.chess]: CHESS_CHANNEL,
};
