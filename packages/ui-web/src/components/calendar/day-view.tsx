'use client';

import type { CalendarEvent } from '@iconicedu/shared-types';
import {
  isSameDay,
  getTimeSlots,
  timeToMinutes,
  getEventLayout,
} from '../../lib/calendar-utils';
import { EventCard } from './event-card';
import { MiniCalendar } from './mini-calendar';
import { ScrollArea } from '../../ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { useEffect, useRef } from 'react';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  calendarEvents?: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  onEventClick: (event: CalendarEvent) => void;
  onDateSelect: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
}

export function DayView({
  currentDate,
  events,
  calendarEvents,
  selectedEvent,
  onEventClick,
  onDateSelect,
  onMonthChange,
}: DayViewProps) {
  const timeSlots = getTimeSlots();
  const dayEvents = events.filter((event) => isSameDay(event.date, currentDate));
  const miniCalendarEvents = calendarEvents ?? events;
  const dayLayout = getEventLayout(dayEvents);
  const columnGap = 6;
  const maxVisibleColumns = 3;
  const clusterInfo = new Map<
    number,
    { startMinutes: number; hiddenEvents: CalendarEvent[]; columns: number }
  >();

  dayEvents.forEach((event) => {
    const layout = dayLayout.get(event.id);
    if (!layout) return;
    const startMinutes = timeToMinutes(event.startTime);
    const info = clusterInfo.get(layout.clusterId);
    const nextInfo = {
      startMinutes: info ? Math.min(info.startMinutes, startMinutes) : startMinutes,
      hiddenEvents: info?.hiddenEvents ?? [],
      columns: layout.columns,
    };

    if (layout.column >= maxVisibleColumns) {
      nextInfo.hiddenEvents = [...nextInfo.hiddenEvents, event];
    }

    clusterInfo.set(layout.clusterId, nextInfo);
  });

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
                const layout = dayLayout.get(event.id);
                const columns = layout?.columns ?? 1;
                const column = layout?.column ?? 0;
                if (column >= maxVisibleColumns) {
                  return null;
                }

                const visibleColumns = Math.min(columns, maxVisibleColumns);
                const width = 100 / visibleColumns;
                const left = column * width;

                return (
                  <div
                    key={event.id}
                    className="absolute px-1 py-1 pointer-events-none"
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      left: `calc(${left}% + ${columnGap}px)`,
                      width: `calc(${width}% - ${columnGap * 2}px)`,
                    }}
                  >
                    <div className="pointer-events-auto h-full">
                      <EventCard event={event} onClick={() => onEventClick(event)} />
                    </div>
                  </div>
                  );
              })}
              {[...clusterInfo.entries()].map(([clusterId, info]) => {
                if (info.hiddenEvents.length === 0) return null;
                const visibleColumns = Math.min(info.columns, maxVisibleColumns);
                const width = 100 / visibleColumns;
                const left = (visibleColumns - 1) * width;
                const top = (info.startMinutes / 30) * 32;

                return (
                  <div
                    key={`more-${clusterId}`}
                    className="absolute px-1 pointer-events-none"
                    style={{
                      top: `${top}px`,
                      left: `calc(${left}% + ${columnGap}px)`,
                      width: `calc(${width}% - ${columnGap * 2}px)`,
                    }}
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="pointer-events-auto inline-flex items-center justify-center rounded-md bg-muted/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm hover:bg-muted"
                        >
                          +{info.hiddenEvents.length} more
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-64 p-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 py-1">
                          More events
                        </div>
                        <div className="max-h-48 overflow-auto">
                          {info.hiddenEvents.map((hidden) => (
                            <div key={hidden.id} className="pointer-events-auto">
                              <EventCard event={hidden} />
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
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
              events={miniCalendarEvents}
              onMonthChange={onMonthChange}
            />
          </div>
        </ScrollArea>
      </aside>
    </div>
  );
}
