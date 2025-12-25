'use client';

import { Button } from '../../ui/button';
import { ButtonGroup } from '../../ui/button-group';
import { ChevronLeft, ChevronRight, Columns4, Columns } from 'lucide-react';
import type { CalendarView } from '@iconicedu/shared-types';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onNavigate,
}: CalendarHeaderProps) {
  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const dateRange = (() => {
    if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
      });
    }
  })();

  return (
    <div className="flex items-center justify-between border-b bg-background p-4">
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center justify-center rounded-xl border bg-muted px-2.5 py-1.5">
          <span className="text-[10px] font-medium text-muted-foreground uppercase leading-tight">
            {currentDate.toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className="text-lg font-semibold leading-tight">
            {currentDate.getDate()}
          </span>
        </div>

        <div>
          <h1 className="text-lg font-semibold">{monthYear}</h1>
          <p className="text-xs text-muted-foreground">{dateRange}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ButtonGroup>
          <Button variant="outline" size="icon" onClick={() => onNavigate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button variant="outline" onClick={() => onNavigate('today')}>
            Today
          </Button>

          <Button variant="outline" size="icon" onClick={() => onNavigate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </ButtonGroup>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onViewChange(view === 'week' ? 'day' : 'week')}
        >
          {view === 'week' ? (
            <Columns className="h-4 w-4" />
          ) : (
            <Columns4 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
