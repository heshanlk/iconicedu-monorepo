'use client';

import { memo } from 'react';
import { Bookmark, Phone, Video, MoreHorizontal } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../lib/utils';

interface ProfileActionsProps {
  onSavedMessagesClick?: () => void;
}

const ActionButton = memo(function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Bookmark;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'h-auto flex-col gap-2 px-1 py-2 text-xs font-medium text-muted-foreground',
        onClick && 'text-foreground',
      )}
      onClick={onClick}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <span>{label}</span>
    </Button>
  );
});

export const ProfileActions = memo(function ProfileActions({
  onSavedMessagesClick,
}: ProfileActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <ActionButton icon={Bookmark} label="Saved" onClick={onSavedMessagesClick} />
      <ActionButton icon={Phone} label="Call" />
      <ActionButton icon={Video} label="Video" />
      <ActionButton icon={MoreHorizontal} label="More" />
    </div>
  );
});
