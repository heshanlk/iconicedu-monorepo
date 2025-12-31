'use client';

import { useMemo, useState } from 'react';
import type {
  ClassScheduleVM,
  ClassScheduleViewVM,
} from '@iconicedu/shared-types';
import { ClassScheduleHeader } from './class-schedule-header';
import { WeekView } from './week-view';
import { DayView } from './day-view';
import {
  getClassScheduleEventsForMonthRange,
  getClassScheduleEventsForView,
  getEventDate,
  timeToMinutes,
} from '../../lib/class-schedule-utils';

interface ClassScheduleContainerProps {
  currentDate: Date;
  view: ClassScheduleViewVM;
  onViewChange: (view: ClassScheduleViewVM) => void;
  onDateSelect: (date: Date) => void;
  events: ClassScheduleVM[];
  childrenCount?: number;
}

export function ClassScheduleContainer({
  currentDate,
  view,
  onViewChange,
  onDateSelect,
  events,
  childrenCount,
}: ClassScheduleContainerProps) {
  const [classScheduleMonthAnchor, setClassScheduleMonthAnchor] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
  );

  const classScheduleEventsForDots = useMemo(
    () =>
      getClassScheduleEventsForMonthRange(events, classScheduleMonthAnchor, 1, 1),
    [events, classScheduleMonthAnchor],
  );
  const classScheduleEventsForView = useMemo(
    () => getClassScheduleEventsForView(events, currentDate, view),
    [events, currentDate, view],
  );

  const hasClasses = events.length > 0;
  const nextEvent = useMemo(() => {
    return [...events]
      .filter((event) => getEventDate(event) > currentDate)
      .sort((a, b) => {
        const dateDiff = getEventDate(a).getTime() - getEventDate(b).getTime();
        if (dateDiff !== 0) return dateDiff;
        return timeToMinutes(a.startAt) - timeToMinutes(b.startAt);
      })[0];
  }, [events, currentDate]);

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

  return (
    <>
      <ClassScheduleHeader
        currentDate={currentDate}
        view={view}
        onViewChange={onViewChange}
        onNavigate={handleNavigate}
      />

      {view === 'week' ? (
        <WeekView
          currentDate={currentDate}
          events={classScheduleEventsForView}
          onDateSelect={onDateSelect}
          onSwitchToDay={() => onViewChange('day')}
        />
      ) : (
        <DayView
          currentDate={currentDate}
          events={classScheduleEventsForView}
          classScheduleEvents={classScheduleEventsForDots}
          hasClasses={hasClasses}
          nextEvent={nextEvent}
          childrenCount={childrenCount}
          onDateSelect={onDateSelect}
          onMonthChange={setClassScheduleMonthAnchor}
        />
      )}
    </>
  );
}
