import type { ChannelMediaItemVM, ConnectionVM } from '@iconicedu/shared-types';
import { CHANNEL_IDS, MEDIA_IDS, MESSAGE_IDS } from './ids';
import {
  CHILD_AVA,
  CHILD_MILO,
  EDUCATOR_ELENA,
  EDUCATOR_LEO,
  EDUCATOR_PRIYA,
} from './profiles';

const MATH_MEDIA_ITEMS: ChannelMediaItemVM[] = [
  {
    id: MEDIA_IDS.math1,
    channelId: CHANNEL_IDS.math,
    messageId: MESSAGE_IDS.math5,
    senderId: CHILD_AVA.ids.id,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
    name: 'math-worksheet.jpg',
    width: 1200,
    height: 900,
    createdAt: '2026-02-09T22:15:00.000Z',
  },
  {
    id: MEDIA_IDS.math2,
    channelId: CHANNEL_IDS.math,
    messageId: MESSAGE_IDS.math5,
    senderId: CHILD_AVA.ids.id,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
    name: 'number-line.png',
    width: 1280,
    height: 720,
    createdAt: '2026-02-09T22:45:00.000Z',
  },
];

const SCIENCE_MEDIA_ITEMS: ChannelMediaItemVM[] = [
  {
    id: MEDIA_IDS.science1,
    channelId: CHANNEL_IDS.science,
    messageId: MESSAGE_IDS.science2,
    senderId: CHILD_MILO.ids.id,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848c',
    name: 'science-lab.png',
    width: 1280,
    height: 854,
    createdAt: '2026-02-08T20:12:00.000Z',
  },
];

const ELA_MEDIA_ITEMS: ChannelMediaItemVM[] = [
  {
    id: MEDIA_IDS.ela1,
    channelId: CHANNEL_IDS.ela,
    messageId: MESSAGE_IDS.ela2,
    senderId: EDUCATOR_ELENA.ids.id,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
    name: 'reading-list.png',
    width: 1200,
    height: 800,
    createdAt: '2026-02-07T19:15:00.000Z',
  },
];

const CHESS_MEDIA_ITEMS: ChannelMediaItemVM[] = [
  {
    id: MEDIA_IDS.chess1,
    channelId: CHANNEL_IDS.chess,
    messageId: MESSAGE_IDS.chess3,
    senderId: EDUCATOR_LEO.ids.id,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b',
    name: 'chess-board.jpg',
    width: 1200,
    height: 800,
    createdAt: '2026-02-12T18:05:00.000Z',
  },
];

const DM_EDU1_MEDIA_ITEMS: ChannelMediaItemVM[] = [
  {
    id: MEDIA_IDS.dmEdu1_1,
    channelId: CHANNEL_IDS.dmEducator1,
    messageId: MESSAGE_IDS.dmEdu1_2,
    senderId: EDUCATOR_ELENA.ids.id,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    name: 'writing-samples.png',
    width: 1200,
    height: 900,
    createdAt: '2026-02-06T18:05:00.000Z',
  },
];

const DM_EDU3_MEDIA_ITEMS: ChannelMediaItemVM[] = [
  {
    id: MEDIA_IDS.dmEdu3_1,
    channelId: CHANNEL_IDS.dmEducator3,
    messageId: MESSAGE_IDS.dmEdu3_2,
    senderId: EDUCATOR_PRIYA.ids.id,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    name: 'experiment-setup.jpg',
    width: 1200,
    height: 800,
    createdAt: '2026-02-06T19:25:00.000Z',
  },
];

export const MATH_MEDIA: ConnectionVM<ChannelMediaItemVM> = {
  items: MATH_MEDIA_ITEMS,
  total: MATH_MEDIA_ITEMS.length,
};

export const SCIENCE_MEDIA: ConnectionVM<ChannelMediaItemVM> = {
  items: SCIENCE_MEDIA_ITEMS,
  total: SCIENCE_MEDIA_ITEMS.length,
};

export const ELA_MEDIA: ConnectionVM<ChannelMediaItemVM> = {
  items: ELA_MEDIA_ITEMS,
  total: ELA_MEDIA_ITEMS.length,
};

export const CHESS_MEDIA: ConnectionVM<ChannelMediaItemVM> = {
  items: CHESS_MEDIA_ITEMS,
  total: CHESS_MEDIA_ITEMS.length,
};

export const DM_EDU1_MEDIA: ConnectionVM<ChannelMediaItemVM> = {
  items: DM_EDU1_MEDIA_ITEMS,
  total: DM_EDU1_MEDIA_ITEMS.length,
};

export const DM_EDU3_MEDIA: ConnectionVM<ChannelMediaItemVM> = {
  items: DM_EDU3_MEDIA_ITEMS,
  total: DM_EDU3_MEDIA_ITEMS.length,
};

export const EMPTY_MEDIA: ConnectionVM<ChannelMediaItemVM> = {
  items: [],
  total: 0,
};
