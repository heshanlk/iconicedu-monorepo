import type { SidebarLeftData } from '@iconicedu/shared-types';
import { MOCK_GUARDIAN, MOCK_USER_ACCOUNTS, toProfileUser } from './people';
import { CLASS_SPACES } from './class-spaces';
import { DIRECT_MESSAGE_CHANNELS } from './direct-message-channels';

const guardianAccount = MOCK_USER_ACCOUNTS.find(
  (account) => account.id === MOCK_GUARDIAN.accountId,
);
export const SIDEBAR_LEFT_DATA: SidebarLeftData = {
  user: toProfileUser(MOCK_GUARDIAN, guardianAccount),
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
  LEARNING_SPACES: CLASS_SPACES,
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
  DIRECT_MESSAGES: DIRECT_MESSAGE_CHANNELS,
};
