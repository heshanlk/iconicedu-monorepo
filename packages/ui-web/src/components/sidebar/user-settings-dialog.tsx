'use client';

import * as React from 'react';
import type {
  ChildProfileSaveInput,
  EducatorProfileSaveInput,
  FamilyLinkInviteRole,
  FamilyLinkInviteVM,
  StaffProfileSaveInput,
  ThemeKey,
  UserAccountVM,
  UserProfileVM,
} from '@iconicedu/shared-types';
import { useSidebar } from '../../ui/sidebar';
import { cn } from '@iconicedu/ui-web/lib/utils';
import type {
  ProfileAvatarInput,
  ProfileAvatarRemoveInput,
  ProfileSaveInput,
} from './user-settings/profile-tab';
import { ResponsiveDialog } from '../shared/responsive-dialog';
import { UserSettingsTabs } from './user-settings/user-settings-tabs';
import { OnboardingStep, type UserSettingsTab } from './user-settings/constants';

export const ONBOARDING_STEP_TO_TAB: Record<OnboardingStep, UserSettingsTab> = {
  'account-phone': 'account',
  profile: 'profile',
  'preferences-timezone': 'preferences',
  location: 'location',
  family: 'family',
  'student-profile': 'student-profile',
  'educator-profile': 'educator-profile',
  'staff-profile': 'staff-profile',
};
export type { UserSettingsTab } from './user-settings/constants';


type UserSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: UserSettingsTab;
  onTabChange: (tab: UserSettingsTab) => void;
  profile: UserProfileVM;
  account?: UserAccountVM | null;
  onLogout?: () => Promise<void> | void;
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
    themeKey?: ThemeKey | null;
  }) => Promise<void> | void;
  onFamilyMemberRemove?: (input: { childAccountId: string }) => Promise<void> | void;
  onEducatorProfileSave?: (input: EducatorProfileSaveInput) => Promise<void> | void;
  onStaffProfileSave?: (input: StaffProfileSaveInput) => Promise<void> | void;
  onboardingStep?: OnboardingStep | null;
  onOnboardingComplete?: () => void;
};

export function UserSettingsDialog({
  open,
  onOpenChange,
  activeTab,
  onTabChange,
  profile,
  account,
  onLogout,
  onProfileSave,
  onChildProfileSave,
  onAccountUpdate,
  onPrefsSave,
  onChildThemeSave,
  onNotificationPreferenceSave,
  onLocationSave,
  onAvatarUpload,
  onAvatarRemove,
  onFamilyInviteCreate,
  onFamilyInviteRemove,
  onChildProfileCreate,
  onFamilyMemberRemove,
  onEducatorProfileSave,
  onStaffProfileSave,
  onboardingStep,
  onOnboardingComplete,
}: UserSettingsDialogProps) {
  const handleLocationContinue = React.useCallback(
    (input: {
      city: string;
      region: string;
      postalCode: string;
      countryCode?: string | null;
      countryName?: string | null;
    }) => {
      if (!onLocationSave) {
        return;
      }
      return onLocationSave({
        profileId: profile.ids.id,
        orgId: profile.ids.orgId,
        ...input,
      });
    },
    [onLocationSave, profile.ids.id, profile.ids.orgId],
  );
  const [scrollToken, setScrollToken] = React.useState(0);
  const lastStepRef = React.useRef<OnboardingStep | null>(null);
  const onboardingStartedRef = React.useRef(false);

  React.useEffect(() => {
    if (!open) {
      onboardingStartedRef.current = false;
      lastStepRef.current = null;
      setScrollToken(0);
      return;
    }

    if (!onboardingStep) {
      return;
    }

    onboardingStartedRef.current = true;
    if (lastStepRef.current !== onboardingStep) {
      setScrollToken((prev) => prev + 1);
      lastStepRef.current = onboardingStep;
    }
  }, [open, onboardingStep]);

  React.useEffect(() => {
    if (!open || !onboardingStartedRef.current) {
      return;
    }
    if (!onboardingStep) {
      const stayOpenOnFamilyTab = activeTab === 'family';
      onOnboardingComplete?.();
      onboardingStartedRef.current = false;
      if (stayOpenOnFamilyTab) {
        return;
      }
      onOpenChange(false);
    }
  }, [activeTab, open, onboardingStep, onOpenChange, onOnboardingComplete]);

  React.useEffect(() => {
    if (!open || !onboardingStep) {
      return;
    }
    const targetTab = ONBOARDING_STEP_TO_TAB[onboardingStep];
    if (targetTab && targetTab !== activeTab) {
      onTabChange(targetTab);
    }
  }, [activeTab, onboardingStep, onTabChange, open]);

  const shouldBlockOnboarding = onboardingStartedRef.current && Boolean(onboardingStep);
  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (shouldBlockOnboarding && !nextOpen) {
        return;
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange, shouldBlockOnboarding],
  );

  const content = (
      <UserSettingsTabs
        value={activeTab}
        onValueChange={onTabChange}
        profile={profile}
        account={account}
        onLogout={onLogout}
        onProfileSave={onProfileSave}
        onChildProfileSave={onChildProfileSave}
        onAvatarUpload={onAvatarUpload}
        onAvatarRemove={onAvatarRemove}
        onPrefsSave={onPrefsSave}
        onChildThemeSave={onChildThemeSave}
        onNotificationPreferenceSave={onNotificationPreferenceSave}
        onLocationContinue={handleLocationContinue}
        onAccountUpdate={onAccountUpdate}
        onFamilyInviteCreate={onFamilyInviteCreate}
        onFamilyInviteRemove={onFamilyInviteRemove}
        onChildProfileCreate={onChildProfileCreate}
        onFamilyMemberRemove={onFamilyMemberRemove}
        onEducatorProfileSave={onEducatorProfileSave}
        onStaffProfileSave={onStaffProfileSave}
        onboardingStep={onboardingStep}
        scrollToken={scrollToken}
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
      dialogShowCloseButton={!shouldBlockOnboarding}
      bodyClassName={cn(isMobile ? 'px-4 pb-4' : 'px-6 pb-6')}
    >
      {content}
    </ResponsiveDialog>
  );
}
