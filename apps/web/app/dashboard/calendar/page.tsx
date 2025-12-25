'use client';

import { useState } from 'react';
import { CalendarContainer, DashboardHeader } from '@iconicedu/ui-web';
import type { CalendarView } from '@iconicedu/shared-types';
import { baseEvents } from '../../../lib/data/calendar-events';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('day');

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <DashboardHeader title={'Calendar'} />
      <CalendarContainer
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onDateSelect={setCurrentDate}
        events={baseEvents}
      />
    </div>
  );
}
