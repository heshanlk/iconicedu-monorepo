import type React from 'react';
import type { ChildProfileVM, UserProfileVM } from './vm/profile';
import type { ChannelMiniVM } from './vm/channel';
export type SidebarIconKey = 'home' | 'calendar' | 'inbox' | 'languages' | 'chef-hat' | 'earth' | 'square-pi' | 'life-buoy' | 'send';
export type SidebarIconComponent = React.ComponentType<{
    className?: string;
}>;
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
export type SidebarSecondaryItemData = {
    title: string;
    url: string;
    icon: SidebarIconKey;
};
export type SidebarSecondaryItem = Omit<SidebarSecondaryItemData, 'icon'> & {
    icon: SidebarIconComponent;
};
export type SidebarChild = Pick<ChildProfileVM, 'accountId' | 'displayName' | 'color'>;
export type SidebarLeftData = {
    user: UserProfileVM & {
        email?: string | null;
    };
    navMain: SidebarNavItemData[];
    LEARNING_SPACES: ChannelMiniVM[];
    navSecondary: SidebarSecondaryItemData[];
    DIRECT_MESSAGES: ChannelMiniVM[];
    CHANNELS?: ChannelMiniVM[];
};
//# sourceMappingURL=sidebar.d.ts.map