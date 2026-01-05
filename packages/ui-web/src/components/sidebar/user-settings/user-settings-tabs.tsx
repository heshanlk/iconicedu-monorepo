import * as React from 'react';
import { LogOut } from 'lucide-react';

import type { ThemeKey, UserAccountVM, UserProfileVM } from '@iconicedu/shared-types';
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
  type ProfileSaveInput,
} from './profile-tab';
import {
  PROFILE_THEME_OPTIONS,
  SETTINGS_TABS,
  type OnboardingStep,
  type UserSettingsTab,
} from './constants';

export type UserSettingsTabsProps = {
  value: UserSettingsTab;
  onValueChange: (tab: UserSettingsTab) => void;
  profile: UserProfileVM;
  account?: UserAccountVM | null;
  expandProfileDetails?: boolean;
  lockTabs?: boolean;
  lockedTab?: UserSettingsTab | null;
  onboardingStep?: OnboardingStep | null;
  showLogout?: boolean;
  onLogout?: () => Promise<void> | void;
  onProfileSave?: (input: ProfileSaveInput) => Promise<void> | void;
  onAvatarUpload?: (input: ProfileAvatarInput) => Promise<void> | void;
  onProfileContinue?: () => void;
  onPhoneContinue?: (phone: string) => Promise<void> | void;
  onWhatsappContinue?: (whatsapp: string) => Promise<void> | void;
  onTimezoneContinue?: (
    timezone: string,
    locale: string | null,
    languagesSpoken: string[] | null,
  ) => Promise<void> | void;
  onLocationContinue?: (input: {
    city: string;
    region: string;
    postalCode: string;
    countryCode?: string | null;
    countryName?: string | null;
  }) => Promise<void> | void;
};

export function UserSettingsTabs({
  value,
  onValueChange,
  profile,
  account,
  expandProfileDetails = false,
  lockTabs = false,
  lockedTab = null,
  onboardingStep = null,
  showLogout = false,
  onLogout,
  onProfileSave,
  onAvatarUpload,
  onProfileContinue,
  onPhoneContinue,
  onWhatsappContinue,
  onTimezoneContinue,
  onLocationContinue,
}: UserSettingsTabsProps) {
  const { isMobile } = useSidebar();
  const activeValue = lockTabs ? lockedTab ?? 'profile' : value;
  const showOnboardingToast = Boolean(onboardingStep);
  const profileBlock = profile.profile;
  const prefs = profile.prefs;
  const contacts = account?.contacts;
  const hasPhone = Boolean(contacts?.phoneE164?.trim());
  const expandPhone = onboardingStep === 'account-phone' && !hasPhone;
  const expandWhatsapp = onboardingStep === 'account-whatsapp';
  const expandTimezone = onboardingStep === 'preferences-timezone';
  const expandLocation = onboardingStep === 'location';
  const showFamilyOnboardingToast = onboardingStep === 'family';
  const email = contacts?.email ?? '';
  const preferredChannels =
    contacts?.preferredContactChannels && contacts.preferredContactChannels.length > 0
      ? contacts.preferredContactChannels
      : ['email'];
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
  const requiresPhone = lockTabs && lockedTab === 'account';

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
      value={activeValue}
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
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isLocked = lockTabs && tab.value !== (lockedTab ?? 'profile');
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                disabled={isLocked}
                className={cn(
                  'gap-2 after:hidden data-[state=active]:bg-muted/50',
                  isLocked && 'opacity-50',
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
          {showLogout ? (
            <div className="mt-2 flex w-full flex-col gap-2">
              <div className="h-px w-full bg-border/70" />
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          ) : null}
        </TabsList>

        <ScrollArea className={cn('min-h-0 flex-1 w-full min-w-0', isMobile && 'flex-1')}>
          <TabsContent value="profile" className="mt-0 space-y-8 w-full px-1">
            <ProfileTab
              profile={profile}
              profileBlock={profileBlock}
              currentThemeKey={currentThemeKey}
              childProfile={childProfile}
              educatorProfile={educatorProfile}
              staffProfile={staffProfile}
              formatGradeLevel={formatGradeLevel}
              expandProfileDetails={expandProfileDetails}
              primaryActionLabel={lockTabs && lockedTab === 'profile' ? 'Continue' : 'Save'}
              onPrimaryActionComplete={onProfileContinue}
              onProfileSave={onProfileSave}
              onAvatarUpload={onAvatarUpload}
            />
          </TabsContent>

          <TabsContent value="account" className="mt-0 space-y-8 w-full px-1">
            <AccountTab
              contacts={contacts}
              email={email}
              preferredChannelSelections={preferredChannelSelections}
              togglePreferredChannel={togglePreferredChannel}
              requirePhone={requiresPhone}
              expandPhone={expandPhone}
              expandWhatsapp={expandWhatsapp}
              showOnboardingToast={showOnboardingToast}
              onPhoneContinue={onPhoneContinue}
              onWhatsappContinue={onWhatsappContinue}
            />
          </TabsContent>

          <TabsContent value="preferences" className="mt-0 space-y-8 w-full px-1">
            <PreferencesTab
              currentThemeKey={currentThemeKey}
              currentThemeLabel={currentThemeLabel}
              profileId={profile.ids.id}
              prefs={prefs}
              profileThemeOptions={PROFILE_THEME_OPTIONS}
              setProfileThemes={setProfileThemes}
              showOnboardingToast={showOnboardingToast}
              expandTimezone={expandTimezone}
              onTimezoneContinue={onTimezoneContinue}
            />
          </TabsContent>

          <TabsContent value="location" className="mt-0 space-y-8 w-full px-1">
            <LocationTab
              location={location}
              showOnboardingToast={showOnboardingToast}
              expandLocation={expandLocation}
              onLocationContinue={onLocationContinue}
            />
          </TabsContent>

          <TabsContent value="family" className="mt-0 space-y-8 w-full px-1">
            <FamilyTab
              familyMembers={familyMembers}
              profileThemes={profileThemes}
              profileThemeOptions={PROFILE_THEME_OPTIONS}
              setProfileThemes={setProfileThemes}
              showOnboardingToast={showFamilyOnboardingToast}
            />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 space-y-8 w-full px-1">
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
