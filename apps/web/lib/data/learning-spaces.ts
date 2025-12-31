import type { LearningSpaceVM } from '@iconicedu/shared-types';
import { LEARNING_SPACE_IDS, ORG_ID } from './ids';
import {
  CHESS_SCHEDULE,
  ELA_SCHEDULE,
  MATH_SCHEDULE,
  SCIENCE_SCHEDULE,
} from './class-schedule-events';
import {
  CHESS_LEARNING_LINKS,
  ELA_LEARNING_LINKS,
  MATH_LEARNING_LINKS,
  SCIENCE_LEARNING_LINKS,
} from './learning-space-links';
import {
  CHESS_CHANNEL,
  ELA_CHANNEL,
  MATH_CHANNEL,
  SCIENCE_CHANNEL,
} from './learning-space-channels';
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

export const LEARNING_SPACE_MATH: LearningSpaceVM = {
  ids: {
    id: LEARNING_SPACE_IDS.math,
    orgId: ORG_ID,
  },
  basics: {
    kind: 'one_on_one',
    status: 'active',
    title: 'Math Mastery',
    iconKey: 'square-pi',
    subject: 'MATH',
    description: 'Number fluency, reasoning, and problem solving.',
  },
  channels: {
    primaryChannel: MATH_CHANNEL,
  },
  schedule: {
    scheduleSeries: MATH_SCHEDULE,
  },
  resources: {
    links: MATH_LEARNING_LINKS,
  },
  lifecycle: {
    createdAt: '2025-09-01T00:00:00.000Z',
    createdBy: EDUCATOR_KAI.ids.id,
    archivedAt: null,
  },
  people: {
    participants: [GUARDIAN_MORGAN, CHILD_AVA, EDUCATOR_KAI],
  },
};

export const LEARNING_SPACE_SCIENCE: LearningSpaceVM = {
  ids: {
    id: LEARNING_SPACE_IDS.science,
    orgId: ORG_ID,
  },
  basics: {
    kind: 'small_group',
    status: 'active',
    title: 'Science Lab',
    iconKey: 'earth',
    subject: 'SCIENCE',
    description: 'Hands-on labs with weekly reflections.',
  },
  channels: {
    primaryChannel: SCIENCE_CHANNEL,
  },
  schedule: {
    scheduleSeries: SCIENCE_SCHEDULE,
  },
  resources: {
    links: SCIENCE_LEARNING_LINKS,
  },
  lifecycle: {
    createdAt: '2025-09-02T00:00:00.000Z',
    createdBy: EDUCATOR_PRIYA.ids.id,
    archivedAt: null,
  },
  people: {
    participants: [GUARDIAN_MORGAN, CHILD_MILO, EDUCATOR_PRIYA],
  },
};

export const LEARNING_SPACE_ELA: LearningSpaceVM = {
  ids: {
    id: LEARNING_SPACE_IDS.ela,
    orgId: ORG_ID,
  },
  basics: {
    kind: 'one_on_one',
    status: 'active',
    title: 'ELA Studio',
    iconKey: 'languages',
    subject: 'ELA',
    description: 'Reading circles and narrative writing.',
  },
  channels: {
    primaryChannel: ELA_CHANNEL,
  },
  schedule: {
    scheduleSeries: ELA_SCHEDULE,
  },
  resources: {
    links: ELA_LEARNING_LINKS,
  },
  lifecycle: {
    createdAt: '2025-09-03T00:00:00.000Z',
    createdBy: EDUCATOR_ELENA.ids.id,
    archivedAt: null,
  },
  people: {
    participants: [GUARDIAN_MORGAN, CHILD_MAYA, EDUCATOR_ELENA],
  },
};

export const LEARNING_SPACE_CHESS: LearningSpaceVM = {
  ids: {
    id: LEARNING_SPACE_IDS.chess,
    orgId: ORG_ID,
  },
  basics: {
    kind: 'small_group',
    status: 'active',
    title: 'Chess Studio',
    iconKey: 'chef-hat',
    subject: 'CHESS',
    description: 'Tactics, openings, and game review.',
  },
  channels: {
    primaryChannel: CHESS_CHANNEL,
  },
  schedule: {
    scheduleSeries: CHESS_SCHEDULE,
  },
  resources: {
    links: CHESS_LEARNING_LINKS,
  },
  lifecycle: {
    createdAt: '2025-09-04T00:00:00.000Z',
    createdBy: EDUCATOR_LEO.ids.id,
    archivedAt: null,
  },
  people: {
    participants: [GUARDIAN_MORGAN, CHILD_AVA, EDUCATOR_LEO],
  },
};

export const LEARNING_SPACES: LearningSpaceVM[] = [
  LEARNING_SPACE_MATH,
  LEARNING_SPACE_SCIENCE,
  LEARNING_SPACE_ELA,
  LEARNING_SPACE_CHESS,
];

export const LEARNING_SPACE_BY_CHANNEL_ID: Record<string, LearningSpaceVM> = {
  [MATH_CHANNEL.ids.id]: LEARNING_SPACE_MATH,
  [SCIENCE_CHANNEL.ids.id]: LEARNING_SPACE_SCIENCE,
  [ELA_CHANNEL.ids.id]: LEARNING_SPACE_ELA,
  [CHESS_CHANNEL.ids.id]: LEARNING_SPACE_CHESS,
};
