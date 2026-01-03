'use client';

import type { ClassScheduleVM } from '@iconicedu/shared-types';
import {
  isSameDay,
  getEventDate,
  formatEventTime,
  getTimeSlots,
  timeToMinutes,
  getEventLayout,
} from '../../lib/class-schedule-utils';
import { EventCard } from './event-card';
import { MiniClassSchedule } from './mini-class-schedule';
import { ScrollArea } from '../../ui/scroll-area';
import { Button } from '../../ui/button';
import { ArrowRight, MessageSquarePlus, UserPlus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { useEffect, useRef } from 'react';

interface DayViewProps {
  currentDate: Date;
  events: ClassScheduleVM[];
  classScheduleEvents?: ClassScheduleVM[];
  hasClasses: boolean;
  nextEvent?: ClassScheduleVM;
  childrenCount?: number;
  onDateSelect: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
}

export function DayView({
  currentDate,
  events,
  classScheduleEvents,
  hasClasses,
  nextEvent,
  childrenCount,
  onDateSelect,
  onMonthChange,
}: DayViewProps) {
  const timeSlots = getTimeSlots();
  const dayEvents = events.filter((event) => isSameDay(getEventDate(event), currentDate));
  const miniScheduleEvents = classScheduleEvents ?? events;
  const hasChildren = childrenCount === undefined ? true : childrenCount > 0;
  const dayLayout = getEventLayout(dayEvents);
  const maxVisibleColumns = 3;
  const clusterInfo = new Map<
    number,
    { startMinutes: number; hiddenEvents: ClassScheduleVM[]; columns: number }
  >();

  dayEvents.forEach((event) => {
    const layout = dayLayout.get(event.ids.id);
    if (!layout) return;
    const startMinutes = timeToMinutes(event.startAt);
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
        const eventMinutes = timeToMinutes(event.startAt);
        const earliestMinutes = timeToMinutes(earliest.startAt);
        return eventMinutes < earliestMinutes ? event : earliest;
      });

      const eventMinutes = timeToMinutes(earliestEvent.startAt);
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
        <div className="relative min-h-[400px]">
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
                const startMinutes = timeToMinutes(event.startAt);
                const endMinutes = timeToMinutes(event.endAt);
                const top = (startMinutes / 30) * 32;
                const height = ((endMinutes - startMinutes) / 30) * 32;
                const layout = dayLayout.get(event.ids.id);
                const columns = layout?.columns ?? 1;
                const column = layout?.column ?? 0;
                if (column >= maxVisibleColumns) {
                  return null;
                }

                const visibleColumns = Math.min(columns, maxVisibleColumns);
                const gap = 0;
                const width = 100 / visibleColumns;
                const left = column * width;
                const overlapExtra = 0;
                const overlapOffset = 0;

                const durationMinutes = endMinutes - startMinutes;
                const isCompact = durationMinutes <= 45;

                return (
                  <div
                    key={event.ids.id}
                    className="absolute px-1 py-1 pointer-events-none"
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      left: `calc(${left}% + ${gap}px - ${overlapOffset}px)`,
                      width: `calc(${width}% - ${gap * 2}px + ${overlapExtra}px)`,
                      zIndex: column + 1,
                    }}
                  >
                    <div className="pointer-events-auto h-full">
                      <EventCard event={event} compact={isCompact} />
                    </div>
                  </div>
                );
              })}
              {[...clusterInfo.entries()].map(([clusterId, info]) => {
                if (info.hiddenEvents.length === 0) return null;
                const visibleColumns = Math.min(info.columns, maxVisibleColumns);
                const gap = 0;
                const width = 100 / visibleColumns;
                const left = (visibleColumns - 1) * width;
                const top = (info.startMinutes / 30) * 32;

                return (
                  <div
                    key={`more-${clusterId}`}
                    className="absolute px-1 pointer-events-none"
                    style={{
                      top: `${top}px`,
                      left: `calc(${left}% + ${gap}px)`,
                      width: `calc(${width}% - ${gap * 2}px)`,
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
                            <div
                              key={hidden.ids.id}
                              className="pointer-events-auto"
                            >
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

          {dayEvents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className="flex flex-col items-center gap-3 rounded-xl border bg-background/90 px-6 py-4 text-center shadow-sm">
                {!hasChildren ? (
                  <>
                    <div className="text-sm font-medium text-foreground">
                      Add your child to get started
                    </div>
                    <div className="text-xs text-muted-foreground">
                      You need at least one child profile to see classes.
                    </div>
                    <Button size="sm">
                      <UserPlus className="mr-2 size-4" />
                      Add a child
                    </Button>
                  </>
                ) : !hasClasses ? (
                  <>
                    <div className="text-sm font-medium text-foreground">
                      No classes enrolled yet
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Request tutoring to start scheduling.
                    </div>
                    <Button size="sm">
                      <MessageSquarePlus className="mr-2 size-4" />
                      Request tutoring
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-medium text-foreground">
                      No events today
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {nextEvent
                        ? `Next up: ${nextEvent.title} at ${formatEventTime(nextEvent.startAt)}`
                        : 'No upcoming events scheduled'}
                    </div>
                    {nextEvent && (
                      <Button
                        size="sm"
                        onClick={() => onDateSelect(getEventDate(nextEvent))}
                      >
                        <ArrowRight className="mr-2 size-4" />
                        Next up:{' '}
                        {getEventDate(nextEvent).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Right sidebar */}
      <aside className="hidden lg:flex w-80 flex-shrink-0 bg-muted/30">
        <ScrollArea className="w-full">
          <div className="p-4 space-y-4">
            <MiniClassSchedule
              currentDate={currentDate}
              selectedDate={currentDate}
              onDateSelect={onDateSelect}
              events={miniScheduleEvents}
              onMonthChange={onMonthChange}
            />
          </div>
        </ScrollArea>
      </aside>
    </div>
  );
}
