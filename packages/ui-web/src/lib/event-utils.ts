import type { CalendarEvent } from '@iconicedu/shared-types';

function parseTimeToDate(timeString: string, baseDate: Date): Date {
  const [timeStr, period] = timeString.split(' ');
  const [hours, minutes] = timeStr.split(':').map(Number);

  const date = new Date(baseDate);
  let hour = hours;

  // Handle 12-hour to 24-hour conversion
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  date.setHours(hour, minutes || 0, 0, 0);
  return date;
}

export function isEventLive(event: CalendarEvent): boolean {
  const now = new Date();
  const startTime = parseTimeToDate(event.startTime, event.date);
  const endTime = parseTimeToDate(event.endTime, event.date);

  return now >= startTime && now <= endTime;
}

export const colorVariants = {
  blue:
    'border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100 dark:border-blue-400/40 dark:bg-blue-500/20 dark:text-blue-100 dark:hover:bg-blue-500/30',
  pink:
    'border-pink-200 bg-pink-50 text-pink-900 hover:bg-pink-100 dark:border-pink-400/40 dark:bg-pink-500/20 dark:text-pink-100 dark:hover:bg-pink-500/30',
  green:
    'border-green-200 bg-green-50 text-green-900 hover:bg-green-100 dark:border-green-400/40 dark:bg-green-500/20 dark:text-green-100 dark:hover:bg-green-500/30',
  yellow:
    'border-yellow-200 bg-yellow-50 text-yellow-900 hover:bg-yellow-100 dark:border-yellow-400/40 dark:bg-yellow-500/20 dark:text-yellow-100 dark:hover:bg-yellow-500/30',
  orange:
    'border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100 dark:border-orange-400/40 dark:bg-orange-500/20 dark:text-orange-100 dark:hover:bg-orange-500/30',
  purple:
    'border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100 dark:border-purple-400/40 dark:bg-purple-500/20 dark:text-purple-100 dark:hover:bg-purple-500/30',
} as const;

export const accentColorVariants = {
  blue: 'text-blue-600',
  pink: 'text-pink-600',
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
} as const;
