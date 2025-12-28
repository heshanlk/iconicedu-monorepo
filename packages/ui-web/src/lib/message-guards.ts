import type {
  MessageVM,
  TextMessageVM,
  ImageMessageVM,
  FileMessageVM,
  DesignFileUpdateMessageVM,
  PaymentReminderMessageVM,
  EventReminderMessageVM,
  LessonAssignmentMessageVM,
  ProgressUpdateMessageVM,
  SessionBookingMessageVM,
  HomeworkSubmissionMessageVM,
  LinkPreviewMessageVM,
  AudioRecordingMessageVM,
  UUID,
} from '@iconicedu/shared-types';

export function isTextMessage(message: MessageVM): message is TextMessageVM {
  return message.type === 'text';
}

export function isImageMessage(message: MessageVM): message is ImageMessageVM {
  return message.type === 'image';
}

export function isFileMessage(message: MessageVM): message is FileMessageVM {
  return message.type === 'file';
}

export function isDesignFileUpdateMessage(
  message: MessageVM,
): message is DesignFileUpdateMessageVM {
  return message.type === 'design-file-update';
}

export function isPaymentReminderMessage(
  message: MessageVM,
): message is PaymentReminderMessageVM {
  return message.type === 'payment-reminder';
}

export function isEventReminderMessage(
  message: MessageVM,
): message is EventReminderMessageVM {
  return message.type === 'event-reminder';
}

export function isLessonAssignmentMessage(
  message: MessageVM,
): message is LessonAssignmentMessageVM {
  return message.type === 'lesson-assignment';
}

export function isProgressUpdateMessage(
  message: MessageVM,
): message is ProgressUpdateMessageVM {
  return message.type === 'progress-update';
}

export function isSessionBookingMessage(
  message: MessageVM,
): message is SessionBookingMessageVM {
  return message.type === 'session-booking';
}

export function isHomeworkSubmissionMessage(
  message: MessageVM,
): message is HomeworkSubmissionMessageVM {
  return message.type === 'homework-submission';
}

export function isLinkPreviewMessage(
  message: MessageVM,
): message is LinkPreviewMessageVM {
  return message.type === 'link-preview';
}

export function isAudioRecordingMessage(
  message: MessageVM,
): message is AudioRecordingMessageVM {
  return message.type === 'audio-recording';
}

export function isMessageVisibleToUser(message: MessageVM, userId: UUID): boolean {
  const { visibility } = message;

  switch (visibility.type) {
    case 'all':
      return true;
    case 'sender-only':
      return message.sender.id === userId;
    case 'recipient-only':
      return visibility.userId === userId || message.sender.id === userId;
    case 'specific-users':
      return visibility.userIds.includes(userId) || message.sender.id === userId;
    default:
      return true;
  }
}
