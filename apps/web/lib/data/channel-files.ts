import type { ChannelFileItemVM, ConnectionVM } from '@iconicedu/shared-types';
import { CHANNEL_IDS, FILE_IDS, MESSAGE_IDS } from './ids';
import {
  CHILD_AVA,
  CHILD_MILO,
  EDUCATOR_ELENA,
  EDUCATOR_LEO,
  EDUCATOR_KAI,
  EDUCATOR_PRIYA,
} from './profiles';

const MATH_FILE_ITEMS: ChannelFileItemVM[] = [
  {
    id: FILE_IDS.math1,
    channelId: CHANNEL_IDS.math,
    messageId: MESSAGE_IDS.math5,
    senderId: CHILD_AVA.ids.id,
    kind: 'file',
    url: 'https://files.example.com/math-homework.pdf',
    name: 'math-homework.pdf',
    mimeType: 'application/pdf',
    size: 345_120,
    createdAt: '2026-02-09T22:15:00.000Z',
  },
  {
    id: FILE_IDS.math2,
    channelId: CHANNEL_IDS.math,
    messageId: MESSAGE_IDS.math4,
    senderId: EDUCATOR_KAI.ids.id,
    kind: 'file',
    url: 'https://files.example.com/math-practice.pdf',
    name: 'practice-pack.pdf',
    mimeType: 'application/pdf',
    size: 512_000,
    createdAt: '2026-02-09T21:45:00.000Z',
  },
];

const SCIENCE_FILE_ITEMS: ChannelFileItemVM[] = [
  {
    id: FILE_IDS.science1,
    channelId: CHANNEL_IDS.science,
    messageId: MESSAGE_IDS.science3,
    senderId: CHILD_MILO.ids.id,
    kind: 'file',
    url: 'https://files.example.com/experiment-summary.docx',
    name: 'experiment-summary.docx',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 401_210,
    createdAt: '2026-02-08T21:05:00.000Z',
  },
];

const ELA_FILE_ITEMS: ChannelFileItemVM[] = [
  {
    id: FILE_IDS.ela1,
    channelId: CHANNEL_IDS.ela,
    messageId: MESSAGE_IDS.ela1,
    senderId: EDUCATOR_ELENA.ids.id,
    kind: 'design-file',
    url: 'https://files.example.com/ela-rubric.fig',
    name: 'writing-rubric.fig',
    mimeType: 'application/octet-stream',
    size: 921_440,
    tool: 'figma',
    createdAt: '2026-02-07T18:35:00.000Z',
  },
];

const CHESS_FILE_ITEMS: ChannelFileItemVM[] = [
  {
    id: FILE_IDS.chess1,
    channelId: CHANNEL_IDS.chess,
    messageId: MESSAGE_IDS.chess2,
    senderId: EDUCATOR_LEO.ids.id,
    kind: 'file',
    url: 'https://files.example.com/chess-training.pdf',
    name: 'chess-training.pdf',
    mimeType: 'application/pdf',
    size: 510_000,
    createdAt: '2026-02-12T17:30:00.000Z',
  },
];

const DM_EDU1_FILE_ITEMS: ChannelFileItemVM[] = [
  {
    id: FILE_IDS.dmEdu1_1,
    channelId: CHANNEL_IDS.dmEducator1,
    messageId: MESSAGE_IDS.dmEdu1_3,
    senderId: EDUCATOR_ELENA.ids.id,
    kind: 'file',
    url: 'https://files.example.com/ela-feedback.pdf',
    name: 'feedback.pdf',
    mimeType: 'application/pdf',
    size: 210_000,
    createdAt: '2026-02-06T18:45:00.000Z',
  },
];

const DM_EDU2_FILE_ITEMS: ChannelFileItemVM[] = [
  {
    id: FILE_IDS.dmEdu2_1,
    channelId: CHANNEL_IDS.dmEducator2,
    messageId: MESSAGE_IDS.dmEdu2_2,
    senderId: EDUCATOR_KAI.ids.id,
    kind: 'file',
    url: 'https://files.example.com/math-flashcards.pdf',
    name: 'flashcards.pdf',
    mimeType: 'application/pdf',
    size: 180_000,
    createdAt: '2026-02-06T19:10:00.000Z',
  },
];

const DM_EDU3_FILE_ITEMS: ChannelFileItemVM[] = [
  {
    id: FILE_IDS.dmEdu3_1,
    channelId: CHANNEL_IDS.dmEducator3,
    messageId: MESSAGE_IDS.dmEdu3_1,
    senderId: EDUCATOR_PRIYA.ids.id,
    kind: 'file',
    url: 'https://files.example.com/science-reading.pdf',
    name: 'science-reading.pdf',
    mimeType: 'application/pdf',
    size: 214_000,
    createdAt: '2026-02-06T19:05:00.000Z',
  },
];

export const MATH_FILES: ConnectionVM<ChannelFileItemVM> = {
  items: MATH_FILE_ITEMS,
  total: MATH_FILE_ITEMS.length,
};

export const SCIENCE_FILES: ConnectionVM<ChannelFileItemVM> = {
  items: SCIENCE_FILE_ITEMS,
  total: SCIENCE_FILE_ITEMS.length,
};

export const ELA_FILES: ConnectionVM<ChannelFileItemVM> = {
  items: ELA_FILE_ITEMS,
  total: ELA_FILE_ITEMS.length,
};

export const CHESS_FILES: ConnectionVM<ChannelFileItemVM> = {
  items: CHESS_FILE_ITEMS,
  total: CHESS_FILE_ITEMS.length,
};

export const DM_EDU1_FILES: ConnectionVM<ChannelFileItemVM> = {
  items: DM_EDU1_FILE_ITEMS,
  total: DM_EDU1_FILE_ITEMS.length,
};

export const DM_EDU2_FILES: ConnectionVM<ChannelFileItemVM> = {
  items: DM_EDU2_FILE_ITEMS,
  total: DM_EDU2_FILE_ITEMS.length,
};

export const DM_EDU3_FILES: ConnectionVM<ChannelFileItemVM> = {
  items: DM_EDU3_FILE_ITEMS,
  total: DM_EDU3_FILE_ITEMS.length,
};

export const EMPTY_FILES: ConnectionVM<ChannelFileItemVM> = {
  items: [],
  total: 0,
};
