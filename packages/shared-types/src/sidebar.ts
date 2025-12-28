import type React from 'react';
import type { ChildProfileVM } from './vm/profile';

export type SidebarIconKey =
  | 'home'
  | 'calendar'
  | 'inbox'
  | 'languages'
  | 'chef-hat'
  | 'earth'
  | 'square-pi'
  | 'life-buoy'
  | 'send';

export type SidebarIconComponent = React.ComponentType<{ className?: string }>;

export type SidebarNavItemData = {
  count?: number;
  title: string;
  url: string;
  icon: SidebarIconKey;
  isActive?: boolean;
  badge?: string;
  color?: string;
};

export type SidebarNavItem = Omit<SidebarNavItemData, 'icon'> & {
  icon: SidebarIconComponent;
};

export type SidebarClassroomItemData = {
  id: number;
  name: string;
  participants: string[];
  url: string;
  icon: SidebarIconKey;
  isFavorite?: boolean;
  hasUnread?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

export type SidebarClassroomItem = Omit<SidebarClassroomItemData, 'icon'> & {
  icon: SidebarIconComponent;
};

export type SidebarSecondaryItemData = {
  title: string;
  url: string;
  icon: SidebarIconKey;
};

export type SidebarSecondaryItem = Omit<SidebarSecondaryItemData, 'icon'> & {
  icon: SidebarIconComponent;
};

export type SidebarDirectMessageItem = {
  id: number;
  name: string;
  avatar: string;
  status: string;
  participants: string[];
  url?: string;
};

export type SidebarChild = Pick<ChildProfileVM, 'accountId' | 'displayName' | 'color'>;

export type SidebarUser = {
  name: string;
  email: string;
  avatar: string;
  isOnline?: boolean;
};

export type SidebarLeftData = {
  user: SidebarUser;
  navMain: SidebarNavItemData[];
  CLASSROOMS: SidebarClassroomItemData[];
  navSecondary: SidebarSecondaryItemData[];
  DIRECT_MESSAGES: SidebarDirectMessageItem[];
  CHILDREN: SidebarChild[];
};
