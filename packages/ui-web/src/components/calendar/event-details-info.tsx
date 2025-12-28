import type { CalendarEventVM } from '@iconicedu/shared-types';
import { Separator } from '@iconicedu/ui-web/ui/separator';
import { User, MapPin, Globe } from 'lucide-react';

interface EventDetailsInfoProps {
  event: CalendarEventVM;
}

export function EventDetailsInfo({ event }: EventDetailsInfoProps) {
  const organizer =
    event.participants.find((participant) =>
      participant.role === 'educator' || participant.role === 'staff',
    )?.displayName ?? 'Organizer';
  const visibilityLabel = event.visibility.replace('-', ' ');

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4" />
        </div>
        <span className="text-sm">
          Event by <span className="font-medium">{organizer}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center rounded-full bg-muted">
          <MapPin className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">{event.location ?? 'Online'}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center rounded-full bg-muted">
          <Globe className="h-4 w-4" />
        </div>
        <span className="text-sm">{visibilityLabel}</span>
      </div>
      <Separator />
      <div className="text-sm font-semibold">About this event</div>
      <p className="text-sm text-muted-foreground whitespace-pre-line">
        {event.description}
      </p>
    </>
  );
}
