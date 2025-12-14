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
import { useEffect, useMemo, useRef } from 'react';
import { cn } from '../lib/utils';
import { CurrentTimeIndicator } from './current-time-indicator';
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isCurrentWeek = useMemo(() => weekDays.some((day) => isToday(day)), [weekDays]);

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

  const currentTimeTop = useMemo(() => {
    if (!isCurrentWeek) return null;
    const minutesFromStart = differenceInMinutes(new Date(), startOfDay(new Date()));
    return minutesFromStart; // 1px per minute (60px per hour grid)
  }, [isCurrentWeek]);

  const scrollTarget = useMemo(() => {
    if (!isCurrentWeek) return null;
    const today = weekDays.find((day) => isToday(day));
    if (!today) return null;

    const todayEvents = getEventsForDay(today);
    if (todayEvents.length > 0) {
      const firstTop = todayEvents
        .map((event) => getEventPosition(event).top)
        .sort((a, b) => a - b)[0];
      return firstTop;
    }

    const minutesFromStart = differenceInMinutes(new Date(), startOfDay(new Date()));
    return minutesFromStart; // 1px per minute (60px per hour grid)
  }, [getEventPosition, getEventsForDay, isCurrentWeek, weekDays]);

  useEffect(() => {
    if (scrollTarget == null) return;
    const viewport = scrollAreaRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement | null;
    if (!viewport) return;
    const target = Math.max(0, scrollTarget - viewport.clientHeight / 2);
    const scrollOnce = () => viewport.scrollTo({ top: target, behavior: 'auto' });
    requestAnimationFrame(() => {
      scrollOnce();
      requestAnimationFrame(scrollOnce);
    });
  }, [scrollTarget]);

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
      <ScrollArea className="flex-1 min-h-0 overflow-hidden" ref={scrollAreaRef}>
        <div className="relative grid grid-cols-[60px_repeat(7,1fr)]">
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
                  isDayToday && 'bg-primary/5 ring-1 ring-primary/30',
                )}
              >
                {HOURS.map((hour) => (
                  <div key={hour} className="h-[60px] border-b border-border" />
                ))}
                {isDayToday && currentTimeTop !== null && (
                  <div
                    className="pointer-events-none absolute inset-x-0 z-10"
                    style={{ top: `${currentTimeTop}px` }}
                  >
                    <CurrentTimeIndicator />
                  </div>
                )}
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
