import type { SidebarLeftDataVM } from '@iconicedu/shared-types';
import { MOCK_GUARDIAN, MOCK_USER_ACCOUNTS } from './people';
import { LEARNING_SPACES } from './learning-spaces';
import { DIRECT_MESSAGE_CHANNELS } from './direct-message-channels';

const guardianAccount = MOCK_USER_ACCOUNTS.find(
  (account) => account.ids.id === MOCK_GUARDIAN.ids.accountId,
);
export const SIDEBAR_LEFT_DATA: SidebarLeftDataVM = {
  user: {
    profile: MOCK_GUARDIAN,
    account: guardianAccount ?? null,
  },
  navigation: {
    navMain: [
      {
        title: 'Home',
        url: '/dashboard',
        icon: 'home',
        isActive: true,
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
        badge: '10',
        count: 11,
      },
    ],
    navSecondary: [
      {
        title: 'Support',
        url: '#',
        icon: 'life-buoy',
      },
      {
        title: 'Feedback',
        url: '#',
        icon: 'send',
      },
    ],
  },
  collections: {
    learningSpaces: LEARNING_SPACES,
    directMessages: DIRECT_MESSAGE_CHANNELS,
  },
};
