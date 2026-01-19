'use client';

import * as React from 'react';
import {
  BadgeCheck,
  Bell,
  CalendarDays,
  ChevronsUpDown,
  CreditCard,
  Lightbulb,
  LogOut,
  SlidersHorizontal,
  Sparkles,
  User,
  Users,
} from 'lucide-react';

import { AvatarWithStatus } from '../shared/avatar-with-status';
import type {
  ChildProfileSaveInput,
  ChildProfileVM,
  EducatorAvailabilityInput,
  EducatorProfileSaveInput,
  FamilyLinkInviteRole,
  FamilyLinkInviteVM,
  StaffProfileSaveInput,
  ThemeKey,
  UserOnboardingStatusVM,
  UserAccountVM,
  UserProfileVM,
} from '@iconicedu/shared-types';
import { getProfileDisplayName } from '../../lib/display-name';
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
  ONBOARDING_STEP_TO_TAB,
  UserSettingsDialog,
  type UserSettingsTab,
} from './user-settings-dialog';
import type {
  ProfileAvatarInput,
  ProfileAvatarRemoveInput,
  ProfileSaveInput,
} from './user-settings/profile-tab';

export function NavUser({
  profile,
  account,
  onLogout,
  onOnboardingComplete,
  onboardingStatus,
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
  onEducatorAvailabilitySave,
  onStaffProfileSave,
}: {
  profile: UserProfileVM;
  account?: UserAccountVM | null;
  onLogout?: () => Promise<void> | void;
  onboardingStatus?: UserOnboardingStatusVM | null;
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
  onChildThemeSave?: (input: {
    profileId: string;
    orgId: string;
    themeKey: ThemeKey;
  }) => Promise<void> | void;
  onFamilyInviteCreate?: (input: {
    invitedRole: FamilyLinkInviteRole;
    invitedEmail: string;
  }) => Promise<FamilyLinkInviteVM> | void;
  onFamilyInviteRemove?: (input: { inviteId: string }) => Promise<void> | void;
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
    postalCode?: string | null;
  }) => Promise<ChildProfileVM> | void;
  onFamilyMemberRemove?: (input: { childAccountId: string }) => Promise<void> | void;
  onEducatorProfileSave?: (input: EducatorProfileSaveInput) => Promise<void> | void;
  onEducatorAvailabilitySave?: (input: EducatorAvailabilityInput) => Promise<void> | void;
  onStaffProfileSave?: (input: StaffProfileSaveInput) => Promise<void> | void;
  onOnboardingComplete?: () => void;
}) {
  const { isMobile } = useSidebar();
  const profileDisplayName = getProfileDisplayName(profile.profile);
  const secondaryLabel =
    account?.contacts.email ?? profile.prefs.locale ?? profile.prefs.timezone ?? '';
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [settingsTab, setSettingsTab] = React.useState<UserSettingsTab>('account');
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const openSettings = React.useCallback((tab: UserSettingsTab) => {
    setSettingsTab(tab);
    setSettingsOpen(true);
  }, []);

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

  React.useEffect(() => {
    const step = onboardingStatus?.currentStep;
    if (!step) {
      return;
    }
    const targetTab = ONBOARDING_STEP_TO_TAB[step];
    if (targetTab) {
      setSettingsTab(targetTab);
    }
    setSettingsOpen(true);
  }, [onboardingStatus]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <AvatarWithStatus
                name={profileDisplayName}
                avatar={profile.profile.avatar}
                presence={profile.presence}
                themeKey={profile.ui?.themeKey}
                sizeClassName="h-8 w-8 rounded-full"
                fallbackClassName="rounded-full"
                initialsLength={2}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {profileDisplayName}
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
                  name={profileDisplayName}
                  avatar={profile.profile.avatar}
                  presence={profile.presence}
                  themeKey={profile.ui?.themeKey}
                  sizeClassName="h-8 w-8 rounded-full"
                  fallbackClassName="rounded-full"
                  initialsLength={2}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {profileDisplayName}
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
              {profile.kind === 'educator' ? (
                <DropdownMenuItem onSelect={() => openSettings('educator-profile')}>
                  <Lightbulb />
                  Educator profile
                </DropdownMenuItem>
              ) : null}
              {profile.kind === 'educator' ? (
                <DropdownMenuItem onSelect={() => openSettings('educator-availability')}>
                  <CalendarDays />
                  Availability
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem onSelect={() => openSettings('preferences')}>
                <SlidersHorizontal />
                Preferences
              </DropdownMenuItem>
              {profile.kind === 'guardian' ? (
                <DropdownMenuItem onSelect={() => openSettings('family')}>
                  <Users />
                  Family
                </DropdownMenuItem>
              ) : null}
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
        onLogout={onLogout}
        onProfileSave={onProfileSave}
        onChildProfileSave={onChildProfileSave}
        onAccountUpdate={onAccountUpdate}
        onPrefsSave={onPrefsSave}
        onChildThemeSave={onChildThemeSave}
        onLocationSave={onLocationSave}
        onAvatarUpload={onAvatarUpload}
        onAvatarRemove={onAvatarRemove}
        onNotificationPreferenceSave={onNotificationPreferenceSave}
        onFamilyInviteCreate={onFamilyInviteCreate}
        onFamilyInviteRemove={onFamilyInviteRemove}
        onChildProfileCreate={onChildProfileCreate}
        onFamilyMemberRemove={onFamilyMemberRemove}
        onEducatorProfileSave={onEducatorProfileSave}
        onEducatorAvailabilitySave={onEducatorAvailabilitySave}
        onStaffProfileSave={onStaffProfileSave}
        onboardingStep={onboardingStatus?.currentStep ?? null}
        onOnboardingComplete={onOnboardingComplete}
      />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
