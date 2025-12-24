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
  blue: 'border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100',
  pink: 'border-pink-200 bg-pink-50 text-pink-900 hover:bg-pink-100',
  green: 'border-green-200 bg-green-50 text-green-900 hover:bg-green-100',
  yellow: 'border-yellow-200 bg-yellow-50 text-yellow-900 hover:bg-yellow-100',
  orange: 'border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100',
  purple: 'border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100',
} as const;

export const accentColorVariants = {
  blue: 'text-blue-600',
  pink: 'text-pink-600',
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
} as const;
