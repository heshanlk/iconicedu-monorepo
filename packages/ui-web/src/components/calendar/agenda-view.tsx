'use client';

import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  isPast,
} from 'date-fns';
import { cn } from '../../lib/utils';
import { Card, CardContent } from '../../ui/card';
import { ScrollArea } from '../../ui/scroll-area';
import { Separator } from '../../ui/separator';
import { CalendarDays, Clock } from 'lucide-react';
import type { CalendarEvent } from './calendar';

interface AgendaViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export function AgendaView({ currentDate, events }: AgendaViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const daysWithEvents = days
    .map((day) => ({
      date: day,
      events: events
        .filter((event) => isSameDay(new Date(event.start), day))
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()),
    }))
    .filter((day) => day.events.length > 0);

  if (daysWithEvents.length === 0) {
    return (
      <Card className="flex h-full flex-col items-center justify-center border-0 bg-transparent text-muted-foreground shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
          <CalendarDays className="h-16 w-16" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">No events</h3>
            <p className="text-sm">No events scheduled for this month</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-0 bg-transparent shadow-none">
      <CardContent className="h-full p-0">
        <ScrollArea className="h-full">
          <div className="p-4 sm:p-6">
            <div className="space-y-6">
              {daysWithEvents.map(({ date, events: dayEvents }) => {
                const isDayToday = isToday(date);
                const isDayPast = isPast(date) && !isDayToday;

                return (
                  <div key={date.toISOString()} className="space-y-3">
                    {/* Date header */}
                    <div
                      className={cn(
                        'sticky top-0 z-10 flex items-center gap-3 bg-background py-2',
                        isDayPast && 'opacity-60',
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-12 w-12 flex-col items-center justify-center rounded-lg border',
                          isDayToday
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-muted',
                        )}
                      >
                        <span className="text-xs font-medium uppercase">
                          {format(date, 'EEE')}
                        </span>
                        <span className="text-lg font-bold">
                          {format(date, 'd')}
                        </span>
                      </div>
                      <div>
                        <h3
                          className={cn(
                            'font-semibold',
                            isDayToday ? 'text-primary' : 'text-foreground',
                          )}
                        >
                          {isDayToday ? 'Today' : format(date, 'EEEE')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {format(date, 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Separator className="mx-0" />

                    {/* Events list */}
                    <div className="space-y-2 pl-2 sm:pl-4">
                      {dayEvents.map((event) => (
                        <Card
                          key={event.id}
                          className={cn(
                            'flex gap-3 border-border bg-card p-3 transition-colors hover:bg-muted/50',
                            isDayPast && 'opacity-60',
                          )}
                          size="sm"
                        >
                          <div
                            className={cn(
                              'w-1 shrink-0 rounded-full',
                              event.color || 'bg-primary',
                            )}
                          />
                          <div className="flex-1 space-y-1">
                            <h4 className="font-medium text-foreground">
                              {event.title}
                            </h4>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span>
                                {format(new Date(event.start), 'h:mm a')} -{' '}
                                {format(new Date(event.end), 'h:mm a')}
                              </span>
                            </div>
                            {event.description && (
                              <p className="text-sm text-muted-foreground">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
