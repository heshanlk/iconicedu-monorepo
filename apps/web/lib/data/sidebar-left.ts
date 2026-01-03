import type { SidebarLeftDataVM } from '@iconicedu/shared-types';
import { GUARDIAN_ACCOUNT, CHILD_MAYA_ACCOUNT, CHILD_TEHARA_ACCOUNT, CHILD_TEVIN_ACCOUNT } from './accounts';
import { FAMILIES, FAMILY_LINKS } from './families';
import { LEARNING_SPACES } from './learning-spaces';
import {
  DIRECT_MESSAGE_CHANNELS_WITH_MESSAGES,
} from './channel-message-data';
import { CHANNEL_IDS } from './ids';
import {
  CHILD_MAYA_PROFILE,
  CHILD_TEHARA_PROFILE,
  CHILD_TEVIN_PROFILE,
  GUARDIAN_RILEY_PROFILE,
} from './profiles';

export const SIDEBAR_LEFT_DATA: SidebarLeftDataVM = {
  user: {
    profile: GUARDIAN_RILEY_PROFILE,
    account: GUARDIAN_ACCOUNT,
    families: FAMILIES,
    familyLinks: FAMILY_LINKS,
    linkedProfiles: [CHILD_TEVIN_PROFILE, CHILD_TEHARA_PROFILE, CHILD_MAYA_PROFILE],
    linkedAccounts: [CHILD_TEVIN_ACCOUNT, CHILD_TEHARA_ACCOUNT, CHILD_MAYA_ACCOUNT],
  },
  navigation: {
    navMain: [
      {
        title: 'Home',
        url: '/d',
        icon: 'home',
      },
      {
        title: 'Class schedule',
        url: '/d/class-schedule',
        icon: 'class-schedule',
      },
      {
        title: 'Inbox',
        url: '/d/inbox',
        icon: 'inbox',
        count: 3,
      },
      {
        title: 'Learning spaces',
        url: '/d/spaces',
        icon: 'languages',
      },
      {
        title: 'Direct messages',
        url: '/d/dm',
        icon: 'send',
      },
    ],
    navSecondary: [
      {
        title: 'Support',
        url: `/d/c/${CHANNEL_IDS.support}`,
        icon: 'life-buoy',
      },
    ],
  },
  collections: {
    learningSpaces: LEARNING_SPACES,
    directMessages: DIRECT_MESSAGE_CHANNELS_WITH_MESSAGES,
  },
};
