export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: Date;
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
