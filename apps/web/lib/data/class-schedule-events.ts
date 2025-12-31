import type { ClassScheduleVM } from '@iconicedu/shared-types';
import {
  MOCK_GUARDIAN,
  MOCK_CHILDREN,
  MOCK_EDUCATOR_1,
  MOCK_EDUCATOR_2,
  MOCK_EDUCATOR_3,
  MOCK_EDUCATOR_4,
  MOCK_ORG_ID,
} from './people';
import { LEARNING_SPACE_IDS } from './learning-space-ids';

export const MATH_SCHEDULE: ClassScheduleVM = {
  id: 'c1111111-1111-4111-8111-111111111111',
  orgId: MOCK_ORG_ID,
  title: 'Math Foundations',
  startAt: '2026-01-12T21:00:00.000Z',
  endAt: '2026-01-12T22:00:00.000Z',
  timezone: 'America/New_York',
  status: 'scheduled',
  description: 'Core number sense and reasoning.',
  location: 'Zoom',
  visibility: 'class-members',
  color: 'blue',
  participants: [
    {
      userId: MOCK_EDUCATOR_2.ids.id,
      role: 'educator',
      status: 'accepted',
      displayName: MOCK_EDUCATOR_2.profile.displayName,
      avatarUrl: MOCK_EDUCATOR_2.profile.avatar.url ?? null,
    },
    {
      userId: MOCK_CHILDREN[0].ids.id,
      role: 'child',
      status: 'accepted',
      displayName: MOCK_CHILDREN[0].profile.displayName,
      avatarUrl: MOCK_CHILDREN[0].profile.avatar.url ?? null,
    },
    {
      userId: MOCK_GUARDIAN.ids.id,
      role: 'guardian',
      status: 'accepted',
      displayName: MOCK_GUARDIAN.profile.displayName,
      avatarUrl: MOCK_GUARDIAN.profile.avatar.url ?? null,
    },
  ],
  source: {
    kind: 'class_session',
    learningSpaceId: LEARNING_SPACE_IDS.math,
    sessionId: '9a0d0b58-9d9b-4212-8f45-8a2e8c0b7001',
  },
  recurrence: {
    seriesId: 'a1b2c3d4-1111-4111-8111-111111111111',
    rule: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['MO'],
      timezone: 'America/New_York',
    },
    exceptions: [{ occurrenceKey: '2026-02-16T21:00:00.000Z', reason: 'Winter break' }],
    overrides: [
      {
        occurrenceKey: '2026-02-02T21:00:00.000Z',
        patch: {
          startAt: '2026-02-02T22:00:00.000Z',
          endAt: '2026-02-02T23:00:00.000Z',
          status: 'rescheduled',
          location: 'Zoom (rescheduled)',
        },
      },
    ],
  },
  audit: {
    createdAt: '2025-01-02T15:00:00.000Z',
    createdBy: MOCK_EDUCATOR_2.ids.id,
  },
};

export const SCIENCE_SCHEDULE: ClassScheduleVM = {
  id: 'c2222222-2222-4222-8222-222222222222',
  orgId: MOCK_ORG_ID,
  title: 'Science Lab',
  startAt: '2026-01-14T22:00:00.000Z',
  endAt: '2026-01-14T23:00:00.000Z',
  timezone: 'America/New_York',
  status: 'scheduled',
  description: 'Hands-on experiments and lab notes.',
  location: 'Zoom',
  visibility: 'class-members',
  color: 'green',
  participants: [
    {
      userId: MOCK_EDUCATOR_3.ids.id,
      role: 'educator',
      status: 'accepted',
      displayName: MOCK_EDUCATOR_3.profile.displayName,
      avatarUrl: MOCK_EDUCATOR_3.profile.avatar.url ?? null,
    },
    {
      userId: MOCK_CHILDREN[1].ids.id,
      role: 'child',
      status: 'accepted',
      displayName: MOCK_CHILDREN[1].profile.displayName,
      avatarUrl: MOCK_CHILDREN[1].profile.avatar.url ?? null,
    },
    {
      userId: MOCK_GUARDIAN.ids.id,
      role: 'guardian',
      status: 'accepted',
      displayName: MOCK_GUARDIAN.profile.displayName,
      avatarUrl: MOCK_GUARDIAN.profile.avatar.url ?? null,
    },
  ],
  source: {
    kind: 'class_session',
    learningSpaceId: LEARNING_SPACE_IDS.science,
    sessionId: '9a0d0b58-9d9b-4212-8f45-8a2e8c0b7002',
  },
  recurrence: {
    seriesId: 'a1b2c3d4-2222-4222-8222-222222222222',
    rule: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['WE'],
      timezone: 'America/New_York',
    },
    overrides: [
      {
        occurrenceKey: '2026-02-11T22:00:00.000Z',
        patch: {
          status: 'cancelled',
          description: 'Cancelled due to teacher conference.',
        },
      },
      {
        occurrenceKey: '2026-02-25T22:00:00.000Z',
        patch: {
          location: 'Room 14 (lab kit pickup)',
          status: 'scheduled',
        },
      },
    ],
  },
  audit: {
    createdAt: '2025-01-02T15:05:00.000Z',
    createdBy: MOCK_EDUCATOR_3.ids.id,
  },
};

export const ELA_SCHEDULE: ClassScheduleVM = {
  id: 'c3333333-3333-4333-8333-333333333333',
  orgId: MOCK_ORG_ID,
  title: 'ELA Writing Studio',
  startAt: '2026-01-16T22:30:00.000Z',
  endAt: '2026-01-16T23:30:00.000Z',
  timezone: 'America/New_York',
  status: 'scheduled',
  description: 'Writing practice and reading circles.',
  location: 'Zoom',
  visibility: 'class-members',
  color: 'pink',
  participants: [
    {
      userId: MOCK_EDUCATOR_1.ids.id,
      role: 'educator',
      status: 'accepted',
      displayName: MOCK_EDUCATOR_1.profile.displayName,
      avatarUrl: MOCK_EDUCATOR_1.profile.avatar.url ?? null,
    },
    {
      userId: MOCK_CHILDREN[2].ids.id,
      role: 'child',
      status: 'accepted',
      displayName: MOCK_CHILDREN[2].profile.displayName,
      avatarUrl: MOCK_CHILDREN[2].profile.avatar.url ?? null,
    },
    {
      userId: MOCK_GUARDIAN.ids.id,
      role: 'guardian',
      status: 'accepted',
      displayName: MOCK_GUARDIAN.profile.displayName,
      avatarUrl: MOCK_GUARDIAN.profile.avatar.url ?? null,
    },
  ],
  source: {
    kind: 'class_session',
    learningSpaceId: LEARNING_SPACE_IDS.ela,
    sessionId: '9a0d0b58-9d9b-4212-8f45-8a2e8c0b7003',
  },
  recurrence: {
    seriesId: 'a1b2c3d4-3333-4333-8333-333333333333',
    rule: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['FR'],
      timezone: 'America/New_York',
    },
    exceptions: [{ occurrenceKey: '2026-02-13T22:30:00.000Z', reason: 'Holiday' }],
    overrides: [
      {
        occurrenceKey: '2026-02-06T22:30:00.000Z',
        patch: {
          startAt: '2026-02-06T21:30:00.000Z',
          endAt: '2026-02-06T22:30:00.000Z',
          status: 'rescheduled',
        },
      },
    ],
  },
  audit: {
    createdAt: '2025-01-02T15:10:00.000Z',
    createdBy: MOCK_EDUCATOR_1.ids.id,
  },
};

export const CHESS_SCHEDULE: ClassScheduleVM = {
  id: 'c4444444-4444-4444-8444-444444444444',
  orgId: MOCK_ORG_ID,
  title: 'Chess Tactics',
  startAt: '2026-01-17T19:00:00.000Z',
  endAt: '2026-01-17T20:00:00.000Z',
  timezone: 'America/New_York',
  status: 'scheduled',
  description: 'Tactics training and game review.',
  location: 'Zoom',
  visibility: 'class-members',
  color: 'purple',
  participants: [
    {
      userId: MOCK_EDUCATOR_4.ids.id,
      role: 'educator',
      status: 'accepted',
      displayName: MOCK_EDUCATOR_4.profile.displayName,
      avatarUrl: MOCK_EDUCATOR_4.profile.avatar.url ?? null,
    },
    {
      userId: MOCK_CHILDREN[0].ids.id,
      role: 'child',
      status: 'accepted',
      displayName: MOCK_CHILDREN[0].profile.displayName,
      avatarUrl: MOCK_CHILDREN[0].profile.avatar.url ?? null,
    },
    {
      userId: MOCK_GUARDIAN.ids.id,
      role: 'guardian',
      status: 'accepted',
      displayName: MOCK_GUARDIAN.profile.displayName,
      avatarUrl: MOCK_GUARDIAN.profile.avatar.url ?? null,
    },
  ],
  source: {
    kind: 'class_session',
    learningSpaceId: LEARNING_SPACE_IDS.chess,
    sessionId: '9a0d0b58-9d9b-4212-8f45-8a2e8c0b7004',
  },
  recurrence: {
    seriesId: 'a1b2c3d4-4444-4444-8444-444444444444',
    rule: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      timezone: 'America/New_York',
    },
    exceptions: [{ occurrenceKey: '2026-02-14T19:00:00.000Z', reason: 'Tournament' }],
    overrides: [
      {
        occurrenceKey: '2026-01-31T19:00:00.000Z',
        patch: {
          startAt: '2026-01-31T20:00:00.000Z',
          endAt: '2026-01-31T21:00:00.000Z',
          status: 'rescheduled',
        },
      },
    ],
  },
  audit: {
    createdAt: '2025-01-02T15:15:00.000Z',
    createdBy: MOCK_EDUCATOR_4.ids.id,
  },
};

export const baseEvents: ClassScheduleVM[] = [
  MATH_SCHEDULE,
  SCIENCE_SCHEDULE,
  ELA_SCHEDULE,
  CHESS_SCHEDULE,
];
