import type {
  OnboardingStep,
  UserAccountVM,
  UserProfileVM,
} from '@iconicedu/shared-types';

export function determineOnboardingStep(
  profile: UserProfileVM,
  account?: UserAccountVM | null,
): OnboardingStep | null {
  const hasPhone = Boolean(account?.contacts?.phoneE164?.trim());
  if (!hasPhone) {
    return 'account-phone';
  }

  const firstName = profile.profile.firstName?.trim();
  const lastName = profile.profile.lastName?.trim();
  if (!firstName || !lastName) {
    return 'profile';
  }

  if (!profile.prefs.timezone?.trim()) {
    return 'preferences-timezone';
  }

  const location = profile.location;
  if (!location?.city?.trim() || !location.region?.trim()) {
    return 'location';
  }

  if (profile.kind === 'guardian' && (profile.children?.items?.length ?? 0) === 0) {
    return 'family';
  }

  if (profile.kind === 'child' && (!profile.gradeLevel || !profile.birthYear)) {
    return 'student-profile';
  }

  if (profile.kind === 'educator' && !profile.headline?.trim()) {
    return 'educator-profile';
  }

  if (
    profile.kind === 'staff' &&
    !(profile.department?.trim() || profile.jobTitle?.trim())
  ) {
    return 'staff-profile';
  }

  return null;
}
