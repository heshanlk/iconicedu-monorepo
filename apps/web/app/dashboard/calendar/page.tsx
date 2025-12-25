'use client';

import { useMemo, useState } from 'react';
import { CalendarHeader, WeekView, DayView, DashboardHeader } from '@iconicedu/ui-web';
import type { CalendarEvent, CalendarView } from '@iconicedu/shared-types';
import {
  getCalendarEventsForMonthRange,
  getCalendarEventsForView,
} from './calendar-data';

export default function CalendarPage() {
  const students = [
    { id: 3, name: 'Elyas' },
    { id: 4, name: 'Nailah' },
    { id: 5, name: 'Zayne' },
  ];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('day');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [calendarMonthAnchor, setCalendarMonthAnchor] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
  );
  const calendarEventsForDots = useMemo(
    () => getCalendarEventsForMonthRange(calendarMonthAnchor, 1, 1),
    [calendarMonthAnchor],
  );
  const calendarEventsForView = useMemo(
    () => getCalendarEventsForView(currentDate, view),
    [currentDate, view],
  );

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date());
    } else if (view === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
      setCurrentDate(newDate);
    }
  };

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <DashboardHeader title={'Calendar'} />
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigate={handleNavigate}
      />

      {view === 'week' ? (
        <WeekView
          currentDate={currentDate}
          events={calendarEventsForView}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
          onSwitchToDay={() => setView('day')}
        />
      ) : (
        <DayView
          currentDate={currentDate}
          events={calendarEventsForView}
          calendarEvents={calendarEventsForDots}
          studentsCount={students.length}
          selectedEvent={selectedEvent}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
          onMonthChange={setCalendarMonthAnchor}
        />
      )}
    </div>
  );
}
