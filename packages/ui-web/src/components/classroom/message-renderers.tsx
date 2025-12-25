'use client';

import type { ReactNode } from 'react';
import { useState, useCallback, useMemo } from 'react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { Badge } from '../../ui/badge';
import {
  MessageCircle,
  Smile,
  MoreHorizontal,
  Bookmark,
  Forward,
  Copy,
  Trash2,
  EyeOff,
  FileText,
  Download,
  Figma,
  PenTool,
  Layers,
  ExternalLink,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  Video,
  Users,
  BookOpen,
  TrendingUp,
  Send,
  Award,
  GraduationCap,
  Play,
  Pause,
  Pin,
  Flag,
} from 'lucide-react';
import { EmojiPicker } from './emoji-picker';
import type {
  Message,
  Thread,
  Reaction,
  TextMessage as TextMessageType,
  ImageMessage as ImageMessageType,
  FileMessage as FileMessageType,
  DesignFileUpdateMessage,
  PaymentReminderMessage as PaymentReminderMessageType,
  EventReminderMessage as EventReminderMessageType,
  LessonAssignmentMessage as LessonAssignmentMessageType,
  ProgressUpdateMessage as ProgressUpdateMessageType,
  SessionBookingMessage as SessionBookingMessageType,
  HomeworkSubmissionMessage as HomeworkSubmissionMessageType,
  LinkPreviewMessage as LinkPreviewMessageType, // Added link preview type import
  AudioRecordingMessage as AudioRecordingMessageType, // Added for AudioRecording
} from '@iconicedu/shared-types';
import { cn } from '../../lib/utils';
import { formatTime, formatFullDate, formatThreadTime } from '../../lib/message-utils';
import { ANIMATION_DELAYS } from '../../constants/message-constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

// ===========================================
// SHARED COMPONENTS
// ===========================================

// Removed shared component definitions as they are now imported from separate files.

// ===========================================
// MESSAGE BASE COMPONENT
// ===========================================

interface MessageBaseProps {
  message: Message;
  onOpenThread: (thread: Thread, parentMessage: Message) => void;
  isThreadReply?: boolean;
  children: ReactNode;
  className?: string;
  onProfileClick: (userId: string) => void;
  onToggleReaction?: (emoji: string) => void;
  onToggleSaved?: () => void; // Added save toggle prop
  onToggleHidden?: () => void; // Added hide toggle prop
  currentUserId?: string;
}

// Updating ReactionBar to expand smoothly with grid-based animation
export const ReactionBar = React.memo(function ReactionBar({
  reactions,
  onToggleReaction,
  currentUserId,
}: {
  reactions: Reaction[];
  onToggleReaction?: (emoji: string) => void;
  currentUserId?: string;
}) {
  const hasReactions = reactions && reactions.length > 0;

  return (
    <div
      className={cn(
        'grid transition-all duration-300 ease-out',
        hasReactions ? 'grid-rows-[1fr] mt-1.5' : 'grid-rows-[0fr] mt-0',
      )}
    >
      <div className="overflow-hidden">
        <div className="flex flex-wrap gap-1">
          {reactions.map((reaction, index) => {
            const hasReacted = currentUserId
              ? reaction.users.includes(currentUserId)
              : false;
            return (
              <button
                key={`${reaction.emoji}-${index}`}
                onClick={() => onToggleReaction?.(reaction.emoji)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-all duration-200 ease-out hover:scale-105 active:scale-95 animate-in fade-in zoom-in-95',
                  hasReacted
                    ? 'border-primary bg-primary/10 hover:bg-primary/20 shadow-sm'
                    : 'border-border bg-secondary hover:bg-accent hover:shadow-sm',
                )}
                style={{
                  animationDelay: `${index * ANIMATION_DELAYS.REACTION_STAGGER}ms`,
                  animationDuration: `${ANIMATION_DELAYS.REACTION_DURATION}ms`,
                }}
                aria-label={`${reaction.emoji} reaction, ${reaction.count} ${reaction.count === 1 ? 'person' : 'people'}`}
              >
                <span>{reaction.emoji}</span>
                <span className="text-muted-foreground">{reaction.count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export const ThreadIndicator = React.memo(function ThreadIndicator({
  thread,
  onOpenThread,
  parentMessage,
}: {
  thread: Thread;
  onOpenThread: (thread: Thread, parentMessage: Message) => void;
  parentMessage: Message;
}) {
  const handleClick = useCallback(() => {
    onOpenThread(thread, parentMessage);
  }, [onOpenThread, thread, parentMessage]);

  return (
    <button
      onClick={handleClick}
      className="mt-2 flex items-center gap-2 text-xs text-primary hover:underline"
      aria-label={`View thread with ${thread.messageCount} ${thread.messageCount === 1 ? 'reply' : 'replies'}`}
    >
      <div className="flex -space-x-1.5">
        {thread.participants.slice(0, 3).map((participant) => (
          <Avatar key={participant.id} className="h-5 w-5 border-2 border-background">
            <AvatarImage
              src={participant.avatar || '/placeholder.svg'}
              alt={participant.name}
            />
            <AvatarFallback className="text-[8px]">
              {participant.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span className="font-medium text-primary">
        {thread.messageCount} {thread.messageCount === 1 ? 'reply' : 'replies'}
      </span>
      {thread.unreadCount && thread.unreadCount > 0 && (
        <span className="inline-flex items-center justify-center h-5 min-w-0 px-1.5 text-[10px] font-bold text-destructive-foreground bg-destructive rounded-full">
          {thread.unreadCount}
        </span>
      )}
      <span className="text-muted-foreground">
        Last reply {formatThreadTime(thread.lastReply)}
      </span>
    </button>
  );
});

export const MessageActions = React.memo(function MessageActions({
  message,
  onOpenThread,
  onAddReaction,
  onToggleSaved,
  onToggleHidden,
  isThreadReply,
}: {
  message: Message;
  onOpenThread: (thread: Thread, parentMessage: Message) => void;
  onAddReaction?: (emoji: string) => void;
  onToggleSaved?: () => void;
  onToggleHidden?: () => void;
  isThreadReply?: boolean;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleThreadClick = useCallback(() => {
    if (message.thread) {
      onOpenThread(message.thread, message);
    } else {
      // Create a new thread
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
  }, [onToggleHidden]);

  return (
    <div className="absolute right-2 top-0 z-10 flex items-center gap-1 rounded-xl border bg-card px-1 py-1 shadow-md">
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

      <EmojiPicker onEmojiSelect={handleEmojiSelect}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                aria-label="Add reaction"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add reaction</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </EmojiPicker>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onToggleSaved}
              aria-label={message.isSaved ? 'Remove bookmark' : 'Bookmark message'}
            >
              <Bookmark
                className={cn('h-4 w-4', message.isSaved && 'fill-primary text-primary')}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{message.isSaved ? 'Remove bookmark' : 'Bookmark message'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>More options</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent align="end" className="w-48" side="bottom" sideOffset={8}>
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
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Flag className="mr-2 h-4 w-4" />
            <span>Mark as important</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleHideClick}>
            <EyeOff className="mr-2 h-4 w-4" />
            <span>{message.isHidden ? 'Unhide message' : 'Hide message'}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

export const VisibilityBadge = React.memo(function VisibilityBadge({
  message,
}: {
  message: Message;
}) {
  if (message.visibility.type === 'all') return null;

  const getVisibilityText = () => {
    if (message.visibility.type === 'sender-only') return 'Only visible to you';
    if (message.visibility.type === 'recipient-only') return 'Only visible to recipient';
    if (message.visibility.type === 'specific-users') return 'Visible to specific users';
    return 'Private';
  };

  return (
    <Badge variant="secondary" className="text-[10px] gap-1">
      <EyeOff className="h-2.5 w-2.5" />
      {getVisibilityText()}
    </Badge>
  );
});

export const HiddenMessagePlaceholder = React.memo(function HiddenMessagePlaceholder({
  onUnhide,
}: {
  onUnhide: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20 px-3 py-2">
      <EyeOff className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Message hidden</span>
      <Button
        variant="link"
        size="sm"
        onClick={onUnhide}
        className="ml-auto h-auto p-0 text-xs text-primary hover:underline"
      >
        Unhide
      </Button>
    </div>
  );
});

// Moved import statements for shared components to the top.
// import { ReactionBar } from "./shared/reaction-bar"
// import { ThreadIndicator } from "./shared/thread-indicator"
// import { VisibilityBadge } from "./shared/visibility-badge"
// import { HiddenMessagePlaceholder } from "./shared/hidden-message-placeholder"
// import { MessageActions } from "./message-actions"

export function MessageBase({
  message,
  onOpenThread,
  isThreadReply = false,
  children,
  className,
  onProfileClick,
  onToggleReaction,
  onToggleSaved, // Destructure save toggle prop
  onToggleHidden, // Destructure hide toggle prop
  currentUserId,
}: MessageBaseProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileClick = useCallback(() => {
    onProfileClick(message.sender.id);
  }, [onProfileClick, message.sender.id]);

  if (message.isHidden) {
    return (
      <div className="group relative flex gap-3 rounded-xl px-2 py-1.5">
        <button
          onClick={handleProfileClick}
          className="flex-shrink-0 transition-opacity hover:opacity-80"
          aria-label={`View ${message.sender.name}'s profile`}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={message.sender.avatar || '/placeholder.svg'}
              alt={message.sender.name}
            />
            <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <button
              onClick={handleProfileClick}
              className="text-sm font-semibold text-foreground hover:underline"
            >
              {message.sender.name}
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
        'group relative flex gap-3 rounded-xl px-4 py-2 transition-colors hover:bg-muted/50',
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
        aria-label={`View ${message.sender.name}'s profile`}
      >
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={message.sender.avatar || '/placeholder.svg'}
            alt={message.sender.name}
          />
          <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleProfileClick}
            className="text-sm font-semibold text-foreground hover:underline"
          >
            {message.sender.name}
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
          onToggleReaction={onToggleReaction}
          currentUserId={currentUserId}
        />

        {message.thread && !isThreadReply && (
          <ThreadIndicator
            thread={message.thread}
            onOpenThread={onOpenThread} // Pass onOpenThread to ThreadIndicator
            parentMessage={message}
          />
        )}
      </div>

      {(isHovered || isDropdownOpen) && (
        <MessageActions
          message={message}
          onOpenThread={onOpenThread}
          onAddReaction={onToggleReaction}
          onToggleSaved={onToggleSaved}
          onToggleHidden={onToggleHidden} // Pass hide handler to MessageActions
          isThreadReply={isThreadReply}
        />
      )}
    </div>
  );
}

// ===========================================
// MESSAGE TYPE RENDERERS
// ===========================================

interface BaseMessageRendererProps {
  onOpenThread: (thread: Thread, parentMessage: Message) => void;
  isThreadReply?: boolean;
  onProfileClick: (userId: string) => void;
  onToggleReaction?: (emoji: string) => void;
  onToggleSaved?: () => void; // Added save toggle prop
  onToggleHidden?: () => void; // Added hide toggle prop
  currentUserId?: string;
}

// Text Message
interface TextMessageProps extends BaseMessageRendererProps {
  message: TextMessageType;
}

export function TextMessage({
  message,
  onOpenThread,
  isThreadReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved, // Propagated from MessageBaseProps
  onToggleHidden, // Propagated from MessageBaseProps
  currentUserId,
}: TextMessageProps) {
  return (
    <MessageBase
      message={message}
      onOpenThread={onOpenThread}
      isThreadReply={isThreadReply}
      onProfileClick={onProfileClick}
      onToggleReaction={onToggleReaction}
      onToggleSaved={onToggleSaved} // Pass prop down
      onToggleHidden={onToggleHidden} // Pass prop down
      currentUserId={currentUserId}
    >
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
        {message.content}
      </p>
    </MessageBase>
  );
}

// Image Message
interface ImageMessageProps extends BaseMessageRendererProps {
  message: ImageMessageType;
}

export function ImageMessage({
  message,
  onOpenThread,
  isThreadReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved, // Propagated from MessageBaseProps
  onToggleHidden, // Propagated from MessageBaseProps
  currentUserId,
}: ImageMessageProps) {
  return (
    <MessageBase
      message={message}
      onOpenThread={onOpenThread}
      isThreadReply={isThreadReply}
      onProfileClick={onProfileClick}
      onToggleReaction={onToggleReaction}
      onToggleSaved={onToggleSaved} // Pass prop down
      onToggleHidden={onToggleHidden} // Pass prop down
      currentUserId={currentUserId}
    >
      {message.content && (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words mb-2">
          {message.content}
        </p>
      )}
      <div className="overflow-hidden rounded-xl border border-border max-w-sm">
        <img
          src={message.attachment.url || '/placeholder.svg'}
          alt={message.attachment.name}
          className="w-full h-auto"
        />
      </div>
    </MessageBase>
  );
}

// File Message
interface FileMessageProps extends BaseMessageRendererProps {
  message: FileMessageType;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function FileMessage({
  message,
  onOpenThread,
  isThreadReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved, // Propagated from MessageBaseProps
  onToggleHidden, // Propagated from MessageBaseProps
  currentUserId,
}: FileMessageProps) {
  return (
    <MessageBase
      message={message}
      onOpenThread={onOpenThread}
      isThreadReply={isThreadReply}
      onProfileClick={onProfileClick}
      onToggleReaction={onToggleReaction}
      onToggleSaved={onToggleSaved} // Pass prop down
      onToggleHidden={onToggleHidden} // Pass prop down
      currentUserId={currentUserId}
    >
      {message.content && (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words mb-2">
          {message.content}
        </p>
      )}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-3 max-w-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {message.attachment.name}
          </p>
          {message.attachment.size && (
            <p className="text-xs text-muted-foreground">
              {formatFileSize(message.attachment.size)}
            </p>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </MessageBase>
  );
}

// Design File Message
interface DesignFileMessageProps extends BaseMessageRendererProps {
  message: DesignFileUpdateMessage;
}

const toolIcons = {
  figma: Figma,
  sketch: PenTool,
  'adobe-xd': Layers,
  canva: Layers,
  other: Layers,
};

const toolColors = {
  figma: 'bg-[#F24E1E]/10 text-[#F24E1E]',
  sketch: 'bg-[#F7B500]/10 text-[#F7B500]',
  'adobe-xd': 'bg-[#FF61F6]/10 text-[#FF61F6]',
  canva: 'bg-[#00C4CC]/10 text-[#00C4CC]',
  other: 'bg-primary/10 text-primary',
};

export function DesignFileMessage({
  message,
  onOpenThread,
  isThreadReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved, // Propagated from MessageBaseProps
  onToggleHidden, // Propagated from MessageBaseProps
  currentUserId,
}: DesignFileMessageProps) {
  const ToolIcon = toolIcons[message.attachment.tool] || Layers;
  const toolColor = toolColors[message.attachment.tool] || toolColors.other;

  return (
    <MessageBase
      message={message}
      onOpenThread={onOpenThread}
      isThreadReply={isThreadReply}
      onProfileClick={onProfileClick}
      onToggleReaction={onToggleReaction}
      onToggleSaved={onToggleSaved} // Pass prop down
      onToggleHidden={onToggleHidden} // Pass prop down
      currentUserId={currentUserId}
    >
      {message.content && (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words mb-2">
          {message.content}
        </p>
      )}
      <div className="rounded-xl border border-border overflow-hidden max-w-md">
        {message.attachment.thumbnail && (
          <div className="aspect-video bg-muted relative">
            <img
              src={message.attachment.thumbnail || '/placeholder.svg'}
              alt={message.attachment.name}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-2 left-2 gap-1" variant="secondary">
              <ToolIcon className="h-3 w-3" />
              Design File
            </Badge>
          </div>
        )}
        <div className="p-3 bg-card">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded ${toolColor}`}
            >
              <ToolIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {message.attachment.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground capitalize">
                  {message.attachment.tool}
                </span>
                {message.attachment.version && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      v{message.attachment.version}
                    </span>
                  </>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
              <ExternalLink className="h-3 w-3" />
              Open
            </Button>
          </div>
          {message.changesSummary && message.changesSummary.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Changes:</p>
              <ul className="space-y-1">
                {message.changesSummary.map((change, i) => (
                  <li
                    key={i}
                    className="text-xs text-foreground flex items-start gap-1.5"
                  >
                    <span className="text-primary mt-0.5">•</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </MessageBase>
  );
}

// Payment Reminder Message
interface PaymentReminderMessageProps extends BaseMessageRendererProps {
  message: PaymentReminderMessageType;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pending',
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  paid: {
    icon: CheckCircle2,
    label: 'Paid',
    color: 'bg-green-500/10 text-green-600 border-green-500/20',
  },
  overdue: {
    icon: AlertCircle,
    label: 'Overdue',
    color: 'bg-red-500/10 text-red-600 border-red-500/20',
  },
};

export function PaymentReminderMessage({
  message,
  onOpenThread,
  isThreadReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved, // Propagated from MessageBaseProps
  onToggleHidden, // Propagated from MessageBaseProps
  currentUserId,
}: PaymentReminderMessageProps) {
  const { payment } = message;
  const status = statusConfig[payment.status];
  const StatusIcon = status.icon;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <MessageBase
      message={message}
      onOpenThread={onOpenThread}
      isThreadReply={isThreadReply}
      className="bg-amber-500/5"
      onProfileClick={onProfileClick}
      onToggleReaction={onToggleReaction}
      onToggleSaved={onToggleSaved} // Pass prop down
      onToggleHidden={onToggleHidden} // Pass prop down
      currentUserId={currentUserId}
    >
      <div className="rounded-xl border border-amber-500/20 bg-card overflow-hidden max-w-sm">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
                <CreditCard className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Payment Reminder
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {formatCurrency(payment.amount, payment.currency)}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={cn('gap-1', status.color)}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
          </div>

          {payment.description && (
            <p className="text-sm text-muted-foreground mb-3">{payment.description}</p>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Due: {formatDate(payment.dueDate)}
            </span>
            {payment.invoiceId && (
              <span className="text-muted-foreground">#{payment.invoiceId}</span>
            )}
          </div>
        </div>

        {payment.status !== 'paid' && (
          <div className="px-4 py-3 bg-muted/50 border-t border-border">
            <Button size="sm" className="w-full">
              Pay Now
            </Button>
          </div>
        )}
      </div>
    </MessageBase>
  );
}

// Event Reminder Message
interface EventReminderMessageProps extends BaseMessageRendererProps {
  message: EventReminderMessageType;
}

export function EventReminderMessage({
  message,
  onOpenThread,
  isThreadReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved, // Propagated from MessageBaseProps
  onToggleHidden, // Propagated from MessageBaseProps
  currentUserId,
}: EventReminderMessageProps) {
  const { event } = message;

  const formatEventTime = (start: Date, end?: Date, isAllDay?: boolean) => {
    if (isAllDay) return 'All day';

    const startStr = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (!end) return startStr;

    const endStr = end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return `${startStr} - ${endStr}`;
  };

  const formatEventDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <MessageBase
      message={message}
      onOpenThread={onOpenThread}
      isThreadReply={isThreadReply}
      className="bg-primary/5"
      onProfileClick={onProfileClick}
      onToggleReaction={onToggleReaction}
      onToggleSaved={onToggleSaved} // Pass prop down
      onToggleHidden={onToggleHidden} // Pass prop down
      currentUserId={currentUserId}
    >
      <div className="rounded-xl border border-primary/20 bg-card overflow-hidden max-w-sm">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="text-[10px] font-medium uppercase leading-none">
                  {event.startTime.toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-lg font-bold leading-tight">
                  {event.startTime.getDate()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{event.title}</p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatEventDate(event.startTime)}</span>
                  <span>•</span>
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatEventTime(event.startTime, event.endTime, event.isAllDay)}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {event.status}
            </Badge>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <MapPin className="h-3 w-3" />
              <span>{event.location}</span>
            </div>
          )}

          {event.meetingLink && (
            <div className="flex items-center gap-2 text-xs text-primary mb-2">
              <Video className="h-3 w-3" />
              <a href={event.meetingLink} className="hover:underline truncate">
                Join video call
              </a>
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <Users className="h-3 w-3 text-muted-foreground" />
              <div className="flex -space-x-1.5">
                {event.attendees.slice(0, 4).map((attendee) => (
                  <Avatar
                    key={attendee.id}
                    className="h-5 w-5 border-2 border-background"
                  >
                    <AvatarImage
                      src={attendee.avatar || '/placeholder.svg'}
                      alt={attendee.name}
                    />
                    <AvatarFallback className="text-[8px]">
                      {attendee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-muted/50 border-t border-border flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            Decline
          </Button>
          <Button size="sm" className="flex-1">
            Accept
          </Button>
        </div>
      </div>
    </MessageBase>
  );
}

// Lesson Assignment Message
interface LessonAssignmentMessageProps extends BaseMessageRendererProps {
  message: LessonAssignmentMessageType;
}

const difficultyConfig = {
  beginner: {
    label: 'Beginner',
    color: 'bg-green-500/10 text-green-600 border-green-500/20',
  },
  intermediate: {
    label: 'Intermediate',
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  advanced: {
    label: 'Advanced',
    color: 'bg-red-500/10 text-red-600 border-red-500/20',
  },
};

export function LessonAssignmentMessage({
  message,
  onOpenThread,
  isThreadReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved, // Propagated from MessageBaseProps
  onToggleHidden, // Propagated from MessageBaseProps
  currentUserId,
}: LessonAssignmentMessageProps) {
  const { assignment } = message;
  const difficulty = assignment.difficulty
    ? difficultyConfig[assignment.difficulty]
    : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  return (
    <MessageBase
      message={message}
      onOpenThread={onOpenThread}
      isThreadReply={isThreadReply}
      className="bg-primary/5"
      onProfileClick={onProfileClick}
      onToggleReaction={onToggleReaction}
      onToggleSaved={onToggleSaved} // Pass prop down
      onToggleHidden={onToggleHidden} // Pass prop down
      currentUserId={currentUserId}
    >
      {message.content && (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words mb-2">
          {message.content}
        </p>
      )}
      <div className="rounded-xl border border-primary/20 bg-card overflow-hidden max-w-md">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Assignment</p>
                <p className="text-sm font-semibold text-foreground">
                  {assignment.title}
                </p>
              </div>
            </div>
            {difficulty && (
              <Badge variant="outline" className={cn('gap-1', difficulty.color)}>
                {difficulty.label}
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-3">{assignment.description}</p>

          <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Due: {formatDate(assignment.dueDate)}</span>
            </div>
            {assignment.estimatedDuration && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(assignment.estimatedDuration)}</span>
              </div>
            )}
            <Badge variant="secondary" className="text-[10px]">
              {assignment.subject}
            </Badge>
          </div>

          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Attachments:
              </p>
              <div className="flex flex-col gap-2">
                {assignment.attachments.map((attachment, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-2"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="flex-1 text-xs truncate text-foreground">
                      {attachment.name}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-muted/50 border-t border-border">
          <Button size="sm" className="w-full">
            View Assignment
          </Button>
        </div>
      </div>
    </MessageBase>
  );
}

// Progress Update Message
interface ProgressUpdateMessageProps extends BaseMessageRendererProps {
  message: ProgressUpdateMessageType;
}

export function ProgressUpdateMessage({
  message,
  onOpenThread,
  isThreadReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved, // Propagated from MessageBaseProps
  onToggleHidden, // Propagated from MessageBaseProps
  currentUserId,
}: ProgressUpdateMessageProps) {
  const { progress } = message;

  const getImprovementColor = (improvement: number) => {
    if (improvement >= 20) return 'text-green-600';
    if (improvement >= 10) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  return (
    <MessageBase
      message={message}
      onOpenThread={onOpenThread}
      isThreadReply={isThreadReply}
      className="bg-green-500/5"
      onProfileClick={onProfileClick}
      onToggleReaction={onToggleReaction}
      onToggleSaved={onToggleSaved} // Pass prop down
      onToggleHidden={onToggleHidden} // Pass prop down
      currentUserId={currentUserId}
    >
      {message.content && (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words mb-2">
          {message.content}
        </p>
      )}
      <div className="rounded-xl border border-green-500/20 bg-card overflow-hidden max-w-md">
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-0.5">
                Progress Update
              </p>
              <p className="text-sm font-semibold text-foreground">{progress.summary}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{progress.metric}</span>
                <Badge variant="secondary" className="text-[10px]">
                  {progress.subject}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{
                      width: `${(progress.currentValue / (progress.targetValue || 100)) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {progress.currentValue}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="text-xs text-muted-foreground">
                Previous:{' '}
                <span className="font-medium text-foreground">
                  {progress.previousValue}%
                </span>
              </div>
              <div
                className={cn(
                  'text-xs font-semibold flex items-center gap-1',
                  getImprovementColor(progress.improvement),
                )}
              >
                <TrendingUp className="h-3 w-3" />+{progress.improvement.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </MessageBase>
  );
}

// Session Booking Message
interface SessionBookingMessageProps extends BaseMessageRendererProps {
  message: SessionBookingMessageType;
}

const sessionStatusConfig = {
  scheduled: {
    label: 'Scheduled',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-green-500/10 text-green-600 border-green-500/20',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-500/10 text-red-600 border-red-500/20',
    icon: AlertCircle,
  },
  completed: {
    label: 'Completed',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    icon: CheckCircle2,
  },
};

export function SessionBookingMessage({
  message,
  onOpenThread,
  isThreadReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved, // Propagated from MessageBaseProps
  onToggleHidden, // Propagated from MessageBaseProps
  currentUserId,
}: SessionBookingMessageProps) {
  const { session } = message;
  const statusInfo = sessionStatusConfig[session.status];
  const StatusIcon = statusInfo.icon;

  const formatSessionTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <MessageBase
      message={message}
      onOpenThread={onOpenThread}
      isThreadReply={isThreadReply}
      className="bg-blue-500/5"
      onProfileClick={onProfileClick}
      onToggleReaction={onToggleReaction}
      onToggleSaved={onToggleSaved} // Pass prop down
      onToggleHidden={onToggleHidden} // Pass prop down
      currentUserId={currentUserId}
    >
      {message.content && (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words mb-2">
          {message.content}
        </p>
      )}
      <div className="rounded-xl border border-blue-500/20 bg-card overflow-hidden max-w-md">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Tutoring Session
                </p>
                <p className="text-sm font-semibold text-foreground">{session.title}</p>
              </div>
            </div>
            <Badge variant="outline" className={cn('gap-1', statusInfo.color)}>
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </Badge>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatSessionTime(session.startTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{session.duration} minutes</span>
            </div>
            {session.meetingLink && (
              <div className="flex items-center gap-2 text-xs text-primary">
                <Video className="h-3 w-3" />
                <a href={session.meetingLink} className="hover:underline truncate">
                  Join video call
                </a>
              </div>
            )}
            {session.location && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{session.location}</span>
              </div>
            )}
          </div>

          <Badge variant="secondary" className="text-[10px] mb-3">
            {session.subject}
          </Badge>

          {session.topics && session.topics.length > 0 && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Topics:</p>
              <ul className="space-y-1">
                {session.topics.map((topic, i) => (
                  <li
                    key={i}
                    className="text-xs text-foreground flex items-start gap-1.5"
                  >
                    <span className="text-primary mt-0.5">•</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {session.status === 'scheduled' && (
          <div className="px-4 py-3 bg-muted/50 border-t border-border flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              Reschedule
            </Button>
            <Button size="sm" className="flex-1">
              Confirm
            </Button>
          </div>
        )}

        {session.status === 'confirmed' && session.meetingLink && (
          <div className="px-4 py-3 bg-muted/50 border-t border-border">
            <Button size="sm" className="w-full gap-2">
              <Video className="h-4 w-4" />
              Join Session
            </Button>
          </div>
        )}
      </div>
    </MessageBase>
  );
}

// Homework Submission Message
interface HomeworkSubmissionMessageProps extends BaseMessageRendererProps {
  message: HomeworkSubmissionMessageType;
}

const homeworkStatusConfig = {
  submitted: {
    label: 'Submitted',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    icon: Send,
  },
  graded: {
    label: 'Graded',
    color: 'bg-green-500/10 text-green-600 border-green-500/20',
    icon: Award,
  },
  'needs-revision': {
    label: 'Needs Revision',
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    icon: AlertCircle,
  },
};

export function HomeworkSubmissionMessage({
  message,
  onOpenThread,
  isThreadReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved, // Propagated from MessageBaseProps
  onToggleHidden, // Propagated from MessageBaseProps
  currentUserId,
}: HomeworkSubmissionMessageProps) {
  const { homework } = message;
  const statusInfo = homeworkStatusConfig[homework.status];
  const StatusIcon = statusInfo.icon;

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <MessageBase
      message={message}
      onOpenThread={onOpenThread}
      isThreadReply={isThreadReply}
      className="bg-blue-500/5"
      onProfileClick={onProfileClick}
      onToggleReaction={onToggleReaction}
      onToggleSaved={onToggleSaved} // Pass prop down
      onToggleHidden={onToggleHidden} // Pass prop down
      currentUserId={currentUserId}
    >
      {message.content && (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words mb-2">
          {message.content}
        </p>
      )}
      <div className="rounded-xl border border-blue-500/20 bg-card overflow-hidden max-w-md">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Homework Submission
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {homework.assignmentTitle}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={cn('gap-1', statusInfo.color)}>
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Clock className="h-3 w-3" />
            <span>Submitted: {formatDate(homework.submittedAt)}</span>
          </div>

          {homework.attachments && homework.attachments.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Attachments:
              </p>
              <div className="flex flex-col gap-2">
                {homework.attachments.map((attachment, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-2"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="flex-1 text-xs truncate text-foreground">
                      {attachment.name}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {homework.status === 'graded' && homework.grade && (
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Grade:</span>
                <Badge variant="secondary" className="gap-1">
                  <Award className="h-3 w-3" />
                  {homework.grade}
                </Badge>
              </div>
              {homework.feedback && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Feedback:
                  </p>
                  <p className="text-xs text-foreground leading-relaxed">
                    {homework.feedback}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MessageBase>
  );
}

// Link Preview Message
interface LinkPreviewMessageProps extends BaseMessageRendererProps {
  message: LinkPreviewMessageType;
}

export function LinkPreviewMessage({
  message,
  onOpenThread,
  isThreadReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved, // Propagated from MessageBaseProps
  onToggleHidden, // Propagated from MessageBaseProps
  currentUserId,
}: LinkPreviewMessageProps) {
  const { link } = message;

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <MessageBase
      message={message}
      onOpenThread={onOpenThread}
      isThreadReply={isThreadReply}
      onProfileClick={onProfileClick}
      onToggleReaction={onToggleReaction}
      onToggleSaved={onToggleSaved} // Pass prop down
      onToggleHidden={onToggleHidden} // Pass prop down
      currentUserId={currentUserId}
    >
      {message.content && (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words mb-2">
          {message.content}
        </p>
      )}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl border border-border bg-card overflow-hidden max-w-md hover:bg-muted/50 transition-colors"
      >
        {link.imageUrl && (
          <div className="aspect-video bg-muted relative overflow-hidden">
            <img
              src={link.imageUrl || '/placeholder.svg'}
              alt={link.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {link.favicon && (
              <img
                src={link.favicon || '/placeholder.svg'}
                alt=""
                className="h-4 w-4 rounded mt-0.5 flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {link.siteName && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {link.siteName}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground truncate">
                  {getDomain(link.url)}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">
                {link.title}
              </h3>
              {link.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {link.description}
                </p>
              )}
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          </div>
        </div>
      </a>
    </MessageBase>
  );
}

// Audio Recording Message
interface AudioRecordingMessageProps extends BaseMessageRendererProps {
  message: AudioRecordingMessageType;
}

export function AudioRecordingMessage({
  message,
  onOpenThread,
  isThreadReply,
  onProfileClick,
  onToggleReaction,
  onToggleSaved, // Propagated from MessageBaseProps
  onToggleHidden, // Propagated from MessageBaseProps
  currentUserId,
}: AudioRecordingMessageProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1);
  const [isAudioLoaded, setIsAudioLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = useCallback(() => {
    if (audioRef.current && isAudioLoaded && !hasError) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          // eslint-disable-next-line no-undef
          console.error('[v0] Audio play failed:', error);
          setHasError(true);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, isAudioLoaded, hasError]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleSeek = useCallback((value: number[]) => {
    const time = value[0];
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const handleSpeedChange = useCallback(() => {
    const speeds = [1, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  }, [playbackSpeed]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsAudioLoaded(true);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    // eslint-disable-next-line no-undef
    console.error('[v0] Audio failed to load');
    setHasError(true);
    setIsAudioLoaded(false);
    setIsPlaying(false);
  }, []);

  const progress = useMemo(() => {
    if (!message.audio?.duration) return 0;
    return (currentTime / message.audio.duration) * 100;
  }, [currentTime, message.audio?.duration]);

  return (
    <MessageBase
      message={message}
      onOpenThread={onOpenThread}
      isThreadReply={isThreadReply}
      onProfileClick={onProfileClick}
      onToggleReaction={onToggleReaction}
      onToggleSaved={onToggleSaved} // Pass prop down
      onToggleHidden={onToggleHidden} // Pass prop down
      currentUserId={currentUserId}
    >
      {message.content && (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words mb-2">
          {message.content}
        </p>
      )}
      {/* Spotify-style audio preview card */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm p-4 max-w-md shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          {/* Large play button with gradient */}
          <button
            onClick={togglePlayPause}
            disabled={hasError}
            className="relative h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" fill="currentColor" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
            )}
          </button>

          {/* Waveform and info */}
          <div className="flex-1 min-w-0">
            {/* Time and controls */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                {formatDuration(currentTime)}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs font-medium hover:bg-background/50"
                  onClick={handleSpeedChange}
                  disabled={hasError}
                >
                  {playbackSpeed}x
                </Button>
                <span className="text-xs font-medium text-muted-foreground tabular-nums">
                  {formatDuration(message.audio.duration)}
                </span>
              </div>
            </div>

            {/* Waveform visualization */}
            {message.audio.waveform && (
              <div
                className="relative mb-2 mt-2 cursor-pointer"
                onClick={(e) => {
                  if (!isAudioLoaded || hasError) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = x / rect.width;
                  const newTime = percentage * message.audio.duration;
                  setCurrentTime(newTime);
                  if (audioRef.current) {
                    audioRef.current.currentTime = newTime;
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Seek audio"
              >
                <div className="flex items-center justify-between gap-px h-10">
                  {message.audio.waveform.map((amplitude, index) => {
                    const barProgress = (index / message.audio.waveform!.length) * 100;
                    const isActive = barProgress <= progress;
                    return (
                      <div
                        key={index}
                        className="flex-1 rounded-full transition-all duration-150 hover:opacity-80"
                        style={{
                          height: `${Math.max(amplitude * 0.8, 20)}%`,
                          backgroundColor: isActive
                            ? 'hsl(var(--primary))'
                            : 'hsl(var(--muted-foreground) / 0.3)',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {hasError && (
              <p className="text-xs text-destructive mt-1">Audio unavailable</p>
            )}
          </div>
        </div>

        <audio
          ref={audioRef}
          src={message.audio.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onCanPlay={handleCanPlay}
          onError={handleError}
          className="hidden"
          preload="metadata"
        />
      </div>
    </MessageBase>
  );
}
