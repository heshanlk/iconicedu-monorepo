import type {
  EducatorProfileVM,
  GuardianProfileVM,
  GradeLevelOption,
  MessageVM,
  TextMessageVM,
  LessonAssignmentMessageVM,
  ProgressUpdateMessageVM,
  SessionBookingMessageVM,
  HomeworkSubmissionMessageVM,
  LinkPreviewMessageVM,
  AudioRecordingMessageVM,
} from '@iconicedu/shared-types';

const MOCK_ORG_ID = '4fca0d16-5d72-4a24-9a0d-6f8c0bf2b652';
const makeGradeLevel = (label: string, id: string | number): GradeLevelOption => ({
  id,
  label,
});

export const MOCK_EDUCATOR: EducatorProfileVM & {
  role: 'Educator';
  email: string;
  phone: string;
  school: string;
  grade: string;
  childName: string;
} = {
  orgId: MOCK_ORG_ID,
  id: 'educator-1',
  accountId: 'educator-1',
  displayName: 'Ms. Jennifer Williams',
  firstName: 'Jennifer',
  lastName: 'Williams',
  avatar: {
    source: 'upload',
    url: '/professional-woman-avatar.png',
    seed: 'educator-1',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  status: 'active',
  createdAt: '2020-09-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  headline: 'Helping 4th graders love math.',
  subjects: ['Mathematics'],
  gradesSupported: [makeGradeLevel('Grade 4', 4)],
  experienceYears: 8,
  certifications: [
    { name: 'Elementary Education Certification', issuer: 'State Board', year: 2016 },
  ],
  joinedDate: '2020-09-01T00:00:00.000Z',
  role: 'Educator',
  email: 'j.williams@school.edu',
  phone: '(555) 123-4567',
  school: 'Riverside Elementary School',
  grade: '4th Grade',
  childName: 'Sarah Chen',
};

export const MOCK_GUARDIAN: GuardianProfileVM & {
  role: 'Guardian';
  email: string;
  phone: string;
  school: string;
  grade: string;
  childName: string;
} = {
  orgId: MOCK_ORG_ID,
  id: 'guardian-1',
  accountId: 'guardian-1',
  displayName: 'Michael Chen',
  firstName: 'Michael',
  lastName: 'Chen',
  avatar: {
    source: 'upload',
    url: '/professional-man-avatar.png',
    seed: 'guardian-1',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  status: 'active',
  createdAt: '2021-09-15T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  children: { items: [], total: 0 },
  joinedDate: '2021-09-15T00:00:00.000Z',
  role: 'Guardian',
  email: 'michael.chen@email.com',
  phone: '(555) 987-6543',
  school: 'Riverside Elementary School',
  grade: '4th Grade',
  childName: 'Sarah Chen',
};

export const LAST_READ_MESSAGE_ID = '4';

const hoursAgo = (hours: number) =>
  new Date(Date.now() - 3600000 * hours).toISOString();
const minutesAgo = (minutes: number) =>
  new Date(Date.now() - 60000 * minutes).toISOString();
const hoursFromNow = (hours: number) =>
  new Date(Date.now() + 3600000 * hours).toISOString();

export const MOCK_MESSAGES: MessageVM[] = [
  {
    id: '1',
    type: 'text',
    content:
      "Good morning! Thank you for scheduling this guardian-educator conference. I wanted to discuss Sarah's progress in math this semester.",
    sender: MOCK_EDUCATOR,
    timestamp: hoursAgo(24),
    reactions: [{ emoji: '👋', count: 1, users: ['guardian-1'] }],
    visibility: { type: 'all' },
    isRead: true,
    isSaved: true,
  } as TextMessageVM,
  {
    id: '2',
    type: 'text',
    content:
      "Good morning, Ms. Williams! Yes, I've been wanting to talk about her recent test results. Is everything okay?",
    sender: MOCK_GUARDIAN,
    timestamp: hoursAgo(23.5),
    reactions: [],
    visibility: { type: 'all' },
    isRead: true,
    thread: {
      id: 'thread-1',
      messageCount: 3,
      lastReply: hoursAgo(2),
      participants: [MOCK_EDUCATOR, MOCK_GUARDIAN],
      unreadCount: 1,
    },
  } as TextMessageVM,
  {
    id: '3',
    type: 'lesson-assignment',
    content:
      "Here's the homework assignment for next week. Sarah will need to complete these problems for Monday.",
    sender: MOCK_EDUCATOR,
    timestamp: hoursAgo(20),
    reactions: [{ emoji: '📚', count: 1, users: ['guardian-1'] }],
    visibility: { type: 'all' },
    isRead: true,
    isSaved: true,
    assignment: {
      title: 'Fractions and Decimals Practice',
      description:
        'Complete problems 1-20 in the workbook. Focus on converting fractions to decimals and vice versa.',
      dueDate: hoursFromNow(96),
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
    timestamp: hoursAgo(18),
    reactions: [{ emoji: '✅', count: 1, users: ['guardian-1'] }],
    visibility: { type: 'all' },
    isRead: true,
    isSaved: true,
    session: {
      title: "Guardian-Educator Conference: Sarah's Progress",
      subject: 'General Academic Review',
      startTime: hoursFromNow(72),
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
    timestamp: hoursAgo(4),
    reactions: [],
    visibility: { type: 'all' },
    isRead: false,
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
    timestamp: hoursAgo(2),
    reactions: [
      { emoji: '🎉', count: 1, users: ['guardian-1'] },
      { emoji: '💪', count: 1, users: ['guardian-1'] },
    ],
    visibility: { type: 'all' },
    isRead: false,
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
    timestamp: minutesAgo(5),
    reactions: [{ emoji: '🙏', count: 1, users: ['educator-1'] }],
    visibility: { type: 'all' },
    isRead: false,
  } as TextMessageVM,
  {
    id: '8',
    type: 'link-preview',
    content: 'I found this helpful resource for practicing fractions at home!',
    sender: MOCK_GUARDIAN,
    timestamp: minutesAgo(1),
    reactions: [],
    visibility: { type: 'all' },
    isRead: false,
    isSaved: true,
    link: {
      url: 'https://www.khanacademy.org/math/arithmetic/fractions',
      title: 'Fractions | Arithmetic | Khan Academy',
      description:
        'Learn about fractions with step-by-step lessons, practice problems, and video explanations.',
      imageUrl: '/placeholder.svg?height=400&width=800',
      siteName: 'Khan Academy',
      favicon: '/placeholder.svg?height=16&width=16',
    },
  } as LinkPreviewMessageVM,
  {
    id: '9',
    type: 'audio-recording',
    content: "Quick voice note about Sarah's science project",
    sender: MOCK_EDUCATOR,
    timestamp: minutesAgo(0.5),
    reactions: [],
    visibility: { type: 'all' },
    isRead: false,
    audioUrl:
      'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
    duration: '00:45',
    audio: {
      url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
      duration: 45,
      waveform: [
        20, 35, 45, 60, 55, 40, 50, 65, 70, 55, 45, 60, 50, 40, 35, 45, 55, 60, 50, 40,
        30, 45, 55, 50, 45,
      ],
      fileSize: 128000,
      mimeType: 'audio/wav',
    },
  } as AudioRecordingMessageVM,
];

export const MOCK_THREAD_MESSAGES: Record<string, MessageVM[]> = {
  'thread-1': [
    {
      id: 't1-1',
      type: 'text',
      content:
        "Good morning, Ms. Williams! Yes, I've been wanting to talk about her recent test results. Is everything okay?",
      sender: MOCK_GUARDIAN,
      timestamp: hoursAgo(23.5),
      reactions: [],
      visibility: { type: 'all' },
      isRead: true,
    },
    {
      id: 't1-2',
      type: 'text',
      content:
        'Everything is going well overall! Sarah is a bright child. I just wanted to go over some areas where we can help her improve even more.',
      sender: MOCK_EDUCATOR,
      timestamp: hoursAgo(23),
      reactions: [{ emoji: '👍', count: 1, users: ['guardian-1'] }],
      visibility: { type: 'all' },
      isRead: true,
    },
    {
      id: 't1-3',
      type: 'text',
      content:
        'That sounds great! I appreciate you taking the time to help Sarah succeed.',
      sender: MOCK_GUARDIAN,
      timestamp: hoursAgo(2),
      reactions: [],
      visibility: { type: 'all' },
      isRead: false,
    },
  ] as TextMessageVM[],
};
