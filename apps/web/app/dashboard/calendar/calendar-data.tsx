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

const isWithinRange = (date: Date, rangeStart: Date, rangeEnd: Date) => {
  const day = startOfDay(date).getTime();
  return day >= rangeStart.getTime() && day <= rangeEnd.getTime();
};

export const expandRecurringEvents = (
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date,
) => {
  const expanded: CalendarEvent[] = [];
  const rangeStartDay = startOfDay(rangeStart);
  const rangeEndDay = startOfDay(rangeEnd);

  events.forEach((event) => {
    if (!event.recurrence) {
      if (isWithinRange(event.date, rangeStartDay, rangeEndDay)) {
        expanded.push(event);
      }
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

      const isoDate = getISODate(current);
      const override = overrides[isoDate];
      const hasOverride = Boolean(override);

      if (!matches && !hasOverride) continue;
      if (exceptions.has(isoDate) && !hasOverride) continue;

      if (rule.count && occurrenceCount >= rule.count) break;

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

export const baseEvents: CalendarEvent[] = [
  {
    id: 'recurring-math-eliyas',
    title: 'Eliyas - Math with Mr. Abhishek',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'blue',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Mr Abhishek',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-math-zayne',
    title: 'Zayne - Math with Ms.Shenaly',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'purple',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Ms Shenaly',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-chess-nailah',
    title: 'Nailah - Chess with Coach Rivi',
    startTime: '9:00 AM',
    endTime: '9:45 AM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'pink',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Coach Rivi',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-math-nailah',
    title: 'Nailah - Math with Ms. Shenaly',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'pink',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Ms Shenaly',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-chess-eliyas',
    title: 'Eliyas - Chess with Coach Rivi',
    startTime: '10:15 AM',
    endTime: '11:00 AM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'blue',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Coach Rivi',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-chess-zayne',
    title: 'Zayne - Chess with Coach Rivi',
    startTime: '11:00 AM',
    endTime: '11:45 AM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['SA'],
      exceptions: [],
      overrides: {},
    },
    color: 'purple',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Coach Rivi',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-ela-elias',
    title: 'Elias - ELA with Ms. Norah',
    startTime: '4:00 PM',
    endTime: '5:00 PM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['FR'],
      exceptions: [],
      overrides: {},
    },
    color: 'blue',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Ms. Norah',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-ela-nailah',
    title: 'Nailah - ELA with Ms. Norah',
    startTime: '5:00 PM',
    endTime: '6:00 PM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['FR'],
      exceptions: [],
      overrides: {},
    },
    color: 'pink',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Ms. Norah',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
  {
    id: 'recurring-ela-zayne',
    title: 'Zayne - ELA with Ms. Norah',
    startTime: '6:00 PM',
    endTime: '6:30 PM',
    date: getDateOffset(-7),
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      byWeekday: ['FR'],
      exceptions: [],
      overrides: {},
    },
    color: 'purple',
    description:
      'Join Zoom Meeting\nhttps://us06web.zoom.us/j/88176711138?pwd=QyOYewr8ovQnVs5Kf5SEUHXzjlrGq7.1\n\nView meeting insights with Zoom AI Companion\nhttps://us06web.zoom.us/launch/edl?muid=55f36ba3-a6ef-46c8-a191-fc1847c48d60\n\nMeeting ID: 881 7671 1138\nPasscode: 903480',
    organizer: 'Ms. Norah',
    location: 'Zoom',
    visibility: '1-1',
    guests: {
      avatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede',
      ],
      count: 3,
    },
  },
];

const getWeekStart = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);
  return startOfDay(start);
};

const getMonthRange = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start: startOfDay(start), end: startOfDay(end) };
};

export const getCalendarEventsForView = (currentDate: Date, view: 'week' | 'day') => {
  const rangeStart =
    view === 'week' ? getWeekStart(currentDate) : startOfDay(currentDate);
  const rangeEnd = view === 'week' ? addDays(rangeStart, 6) : startOfDay(currentDate);
  return expandRecurringEvents(baseEvents, rangeStart, rangeEnd);
};

export const getCalendarEventsForMonth = (currentDate: Date) => {
  const { start, end } = getMonthRange(currentDate);
  return expandRecurringEvents(baseEvents, start, end);
};

export const getCalendarEventsForMonthRange = (
  currentDate: Date,
  monthsBefore = 1,
  monthsAfter = 1,
) => {
  const start = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - monthsBefore,
    1,
  );
  const end = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + monthsAfter + 1,
    0,
  );
  return expandRecurringEvents(baseEvents, startOfDay(start), startOfDay(end));
};

export const sampleEvents: CalendarEvent[] = expandRecurringEvents(
  baseEvents,
  getDateOffset(-7),
  getDateOffset(14),
);
