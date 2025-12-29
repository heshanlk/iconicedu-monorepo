import type {
  ChannelVM,
  MessageVM,
  TextMessageVM,
  ImageMessageVM,
  FileMessageVM,
  LinkPreviewMessageVM,
} from '@iconicedu/shared-types';
import { MOCK_GUARDIAN, MOCK_EDUCATOR, MOCK_EDUCATOR_2 } from './people';

export const DIRECT_GUARDIAN = MOCK_GUARDIAN;
export const DIRECT_EDUCATOR = MOCK_EDUCATOR;
export const DIRECT_ALT_EDUCATOR = MOCK_EDUCATOR_2;

export const DIRECT_LAST_READ_MESSAGE_ID = 'dm-6';

const hoursAgo = (hours: number) =>
  new Date(Date.now() - 1000 * 60 * 60 * hours).toISOString();
const minutesAgo = (minutes: number) =>
  new Date(Date.now() - 1000 * 60 * minutes).toISOString();

export const DIRECT_MESSAGES: MessageVM[] = [
  {
    id: 'dm-1',
    type: 'text',
    content: 'Hey! Are we still on for the session this afternoon?',
    sender: DIRECT_GUARDIAN,
    timestamp: hoursAgo(5),
    reactions: [],
    visibility: { type: 'sender-only' },
    isRead: true,
  } as TextMessageVM,
  {
    id: 'dm-2',
    type: 'text',
    content: 'Yes — 4:30 PM works great. I will share the Zoom link soon.',
    sender: DIRECT_EDUCATOR,
    timestamp: hoursAgo(4.5),
    reactions: [{ emoji: '✅', count: 1, users: [MOCK_GUARDIAN.id] }],
    visibility: { type: 'all' },
    isRead: true,
  } as TextMessageVM,
  {
    id: 'dm-3',
    type: 'image',
    content: 'Here is the worksheet photo from today.',
    sender: DIRECT_GUARDIAN,
    timestamp: hoursAgo(3),
    reactions: [],
    visibility: { type: 'all' },
    isRead: true,
    attachment: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=800&q=80',
      name: 'worksheet.jpg',
      width: 800,
      height: 600,
    },
  } as ImageMessageVM,
  {
    id: 'dm-4',
    type: 'file',
    content: 'Sharing the notes PDF before class.',
    sender: DIRECT_EDUCATOR,
    timestamp: hoursAgo(2),
    reactions: [],
    visibility: { type: 'all' },
    isRead: true,
    attachment: {
      type: 'file',
      url: '/documents/lesson-notes.pdf',
      name: 'lesson-notes.pdf',
      size: 320000,
      mimeType: 'application/pdf',
    },
  } as FileMessageVM,
  {
    id: 'dm-5',
    type: 'link-preview',
    content: "Here is a quick reference for today's topic.",
    sender: DIRECT_ALT_EDUCATOR,
    timestamp: hoursAgo(1.5),
    reactions: [],
    visibility: { type: 'all' },
    isRead: false,
    link: {
      url: 'https://www.khanacademy.org/math/algebra',
      title: 'Algebra | Khan Academy',
      description: 'Lessons, videos, and practice for algebra topics.',
      imageUrl: 'https://picsum.photos/seed/algebra/400/800',
      siteName: 'Khan Academy',
      favicon: 'https://picsum.photos/seed/favicon/16/16',
    },
  } as LinkPreviewMessageVM,
  {
    id: 'dm-6',
    type: 'text',
    content: "Got it -- thanks! I'll join a few minutes early.",
    sender: DIRECT_GUARDIAN,
    timestamp: minutesAgo(15),
    reactions: [{ emoji: '👍', count: 1, users: [MOCK_EDUCATOR.id] }],
    visibility: { type: 'all' },
    isRead: false,
  } as TextMessageVM,
];

export const DIRECT_THREAD_MESSAGES: Record<string, MessageVM[]> = {};

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
