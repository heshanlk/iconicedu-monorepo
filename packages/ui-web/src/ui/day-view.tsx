'use client';

import {
  format,
  isSameDay,
  isToday,
  setHours,
  setMinutes,
  differenceInMinutes,
  startOfDay,
} from 'date-fns';
import { cn } from '../lib/utils';
import { ScrollArea } from './scroll-area';
import type { CalendarEvent } from '../components/calendar';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function DayView({ currentDate, events }: DayViewProps) {
  const dayEvents = events.filter((event) =>
    isSameDay(new Date(event.start), currentDate),
  );

  const getEventPosition = (event: CalendarEvent) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const dayStart = startOfDay(eventStart);

    const top = differenceInMinutes(eventStart, dayStart) * (80 / 60); // 80px per hour
    const height = differenceInMinutes(eventEnd, eventStart) * (80 / 60);

    return { top, height: Math.max(height, 30) };
  };

  const isDayToday = isToday(currentDate);

  return (
    <div className="flex h-full flex-col">
      {/* Day header */}
      <div className="flex items-center gap-4 border-b border-border bg-muted/50 px-4 py-3">
        <div
          className={cn(
            'flex h-12 w-12 flex-col items-center justify-center rounded-lg',
            isDayToday && 'bg-primary text-primary-foreground',
          )}
        >
          <span className="text-xs font-medium uppercase">
            {format(currentDate, 'EEE')}
          </span>
          <span className="text-lg font-bold">{format(currentDate, 'd')}</span>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{format(currentDate, 'EEEE')}</h3>
          <p className="text-sm text-muted-foreground">
            {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>
      </div>

      {/* Time grid */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="flex">
          {/* Time column */}
          <div className="w-20 shrink-0 border-r border-border">
            {HOURS.map((hour) => (
              <div key={hour} className="relative h-[80px] border-b border-border">
                <span className="absolute -top-2.5 right-3 text-xs text-muted-foreground">
                  {format(setHours(setMinutes(new Date(), 0), hour), 'h a')}
                </span>
              </div>
            ))}
          </div>

          {/* Events area */}
          <div className={cn('relative flex-1', isDayToday && 'bg-primary/5')}>
            {HOURS.map((hour) => (
              <div key={hour} className="h-[80px] border-b border-border" />
            ))}
            {/* Events */}
            {dayEvents.map((event) => {
              const { top, height } = getEventPosition(event);
              return (
                <div
                  key={event.id}
                  className={cn(
                    'absolute left-2 right-2 overflow-hidden rounded-lg px-3 py-2 text-white shadow-sm',
                    event.color || 'bg-primary',
                  )}
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                  }}
                >
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-sm text-white/80">
                    {format(new Date(event.start), 'h:mm a')} -{' '}
                    {format(new Date(event.end), 'h:mm a')}
                  </div>
                  {event.description && (
                    <div className="mt-1 text-xs text-white/70 truncate">
                      {event.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
