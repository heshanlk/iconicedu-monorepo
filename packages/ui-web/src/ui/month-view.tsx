'use client';

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { cn } from '../lib/utils';
import type { CalendarEvent } from '../components/calendar';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthView({ currentDate, events, onDateSelect }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.start), date));
  };

  return (
    <div className="flex h-full flex-col">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/50">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid flex-1 grid-cols-7 grid-rows-6">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <div
              key={index}
              onClick={() => onDateSelect(day)}
              className={cn(
                'min-h-[100px] cursor-pointer border-b border-r border-border p-1 transition-colors hover:bg-muted/50',
                !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
              )}
            >
              <div className="flex flex-col gap-1">
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-sm',
                    isDayToday && 'bg-primary text-primary-foreground font-semibold',
                    !isDayToday && isCurrentMonth && 'text-foreground',
                    !isDayToday && !isCurrentMonth && 'text-muted-foreground',
                  )}
                >
                  {format(day, 'd')}
                </span>
                <div className="flex flex-col gap-0.5">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        'truncate rounded px-1.5 py-0.5 text-xs font-medium text-white',
                        event.color || 'bg-primary',
                      )}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="px-1.5 text-xs text-muted-foreground">
                      +{dayEvents.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
