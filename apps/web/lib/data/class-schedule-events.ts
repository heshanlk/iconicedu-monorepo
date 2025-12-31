import type { ClassScheduleVM } from '@iconicedu/shared-types';
import {
  CHANNEL_IDS,
  LEARNING_SPACE_IDS,
  ORG_ID,
  PROFILE_IDS,
  SCHEDULE_IDS,
  SCHEDULE_SERIES_IDS,
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

export const MATH_SCHEDULE: ClassScheduleVM = {
  id: SCHEDULE_IDS.math,
  orgId: ORG_ID,
  title: 'Math Mastery • Weekly',
  description: 'Number fluency and problem-solving practice.',
  location: 'Zoom',
  startAt: '2026-03-04T22:30:00.000Z',
  endAt: '2026-03-04T23:15:00.000Z',
  timezone: 'America/New_York',
  status: 'scheduled',
  visibility: 'class-members',
  color: 'blue',
  participants: [
    {
      userId: EDUCATOR_KAI.ids.id,
      role: 'educator',
      status: 'accepted',
      displayName: EDUCATOR_KAI.profile.displayName,
      avatarUrl: EDUCATOR_KAI.profile.avatar.url ?? null,
    },
    {
      userId: GUARDIAN_MORGAN.ids.id,
      role: 'guardian',
      status: 'accepted',
      displayName: GUARDIAN_MORGAN.profile.displayName,
      avatarUrl: GUARDIAN_MORGAN.profile.avatar.url ?? null,
    },
    {
      userId: CHILD_AVA.ids.id,
      role: 'child',
      status: 'accepted',
      displayName: CHILD_AVA.profile.displayName,
      avatarUrl: CHILD_AVA.profile.avatar.url ?? null,
    },
  ],
  source: {
    kind: 'class_session',
    learningSpaceId: LEARNING_SPACE_IDS.math,
    sessionId: CHANNEL_IDS.math,
  },
  recurrence: {
    seriesId: SCHEDULE_SERIES_IDS.math,
    rule: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['WE'],
      timezone: 'America/New_York',
    },
    exceptions: [
      {
        occurrenceKey: '2026-03-18T22:30:00.000Z',
        reason: 'Spring break',
      },
    ],
    overrides: [
      {
        occurrenceKey: '2026-03-11T22:30:00.000Z',
        patch: {
          startAt: '2026-03-11T23:00:00.000Z',
          endAt: '2026-03-11T23:45:00.000Z',
          title: 'Math Mastery • Special Office Hours',
        },
      },
    ],
  },
  audit: {
    createdAt: '2025-10-01T15:00:00.000Z',
    createdBy: PROFILE_IDS.educator2,
    updatedAt: '2026-02-10T10:00:00.000Z',
    updatedBy: PROFILE_IDS.educator2,
  },
};

export const SCIENCE_SCHEDULE: ClassScheduleVM = {
  id: SCHEDULE_IDS.science,
  orgId: ORG_ID,
  title: 'Science Lab • Weekly',
  description: 'Hands-on experiments and lab reflection.',
  location: 'Zoom',
  startAt: '2026-03-03T22:00:00.000Z',
  endAt: '2026-03-03T22:45:00.000Z',
  timezone: 'America/New_York',
  status: 'scheduled',
  visibility: 'class-members',
  color: 'green',
  participants: [
    {
      userId: EDUCATOR_PRIYA.ids.id,
      role: 'educator',
      status: 'accepted',
      displayName: EDUCATOR_PRIYA.profile.displayName,
      avatarUrl: EDUCATOR_PRIYA.profile.avatar.url ?? null,
    },
    {
      userId: GUARDIAN_MORGAN.ids.id,
      role: 'guardian',
      status: 'accepted',
      displayName: GUARDIAN_MORGAN.profile.displayName,
      avatarUrl: GUARDIAN_MORGAN.profile.avatar.url ?? null,
    },
    {
      userId: CHILD_MILO.ids.id,
      role: 'child',
      status: 'accepted',
      displayName: CHILD_MILO.profile.displayName,
      avatarUrl: CHILD_MILO.profile.avatar.url ?? null,
    },
  ],
  source: {
    kind: 'class_session',
    learningSpaceId: LEARNING_SPACE_IDS.science,
    sessionId: CHANNEL_IDS.science,
  },
  recurrence: {
    seriesId: SCHEDULE_SERIES_IDS.science,
    rule: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['TU'],
      timezone: 'America/New_York',
    },
    overrides: [
      {
        occurrenceKey: '2026-03-17T22:00:00.000Z',
        patch: {
          location: 'Lab Annex • Zoom',
          title: 'Science Lab • Capstone',
        },
      },
    ],
  },
  audit: {
    createdAt: '2025-10-03T14:00:00.000Z',
    createdBy: PROFILE_IDS.educator3,
    updatedAt: '2026-02-11T12:00:00.000Z',
    updatedBy: PROFILE_IDS.educator3,
  },
};

export const ELA_SCHEDULE: ClassScheduleVM = {
  id: SCHEDULE_IDS.ela,
  orgId: ORG_ID,
  title: 'ELA Studio • Weekly',
  description: 'Reading circles and writing workshops.',
  location: 'Zoom',
  startAt: '2026-03-06T21:00:00.000Z',
  endAt: '2026-03-06T21:50:00.000Z',
  timezone: 'America/New_York',
  status: 'scheduled',
  visibility: 'class-members',
  color: 'purple',
  participants: [
    {
      userId: EDUCATOR_ELENA.ids.id,
      role: 'educator',
      status: 'accepted',
      displayName: EDUCATOR_ELENA.profile.displayName,
      avatarUrl: EDUCATOR_ELENA.profile.avatar.url ?? null,
    },
    {
      userId: GUARDIAN_MORGAN.ids.id,
      role: 'guardian',
      status: 'accepted',
      displayName: GUARDIAN_MORGAN.profile.displayName,
      avatarUrl: GUARDIAN_MORGAN.profile.avatar.url ?? null,
    },
    {
      userId: CHILD_MAYA.ids.id,
      role: 'child',
      status: 'accepted',
      displayName: CHILD_MAYA.profile.displayName,
      avatarUrl: CHILD_MAYA.profile.avatar.url ?? null,
    },
  ],
  source: {
    kind: 'class_session',
    learningSpaceId: LEARNING_SPACE_IDS.ela,
    sessionId: CHANNEL_IDS.ela,
  },
  recurrence: {
    seriesId: SCHEDULE_SERIES_IDS.ela,
    rule: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['FR'],
      timezone: 'America/New_York',
    },
    exceptions: [
      {
        occurrenceKey: '2026-03-27T21:00:00.000Z',
        reason: 'Assessment week',
      },
    ],
  },
  audit: {
    createdAt: '2025-10-05T16:00:00.000Z',
    createdBy: PROFILE_IDS.educator1,
    updatedAt: '2026-02-12T09:00:00.000Z',
    updatedBy: PROFILE_IDS.educator1,
  },
};

export const CHESS_SCHEDULE: ClassScheduleVM = {
  id: SCHEDULE_IDS.chess,
  orgId: ORG_ID,
  title: 'Chess Studio • Weekly',
  description: 'Tactical puzzles and game review.',
  location: 'Zoom',
  startAt: '2026-03-07T20:00:00.000Z',
  endAt: '2026-03-07T20:45:00.000Z',
  timezone: 'America/New_York',
  status: 'scheduled',
  visibility: 'class-members',
  color: 'orange',
  participants: [
    {
      userId: EDUCATOR_LEO.ids.id,
      role: 'educator',
      status: 'accepted',
      displayName: EDUCATOR_LEO.profile.displayName,
      avatarUrl: EDUCATOR_LEO.profile.avatar.url ?? null,
    },
    {
      userId: GUARDIAN_MORGAN.ids.id,
      role: 'guardian',
      status: 'accepted',
      displayName: GUARDIAN_MORGAN.profile.displayName,
      avatarUrl: GUARDIAN_MORGAN.profile.avatar.url ?? null,
    },
    {
      userId: CHILD_AVA.ids.id,
      role: 'child',
      status: 'tentative',
      displayName: CHILD_AVA.profile.displayName,
      avatarUrl: CHILD_AVA.profile.avatar.url ?? null,
    },
  ],
  source: {
    kind: 'class_session',
    learningSpaceId: LEARNING_SPACE_IDS.chess,
    sessionId: CHANNEL_IDS.chess,
  },
  recurrence: {
    seriesId: SCHEDULE_SERIES_IDS.chess,
    rule: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      timezone: 'America/New_York',
    },
  },
  audit: {
    createdAt: '2025-10-07T13:30:00.000Z',
    createdBy: PROFILE_IDS.educator4,
    updatedAt: '2026-02-15T09:45:00.000Z',
    updatedBy: PROFILE_IDS.educator4,
  },
};

export const baseEvents: ClassScheduleVM[] = [
  MATH_SCHEDULE,
  SCIENCE_SCHEDULE,
  ELA_SCHEDULE,
  CHESS_SCHEDULE,
];
