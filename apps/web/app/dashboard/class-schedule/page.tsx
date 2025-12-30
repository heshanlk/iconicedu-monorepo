'use client';

import { useState } from 'react';
import { ClassScheduleContainer, DashboardHeader } from '@iconicedu/ui-web';
import type { ClassScheduleViewVM } from '@iconicedu/shared-types';
import { baseEvents } from '../../../lib/data/class-schedule-events';

export default function ClassSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ClassScheduleViewVM>('day');

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <DashboardHeader title="Class Schedule" />
      <ClassScheduleContainer
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onDateSelect={setCurrentDate}
        events={baseEvents}
      />
    </div>
  );
}
