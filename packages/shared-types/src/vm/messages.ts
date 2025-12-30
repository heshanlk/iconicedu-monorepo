import type { ConnectionVM, ISODateTime, UUID } from './shared';
import type { UserProfileVM } from './profile';

export interface ReactionVM {
  emoji: string;
  count: number;
  reactedByMe?: boolean;
  sampleUserIds?: UUID[];
}

export interface MessageReadStateVM {
  channelId?: UUID;
  lastReadMessageId?: UUID;
  lastReadAt?: ISODateTime;
  unreadCount?: number;
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

export type AttachmentVM = ImageAttachmentVM | FileAttachmentVM | DesignFileAttachmentVM;

export interface ThreadVM {
  id: UUID;
  parentMessageId: UUID;
  parentMessageSnippet?: string | null;
  parentMessageAuthorId?: UUID | null;
  parentMessageAuthorName?: string | null;
  messageCount: number;
  lastReplyAt: ISODateTime;
  participants: UserProfileVM[];
  readState?: MessageReadStateVM;
}

export interface ThreadPanelPropsVM {
  thread: ThreadVM;
  replies: ConnectionVM<MessageVM>;
  parentMessage?: MessageVM;
  onSendReply: (content: string) => void;
  onProfileClick: (userId: UUID) => void;
  readState?: MessageReadStateVM;
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
  | 'session-summary'
  | 'homework-submission'
  | 'link-preview'
  | 'audio-recording';

interface BaseMessageVM {
  id: UUID;
  sender: UserProfileVM;
  createdAt: ISODateTime;
  reactions: ReactionVM[];
  thread?: ThreadVM;
  visibility: MessageVisibilityVM;
  isEdited?: boolean;
  editedAt?: ISODateTime;
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
    dueAt: ISODateTime;
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
    startAt: ISODateTime;
    endAt?: ISODateTime;
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
    dueAt: ISODateTime;
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
    startAt: ISODateTime;
    endAt?: ISODateTime;
    durationMinutes: number;
    meetingLink?: string;
    location?: string;
    status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
    topics?: string[];
  };
}

export interface SessionSummaryMessageVM extends BaseMessageVM {
  type: 'session-summary';
  content?: string;
  session: {
    title: string;
    startAt: ISODateTime;
    durationMinutes?: number;
    summary: string;
    highlights?: string[];
    nextSteps?: string[];
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
  type: 'audio-recording';
  content?: string;
  audio: {
    url: string;
    durationSeconds: number;
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
  | SessionSummaryMessageVM
  | HomeworkSubmissionMessageVM
  | LinkPreviewMessageVM
  | AudioRecordingMessageVM;
