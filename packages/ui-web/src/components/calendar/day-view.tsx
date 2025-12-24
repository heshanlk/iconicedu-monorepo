'use client';

import type { CalendarEvent } from '@iconicedu/shared-types';
import { isSameDay, getTimeSlots, timeToMinutes } from '../../lib/calendar-utils';
import { EventCard } from './event-card';
import { MiniCalendar } from './mini-calendar';
import { ScrollArea } from '../../ui/scroll-area';
import { useEffect, useRef } from 'react';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  onEventClick: (event: CalendarEvent) => void;
  onDateSelect: (date: Date) => void;
}

export function DayView({
  currentDate,
  events,
  selectedEvent,
  onEventClick,
  onDateSelect,
}: DayViewProps) {
  const timeSlots = getTimeSlots();
  const dayEvents = events.filter((event) => isSameDay(event.date, currentDate));

  const today = new Date();
  const isToday = isSameDay(currentDate, today);
  const currentHour = today.getHours();
  const currentMinutes = today.getMinutes();
  const currentTimeOffset = (currentHour * 2 + currentMinutes / 30) * 32;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialScrolled = useRef(false);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current.querySelector(
      '[data-radix-scroll-area-viewport]',
    ) as HTMLElement;
    if (!container) return;

    // Calculate scroll position
    let scrollTop = 8 * 2 * 32; // Default to 8 AM

    if (dayEvents.length > 0) {
      const earliestEvent = dayEvents.reduce((earliest, event) => {
        const eventMinutes = timeToMinutes(event.startTime);
        const earliestMinutes = timeToMinutes(earliest.startTime);
        return eventMinutes < earliestMinutes ? event : earliest;
      });

      const eventMinutes = timeToMinutes(earliestEvent.startTime);
      const scrollToMinutes = Math.max(0, eventMinutes - 60);
      scrollTop = (scrollToMinutes / 30) * 32;
    }

    if (!hasInitialScrolled.current) {
      hasInitialScrolled.current = true;
      setTimeout(() => {
        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
      }, 100);
    } else {
      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  }, [currentDate, dayEvents]);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Day schedule */}
      <ScrollArea ref={scrollContainerRef} className="flex-1 border-r">
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

            {/* Day column */}
            <div className="relative flex-1 border-l">
              {timeSlots.map((_, index) => (
                <div
                  key={index}
                  className="h-8 border-b hover:bg-muted/40 transition-colors cursor-pointer focus:bg-muted/50"
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
                    className="absolute left-2 right-2 py-1 pointer-events-none"
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                    }}
                  >
                    <div className="pointer-events-auto">
                      <EventCard event={event} onClick={() => onEventClick(event)} />
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
          </div>
        </div>
      </ScrollArea>

      {/* Right sidebar */}
      <aside className="hidden lg:flex w-80 flex-shrink-0 bg-muted/30">
        <ScrollArea className="w-full">
          <div className="p-4 space-y-4">
            <MiniCalendar
              currentDate={currentDate}
              selectedDate={currentDate}
              onDateSelect={onDateSelect}
              events={events}
            />
          </div>
        </ScrollArea>
      </aside>
    </div>
  );
}
