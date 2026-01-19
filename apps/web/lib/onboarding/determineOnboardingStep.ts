import {
  DAY_KEYS,
  OnboardingStep,
  UserAccountVM,
  UserProfileVM,
} from '@iconicedu/shared-types';

export function determineOnboardingStep(
  profile: UserProfileVM,
  account?: UserAccountVM | null,
): OnboardingStep | null {
  const hasPhone = Boolean(account?.contacts?.phoneE164?.trim());
  const requiresPhone = profile.kind !== 'child';
  if (!hasPhone && requiresPhone) {
    return 'account-phone';
  }

  const firstName = profile.profile.firstName?.trim();
  const lastName = profile.profile.lastName?.trim();
  if (!firstName || !lastName) {
    return 'profile';
  }

  if (!profile.prefs.timezone?.trim() || profile.prefs.timezone?.trim() === 'UTC') {
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

  if (profile.kind === 'educator') {
    const hasSubjects = Boolean(profile.subjects?.length);
    const hasGrades = Boolean(profile.gradesSupported?.length);
    if (!hasSubjects || !hasGrades) {
      return 'educator-profile';
    }

    const hasAvailability =
      Boolean(profile.availability?.availability) &&
      DAY_KEYS.some(
        (day) => (profile.availability?.availability?.[day]?.length ?? 0) > 0,
      );

    if (!hasAvailability) {
      return 'educator-availability';
    }
  }

  if (profile.kind === 'staff') {
    const hasAvailability =
      Boolean(profile.weeklyAvailability) &&
      DAY_KEYS.some((day) => (profile.weeklyAvailability?.[day]?.length ?? 0) > 0);
    if (!hasAvailability) {
      return 'staff-profile';
    }
  }

  return null;
}
