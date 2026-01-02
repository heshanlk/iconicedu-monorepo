'use client';

import * as React from 'react';
import { BadgeCheck, Bell, MapPin, SlidersHorizontal, User, Users } from 'lucide-react';

import type { ThemeKey, UserAccountVM, UserProfileVM } from '@iconicedu/shared-types';
import { ScrollArea } from '../../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { useSidebar } from '../../ui/sidebar';
import { cn } from '@iconicedu/ui-web/lib/utils';
import { AccountTab } from './user-settings/account-tab';
import { FamilyTab } from './user-settings/family-tab';
import { LocationTab } from './user-settings/location-tab';
import { NotificationsTab } from './user-settings/notifications-tab';
import { PreferencesTab } from './user-settings/preferences-tab';
import { ProfileTab } from './user-settings/profile-tab';
import { ResponsiveDialog } from '../shared/responsive-dialog';

export type UserSettingsTab =
  | 'account'
  | 'profile'
  | 'preferences'
  | 'location'
  | 'family'
  | 'notifications';

const SETTINGS_TABS: Array<{
  value: UserSettingsTab;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = [
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'account', label: 'Account', icon: BadgeCheck },
  { value: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { value: 'location', label: 'Location', icon: MapPin },
  { value: 'family', label: 'Family', icon: Users },
  { value: 'notifications', label: 'Notifications', icon: Bell },
];

const PROFILE_THEME_OPTIONS = [
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' },
  { value: 'amber', label: 'Amber' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'lime', label: 'Lime' },
  { value: 'green', label: 'Green' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'teal', label: 'Teal' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'sky', label: 'Sky' },
  { value: 'blue', label: 'Blue' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'violet', label: 'Violet' },
  { value: 'purple', label: 'Purple' },
  { value: 'fuchsia', label: 'Fuchsia' },
  { value: 'pink', label: 'Pink' },
  { value: 'rose', label: 'Rose' },
];

type UserSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: UserSettingsTab;
  onTabChange: (tab: UserSettingsTab) => void;
  profile: UserProfileVM;
  account?: UserAccountVM | null;
};

export function UserSettingsDialog({
  open,
  onOpenChange,
  activeTab,
  onTabChange,
  profile,
  account,
}: UserSettingsDialogProps) {
  const content = (
    <UserSettingsTabs
      value={activeTab}
      onValueChange={onTabChange}
      profile={profile}
      account={account}
    />
  );
  const { isMobile } = useSidebar();

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Settings"
      description="Manage account, billing, and notification preferences."
      dialogContentClassName="h-[85vh] max-w-[calc(100vw-32px)] p-0 sm:max-w-[680px]"
      drawerContentClassName="h-[85vh] w-full max-w-none flex flex-col overflow-hidden bg-background p-0 rounded-t-xl before:inset-0 before:rounded-t-xl"
      dialogHeaderClassName="p-6"
      drawerHeaderClassName="items-start"
      containerClassName="h-full"
      bodyClassName={cn(isMobile ? 'px-4 pb-4' : 'px-6 pb-6')}
      dialogShowCloseButton
    >
      {content}
    </ResponsiveDialog>
  );
}

type UserSettingsTabsProps = {
  value: UserSettingsTab;
  onValueChange: (tab: UserSettingsTab) => void;
  profile: UserProfileVM;
  account?: UserAccountVM | null;
};

function UserSettingsTabs({
  value,
  onValueChange,
  profile,
  account,
}: UserSettingsTabsProps) {
  const { isMobile } = useSidebar();
  const profileBlock = profile.profile;
  const prefs = profile.prefs;
  const contacts = account?.contacts;
  const email = contacts?.email ?? '';
  const preferredChannels = contacts?.preferredContactChannels ?? [];
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

  const togglePreferredChannel = (channel: string, enabled: boolean) => {
    setPreferredChannelSelections((prev) => {
      if (enabled) {
        return prev.includes(channel) ? prev : [...prev, channel];
      }
      return prev.filter((item) => item !== channel);
    });
  };
  const formatGradeLevel = (gradeLevel?: { id: string | number; label: string } | null) =>
    gradeLevel?.label ?? 'Not set';
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
      email?: string;
      avatar?: UserProfileVM['profile']['avatar'] | null;
      roleLabel: string;
      canRemove: boolean;
      themeKey: ThemeKey;
    }> = [];

    members.push({
      id: profile.ids.id,
      name: profileBlock.displayName,
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

  return (
    <Tabs
      value={value}
      onValueChange={(next) => onValueChange(next as UserSettingsTab)}
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
          {SETTINGS_TABS.map((tab) => {
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
          <TabsContent value="profile" className="mt-0 space-y-8 w-full">
            <ProfileTab
              profile={profile}
              profileBlock={profileBlock}
              currentThemeKey={currentThemeKey}
              childProfile={childProfile}
              educatorProfile={educatorProfile}
              staffProfile={staffProfile}
              formatGradeLevel={formatGradeLevel}
            />
          </TabsContent>

          <TabsContent value="account" className="mt-0 space-y-8 w-full">
            <AccountTab
              contacts={contacts}
              email={email}
              preferredChannelSelections={preferredChannelSelections}
              togglePreferredChannel={togglePreferredChannel}
            />
          </TabsContent>

          <TabsContent value="preferences" className="mt-0 space-y-8 w-full">
            <PreferencesTab
              currentThemeKey={currentThemeKey}
              currentThemeLabel={currentThemeLabel}
              profileId={profile.ids.id}
              prefs={prefs}
              profileThemeOptions={PROFILE_THEME_OPTIONS}
              setProfileThemes={setProfileThemes}
            />
          </TabsContent>

          <TabsContent value="location" className="mt-0 space-y-8 w-full">
            <LocationTab location={location} />
          </TabsContent>

          <TabsContent value="family" className="mt-0 space-y-8 w-full">
            <FamilyTab
              familyMembers={familyMembers}
              profileThemes={profileThemes}
              profileThemeOptions={PROFILE_THEME_OPTIONS}
              setProfileThemes={setProfileThemes}
            />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 space-y-8 w-full">
            <NotificationsTab
              isGuardianOrAdmin={isGuardianOrAdmin}
              notificationChannels={notificationChannels}
              onNotificationChannelsChange={setNotificationChannels}
            />
          </TabsContent>
        </ScrollArea>
      </div>
    </Tabs>
  );
}
