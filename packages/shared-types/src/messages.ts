import type { ReactNode } from 'react';
import type { UserProfileVM } from './user';

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

// ===========================================
// ATTACHMENT TYPES
// ===========================================

export type AttachmentType = 'image' | 'file' | 'design-file';

export interface BaseAttachment {
  type: AttachmentType;
  url: string;
  name: string;
}

export interface ImageAttachment extends BaseAttachment {
  type: 'image';
  width?: number;
  height?: number;
}

export interface FileAttachment extends BaseAttachment {
  type: 'file';
  size?: number;
  mimeType?: string;
}

export interface DesignFileAttachment extends BaseAttachment {
  type: 'design-file';
  tool: 'figma' | 'sketch' | 'adobe-xd' | 'canva' | 'other';
  version?: string;
  lastModified?: Date;
  thumbnail?: string;
}

export type Attachment = ImageAttachment | FileAttachment | DesignFileAttachment;

// ===========================================
// THREAD TYPES
// ===========================================

export interface Thread {
  id: string;
  messageCount: number;
  lastReply: Date;
  participants: UserProfileVM[];
  parentMessage?: Message;
  unreadCount?: number;
}

export interface ThreadPanelProps {
  thread: Thread;
  messages: Message[];
  onSendReply: (content: string) => void;
  onProfileClick: (userId: string) => void;
  lastReadMessageId?: string;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  onToggleSaved?: (messageId: string) => void; // Added save toggle prop
  onToggleHidden?: (messageId: string) => void; // Added hide toggle prop
  currentUserId?: string;
}

// ===========================================
// MESSAGE VISIBILITY
// ===========================================

export type MessageVisibility =
  | { type: 'all' } // Visible to everyone in the conversation
  | { type: 'sender-only' } // Only visible to the sender
  | { type: 'recipient-only'; userId: string } // Only visible to a specific recipient
  | { type: 'specific-users'; userIds: string[] }; // Visible to specific users

// ===========================================
// MESSAGE TYPE DEFINITIONS
// ===========================================

export type MessageType =
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
  | 'audio-recording'; // Added audio recording message type

// Base message interface with common properties
interface BaseMessage {
  id: string;
  sender: UserProfileVM;
  timestamp: Date;
  reactions: Reaction[];
  thread?: Thread;
  visibility: MessageVisibility;
  isEdited?: boolean;
  editedAt?: Date;
  isRead?: boolean;
  isSaved?: boolean; // Added saved status for bookmarking messages
  isHidden?: boolean; // Added hidden status for hiding messages
}

// Text message
export interface TextMessage extends BaseMessage {
  type: 'text';
  content: string;
}

// Image message
export interface ImageMessage extends BaseMessage {
  type: 'image';
  content?: string; // Optional caption
  attachment: ImageAttachment;
}

// File message
export interface FileMessage extends BaseMessage {
  type: 'file';
  content?: string; // Optional description
  attachment: FileAttachment;
}

// Design file update message
export interface DesignFileUpdateMessage extends BaseMessage {
  type: 'design-file-update';
  content?: string; // Optional comment about changes
  attachment: DesignFileAttachment;
  changesSummary?: string[];
  previousVersion?: string;
}

// Payment reminder message
export interface PaymentReminderMessage extends BaseMessage {
  type: 'payment-reminder';
  content: string;
  payment: {
    amount: number;
    currency: string;
    dueDate: Date;
    status: 'pending' | 'paid' | 'overdue';
    invoiceId?: string;
    description?: string;
  };
}

// Event reminder message
export interface EventReminderMessage extends BaseMessage {
  type: 'event-reminder';
  content: string;
  event: {
    status: ReactNode;
    title: string;
    startTime: Date;
    endTime?: Date;
    location?: string;
    meetingLink?: string;
    attendees?: UserProfileVM[];
    isAllDay?: boolean;
  };
}

// Lesson assignment message
export interface LessonAssignmentMessage extends BaseMessage {
  type: 'lesson-assignment';
  content: string;
  assignment: {
    title: string;
    description: string;
    dueDate: Date;
    subject: string;
    attachments?: Attachment[];
    estimatedDuration?: number; // in minutes
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
}

// Progress update message
export interface ProgressUpdateMessage extends BaseMessage {
  type: 'progress-update';
  content: string;
  progress: {
    subject: string;
    metric: string;
    previousValue: number;
    currentValue: number;
    targetValue?: number;
    improvement: number; // percentage
    summary: string;
  };
}

// Session booking message
export interface SessionBookingMessage extends BaseMessage {
  type: 'session-booking';
  content: string;
  session: {
    title: string;
    subject: string;
    startTime: Date;
    duration: number; // in minutes
    meetingLink?: string;
    location?: string;
    status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
    topics?: string[];
  };
}

// Homework submission message
export interface HomeworkSubmissionMessage extends BaseMessage {
  type: 'homework-submission';
  content: string;
  homework: {
    assignmentTitle: string;
    submittedAt: Date;
    attachments: Attachment[];
    status: 'submitted' | 'graded' | 'needs-revision';
    grade?: string;
    feedback?: string;
  };
}

// Link preview message
export interface LinkPreviewMessage extends BaseMessage {
  type: 'link-preview';
  content?: string; // Optional comment with the link
  link: {
    url: string;
    title: string;
    description?: string;
    imageUrl?: string;
    siteName?: string;
    favicon?: string;
  };
}

// Audio recording message
export interface AudioRecordingMessage extends BaseMessage {
  audioUrl: string | undefined;
  duration: string;
  type: 'audio-recording';
  content?: string; // Optional caption/description
  audio: {
    url: string;
    duration: number; // in seconds
    waveform?: number[]; // Array of amplitude values for waveform visualization
    fileSize?: number;
    mimeType?: string; // e.g., "audio/webm", "audio/mp3"
  };
}

// Union type for all messages
export type Message =
  | TextMessage
  | ImageMessage
  | FileMessage
  | DesignFileUpdateMessage
  | PaymentReminderMessage
  | EventReminderMessage
  | LessonAssignmentMessage
  | ProgressUpdateMessage
  | SessionBookingMessage
  | HomeworkSubmissionMessage
  | LinkPreviewMessage
  | AudioRecordingMessage; // Added to union type

// ===========================================
// TYPE GUARDS - For type-safe message handling
// ===========================================

export function isTextMessage(message: Message): message is TextMessage {
  return message.type === 'text';
}

export function isImageMessage(message: Message): message is ImageMessage {
  return message.type === 'image';
}

export function isFileMessage(message: Message): message is FileMessage {
  return message.type === 'file';
}

export function isDesignFileUpdateMessage(
  message: Message,
): message is DesignFileUpdateMessage {
  return message.type === 'design-file-update';
}

export function isPaymentReminderMessage(
  message: Message,
): message is PaymentReminderMessage {
  return message.type === 'payment-reminder';
}

export function isEventReminderMessage(
  message: Message,
): message is EventReminderMessage {
  return message.type === 'event-reminder';
}

export function isLessonAssignmentMessage(
  message: Message,
): message is LessonAssignmentMessage {
  return message.type === 'lesson-assignment';
}

export function isProgressUpdateMessage(
  message: Message,
): message is ProgressUpdateMessage {
  return message.type === 'progress-update';
}

export function isSessionBookingMessage(
  message: Message,
): message is SessionBookingMessage {
  return message.type === 'session-booking';
}

export function isHomeworkSubmissionMessage(
  message: Message,
): message is HomeworkSubmissionMessage {
  return message.type === 'homework-submission';
}

export function isLinkPreviewMessage(message: Message): message is LinkPreviewMessage {
  return message.type === 'link-preview';
}

export function isAudioRecordingMessage(
  message: Message,
): message is AudioRecordingMessage {
  return message.type === 'audio-recording';
}

// ===========================================
// VISIBILITY HELPERS
// ===========================================

export function isMessageVisibleToUser(message: Message, userId: string): boolean {
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

// ===========================================
// MESSAGE FACTORY - Create messages easily
// ===========================================

export const createMessage = {
  text: (
    id: string,
    sender: UserProfileVM,
    content: string,
    options?: Partial<Omit<TextMessage, 'id' | 'sender' | 'content' | 'type'>>,
  ): TextMessage => ({
    id,
    type: 'text',
    sender,
    content,
    timestamp: new Date(),
    reactions: [],
    visibility: { type: 'all' },
    ...options,
  }),

  paymentReminder: (
    id: string,
    sender: UserProfileVM,
    payment: PaymentReminderMessage['payment'],
    visibleTo: string,
    content?: string,
  ): PaymentReminderMessage => ({
    id,
    type: 'payment-reminder',
    sender,
    content: content || `Payment reminder: ${payment.currency}${payment.amount}`,
    payment,
    timestamp: new Date(),
    reactions: [],
    visibility: { type: 'recipient-only', userId: visibleTo },
  }),

  eventReminder: (
    id: string,
    sender: UserProfileVM,
    event: EventReminderMessage['event'],
    visibility: MessageVisibility = { type: 'all' },
  ): EventReminderMessage => ({
    id,
    type: 'event-reminder',
    sender,
    content: `Event: ${event.title}`,
    event,
    timestamp: new Date(),
    reactions: [],
    visibility,
  }),

  designFileUpdate: (
    id: string,
    sender: UserProfileVM,
    attachment: DesignFileAttachment,
    content?: string,
    changesSummary?: string[],
  ): DesignFileUpdateMessage => ({
    id,
    type: 'design-file-update',
    sender,
    content,
    attachment,
    changesSummary,
    timestamp: new Date(),
    reactions: [],
    visibility: { type: 'all' },
  }),
};
