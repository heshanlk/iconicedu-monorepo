import type { CalendarEvent, CalendarView } from '@iconicedu/shared-types';

export function getWeekDays(date: Date): Date[] {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    days.push(currentDate);
  }
  return days;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function timeToMinutes(time: string): number {
  const [timeStr, period] = time.split(' ');
  const [hours, minutes] = timeStr.split(':').map(Number);
  let totalMinutes = (hours % 12) * 60 + (minutes || 0);
  if (period === 'PM') totalMinutes += 12 * 60;
  return totalMinutes;
}

export function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayMinute = minute.toString().padStart(2, '0');
      slots.push(`${displayHour}:${displayMinute} ${period}`);
    }
  }
  return slots;
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  const firstDayOfWeek = firstDay.getDay();
  const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  for (let i = daysFromPrevMonth; i > 0; i--) {
    const date = new Date(year, month, -i + 1);
    days.push(date);
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

export function getEventLayout(events: CalendarEvent[]) {
  const sorted = [...events].sort((a, b) => {
    const aStart = timeToMinutes(a.startTime);
    const bStart = timeToMinutes(b.startTime);
    if (aStart !== bStart) return aStart - bStart;
    return timeToMinutes(a.endTime) - timeToMinutes(b.endTime);
  });

  const clusters: CalendarEvent[][] = [];
  let currentCluster: CalendarEvent[] = [];
  let currentEnd = -1;

  sorted.forEach((event) => {
    const start = timeToMinutes(event.startTime);
    const end = timeToMinutes(event.endTime);

    if (currentCluster.length === 0 || start < currentEnd) {
      currentCluster.push(event);
      currentEnd = Math.max(currentEnd, end);
      return;
    }

    clusters.push(currentCluster);
    currentCluster = [event];
    currentEnd = end;
  });

  if (currentCluster.length) {
    clusters.push(currentCluster);
  }

  const layout = new Map<
    string,
    { column: number; columns: number; clusterId: number }
  >();

  clusters.forEach((cluster, clusterId) => {
    const columnEndTimes: number[] = [];
    const assignments: Array<{ id: string; column: number }> = [];

    cluster.forEach((event) => {
      const start = timeToMinutes(event.startTime);
      const end = timeToMinutes(event.endTime);
      let columnIndex = columnEndTimes.findIndex((time) => time <= start);

      if (columnIndex === -1) {
        columnIndex = columnEndTimes.length;
        columnEndTimes.push(end);
      } else {
        columnEndTimes[columnIndex] = end;
      }

      assignments.push({ id: event.id, column: columnIndex });
    });

    const columns = columnEndTimes.length;
    assignments.forEach((assignment) => {
      layout.set(assignment.id, { column: assignment.column, columns, clusterId });
    });
  });

  return layout;
}

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const weekdayTokens = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'] as const;

const isWithinRange = (date: Date, rangeStart: Date, rangeEnd: Date) => {
  const day = startOfDay(date).getTime();
  return day >= rangeStart.getTime() && day <= rangeEnd.getTime();
};

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

export const getCalendarEventsForView = (
  events: CalendarEvent[],
  currentDate: Date,
  view: CalendarView,
) => {
  const rangeStart =
    view === 'week' ? getWeekStart(currentDate) : startOfDay(currentDate);
  const rangeEnd = view === 'week' ? addDays(rangeStart, 6) : startOfDay(currentDate);
  return expandRecurringEvents(events, rangeStart, rangeEnd);
};

export const getCalendarEventsForMonth = (events: CalendarEvent[], currentDate: Date) => {
  const { start, end } = getMonthRange(currentDate);
  return expandRecurringEvents(events, start, end);
};

export const getCalendarEventsForMonthRange = (
  events: CalendarEvent[],
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
  return expandRecurringEvents(events, startOfDay(start), startOfDay(end));
};

const parseTimeToDate = (timeString: string, baseDate: Date): Date => {
  const [timeStr, period] = timeString.split(' ');
  const [hours, minutes] = timeStr.split(':').map(Number);

  const date = new Date(baseDate);
  let hour = hours;

  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  date.setHours(hour, minutes || 0, 0, 0);
  return date;
};

export const isEventLive = (event: CalendarEvent): boolean => {
  const now = new Date();
  const startTime = parseTimeToDate(event.startTime, event.date);
  const endTime = parseTimeToDate(event.endTime, event.date);

  return now >= startTime && now <= endTime;
};

export const colorVariants = {
  blue: 'border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100 dark:border-blue-400/40 dark:bg-blue-500/20 dark:text-blue-100 dark:hover:bg-blue-500/30',
  pink: 'border-pink-200 bg-pink-50 text-pink-900 hover:bg-pink-100 dark:border-pink-400/40 dark:bg-pink-500/20 dark:text-pink-100 dark:hover:bg-pink-500/30',
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
