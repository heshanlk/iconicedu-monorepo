import type { AdminMenuSectionVM } from '@iconicedu/shared-types';

export const ADMIN_MENU_SECTIONS: AdminMenuSectionVM[] = [
  {
    title: 'Users',
    iconKey: 'users',
    links: [
      { title: 'All', url: '/d/admin/users' },
      { title: 'Pending invites', url: '/d/admin/users/pending-invites' },
      { title: 'Manage families', url: '/d/admin/users/families' },
      { title: 'Roles & permissions', url: '/d/admin/users/roles' },
    ],
  },
  {
    title: 'Learning spaces',
    iconKey: 'learning_spaces',
    links: [
      { title: 'All', url: '/d/admin/spaces' },
      { title: 'Resources', url: '/d/admin/spaces/resources' },
    ],
  },
  {
    title: 'Channels',
    iconKey: 'channels',
    links: [
      { title: 'All', url: '/d/admin/channels' },
      { title: 'Direct messages', url: '/d/admin/channels/direct-messages' },
      { title: 'Announcements', url: '/d/admin/channels/announcements' },
      { title: 'Support', url: '/d/admin/channels/support' },
    ],
  },
  {
    title: 'Activity',
    iconKey: 'activity',
    links: [
      { title: 'Activity feed', url: '/d/admin/activity/feed' },
      { title: 'Activity logs', url: '/d/admin/activity/logs' },
      {
        title: 'Inbox & notifications',
        url: '/d/admin/activity/inbox',
      },
    ],
  },
  {
    title: 'Moderation',
    iconKey: 'moderation',
    links: [
      { title: 'Flagged messages', url: '/d/admin/moderation/flags' },
      { title: 'Participant reports', url: '/d/admin/moderation/reports' },
    ],
  },
  {
    title: 'Settings',
    iconKey: 'system',
    links: [
      { title: 'Account settings', url: '/d/admin/settings/accounts' },
      { title: 'Roles & policies', url: '/d/admin/settings/roles' },
    ],
  },
];
