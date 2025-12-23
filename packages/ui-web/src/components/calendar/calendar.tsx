'use client';

import { useEffect, useRef, useState } from 'react';
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { CalendarHeader } from './calendar-header';
import { WeekView } from './week-view';
import { DayView } from './day-view';
import { useIsMobile } from '../../hooks/use-mobile';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { ScrollArea } from '../../ui/scroll-area';

export type CalendarView = 'week' | 'day';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  description?: string;
}

// Sample events for demonstration
const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    color: 'bg-blue-500',
    description: 'Weekly team sync',
  },
  {
    id: '2',
    title: 'Project Review',
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 30, 0, 0)),
    color: 'bg-emerald-500',
    description: 'Q4 project review with stakeholders',
  },
  {
    id: '3',
    title: 'Lunch with Client',
    start: addDays(new Date().setHours(12, 0, 0, 0), 1),
    end: addDays(new Date().setHours(13, 30, 0, 0), 1),
    color: 'bg-amber-500',
    description: 'Business lunch at downtown restaurant',
  },
  {
    id: '4',
    title: 'Design Workshop',
    start: addDays(new Date().setHours(9, 0, 0, 0), 2),
    end: addDays(new Date().setHours(12, 0, 0, 0), 2),
    color: 'bg-rose-500',
    description: 'UX design workshop',
  },
  {
    id: '5',
    title: 'Sprint Planning',
    start: addDays(new Date().setHours(10, 0, 0, 0), 3),
    end: addDays(new Date().setHours(11, 30, 0, 0), 3),
    color: 'bg-indigo-500',
    description: 'Plan next sprint tasks',
  },
  {
    id: '6',
    title: 'Code Review',
    start: addDays(new Date().setHours(15, 0, 0, 0), 4),
    end: addDays(new Date().setHours(16, 0, 0, 0), 4),
    color: 'bg-cyan-500',
    description: 'Review PR submissions',
  },
  {
    id: '7',
    title: 'Product Demo',
    start: addDays(new Date().setHours(11, 0, 0, 0), 5),
    end: addDays(new Date().setHours(12, 0, 0, 0), 5),
    color: 'bg-purple-500',
    description: 'Demo new features to the team',
  },
];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('week');
  const [events] = useState<CalendarEvent[]>(sampleEvents);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setView('day');
    }
  }, [isMobile]);

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const navigatePrevious = () => {
    switch (view) {
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (view) {
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const getHeaderTitle = () => {
    switch (view) {
      case 'week':
        const weekStart = startOfWeek(currentDate);
        const weekEnd = addDays(weekStart, 6);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    setView('day');
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX.current;
    const dy = touch.clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    const threshold = 40;
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;

    if (dx < 0) {
      navigateNext();
    } else {
      navigatePrevious();
    }
  };

  return (
    <Card className="flex min-h-0 flex-1">
      <CardHeader className="p-0">
        <CalendarHeader
          title={getHeaderTitle()}
          view={view}
          onViewChange={setView}
          onPrevious={navigatePrevious}
          onNext={navigateNext}
          onToday={navigateToday}
        />
      </CardHeader>
      <CardContent className="min-h-0 flex-1 p-0">
        <ScrollArea
          className="h-full"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {view === 'week' && <WeekView currentDate={currentDate} events={events} />}
          {view === 'day' && <DayView currentDate={currentDate} events={events} />}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
