import { memo, useCallback } from 'react';
import { Button } from '../../ui/button';
import { Phone, Video, MoreVertical, Bookmark } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import type { UserProfile } from '@iconicedu/shared-types';
import { AvatarWithStatus } from '../shared/avatar-with-status';

interface MessageHeaderProps {
  user: UserProfile;
  onProfileClick?: () => void;
  onSavedMessagesClick?: () => void;
}

const HeaderButton = memo(function HeaderButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: any;
  label?: string;
  onClick?: () => void;
}) {
  const button = (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  if (!label) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
});

export const MessageHeader = memo(function MessageHeader({
  user,
  onProfileClick,
  onSavedMessagesClick,
}: MessageHeaderProps) {
  const isOnline =
    user.presence?.liveStatus !== undefined
      ? user.presence.liveStatus !== 'none'
      : undefined;
  const handleProfileClick = useCallback(() => {
    onProfileClick?.();
  }, [onProfileClick]);

  const handleSavedClick = useCallback(() => {
    onSavedMessagesClick?.();
  }, [onSavedMessagesClick]);

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <button
        onClick={handleProfileClick}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <AvatarWithStatus
          name={user.displayName}
          avatar={user.avatar.url ?? ''}
          isOnline={isOnline}
          sizeClassName="h-8 w-8"
          initialsLength={1}
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-foreground">
              {user.displayName}
            </span>
          </div>
          {user.status && (
            <span className="text-xs text-muted-foreground">{user.status}</span>
          )}
        </div>
      </button>
      <TooltipProvider>
        <div className="flex items-center gap-1">
          <HeaderButton
            icon={Bookmark}
            label="Saved messages"
            onClick={handleSavedClick}
          />
          <HeaderButton icon={Phone} />
          <HeaderButton icon={Video} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleProfileClick}>
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem>View meeting history</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Mute conversation</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Report issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipProvider>
    </header>
  );
});
