'use client';

import type { ReactNode } from 'react';
import { useState, useCallback, memo } from 'react';
import { AvatarWithStatus } from '../shared/avatar-with-status';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import type { Message, Thread } from '@iconicedu/shared-types';
import { cn } from '../../lib/utils';
import { formatTime, formatFullDate } from '../../lib/message-utils';
import { ReactionBar } from './shared/reaction-bar';
import { ThreadIndicator } from './shared/thread-indicator';
import { VisibilityBadge } from './shared/visibility-badge';
import { HiddenMessagePlaceholder } from './shared/hidden-message-placeholder';
import { MessageActions } from './message-actions';

export interface MessageBaseProps {
  message: Message;
  onOpenThread: (thread: Thread, parentMessage: Message) => void;
  isThreadReply?: boolean;
  children?: ReactNode;
  className?: string;
  onProfileClick: (userId: string) => void;
  onToggleReaction?: (emoji: string) => void;
  onToggleSaved?: () => void;
  onToggleHidden?: () => void;
  currentUserId?: string;
}

export const MessageBase = memo(function MessageBase({
  message,
  onOpenThread,
  isThreadReply = false,
  children,
  className,
  onProfileClick,
  onToggleReaction,
  onToggleSaved,
  onToggleHidden,
  currentUserId,
}: MessageBaseProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileClick = useCallback(() => {
    onProfileClick(message.sender.id);
  }, [onProfileClick, message.sender.id]);

  const handleToggleReaction = useCallback(
    (emoji: string) => {
      onToggleReaction?.(emoji);
    },
    [onToggleReaction],
  );

  const handleThreadClick = useCallback(() => {
    if (message.thread) {
      onOpenThread(message.thread, message);
    }
  }, [message, onOpenThread]);

  if (message.isHidden) {
    return (
      <div className="group relative flex items-start gap-3 rounded-xl px-2 py-1.5">
        <button
          onClick={handleProfileClick}
          className="flex-shrink-0 transition-opacity hover:opacity-80"
          aria-label={`View ${message.sender.displayName}'s profile`}
        >
          <AvatarWithStatus
            name={message.sender.displayName}
            avatar={message.sender.avatar.url ?? ''}
            showStatus={false}
            sizeClassName="h-9 w-9"
            initialsLength={1}
          />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <button
              onClick={handleProfileClick}
              className="text-sm font-semibold text-foreground hover:underline"
            >
              {message.sender.displayName}
            </button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-muted-foreground cursor-default">
                    {formatTime(message.timestamp)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{formatFullDate(message.timestamp)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <HiddenMessagePlaceholder onUnhide={onToggleHidden!} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative flex items-start gap-3 rounded-xl px-4 py-2 transition-colors hover:bg-muted/50',
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!isDropdownOpen) {
          setIsHovered(false);
        }
      }}
      data-message-id={message.id}
    >
      <button
        onClick={handleProfileClick}
        className="flex-shrink-0 transition-opacity hover:opacity-80"
        aria-label={`View ${message.sender.displayName}'s profile`}
      >
        <AvatarWithStatus
          name={message.sender.displayName}
          avatar={message.sender.avatar.url ?? ''}
          showStatus={false}
          sizeClassName="h-9 w-9"
          initialsLength={1}
        />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <button
          onClick={handleProfileClick}
          className="text-sm font-semibold text-foreground hover:underline"
        >
          {message.sender.displayName}
        </button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground cursor-default">
                  {formatTime(message.timestamp)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{formatFullDate(message.timestamp)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <VisibilityBadge message={message} />
          {message.isEdited && (
            <span className="text-[10px] text-muted-foreground">(edited)</span>
          )}
        </div>

        {children}

        <ReactionBar
          reactions={message.reactions}
          onToggleReaction={handleToggleReaction}
          currentUserId={currentUserId}
        />

        {message.thread && !isThreadReply && (
          <ThreadIndicator
            thread={message.thread}
            onClick={handleThreadClick}
            unreadCount={message.thread.unreadCount}
          />
        )}
      </div>

      {(isHovered || isDropdownOpen) && (
        <MessageActions
          message={message}
          onOpenThread={onOpenThread}
          onAddReaction={handleToggleReaction}
          onToggleSaved={onToggleSaved}
          onToggleHidden={onToggleHidden}
          isThreadReply={isThreadReply}
          onDropdownOpenChange={setIsDropdownOpen}
        />
      )}
    </div>
  );
});
