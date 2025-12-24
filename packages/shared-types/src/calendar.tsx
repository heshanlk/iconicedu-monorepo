export type RecurrenceRule = {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number;
  byWeekday?: Array<'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU'>;
  count?: number;
  until?: string;
  timezone?: string;
  exceptions?: string[];
  overrides?: Record<string, Partial<CalendarEvent>>;
};

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: Date;
  recurrence?: RecurrenceRule;
  recurrenceId?: string;
  color: 'blue' | 'pink' | 'green' | 'yellow' | 'orange' | 'purple';
  description: string;
  organizer: string;
  location: string;
  visibility: string;
  guests: {
    avatars: string[];
    count: number;
  };
}

export type CalendarView = 'week' | 'day';
