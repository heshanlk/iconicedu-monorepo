import type {
  ChannelVM,
  MessageReadStateVM,
  MessageVM,
  TextMessageVM,
  ThreadVM,
  LessonAssignmentMessageVM,
  ProgressUpdateMessageVM,
  SessionBookingMessageVM,
  HomeworkSubmissionMessageVM,
  LinkPreviewMessageVM,
  AudioRecordingMessageVM,
} from '@iconicedu/shared-types';
import { MOCK_GUARDIAN, MOCK_EDUCATOR, MOCK_CHILDREN } from './people';

const hoursAgo = (hours: number) => new Date(Date.now() - 3600000 * hours).toISOString();
const minutesAgo = (minutes: number) =>
  new Date(Date.now() - 60000 * minutes).toISOString();
const hoursFromNow = (hours: number) =>
  new Date(Date.now() + 3600000 * hours).toISOString();

const LEARNING_SPACE_ID = 'learning-space-1';

export const LEARNING_SPACE_READ_STATE: MessageReadStateVM = {
  channelId: LEARNING_SPACE_ID,
  lastReadMessageId: '4',
  lastReadAt: hoursAgo(1),
  unreadCount: 6,
};

const THREAD_ONE: ThreadVM = {
  id: 'thread-1',
  parentMessageId: '2',
  parentMessageSnippet:
    "Good morning, Ms. Williams! Yes, I've been wanting to talk about her recent test results. Is everything okay?",
  parentMessageAuthorId: MOCK_GUARDIAN.id,
  parentMessageAuthorName: MOCK_GUARDIAN.displayName,
  messageCount: 3,
  lastReplyAt: hoursAgo(2),
  participants: [MOCK_EDUCATOR, MOCK_GUARDIAN],
  readState: {
    lastReadMessageId: 't1-2',
    unreadCount: 1,
  },
};

const THREAD_ONE_PARENT_MESSAGE: TextMessageVM = {
  id: '2',
  type: 'text',
  content:
    "Good morning, Ms. Williams! Yes, I've been wanting to talk about her recent test results. Is everything okay?",
  sender: MOCK_GUARDIAN,
  createdAt: hoursAgo(23.5),
  reactions: [],
  visibility: { type: 'all' },
  thread: THREAD_ONE,
};

const THREAD_ONE_MESSAGES: TextMessageVM[] = [
  THREAD_ONE_PARENT_MESSAGE,
  {
    id: 't1-2',
    type: 'text',
    content:
      'Everything is going well overall! Sarah is a bright child. I just wanted to go over some areas where we can help her improve even more.',
    sender: MOCK_EDUCATOR,
    createdAt: hoursAgo(23),
    reactions: [{ emoji: '👍', count: 1, sampleUserIds: [MOCK_GUARDIAN.id] }],
    visibility: { type: 'all' },
    thread: THREAD_ONE,
  },
  {
    id: 't1-3',
    type: 'text',
    content: 'That sounds great! I appreciate you taking the time to help Sarah succeed.',
    sender: MOCK_GUARDIAN,
    createdAt: hoursAgo(2),
    reactions: [],
    visibility: { type: 'all' },
    thread: THREAD_ONE,
  },
];

export const MOCK_MESSAGES: MessageVM[] = [
  {
    id: '1',
    type: 'text',
    content:
      "Good morning! Thank you for scheduling this guardian-educator conference. I wanted to discuss Sarah's progress in math this semester.",
    sender: MOCK_EDUCATOR,
    createdAt: hoursAgo(24),
    reactions: [{ emoji: '👋', count: 1, sampleUserIds: [MOCK_GUARDIAN.id] }],
    visibility: { type: 'all' },
    isSaved: true,
  } as TextMessageVM,
  THREAD_ONE_PARENT_MESSAGE,
  ...THREAD_ONE_MESSAGES.slice(1),
  {
    id: '3',
    type: 'lesson-assignment',
    content:
      "Here's the homework assignment for next week. Sarah will need to complete these problems for Monday.",
    sender: MOCK_EDUCATOR,
    createdAt: hoursAgo(20),
    reactions: [{ emoji: '📚', count: 1, sampleUserIds: [MOCK_GUARDIAN.id] }],
    visibility: { type: 'all' },
    isSaved: true,
    assignment: {
      title: 'Fractions and Decimals Practice',
      description:
        'Complete problems 1-20 in the workbook. Focus on converting fractions to decimals and vice versa.',
      dueAt: hoursFromNow(96),
      subject: 'Mathematics',
      estimatedDuration: 30,
      difficulty: 'intermediate',
    },
  } as LessonAssignmentMessageVM,
  {
    id: '4',
    type: 'session-booking',
    content:
      "I've scheduled our next guardian-educator meeting to discuss Sarah's semester progress.",
    sender: MOCK_EDUCATOR,
    createdAt: hoursAgo(18),
    reactions: [{ emoji: '✅', count: 1, sampleUserIds: [MOCK_GUARDIAN.id] }],
    visibility: { type: 'all' },
    isSaved: true,
    session: {
      title: "Guardian-Educator Conference: Sarah's Progress",
      subject: 'General Academic Review',
      startAt: hoursFromNow(72),
      durationMinutes: 30,
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      status: 'confirmed',
      topics: ['Math Progress', 'Reading Comprehension', 'Social Development'],
    },
  } as SessionBookingMessageVM,
  {
    id: '5',
    type: 'homework-submission',
    content:
      'Sarah completed her homework assignment last night. I helped her review the problems she found challenging.',
    sender: MOCK_GUARDIAN,
    createdAt: hoursAgo(4),
    reactions: [],
    visibility: { type: 'all' },
    homework: {
      assignmentTitle: 'Fractions and Decimals Practice',
      submittedAt: hoursAgo(4),
      attachments: [
        {
          type: 'file',
          url: '/homework.pdf',
          name: 'sarah_math_homework.pdf',
          size: 245000,
        },
      ],
      status: 'submitted',
    },
  } as HomeworkSubmissionMessageVM,
  {
    id: '6',
    type: 'progress-update',
    content:
      'Great news! Sarah has shown significant improvement in her math skills this month!',
    sender: MOCK_EDUCATOR,
    createdAt: hoursAgo(2),
    reactions: [
      { emoji: '🎉', count: 1, sampleUserIds: [MOCK_GUARDIAN.id] },
      { emoji: '💪', count: 1, sampleUserIds: [MOCK_GUARDIAN.id] },
    ],
    visibility: { type: 'all' },
    isSaved: true,
    progress: {
      subject: 'Mathematics',
      metric: 'Quiz Average',
      previousValue: 72,
      currentValue: 88,
      targetValue: 85,
      improvement: 22.2,
      summary: "Sarah's quiz average has improved from 72% to 88% this month!",
    },
  } as ProgressUpdateMessageVM,
  {
    id: '7',
    type: 'text',
    content:
      "That's wonderful to hear! We've been working on math together at home. Thank you for your support and guidance.",
    sender: MOCK_GUARDIAN,
    createdAt: minutesAgo(5),
    reactions: [{ emoji: '🙏', count: 1, sampleUserIds: [MOCK_EDUCATOR.id] }],
    visibility: { type: 'all' },
  } as TextMessageVM,
  {
    id: '8',
    type: 'link-preview',
    content: 'I found this helpful resource for practicing fractions at home!',
    sender: MOCK_GUARDIAN,
    createdAt: minutesAgo(1),
    reactions: [],
    visibility: { type: 'all' },
    isSaved: true,
    link: {
      url: 'https://www.khanacademy.org/math/arithmetic/fractions',
      title: 'Fractions | Arithmetic | Khan Academy',
      description:
        'Learn about fractions with step-by-step lessons, practice problems, and video explanations.',
      imageUrl: 'https://picsum.photos/seed/picsum/400/800',
      siteName: 'Khan Academy',
      favicon: 'https://picsum.photos/seed/picsum/16/16',
    },
  } as LinkPreviewMessageVM,
  {
    id: '9',
    type: 'audio-recording',
    content: "Quick voice note about Sarah's science project",
    sender: MOCK_EDUCATOR,
    createdAt: minutesAgo(0.5),
    reactions: [],
    visibility: { type: 'all' },
    audio: {
      url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
      durationSeconds: 45,
      waveform: [
        20, 35, 45, 60, 55, 40, 50, 65, 70, 55, 45, 60, 50, 40, 35, 45, 55, 60, 50, 40,
        30, 45, 55, 50, 45,
      ],
      fileSize: 128000,
      mimeType: 'audio/wav',
    },
  } as AudioRecordingMessageVM,
  {
    id: '10',
    type: 'text',
    content:
      "Hi Mr. Chen! Just a quick reminder that Sarah's quiz is on Thursday. Please make sure she reviews chapters 6 and 7.",
    sender: MOCK_EDUCATOR,
    createdAt: hoursAgo(26),
    reactions: [{ emoji: '✅', count: 1, sampleUserIds: [MOCK_GUARDIAN.id] }],
    visibility: { type: 'all' },
  } as TextMessageVM,
  {
    id: '11',
    type: 'text',
    content:
      "Thanks for the heads-up! We'll review those chapters tonight. Appreciate it.",
    sender: MOCK_GUARDIAN,
    createdAt: hoursAgo(25.5),
    reactions: [],
    visibility: { type: 'all' },
  } as TextMessageVM,
  {
    id: '12',
    type: 'progress-update',
    content: 'Sarah reached her reading goal for the week.',
    sender: MOCK_EDUCATOR,
    createdAt: hoursAgo(12),
    reactions: [{ emoji: '👏', count: 1, sampleUserIds: [MOCK_GUARDIAN.id] }],
    visibility: { type: 'all' },
    progress: {
      subject: 'Reading',
      metric: 'Weekly Goal',
      previousValue: 2,
      currentValue: 4,
      targetValue: 4,
      improvement: 100,
      summary: 'Sarah completed all assigned readings this week.',
    },
  } as ProgressUpdateMessageVM,
  {
    id: '13',
    type: 'link-preview',
    content: 'Optional enrichment: math games for fractions.',
    sender: MOCK_EDUCATOR,
    createdAt: hoursAgo(10),
    reactions: [],
    visibility: { type: 'all' },
    link: {
      url: 'https://www.mathsisfun.com/fractions.html',
      title: 'Fractions - Maths is Fun',
      description: 'Interactive lessons and games for understanding fractions.',
      imageUrl: '/placeholder.svg?height=400&width=800',
      siteName: 'Maths is Fun',
      favicon: '/placeholder.svg?height=16&width=16',
    },
  } as LinkPreviewMessageVM,
  {
    id: '14',
    type: 'lesson-assignment',
    content: 'New practice worksheet assigned for Friday.',
    sender: MOCK_EDUCATOR,
    createdAt: hoursAgo(6),
    reactions: [{ emoji: '📝', count: 1, sampleUserIds: [MOCK_GUARDIAN.id] }],
    visibility: { type: 'all' },
    assignment: {
      title: 'Multiplication Fluency',
      description: 'Complete the 25-question worksheet and submit a photo.',
      dueAt: hoursFromNow(48),
      subject: 'Mathematics',
      estimatedDuration: 20,
      difficulty: 'beginner',
    },
  } as LessonAssignmentMessageVM,
  {
    id: '15',
    type: 'session-booking',
    content: 'Scheduling a short check-in call next week.',
    sender: MOCK_GUARDIAN,
    createdAt: hoursAgo(3),
    reactions: [],
    visibility: { type: 'all' },
    session: {
      title: 'Check-in: Progress Review',
      subject: 'General',
      startAt: hoursFromNow(96),
      durationMinutes: 15,
      meetingLink: 'https://meet.google.com/check-in-123',
      status: 'scheduled',
      topics: ['Math progress', 'Homework routines'],
    },
  } as SessionBookingMessageVM,
  {
    id: '16',
    type: 'homework-submission',
    content: 'Attached the completed worksheet.',
    sender: MOCK_GUARDIAN,
    createdAt: hoursAgo(1),
    reactions: [],
    visibility: { type: 'all' },
    homework: {
      assignmentTitle: 'Multiplication Fluency',
      submittedAt: hoursAgo(1),
      attachments: [
        {
          type: 'file',
          url: '/worksheet.pdf',
          name: 'multiplication_worksheet.pdf',
          size: 198000,
        },
      ],
      status: 'submitted',
    },
  } as HomeworkSubmissionMessageVM,
];

export const LEARNING_SPACE: ChannelVM = {
  id: LEARNING_SPACE_ID,
  orgId: 'org-1',
  kind: 'channel',
  topic: `ELA • ${MOCK_EDUCATOR.displayName}'s Class`,
  topicIconKey: 'sparkles',
  description:
    'We live, we love, we grow together. Everything will be good if we stay together.',
  visibility: 'private',
  purpose: 'learning-space',
  status: 'active',
  createdBy: MOCK_EDUCATOR.id,
  createdAt: hoursAgo(24),
  archivedAt: null,
  postingPolicy: {
    kind: 'members-only',
    allowThreads: true,
    allowReactions: true,
  },
  defaultRightPanelOpen: true,
  defaultRightPanelKey: 'channel_info',
  readState: LEARNING_SPACE_READ_STATE,
  headerItems: [
    { key: 'saved', label: '0', tooltip: 'View saved messages' },
    { key: 'next-session', label: 'Wed 4:30 PM' },
  ],
  participants: [MOCK_EDUCATOR, MOCK_GUARDIAN, ...MOCK_CHILDREN],
  messages: {
    items: MOCK_MESSAGES,
    total: MOCK_MESSAGES.length,
  },
};
