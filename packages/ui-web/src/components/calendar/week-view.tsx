'use client';

import type { CalendarEvent } from '@iconicedu/shared-types';
import {
  getWeekDays,
  formatDayName,
  isSameDay,
  getTimeSlots,
  timeToMinutes,
} from '../../lib/calendar-utils';
import { EventCard } from './event-card';
import { cn } from '@iconicedu/ui-web/lib/utils';
import { useEffect, useRef } from 'react';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
  onSwitchToDay?: () => void;
}

export function WeekView({
  currentDate,
  events,
  onEventClick,
  onDateSelect,
  onSwitchToDay,
}: WeekViewProps) {
  const weekDays = getWeekDays(currentDate);
  const timeSlots = getTimeSlots();
  const today = new Date();

  const currentHour = today.getHours();
  const currentMinutes = today.getMinutes();
  const currentTimeOffset = (currentHour * 2 + currentMinutes / 30) * 32;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const todayEvents = events.filter((event) => {
      return weekDays.some((day) => isSameDay(event.date, day));
    });

    let scrollTop: number;
    if (todayEvents.length > 0) {
      const earliestEvent = todayEvents.reduce((earliest, event) => {
        const eventMinutes = timeToMinutes(event.startTime);
        const earliestMinutes = timeToMinutes(earliest.startTime);
        return eventMinutes < earliestMinutes ? event : earliest;
      });

      const eventMinutes = timeToMinutes(earliestEvent.startTime);
      const scrollToMinutes = Math.max(0, eventMinutes - 60);
      scrollTop = (scrollToMinutes / 30) * 32;
    } else {
      scrollTop = 8 * 2 * 32;
    }

    // Add delay on initial mount to ensure DOM is ready
    if (!hasMountedRef.current) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({ top: scrollTop, behavior: 'smooth' });
      }, 100);
      hasMountedRef.current = true;
    } else {
      scrollContainerRef.current.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  }, [currentDate, events, weekDays]);

  const handleEventClick = (event: CalendarEvent) => {
    onEventClick(event);
    if (onDateSelect) {
      onDateSelect(event.date);
    }
  };

  const handleCellClick = (day: Date) => {
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  const handleDayHeaderDoubleClick = (day: Date) => {
    if (onDateSelect) {
      onDateSelect(day);
    }
    if (onSwitchToDay) {
      onSwitchToDay();
    }
  };

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-auto">
      <div className="inline-block min-w-full">
        {/* Days header */}
        <div className="sticky top-0 z-20 bg-background border-b">
          <div className="flex">
            <div className="w-20 flex-shrink-0" />
            {weekDays.map((day, index) => {
              const isToday = isSameDay(day, today);
              const isSelected = isSameDay(day, currentDate);

              return (
                <button
                  key={index}
                  onClick={() => onDateSelect?.(day)}
                  onDoubleClick={() => handleDayHeaderDoubleClick(day)}
                  className={cn(
                    'flex-1 border-l p-4 text-center min-w-[75px] transition-colors',
                    'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  )}
                >
                  <div className="text-sm text-muted-foreground">
                    {formatDayName(day)}
                  </div>
                  <div
                    className={cn(
                      'mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors',
                      isToday && 'bg-primary text-primary-foreground',
                      isSelected && !isToday && 'bg-muted text-foreground',
                    )}
                  >
                    {day.getDate()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time grid */}
        <div className="relative">
          <div className="flex">
            {/* Time labels */}
            <div className="w-20 flex-shrink-0">
              {timeSlots.map((time, index) => (
                <div
                  key={time}
                  className="h-8 text-xs text-muted-foreground pr-2 text-right pt-1"
                >
                  {index % 2 === 0 ? time : ''}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day, dayIndex) => {
              const dayEvents = events.filter((event) => isSameDay(event.date, day));
              const isToday = isSameDay(day, today);
              const isSelected = isSameDay(day, currentDate);

              return (
                <div
                  key={dayIndex}
                  className={cn(
                    'relative flex-1 border-l min-w-[75px]',
                    isSelected && 'bg-muted/20',
                  )}
                >
                  {timeSlots.map((_, index) => (
                    <div
                      key={index}
                      className="h-8 border-b hover:bg-muted/40 transition-colors cursor-pointer focus:bg-muted/50"
                      onClick={() => handleCellClick(day)}
                    />
                  ))}

                  {/* Events */}
                  {dayEvents.map((event) => {
                    const startMinutes = timeToMinutes(event.startTime);
                    const endMinutes = timeToMinutes(event.endTime);
                    const top = (startMinutes / 30) * 32;
                    const height = ((endMinutes - startMinutes) / 30) * 32;

                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 px-1 py-1 pointer-events-none"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                        }}
                      >
                        <div className="pointer-events-auto">
                          <EventCard
                            event={event}
                            onClick={() => handleEventClick(event)}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Current time indicator */}
                  {isToday && (
                    <div
                      className="absolute left-0 right-0 border-t-2 border-destructive z-10"
                      style={{ top: `${currentTimeOffset}px` }}
                    >
                      <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-destructive" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
