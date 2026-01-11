'use client';

import * as React from 'react';
import { MessageSquarePlus, MoreHorizontal, Settings, UserPlus } from 'lucide-react';
import {
  Calendar,
  ChefHat,
  Earth,
  Home,
  Inbox,
  Languages,
  LifeBuoy,
  Send,
  SquarePi,
} from 'lucide-react';

import { NavLearningSpaces } from './nav-learning-spaces';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';
import type {
  ProfileAvatarInput,
  ProfileAvatarRemoveInput,
  ProfileSaveInput,
} from './user-settings/profile-tab';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '../../ui/sidebar';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { NavMain } from './nav-main';
import { NavDirectMessages } from './nav-direct-messages';
import { SiteLogoWithName } from '../site-logo-wt-name';
import { Empty } from '../../ui/empty';
import { EmptyContent } from '../../ui/empty';
import type {
  ChildProfileSaveInput,
  EducatorProfileSaveInput,
  FamilyLinkInviteRole,
  FamilyLinkInviteVM,
  SidebarLeftDataVM,
  SidebarNavItem,
  SidebarSecondaryItem,
  ThemeKey,
} from '@iconicedu/shared-types';

const ICONS = {
  home: Home,
  'class-schedule': Calendar,
  inbox: Inbox,
  languages: Languages,
  'chef-hat': ChefHat,
  earth: Earth,
  'square-pi': SquarePi,
  'life-buoy': LifeBuoy,
  send: Send,
} as const;

export function SidebarLeft({
  data,
  activePath,
  onLogout,
  forceProfileCompletion,
  forceAccountCompletion,
  onProfileSave,
  onChildProfileSave,
  onAccountUpdate,
  onPrefsSave,
  onLocationSave,
  onAvatarUpload,
  onAvatarRemove,
  onNotificationPreferenceSave,
  onFamilyInviteCreate,
  onFamilyInviteRemove,
  onChildThemeSave,
  onChildProfileCreate,
  onFamilyMemberRemove,
  onEducatorProfileSave,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  data: SidebarLeftDataVM;
  activePath?: string | null;
  onLogout?: () => Promise<void> | void;
  forceProfileCompletion?: boolean;
  forceAccountCompletion?: boolean;
  onProfileSave?: (input: ProfileSaveInput) => Promise<void> | void;
  onChildProfileSave?: (input: ChildProfileSaveInput) => Promise<void> | void;
  onAccountUpdate?: (input: {
    accountId: string;
    orgId: string;
    phoneE164?: string | null;
    whatsappE164?: string | null;
    phoneVerified?: boolean;
    whatsappVerified?: boolean;
    preferredContactChannels?: string[] | null;
  }) => Promise<void> | void;
  onPrefsSave?: (input: {
    profileId: string;
    orgId: string;
    timezone?: string;
    locale?: string | null;
    languagesSpoken?: string[] | null;
    themeKey?: string | null;
  }) => Promise<void> | void;
  onChildThemeSave?: (input: {
    profileId: string;
    orgId: string;
    themeKey: ThemeKey;
  }) => Promise<void> | void;
  onChildProfileCreate?: (input: {
    orgId: string;
    displayName: string;
    firstName: string;
    lastName: string;
    gradeLevel: string;
    birthYear: number;
    timezone?: string | null;
    city?: string | null;
    region?: string | null;
    countryCode?: string | null;
    countryName?: string | null;
  }) => Promise<void> | void;
  onLocationSave?: (input: {
    profileId: string;
    orgId: string;
    city: string;
    region: string;
    postalCode: string;
    countryCode?: string | null;
    countryName?: string | null;
  }) => Promise<void> | void;
  onAvatarUpload?: (input: ProfileAvatarInput) => Promise<void> | void;
  onAvatarRemove?: (input: ProfileAvatarRemoveInput) => Promise<void> | void;
  onNotificationPreferenceSave?: (input: {
    profileId: string;
    orgId: string;
    prefKey: string;
    channels: string[];
    muted?: boolean | null;
  }) => Promise<void> | void;
  onFamilyInviteCreate?: (input: {
    invitedRole: FamilyLinkInviteRole;
    invitedEmail: string;
  }) => Promise<FamilyLinkInviteVM> | void;
  onFamilyInviteRemove?: (input: { inviteId: string }) => Promise<void> | void;
  onFamilyMemberRemove?: (input: { childAccountId: string }) => Promise<void> | void;
  onEducatorProfileSave?: (input: EducatorProfileSaveInput) => Promise<void> | void;
}) {
  const navMain: SidebarNavItem[] = data.navigation.navMain.map((item) => ({
    ...item,
    icon: ICONS[item.icon],
    isActive:
      item.url === '/d'
        ? activePath === item.url
        : (activePath?.startsWith(item.url) ?? false),
  }));
  const navSecondary: SidebarSecondaryItem[] = data.navigation.navSecondary.map(
    (item) => ({
      ...item,
      icon: ICONS[item.icon],
      isActive: activePath ? activePath.startsWith(item.url) : false,
    }),
  );

  const userProfile = data.user.profile;
  const children =
    userProfile.kind === 'guardian' ? (userProfile.children?.items ?? []) : [];
  const learningSpacesByChild = children.map((child) => ({
    child,
    learningSpaces: data.collections.learningSpaces.filter((space) =>
      space.channels.primaryChannel.collections.participants.some(
        (participant) => participant.ids.accountId === child.ids.accountId,
      ),
    ),
  }));

  const activeLearningSpaceId = React.useMemo(() => {
    if (!activePath) return null;
    if (activePath.startsWith('/d/spaces/')) {
      return activePath.split('/').pop() ?? null;
    }
    return null;
  }, [activePath]);
  const activeDirectMessageId = React.useMemo(() => {
    if (!activePath) return null;
    if (activePath.startsWith('/d/dm/')) {
      return activePath.split('/').pop() ?? null;
    }
    return null;
  }, [activePath]);
  const activeChildId = React.useMemo(() => {
    if (!activeLearningSpaceId) return null;
    const match = learningSpacesByChild.find(({ learningSpaces }) =>
      learningSpaces.some(
        (space) => space.channels.primaryChannel.ids.id === activeLearningSpaceId,
      ),
    );
    return match?.child.ids.accountId ?? null;
  }, [activeLearningSpaceId, learningSpacesByChild]);
  const [openChildId, setOpenChildId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (activeChildId) {
      setOpenChildId(activeChildId);
    }
  }, [activeChildId]);

  const { isMobile } = useSidebar();
  return (
    <Sidebar variant="inset" {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <SiteLogoWithName />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <SidebarSeparator className="mx-2 group-data-[collapsible=icon]:hidden" />
        {userProfile.kind === 'guardian' ? (
          <>
            <SidebarGroup className="pb-0">
              <SidebarGroupLabel asChild className="uppercase">
                <span>Learning spaces</span>
              </SidebarGroupLabel>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarGroupAction title="Learning space actions">
                    <MoreHorizontal />
                    <span className="sr-only">Learning space actions</span>
                  </SidebarGroupAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem>
                    <UserPlus className="text-muted-foreground" />
                    <span>Add child</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquarePlus className="text-muted-foreground" />
                    <span>Request tutoring</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="text-muted-foreground" />
                    <span>Manage learning spaces</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <SidebarGroupContent />
            </SidebarGroup>
            {learningSpacesByChild.length === 0 ? (
              <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                <SidebarGroupContent>
                  <Empty>
                    <EmptyContent>
                      <div className="flex">
                        <Button size="lg">
                          <UserPlus /> Add a Child
                        </Button>
                      </div>
                    </EmptyContent>
                  </Empty>
                </SidebarGroupContent>
              </SidebarGroup>
            ) : (
              learningSpacesByChild.map(({ child, learningSpaces }) => (
                <NavLearningSpaces
                  key={child.ids.accountId}
                  title={child.profile.displayName}
                  child={child}
                  learningSpaces={learningSpaces}
                  isOpen={openChildId === child.ids.accountId}
                  onOpenChange={(nextOpen) =>
                    setOpenChildId(nextOpen ? child.ids.accountId : null)
                  }
                  activeChannelId={activeLearningSpaceId}
                />
              ))
            )}
          </>
        ) : null}
        <SidebarSeparator className="mx-2" />
        <NavDirectMessages
          dms={data.collections.directMessages}
          currentUserId={data.user.profile.ids.accountId}
          activeChannelId={activeDirectMessageId ?? null}
        />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          profile={data.user.profile}
          account={data.user.account}
          onLogout={onLogout}
          forceProfileCompletion={forceProfileCompletion}
          forceAccountCompletion={forceAccountCompletion}
          onProfileSave={onProfileSave}
          onChildProfileSave={onChildProfileSave}
          onAccountUpdate={onAccountUpdate}
          onPrefsSave={onPrefsSave}
          onLocationSave={onLocationSave}
          onAvatarUpload={onAvatarUpload}
          onAvatarRemove={onAvatarRemove}
          onNotificationPreferenceSave={onNotificationPreferenceSave}
          onFamilyInviteCreate={onFamilyInviteCreate}
          onFamilyInviteRemove={onFamilyInviteRemove}
          onChildThemeSave={onChildThemeSave}
          onChildProfileCreate={onChildProfileCreate}
          onFamilyMemberRemove={onFamilyMemberRemove}
          onEducatorProfileSave={onEducatorProfileSave}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
