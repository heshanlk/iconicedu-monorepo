'use client';

import { useState } from 'react';
import type { CalendarEvent } from '@iconicedu/shared-types';
import { cn } from '@iconicedu/ui-web/lib/utils';
import { isEventLive, colorVariants } from '../../lib/event-utils';
import { EventDialog } from './event-dialog';
import { EventLiveIndicator } from './event-live-indicator';

interface EventCardProps {
  event: CalendarEvent;
  onClick?: () => void;
  compact?: boolean;
}

export function EventCard({ event, onClick, compact = false }: EventCardProps) {
  const isLive = isEventLive(event);
  const [open, setOpen] = useState(false);

  const eventButton = (
    <button
      type="button"
      className={cn(
        'relative w-full h-full overflow-hidden rounded-md border p-2 text-left text-sm transition-all',
        colorVariants[event.color],
      )}
    >
      {isLive && <EventLiveIndicator />}

      {compact ? (
        <div className="flex h-full items-center gap-1.5 pr-4 text-xs">
          <span className="font-medium text-foreground truncate">{event.title}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground truncate">{event.startTime}</span>
        </div>
      ) : (
        <>
          <div className="font-medium pr-4 truncate">{event.title}</div>
          <div className="mt-0.5 text-xs text-muted-foreground truncate">{event.startTime}</div>
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
