import {
  BadgeCheck,
  Bell,
  MapPin,
  SlidersHorizontal,
  User,
  Users,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

export type UserSettingsTab =
  | 'account'
  | 'profile'
  | 'preferences'
  | 'location'
  | 'family'
  | 'notifications';

export type OnboardingStep =
  | 'profile'
  | 'account-phone'
  | 'account-whatsapp'
  | 'preferences-timezone'
  | 'location'
  | 'family';

export const SETTINGS_TABS: Array<{
  value: UserSettingsTab;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}> = [
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'account', label: 'Account', icon: BadgeCheck },
  { value: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { value: 'location', label: 'Location', icon: MapPin },
  { value: 'family', label: 'Family', icon: Users },
  { value: 'notifications', label: 'Notifications', icon: Bell },
];

export const PROFILE_THEME_OPTIONS = [
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
