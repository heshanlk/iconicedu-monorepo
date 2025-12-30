'use client';

import { memo } from 'react';
import type { MessageVM, ThreadVM, UUID } from '@iconicedu/shared-types';
import {
  isTextMessage,
  isImageMessage,
  isFileMessage,
  isDesignFileUpdateMessage,
  isPaymentReminderMessage,
  isEventReminderMessage,
  isLessonAssignmentMessage,
  isProgressUpdateMessage,
  isSessionBookingMessage,
  isSessionSummaryMessage,
  isHomeworkSubmissionMessage,
  isLinkPreviewMessage,
  isAudioRecordingMessage,
  isMessageVisibleToUser,
} from '../../lib/message-guards';
import {
  TextMessage,
  ImageMessage,
  FileMessage,
  DesignFileMessage,
  PaymentReminderMessage,
  EventReminderMessage,
  LessonAssignmentMessage,
  ProgressUpdateMessage,
  SessionBookingMessage,
  SessionSummaryMessage,
  HomeworkSubmissionMessage,
  AudioMessage,
  LinkPreviewMessage,
} from './message-types';

interface MessageItemProps {
  message: MessageVM;
  onOpenThread: (thread: ThreadVM, parentMessage: MessageVM) => void;
  isThreadReply?: boolean;
  currentUserId?: UUID;
  onProfileClick: (userId: UUID) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  onToggleSaved?: (messageId: string) => void;
  onToggleHidden?: (messageId: string) => void;
  onToggleImportant?: (messageId: string) => void;
}

export const MessageItem = memo(function MessageItem({
  message,
  onOpenThread,
  isThreadReply = false,
  currentUserId = 'user-1',
  onProfileClick,
  onToggleReaction,
  onToggleSaved,
  onToggleHidden,
  onToggleImportant,
}: MessageItemProps) {
  if (!isMessageVisibleToUser(message, currentUserId)) {
    return null;
  }

  const handleToggleReaction = (emoji: string) => {
    onToggleReaction?.(message.id, emoji);
  };

  const handleToggleSaved = () => {
    onToggleSaved?.(message.id);
  };

  const handleToggleHidden = () => {
    onToggleHidden?.(message.id);
  };

  const handleToggleImportant = () => {
    onToggleImportant?.(message.id);
  };

  const commonProps = {
    onOpenThread,
    isThreadReply,
    onProfileClick,
    onToggleReaction: handleToggleReaction,
    onToggleSaved: handleToggleSaved,
    onToggleHidden: handleToggleHidden,
    onToggleImportant: handleToggleImportant,
  };

  if (isTextMessage(message)) {
    return <TextMessage message={message} {...commonProps} />;
  }

  if (isImageMessage(message)) {
    return <ImageMessage message={message} {...commonProps} />;
  }

  if (isFileMessage(message)) {
    return <FileMessage message={message} {...commonProps} />;
  }

  if (isDesignFileUpdateMessage(message)) {
    return <DesignFileMessage message={message} {...commonProps} />;
  }

  if (isPaymentReminderMessage(message)) {
    return <PaymentReminderMessage message={message} {...commonProps} />;
  }

  if (isEventReminderMessage(message)) {
    return <EventReminderMessage message={message} {...commonProps} />;
  }

  if (isLessonAssignmentMessage(message)) {
    return <LessonAssignmentMessage message={message} {...commonProps} />;
  }

  if (isProgressUpdateMessage(message)) {
    return <ProgressUpdateMessage message={message} {...commonProps} />;
  }

  if (isSessionBookingMessage(message)) {
    return <SessionBookingMessage message={message} {...commonProps} />;
  }

  if (isSessionSummaryMessage(message)) {
    return <SessionSummaryMessage message={message} {...commonProps} />;
  }

  if (isHomeworkSubmissionMessage(message)) {
    return <HomeworkSubmissionMessage message={message} {...commonProps} />;
  }

  if (isAudioRecordingMessage(message)) {
    return <AudioMessage message={message} {...commonProps} />;
  }

  if (isLinkPreviewMessage(message)) {
    return <LinkPreviewMessage message={message} {...commonProps} />;
  }

  return null;
});
