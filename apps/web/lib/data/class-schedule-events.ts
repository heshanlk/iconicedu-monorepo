import type {
  ClassScheduleParticipantVM,
  ClassScheduleVM,
} from '@iconicedu/shared-types';
import {
  MOCK_CHILDREN,
  MOCK_EDUCATOR,
  MOCK_EDUCATOR_2,
  MOCK_EDUCATOR_3,
  MOCK_GUARDIAN,
} from './people';

const now = new Date();
const makeDateOffset = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
};

const makeIsoAt = (daysOffset: number, hours: number, minutes: number) => {
  const date = makeDateOffset(daysOffset);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

const makeParticipant = (
  user: { accountId: string; displayName: string; avatar: { url?: string | null } },
  role: ClassScheduleParticipantVM['role'],
): ClassScheduleParticipantVM => ({
  userId: user.accountId,
  role,
  displayName: user.displayName,
  avatarUrl: user.avatar.url ?? null,
});

const guardian = makeParticipant(MOCK_GUARDIAN, 'guardian');
const childOne = makeParticipant(MOCK_CHILDREN[0], 'child');
const childTwo = makeParticipant(MOCK_CHILDREN[1], 'child');
const childThree = makeParticipant(MOCK_CHILDREN[2], 'child');
const educatorOne = makeParticipant(MOCK_EDUCATOR, 'educator');
const educatorTwo = makeParticipant(MOCK_EDUCATOR_2, 'educator');
const educatorThree = makeParticipant(MOCK_EDUCATOR_3, 'educator');

const createdAt = now.toISOString();

export const baseEvents: ClassScheduleVM[] = [
  {
    id: 'class-math-sarah',
    title: `${MOCK_CHILDREN[0].displayName} • Math with ${MOCK_EDUCATOR.displayName}`,
    startAt: makeIsoAt(0, 9, 0),
    endAt: makeIsoAt(0, 10, 0),
    timezone: 'America/New_York',
    status: 'scheduled',
    description: 'Weekly math session with practice problems and review.',
    location: 'Zoom',
    visibility: 'class-members',
    color: 'blue',
    participants: [guardian, childOne, educatorOne],
    source: {
      kind: 'class_session',
      classSpaceId: 'class-space-math-sarah',
      sessionId: 'session-math-001',
    },
    recurrence: {
      seriesId: 'series-math-sarah',
      rule: {
        frequency: 'weekly',
        interval: 1,
        byWeekday: ['MO'],
        timezone: 'America/New_York',
      },
      exceptions: [
        { occurrenceKey: makeIsoAt(7, 9, 0), reason: 'Holiday closure' },
        { occurrenceKey: makeIsoAt(14, 9, 0), reason: 'Family travel' },
      ],
      overrides: [
        {
          occurrenceKey: makeIsoAt(1, 9, 0),
          patch: {
            title: `${MOCK_CHILDREN[0].displayName} • Math (short session)`,
            startAt: makeIsoAt(1, 9, 30),
            endAt: makeIsoAt(1, 10, 0),
            status: 'rescheduled',
          },
        },
        {
          occurrenceKey: makeIsoAt(21, 9, 0),
          patch: {
            location: 'Google Meet',
            description: 'Guest instructor covering fractions and ratios.',
          },
        },
      ],
    },
    audit: {
      createdAt,
      createdBy: MOCK_EDUCATOR.accountId,
    },
  },
  {
    id: 'class-science-zayne',
    title: `${MOCK_CHILDREN[1].displayName} • Science lab with ${MOCK_EDUCATOR_2.displayName}`,
    startAt: makeIsoAt(1, 14, 0),
    endAt: makeIsoAt(1, 15, 0),
    timezone: 'America/New_York',
    status: 'scheduled',
    description: 'Hands-on lab with microscope observations.',
    location: 'Zoom',
    visibility: 'class-members',
    color: 'green',
    participants: [guardian, childTwo, educatorTwo],
    source: {
      kind: 'class_session',
      classSpaceId: 'class-space-science-zayne',
      sessionId: 'session-science-002',
    },
    recurrence: {
      seriesId: 'series-science-zayne',
      rule: {
        frequency: 'weekly',
        interval: 1,
        byWeekday: ['WE'],
        timezone: 'America/New_York',
      },
      exceptions: [{ occurrenceKey: makeIsoAt(8, 14, 0), reason: 'Field trip' }],
      overrides: [
        {
          occurrenceKey: makeIsoAt(15, 14, 0),
          patch: {
            title: `${MOCK_CHILDREN[1].displayName} • Science lab (extended)`,
            startAt: makeIsoAt(15, 13, 30),
            endAt: makeIsoAt(15, 15, 30),
          },
        },
      ],
    },
    audit: {
      createdAt,
      createdBy: MOCK_EDUCATOR_2.accountId,
    },
  },
  {
    id: 'class-ela-sophia',
    title: `${MOCK_CHILDREN[2].displayName} • ELA with ${MOCK_EDUCATOR_3.displayName}`,
    startAt: makeIsoAt(2, 11, 0),
    endAt: makeIsoAt(2, 12, 0),
    timezone: 'America/Chicago',
    status: 'scheduled',
    description: 'Reading comprehension and writing workshop.',
    location: 'Zoom',
    visibility: 'class-members',
    color: 'pink',
    participants: [guardian, childThree, educatorThree],
    source: {
      kind: 'class_session',
      classSpaceId: 'class-space-ela-sophia',
      sessionId: 'session-ela-003',
    },
    recurrence: {
      seriesId: 'series-ela-sophia',
      rule: {
        frequency: 'weekly',
        interval: 1,
        byWeekday: ['FR'],
        timezone: 'America/Chicago',
      },
      exceptions: [],
      overrides: [],
    },
    audit: {
      createdAt,
      createdBy: MOCK_EDUCATOR_3.accountId,
    },
  },
  {
    id: 'makeup-math-sarah',
    title: `${MOCK_CHILDREN[0].displayName} • Math makeup session`,
    startAt: makeIsoAt(3, 16, 0),
    endAt: makeIsoAt(3, 17, 0),
    timezone: 'America/New_York',
    status: 'rescheduled',
    description: 'Rescheduled session due to holiday.',
    location: 'Zoom',
    visibility: 'internal',
    color: 'orange',
    participants: [guardian, childOne, educatorOne],
    source: {
      kind: 'manual',
      createdByUserId: MOCK_EDUCATOR.accountId,
    },
    audit: {
      createdAt,
      createdBy: MOCK_EDUCATOR.accountId,
      updatedAt: createdAt,
      updatedBy: MOCK_EDUCATOR.accountId,
    },
  },
  {
    id: 'family-review',
    title: 'Learning plan review',
    startAt: makeIsoAt(5, 18, 0),
    endAt: makeIsoAt(5, 18, 30),
    timezone: 'America/New_York',
    status: 'scheduled',
    description: 'Review progress and plan next steps.',
    location: 'Google Meet',
    visibility: 'private',
    color: 'yellow',
    participants: [guardian, educatorOne],
    source: {
      kind: 'manual',
      createdByUserId: MOCK_GUARDIAN.accountId,
    },
    audit: {
      createdAt,
      createdBy: MOCK_GUARDIAN.accountId,
    },
  },
  {
    id: 'holiday-no-class',
    title: 'No class • School holiday',
    startAt: makeIsoAt(7, 9, 0),
    endAt: makeIsoAt(7, 10, 0),
    timezone: 'America/New_York',
    status: 'cancelled',
    description: 'Holiday closure. Classes resume next week.',
    location: 'Online',
    visibility: 'public',
    color: 'gray',
    participants: [guardian, educatorOne, childOne],
    source: {
      kind: 'class_session',
      classSpaceId: 'class-space-math-sarah',
      sessionId: 'session-math-001-cancelled',
    },
    audit: {
      createdAt,
      createdBy: MOCK_EDUCATOR.accountId,
      cancelledAt: createdAt,
      cancelledBy: MOCK_EDUCATOR.accountId,
      cancelReason: 'holiday',
      cancelNote: 'School closed for the holiday.',
    },
  },
];
