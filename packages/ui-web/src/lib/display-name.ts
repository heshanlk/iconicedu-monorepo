export type ProfileNameInfo = {
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

const normalize = (value?: string | null) => value?.trim() ?? '';

export function getProfileDisplayName(info?: ProfileNameInfo | null, fallback = 'User'): string {
  if (!info) {
    return fallback;
  }
  const displayName = normalize(info.displayName);
  if (displayName) {
    return displayName;
  }
  const parts = [normalize(info.firstName), normalize(info.lastName)].filter(Boolean);
  if (parts.length) {
    return parts.join(' ');
  }
  return fallback;
}
