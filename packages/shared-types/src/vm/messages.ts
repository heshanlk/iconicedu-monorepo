import type { ISODateTime, UUID } from './shared';
import type { UserProfileVM } from './profile';

export interface ReactionVM {
  emoji: string;
  count: number;
  users: UUID[];
}

export type AttachmentTypeVM = 'image' | 'file' | 'design-file';

export interface BaseAttachmentVM {
  type: AttachmentTypeVM;
  url: string;
  name: string;
}

export interface ImageAttachmentVM extends BaseAttachmentVM {
  type: 'image';
  width?: number;
  height?: number;
}

export interface FileAttachmentVM extends BaseAttachmentVM {
  type: 'file';
  size?: number;
  mimeType?: string;
}

export interface DesignFileAttachmentVM extends BaseAttachmentVM {
  type: 'design-file';
  tool: 'figma' | 'sketch' | 'adobe-xd' | 'canva' | 'other';
  version?: string;
  lastModified?: ISODateTime;
  thumbnail?: string;
}

export type AttachmentVM =
  | ImageAttachmentVM
  | FileAttachmentVM
  | DesignFileAttachmentVM;

export interface ThreadVM {
  id: UUID;
  messageCount: number;
  lastReply: ISODateTime;
  participants: UserProfileVM[];
  parentMessage?: MessageVM;
  unreadCount?: number;
}

export interface ThreadPanelPropsVM {
  thread: ThreadVM;
  messages: MessageVM[];
  onSendReply: (content: string) => void;
  onProfileClick: (userId: UUID) => void;
  lastReadMessageId?: UUID;
  onToggleReaction?: (messageId: UUID, emoji: string) => void;
  onToggleSaved?: (messageId: UUID) => void;
  onToggleHidden?: (messageId: UUID) => void;
  currentUserId?: UUID;
}

export type MessageVisibilityVM =
  | { type: 'all' }
  | { type: 'sender-only' }
  | { type: 'recipient-only'; userId: UUID }
  | { type: 'specific-users'; userIds: UUID[] };

export type MessageTypeVM =
  | 'text'
  | 'image'
  | 'file'
  | 'design-file-update'
  | 'payment-reminder'
  | 'event-reminder'
  | 'lesson-assignment'
  | 'progress-update'
  | 'session-booking'
  | 'homework-submission'
  | 'link-preview'
  | 'audio-recording';

interface BaseMessageVM {
  id: UUID;
  sender: UserProfileVM;
  timestamp: ISODateTime;
  reactions: ReactionVM[];
  thread?: ThreadVM;
  visibility: MessageVisibilityVM;
  isEdited?: boolean;
  editedAt?: ISODateTime;
  isRead?: boolean;
  isSaved?: boolean;
  isHidden?: boolean;
}

export interface TextMessageVM extends BaseMessageVM {
  type: 'text';
  content: string;
}

export interface ImageMessageVM extends BaseMessageVM {
  type: 'image';
  content?: string;
  attachment: ImageAttachmentVM;
}

export interface FileMessageVM extends BaseMessageVM {
  type: 'file';
  content?: string;
  attachment: FileAttachmentVM;
}

export interface DesignFileUpdateMessageVM extends BaseMessageVM {
  type: 'design-file-update';
  content?: string;
  attachment: DesignFileAttachmentVM;
  changesSummary?: string[];
  previousVersion?: string;
}

export interface PaymentReminderMessageVM extends BaseMessageVM {
  type: 'payment-reminder';
  content: string;
  payment: {
    amount: number;
    currency: string;
    dueDate: ISODateTime;
    status: 'pending' | 'paid' | 'overdue';
    invoiceId?: string;
    description?: string;
  };
}

export interface EventReminderMessageVM extends BaseMessageVM {
  type: 'event-reminder';
  content: string;
  event: {
    status?: string | null;
    title: string;
    startTime: ISODateTime;
    endTime?: ISODateTime;
    location?: string;
    meetingLink?: string;
    attendees?: UserProfileVM[];
    isAllDay?: boolean;
  };
}

export interface LessonAssignmentMessageVM extends BaseMessageVM {
  type: 'lesson-assignment';
  content: string;
  assignment: {
    title: string;
    description: string;
    dueDate: ISODateTime;
    subject: string;
    attachments?: AttachmentVM[];
    estimatedDuration?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface ProgressUpdateMessageVM extends BaseMessageVM {
  type: 'progress-update';
  content: string;
  progress: {
    subject: string;
    metric: string;
    previousValue: number;
    currentValue: number;
    targetValue?: number;
    improvement: number;
    summary: string;
  };
}

export interface SessionBookingMessageVM extends BaseMessageVM {
  type: 'session-booking';
  content: string;
  session: {
    title: string;
    subject: string;
    startTime: ISODateTime;
    durationMinutes: number;
    meetingLink?: string;
    location?: string;
    status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
    topics?: string[];
  };
}

export interface HomeworkSubmissionMessageVM extends BaseMessageVM {
  type: 'homework-submission';
  content: string;
  homework: {
    assignmentTitle: string;
    submittedAt: ISODateTime;
    attachments: AttachmentVM[];
    status: 'submitted' | 'graded' | 'needs-revision';
    grade?: string;
    feedback?: string;
  };
}

export interface LinkPreviewMessageVM extends BaseMessageVM {
  type: 'link-preview';
  content?: string;
  link: {
    url: string;
    title: string;
    description?: string;
    imageUrl?: string;
    siteName?: string;
    favicon?: string;
  };
}

export interface AudioRecordingMessageVM extends BaseMessageVM {
  audioUrl: string | undefined;
  duration: string;
  type: 'audio-recording';
  content?: string;
  audio: {
    url: string;
    duration: number;
    waveform?: number[];
    fileSize?: number;
    mimeType?: string;
  };
}

export type MessageVM =
  | TextMessageVM
  | ImageMessageVM
  | FileMessageVM
  | DesignFileUpdateMessageVM
  | PaymentReminderMessageVM
  | EventReminderMessageVM
  | LessonAssignmentMessageVM
  | ProgressUpdateMessageVM
  | SessionBookingMessageVM
  | HomeworkSubmissionMessageVM
  | LinkPreviewMessageVM
  | AudioRecordingMessageVM;

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

export const createMessage = {
  text: (
    id: UUID,
    sender: UserProfileVM,
    content: string,
    options?: Partial<Omit<TextMessageVM, 'id' | 'sender' | 'content' | 'type'>>,
  ): TextMessageVM => ({
    id,
    type: 'text',
    sender,
    content,
    timestamp: new Date().toISOString(),
    reactions: [],
    visibility: { type: 'all' },
    ...options,
  }),

  paymentReminder: (
    id: UUID,
    sender: UserProfileVM,
    payment: PaymentReminderMessageVM['payment'],
    visibleTo: UUID,
    content?: string,
  ): PaymentReminderMessageVM => ({
    id,
    type: 'payment-reminder',
    sender,
    content: content || `Payment reminder: ${payment.currency}${payment.amount}`,
    payment,
    timestamp: new Date().toISOString(),
    reactions: [],
    visibility: { type: 'recipient-only', userId: visibleTo },
  }),

  eventReminder: (
    id: UUID,
    sender: UserProfileVM,
    event: EventReminderMessageVM['event'],
    visibility: MessageVisibilityVM = { type: 'all' },
  ): EventReminderMessageVM => ({
    id,
    type: 'event-reminder',
    sender,
    content: `Event: ${event.title}`,
    event,
    timestamp: new Date().toISOString(),
    reactions: [],
    visibility,
  }),

  designFileUpdate: (
    id: UUID,
    sender: UserProfileVM,
    attachment: DesignFileAttachmentVM,
    content?: string,
    changesSummary?: string[],
  ): DesignFileUpdateMessageVM => ({
    id,
    type: 'design-file-update',
    sender,
    content,
    attachment,
    changesSummary,
    timestamp: new Date().toISOString(),
    reactions: [],
    visibility: { type: 'all' },
  }),
};
