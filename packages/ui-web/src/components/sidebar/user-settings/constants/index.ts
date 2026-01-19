import {
  BadgeCheck,
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  Lightbulb,
  MapPin,
  SlidersHorizontal,
  User,
  Users,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import type { OnboardingStep as SharedOnboardingStep } from '@iconicedu/shared-types';

export type UserSettingsTab =
  | 'account'
  | 'profile'
  | 'staff-profile'
  | 'educator-profile'
  | 'educator-availability'
  | 'student-profile'
  | 'preferences'
  | 'location'
  | 'family'
  | 'notifications';

export type OnboardingStep = SharedOnboardingStep;

export const SETTINGS_TABS: Array<{
  value: UserSettingsTab;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}> = [
  { value: 'account', label: 'Account', icon: BadgeCheck },
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'staff-profile', label: 'Staff profile', icon: Briefcase },
  { value: 'educator-profile', label: 'Educator profile', icon: Lightbulb },
  { value: 'educator-availability', label: 'Availability', icon: CalendarDays },
  { value: 'student-profile', label: 'Student profile', icon: BookOpen },
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

export { localeOptions, languageOptions } from './preferences';
export { notificationChannelOptions } from './notifications';
export { postalExamples } from './location';
