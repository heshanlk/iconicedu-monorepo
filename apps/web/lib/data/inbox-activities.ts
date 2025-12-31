import type {
  ActivityFeedItemVM,
  ActivityFeedVM,
  ActivityActorProfileVM,
} from '@iconicedu/shared-types';
import { ACTIVITY_IDS, CHANNEL_IDS, LEARNING_SPACE_IDS, SYSTEM_PROFILE_ID } from './ids';
import {
  EDUCATOR_ELENA,
  EDUCATOR_KAI,
  EDUCATOR_PRIYA,
  GUARDIAN_MORGAN,
} from './profiles';

const ACTOR_GUARDIAN: ActivityActorProfileVM = {
  id: GUARDIAN_MORGAN.ids.id,
  displayName: GUARDIAN_MORGAN.profile.displayName,
  avatar: GUARDIAN_MORGAN.profile.avatar,
};

const ACTOR_ELENA: ActivityActorProfileVM = {
  id: EDUCATOR_ELENA.ids.id,
  displayName: EDUCATOR_ELENA.profile.displayName,
  avatar: EDUCATOR_ELENA.profile.avatar,
};

const ACTOR_KAI: ActivityActorProfileVM = {
  id: EDUCATOR_KAI.ids.id,
  displayName: EDUCATOR_KAI.profile.displayName,
  avatar: EDUCATOR_KAI.profile.avatar,
};

const ACTOR_PRIYA: ActivityActorProfileVM = {
  id: EDUCATOR_PRIYA.ids.id,
  displayName: EDUCATOR_PRIYA.profile.displayName,
  avatar: EDUCATOR_PRIYA.profile.avatar,
};

const ACTOR_SYSTEM = {
  kind: 'system' as const,
  id: SYSTEM_PROFILE_ID,
  displayName: 'IconicEdu',
  avatar: {
    source: 'seed',
    seed: 'system',
    url: null,
    updatedAt: null,
  },
};

const activityItemsToday: ActivityFeedItemVM[] = [
  {
    id: ACTIVITY_IDS.activity1,
    kind: 'leaf',
    timestamps: {
      occurredAt: '2026-02-09T22:45:00.000Z',
      createdAt: '2026-02-09T22:45:00.000Z',
    },
    tabKey: 'classes',
    audience: {
      scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.math },
      visibility: 'public',
    },
    verb: 'summary.posted',
    refs: {
      actor: ACTOR_KAI,
      object: { kind: 'summary', id: ACTIVITY_IDS.activity1 },
      target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.math },
    },
    content: {
      leading: { kind: 'icon', iconKey: 'Sparkles', tone: 'info' },
      headline: {
        primary: 'Session summary posted',
        secondary: 'Math Mastery',
      },
      summary: 'Fractions and word problems review.',
    },
    state: { importance: 'normal', isRead: false },
  },
  {
    id: ACTIVITY_IDS.activity2,
    kind: 'leaf',
    timestamps: {
      occurredAt: '2026-02-09T22:15:00.000Z',
      createdAt: '2026-02-09T22:15:00.000Z',
    },
    tabKey: 'classes',
    audience: {
      scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.math },
      visibility: 'public',
    },
    verb: 'homework.submitted',
    refs: {
      actor: ACTOR_GUARDIAN,
      object: { kind: 'homework', id: ACTIVITY_IDS.activity2 },
      target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.math },
    },
    content: {
      leading: { kind: 'icon', iconKey: 'ClipboardCheck', tone: 'success' },
      headline: {
        primary: 'Homework submitted',
        secondary: 'Ava • Math Mastery',
      },
      summary: 'Fraction fluency pack submitted.',
    },
    state: { importance: 'normal', isRead: false },
  },
  {
    id: ACTIVITY_IDS.activity3,
    kind: 'leaf',
    timestamps: {
      occurredAt: '2026-02-09T20:05:00.000Z',
      createdAt: '2026-02-09T20:05:00.000Z',
    },
    tabKey: 'system',
    audience: {
      scope: { kind: 'global' },
      visibility: 'public',
    },
    verb: 'message.posted',
    refs: {
      actor: ACTOR_SYSTEM,
      object: { kind: 'message', id: ACTIVITY_IDS.activity3 },
    },
    content: {
      leading: { kind: 'icon', iconKey: 'Bell', tone: 'info' },
      headline: {
        primary: 'New feature: Homework filters',
        secondary: 'Try filtering homework in each class.',
      },
    },
    state: { importance: 'normal', isRead: true },
  },
];

const homeworkGroupItem: ActivityFeedItemVM = {
  id: ACTIVITY_IDS.activity4,
  kind: 'group',
  timestamps: {
    occurredAt: '2026-02-08T22:30:00.000Z',
    createdAt: '2026-02-08T22:30:00.000Z',
  },
  tabKey: 'classes',
  audience: {
    scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.science },
    visibility: 'public',
  },
  verb: 'homework.assigned',
  refs: {
    actor: ACTOR_PRIYA,
    object: { kind: 'homework', id: ACTIVITY_IDS.activity4 },
  },
  grouping: {
    groupType: 'homework',
    groupKey: 'science-lab-week-3',
  },
  content: {
    leading: { kind: 'icon', iconKey: 'ClipboardCheck', tone: 'info' },
    headline: {
      primary: 'Homework assigned',
      secondary: 'Science Lab • Week 3',
    },
    summary: 'Complete lab reflection and upload results.',
  },
  state: { importance: 'normal', isRead: true },
  isCollapsed: false,
  subActivityCount: 3,
  subActivities: {
    items: [
      {
        id: ACTIVITY_IDS.sub1,
        kind: 'leaf',
        timestamps: {
          occurredAt: '2026-02-08T21:15:00.000Z',
          createdAt: '2026-02-08T21:15:00.000Z',
        },
        tabKey: 'classes',
        audience: {
          scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.science },
          visibility: 'public',
        },
        verb: 'file.uploaded',
        refs: {
          actor: ACTOR_PRIYA,
          object: { kind: 'file', id: ACTIVITY_IDS.sub1 },
          target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.science },
        },
        content: {
          headline: {
            primary: 'Lab guide uploaded',
          },
          summary: 'Water cycle lab guide is ready.',
        },
      },
      {
        id: ACTIVITY_IDS.sub2,
        kind: 'leaf',
        timestamps: {
          occurredAt: '2026-02-08T21:30:00.000Z',
          createdAt: '2026-02-08T21:30:00.000Z',
        },
        tabKey: 'classes',
        audience: {
          scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.science },
          visibility: 'public',
        },
        verb: 'notes.posted',
        refs: {
          actor: ACTOR_PRIYA,
          object: { kind: 'message', id: ACTIVITY_IDS.sub2 },
          target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.science },
        },
        content: {
          headline: {
            primary: 'Reflection prompts posted',
          },
          summary: 'Remember to mention two observations.',
        },
      },
      {
        id: ACTIVITY_IDS.sub3,
        kind: 'leaf',
        timestamps: {
          occurredAt: '2026-02-08T21:45:00.000Z',
          createdAt: '2026-02-08T21:45:00.000Z',
        },
        tabKey: 'classes',
        audience: {
          scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.science },
          visibility: 'public',
        },
        verb: 'message.posted',
        refs: {
          actor: ACTOR_PRIYA,
          object: { kind: 'message', id: ACTIVITY_IDS.sub3 },
          target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.science },
        },
        content: {
          headline: {
            primary: 'Quick check-in posted',
          },
          summary: 'Let me know if supplies are missing.',
        },
      },
    ],
    total: 3,
  },
};

const activityItemsEarlier: ActivityFeedItemVM[] = [
  homeworkGroupItem,
  {
    id: ACTIVITY_IDS.activity5,
    kind: 'leaf',
    timestamps: {
      occurredAt: '2026-02-07T19:40:00.000Z',
      createdAt: '2026-02-07T19:40:00.000Z',
    },
    tabKey: 'classes',
    audience: {
      scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.ela },
      visibility: 'public',
    },
    verb: 'session.scheduled',
    refs: {
      actor: ACTOR_ELENA,
      object: { kind: 'session', id: ACTIVITY_IDS.activity5 },
      target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.ela },
    },
    content: {
      leading: { kind: 'icon', iconKey: 'Video', tone: 'info' },
      headline: {
        primary: 'Session scheduled',
        secondary: 'ELA Studio',
      },
      summary: 'Friday at 4:00 PM',
    },
    state: { importance: 'normal', isRead: true },
  },
  {
    id: ACTIVITY_IDS.activity6,
    kind: 'leaf',
    timestamps: {
      occurredAt: '2026-02-07T19:20:00.000Z',
      createdAt: '2026-02-07T19:20:00.000Z',
    },
    tabKey: 'payment',
    audience: {
      scope: { kind: 'user', userId: GUARDIAN_MORGAN.ids.id },
      visibility: 'direct',
    },
    verb: 'message.posted',
    refs: {
      actor: ACTOR_SYSTEM,
      object: { kind: 'summary', id: ACTIVITY_IDS.activity6 },
    },
    content: {
      leading: { kind: 'icon', iconKey: 'CreditCard', tone: 'warning' },
      headline: {
        primary: 'Invoice due soon',
        secondary: 'Chess coaching (February)',
      },
      summary: 'Due by Feb 20',
      actionButton: {
        label: 'Pay now',
        variant: 'default',
        href: '/dashboard/payments',
      },
    },
    state: { importance: 'important', isRead: true },
  },
  {
    id: ACTIVITY_IDS.activity7,
    kind: 'leaf',
    timestamps: {
      occurredAt: '2026-02-06T18:05:00.000Z',
      createdAt: '2026-02-06T18:05:00.000Z',
    },
    tabKey: 'all',
    audience: {
      scope: { kind: 'dm', threadId: CHANNEL_IDS.dmEducator1 },
      visibility: 'direct',
    },
    verb: 'message.posted',
    refs: {
      actor: ACTOR_ELENA,
      object: { kind: 'message', id: ACTIVITY_IDS.activity7 },
    },
    content: {
      leading: {
        kind: 'avatars',
        avatars: [EDUCATOR_ELENA.profile.avatar, GUARDIAN_MORGAN.profile.avatar],
      },
      headline: {
        primary: 'New DM from Elena',
        secondary: 'Writing samples shared',
      },
      preview: {
        text: 'Sharing some writing samples.',
        attachmentsCount: 1,
      },
    },
    state: { importance: 'normal', isRead: true },
  },
  {
    id: ACTIVITY_IDS.activity8,
    kind: 'leaf',
    timestamps: {
      occurredAt: '2026-02-06T17:45:00.000Z',
      createdAt: '2026-02-06T17:45:00.000Z',
    },
    tabKey: 'system',
    audience: {
      scope: { kind: 'global' },
      visibility: 'public',
    },
    verb: 'member.joined',
    refs: {
      actor: ACTOR_SYSTEM,
      object: { kind: 'user', id: GUARDIAN_MORGAN.ids.id },
    },
    content: {
      leading: { kind: 'icon', iconKey: 'MessageSquare', tone: 'success' },
      headline: {
        primary: 'Welcome to IconicEdu',
        secondary: 'Your learning spaces are ready.',
      },
    },
    state: { importance: 'normal', isRead: true },
  },
];

export const INBOX_ACTIVITY_FEED: ActivityFeedVM = {
  activeTab: 'all',
  tabs: [
    { key: 'all', label: 'All', badgeCount: 3 },
    { key: 'classes', label: 'Classes', badgeCount: 2 },
    { key: 'payment', label: 'Payments', badgeCount: 1 },
    { key: 'system', label: 'System' },
  ],
  sections: [
    {
      label: 'Today',
      items: activityItemsToday,
    },
    {
      label: 'Earlier',
      items: activityItemsEarlier,
    },
  ],
  nextCursor: null,
  unreadCount: 3,
};
