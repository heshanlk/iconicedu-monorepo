import type { CalendarEvent } from '@iconicedu/shared-types';
import { cn } from '../../lib/utils';
import { AvatarGroup, AvatarGroupCount } from '../../ui/avatar';
import { AvatarWithStatus } from '../shared/avatar-with-status';

interface EventDetailsHeaderProps {
  event: CalendarEvent;
}

export function EventDetailsHeader({ event }: EventDetailsHeaderProps) {
  const maxVisibleGuests = 2;
  const visibleGuests = event.guests.avatars.slice(0, maxVisibleGuests);
  const remainingGuests = event.guests.count - visibleGuests.length;

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
        <AvatarGroup>
          {visibleGuests.map((avatar, index) => (
            <AvatarWithStatus
              key={index}
              name={`Guest ${index + 1}`}
              avatar={avatar}
              showStatus={false}
              sizeClassName={cn('border-2 border-background')}
            />
          ))}
          {remainingGuests > 0 && (
            <AvatarGroupCount className="text-sm">+{remainingGuests}</AvatarGroupCount>
          )}
        </AvatarGroup>
      </div>
    </div>
  );
}
