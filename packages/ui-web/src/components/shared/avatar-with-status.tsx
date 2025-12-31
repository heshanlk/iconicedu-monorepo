'use client';

import type { AvatarVM, PresenceVM } from '@iconicedu/shared-types';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { cn } from '../../lib/utils';

const STATUS_COLORS = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  idle: 'bg-gray-400',
  offline: 'bg-gray-600',
} as const;

interface AvatarWithStatusProps {
  name: string;
  avatar?: AvatarVM | null;
  alt?: string;
  fallbackText?: string;
  presence?: PresenceVM | null;
  showStatus?: boolean;
  initialsLength?: number;
  sizeClassName?: string;
  statusClassName?: string;
  fallbackClassName?: string;
}

const getInitials = (name: string, maxLength = 2) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, Math.max(1, maxLength))
    .toUpperCase();

export function AvatarWithStatus({
  name,
  avatar,
  presence,
  showStatus,
  initialsLength,
  sizeClassName,
  statusClassName,
  fallbackClassName,
}: AvatarWithStatusProps) {
  const liveStatus = presence?.liveStatus ?? 'none';
  const statusKey =
    liveStatus === 'teaching' || liveStatus === 'in_class'
      ? 'online'
      : liveStatus === 'reviewing_work'
        ? 'idle'
        : liveStatus === 'busy'
          ? 'away'
          : 'offline';
  const displayStatus = showStatus !== undefined ? showStatus : !!presence;
  const statusColor = STATUS_COLORS[statusKey];

  const avatarUrl = avatar?.url ?? '/placeholder.svg';

  return (
    <div className="relative">
      <Avatar className={sizeClassName}>
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className={fallbackClassName}>
          {getInitials(name, initialsLength)}
        </AvatarFallback>
      </Avatar>
      {displayStatus && (
        <span
          className={cn(
            'absolute rounded-full border-2 border-card',
            statusColor,
            statusClassName ?? 'bottom-0 right-0 h-2.5 w-2.5',
          )}
          aria-label={`Status: ${statusKey}`}
        />
      )}
    </div>
  );
}
