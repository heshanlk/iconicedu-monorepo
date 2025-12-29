import type {
  ChannelVM,
  MessageReadStateVM,
  MessageVM,
  TextMessageVM,
  ImageMessageVM,
  FileMessageVM,
  AudioRecordingMessageVM,
  ThreadVM,
} from '@iconicedu/shared-types';
import { MOCK_GUARDIAN, MOCK_EDUCATOR } from './people';

export const DIRECT_GUARDIAN = MOCK_GUARDIAN;
export const DIRECT_EDUCATOR = MOCK_EDUCATOR;

const hoursAgo = (hours: number) =>
  new Date(Date.now() - 1000 * 60 * 60 * hours).toISOString();
const minutesAgo = (minutes: number) =>
  new Date(Date.now() - 1000 * 60 * minutes).toISOString();

export const DIRECT_READ_STATE: MessageReadStateVM = {
  lastReadMessageId: 'dm-7',
  lastReadAt: minutesAgo(12),
  unreadCount: 3,
};

const DIRECT_THREAD_ONE: ThreadVM = {
  id: 'dm-thread-1',
  parentMessageId: 'dm-2',
  parentMessageSnippet:
    "Good morning, Ms. Williams! Yes, I've been wanting to talk about her recent test results. Is everything okay?",
  parentMessageAuthorId: DIRECT_GUARDIAN.id,
  parentMessageAuthorName: DIRECT_GUARDIAN.displayName,
  messageCount: 3,
  lastReplyAt: hoursAgo(2),
  participants: [DIRECT_EDUCATOR, DIRECT_GUARDIAN],
  readState: {
    lastReadMessageId: 'dm-t1-2',
    unreadCount: 1,
  },
};

const DIRECT_THREAD_TWO: ThreadVM = {
  id: 'dm-thread-2',
  parentMessageId: 'dm-7',
  parentMessageSnippet:
    'Can you share the updated reading plan for this week? Sarah wants to get a head start.',
  parentMessageAuthorId: DIRECT_GUARDIAN.id,
  parentMessageAuthorName: DIRECT_GUARDIAN.displayName,
  messageCount: 4,
  lastReplyAt: minutesAgo(30),
  participants: [DIRECT_EDUCATOR, DIRECT_GUARDIAN],
  readState: {
    lastReadMessageId: 'dm-t2-2',
    unreadCount: 2,
  },
};

export const DIRECT_MESSAGES: MessageVM[] = [
  {
    id: 'dm-1',
    type: 'text',
    content: 'Hey! Are we still on for the session this afternoon?',
    sender: DIRECT_EDUCATOR,
    createdAt: hoursAgo(7),
    reactions: [{ emoji: '👋', count: 1, sampleUserIds: [DIRECT_GUARDIAN.id] }],
    visibility: { type: 'all' },
    isSaved: true,
  } as TextMessageVM,
  {
    id: 'dm-2',
    type: 'text',
    content:
      "Good morning, Ms. Williams! Yes, I've been wanting to talk about her recent test results. Is everything okay?",
    sender: DIRECT_GUARDIAN,
    createdAt: hoursAgo(6.5),
    reactions: [],
    visibility: { type: 'all' },
    thread: DIRECT_THREAD_ONE,
  } as TextMessageVM,
  {
    id: 'dm-3',
    type: 'text',
    content:
      'Everything is going well overall! Sarah is a bright child. I just wanted to go over some areas where we can help her improve even more.',
    sender: DIRECT_EDUCATOR,
    createdAt: hoursAgo(5.5),
    reactions: [{ emoji: '👍', count: 1, sampleUserIds: [DIRECT_GUARDIAN.id] }],
    visibility: { type: 'all' },
    thread: DIRECT_THREAD_ONE,
  } as TextMessageVM,
  {
    id: 'dm-4',
    type: 'text',
    content:
      "That sounds great! I appreciate you taking the time to help Sarah succeed.",
    sender: DIRECT_GUARDIAN,
    createdAt: hoursAgo(2),
    reactions: [],
    visibility: { type: 'all' },
    thread: DIRECT_THREAD_ONE,
  } as TextMessageVM,
  {
    id: 'dm-5',
    type: 'image',
    content: 'Here is the worksheet photo from today.',
    sender: DIRECT_GUARDIAN,
    createdAt: hoursAgo(3),
    reactions: [],
    visibility: { type: 'all' },
    attachment: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=800&q=80',
      name: 'worksheet.jpg',
      width: 800,
      height: 600,
    },
  } as ImageMessageVM,
  {
    id: 'dm-6',
    type: 'file',
    content: 'Sharing the updated notes PDF before class.',
    sender: DIRECT_EDUCATOR,
    createdAt: hoursAgo(1.5),
    reactions: [],
    visibility: { type: 'all' },
    attachment: {
      type: 'file',
      url: '/documents/lesson-notes.pdf',
      name: 'lesson-notes.pdf',
      size: 320000,
      mimeType: 'application/pdf',
    },
  } as FileMessageVM,
  {
    id: 'dm-7',
    type: 'text',
    content:
      'Can you share the updated reading plan for this week? Sarah wants to get a head start.',
    sender: DIRECT_GUARDIAN,
    createdAt: minutesAgo(55),
    reactions: [],
    visibility: { type: 'all' },
    thread: DIRECT_THREAD_TWO,
  } as TextMessageVM,
  {
    id: 'dm-8',
    type: 'text',
    content:
      "Absolutely. I'll send the plan and a short checklist for daily practice.",
    sender: DIRECT_EDUCATOR,
    createdAt: minutesAgo(45),
    reactions: [{ emoji: '✅', count: 1, sampleUserIds: [DIRECT_GUARDIAN.id] }],
    visibility: { type: 'all' },
    thread: DIRECT_THREAD_TWO,
  } as TextMessageVM,
  {
    id: 'dm-9',
    type: 'text',
    content:
      'Thank you! Also, should we review any specific vocabulary lists this week?',
    sender: DIRECT_GUARDIAN,
    createdAt: minutesAgo(35),
    reactions: [],
    visibility: { type: 'all' },
    thread: DIRECT_THREAD_TWO,
  } as TextMessageVM,
  {
    id: 'dm-10',
    type: 'text',
    content:
      'Yes—chapters 6–7. I can add a quick quizlet link in the plan.',
    sender: DIRECT_EDUCATOR,
    createdAt: minutesAgo(30),
    reactions: [{ emoji: '🙏', count: 1, sampleUserIds: [DIRECT_GUARDIAN.id] }],
    visibility: { type: 'all' },
    thread: DIRECT_THREAD_TWO,
  } as TextMessageVM,
  {
    id: 'dm-11',
    type: 'audio-recording',
    content: "Quick voice note about Sarah's science project",
    sender: DIRECT_EDUCATOR,
    createdAt: minutesAgo(10),
    reactions: [],
    visibility: { type: 'all' },
    audio: {
      url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
      durationSeconds: 45,
      waveform: [
        20, 35, 45, 60, 55, 40, 50, 65, 70, 55, 45, 60, 50, 40, 35, 45, 55, 60, 50,
        40, 30, 45, 55, 50, 45,
      ],
      fileSize: 128000,
      mimeType: 'audio/wav',
    },
  } as AudioRecordingMessageVM,
];

export const DIRECT_CHANNEL: ChannelVM = {
  id: 'direct-channel-1',
  orgId: 'org-1',
  kind: 'dm',
  topic: `${DIRECT_EDUCATOR.displayName} & ${DIRECT_GUARDIAN.displayName}`,
  topicIconKey: 'user',
  description: 'Direct messages between guardian and educator.',
  visibility: 'private',
  purpose: 'general',
  status: 'active',
  createdBy: DIRECT_EDUCATOR.id,
  createdAt: hoursAgo(48),
  archivedAt: null,
  postingPolicy: {
    kind: 'members-only',
    allowThreads: true,
    allowReactions: true,
  },
  headerItems: [
    { key: 'saved', label: '0', tooltip: 'View saved messages', isPrimary: true },
    { key: 'last-seen', label: 'Last seen 15m' },
  ],
  participants: [DIRECT_EDUCATOR, DIRECT_GUARDIAN],
  messages: {
    items: DIRECT_MESSAGES,
    total: DIRECT_MESSAGES.length,
  },
};
