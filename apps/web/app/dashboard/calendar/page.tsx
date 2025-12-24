'use client';

import { useState } from 'react';
import { CalendarHeader, WeekView, DayView, DashboardHeader } from '@iconicedu/ui-web';
import type { CalendarEvent, CalendarView } from '@iconicedu/shared-types';
import { sampleEvents } from './calendar-data';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('day');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

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
    <div className="flex h-screen flex-col">
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
          events={sampleEvents}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
          onSwitchToDay={() => setView('day')}
        />
      ) : (
        <DayView
          currentDate={currentDate}
          events={sampleEvents}
          selectedEvent={selectedEvent}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
        />
      )}
    </div>
  );
}
