'use client';

import * as React from 'react';
import type { UserAccountVM, UserProfileVM } from '@iconicedu/shared-types';
import { useSidebar } from '../../ui/sidebar';
import { cn } from '@iconicedu/ui-web/lib/utils';
import type {
  ProfileAvatarInput,
  ProfileAvatarRemoveInput,
  ProfileSaveInput,
} from './user-settings/profile-tab';
import { ResponsiveDialog } from '../shared/responsive-dialog';
import { UserSettingsTabs } from './user-settings/user-settings-tabs';
import { useOnboardingState } from './user-settings/use-onboarding';
import type { UserSettingsTab } from './user-settings/constants';
export type { UserSettingsTab } from './user-settings/constants';


type UserSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: UserSettingsTab;
  onTabChange: (tab: UserSettingsTab) => void;
  profile: UserProfileVM;
  account?: UserAccountVM | null;
  forceProfileCompletion?: boolean;
  forceAccountCompletion?: boolean;
  onLogout?: () => Promise<void> | void;
  onProfileSave?: (input: ProfileSaveInput) => Promise<void> | void;
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
};

export function UserSettingsDialog({
  open,
  onOpenChange,
  activeTab,
  onTabChange,
  profile,
  account,
  forceProfileCompletion = false,
  forceAccountCompletion = false,
  onLogout,
  onProfileSave,
  onAccountUpdate,
  onPrefsSave,
  onLocationSave,
  onAvatarUpload,
  onAvatarRemove,
}: UserSettingsDialogProps) {
  const {
    onboardingStep,
    onboardingTab,
    shouldLockDialog,
    effectiveForceProfileCompletion,
    handleProfileContinue,
    handlePhoneContinue,
    handleWhatsappContinue,
    handleTimezoneContinue,
    handleLocationContinue,
  } = useOnboardingState({
    forceProfileCompletion,
    forceAccountCompletion,
    profile,
    account,
    activeTab,
    onTabChange,
    onAccountUpdate,
    onPrefsSave,
    onLocationSave,
  });

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (shouldLockDialog && !nextOpen) {
        return;
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange, shouldLockDialog],
  );

  const content = (
    <UserSettingsTabs
      value={onboardingTab ?? activeTab}
      onValueChange={(nextTab) => {
        if (onboardingStep && nextTab !== onboardingTab) {
          return;
        }
        onTabChange(nextTab);
      }}
      profile={profile}
      account={account}
      expandProfileDetails={onboardingStep === 'profile' || effectiveForceProfileCompletion}
      lockTabs={Boolean(onboardingStep)}
      lockedTab={onboardingTab}
      onboardingStep={onboardingStep}
      showLogout={Boolean(onboardingStep)}
      onLogout={onLogout}
      onProfileSave={onProfileSave}
      onAvatarUpload={onAvatarUpload}
      onAvatarRemove={onAvatarRemove}
      onProfileContinue={handleProfileContinue}
      onPhoneContinue={handlePhoneContinue}
      onWhatsappContinue={handleWhatsappContinue}
      onTimezoneContinue={handleTimezoneContinue}
      onLocationContinue={handleLocationContinue}
    />
  );
  const { isMobile } = useSidebar();

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Settings"
      description="Manage account, billing, and notification preferences."
      dialogContentClassName="h-[85vh] max-w-[calc(100vw-32px)] p-0 sm:max-w-[680px]"
      drawerContentClassName="h-[85vh] w-full max-w-none flex flex-col overflow-hidden bg-background p-0 rounded-t-xl before:inset-0 before:rounded-t-xl"
      dialogHeaderClassName="p-6"
      drawerHeaderClassName="items-start"
      containerClassName="h-full"
      bodyClassName={cn(isMobile ? 'px-4 pb-4' : 'px-6 pb-6')}
      dialogShowCloseButton={!shouldLockDialog}
    >
      {content}
    </ResponsiveDialog>
  );
}
