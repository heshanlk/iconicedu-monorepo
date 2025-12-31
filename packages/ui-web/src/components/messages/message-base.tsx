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
import type { MessageVM, ThreadVM, UUID } from '@iconicedu/shared-types';
import { cn } from '../../lib/utils';
import { formatTime, formatFullDate } from '../../lib/message-utils';
import { ReactionBar } from './shared/reaction-bar';
import { ThreadIndicator } from './shared/thread-indicator';
import { VisibilityBadge } from './shared/visibility-badge';
import { HiddenMessagePlaceholder } from './shared/hidden-message-placeholder';
import { MessageActions } from './message-actions';

export interface MessageBaseProps {
  message: MessageVM;
  onOpenThread: (thread: ThreadVM, parentMessage: MessageVM) => void;
  isThreadReply?: boolean;
  children?: ReactNode;
  className?: string;
  onProfileClick: (userId: UUID) => void;
  onToggleReaction?: (emoji: string) => void;
  onToggleSaved?: () => void;
  onToggleHidden?: () => void;
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
}: MessageBaseProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileClick = useCallback(() => {
    onProfileClick(message.core.sender.ids.id);
  }, [onProfileClick, message.core.sender.ids.id]);

  const handleToggleReaction = useCallback(
    (emoji: string) => {
      onToggleReaction?.(emoji);
    },
    [onToggleReaction],
  );

  const handleThreadClick = useCallback(() => {
    if (message.social.thread) {
      onOpenThread(message.social.thread, message);
    }
  }, [message, onOpenThread]);

  if (message.state?.isHidden) {
    return (
      <div className="group relative flex items-start gap-3 rounded-xl px-2 py-1.5">
        <button
          onClick={handleProfileClick}
          className="flex-shrink-0 transition-opacity hover:opacity-80"
          aria-label={`View ${message.core.sender.profile.displayName}'s profile`}
        >
          <AvatarWithStatus
            name={message.core.sender.profile.displayName}
            avatar={message.core.sender.profile.avatar}
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
              {message.core.sender.profile.displayName}
            </button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-muted-foreground cursor-default">
                    {formatTime(message.core.createdAt)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{formatFullDate(message.core.createdAt)}</p>
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
      data-message-id={message.ids.id}
    >
      <button
        onClick={handleProfileClick}
        className="flex-shrink-0 transition-opacity hover:opacity-80"
        aria-label={`View ${message.core.sender.profile.displayName}'s profile`}
      >
        <AvatarWithStatus
          name={message.core.sender.profile.displayName}
          avatar={message.core.sender.profile.avatar}
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
          {message.core.sender.profile.displayName}
        </button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground cursor-default">
                  {formatTime(message.core.createdAt)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{formatFullDate(message.core.createdAt)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <VisibilityBadge message={message} />
          {message.state?.isEdited && (
            <span className="text-[10px] text-muted-foreground">(edited)</span>
          )}
        </div>

        {children}

          <ReactionBar reactions={message.social.reactions} onToggleReaction={handleToggleReaction} />

        {message.social.thread && !isThreadReply && (
          <ThreadIndicator
            thread={message.social.thread}
            onClick={handleThreadClick}
            unreadCount={message.social.thread.readState?.unreadCount}
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
