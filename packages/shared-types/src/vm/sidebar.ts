import type React from 'react';
import type { ChildProfileVM, UserProfileVM } from './profile';
import type { ChannelVM } from './channel';
import type { UserAccountVM } from './account';
import type { LearningSpaceVM } from './learning-space';

export type SidebarIconKey =
  | 'home'
  | 'class-schedule'
  | 'inbox'
  | 'languages'
  | 'chef-hat'
  | 'earth'
  | 'square-pi'
  | 'life-buoy'
  | 'send';

export type SidebarIconComponent = React.ComponentType<{ className?: string }>;

export type SidebarNavItemData = {
  title: string;
  url: string;
  icon: SidebarIconKey;

  count?: number;

  isActive?: boolean;

  badge?: string;
  color?: string;
};

export type SidebarNavItem = Omit<SidebarNavItemData, 'icon'> & {
  icon: SidebarIconComponent;
};

export type SidebarSecondaryItemData = {
  title: string;
  url: string;
  icon: SidebarIconKey;

  isActive?: boolean;
};

export type SidebarSecondaryItem = Omit<SidebarSecondaryItemData, 'icon'> & {
  icon: SidebarIconComponent;
};

export type SidebarChildVM = ChildProfileVM;

export interface SidebarUserVM {
  profile: UserProfileVM;
  account?: UserAccountVM | null;
}

export interface SidebarPrimaryNavVM {
  navMain: SidebarNavItemData[];
  navSecondary: SidebarSecondaryItemData[];
}

export interface SidebarCollectionsVM {
  learningSpaces: LearningSpaceVM[];
  directMessages: ChannelVM[];
}

export interface SidebarLeftDataVM {
  user: SidebarUserVM;

  navigation: SidebarPrimaryNavVM;

  collections: SidebarCollectionsVM;
}
