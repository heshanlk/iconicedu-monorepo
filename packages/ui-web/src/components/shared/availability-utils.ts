import type { DayAvailability, DayKey } from '@iconicedu/shared-types';
import { DAY_KEYS } from '@iconicedu/shared-types';

export const DAY_LABELS: Record<DayKey, string> = {
  Mon: 'Mon',
  Tue: 'Tue',
  Wed: 'Wed',
  Thu: 'Thu',
  Fri: 'Fri',
  Sat: 'Sat',
  Sun: 'Sun',
};

export const formatHourLabel = (hour: number) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour.toString().padStart(2, '0')}:00 ${period}`;
};

export const summarizeAvailability = (availability: DayAvailability) => {
  const entries = DAY_KEYS.filter((day) => (availability[day]?.length ?? 0) > 0);
  if (!entries.length) {
    return 'No availability shared yet';
  }
  return entries
    .map((day) => {
      const hours = availability[day] ?? [];
      const startHour = Math.min(...hours);
      const endHour = Math.max(...hours) + 1;
      return `${DAY_LABELS[day]}: ${formatHourLabel(startHour)} – ${formatHourLabel(
        Math.min(endHour, 24),
      )}`;
    })
    .join(', ');
};
