import type {
  Message,
  TextMessage,
  LessonAssignmentMessage,
  ProgressUpdateMessage,
  SessionBookingMessage,
  HomeworkSubmissionMessage,
  LinkPreviewMessage,
  AudioRecordingMessage, // Added audio recording import
} from '@iconicedu/shared-types';

export const MOCK_TEACHER = {
  id: 'teacher-1',
  name: 'Ms. Jennifer Williams',
  avatar: '/professional-woman-avatar.png',
  isOnline: true,
  status: '4th Grade Math Teacher',
  role: 'Teacher' as const,
  email: 'j.williams@school.edu',
  phone: '(555) 123-4567',
  school: 'Riverside Elementary School',
  grade: '4th Grade',
  studentName: 'Sarah Chen',
  joinedDate: new Date(2020, 8, 1),
};

export const MOCK_PARENT = {
  id: 'parent-1',
  name: 'Michael Chen',
  avatar: '/professional-man-avatar.png',
  isOnline: true,
  status: 'Parent of Sarah Chen',
  role: 'Parent' as const,
  email: 'michael.chen@email.com',
  phone: '(555) 987-6543',
  school: 'Riverside Elementary School',
  grade: '4th Grade',
  studentName: 'Sarah Chen',
  joinedDate: new Date(2021, 8, 15),
};

export const LAST_READ_MESSAGE_ID = '4';

export const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    type: 'text',
    content:
      "Good morning! Thank you for scheduling this parent-teacher conference. I wanted to discuss Sarah's progress in math this semester.",
    sender: MOCK_TEACHER,
    timestamp: new Date(Date.now() - 3600000 * 24),
    reactions: [{ emoji: '👋', count: 1, users: ['parent-1'] }],
    visibility: { type: 'all' },
    isRead: true,
    isSaved: true,
  } as TextMessage,
  {
    id: '2',
    type: 'text',
    content:
      "Good morning, Ms. Williams! Yes, I've been wanting to talk about her recent test results. Is everything okay?",
    sender: MOCK_PARENT,
    timestamp: new Date(Date.now() - 3600000 * 23.5),
    reactions: [],
    visibility: { type: 'all' },
    isRead: true,
    thread: {
      id: 'thread-1',
      messageCount: 3,
      lastReply: new Date(Date.now() - 3600000 * 2),
      participants: [MOCK_TEACHER, MOCK_PARENT],
      unreadCount: 1,
    },
  } as TextMessage,
  {
    id: '3',
    type: 'lesson-assignment',
    content:
      "Here's the homework assignment for next week. Sarah will need to complete these problems for Monday.",
    sender: MOCK_TEACHER,
    timestamp: new Date(Date.now() - 3600000 * 20),
    reactions: [{ emoji: '📚', count: 1, users: ['parent-1'] }],
    visibility: { type: 'all' },
    isRead: true,
    isSaved: true,
    assignment: {
      title: 'Fractions and Decimals Practice',
      description:
        'Complete problems 1-20 in the workbook. Focus on converting fractions to decimals and vice versa.',
      dueDate: new Date(Date.now() + 3600000 * 96),
      subject: 'Mathematics',
      estimatedDuration: 30,
      difficulty: 'intermediate',
    },
  } as LessonAssignmentMessage,
  {
    id: '4',
    type: 'session-booking',
    content:
      "I've scheduled our next parent-teacher meeting to discuss Sarah's semester progress.",
    sender: MOCK_TEACHER,
    timestamp: new Date(Date.now() - 3600000 * 18),
    reactions: [{ emoji: '✅', count: 1, users: ['parent-1'] }],
    visibility: { type: 'all' },
    isRead: true,
    isSaved: true,
    session: {
      title: "Parent-Teacher Conference: Sarah's Progress",
      subject: 'General Academic Review',
      startTime: new Date(Date.now() + 3600000 * 72),
      duration: 30,
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      status: 'confirmed',
      topics: ['Math Progress', 'Reading Comprehension', 'Social Development'],
    },
  } as SessionBookingMessage,
  {
    id: '5',
    type: 'homework-submission',
    content:
      'Sarah completed her homework assignment last night. I helped her review the problems she found challenging.',
    sender: MOCK_PARENT,
    timestamp: new Date(Date.now() - 3600000 * 4),
    reactions: [],
    visibility: { type: 'all' },
    isRead: false,
    homework: {
      assignmentTitle: 'Fractions and Decimals Practice',
      submittedAt: new Date(Date.now() - 3600000 * 4),
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
  } as HomeworkSubmissionMessage,
  {
    id: '6',
    type: 'progress-update',
    content:
      'Great news! Sarah has shown significant improvement in her math skills this month!',
    sender: MOCK_TEACHER,
    timestamp: new Date(Date.now() - 3600000 * 2),
    reactions: [
      { emoji: '🎉', count: 1, users: ['parent-1'] },
      { emoji: '💪', count: 1, users: ['parent-1'] },
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
  } as ProgressUpdateMessage,
  {
    id: '7',
    type: 'text',
    content:
      "That's wonderful to hear! We've been working on math together at home. Thank you for your support and guidance.",
    sender: MOCK_PARENT,
    timestamp: new Date(Date.now() - 300000),
    reactions: [{ emoji: '🙏', count: 1, users: ['teacher-1'] }],
    visibility: { type: 'all' },
    isRead: false,
  } as TextMessage,
  {
    id: '8',
    type: 'link-preview',
    content: 'I found this helpful resource for practicing fractions at home!',
    sender: MOCK_PARENT,
    timestamp: new Date(Date.now() - 60000),
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
  } as LinkPreviewMessage,
  {
    id: '9',
    type: 'audio-recording',
    content: "Quick voice note about Sarah's science project",
    sender: MOCK_TEACHER,
    timestamp: new Date(Date.now() - 30000),
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
  } as AudioRecordingMessage,
];

export const MOCK_THREAD_MESSAGES: Record<string, Message[]> = {
  'thread-1': [
    {
      id: 't1-1',
      type: 'text',
      content:
        "Good morning, Ms. Williams! Yes, I've been wanting to talk about her recent test results. Is everything okay?",
      sender: MOCK_PARENT,
      timestamp: new Date(Date.now() - 3600000 * 23.5),
      reactions: [],
      visibility: { type: 'all' },
      isRead: true,
    },
    {
      id: 't1-2',
      type: 'text',
      content:
        'Everything is going well overall! Sarah is a bright student. I just wanted to go over some areas where we can help her improve even more.',
      sender: MOCK_TEACHER,
      timestamp: new Date(Date.now() - 3600000 * 23),
      reactions: [{ emoji: '👍', count: 1, users: ['parent-1'] }],
      visibility: { type: 'all' },
      isRead: true,
    },
    {
      id: 't1-3',
      type: 'text',
      content:
        'That sounds great! I appreciate you taking the time to help Sarah succeed.',
      sender: MOCK_PARENT,
      timestamp: new Date(Date.now() - 3600000 * 2),
      reactions: [],
      visibility: { type: 'all' },
      isRead: false,
    },
  ] as TextMessage[],
};
