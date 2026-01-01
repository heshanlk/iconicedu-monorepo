import type { SidebarLeftDataVM } from '@iconicedu/shared-types';
import { ACCOUNT_GUARDIAN, ACCOUNTS_BY_ID } from './accounts';
import { DIRECT_MESSAGE_CHANNELS } from './direct-message-channels';
import { FAMILIES, FAMILY_LINKS } from './families';
import { CHANNEL_IDS } from './ids';
import { LEARNING_SPACES } from './learning-spaces';
import { GUARDIAN_MORGAN, PROFILES_BY_ACCOUNT_ID } from './profiles';

const GUARDIAN_LINKS = FAMILY_LINKS.filter(
  (link) => link.accounts.guardianAccountId === ACCOUNT_GUARDIAN.ids.id,
);
const LINKED_PROFILES = GUARDIAN_LINKS.map(
  (link) => PROFILES_BY_ACCOUNT_ID[link.accounts.childAccountId],
).filter(Boolean);
const LINKED_ACCOUNTS = GUARDIAN_LINKS.map(
  (link) => ACCOUNTS_BY_ID[link.accounts.childAccountId],
).filter(Boolean);

export const SIDEBAR_LEFT_DATA: SidebarLeftDataVM = {
  user: {
    profile: GUARDIAN_MORGAN,
    account: ACCOUNT_GUARDIAN,
    families: FAMILIES,
    familyLinks: FAMILY_LINKS,
    linkedProfiles: LINKED_PROFILES,
    linkedAccounts: LINKED_ACCOUNTS,
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
        url: `/dashboard/c/${CHANNEL_IDS.dmSupport}`,
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
