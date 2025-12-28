'use client';

import { useMemo, useState } from 'react';
import type { CalendarEventVM, CalendarViewVM } from '@iconicedu/shared-types';
import { CalendarHeader } from './calendar-header';
import { WeekView } from './week-view';
import { DayView } from './day-view';
import {
  getCalendarEventsForMonthRange,
  getCalendarEventsForView,
} from '../../lib/calendar-utils';

interface CalendarContainerProps {
  currentDate: Date;
  view: CalendarViewVM;
  onViewChange: (view: CalendarViewVM) => void;
  onDateSelect: (date: Date) => void;
  events: CalendarEventVM[];
  childrenCount?: number;
}

export function CalendarContainer({
  currentDate,
  view,
  onViewChange,
  onDateSelect,
  events,
  childrenCount,
}: CalendarContainerProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventVM | null>(null);
  const [calendarMonthAnchor, setCalendarMonthAnchor] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
  );

  const calendarEventsForDots = useMemo(
    () => getCalendarEventsForMonthRange(events, calendarMonthAnchor, 1, 1),
    [events, calendarMonthAnchor],
  );
  const calendarEventsForView = useMemo(
    () => getCalendarEventsForView(events, currentDate, view),
    [events, currentDate, view],
  );

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      onDateSelect(new Date());
      return;
    }

    const newDate = new Date(currentDate);
    newDate.setDate(
      currentDate.getDate() + (view === 'week' ? 7 : 1) * (direction === 'next' ? 1 : -1),
    );
    onDateSelect(newDate);
  };

  const handleEventClick = (event: CalendarEventVM) => {
    setSelectedEvent(event);
  };

  return (
    <>
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={onViewChange}
        onNavigate={handleNavigate}
      />

      {view === 'week' ? (
        <WeekView
          currentDate={currentDate}
          events={calendarEventsForView}
          onEventClick={handleEventClick}
          onDateSelect={onDateSelect}
          onSwitchToDay={() => onViewChange('day')}
        />
      ) : (
        <DayView
          currentDate={currentDate}
          events={calendarEventsForView}
          calendarEvents={calendarEventsForDots}
          childrenCount={childrenCount}
          selectedEvent={selectedEvent}
          onEventClick={handleEventClick}
          onDateSelect={onDateSelect}
          onMonthChange={setCalendarMonthAnchor}
        />
      )}
    </>
  );
}
