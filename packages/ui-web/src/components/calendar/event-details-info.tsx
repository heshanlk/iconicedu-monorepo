import type { CalendarEvent } from '@iconicedu/shared-types';
import { User, MapPin, Globe } from 'lucide-react';

interface EventDetailsInfoProps {
  event: CalendarEvent;
}

export function EventDetailsInfo({ event }: EventDetailsInfoProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4" />
        </div>
        <span className="text-sm">
          Event by <span className="font-medium">{event.organizer}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <MapPin className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">{event.location}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <Globe className="h-4 w-4" />
        </div>
        <span className="text-sm">{event.visibility}</span>
      </div>

      <p className="text-sm text-muted-foreground whitespace-pre-line">
        {event.description}
      </p>
    </div>
  );
}
