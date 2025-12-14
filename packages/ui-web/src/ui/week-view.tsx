'use client';

import {
  startOfWeek,
  addDays,
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

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function WeekView({ currentDate, events }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.start), date));
  };

  const getEventPosition = (event: CalendarEvent) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const dayStart = startOfDay(eventStart);

    const top = differenceInMinutes(eventStart, dayStart) * (60 / 60); // 60px per hour
    const height = differenceInMinutes(eventEnd, eventStart) * (60 / 60);

    return { top, height: Math.max(height, 20) };
  };

  return (
    <div className="flex h-full flex-col">
      {/* Day headers */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border bg-muted/50">
        <div className="border-r border-border" />
        {weekDays.map((day, index) => {
          const isDayToday = isToday(day);
          return (
            <div
              key={index}
              className={cn(
                'flex flex-col items-center py-2 text-center',
                isDayToday && 'bg-primary/10',
              )}
            >
              <span className="text-xs font-medium uppercase text-muted-foreground">
                {format(day, 'EEE')}
              </span>
              <span
                className={cn(
                  'mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                  isDayToday && 'bg-primary text-primary-foreground',
                )}
              >
                {format(day, 'd')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {/* Time column */}
          <div className="relative border-r border-border">
            {HOURS.map((hour) => (
              <div key={hour} className="relative h-[60px] border-b border-border">
                <span className="absolute -top-2.5 right-2 text-xs text-muted-foreground">
                  {format(setHours(setMinutes(new Date(), 0), hour), 'h a')}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);
            const isDayToday = isToday(day);

            return (
              <div
                key={dayIndex}
                className={cn(
                  'relative border-r border-border',
                  isDayToday && 'bg-primary/5',
                )}
              >
                {HOURS.map((hour) => (
                  <div key={hour} className="h-[60px] border-b border-border" />
                ))}
                {/* Events */}
                {dayEvents.map((event) => {
                  const { top, height } = getEventPosition(event);
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        'absolute left-0.5 right-0.5 overflow-hidden rounded px-1.5 py-0.5 text-xs text-white',
                        event.color || 'bg-primary',
                      )}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                      }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-white/80 truncate">
                        {format(new Date(event.start), 'h:mm a')}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
