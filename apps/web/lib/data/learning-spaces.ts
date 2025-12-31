import type {
  ChannelHeaderItemVM,
  ChannelVM,
  LearningSpaceVM,
} from '@iconicedu/shared-types';
import {
  MOCK_CHILDREN,
  MOCK_EDUCATOR,
  MOCK_EDUCATOR_2,
  MOCK_EDUCATOR_3,
  MOCK_GUARDIAN,
  MOCK_ORG_ID,
} from './people';
import { baseEvents } from './class-schedule-events';
import { LEARNING_SPACE_IDS } from './learning-space-ids';

const hoursAgo = (hours: number) =>
  new Date(Date.now() - 1000 * 60 * 60 * hours).toISOString();

const buildHeaderItems = (nextSessionLabel: string): ChannelHeaderItemVM[] => [
  { key: 'saved', label: '0', tooltip: 'View saved messages', isPrimary: true },
  { key: 'homework', label: 'HW', tooltip: 'Filter homework messages' },
  { key: 'session-summary', label: 'SS', tooltip: 'Filter session summaries' },
  { key: 'next-session', label: nextSessionLabel },
];

const makeChannel = ({
  id,
  topic,
  topicIconKey,
  description,
  createdBy,
  createdAt,
  participants,
  learningSpaceId,
  headerItems,
  purpose = 'learning-space',
}: {
  id: string;
  topic: string;
  topicIconKey?: string | null;
  description: string;
  createdBy: string;
  createdAt: string;
  participants: ChannelVM['participants'];
  learningSpaceId: string;
  headerItems: ChannelHeaderItemVM[];
  purpose?: ChannelVM['purpose'];
}): ChannelVM => ({
  id,
  orgId: MOCK_ORG_ID,
  kind: 'channel',
  topic,
  topicIconKey,
  description,
  visibility: 'private',
  purpose,
  status: 'active',
  createdBy,
  createdAt,
  archivedAt: null,
  postingPolicy: {
    kind: purpose === 'announcements' ? 'read-only' : 'members-only',
    allowThreads: purpose !== 'announcements',
    allowReactions: true,
  },
  headerItems,
  context: {
    primaryEntity: { kind: 'learning_space', id: learningSpaceId },
    capabilities: ['has_schedule', 'has_homework', 'has_summaries'],
  },
  participants,
  messages: {
    items: [],
    total: 0,
  },
  media: {
    items: [],
    total: 0,
  },
  files: {
    items: [],
    total: 0,
  },
  readState: {
    channelId: id,
    lastReadAt: hoursAgo(6),
    unreadCount: 0,
  },
  defaultRightPanelOpen: true,
  defaultRightPanelKey: 'channel_info',
});

const buildLearningSpace = ({
  id,
  title,
  subject,
  iconKey,
  description,
  primaryChannel,
  relatedChannels,
  scheduleIndex,
  createdBy,
  createdAt,
  participants,
}: {
  id: string;
  title: string;
  subject: string;
  iconKey: string;
  description: string;
  primaryChannel: ChannelVM;
  relatedChannels?: ChannelVM[];
  scheduleIndex: number;
  createdBy: string;
  createdAt: string;
  participants: ChannelVM['participants'];
}): LearningSpaceVM => ({
  id,
  orgId: MOCK_ORG_ID,
  kind: 'one_on_one',
  status: 'active',
  title,
  iconKey,
  subject,
  description,
  primaryChannel,
  relatedChannels,
  scheduleSeries: baseEvents[scheduleIndex % baseEvents.length] ?? null,
  links: [
    {
      label: 'Join',
      iconKey: 'video',
      url: 'https://zoom.us/j/1234567890',
      status: 'active',
    },
    {
      label: 'Classroom',
      iconKey: 'graduation-cap',
      url: 'https://classroom.google.com',
      status: 'active',
    },
    {
      label: 'Resources',
      iconKey: 'folder',
      url: 'https://drive.google.com',
      status: 'inactive',
      hidden: true,
    },
  ],
  participants,
  createdAt,
  createdBy,
  archivedAt: null,
});

export const LEARNING_SPACES: LearningSpaceVM[] = (() => {
  const learningSpaces: LearningSpaceVM[] = [];

  const spaceOneId = LEARNING_SPACE_IDS.childOneEla;
  const spaceOnePrimary = makeChannel({
    id: '11111111-2222-4333-8444-555555555555',
    topic: `ELA • ${MOCK_EDUCATOR.displayName} • Mon 4 pm`,
    topicIconKey: 'languages',
    description: 'Reading fluency and comprehension.',
    createdBy: MOCK_EDUCATOR.id,
    createdAt: hoursAgo(96),
    participants: [MOCK_EDUCATOR, MOCK_GUARDIAN, MOCK_CHILDREN[0]],
    learningSpaceId: spaceOneId,
    headerItems: buildHeaderItems('Mon 4:00 PM'),
  });
  const spaceOneAnnouncements = makeChannel({
    id: '11111111-2222-4333-8444-555555555556',
    topic: 'Announcements',
    topicIconKey: 'languages',
    description: 'Updates and reminders from the educator.',
    createdBy: MOCK_EDUCATOR.id,
    createdAt: hoursAgo(90),
    participants: [MOCK_EDUCATOR, MOCK_GUARDIAN],
    learningSpaceId: spaceOneId,
    headerItems: [{ key: 'info', label: 'Info', tooltip: 'Channel details' }],
    purpose: 'announcements',
  });

  learningSpaces.push(
    buildLearningSpace({
      id: spaceOneId,
      title: `${MOCK_CHILDREN[0].displayName} • ELA • ${MOCK_EDUCATOR.displayName}`,
      subject: 'ELA',
      iconKey: 'languages',
      description: 'Weekly ELA sessions with structured reading practice.',
      primaryChannel: spaceOnePrimary,
      relatedChannels: [spaceOneAnnouncements],
      scheduleIndex: 0,
      participants: spaceOnePrimary.participants,
      createdBy: MOCK_EDUCATOR.id,
      createdAt: hoursAgo(100),
    }),
  );

  const spaceTwoId = LEARNING_SPACE_IDS.childOneMath;
  const spaceTwoPrimary = makeChannel({
    id: '22222222-3333-4444-8555-666666666666',
    topic: `Math • ${MOCK_EDUCATOR_2.displayName} • Wed 5 pm`,
    topicIconKey: 'square-pi',
    description: 'Foundations, problem solving, and practice drills.',
    createdBy: MOCK_EDUCATOR_2.id,
    createdAt: hoursAgo(120),
    participants: [MOCK_EDUCATOR_2, MOCK_GUARDIAN, MOCK_CHILDREN[0]],
    learningSpaceId: spaceTwoId,
    headerItems: buildHeaderItems('Wed 5:00 PM'),
  });

  learningSpaces.push(
    buildLearningSpace({
      id: spaceTwoId,
      title: `${MOCK_CHILDREN[0].displayName} • Math • ${MOCK_EDUCATOR_2.displayName}`,
      subject: 'Math',
      iconKey: 'square-pi',
      description: 'Problem solving, drills, and mastery checks.',
      primaryChannel: spaceTwoPrimary,
      scheduleIndex: 1,
      participants: spaceTwoPrimary.participants,
      createdBy: MOCK_EDUCATOR_2.id,
      createdAt: hoursAgo(122),
    }),
  );

  const spaceThreeId = LEARNING_SPACE_IDS.childOneScience;
  const spaceThreePrimary = makeChannel({
    id: '33333333-4444-4555-8666-777777777777',
    topic: `Science • ${MOCK_EDUCATOR_3.displayName} • Fri 3 pm`,
    topicIconKey: 'chef-hat',
    description: 'Experiments, observations, and lab journals.',
    createdBy: MOCK_EDUCATOR_3.id,
    createdAt: hoursAgo(180),
    participants: [MOCK_EDUCATOR_3, MOCK_GUARDIAN, MOCK_CHILDREN[0]],
    learningSpaceId: spaceThreeId,
    headerItems: buildHeaderItems('Fri 3:00 PM'),
  });

  learningSpaces.push(
    buildLearningSpace({
      id: spaceThreeId,
      title: `${MOCK_CHILDREN[0].displayName} • Science • ${MOCK_EDUCATOR_3.displayName}`,
      subject: 'Science',
      iconKey: 'chef-hat',
      description: 'Hands-on labs and observation journals.',
      primaryChannel: spaceThreePrimary,
      scheduleIndex: 2,
      participants: spaceThreePrimary.participants,
      createdBy: MOCK_EDUCATOR_3.id,
      createdAt: hoursAgo(182),
    }),
  );

  const spaceFourId = LEARNING_SPACE_IDS.childTwoEla;
  const spaceFourPrimary = makeChannel({
    id: '44444444-5555-4666-8777-888888888888',
    topic: `ELA • ${MOCK_EDUCATOR_2.displayName} • Tue 4 pm`,
    topicIconKey: 'languages',
    description: 'Vocabulary building and writing prompts.',
    createdBy: MOCK_EDUCATOR_2.id,
    createdAt: hoursAgo(110),
    participants: [MOCK_EDUCATOR_2, MOCK_GUARDIAN, MOCK_CHILDREN[1]],
    learningSpaceId: spaceFourId,
    headerItems: buildHeaderItems('Tue 4:00 PM'),
  });

  learningSpaces.push(
    buildLearningSpace({
      id: spaceFourId,
      title: `${MOCK_CHILDREN[1].displayName} • ELA • ${MOCK_EDUCATOR_2.displayName}`,
      subject: 'ELA',
      iconKey: 'languages',
      description: 'Writing prompts, vocabulary building, and story drafts.',
      primaryChannel: spaceFourPrimary,
      scheduleIndex: 3,
      participants: spaceFourPrimary.participants,
      createdBy: MOCK_EDUCATOR_2.id,
      createdAt: hoursAgo(112),
    }),
  );

  const spaceFiveId = LEARNING_SPACE_IDS.childTwoMath;
  const spaceFivePrimary = makeChannel({
    id: '55555555-6666-4777-8888-999999999999',
    topic: `Math • ${MOCK_EDUCATOR_3.displayName} • Thu 6 pm`,
    topicIconKey: 'square-pi',
    description: 'Algebra basics and practice sets.',
    createdBy: MOCK_EDUCATOR_3.id,
    createdAt: hoursAgo(150),
    participants: [MOCK_EDUCATOR_3, MOCK_GUARDIAN, MOCK_CHILDREN[1]],
    learningSpaceId: spaceFiveId,
    headerItems: buildHeaderItems('Thu 6:00 PM'),
  });

  learningSpaces.push(
    buildLearningSpace({
      id: spaceFiveId,
      title: `${MOCK_CHILDREN[1].displayName} • Math • ${MOCK_EDUCATOR_3.displayName}`,
      subject: 'Math',
      iconKey: 'square-pi',
      description: 'Algebra, number sense, and fluency practice.',
      primaryChannel: spaceFivePrimary,
      scheduleIndex: 4,
      participants: spaceFivePrimary.participants,
      createdBy: MOCK_EDUCATOR_3.id,
      createdAt: hoursAgo(152),
    }),
  );

  const spaceSixId = LEARNING_SPACE_IDS.childTwoScience;
  const spaceSixPrimary = makeChannel({
    id: '66666666-7777-4888-8999-aaaaaaaaaaaa',
    topic: `Science • ${MOCK_EDUCATOR.displayName} • Fri 2 pm`,
    topicIconKey: 'chef-hat',
    description: 'Earth science, labs, and interactive demos.',
    createdBy: MOCK_EDUCATOR.id,
    createdAt: hoursAgo(210),
    participants: [MOCK_EDUCATOR, MOCK_GUARDIAN, MOCK_CHILDREN[1]],
    learningSpaceId: spaceSixId,
    headerItems: buildHeaderItems('Fri 2:00 PM'),
  });

  learningSpaces.push(
    buildLearningSpace({
      id: spaceSixId,
      title: `${MOCK_CHILDREN[1].displayName} • Science • ${MOCK_EDUCATOR.displayName}`,
      subject: 'Science',
      iconKey: 'chef-hat',
      description: 'Earth science concepts and hands-on labs.',
      primaryChannel: spaceSixPrimary,
      scheduleIndex: 5,
      participants: spaceSixPrimary.participants,
      createdBy: MOCK_EDUCATOR.id,
      createdAt: hoursAgo(212),
    }),
  );

  const spaceSevenId = LEARNING_SPACE_IDS.childThreeEla;
  const spaceSevenPrimary = makeChannel({
    id: '77777777-8888-4999-8aaa-bbbbbbbbbbbb',
    topic: `ELA • ${MOCK_EDUCATOR_3.displayName} • Mon 3 pm`,
    topicIconKey: 'languages',
    description: 'Storytelling and reading circles.',
    createdBy: MOCK_EDUCATOR_3.id,
    createdAt: hoursAgo(140),
    participants: [MOCK_EDUCATOR_3, MOCK_GUARDIAN, MOCK_CHILDREN[2]],
    learningSpaceId: spaceSevenId,
    headerItems: buildHeaderItems('Mon 3:00 PM'),
  });

  learningSpaces.push(
    buildLearningSpace({
      id: spaceSevenId,
      title: `${MOCK_CHILDREN[2].displayName} • ELA • ${MOCK_EDUCATOR_3.displayName}`,
      subject: 'ELA',
      iconKey: 'languages',
      description: 'Reading circles, journaling, and storytelling.',
      primaryChannel: spaceSevenPrimary,
      scheduleIndex: 6,
      participants: spaceSevenPrimary.participants,
      createdBy: MOCK_EDUCATOR_3.id,
      createdAt: hoursAgo(142),
    }),
  );

  const spaceEightId = LEARNING_SPACE_IDS.childThreeMath;
  const spaceEightPrimary = makeChannel({
    id: '88888888-9999-4aaa-8bbb-cccccccccccc',
    topic: `Math • ${MOCK_EDUCATOR.displayName} • Wed 4 pm`,
    topicIconKey: 'square-pi',
    description: 'Number sense and problem practice.',
    createdBy: MOCK_EDUCATOR.id,
    createdAt: hoursAgo(160),
    participants: [MOCK_EDUCATOR, MOCK_GUARDIAN, MOCK_CHILDREN[2]],
    learningSpaceId: spaceEightId,
    headerItems: buildHeaderItems('Wed 4:00 PM'),
  });

  learningSpaces.push(
    buildLearningSpace({
      id: spaceEightId,
      title: `${MOCK_CHILDREN[2].displayName} • Math • ${MOCK_EDUCATOR.displayName}`,
      subject: 'Math',
      iconKey: 'square-pi',
      description: 'Number sense, drills, and problem practice.',
      primaryChannel: spaceEightPrimary,
      scheduleIndex: 7,
      participants: spaceEightPrimary.participants,
      createdBy: MOCK_EDUCATOR.id,
      createdAt: hoursAgo(162),
    }),
  );

  const spaceNineId = LEARNING_SPACE_IDS.childThreeScience;
  const spaceNinePrimary = makeChannel({
    id: '99999999-aaaa-4bbb-8ccc-dddddddddddd',
    topic: `Science • ${MOCK_EDUCATOR_2.displayName} • Thu 5 pm`,
    topicIconKey: 'chef-hat',
    description: 'Life science labs and journal prompts.',
    createdBy: MOCK_EDUCATOR_2.id,
    createdAt: hoursAgo(220),
    participants: [MOCK_EDUCATOR_2, MOCK_GUARDIAN, MOCK_CHILDREN[2]],
    learningSpaceId: spaceNineId,
    headerItems: buildHeaderItems('Thu 5:00 PM'),
  });

  learningSpaces.push(
    buildLearningSpace({
      id: spaceNineId,
      title: `${MOCK_CHILDREN[2].displayName} • Science • ${MOCK_EDUCATOR_2.displayName}`,
      subject: 'Science',
      iconKey: 'chef-hat',
      description: 'Life science experiments and lab journals.',
      primaryChannel: spaceNinePrimary,
      scheduleIndex: 8,
      participants: spaceNinePrimary.participants,
      createdBy: MOCK_EDUCATOR_2.id,
      createdAt: hoursAgo(222),
    }),
  );

  return learningSpaces;
})();

export const LEARNING_SPACE_CHANNELS: ChannelVM[] = LEARNING_SPACES.map(
  (space) => space.primaryChannel,
);

export const LEARNING_SPACE_BY_CHANNEL_ID = Object.fromEntries(
  LEARNING_SPACES.map((space) => [space.primaryChannel.id, space]),
);
