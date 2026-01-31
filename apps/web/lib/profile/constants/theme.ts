import type { ThemeKey } from '@iconicedu/shared-types';

export const THEME_KEYS: ThemeKey[] = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'amber',
  'blue',
  'cyan',
  'emerald',
  'fuchsia',
  'green',
  'indigo',
  'lime',
  'orange',
  'pink',
  'purple',
  'red',
  'rose',
  'sky',
  'teal',
  'violet',
  'yellow',
];

export const THEME_KEY_SET = new Set(THEME_KEYS);

export const AVATAR_BUCKET = 'public-avatars';
export const AVATAR_SIGNED_URL_TTL = 60 * 60;

export const pickRandomThemeKey = () =>
  THEME_KEYS[Math.floor(Math.random() * THEME_KEYS.length)] ?? 'teal';
