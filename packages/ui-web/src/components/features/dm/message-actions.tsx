import { useState, useCallback, memo } from 'react';
import { Button } from '../../../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../../ui/dropdown-menu';
import {
  MessageCircle,
  MoreHorizontal,
  Bookmark,
  Forward,
  Copy,
  Trash2,
  EyeOff,
  Pin,
  SmilePlus,
} from 'lucide-react';
import { EmojiPicker } from './emoji-picker';
import { cn } from '../../../lib/utils';
import type { Message, Thread } from '../../../types/types';

interface MessageActionsProps {
  message: Message;
  onOpenThread: (thread: Thread, parentMessage: Message) => void;
  onAddReaction?: (emoji: string) => void;
  onToggleSaved?: () => void;
  onToggleHidden?: () => void;
  isThreadReply?: boolean;
  onDropdownOpenChange?: (open: boolean) => void;
}

export const MessageActions = memo(function MessageActions({
  message,
  onOpenThread,
  onAddReaction,
  onToggleSaved,
  onToggleHidden,
  isThreadReply,
  onDropdownOpenChange,
}: MessageActionsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownOpenChange = useCallback(
    (open: boolean) => {
      setIsDropdownOpen(open);
      onDropdownOpenChange?.(open);
    },
    [onDropdownOpenChange],
  );

  const handleThreadClick = useCallback(() => {
    if (message.thread) {
      onOpenThread(message.thread, message);
    } else {
      const newThread: Thread = {
        id: `thread-${message.id}`,
        messageCount: 1,
        participants: [message.sender],
        lastReply: new Date(),
      };
      onOpenThread(newThread, message);
    }
  }, [message, onOpenThread]);

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      onAddReaction?.(emoji);
    },
    [onAddReaction],
  );

  const handleHideClick = useCallback(() => {
    onToggleHidden?.();
    setIsDropdownOpen(false);
    onDropdownOpenChange?.(false);
  }, [onToggleHidden, onDropdownOpenChange]);

  return (
    <div className="absolute right-2 top-0 z-10 flex items-center gap-1 rounded-lg border bg-card px-1 py-1 shadow-md">
      {!isThreadReply && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleThreadClick}
                aria-label={message.thread ? 'Reply in thread' : 'Start a thread'}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{message.thread ? 'Reply in thread' : 'Start a thread'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <EmojiPicker onEmojiSelect={handleEmojiSelect}>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                aria-label="Add reaction"
              >
                <SmilePlus className="h-4 w-4" />
              </Button>
            </EmojiPicker>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add reaction</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onToggleSaved}
              aria-label={message.isSaved ? 'Unsave message' : 'Save message'}
            >
              <Bookmark
                className={cn('h-4 w-4', message.isSaved && 'fill-primary text-primary')}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{message.isSaved ? 'Unsave' : 'Save'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  aria-label="More actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>More</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent align="end" className="w-48 z-[100]">
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Forward className="mr-2 h-4 w-4" />
            <span>Forward</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy text</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Pin className="mr-2 h-4 w-4" />
            <span>Pin message</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleHideClick}>
            <EyeOff className="mr-2 h-4 w-4" />
            <span>Hide message</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});
