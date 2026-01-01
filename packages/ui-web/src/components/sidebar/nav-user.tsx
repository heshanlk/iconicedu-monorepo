'use client';

import * as React from 'react';
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react';

import { AvatarWithStatus } from '../shared/avatar-with-status';
import type {
  FamilyLinkVM,
  UserAccountVM,
  FamilyVM,
  UserProfileVM,
} from '@iconicedu/shared-types';
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
import { UserSettingsDialog, type UserSettingsTab } from './user-settings-dialog';

export function NavUser({
  profile,
  account,
  families,
  familyLinks,
  linkedProfiles,
  linkedAccounts,
}: {
  profile: UserProfileVM;
  account?: UserAccountVM | null;
  families?: FamilyVM[] | null;
  familyLinks?: FamilyLinkVM[] | null;
  linkedProfiles?: UserProfileVM[] | null;
  linkedAccounts?: UserAccountVM[] | null;
}) {
  const { isMobile } = useSidebar();
  const secondaryLabel =
    account?.contacts.email ?? profile.prefs.locale ?? profile.prefs.timezone ?? '';
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [settingsTab, setSettingsTab] = React.useState<UserSettingsTab>('account');

  const openSettings = React.useCallback((tab: UserSettingsTab) => {
    setSettingsTab(tab);
    setSettingsOpen(true);
  }, []);

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
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => openSettings('account')}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openSettings('billing')}>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openSettings('notifications')}>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
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
          families={families}
          familyLinks={familyLinks}
          linkedProfiles={linkedProfiles}
          linkedAccounts={linkedAccounts}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
