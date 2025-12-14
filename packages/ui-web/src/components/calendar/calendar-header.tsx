'use client';

import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import type { CalendarView } from './calendar';

interface CalendarHeaderProps {
  title: string;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  title,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-border bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Calendar</h1>
        </div>
        <div className="hidden h-6 w-px bg-border sm:block" />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            className="h-8 w-8 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            className="h-8 w-8 bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onToday}
            className="hidden sm:inline-flex bg-transparent"
          >
            Today
          </Button>
        </div>
        <h2 className="text-lg font-medium text-foreground">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="sm:hidden bg-transparent"
        >
          Today
        </Button>
        <Tabs value={view} onValueChange={(v) => onViewChange(v as CalendarView)}>
          <TabsList className="grid w-full grid-cols-4 sm:w-auto">
            <TabsTrigger value="month" className="text-xs sm:text-sm">
              Month
            </TabsTrigger>
            <TabsTrigger value="week" className="text-xs sm:text-sm">
              Week
            </TabsTrigger>
            <TabsTrigger value="day" className="text-xs sm:text-sm">
              Day
            </TabsTrigger>
            <TabsTrigger value="agenda" className="text-xs sm:text-sm">
              Agenda
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
}
