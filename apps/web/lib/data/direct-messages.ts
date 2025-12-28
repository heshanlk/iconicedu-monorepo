import type {
  Message,
  TextMessage,
  ImageMessage,
  FileMessage,
  LinkPreviewMessage,
} from '@iconicedu/shared-types';
import { MOCK_PARENT, MOCK_TEACHER, MOCK_TEACHER_2 } from './people';

export const DIRECT_USER = {
  id: MOCK_PARENT.accountId,
  name: MOCK_PARENT.displayName,
  avatar: MOCK_PARENT.avatar.url ?? '',
};
export const DIRECT_CONTACT = {
  id: MOCK_TEACHER.accountId,
  name: MOCK_TEACHER.displayName,
  avatar: MOCK_TEACHER.avatar.url ?? '',
};
export const DIRECT_ALT_CONTACT = {
  id: MOCK_TEACHER_2.accountId,
  name: MOCK_TEACHER_2.displayName,
  avatar: MOCK_TEACHER_2.avatar.url ?? '',
};

export const DIRECT_LAST_READ_MESSAGE_ID = 'dm-6';

export const DIRECT_MESSAGES: Message[] = [
  {
    id: 'dm-1',
    type: 'text',
    content: 'Hey! Are we still on for the session this afternoon?',
    sender: DIRECT_USER,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    reactions: [],
    visibility: { type: 'sender-only' },
    isRead: true,
  } as TextMessage,
  {
    id: 'dm-2',
    type: 'text',
    content: 'Yes — 4:30 PM works great. I will share the Zoom link soon.',
    sender: DIRECT_CONTACT,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.5),
    reactions: [
      { emoji: '✅', count: 1, users: [MOCK_PARENT.accountId] },
    ],
    visibility: { type: 'all' },
    isRead: true,
  } as TextMessage,
  {
    id: 'dm-3',
    type: 'image',
    content: 'Here is the worksheet photo from today.',
    sender: DIRECT_USER,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
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
  } as ImageMessage,
  {
    id: 'dm-4',
    type: 'file',
    content: 'Sharing the notes PDF before class.',
    sender: DIRECT_CONTACT,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
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
  } as FileMessage,
  {
    id: 'dm-5',
    type: 'link-preview',
    content: "Here is a quick reference for today's topic.",
    sender: DIRECT_ALT_CONTACT,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
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
  } as LinkPreviewMessage,
  {
    id: 'dm-6',
    type: 'text',
    content: "Got it -- thanks! I'll join a few minutes early.",
    sender: DIRECT_USER,
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    reactions: [
      { emoji: '👍', count: 1, users: [MOCK_TEACHER.accountId] },
    ],
    visibility: { type: 'all' },
    isRead: false,
  } as TextMessage,
];

export const DIRECT_THREAD_MESSAGES: Record<string, Message[]> = {};
