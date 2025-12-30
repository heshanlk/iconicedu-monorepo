import type {
  AudioRecordingMessageVM,
  ChannelVM,
  FileMessageVM,
  GuardianProfileVM,
  ImageMessageVM,
  LessonAssignmentMessageVM,
  LinkPreviewMessageVM,
  MessageVM,
  ProgressUpdateMessageVM,
  SessionBookingMessageVM,
  TextMessageVM,
  ThreadVM,
  HomeworkSubmissionMessageVM,
  UserProfileVM,
  EducatorProfileVM,
  ChildProfileVM,
} from '@iconicedu/shared-types';
import { DIRECT_MESSAGE_CHANNELS } from './direct-message-channels';
import { LEARNING_SPACES } from './learning-spaces';

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

const withMessages = (channel: ChannelVM, messages: MessageVM[]): ChannelVM => {
  const savedCount = messages.filter((message) => message.isSaved).length;
  const lastReadIndex = Math.max(0, messages.length - 3);
  const lastReadMessageId = messages[lastReadIndex]?.id;
  const unreadCount = Math.max(0, messages.length - (lastReadIndex + 1));

  return {
    ...channel,
    headerItems: channel.headerItems.map((item) =>
      item.key === 'saved' ? { ...item, label: String(savedCount) } : item,
    ),
    messages: {
      items: messages,
      total: messages.length,
    },
    readState: {
      channelId: channel.id,
      lastReadAt: channel.readState?.lastReadAt ?? minutesAgo(30),
      lastReadMessageId,
      unreadCount,
    },
  };
};

const buildDirectMessages = (
  channel: ChannelVM,
  guardian: GuardianProfileVM,
  educator: EducatorProfileVM,
  index: number,
): MessageVM[] => {
  const prefix = `dm-${channel.id}`;
  const threadId = `${prefix}-thread-1`;
  const threadParentId = `${prefix}-2`;
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
      lastReadMessageId: `${prefix}-3`,
      unreadCount: 1,
    },
  };

  return [
    {
      id: `${prefix}-1`,
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
      id: `${prefix}-3`,
      type: 'text',
      content: "Absolutely—I'll send the PDF and a short checklist.",
      sender: educator,
      createdAt: hoursAgo(5 + index),
      reactions: [{ emoji: '👍', count: 1, sampleUserIds: [guardian.id] }],
      visibility: { type: 'all' },
      thread,
    } as TextMessageVM,
    {
      id: `${prefix}-4`,
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
      id: `${prefix}-5`,
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
      id: `${prefix}-6`,
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
  const prefix = `ls-${channel.id}`;
  const threadParentId = `${prefix}-2`;
  const thread: ThreadVM = {
    id: `${prefix}-thread-1`,
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
      id: `${prefix}-1`,
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
      id: `${prefix}-3`,
      type: 'text',
      content: `Keep it short and focus on accuracy over speed.`,
      sender: educator,
      createdAt: hoursAgo(8.5 + index),
      reactions: [{ emoji: '👍', count: 1, sampleUserIds: [guardian.id] }],
      visibility: { type: 'all' },
      thread,
    } as TextMessageVM,
    {
      id: `${prefix}-4`,
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
      id: `${prefix}-5`,
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
      id: `${prefix}-6`,
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
      id: `${prefix}-7`,
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
      id: `${prefix}-8`,
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

export const LEARNING_SPACE_CHANNELS_WITH_MESSAGES = LEARNING_SPACES.map(
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
