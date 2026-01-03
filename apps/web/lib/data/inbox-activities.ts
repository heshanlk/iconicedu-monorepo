import type {
  ActivityFeedVM,
  ActivityFeedItemVM,
  ActivityActorProfileVM,
  SystemProfileVM,
} from '@iconicedu/shared-types';
import {
  ACTIVITY_IDS,
  CHANNEL_IDS,
  FILE_IDS,
  LEARNING_SPACE_IDS,
  ORG_ID,
} from './ids';
import {
  EDUCATOR_ELENA_PROFILE,
  EDUCATOR_LUCAS_PROFILE,
  EDUCATOR_PRIYA_PROFILE,
  GUARDIAN_RILEY_PROFILE,
} from './profiles';

const SYSTEM_ACTOR: SystemProfileVM = {
  kind: 'system',
  ids: { id: '9b3b6e4d-8b1c-4a6a-9f22-3a2fbc0d45a1', orgId: ORG_ID },
  displayName: 'ICONIC',
  avatar: {
    source: 'seed',
    seed: 'iconic-system',
    url: null,
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  themeKey: 'blue',
};

const ACTOR_PRIYA: ActivityActorProfileVM = {
  ids: { id: EDUCATOR_PRIYA_PROFILE.ids.id, orgId: ORG_ID },
  displayName: EDUCATOR_PRIYA_PROFILE.profile.displayName,
  avatar: EDUCATOR_PRIYA_PROFILE.profile.avatar,
  themeKey: EDUCATOR_PRIYA_PROFILE.ui?.themeKey ?? null,
};

const ACTOR_ELENA: ActivityActorProfileVM = {
  ids: { id: EDUCATOR_ELENA_PROFILE.ids.id, orgId: ORG_ID },
  displayName: EDUCATOR_ELENA_PROFILE.profile.displayName,
  avatar: EDUCATOR_ELENA_PROFILE.profile.avatar,
  themeKey: EDUCATOR_ELENA_PROFILE.ui?.themeKey ?? null,
};

const ACTOR_LUCAS: ActivityActorProfileVM = {
  ids: { id: EDUCATOR_LUCAS_PROFILE.ids.id, orgId: ORG_ID },
  displayName: EDUCATOR_LUCAS_PROFILE.profile.displayName,
  avatar: EDUCATOR_LUCAS_PROFILE.profile.avatar,
  themeKey: EDUCATOR_LUCAS_PROFILE.ui?.themeKey ?? null,
};

const ACTOR_RILEY: ActivityActorProfileVM = {
  ids: { id: GUARDIAN_RILEY_PROFILE.ids.id, orgId: ORG_ID },
  displayName: GUARDIAN_RILEY_PROFILE.profile.displayName,
  avatar: GUARDIAN_RILEY_PROFILE.profile.avatar,
  themeKey: GUARDIAN_RILEY_PROFILE.ui?.themeKey ?? null,
};

const MATH_HOMEWORK_ACTIVITY: ActivityFeedItemVM = {
  kind: 'leaf',
  ids: { id: ACTIVITY_IDS.mathHomework, orgId: ORG_ID },
  timestamps: {
    occurredAt: '2026-02-19T17:30:00.000Z',
    createdAt: '2026-02-19T17:35:00.000Z',
  },
  tabKey: 'classes',
  audience: {
    scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.math },
    visibility: 'scope_only',
  },
  verb: 'homework.assigned',
  refs: {
    actor: ACTOR_PRIYA,
    target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.math },
  },
  content: {
    leading: { kind: 'icon', iconKey: 'ClipboardCheck', tone: 'info' },
    headline: {
      primary: 'New math homework assigned',
      secondary: 'Fractions Practice Set',
    },
    summary: 'Due Sunday, Feb 22',
    actionButton: {
      label: 'View homework',
      variant: 'default',
      href: `/d/spaces/${CHANNEL_IDS.mathSpace}`,
    },
  },
  state: { importance: 'normal', isRead: false },
};

const MATH_HOMEWORK_SUBMIT_ACTIVITY: ActivityFeedItemVM = {
  kind: 'leaf',
  ids: { id: ACTIVITY_IDS.mathHomeworkSubmit, orgId: ORG_ID },
  timestamps: {
    occurredAt: '2026-02-20T19:40:00.000Z',
    createdAt: '2026-02-20T19:42:00.000Z',
  },
  tabKey: 'classes',
  audience: {
    scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.math },
    visibility: 'scope_only',
  },
  verb: 'homework.submitted',
  refs: {
    actor: ACTOR_RILEY,
    target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.math },
  },
  content: {
    leading: { kind: 'icon', iconKey: 'ClipboardCheck', tone: 'success' },
    headline: {
      primary: 'Homework submitted',
      secondary: 'Fractions Practice Set',
    },
    summary: 'Submitted by Tevin',
  },
  state: { importance: 'normal', isRead: false },
};

const SCIENCE_FILE_ACTIVITY: ActivityFeedItemVM = {
  kind: 'leaf',
  ids: { id: ACTIVITY_IDS.scienceFile, orgId: ORG_ID },
  timestamps: {
    occurredAt: '2026-02-19T18:45:00.000Z',
    createdAt: '2026-02-19T18:46:00.000Z',
  },
  tabKey: 'classes',
  audience: {
    scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.science },
    visibility: 'scope_only',
  },
  verb: 'file.uploaded',
  refs: {
    actor: ACTOR_LUCAS,
    target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.science },
    object: { kind: 'file', id: FILE_IDS.scienceLabPdf },
  },
  content: {
    leading: { kind: 'icon', iconKey: 'FileText', tone: 'info' },
    headline: {
      primary: 'New lab guide uploaded',
      secondary: 'Science Lab Explorers',
    },
    summary: 'science-lab-guide.pdf',
  },
  state: { importance: 'normal', isRead: true },
};

const ELA_SUMMARY_ACTIVITY: ActivityFeedItemVM = {
  kind: 'leaf',
  ids: { id: ACTIVITY_IDS.elaSummary, orgId: ORG_ID },
  timestamps: {
    occurredAt: '2026-02-18T19:20:00.000Z',
    createdAt: '2026-02-18T19:21:00.000Z',
  },
  tabKey: 'classes',
  audience: {
    scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.ela },
    visibility: 'scope_only',
  },
  verb: 'summary.posted',
  refs: {
    actor: ACTOR_ELENA,
    target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.ela },
  },
  content: {
    leading: { kind: 'icon', iconKey: 'FileText', tone: 'neutral' },
    headline: {
      primary: 'Session summary posted',
      secondary: 'Writing Workshop',
    },
    summary: 'Story Seeds discussion highlights',
  },
  state: { importance: 'normal', isRead: true },
};

const SYSTEM_PAYMENT_ACTIVITY: ActivityFeedItemVM = {
  kind: 'leaf',
  ids: { id: ACTIVITY_IDS.systemPayment, orgId: ORG_ID },
  timestamps: {
    occurredAt: '2026-02-17T14:00:00.000Z',
    createdAt: '2026-02-17T14:01:00.000Z',
  },
  tabKey: 'payment',
  audience: {
    scope: { kind: 'global' },
    visibility: 'direct',
  },
  verb: 'role.changed',
  refs: {
    actor: SYSTEM_ACTOR,
  },
  content: {
    leading: { kind: 'icon', iconKey: 'CreditCard', tone: 'warning' },
    headline: {
      primary: 'Payment method expiring soon',
      secondary: 'Update your billing details',
    },
    summary: 'Card ending in 1234 expires in 14 days.',
    actionButton: {
      label: 'Update billing',
      variant: 'default',
      href: '/d',
    },
  },
  state: { importance: 'important', isRead: false },
};

const GROUPED_HOMEWORK_ACTIVITY: ActivityFeedItemVM = {
  kind: 'group',
  ids: { id: ACTIVITY_IDS.groupHomework, orgId: ORG_ID },
  timestamps: {
    occurredAt: '2026-02-20T21:00:00.000Z',
    createdAt: '2026-02-20T21:01:00.000Z',
  },
  tabKey: 'classes',
  audience: {
    scope: { kind: 'global' },
    visibility: 'public',
  },
  verb: 'homework.assigned',
  refs: {
    actor: ACTOR_PRIYA,
  },
  grouping: {
    groupType: 'homework',
    groupKey: 'homework-week-08',
  },
  content: {
    leading: {
      kind: 'avatars',
      avatars: [
        EDUCATOR_PRIYA_PROFILE.profile.avatar,
        EDUCATOR_ELENA_PROFILE.profile.avatar,
      ],
      overflowCount: 0,
    },
    headline: {
      primary: '2 new homework updates',
      secondary: 'Math + Writing',
    },
    summary: 'Review assignments for the week',
  },
  state: { importance: 'normal', isRead: false },
  isCollapsed: true,
  subActivityCount: 2,
  subActivities: {
    items: [
      {
        kind: 'leaf',
        ids: { id: ACTIVITY_IDS.groupHomework1, orgId: ORG_ID },
        timestamps: {
          occurredAt: '2026-02-20T20:50:00.000Z',
          createdAt: '2026-02-20T20:55:00.000Z',
        },
        tabKey: 'classes',
        audience: {
          scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.math },
          visibility: 'scope_only',
        },
        verb: 'homework.assigned',
        refs: {
          actor: ACTOR_PRIYA,
          target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.math },
        },
        content: {
          leading: { kind: 'icon', iconKey: 'ClipboardCheck', tone: 'info' },
          headline: {
            primary: 'Math homework assigned',
            secondary: 'Fractions Practice Set',
          },
          summary: 'Due Sunday',
        },
        state: { importance: 'normal', isRead: false },
      },
      {
        kind: 'leaf',
        ids: { id: ACTIVITY_IDS.groupHomework2, orgId: ORG_ID },
        timestamps: {
          occurredAt: '2026-02-20T20:52:00.000Z',
          createdAt: '2026-02-20T20:56:00.000Z',
        },
        tabKey: 'classes',
        audience: {
          scope: { kind: 'learning_space', learningSpaceId: LEARNING_SPACE_IDS.ela },
          visibility: 'scope_only',
        },
        verb: 'homework.assigned',
        refs: {
          actor: ACTOR_ELENA,
          target: { kind: 'learning_space', id: LEARNING_SPACE_IDS.ela },
        },
        content: {
          leading: { kind: 'icon', iconKey: 'ClipboardCheck', tone: 'info' },
          headline: {
            primary: 'ELA homework assigned',
            secondary: 'Story Prompt Draft',
          },
          summary: 'Due Monday',
        },
        state: { importance: 'normal', isRead: false },
      },
    ],
    total: 2,
  },
};

export const INBOX_ACTIVITY_FEED: ActivityFeedVM = {
  activeTab: 'all',
  tabs: [
    { key: 'all', label: 'All', badgeCount: 6 },
    { key: 'classes', label: 'Classes', badgeCount: 4 },
    { key: 'payment', label: 'Payment', badgeCount: 1 },
    { key: 'system', label: 'System', badgeCount: 1 },
  ],
  sections: [
    {
      label: 'Today',
      items: [
        MATH_HOMEWORK_ACTIVITY,
        MATH_HOMEWORK_SUBMIT_ACTIVITY,
        SCIENCE_FILE_ACTIVITY,
        ELA_SUMMARY_ACTIVITY,
      ],
    },
    {
      label: 'This week',
      items: [GROUPED_HOMEWORK_ACTIVITY, SYSTEM_PAYMENT_ACTIVITY],
    },
  ],
  nextCursor: null,
  unreadCount: 3,
};
