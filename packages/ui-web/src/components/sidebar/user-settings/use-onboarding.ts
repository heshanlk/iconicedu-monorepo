import * as React from 'react';

import type { UserAccountVM, UserProfileVM } from '@iconicedu/shared-types';

import type { OnboardingStep, UserSettingsTab } from './constants';

export function useOnboardingState(input: {
  forceProfileCompletion: boolean;
  forceAccountCompletion: boolean;
  profile: UserProfileVM;
  account?: UserAccountVM | null;
  activeTab: UserSettingsTab;
  onTabChange: (tab: UserSettingsTab) => void;
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
}) {
  const isProfileComplete = Boolean(
    input.profile.profile.firstName?.trim() &&
      input.profile.profile.lastName?.trim(),
  );
  const isAccountComplete = Boolean(
    input.account?.contacts.phoneE164 && input.account?.contacts.phoneVerified,
  );
  const effectiveForceProfileCompletion =
    input.forceProfileCompletion && !isProfileComplete;
  const effectiveForceAccountCompletion =
    input.forceAccountCompletion && !isAccountComplete;

  const [onboardingStep, setOnboardingStep] = React.useState<OnboardingStep | null>(
    effectiveForceProfileCompletion
      ? 'profile'
      : effectiveForceAccountCompletion
        ? 'account-phone'
        : null,
  );

  React.useEffect(() => {
    if (onboardingStep) {
      return;
    }
    if (effectiveForceProfileCompletion) {
      setOnboardingStep('profile');
      return;
    }
    if (effectiveForceAccountCompletion) {
      setOnboardingStep('account-phone');
    }
  }, [
    effectiveForceAccountCompletion,
    effectiveForceProfileCompletion,
    onboardingStep,
  ]);

  const shouldLockDialog = Boolean(
    onboardingStep || effectiveForceProfileCompletion || effectiveForceAccountCompletion,
  );

  const onboardingTab: UserSettingsTab | null = onboardingStep
    ? onboardingStep === 'profile'
      ? 'profile'
      : onboardingStep.startsWith('account')
        ? 'account'
        : onboardingStep === 'preferences-timezone'
          ? 'preferences'
          : onboardingStep === 'location'
            ? 'location'
            : onboardingStep === 'family'
              ? 'family'
              : input.activeTab
    : null;

  const handleProfileContinue = React.useCallback(() => {
    setOnboardingStep('account-phone');
    input.onTabChange('account');
  }, [input]);

  const handlePhoneContinue = React.useCallback(
    async (phone: string) => {
      if (!input.account || !input.onAccountUpdate) {
        setOnboardingStep('account-whatsapp');
        return;
      }
      await input.onAccountUpdate({
        accountId: input.account.ids.id,
        orgId: input.account.ids.orgId,
        phoneE164: phone,
        phoneVerified: true,
      });
      setOnboardingStep('account-whatsapp');
    },
    [input],
  );

  const handleWhatsappContinue = React.useCallback(
    async (whatsapp: string) => {
      if (!input.account || !input.onAccountUpdate) {
        setOnboardingStep('preferences-timezone');
        input.onTabChange('preferences');
        return;
      }
      await input.onAccountUpdate({
        accountId: input.account.ids.id,
        orgId: input.account.ids.orgId,
        whatsappE164: whatsapp,
        whatsappVerified: true,
      });
      setOnboardingStep('preferences-timezone');
      input.onTabChange('preferences');
    },
    [input],
  );

  const handleTimezoneContinue = React.useCallback(
    async (timezone: string | undefined, locale?: string | null, languagesSpoken?: string[] | null) => {
      if (!input.onPrefsSave) {
        setOnboardingStep('location');
        input.onTabChange('location');
        return;
      }
      await input.onPrefsSave({
        profileId: input.profile.ids.id,
        orgId: input.profile.ids.orgId,
        timezone,
        locale,
        languagesSpoken,
      });
      setOnboardingStep('location');
      input.onTabChange('location');
    },
    [input],
  );

  const handleLocationContinue = React.useCallback(
    async (locationInput: {
      city: string;
      region: string;
      postalCode: string;
      countryCode?: string | null;
      countryName?: string | null;
    }) => {
      if (input.onLocationSave) {
        await input.onLocationSave({
          profileId: input.profile.ids.id,
          orgId: input.profile.ids.orgId,
          ...locationInput,
        });
      }
      if (input.profile.kind === 'guardian') {
        setOnboardingStep('family');
        input.onTabChange('family');
      } else {
        setOnboardingStep(null);
      }
    },
    [input],
  );

  return {
    onboardingStep,
    onboardingTab,
    shouldLockDialog,
    effectiveForceProfileCompletion,
    effectiveForceAccountCompletion,
    isProfileComplete,
    isAccountComplete,
    handleProfileContinue,
    handlePhoneContinue,
    handleWhatsappContinue,
    handleTimezoneContinue,
    handleLocationContinue,
  };
}
