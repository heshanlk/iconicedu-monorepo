import type { CalendarEvent, RecurrenceRule } from '@iconicedu/shared-types';

const getDateOffset = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
};

const getISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const weekdayTokens: Array<RecurrenceRule['byWeekday'][number]> = [
  'SU',
  'MO',
  'TU',
  'WE',
  'TH',
  'FR',
  'SA',
];

const expandRecurringEvents = (
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date,
) => {
  const expanded: CalendarEvent[] = [];
  const rangeStartDay = startOfDay(rangeStart);
  const rangeEndDay = startOfDay(rangeEnd);

  events.forEach((event) => {
    if (!event.recurrence) {
      expanded.push(event);
      return;
    }

    const rule = event.recurrence;
    const interval = rule.interval ?? 1;
    const baseDate = startOfDay(event.date);
    const exceptions = new Set(rule.exceptions ?? []);
    const overrides = rule.overrides ?? {};
    const byWeekday = rule.byWeekday?.length
      ? rule.byWeekday
      : [weekdayTokens[baseDate.getDay()]];

    let occurrenceCount = 0;
    const until = rule.until ? startOfDay(new Date(rule.until)) : null;

    for (
      let current = rangeStartDay;
      current <= rangeEndDay;
      current = addDays(current, 1)
    ) {
      if (current < baseDate) continue;
      if (until && current > until) break;

      const diffDays =
        (startOfDay(current).getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000);

      let matches = false;
      if (rule.frequency === 'daily') {
        matches = diffDays % interval === 0;
      } else if (rule.frequency === 'weekly') {
        const weeksDiff = Math.floor(diffDays / 7);
        matches =
          weeksDiff % interval === 0 &&
          byWeekday.includes(weekdayTokens[current.getDay()]);
      }

      if (!matches) continue;

      const isoDate = getISODate(current);
      if (exceptions.has(isoDate)) continue;

      if (rule.count && occurrenceCount >= rule.count) break;

      const override = overrides[isoDate];
      const occurrence: CalendarEvent = {
        ...event,
        ...override,
        id: `${event.id}__${isoDate}`,
        recurrenceId: event.id,
        date: new Date(current),
      };

      delete (occurrence as Partial<CalendarEvent>).recurrence;
      expanded.push(occurrence);
      occurrenceCount += 1;
    }
  });

  return expanded;
};

const baseEvents: CalendarEvent[] = [
  {
    id: 'recurring-standup',
    title: 'Recurring Standup',
    startTime: '8:30 AM',
    endTime: '9:30 AM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['MO', 'WE', 'FR'],
      until: getISODate(addDays(new Date(), 30)),
      exceptions: [getISODate(addDays(new Date(), 2))],
      overrides: {
        [getISODate(addDays(new Date(), 4))]: {
          title: 'Standup (extended)',
          endTime: '9:15 AM',
          location: 'Conference Room B',
        },
      },
    },
    color: 'blue',
    description:
      'Weekly standup with recurring schedule. Includes exceptions and overrides.',
    organizer: 'Engineering Team',
    location: 'Virtual Meeting Room',
    visibility: 'Team members only',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 6,
    },
  },
];

export const sampleEvents: CalendarEvent[] = expandRecurringEvents(
  baseEvents,
  getDateOffset(-7),
  getDateOffset(14),
);
