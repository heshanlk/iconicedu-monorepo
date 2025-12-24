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
}

export function EventCard({ event, onClick }: EventCardProps) {
  const isLive = isEventLive(event);
  const [open, setOpen] = useState(false);

  const eventButton = (
    <button
      type="button"
      className={cn(
        'w-full rounded-md border p-2 text-left text-sm transition-all relative group',
        colorVariants[event.color],
      )}
    >
      {isLive && <EventLiveIndicator />}

      <div className="font-medium pr-4">{event.title}</div>
      <div className="text-xs mt-0.5 text-muted-foreground">{event.startTime}</div>
    </button>
  );

  return (
    <EventDialog event={event} open={open} onOpenChange={setOpen}>
      {eventButton}
    </EventDialog>
  );
}
