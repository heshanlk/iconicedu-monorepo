import * as React from 'react';
import { LogOut } from 'lucide-react';

import type {
  ChildProfileSaveInput,
  FamilyLinkInviteRole,
  FamilyLinkInviteVM,
  ThemeKey,
  UserAccountVM,
  UserProfileVM,
} from '@iconicedu/shared-types';
import { ScrollArea } from '../../../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { useSidebar } from '../../../ui/sidebar';
import { cn } from '@iconicedu/ui-web/lib/utils';
import { AccountTab } from './account-tab';
import { FamilyTab } from './family-tab';
import { LocationTab } from './location-tab';
import { NotificationsTab } from './notifications-tab';
import { PreferencesTab } from './preferences-tab';
import {
  ProfileTab,
  type ProfileAvatarInput,
  type ProfileAvatarRemoveInput,
  type ProfileSaveInput,
} from './profile-tab';
import { StudentProfileTab } from './student-profile-tab';
import {
  PROFILE_THEME_OPTIONS,
  SETTINGS_TABS,
  type UserSettingsTab,
} from './constants';

export type UserSettingsTabsProps = {
  value: UserSettingsTab;
  onValueChange: (tab: UserSettingsTab) => void;
  profile: UserProfileVM;
  account?: UserAccountVM | null;
  onLogout?: () => Promise<void> | void;
  onProfileSave?: (input: ProfileSaveInput) => Promise<void> | void;
  onChildProfileSave?: (input: ChildProfileSaveInput) => Promise<void> | void;
  onAvatarUpload?: (input: ProfileAvatarInput) => Promise<void> | void;
  onAvatarRemove?: (input: ProfileAvatarRemoveInput) => Promise<void> | void;
  onPrefsSave?: (input: {
    profileId: string;
    orgId: string;
    timezone?: string;
    locale?: string | null;
    languagesSpoken?: string[] | null;
    themeKey?: string | null;
  }) => Promise<void> | void;
  onNotificationPreferenceSave?: (input: {
    profileId: string;
    orgId: string;
    prefKey: string;
    channels: string[];
    muted?: boolean | null;
  }) => Promise<void> | void;
  onLocationContinue?: (input: {
    city: string;
    region: string;
    postalCode: string;
    countryCode?: string | null;
    countryName?: string | null;
  }) => Promise<void> | void;
  onAccountUpdate?: (input: {
    accountId: string;
    orgId: string;
    phoneE164?: string | null;
    whatsappE164?: string | null;
    preferredContactChannels?: string[] | null;
  }) => Promise<void> | void;
  onFamilyInviteCreate?: (input: {
    invitedRole: FamilyLinkInviteRole;
    invitedEmail: string;
  }) => Promise<FamilyLinkInviteVM> | void;
  onFamilyInviteRemove?: (input: { inviteId: string }) => Promise<void> | void;
};

export function UserSettingsTabs({
  value,
  onValueChange,
  profile,
  account,
  onLogout,
  onProfileSave,
  onChildProfileSave,
  onAvatarUpload,
  onAvatarRemove,
  onPrefsSave,
  onNotificationPreferenceSave,
  onLocationContinue,
  onAccountUpdate,
  onFamilyInviteCreate,
  onFamilyInviteRemove,
}: UserSettingsTabsProps) {
  const { isMobile } = useSidebar();
  const [scrollToken, setScrollToken] = React.useState(0);
  const profileBlock = profile.profile;
  const prefs = profile.prefs;
  const contacts = account?.contacts;
  const email = contacts?.email ?? '';
  const preferredChannels = contacts?.preferredContactChannels ?? ['email'];
  const location = profile.location;
  const roles = account?.access?.userRoles ?? [];
  const [profileThemes, setProfileThemes] = React.useState<Record<string, ThemeKey>>({});
  const [preferredChannelSelections, setPreferredChannelSelections] =
    React.useState<string[]>(preferredChannels);
  const currentThemeKey = profileThemes[profile.ids.id] ?? profile.ui?.themeKey ?? 'teal';
  const currentThemeLabel =
    PROFILE_THEME_OPTIONS.find((option) => option.value === currentThemeKey)?.label ??
    'Accent color';
  const isGuardianOrAdmin =
    profile.kind === 'guardian' ||
    roles.some((role) => role.roleKey === 'admin' || role.roleKey === 'owner');
  const childProfile = profile.kind === 'child' ? profile : null;
  const educatorProfile = profile.kind === 'educator' ? profile : null;
  const staffProfile = profile.kind === 'staff' ? profile : null;
  React.useEffect(() => {
    setScrollToken((prev) => prev + 1);
  }, [value]);

  const togglePreferredChannel = React.useCallback(
    (channel: string, enabled: boolean) => {
      const nextChannels = enabled
        ? preferredChannelSelections.includes(channel)
          ? preferredChannelSelections
          : [...preferredChannelSelections, channel]
        : preferredChannelSelections.filter((item) => item !== channel);

      setPreferredChannelSelections(nextChannels);
      if (account?.contacts && onAccountUpdate) {
        const accountId = account.ids.id;
        const orgId = account.ids.orgId;
        void onAccountUpdate({
          accountId,
          orgId,
          preferredContactChannels: nextChannels,
        });
      }
    },
    [account, onAccountUpdate, preferredChannelSelections],
  );
  const [notificationChannels, setNotificationChannels] = React.useState<
    Record<string, string[]>
  >(() => {
    if (!prefs.notificationDefaults) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(prefs.notificationDefaults).map(([key, value]) => [
        key,
        value?.channels ?? [],
      ]),
    );
  });
  const guardianChildren =
    profile.kind === 'guardian' ? (profile.children?.items ?? []) : [];
  const familyMembers = React.useMemo(() => {
    const members: Array<{
      id: string;
      name: string;
      firstName?: string | null;
      lastName?: string | null;
      email?: string;
      avatar?: UserProfileVM['profile']['avatar'] | null;
      roleLabel: string;
      canRemove: boolean;
      themeKey: ThemeKey;
    }> = [];

    members.push({
      id: profile.ids.id,
      name: profileBlock.displayName,
      firstName: profileBlock.firstName ?? undefined,
      lastName: profileBlock.lastName ?? undefined,
      email: contacts?.email ?? undefined,
      avatar: profileBlock.avatar,
      roleLabel: 'Myself',
      canRemove: false,
      themeKey: profile.ui?.themeKey ?? 'teal',
    });

    guardianChildren.forEach((childProfile) => {
      members.push({
        id: childProfile.ids.id,
        name: childProfile.profile.displayName ?? 'Child',
        firstName: childProfile.profile.firstName ?? undefined,
        lastName: childProfile.profile.lastName ?? undefined,
        email: undefined,
        avatar: childProfile.profile.avatar ?? null,
        roleLabel: 'Child',
        canRemove: true,
        themeKey: childProfile.ui?.themeKey ?? 'teal',
      });
    });

    return members;
  }, [
    profile.ids.id,
    profileBlock.avatar,
    profileBlock.displayName,
    contacts?.email,
    profile.ui?.themeKey,
    guardianChildren,
  ]);
  const availableTabs = SETTINGS_TABS.filter((tab) =>
    tab.value === 'student-profile' ? profile.kind === 'child' : true,
  );

  return (
    <Tabs
      value={value}
      onValueChange={(next: string) => onValueChange(next as UserSettingsTab)}
      orientation={isMobile ? 'horizontal' : 'vertical'}
      className="w-full h-full"
    >
      <div
        className={cn(
          isMobile
            ? 'flex min-h-0 flex-1 flex-col gap-4 w-full'
            : 'grid min-h-0 h-full w-full grid-cols-[180px_1fr] gap-6',
        )}
      >
        <TabsList
          variant="line"
          className={cn(
            'bg-transparent p-0',
            isMobile
              ? 'w-full flex-nowrap justify-start gap-2 overflow-x-auto sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70'
              : 'w-full flex-col items-stretch',
          )}
        >
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="gap-2 after:hidden data-[state=active]:bg-muted/50"
              >
                <Icon className="size-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <ScrollArea className={cn('min-h-0 flex-1 w-full min-w-0', isMobile && 'flex-1')}>
        <TabsContent value="profile" className="mt-0 space-y-8 w-full px-1">
          <ProfileTab
            profile={profile}
            profileBlock={profileBlock}
            educatorProfile={educatorProfile}
              staffProfile={staffProfile}
              scrollToRequired={value === 'profile'}
              scrollToken={scrollToken}
            onProfileSave={onProfileSave}
            onAvatarUpload={onAvatarUpload}
            onAvatarRemove={onAvatarRemove}
          />
        </TabsContent>
        {childProfile ? (
          <TabsContent value="student-profile" className="mt-0 space-y-8 w-full px-1">
            <StudentProfileTab
              childProfile={childProfile}
              onChildProfileSave={onChildProfileSave}
            />
          </TabsContent>
        ) : null}

          <TabsContent value="account" className="mt-0 space-y-8 w-full px-1">
            <AccountTab
              contacts={contacts}
              email={email}
              preferredChannelSelections={preferredChannelSelections}
              togglePreferredChannel={togglePreferredChannel}
              scrollToRequired={value === 'account'}
              scrollToken={scrollToken}
              accountId={account?.ids.id}
              orgId={account?.ids.orgId}
              onAccountUpdate={onAccountUpdate}
            />
          </TabsContent>

          <TabsContent value="preferences" className="mt-0 space-y-8 w-full px-1">
            <PreferencesTab
              currentThemeKey={currentThemeKey}
              currentThemeLabel={currentThemeLabel}
              profileId={profile.ids.id}
              orgId={profile.ids.orgId}
              prefs={prefs}
              profileThemeOptions={PROFILE_THEME_OPTIONS}
              setProfileThemes={setProfileThemes}
              scrollToRequired={value === 'preferences'}
              scrollToken={scrollToken}
              onPrefsSave={onPrefsSave}
            />
          </TabsContent>

          <TabsContent value="location" className="mt-0 space-y-8 w-full px-1">
            <LocationTab
              location={location}
              scrollToRequired={value === 'location'}
              scrollToken={scrollToken}
              onLocationContinue={onLocationContinue}
            />
          </TabsContent>

          <TabsContent value="family" className="mt-0 space-y-8 w-full px-1">
          <FamilyTab
            familyMembers={familyMembers}
            profileThemes={profileThemes}
            profileThemeOptions={PROFILE_THEME_OPTIONS}
            setProfileThemes={setProfileThemes}
            initialInvites={
              profile.kind === 'guardian' ? profile.familyInvites ?? [] : []
            }
            onInviteCreate={onFamilyInviteCreate}
            onInviteRemove={onFamilyInviteRemove}
          />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 space-y-8 w-full px-1">
            <NotificationsTab
              isGuardianOrAdmin={isGuardianOrAdmin}
              notificationChannels={notificationChannels}
              onNotificationChannelsChange={setNotificationChannels}
              profileId={profile.ids.id}
              orgId={profile.ids.orgId}
              onNotificationPreferenceSave={onNotificationPreferenceSave}
            />
          </TabsContent>
        </ScrollArea>
      </div>
    </Tabs>
  );
}
