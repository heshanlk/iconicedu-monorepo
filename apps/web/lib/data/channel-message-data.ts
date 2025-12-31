import type {
  AttachmentVM,
  AudioRecordingMessageVM,
  ChannelFileItemVM,
  ChannelMediaItemVM,
  ChannelVM,
  DesignFileUpdateMessageVM,
  FileMessageVM,
  GuardianProfileVM,
  ImageMessageVM,
  LessonAssignmentMessageVM,
  LinkPreviewMessageVM,
  MessageVM,
  ProgressUpdateMessageVM,
  SessionBookingMessageVM,
  SessionSummaryMessageVM,
  TextMessageVM,
  ThreadVM,
  HomeworkSubmissionMessageVM,
  UserProfileVM,
  EducatorProfileVM,
  ChildProfileVM,
} from '@iconicedu/shared-types';
import { DIRECT_MESSAGE_CHANNELS } from './direct-message-channels';
import { CLASS_SPACE_CHANNELS } from './class-spaces';

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - 1000 * 60 * minutes).toISOString();
const hoursAgo = (hours: number) =>
  new Date(Date.now() - 1000 * 60 * 60 * hours).toISOString();
const hoursFromNow = (hours: number) =>
  new Date(Date.now() + 1000 * 60 * 60 * hours).toISOString();

const isGuardianProfile = (profile: UserProfileVM): profile is GuardianProfileVM =>
  'children' in profile;
const isEducatorProfile = (profile: UserProfileVM): profile is EducatorProfileVM =>
  'subjects' in profile || 'gradesSupported' in profile || 'experienceYears' in profile;
const isChildProfile = (profile: UserProfileVM): profile is ChildProfileVM =>
  'color' in profile;

const withSuffix = (uuid: string, suffix: string) => `${uuid.slice(0, -4)}${suffix}`;
const withIndexedSuffix = (uuid: string, start: number, index: number) =>
  withSuffix(uuid, (start + index).toString(16).padStart(4, '0'));

const withMessages = (channel: ChannelVM, messages: MessageVM[]): ChannelVM => {
  const savedCount = messages.filter((message) => message.isSaved).length;
  const lastReadIndex = Math.max(0, messages.length - 3);
  const lastReadMessageId = messages[lastReadIndex]?.id;
  const unreadCount = Math.max(0, messages.length - (lastReadIndex + 1));
  const attachments = messages.flatMap((message) => extractAttachments(message));
  const mediaItems: ChannelMediaItemVM[] = attachments
    .filter((attachment) => attachment.type === 'image')
    .map((attachment, index) => ({
      id: withIndexedSuffix(channel.id, 0x3000, index),
      channelId: channel.id,
      messageId: attachment.messageId,
      senderId: attachment.senderId,
      type: 'image',
      url: attachment.url,
      name: attachment.name,
      width: attachment.width ?? null,
      height: attachment.height ?? null,
      createdAt: attachment.createdAt,
    }));
  const fileItems: ChannelFileItemVM[] = attachments
    .filter((attachment) => attachment.type !== 'image')
    .map((attachment, index) => ({
      id: withIndexedSuffix(channel.id, 0x4000, index),
      channelId: channel.id,
      messageId: attachment.messageId,
      senderId: attachment.senderId,
      kind: attachment.type === 'design-file' ? 'design-file' : 'file',
      url: attachment.url,
      name: attachment.name,
      mimeType: attachment.mimeType ?? null,
      size: attachment.size ?? null,
      tool: attachment.tool ?? null,
      createdAt: attachment.createdAt,
    }));

  return {
    ...channel,
    headerItems: channel.headerItems.map((item) =>
      item.key === 'saved' ? { ...item, label: String(savedCount) } : item,
    ),
    messages: {
      items: messages,
      total: messages.length,
    },
    media: {
      items: mediaItems,
      total: mediaItems.length,
    },
    files: {
      items: fileItems,
      total: fileItems.length,
    },
    readState: {
      channelId: channel.id,
      lastReadAt: channel.readState?.lastReadAt ?? minutesAgo(30),
      lastReadMessageId,
      unreadCount,
    },
  };
};

const extractAttachments = (
  message: MessageVM,
): Array<
  (AttachmentVM & { messageId: string; createdAt: string; mimeType?: string; size?: number }) & {
    width?: number;
    height?: number;
    tool?: string;
  }
> => {
  const base = {
    messageId: message.id,
    createdAt: message.createdAt,
    senderId: message.sender.id,
  };
  if (message.type === 'image') {
    return [{ ...message.attachment, ...base }];
  }
  if (message.type === 'file') {
    return [{ ...message.attachment, ...base }];
  }
  if (message.type === 'design-file-update') {
    return [{ ...message.attachment, ...base }];
  }
  if (message.type === 'lesson-assignment' && message.assignment.attachments?.length) {
    return message.assignment.attachments.map((attachment) => ({ ...attachment, ...base }));
  }
  if (message.type === 'homework-submission' && message.homework.attachments?.length) {
    return message.homework.attachments.map((attachment) => ({ ...attachment, ...base }));
  }
  return [];
};

const buildDirectMessages = (
  channel: ChannelVM,
  guardian: GuardianProfileVM,
  educator: EducatorProfileVM,
  index: number,
): MessageVM[] => {
  const messageId = (suffix: string) => withSuffix(channel.id, suffix);
  const threadId = withSuffix(channel.id, '1001');
  const threadParentId = messageId('0002');
  const thread: ThreadVM = {
    id: threadId,
    parentMessageId: threadParentId,
    parentMessageSnippet: `${guardian.displayName} asked about today's lesson plan.`,
    parentMessageAuthorId: guardian.id,
    parentMessageAuthorName: guardian.displayName,
    messageCount: 3,
    lastReplyAt: hoursAgo(2 + index),
    participants: [educator, guardian],
    readState: {
      lastReadMessageId: messageId('0003'),
      unreadCount: 1,
    },
  };

  return [
    {
      id: messageId('0001'),
      type: 'text',
      content: `Hi ${guardian.firstName ?? guardian.displayName}, here's a quick recap from today.`,
      sender: educator,
      createdAt: hoursAgo(6 + index),
      reactions: [{ emoji: '✅', count: 1, sampleUserIds: [guardian.id] }],
      visibility: { type: 'all' },
      isSaved: true,
    } as TextMessageVM,
    {
      id: threadParentId,
      type: 'text',
      content: "Can you share the worksheet and the next practice set?",
      sender: guardian,
      createdAt: hoursAgo(5.5 + index),
      reactions: [],
      visibility: { type: 'all' },
      thread,
    } as TextMessageVM,
    {
      id: messageId('0003'),
      type: 'text',
      content: "Absolutely—I'll send the PDF and a short checklist.",
      sender: educator,
      createdAt: hoursAgo(5 + index),
      reactions: [{ emoji: '👍', count: 1, sampleUserIds: [guardian.id] }],
      visibility: { type: 'all' },
      thread,
    } as TextMessageVM,
    {
      id: messageId('0004'),
      type: 'image',
      content: 'Snapshot of today’s notes.',
      sender: guardian,
      createdAt: hoursAgo(3 + index),
      reactions: [],
      visibility: { type: 'all' },
      attachment: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=800&q=80',
        name: 'notes.jpg',
        width: 800,
        height: 600,
      },
    } as ImageMessageVM,
    {
      id: messageId('0005'),
      type: 'image',
      content: 'Reference photo from today’s session.',
      sender: educator,
      createdAt: hoursAgo(2.8 + index),
      reactions: [],
      visibility: { type: 'all' },
      attachment: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=80',
        name: 'reference.jpg',
        width: 800,
        height: 533,
      },
    } as ImageMessageVM,
    {
      id: messageId('0006'),
      type: 'image',
      content: 'Student work snapshot.',
      sender: guardian,
      createdAt: hoursAgo(2.4 + index),
      reactions: [],
      visibility: { type: 'all' },
      attachment: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
        name: 'student-work.jpg',
        width: 800,
        height: 534,
      },
    } as ImageMessageVM,
    {
      id: messageId('0007'),
      type: 'image',
      content: 'Workbook close-up.',
      sender: guardian,
      createdAt: hoursAgo(2.1 + index),
      reactions: [],
      visibility: { type: 'all' },
      attachment: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1457694587812-e8bf29a43845?auto=format&fit=crop&w=800&q=80',
        name: 'workbook.jpg',
        width: 800,
        height: 534,
      },
    } as ImageMessageVM,
    {
      id: messageId('0008'),
      type: 'image',
      content: 'Classroom setup preview.',
      sender: educator,
      createdAt: hoursAgo(1.9 + index),
      reactions: [],
      visibility: { type: 'all' },
      attachment: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
        name: 'classroom.jpg',
        width: 800,
        height: 533,
      },
    } as ImageMessageVM,
    {
      id: messageId('0009'),
      type: 'file',
      content: 'Weekly practice plan.',
      sender: educator,
      createdAt: hoursAgo(2 + index),
      reactions: [],
      visibility: { type: 'all' },
      attachment: {
        type: 'file',
        url: '/documents/lesson-plan.pdf',
        name: 'lesson-plan.pdf',
        size: 320000,
        mimeType: 'application/pdf',
      },
    } as FileMessageVM,
    {
      id: messageId('000a'),
      type: 'file',
      content: 'Reading checklist and rubric.',
      sender: educator,
      createdAt: hoursAgo(1.7 + index),
      reactions: [],
      visibility: { type: 'all' },
      attachment: {
        type: 'file',
        url: '/documents/reading-rubric.pdf',
        name: 'reading-rubric.pdf',
        size: 210000,
        mimeType: 'application/pdf',
      },
    } as FileMessageVM,
    {
      id: messageId('000b'),
      type: 'design-file-update',
      content: 'Updated visual worksheet layout.',
      sender: educator,
      createdAt: hoursAgo(1.8 + index),
      reactions: [],
      visibility: { type: 'all' },
      attachment: {
        type: 'design-file',
        url: '/designs/worksheet.fig',
        name: 'worksheet.fig',
        tool: 'figma',
        version: 'v2',
      },
    } as DesignFileUpdateMessageVM,
    {
      id: messageId('000c'),
      type: 'design-file-update',
      content: 'Slide deck refresh for next session.',
      sender: educator,
      createdAt: hoursAgo(1.5 + index),
      reactions: [],
      visibility: { type: 'all' },
      attachment: {
        type: 'design-file',
        url: '/designs/session-slides.fig',
        name: 'session-slides.fig',
        tool: 'figma',
        version: 'v3',
      },
    } as DesignFileUpdateMessageVM,
    {
      id: messageId('000d'),
      type: 'audio-recording',
      content: 'Quick voice note with tips for home practice.',
      sender: educator,
      createdAt: minutesAgo(40 + index * 3),
      reactions: [],
      visibility: { type: 'all' },
      audio: {
        url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
        durationSeconds: 38,
        waveform: [18, 30, 42, 50, 45, 40, 55, 60, 48, 38, 30],
        fileSize: 118000,
        mimeType: 'audio/wav',
      },
    } as AudioRecordingMessageVM,
  ];
};

const buildLearningSpaceMessages = (
  channel: ChannelVM,
  guardian: GuardianProfileVM,
  educator: EducatorProfileVM,
  child: ChildProfileVM,
  index: number,
): MessageVM[] => {
  const messageId = (suffix: string) => withSuffix(channel.id, suffix);
  const threadParentId = messageId('0002');
  const thread: ThreadVM = {
    id: withSuffix(channel.id, '2001'),
    parentMessageId: threadParentId,
    parentMessageSnippet: `Quick question about ${child.firstName ?? child.displayName}'s homework.`,
    parentMessageAuthorId: guardian.id,
    parentMessageAuthorName: guardian.displayName,
    messageCount: 2,
    lastReplyAt: hoursAgo(4 + index),
    participants: [educator, guardian],
  };

  return [
    {
      id: messageId('0001'),
      type: 'text',
      content: `Welcome to this week's learning space! ${child.firstName ?? child.displayName} made great progress.`,
      sender: educator,
      createdAt: hoursAgo(10 + index),
      reactions: [{ emoji: '✨', count: 1, sampleUserIds: [guardian.id] }],
      visibility: { type: 'all' },
      isSaved: true,
    } as TextMessageVM,
    {
      id: threadParentId,
      type: 'text',
      content: `Quick question about tonight's homework—any tips?`,
      sender: guardian,
      createdAt: hoursAgo(9 + index),
      reactions: [],
      visibility: { type: 'all' },
      thread,
    } as TextMessageVM,
    {
      id: messageId('0003'),
      type: 'text',
      content: `Keep it short and focus on accuracy over speed.`,
      sender: educator,
      createdAt: hoursAgo(8.5 + index),
      reactions: [{ emoji: '👍', count: 1, sampleUserIds: [guardian.id] }],
      visibility: { type: 'all' },
      thread,
    } as TextMessageVM,
    {
      id: messageId('0004'),
      type: 'lesson-assignment',
      content: 'New practice set for this week.',
      sender: educator,
      createdAt: hoursAgo(6 + index),
      reactions: [{ emoji: '📚', count: 1, sampleUserIds: [guardian.id] }],
      visibility: { type: 'all' },
      isSaved: true,
      assignment: {
        title: 'Weekly Skills Practice',
        description: 'Complete the attached worksheet and submit a photo.',
        dueAt: hoursFromNow(72),
        subject: channel.topic.split('•')[0]?.trim() || 'Study',
        estimatedDuration: 20,
        difficulty: 'intermediate',
      },
    } as LessonAssignmentMessageVM,
    {
      id: messageId('0005'),
      type: 'progress-update',
      content: `${child.firstName ?? child.displayName} reached this week's goal.`,
      sender: educator,
      createdAt: hoursAgo(4 + index),
      reactions: [{ emoji: '👏', count: 1, sampleUserIds: [guardian.id] }],
      visibility: { type: 'all' },
      progress: {
        subject: channel.topic.split('•')[0]?.trim() || 'Learning',
        metric: 'Weekly Goal',
        previousValue: 2,
        currentValue: 4,
        targetValue: 4,
        improvement: 100,
        summary: 'Completed all assigned practice items for the week.',
      },
    } as ProgressUpdateMessageVM,
    {
      id: messageId('0006'),
      type: 'session-booking',
      content: 'Next session is confirmed.',
      sender: educator,
      createdAt: hoursAgo(3 + index),
      reactions: [],
      visibility: { type: 'all' },
      session: {
        title: `Next ${channel.topic.split('•')[0]?.trim()} Session`,
        subject: channel.topic.split('•')[0]?.trim() || 'Learning',
        startAt: hoursFromNow(48),
        durationMinutes: 30,
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        status: 'confirmed',
        topics: ['Weekly review', 'Practice goals'],
      },
    } as SessionBookingMessageVM,
    {
      id: messageId('0007'),
      type: 'session-summary',
      content: 'Today we focused on core skills and practice routines.',
      sender: educator,
      createdAt: hoursAgo(2.5 + index),
      reactions: [],
      visibility: { type: 'all' },
      session: {
        title: `${child.firstName ?? child.displayName}'s session recap`,
        startAt: hoursAgo(3 + index),
        durationMinutes: 30,
        summary:
          'Reviewed foundational concepts, completed guided practice, and set goals for the next session.',
        highlights: ['Strong participation', 'Improved accuracy on drills'],
        nextSteps: ['Practice 10 minutes daily', 'Review flashcards'],
      },
    } as SessionSummaryMessageVM,
    {
      id: messageId('0008'),
      type: 'homework-submission',
      content: 'Submitted today’s worksheet.',
      sender: guardian,
      createdAt: hoursAgo(2 + index),
      reactions: [],
      visibility: { type: 'all' },
      homework: {
        assignmentTitle: 'Weekly Skills Practice',
        submittedAt: hoursAgo(2 + index),
        attachments: [
          {
            type: 'file',
            url: '/homework.pdf',
            name: `${child.firstName ?? child.displayName}_worksheet.pdf`,
            size: 245000,
          },
        ],
        status: 'submitted',
      },
    } as HomeworkSubmissionMessageVM,
    {
      id: messageId('0009'),
      type: 'homework-submission',
      content: 'Second worksheet submission.',
      sender: guardian,
      createdAt: hoursAgo(1.6 + index),
      reactions: [],
      visibility: { type: 'all' },
      homework: {
        assignmentTitle: 'Weekly Skills Practice',
        submittedAt: hoursAgo(1.6 + index),
        attachments: [
          {
            type: 'file',
            url: '/homework-2.pdf',
            name: `${child.firstName ?? child.displayName}_worksheet_2.pdf`,
            size: 198000,
          },
        ],
        status: 'submitted',
      },
    } as HomeworkSubmissionMessageVM,
    {
      id: messageId('000a'),
      type: 'link-preview',
      content: 'Optional enrichment resource.',
      sender: educator,
      createdAt: minutesAgo(40 + index * 2),
      reactions: [],
      visibility: { type: 'all' },
      link: {
        url: 'https://www.khanacademy.org/',
        title: 'Khan Academy',
        description: 'Practice activities and guided lessons.',
        imageUrl: 'https://picsum.photos/seed/picsum/400/200',
        siteName: 'Khan Academy',
        favicon: 'https://picsum.photos/seed/picsum/16/16',
      },
    } as LinkPreviewMessageVM,
  ];
};

export const DIRECT_MESSAGE_CHANNELS_WITH_MESSAGES = DIRECT_MESSAGE_CHANNELS.map(
  (channel, index) => {
    const participants = channel.participants;
    const guardian =
      participants.find(isGuardianProfile) ??
      (participants[0] as GuardianProfileVM);
    const educator =
      participants.find(isEducatorProfile) ??
      (participants.find((participant) => participant.id !== guardian.id) as EducatorProfileVM);
    const messages = buildDirectMessages(channel, guardian, educator, index);
    return withMessages(channel, messages);
  },
);

export const DIRECT_MESSAGE_CHANNELS_BY_ID = Object.fromEntries(
  DIRECT_MESSAGE_CHANNELS_WITH_MESSAGES.map((channel) => [channel.id, channel]),
);

export const LEARNING_SPACE_CHANNELS_WITH_MESSAGES = CLASS_SPACE_CHANNELS.map(
  (channel, index) => {
    const participants = channel.participants;
    const guardian =
      participants.find(isGuardianProfile) ??
      (participants[0] as GuardianProfileVM);
    const educator =
      participants.find(isEducatorProfile) ??
      (participants.find((participant) => participant.id !== guardian.id) as EducatorProfileVM);
    const child =
      participants.find(isChildProfile) ??
      (participants.find((participant) => participant.id !== guardian.id) as ChildProfileVM);
    const messages = buildLearningSpaceMessages(channel, guardian, educator, child, index);
    return withMessages(channel, messages);
  },
);

export const LEARNING_SPACE_CHANNELS_BY_ID = Object.fromEntries(
  LEARNING_SPACE_CHANNELS_WITH_MESSAGES.map((channel) => [channel.id, channel]),
);
