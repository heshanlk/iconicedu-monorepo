import type { DayAvailability, DayKey } from './availability';
import { EMPTY_DAY_AVAILABILITY } from './availability';

export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type WorkingHoursEntry = Readonly<{
  day: Weekday;
  enabled: boolean;
  from?: string | null;
  to?: string | null;
}>;

export type WorkingHoursSchedule = ReadonlyArray<WorkingHoursEntry>;

export const WEEKDAY_TO_DAY_KEY: Record<Weekday, DayKey> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

export const DAY_KEY_TO_WEEKDAY: Record<DayKey, Weekday> = {
  Mon: 'monday',
  Tue: 'tuesday',
  Wed: 'wednesday',
  Thu: 'thursday',
  Fri: 'friday',
  Sat: 'saturday',
  Sun: 'sunday',
};

const parseHour = (value?: string | null): number | null => {
  if (!value) {
    return null;
  }
  const [hourPart] = value.split(':');
  const parsed = Number(hourPart);
  return Number.isNaN(parsed) ? null : parsed;
};

export function workingHoursScheduleToDayAvailability(
  schedule?: WorkingHoursSchedule | null,
): DayAvailability {
  const availability: DayAvailability = { ...EMPTY_DAY_AVAILABILITY };
  schedule?.forEach((entry) => {
    if (!entry.enabled) {
      return;
    }
    const dayKey = WEEKDAY_TO_DAY_KEY[entry.day];
    if (!dayKey) {
      return;
    }
    const fromHour = parseHour(entry.from);
    const toHour = parseHour(entry.to);
    if (fromHour === null || toHour === null || toHour <= fromHour) {
      return;
    }
    availability[dayKey] = Array.from(
      { length: toHour - fromHour },
      (_, index) => fromHour + index,
    );
  });
  return availability;
}
