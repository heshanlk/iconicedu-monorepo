'use client';

import { memo } from 'react';
import { Info, Bookmark, Pin } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../lib/utils';
import { useRightSidebar } from './right-sidebar-provider';

const ActionButton = memo(function ActionButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Info;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-9 w-9 text-muted-foreground', active && 'text-primary')}
      onClick={onClick}
      aria-label={label}
    >
      <span
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full bg-muted',
          active && 'bg-primary/10',
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
    </Button>
  );
});

export const ChannelHeaderActions = memo(function ChannelHeaderActions() {
  const { toggle, isActive, channel, currentUserId } = useRightSidebar();
  const otherParticipant =
    channel.kind === 'dm'
      ? channel.participants.find((participant) => participant.id !== currentUserId)
      : null;

  return (
    <div className="flex items-center gap-2">
      <ActionButton
        icon={Bookmark}
        label="Saved messages"
        active={isActive('saved')}
        onClick={() => toggle({ key: 'saved' })}
      />
      <ActionButton
        icon={Pin}
        label="Pinned items"
        active={isActive('pinned')}
        onClick={() => toggle({ key: 'pinned' })}
      />
      <ActionButton
        icon={Info}
        label="Info"
        active={
          channel.kind === 'dm'
            ? isActive('profile', { key: 'profile', userId: otherParticipant?.id ?? '' })
            : isActive('channel_info')
        }
        onClick={() =>
          channel.kind === 'dm' && otherParticipant
            ? toggle({ key: 'profile', userId: otherParticipant.id })
            : toggle({ key: 'channel_info' })
        }
      />
    </div>
  );
});
