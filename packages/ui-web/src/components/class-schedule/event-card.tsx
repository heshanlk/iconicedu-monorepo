'use client';

import { useState } from 'react';
import type { ClassScheduleVM } from '@iconicedu/shared-types';
import { cn } from '@iconicedu/ui-web/lib/utils';
import {
  formatEventTime,
  isEventLive,
  colorVariants,
} from '../../lib/class-schedule-utils';
import { EventDialog } from './event-dialog';
import { EventLiveIndicator } from './event-live-indicator';

interface EventCardProps {
  event: ClassScheduleVM;
  compact?: boolean;
}

export function EventCard({ event, compact = false }: EventCardProps) {
  const isLive = isEventLive(event);
  const [open, setOpen] = useState(false);
  const startTime = formatEventTime(event.startAt);
  const colorClassName = event.color ? colorVariants[event.color] : colorVariants.blue;

  const eventButton = (
    <button
      type="button"
      className={cn(
        'relative w-full h-full overflow-hidden rounded-md border p-2 text-left text-sm transition-all',
        colorClassName,
      )}
    >
      {isLive && <EventLiveIndicator />}

      {compact ? (
        <div className="flex h-full items-center gap-1.5 pr-4 text-xs">
          <span className="font-medium text-foreground truncate">{event.title}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground truncate">{startTime}</span>
        </div>
      ) : (
        <>
          <div className="font-medium pr-4 truncate">{event.title}</div>
          <div className="mt-0.5 text-xs text-muted-foreground truncate">{startTime}</div>
        </>
      )}
    </button>
  );

  return (
    <EventDialog event={event} open={open} onOpenChange={setOpen}>
      {eventButton}
    </EventDialog>
  );
}
