import type { SidebarLeftDataVM } from '@iconicedu/shared-types';
import { ACCOUNT_GUARDIAN } from './accounts';
import { DIRECT_MESSAGE_CHANNELS } from './direct-message-channels';
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
        url: '/dashboard',
        icon: 'home',
      },
      {
        title: 'Calendar',
        url: '/dashboard/class-schedule',
        icon: 'class-schedule',
      },
      {
        title: 'Inbox',
        url: '/dashboard/inbox',
        icon: 'inbox',
      },
    ],
    navSecondary: [
      {
        title: 'Support',
        url: '/dashboard/support',
        icon: 'life-buoy',
      },
      {
        title: 'Feedback',
        url: '/dashboard/feedback',
        icon: 'send',
      },
    ],
  },
  collections: {
    learningSpaces: LEARNING_SPACES,
    directMessages: DIRECT_MESSAGE_CHANNELS,
  },
};
