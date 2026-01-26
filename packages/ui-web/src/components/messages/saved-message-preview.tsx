'use client';

import { AvatarWithStatus } from '@iconicedu/ui-web/components/shared/avatar-with-status';
import { getProfileDisplayName } from '@iconicedu/ui-web/lib/display-name';
import { formatDistanceToNow } from 'date-fns';
import type { MessageVM } from '@iconicedu/shared-types';
import { cn } from '@iconicedu/ui-web/lib/utils';
import {
  isTextMessage,
  isImageMessage,
  isFileMessage,
  isAudioRecordingMessage,
  isLinkPreviewMessage,
  isDesignFileUpdateMessage,
  isPaymentReminderMessage,
  isEventReminderMessage,
  isFeedbackRequestMessage,
  isLessonAssignmentMessage,
  isProgressUpdateMessage,
  isSessionBookingMessage,
  isSessionCompleteMessage,
  isSessionSummaryMessage,
  isHomeworkSubmissionMessage,
} from '@iconicedu/ui-web/lib/message-guards';

interface SavedMessagePreviewProps {
  message: MessageVM;
  onClick: () => void;
}

export function SavedMessagePreview({ message, onClick }: SavedMessagePreviewProps) {
  const getMessagePreview = (msg: MessageVM): string => {
    if (isTextMessage(msg)) return msg.content.text;
    if (isImageMessage(msg)) return msg.content?.text || '📷 Image';
    if (isFileMessage(msg)) return msg.content?.text || `📎 ${msg.attachment.name}`;
    if (isAudioRecordingMessage(msg)) return msg.content?.text || '🎤 Audio message';
    if (isLinkPreviewMessage(msg)) return msg.content?.text || msg.link.url;
    if (isDesignFileUpdateMessage(msg)) {
      return msg.content?.text || `🎨 ${msg.attachment.name}`;
    }
    if (isPaymentReminderMessage(msg)) {
      return `💰 Payment: ${msg.payment.currency}${msg.payment.amount}`;
    }
    if (isEventReminderMessage(msg)) return `📅 Event: ${msg.event.title}`;
    if (isFeedbackRequestMessage(msg)) return `⭐ Feedback: ${msg.feedback.prompt}`;
    if (isLessonAssignmentMessage(msg)) return `📚 Assignment: ${msg.assignment.title}`;
    if (isProgressUpdateMessage(msg)) return `📊 Progress: ${msg.progress.subject}`;
    if (isSessionBookingMessage(msg)) return `🕒 Session: ${msg.session.title}`;
    if (isSessionCompleteMessage(msg)) {
      return `✅ Session complete: ${msg.session.title}`;
    }
    if (isSessionSummaryMessage(msg)) return `📝 Summary: ${msg.session.title}`;
    if (isHomeworkSubmissionMessage(msg)) {
      return `✏️ Homework: ${msg.homework.assignmentTitle}`;
    }
    return 'Message';
  };

  const preview = getMessagePreview(message);
  const truncatedPreview = preview.length > 80 ? `${preview.slice(0, 80)}...` : preview;
  const senderName = getProfileDisplayName(message.core.sender.profile);

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
        name={senderName}
        avatar={message.core.sender.profile.avatar}
        themeKey={message.core.sender.ui?.themeKey}
        sizeClassName="h-10 w-10 flex-shrink-0"
        initialsLength={1}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="font-semibold text-sm text-foreground truncate">
            {senderName}
          </span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatDistanceToNow(new Date(message.core.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{truncatedPreview}</p>
      </div>
    </button>
  );
}
