'use client';

import * as React from 'react';
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  SlidersHorizontal,
  Sparkles,
  User,
  Users,
} from 'lucide-react';

import { AvatarWithStatus } from '../shared/avatar-with-status';
import type { UserAccountVM, UserProfileVM } from '@iconicedu/shared-types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../../ui/sidebar';
import {
  UserSettingsDialog,
  type UserSettingsTab,
} from './user-settings-dialog';
import type { ProfileSaveInput } from './user-settings/profile-tab';

export function NavUser({
  profile,
  account,
  onLogout,
  forceProfileCompletion,
  onProfileSave,
}: {
  profile: UserProfileVM;
  account?: UserAccountVM | null;
  onLogout?: () => Promise<void> | void;
  forceProfileCompletion?: boolean;
  onProfileSave?: (input: ProfileSaveInput) => Promise<void> | void;
}) {
  const { isMobile } = useSidebar();
  const secondaryLabel =
    account?.contacts.email ?? profile.prefs.locale ?? profile.prefs.timezone ?? '';
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [settingsTab, setSettingsTab] = React.useState<UserSettingsTab>('account');
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const openSettings = React.useCallback((tab: UserSettingsTab) => {
    setSettingsTab(tab);
    setSettingsOpen(true);
  }, []);

  React.useEffect(() => {
    if (forceProfileCompletion) {
      setSettingsTab('profile');
      setSettingsOpen(true);
    }
  }, [forceProfileCompletion]);

  const handleLogout = React.useCallback(async () => {
    if (!onLogout) {
      return;
    }
    setIsLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  }, [onLogout]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <AvatarWithStatus
                name={profile.profile.displayName}
                avatar={profile.profile.avatar}
                presence={profile.presence}
                themeKey={profile.ui?.themeKey}
                sizeClassName="h-8 w-8 rounded-xl"
                fallbackClassName="rounded-xl"
                initialsLength={2}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {profile.profile.displayName}
                </span>
                {secondaryLabel ? (
                  <span className="truncate text-xs">{secondaryLabel}</span>
                ) : null}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl"
            side={'bottom'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <AvatarWithStatus
                  name={profile.profile.displayName}
                  avatar={profile.profile.avatar}
                  presence={profile.presence}
                  themeKey={profile.ui?.themeKey}
                  sizeClassName="h-8 w-8 rounded-xl"
                  fallbackClassName="rounded-xl"
                  initialsLength={2}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {profile.profile.displayName}
                  </span>
                  {secondaryLabel ? (
                    <span className="truncate text-xs">{secondaryLabel}</span>
                  ) : null}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => openSettings('account')}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => openSettings('profile')}>
                <User />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openSettings('preferences')}>
                <SlidersHorizontal />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openSettings('family')}>
                <Users />
                Family
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openSettings('notifications')}>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout} disabled={isLoggingOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserSettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          activeTab={settingsTab}
          onTabChange={setSettingsTab}
          profile={profile}
          account={account}
          forceProfileCompletion={forceProfileCompletion}
          onLogout={onLogout}
          onProfileSave={onProfileSave}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
