import type { CalendarEvent } from '@iconicedu/shared-types';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { cn } from '../../lib/utils';

interface EventDetailsHeaderProps {
  event: CalendarEvent;
}

export function EventDetailsHeader({ event }: EventDetailsHeaderProps) {
  return (
    <div className="bg-background border rounded-lg shadow-sm p-4 space-y-3">
      <p className="text-sm font-medium">
        {event.date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}{' '}
        at {event.startTime} +06
      </p>

      <h2 className="font-semibold">{event.title}</h2>

      <p className="text-sm text-muted-foreground">{event.location}</p>

      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {event.guests.avatars.map((avatar, index) => (
            <Avatar
              key={index}
              className={cn(
                'border-2 border-background',
                index === 3 && 'ring-2 ring-pink-200',
              )}
            >
              <AvatarImage
                src={avatar || '/placeholder.svg'}
                alt={`Guest ${index + 1}`}
              />
              <AvatarFallback>{index + 1}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          +{event.guests.count - event.guests.avatars.length} People
        </span>
      </div>
    </div>
  );
}
