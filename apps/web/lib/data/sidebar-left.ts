import type { SidebarLeftDataVM } from '@iconicedu/shared-types';
import { ACCOUNT_GUARDIAN } from './accounts';
import { DIRECT_MESSAGE_CHANNELS } from './direct-message-channels';
import { CHANNEL_IDS } from './ids';
import { LEARNING_SPACES } from './learning-spaces';
import { GUARDIAN_MORGAN } from './profiles';

export const SIDEBAR_LEFT_DATA: SidebarLeftDataVM = {
  user: {
    profile: GUARDIAN_MORGAN,
    account: ACCOUNT_GUARDIAN,
  },
  navigation: {
    navMain: [
      {
        title: 'Home',
        url: '/d',
        icon: 'home',
      },
      {
        title: 'Calendar',
        url: '/d/class-schedule',
        icon: 'class-schedule',
      },
      {
        title: 'Inbox',
        url: '/d/inbox',
        icon: 'inbox',
      },
    ],
    navSecondary: [
      {
        title: 'Support',
        url: '/d/support',
        icon: 'life-buoy',
      },
      {
        title: 'Feedback',
        url: '/d/feedback',
        icon: 'send',
      },
    ],
  },
  collections: {
    learningSpaces: LEARNING_SPACES,
    directMessages: DIRECT_MESSAGE_CHANNELS,
  },
};
