import type { AdminMenuSectionVM } from '@iconicedu/shared-types';

export const ADMIN_MENU_SECTIONS: AdminMenuSectionVM[] = [
  {
    title: 'Users',
    iconKey: 'users',
    links: [
      { title: 'List users', url: '/d/admin/users' },
      { title: 'List pending invites', url: '/d/admin/users/pending-invites' },
      { title: 'Manage families', url: '/d/admin/users/families' },
      { title: 'Roles & permissions', url: '/d/admin/users/roles' },
    ],
  },
  {
    title: 'Learning spaces',
    iconKey: 'learning_spaces',
    links: [
      { title: 'All learning spaces', url: '/d/admin/spaces' },
      { title: 'Learning space schedules', url: '/d/admin/spaces/schedules' },
      { title: 'Space resources', url: '/d/admin/spaces/resources' },
      {
        title: 'Participants & channels',
        url: '/d/admin/spaces/participants',
      },
    ],
  },
  {
    title: 'Class schedules',
    iconKey: 'class_schedules',
    links: [
      { title: 'Upcoming sessions', url: '/d/admin/schedules' },
      { title: 'Availability blocks', url: '/d/admin/schedules/availability' },
      { title: 'Session audits', url: '/d/admin/schedules/audits' },
    ],
  },
  {
    title: 'Channels',
    iconKey: 'channels',
    links: [
      { title: 'All chats', url: '/d/admin/channels' },
      { title: 'Announcements', url: '/d/admin/channels/announcements' },
      { title: 'Support channels', url: '/d/admin/channels/support' },
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
      { title: 'Message payloads', url: '/d/admin/moderation/messages' },
      { title: 'Participant reports', url: '/d/admin/moderation/reports' },
    ],
  },
  {
    title: 'System & settings',
    iconKey: 'system',
    links: [
      { title: 'Account settings', url: '/d/admin/settings/accounts' },
      { title: 'Roles & policies', url: '/d/admin/settings/roles' },
      {
        title: 'Org config & automations',
        url: '/d/admin/settings/automations',
      },
    ],
  },
];
