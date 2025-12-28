'use client';

import { AvatarWithStatus } from '../shared/avatar-with-status';
import { formatDistanceToNow } from 'date-fns';
import type { Message } from '@iconicedu/shared-types';
import { cn } from '../../lib/utils';

interface SavedMessagePreviewProps {
  message: Message;
  onClick: () => void;
}

export function SavedMessagePreview({ message, onClick }: SavedMessagePreviewProps) {
  const getMessagePreview = (msg: Message): string => {
    switch (msg.type) {
      case 'text':
        return msg.content;
      case 'image':
        return msg.content || '📷 Image';
      case 'file':
        return msg.content || `📎 ${msg.attachment.name}`;
      case 'audio-recording':
        return msg.content || '🎤 Audio message';
      case 'link-preview':
        return msg.content || msg.link.url;
      case 'design-file-update':
        return msg.content || `🎨 ${msg.attachment.name}`;
      case 'payment-reminder':
        return `💰 Payment: ${msg.payment.currency}${msg.payment.amount}`;
      case 'event-reminder':
        return `📅 Event: ${msg.event.title}`;
      case 'lesson-assignment':
        return `📚 Assignment: ${msg.assignment.title}`;
      case 'progress-update':
        return `📊 Progress: ${msg.progress.subject}`;
      case 'session-booking':
        return `🕒 Session: ${msg.session.title}`;
      case 'homework-submission':
        return `✏️ Homework: ${msg.homework.assignmentTitle}`;
      default:
        return 'Message';
    }
  };

  const preview = getMessagePreview(message);
  const truncatedPreview = preview.length > 80 ? `${preview.slice(0, 80)}...` : preview;
  const isOnline =
    message.sender.presence?.liveStatus !== undefined
      ? message.sender.presence.liveStatus !== 'none'
      : undefined;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors',
        'hover:bg-accent hover:border-accent-foreground/20',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      )}
    >
      <AvatarWithStatus
        name={message.sender.displayName}
        avatar={message.sender.avatar.url ?? ''}
        isOnline={isOnline}
        sizeClassName="h-10 w-10 flex-shrink-0"
        initialsLength={1}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="font-semibold text-sm text-foreground truncate">
            {message.sender.displayName}
          </span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{truncatedPreview}</p>
      </div>
    </button>
  );
}
