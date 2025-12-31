import type { ActivityFeedVM } from '@iconicedu/shared-types';
import {
  MOCK_CHILDREN,
  MOCK_EDUCATOR_1,
  MOCK_EDUCATOR_2,
  MOCK_EDUCATOR_3,
  MOCK_EDUCATOR_4,
  MOCK_GUARDIAN,
} from './people';
import { LEARNING_SPACE_IDS, LEARNING_SPACE_CHANNEL_IDS } from './learning-space-ids';

const ACTOR_EDUCATOR_1 = {
  id: MOCK_EDUCATOR_1.ids.id,
  displayName: MOCK_EDUCATOR_1.profile.displayName,
  avatar: MOCK_EDUCATOR_1.profile.avatar,
} as const;
const ACTOR_EDUCATOR_2 = {
  id: MOCK_EDUCATOR_2.ids.id,
  displayName: MOCK_EDUCATOR_2.profile.displayName,
  avatar: MOCK_EDUCATOR_2.profile.avatar,
} as const;
const ACTOR_EDUCATOR_3 = {
  id: MOCK_EDUCATOR_3.ids.id,
  displayName: MOCK_EDUCATOR_3.profile.displayName,
  avatar: MOCK_EDUCATOR_3.profile.avatar,
} as const;
const ACTOR_EDUCATOR_4 = {
  id: MOCK_EDUCATOR_4.ids.id,
  displayName: MOCK_EDUCATOR_4.profile.displayName,
  avatar: MOCK_EDUCATOR_4.profile.avatar,
} as const;
const ACTOR_CHILD_1 = {
  id: MOCK_CHILDREN[0].ids.id,
  displayName: MOCK_CHILDREN[0].profile.displayName,
  avatar: MOCK_CHILDREN[0].profile.avatar,
} as const;

const SYSTEM_PROFILE = {
  kind: 'system',
  id: 'c7c88924-6c2d-48d6-9f2f-2ac684e59f01',
  displayName: 'System',
  avatar: {
    source: 'seed',
    seed: 'system',
    url: null,
    updatedAt: null,
  },
} as const;

export const INBOX_ACTIVITY_FEED: ActivityFeedVM = {
  activeTab: 'all',
  tabs: [
    { key: 'all', label: 'All', badgeCount: 6 },
    { key: 'classes', label: 'Classes', badgeCount: 3 },
    { key: 'payment', label: 'Payments', badgeCount: 1 },
    { key: 'system', label: 'System' },
  ],
  sections: [
    {
      label: 'Today',
      items: [
        {
          id: 'feed-11111111-1111-4111-8111-111111111111',
          kind: 'leaf',
          occurredAt: '2025-01-10T18:55:00.000Z',
          createdAt: '2025-01-10T18:56:00.000Z',
          tabKey: 'classes',
          scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.math },
          visibility: 'scope_only',
          verb: 'summary.posted',
          actor: ACTOR_EDUCATOR_2,
          object: { kind: 'summary', id: 'summary-math-2025-01-10' },
          target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.math },
          leading: { kind: 'icon', iconKey: 'Sparkles', tone: 'info' },
          headline: {
            primary: 'Session summary posted',
            secondary: 'Math Foundations',
            emphasis: 'Mon 4 PM',
          },
          summary: 'Reviewed number lines, fractions, and estimation.',
          preview: { text: 'Next steps: practice fraction comparisons.' },
          importance: 'normal',
        },
        {
          id: 'feed-22222222-2222-4222-8222-222222222222',
          kind: 'leaf',
          occurredAt: '2025-01-10T16:45:00.000Z',
          createdAt: '2025-01-10T16:46:00.000Z',
          tabKey: 'classes',
          scope: { kind: 'channel', channelId: LEARNING_SPACE_CHANNEL_IDS.science },
          visibility: 'scope_only',
          verb: 'file.uploaded',
          actor: ACTOR_EDUCATOR_3,
          object: { kind: 'file', id: 'science-density-worksheet' },
          target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.science },
          leading: { kind: 'icon', iconKey: 'FileText', tone: 'neutral' },
          headline: {
            primary: 'Worksheet uploaded',
            secondary: 'Science Lab',
            emphasis: 'Density',
          },
          summary: 'Lab worksheet for tomorrow’s session.',
          preview: { text: 'Download before class.' },
          importance: 'normal',
        },
        {
          id: 'feed-33333333-3333-4333-8333-333333333333',
          kind: 'leaf',
          occurredAt: '2025-01-10T15:00:00.000Z',
          createdAt: '2025-01-10T15:01:00.000Z',
          tabKey: 'payment',
          scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.ela },
          visibility: 'direct',
          audience: [{ kind: 'users_only', userIds: [MOCK_GUARDIAN.ids.id] }],
          verb: 'message.posted',
          actor: ACTOR_EDUCATOR_1,
          object: { kind: 'file', id: 'INV-ELA-2025-01' },
          target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.ela },
          leading: { kind: 'icon', iconKey: 'CreditCard', tone: 'warning' },
          headline: {
            primary: 'Invoice due',
            secondary: 'ELA weekly sessions',
            emphasis: '$180',
          },
          summary: 'Invoice due Jan 20.',
          preview: { text: 'Payment reminder sent.' },
          importance: 'important',
        },
      ],
    },
    {
      label: 'Earlier',
      items: [
        {
          id: 'feed-44444444-4444-4444-8444-444444444444',
          kind: 'group',
          occurredAt: '2025-01-09T18:00:00.000Z',
          createdAt: '2025-01-09T18:05:00.000Z',
          tabKey: 'classes',
          scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.chess },
          visibility: 'scope_only',
          verb: 'homework.assigned',
          actor: ACTOR_EDUCATOR_4,
          object: { kind: 'homework', id: 'chess-puzzles-pack' },
          target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.chess },
          groupKey: 'chess-homework-2025-01-09',
          groupType: 'homework',
          isCollapsed: true,
          subActivityCount: 2,
          leading: {
            kind: 'avatars',
            avatars: [MOCK_EDUCATOR_4.profile.avatar, MOCK_CHILDREN[0].profile.avatar],
            overflowCount: 0,
          },
          headline: {
            primary: 'Chess homework updates',
            secondary: '2 updates',
          },
          summary: 'New puzzle pack assigned and acknowledged.',
          subActivities: {
            items: [
              {
                id: 'feed-44444444-4444-4444-8444-444444444445',
                kind: 'leaf',
                occurredAt: '2025-01-09T17:40:00.000Z',
                createdAt: '2025-01-09T17:41:00.000Z',
                tabKey: 'classes',
                scope: {
                  kind: 'learning_space',
                  learningSpaceId: LEARNING_SPACE_IDS.chess,
                },
                visibility: 'scope_only',
                verb: 'homework.assigned',
                actor: ACTOR_EDUCATOR_4,
                headline: {
                  primary: 'Puzzle pack assigned',
                  secondary: 'Chess Tactics',
                },
              },
              {
                id: 'feed-44444444-4444-4444-8444-444444444446',
                kind: 'leaf',
                occurredAt: '2025-01-09T17:55:00.000Z',
                createdAt: '2025-01-09T17:56:00.000Z',
                tabKey: 'classes',
                scope: {
                  kind: 'learning_space',
                  learningSpaceId: LEARNING_SPACE_IDS.chess,
                },
                visibility: 'scope_only',
                verb: 'homework.submitted',
                actor: ACTOR_CHILD_1,
                headline: {
                  primary: 'Puzzle pack submitted',
                  secondary: 'Awaiting review',
                },
              },
            ],
            total: 2,
          },
        },
        {
          id: 'feed-55555555-5555-4555-8555-555555555555',
          kind: 'leaf',
          occurredAt: '2025-01-08T12:30:00.000Z',
          createdAt: '2025-01-08T12:30:00.000Z',
          tabKey: 'system',
          scope: { kind: 'global' },
          visibility: 'public',
          verb: 'member.joined',
          actor: SYSTEM_PROFILE,
          leading: { kind: 'icon', iconKey: 'Bell', tone: 'info' },
          headline: {
            primary: 'Welcome to IconicEdu',
            secondary: 'We’re excited to have you here',
          },
          summary: 'Explore your learning spaces and messages.',
          importance: 'normal',
        },
      ],
    },
  ],
  nextCursor: null,
  unreadCount: 4,
};
