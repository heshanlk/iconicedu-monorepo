'use client';

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
  avatar?: string;
  status?: keyof typeof STATUS_COLORS | 'online' | 'away' | 'idle' | 'offline';
  isOnline?: boolean;
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
  status,
  isOnline,
  showStatus,
  initialsLength,
  sizeClassName,
  statusClassName,
  fallbackClassName,
}: AvatarWithStatusProps) {
  const displayStatus =
    showStatus !== undefined ? showStatus : isOnline !== undefined ? isOnline : !!status;
  const statusColor = status ? STATUS_COLORS[status] : STATUS_COLORS.online;

  return (
    <div className="relative">
      <Avatar className={sizeClassName}>
        <AvatarImage src={avatar || '/placeholder.svg'} alt={name} />
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
          aria-label={`Status: ${status ?? (isOnline ? 'online' : 'offline')}`}
        />
      )}
    </div>
  );
}
