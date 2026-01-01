import type {
  ConnectionVM,
  MessageVM,
  TextMessageVM,
  ThreadVM,
} from '@iconicedu/shared-types';
import { MESSAGE_IDS, THREAD_IDS } from './ids';
import {
  CHILD_AVA,
  CHILD_MAYA,
  CHILD_MILO,
  EDUCATOR_ELENA,
  EDUCATOR_KAI,
  EDUCATOR_LEO,
  EDUCATOR_PRIYA,
  EDUCATOR_SOFIA,
  GUARDIAN_MORGAN,
  STAFF_SUPPORT,
} from './profiles';

const MATH_THREAD: ThreadVM = {
  id: THREAD_IDS.math,
  parent: {
    messageId: MESSAGE_IDS.math1,
    snippet: 'Focus on fractions and word problems this week.',
    authorId: EDUCATOR_KAI.ids.id,
    authorName: EDUCATOR_KAI.profile.displayName,
  },
  stats: {
    messageCount: 3,
    lastReplyAt: '2026-02-09T22:20:00.000Z',
  },
  participants: [EDUCATOR_KAI, GUARDIAN_MORGAN],
  readState: {
    threadId: THREAD_IDS.math,
    lastReadMessageId: MESSAGE_IDS.math2,
    unreadCount: 1,
  },
};

const MATH_PARENT_MESSAGE: TextMessageVM = {
  ids: { id: MESSAGE_IDS.math1 },
  core: {
    type: 'text',
    sender: EDUCATOR_KAI,
    createdAt: '2026-02-09T21:05:00.000Z',
    visibility: { type: 'all' },
  },
  social: {
    reactions: [
      {
        emoji: '👍',
        count: 1,
        reactedByMe: true,
        sampleUserIds: [GUARDIAN_MORGAN.ids.id],
      },
    ],
    thread: MATH_THREAD,
  },
  state: {
    isSaved: true,
  },
  content: { text: 'Focus on fractions and word problems this week.' },
};

const MATH_THREAD_REPLY_ONE: TextMessageVM = {
  ids: { id: MESSAGE_IDS.math2 },
  core: {
    type: 'text',
    sender: GUARDIAN_MORGAN,
    createdAt: '2026-02-09T21:40:00.000Z',
    visibility: { type: 'all' },
  },
  social: {
    reactions: [],
    thread: MATH_THREAD,
  },
  state: {
    isSaved: false,
  },
  content: { text: 'Great, we will review word problems tonight.' },
};

const MATH_THREAD_REPLY_TWO: TextMessageVM = {
  ids: { id: MESSAGE_IDS.math3 },
  core: {
    type: 'text',
    sender: EDUCATOR_KAI,
    createdAt: '2026-02-09T22:20:00.000Z',
    visibility: { type: 'all' },
  },
  social: {
    reactions: [],
    thread: MATH_THREAD,
  },
  state: {
    isSaved: false,
  },
  content: { text: 'Perfect. I shared a practice pack in today’s assignment.' },
};

const MATH_MESSAGES: MessageVM[] = [
  MATH_PARENT_MESSAGE,
  MATH_THREAD_REPLY_ONE,
  MATH_THREAD_REPLY_TWO,
  {
    ids: { id: MESSAGE_IDS.math4 },
    core: {
      type: 'lesson-assignment',
      sender: EDUCATOR_KAI,
      createdAt: '2026-02-09T21:45:00.000Z',
      visibility: { type: 'all' },
    },
    social: {
      reactions: [],
    },
    state: {
      isSaved: true,
    },
    content: { text: 'Practice pack for this week.' },
    assignment: {
      title: 'Fraction Fluency Pack',
      description:
        'Complete pages 1-3 and highlight any word problems that feel tricky.',
      dueAt: '2026-02-13T22:00:00.000Z',
      subject: 'Math',
      attachments: [
        {
          type: 'file',
          url: 'https://files.example.com/math-practice.pdf',
          name: 'practice-pack.pdf',
          size: 512_000,
          mimeType: 'application/pdf',
        },
      ],
      estimatedDuration: 30,
      difficulty: 'intermediate',
    },
  },
  {
    ids: { id: MESSAGE_IDS.math5 },
    core: {
      type: 'homework-submission',
      sender: CHILD_AVA,
      createdAt: '2026-02-09T22:15:00.000Z',
      visibility: { type: 'all' },
    },
    social: {
      reactions: [],
    },
    content: { text: 'Here is my homework!' },
    homework: {
      assignmentTitle: 'Fraction Fluency Pack',
      submittedAt: '2026-02-09T22:15:00.000Z',
      attachments: [
        {
          type: 'file',
          url: 'https://files.example.com/math-homework.pdf',
          name: 'math-homework.pdf',
          size: 345_120,
          mimeType: 'application/pdf',
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
          name: 'math-worksheet.jpg',
          width: 1200,
          height: 900,
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
          name: 'number-line.png',
          width: 1280,
          height: 720,
        },
      ],
      status: 'submitted',
      grade: 'A-',
      feedback: 'Nice work on the word problems.',
    },
  },
  {
    ids: { id: MESSAGE_IDS.math6 },
    core: {
      type: 'session-summary',
      sender: EDUCATOR_KAI,
      createdAt: '2026-02-09T22:45:00.000Z',
      visibility: { type: 'all' },
    },
    social: {
      reactions: [],
    },
    content: { text: 'Great focus today!' },
    session: {
      title: 'Fractions & Word Problems',
      startAt: '2026-02-09T22:00:00.000Z',
      durationMinutes: 45,
      summary: 'Worked through fraction comparison and multi-step word problems.',
      highlights: ['Improved estimation skills', 'Strong verbal reasoning'],
      nextSteps: ['Review fraction to decimal conversions'],
    },
  },
];

const SCIENCE_MESSAGES: MessageVM[] = [
  {
    ids: { id: MESSAGE_IDS.science1 },
    core: {
      type: 'event-reminder',
      sender: EDUCATOR_PRIYA,
      createdAt: '2026-02-08T19:55:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Reminder: Lab session starts soon.' },
    event: {
      title: 'Science Lab: Water Cycle',
      startAt: '2026-02-08T22:00:00.000Z',
      endAt: '2026-02-08T22:45:00.000Z',
      location: 'Zoom',
      meetingLink: 'https://zoom.us/j/98100555112',
      attendees: [EDUCATOR_PRIYA, CHILD_MILO, GUARDIAN_MORGAN],
      status: 'scheduled',
      isAllDay: false,
    },
  },
  {
    ids: { id: MESSAGE_IDS.science2 },
    core: {
      type: 'image',
      sender: CHILD_MILO,
      createdAt: '2026-02-08T20:12:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Here is the setup from our experiment.' },
    attachment: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848c',
      name: 'science-lab.png',
      width: 1280,
      height: 854,
    },
  },
  {
    ids: { id: MESSAGE_IDS.science3 },
    core: {
      type: 'file',
      sender: CHILD_MILO,
      createdAt: '2026-02-08T21:05:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Lab report attached.' },
    attachment: {
      type: 'file',
      url: 'https://files.example.com/experiment-summary.docx',
      name: 'experiment-summary.docx',
      size: 401_210,
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
  },
  {
    ids: { id: MESSAGE_IDS.science4 },
    core: {
      type: 'progress-update',
      sender: EDUCATOR_PRIYA,
      createdAt: '2026-02-08T21:35:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Progress is strong!' },
    progress: {
      subject: 'Science',
      metric: 'Lab Report Rubric',
      previousValue: 72,
      currentValue: 84,
      targetValue: 90,
      improvement: 12,
      summary: 'Improved hypothesis clarity and evidence tracking.',
    },
  },
];

const ELA_THREAD: ThreadVM = {
  id: THREAD_IDS.ela,
  parent: {
    messageId: MESSAGE_IDS.ela4,
    snippet: 'Should we try the narrative prompt next week?',
    authorId: CHILD_MAYA.ids.id,
    authorName: CHILD_MAYA.profile.displayName,
  },
  stats: {
    messageCount: 1,
    lastReplyAt: '2026-02-07T20:05:00.000Z',
  },
  participants: [CHILD_MAYA, EDUCATOR_ELENA],
};

const ELA_MESSAGES: MessageVM[] = [
  {
    ids: { id: MESSAGE_IDS.ela1 },
    core: {
      type: 'design-file-update',
      sender: EDUCATOR_ELENA,
      createdAt: '2026-02-07T18:35:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    attachment: {
      type: 'design-file',
      url: 'https://files.example.com/ela-rubric.fig',
      name: 'writing-rubric.fig',
      tool: 'figma',
      lastModified: '2026-02-07T18:30:00.000Z',
      thumbnail: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
    },
    diff: {
      changesSummary: ['Updated rubric criteria', 'Added narrative focus'],
      previousVersion: 'v2.1',
    },
  },
  {
    ids: { id: MESSAGE_IDS.ela2 },
    core: {
      type: 'link-preview',
      sender: EDUCATOR_ELENA,
      createdAt: '2026-02-07T19:10:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Inspiration for our next discussion.' },
    link: {
      url: 'https://www.poetryfoundation.org/poems/46473/the-road-not-taken',
      title: 'The Road Not Taken',
      description: 'Explore the poem together before class.',
      imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
      siteName: 'Poetry Foundation',
      favicon: 'https://www.poetryfoundation.org/favicon.ico',
    },
  },
  {
    ids: { id: MESSAGE_IDS.ela3 },
    core: {
      type: 'session-booking',
      sender: EDUCATOR_ELENA,
      createdAt: '2026-02-07T19:40:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Session locked in for Friday.' },
    session: {
      title: 'Writing Workshop',
      subject: 'ELA',
      startAt: '2026-02-13T21:00:00.000Z',
      endAt: '2026-02-13T21:50:00.000Z',
      durationMinutes: 50,
      meetingLink: 'https://zoom.us/j/98643123456',
      location: 'Zoom',
      status: 'confirmed',
      topics: ['Narrative voice', 'Revision'],
    },
  },
  {
    ids: { id: MESSAGE_IDS.ela4 },
    core: {
      type: 'feedback-request',
      sender: EDUCATOR_ELENA,
      createdAt: '2026-02-07T20:05:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [], thread: ELA_THREAD },
    content: { text: 'Quick feedback after today’s session.' },
    feedback: {
      prompt: 'How did the workshop feel?',
      sessionTitle: 'ELA Studio • Week 4',
      submittedAt: null,
      rating: null,
      comment: null,
    },
  },
];

const CHESS_MESSAGES: MessageVM[] = [
  {
    ids: { id: MESSAGE_IDS.chess1 },
    core: {
      type: 'session-complete',
      sender: EDUCATOR_LEO,
      createdAt: '2026-02-12T17:05:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Great session today!' },
    session: {
      title: 'Chess Tactics',
      startAt: '2026-02-12T16:15:00.000Z',
      endAt: '2026-02-12T17:00:00.000Z',
      completedAt: '2026-02-12T17:05:00.000Z',
    },
  },
  {
    ids: { id: MESSAGE_IDS.chess2 },
    core: {
      type: 'payment-reminder',
      sender: GUARDIAN_MORGAN,
      createdAt: '2026-02-12T17:20:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Tuition reminder for February.' },
    payment: {
      amount: 120,
      currency: 'USD',
      dueAt: '2026-02-20T23:59:00.000Z',
      status: 'pending',
      invoiceId: 'INV-2049',
      description: 'Chess coaching sessions (February)',
    },
  },
  {
    ids: { id: MESSAGE_IDS.chess3 },
    core: {
      type: 'image',
      sender: EDUCATOR_LEO,
      createdAt: '2026-02-12T18:05:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Position to study before next session.' },
    attachment: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b',
      name: 'chess-board.jpg',
      width: 1200,
      height: 800,
    },
  },
];

const DM_EDU1_MESSAGES: MessageVM[] = [
  {
    ids: { id: MESSAGE_IDS.dmEdu1_1 },
    core: {
      type: 'text',
      sender: GUARDIAN_MORGAN,
      createdAt: '2026-02-06T17:45:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Thanks for the update on Maya’s writing!' },
  },
  {
    ids: { id: MESSAGE_IDS.dmEdu1_2 },
    core: {
      type: 'image',
      sender: EDUCATOR_ELENA,
      createdAt: '2026-02-06T18:05:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Sharing some writing samples.' },
    attachment: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
      name: 'writing-samples.png',
      width: 1200,
      height: 900,
    },
  },
  {
    ids: { id: MESSAGE_IDS.dmEdu1_3 },
    core: {
      type: 'file',
      sender: EDUCATOR_ELENA,
      createdAt: '2026-02-06T18:45:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Feedback attached.' },
    attachment: {
      type: 'file',
      url: 'https://files.example.com/ela-feedback.pdf',
      name: 'feedback.pdf',
      size: 210_000,
      mimeType: 'application/pdf',
    },
  },
];

const DM_EDU2_MESSAGES: MessageVM[] = [
  {
    ids: { id: MESSAGE_IDS.dmEdu2_1 },
    core: {
      type: 'audio-recording',
      sender: EDUCATOR_KAI,
      createdAt: '2026-02-06T18:55:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Voice recap of today’s math session.' },
    audio: {
      url: 'https://files.example.com/math-recap.m4a',
      durationSeconds: 96,
      waveform: [0.12, 0.33, 0.28, 0.45, 0.22, 0.31],
      fileSize: 1_200_000,
      mimeType: 'audio/mp4',
    },
  },
  {
    ids: { id: MESSAGE_IDS.dmEdu2_2 },
    core: {
      type: 'file',
      sender: EDUCATOR_KAI,
      createdAt: '2026-02-06T19:10:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Flashcards for Ava.' },
    attachment: {
      type: 'file',
      url: 'https://files.example.com/math-flashcards.pdf',
      name: 'flashcards.pdf',
      size: 180_000,
      mimeType: 'application/pdf',
    },
  },
];

const DM_EDU3_MESSAGES: MessageVM[] = [
  {
    ids: { id: MESSAGE_IDS.dmEdu3_1 },
    core: {
      type: 'file',
      sender: EDUCATOR_PRIYA,
      createdAt: '2026-02-06T19:05:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Science reading for the week.' },
    attachment: {
      type: 'file',
      url: 'https://files.example.com/science-reading.pdf',
      name: 'science-reading.pdf',
      size: 214_000,
      mimeType: 'application/pdf',
    },
  },
  {
    ids: { id: MESSAGE_IDS.dmEdu3_2 },
    core: {
      type: 'image',
      sender: EDUCATOR_PRIYA,
      createdAt: '2026-02-06T19:25:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Experiment setup for next class.' },
    attachment: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      name: 'experiment-setup.jpg',
      width: 1200,
      height: 800,
    },
  },
];

const DM_EDU4_MESSAGES: MessageVM[] = [
  {
    ids: { id: MESSAGE_IDS.dmEdu4_1 },
    core: {
      type: 'text',
      sender: EDUCATOR_LEO,
      createdAt: '2026-02-06T19:45:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Ready for Saturday’s chess match.' },
  },
];

const DM_EDU5_MESSAGES: MessageVM[] = [
  {
    ids: { id: MESSAGE_IDS.dmEdu5_1 },
    core: {
      type: 'text',
      sender: GUARDIAN_MORGAN,
      createdAt: '2026-02-06T20:10:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Thanks for the study tips!' },
  },
  {
    ids: { id: MESSAGE_IDS.dmEdu5_2 },
    core: {
      type: 'audio-recording',
      sender: EDUCATOR_SOFIA,
      createdAt: '2026-02-06T20:20:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Quick audio recap.' },
    audio: {
      url: 'https://files.example.com/learning-recap.m4a',
      durationSeconds: 74,
      waveform: [0.1, 0.35, 0.2, 0.4, 0.25, 0.3],
      fileSize: 980_000,
      mimeType: 'audio/mp4',
    },
  },
];

const DM_SUPPORT_MESSAGES: MessageVM[] = [
  {
    ids: { id: MESSAGE_IDS.dmSupport1 },
    core: {
      type: 'text',
      sender: STAFF_SUPPORT,
      createdAt: '2026-02-06T21:05:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Hi Riley! How can we help with scheduling today?' },
  },
  {
    ids: { id: MESSAGE_IDS.dmSupport2 },
    core: {
      type: 'text',
      sender: GUARDIAN_MORGAN,
      createdAt: '2026-02-06T21:10:00.000Z',
      visibility: { type: 'all' },
    },
    social: { reactions: [] },
    content: { text: 'Could you help me reschedule Ava’s math session?' },
  },
];

export const MATH_MESSAGES_CONNECTION: ConnectionVM<MessageVM> = {
  items: MATH_MESSAGES,
  total: MATH_MESSAGES.length,
};

export const SCIENCE_MESSAGES_CONNECTION: ConnectionVM<MessageVM> = {
  items: SCIENCE_MESSAGES,
  total: SCIENCE_MESSAGES.length,
};

export const ELA_MESSAGES_CONNECTION: ConnectionVM<MessageVM> = {
  items: ELA_MESSAGES,
  total: ELA_MESSAGES.length,
};

export const CHESS_MESSAGES_CONNECTION: ConnectionVM<MessageVM> = {
  items: CHESS_MESSAGES,
  total: CHESS_MESSAGES.length,
};

export const DM_EDU1_MESSAGES_CONNECTION: ConnectionVM<MessageVM> = {
  items: DM_EDU1_MESSAGES,
  total: DM_EDU1_MESSAGES.length,
};

export const DM_EDU2_MESSAGES_CONNECTION: ConnectionVM<MessageVM> = {
  items: DM_EDU2_MESSAGES,
  total: DM_EDU2_MESSAGES.length,
};

export const DM_EDU3_MESSAGES_CONNECTION: ConnectionVM<MessageVM> = {
  items: DM_EDU3_MESSAGES,
  total: DM_EDU3_MESSAGES.length,
};

export const DM_EDU4_MESSAGES_CONNECTION: ConnectionVM<MessageVM> = {
  items: DM_EDU4_MESSAGES,
  total: DM_EDU4_MESSAGES.length,
};

export const DM_EDU5_MESSAGES_CONNECTION: ConnectionVM<MessageVM> = {
  items: DM_EDU5_MESSAGES,
  total: DM_EDU5_MESSAGES.length,
};

export const SUPPORT_MESSAGES_CONNECTION: ConnectionVM<MessageVM> = {
  items: DM_SUPPORT_MESSAGES,
  total: DM_SUPPORT_MESSAGES.length,
};
