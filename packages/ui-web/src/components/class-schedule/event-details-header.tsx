import type { ClassScheduleVM } from '@iconicedu/shared-types';
import { cn } from '../../lib/utils';
import { AvatarGroup, AvatarGroupCount } from '../../ui/avatar';
import { AvatarWithStatus } from '../shared/avatar-with-status';
import { formatEventTime } from '../../lib/class-schedule-utils';

interface EventDetailsHeaderProps {
  event: ClassScheduleVM;
}

export function EventDetailsHeader({ event }: EventDetailsHeaderProps) {
  const maxVisibleGuests = 2;
  const visibleGuests = event.participants.slice(0, maxVisibleGuests);
  const remainingGuests = Math.max(0, event.participants.length - visibleGuests.length);
  const startDate = new Date(event.startAt);

  return (
    <div className="bg-background border rounded-xl shadow-sm p-4 space-y-3">
      <p className="text-sm font-medium">
        {startDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}{' '}
        at {formatEventTime(event.startAt)}
      </p>

      <h2 className="font-semibold">{event.title}</h2>

      <p className="text-sm text-muted-foreground">{event.location}</p>

      <div className="flex items-center gap-2">
        <AvatarGroup>
          {visibleGuests.map((participant, index) => (
            <AvatarWithStatus
              key={index}
              name={participant.displayName ?? `Guest ${index + 1}`}
              avatar={{ source: 'external', url: participant.avatarUrl ?? '' }}
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
