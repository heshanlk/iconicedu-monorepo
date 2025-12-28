'use client';

import { AvatarWithStatus } from '../shared/avatar-with-status';
import { cn } from '../../lib/utils';
import { AvatarGroup, AvatarGroupCount } from '../../ui/avatar';
import type { ActivityFeedItem } from '@iconicedu/shared-types';

type ActivityBadgeProps = {
  activity: ActivityFeedItem;
  className?: string;
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

export function ActivityBadge({ activity, className }: ActivityBadgeProps) {
  const leading = activity.leading;

  if (leading?.kind === 'avatars' && leading.avatars.length > 0) {
    const avatars = leading.avatars.slice(0, 2);
    const overflowCount =
      leading.overflowCount ?? Math.max(0, leading.avatars.length - avatars.length);

    return (
      <AvatarGroup className={cn('shrink-0 pt-0.5', className)}>
        {avatars.map((avatar, idx) => (
          <AvatarWithStatus
            key={`${avatar.seed ?? 'avatar'}-${idx}`}
            name={avatar.seed ?? 'Avatar'}
            avatar={avatar.url ?? ''}
            showStatus={false}
            sizeClassName="size-6 border-2 border-background"
            initialsLength={2}
          />
        ))}
        {overflowCount > 0 && (
          <AvatarGroupCount className="text-[10px] size-6">
            +{overflowCount}
          </AvatarGroupCount>
        )}
      </AvatarGroup>
    );
  }

  const actor = activity.actor;
  const actorName = 'kind' in actor ? 'System' : actor.displayName;
  const actorAvatar = 'kind' in actor ? '' : actor.avatarUrl ?? '';
  const initials = getInitials(actorName);

  return (
    <AvatarWithStatus
      name={actorName}
      avatar={actorAvatar}
      showStatus={false}
      sizeClassName={cn('size-6 shrink-0', className)}
      fallbackClassName="text-[10px]"
      fallbackText={initials}
      initialsLength={2}
    />
  );
}
