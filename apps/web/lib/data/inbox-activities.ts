import type {
  ActivityFeedGroupItemVM,
  ActivityFeedLeafItemVM,
  ActivityFeedVM,
  ActorVM,
  FeedScopeVM,
} from '@iconicedu/shared-types';
import {
  MOCK_CHILDREN,
  MOCK_CHILDREN_IDS,
  MOCK_EDUCATOR,
  MOCK_EDUCATOR_2,
  MOCK_EDUCATOR_3,
  MOCK_GUARDIAN,
} from './people';

const now = Date.now();
const minutes = (value: number) => value * 60 * 1000;
const hours = (value: number) => value * 60 * 60 * 1000;
const days = (value: number) => value * 24 * 60 * 60 * 1000;
const iso = (msAgo: number) => new Date(now - msAgo).toISOString();

const userScope: FeedScopeVM = {
  kind: 'user',
  userId: MOCK_GUARDIAN.accountId,
};

const systemActor = { kind: 'system' } as const;

const toActor = (
  id: string,
  displayName: string,
  avatarUrl: string | null | undefined,
  roleKey: ActorVM['roleKey'],
): ActorVM => ({
  id,
  displayName,
  avatarUrl: avatarUrl ?? null,
  roleKey,
});

const educatorActor = toActor(
  MOCK_EDUCATOR.id,
  MOCK_EDUCATOR.displayName,
  MOCK_EDUCATOR.avatar.url,
  'educator',
);
const educatorTwoActor = toActor(
  MOCK_EDUCATOR_2.id,
  MOCK_EDUCATOR_2.displayName,
  MOCK_EDUCATOR_2.avatar.url,
  'educator',
);
const educatorThreeActor = toActor(
  MOCK_EDUCATOR_3.id,
  MOCK_EDUCATOR_3.displayName,
  MOCK_EDUCATOR_3.avatar.url,
  'educator',
);

const getChildById = (id: string) =>
  MOCK_CHILDREN.find((child) => child.accountId === id);

const zayne = getChildById(MOCK_CHILDREN_IDS.zayne);
const sophia = getChildById(MOCK_CHILDREN_IDS.sophia);

const classGroupActivities: ActivityFeedLeafItemVM[] = [
  {
    kind: 'leaf',
    id: '2f1f6e8e-7a9d-4e44-9b69-8c9b6b5b174c',
    occurredAt: iso(minutes(30)),
    createdAt: iso(minutes(30)),
    tabKey: 'classes',
    scope: userScope,
    visibility: 'direct',
    verb: 'file.uploaded',
    actor: systemActor,
    leading: { kind: 'icon', iconKey: 'Video', tone: 'success' },
    headline: {
      primary: 'Class recording ready',
      secondary: 'for',
      emphasis: zayne?.displayName ?? 'Child',
    },
    summary: 'Algebra I session recording is ready to watch.',
    actionButton: {
      label: 'Watch',
      variant: 'outline',
    },
    isRead: false,
  },
  {
    kind: 'leaf',
    id: '3cf6b5a0-58ae-4b09-9345-7c2d6a2f7e46',
    occurredAt: iso(minutes(45)),
    createdAt: iso(minutes(45)),
    tabKey: 'classes',
    scope: userScope,
    visibility: 'direct',
    verb: 'homework.submitted',
    actor: systemActor,
    leading: { kind: 'icon', iconKey: 'Paperclip', tone: 'warning' },
    headline: {
      primary: zayne?.displayName ?? 'Child',
      secondary: 'submitted',
      emphasis: 'Chapter 5 assignment',
    },
    summary: 'Homework submitted for review.',
    isRead: false,
  },
  {
    kind: 'leaf',
    id: '4f0b0c55-b5c0-4b8f-8eb7-8e4a4a7b4b12',
    occurredAt: iso(hours(1)),
    createdAt: iso(hours(1)),
    tabKey: 'classes',
    scope: userScope,
    visibility: 'direct',
    verb: 'notes.posted',
    actor: educatorActor,
    leading: { kind: 'icon', iconKey: 'FileText', tone: 'info' },
    headline: {
      primary: educatorActor.displayName,
      secondary: 'shared notes for',
      emphasis: 'Linear equations',
    },
    expandedContent:
      'Summary notes include slope-intercept form, graphing practice, and sample problems.',
    actionButton: {
      label: 'View',
      variant: 'outline',
    },
    isRead: false,
  },
  {
    kind: 'leaf',
    id: '5a0f1e7b-58c6-4a4f-96c7-0b7cce6b6471',
    occurredAt: iso(hours(1.5)),
    createdAt: iso(hours(1.5)),
    tabKey: 'classes',
    scope: userScope,
    visibility: 'direct',
    verb: 'summary.posted',
    actor: systemActor,
    leading: { kind: 'icon', iconKey: 'Sparkles', tone: 'info' },
    headline: {
      primary: 'AI summary ready',
      secondary: 'for',
      emphasis: 'Algebra I session',
    },
    expandedContent:
      'Today covered linear equations, slope-intercept form, and graphing. Practice problems assigned for homework.',
    isRead: false,
  },
  {
    kind: 'leaf',
    id: '3b7d4b9f-4d6a-41e4-8b0a-9e62c1f4a2d1',
    occurredAt: iso(hours(2)),
    createdAt: iso(hours(2)),
    tabKey: 'classes',
    scope: userScope,
    visibility: 'direct',
    verb: 'homework.reviewed',
    actor: educatorActor,
    leading: { kind: 'icon', iconKey: 'Paperclip', tone: 'warning' },
    headline: {
      primary: educatorActor.displayName,
      secondary: 'graded',
      emphasis: 'Previous assignment',
    },
    expandedContent: 'Score: 94/100. Excellent work on linear functions.',
    actionButton: {
      label: 'View grade',
      variant: 'outline',
    },
    isRead: false,
  },
];

const classGroup: ActivityFeedGroupItemVM = {
  kind: 'group',
  id: '0f0f61b6-bd40-4df2-9d7e-bb8dd4e4d1d5',
  occurredAt: iso(minutes(15)),
  createdAt: iso(minutes(15)),
  tabKey: 'classes',
  scope: userScope,
  visibility: 'direct',
  verb: 'session.scheduled',
  actor: educatorActor,
  leading: {
    kind: 'avatars',
    avatars: [
      MOCK_EDUCATOR.avatar,
      zayne?.avatar ?? MOCK_EDUCATOR_2.avatar,
      MOCK_EDUCATOR_2.avatar,
    ],
    overflowCount: 1,
  },
  headline: {
    primary: educatorActor.displayName,
    secondary: 'upcoming class for',
    emphasis: `${zayne?.displayName ?? 'Child'} • Algebra I`,
  },
  summary: 'Class starts in 15 minutes.',
  actionButton: {
    label: 'Join now',
    variant: 'default',
  },
  groupType: 'class',
  groupKey: `learning_space:${MOCK_EDUCATOR.id}:upcoming`,
  subActivityCount: classGroupActivities.length,
  subActivities: { items: classGroupActivities, total: classGroupActivities.length },
  isRead: false,
};

const scienceGroupActivities: ActivityFeedLeafItemVM[] = [
  {
    kind: 'leaf',
    id: '9a6b7c8d-1e2f-4a5b-9c0d-1e2f3a4b5c6d',
    occurredAt: iso(minutes(55)),
    createdAt: iso(minutes(55)),
    tabKey: 'classes',
    scope: userScope,
    visibility: 'direct',
    verb: 'message.posted',
    actor: educatorTwoActor,
    leading: { kind: 'icon', iconKey: 'MessageSquare', tone: 'info' },
    headline: {
      primary: educatorTwoActor.displayName,
      secondary: 'posted in',
      emphasis: 'Biology lab chat',
    },
    preview: {
      text: 'Bring your lab notebook and safety goggles.',
    },
    isRead: false,
  },
  {
    kind: 'leaf',
    id: '1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
    occurredAt: iso(hours(1.2)),
    createdAt: iso(hours(1.2)),
    tabKey: 'classes',
    scope: userScope,
    visibility: 'direct',
    verb: 'file.uploaded',
    actor: educatorTwoActor,
    leading: { kind: 'icon', iconKey: 'FileText', tone: 'info' },
    headline: {
      primary: educatorTwoActor.displayName,
      secondary: 'uploaded',
      emphasis: 'Lab instructions',
    },
    summary: 'Microscope setup, observation steps, and rubric.',
    actionButton: {
      label: 'Open file',
      variant: 'outline',
    },
    isRead: false,
  },
  {
    kind: 'leaf',
    id: '7f8e9d0c-1b2a-3c4d-5e6f-7a8b9c0d1e2f',
    occurredAt: iso(hours(1.8)),
    createdAt: iso(hours(1.8)),
    tabKey: 'classes',
    scope: userScope,
    visibility: 'direct',
    verb: 'session.scheduled',
    actor: educatorTwoActor,
    leading: { kind: 'icon', iconKey: 'GraduationCap', tone: 'success' },
    headline: {
      primary: 'Lab session scheduled',
      secondary: 'for',
      emphasis: `${sophia?.displayName ?? 'Child'} • Biology`,
    },
    summary: 'Starts today at 4:00 PM.',
    isRead: false,
  },
];

const scienceGroup: ActivityFeedGroupItemVM = {
  kind: 'group',
  id: '6e5d4c3b-2a1f-4b5c-9d8e-7f6a5b4c3d2e',
  occurredAt: iso(minutes(50)),
  createdAt: iso(minutes(50)),
  tabKey: 'classes',
  scope: userScope,
  visibility: 'direct',
  verb: 'session.scheduled',
  actor: educatorTwoActor,
  leading: {
    kind: 'avatars',
    avatars: [MOCK_EDUCATOR_2.avatar, sophia?.avatar ?? MOCK_EDUCATOR.avatar],
  },
  headline: {
    primary: educatorTwoActor.displayName,
    secondary: 'upcoming class for',
    emphasis: `${sophia?.displayName ?? 'Child'} • Biology lab`,
  },
  summary: 'Lab starts in 50 minutes.',
  actionButton: {
    label: 'Join now',
    variant: 'default',
  },
  groupType: 'class',
  groupKey: `learning_space:${MOCK_EDUCATOR_2.id}:bio-lab`,
  subActivityCount: scienceGroupActivities.length,
  subActivities: { items: scienceGroupActivities, total: scienceGroupActivities.length },
  isRead: false,
};

const paymentReminder: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: '8a4d2e47-bf9c-4b3a-8e2d-2a9c1c2f7c3b',
  occurredAt: iso(minutes(5)),
  createdAt: iso(minutes(5)),
  tabKey: 'payment',
  scope: userScope,
  visibility: 'direct',
  verb: 'message.posted',
  actor: systemActor,
  leading: { kind: 'icon', iconKey: 'CreditCard', tone: 'danger' },
  headline: {
    primary: 'Payment reminder',
    secondary: 'for',
    emphasis: 'March tuition payment',
  },
  expandedContent:
    'Your monthly tuition payment of $480 for Zayne and Sophia is due on March 15. Please complete payment by the due date to avoid late fees.',
  actionButton: {
    label: 'Pay now',
    variant: 'default',
  },
  isRead: false,
};

const completeClassReminder: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: 'f0b5b6b2-8d19-4fa1-9f86-8a3f712a4c77',
  occurredAt: iso(minutes(20)),
  createdAt: iso(minutes(20)),
  tabKey: 'system',
  scope: userScope,
  visibility: 'direct',
  verb: 'session.completed',
  actor: systemActor,
  leading: { kind: 'icon', iconKey: 'CheckCircle2', tone: 'warning' },
  headline: {
    primary: 'Confirm class completion',
    secondary: 'for',
    emphasis: 'Geometry session',
  },
  expandedContent:
    'Your Geometry class with Ms. Brooks ended yesterday. Please confirm that the class was completed successfully.',
  actionButton: {
    label: 'Mark complete',
    variant: 'default',
  },
  isRead: false,
};

const sophiaReminder: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: '4f996e3a-4f2b-4d48-9a71-2685a6e4a38d',
  occurredAt: iso(minutes(35)),
  createdAt: iso(minutes(35)),
  tabKey: 'system',
  scope: userScope,
  visibility: 'direct',
  verb: 'message.posted',
  actor: systemActor,
  leading: { kind: 'icon', iconKey: 'Bell', tone: 'info' },
  headline: {
    primary: 'Reminder',
    secondary: 'for',
    emphasis: `${sophia?.displayName ?? 'Child'} • Physics class`,
  },
  summary: 'Physics class starts in 2 hours.',
  actionButton: {
    label: 'View class',
    variant: 'outline',
  },
  isRead: false,
};

const messageActivity: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: '5a2a9b4a-8a26-44a4-8c72-97f4a0b0c0db',
  occurredAt: iso(hours(3)),
  createdAt: iso(hours(3)),
  tabKey: 'classes',
  scope: userScope,
  visibility: 'direct',
  verb: 'message.posted',
  actor: educatorTwoActor,
  leading: { kind: 'icon', iconKey: 'MessageSquare', tone: 'info' },
  headline: {
    primary: educatorTwoActor.displayName,
    secondary: 'sent a message in',
    emphasis: 'Algebra I chat',
  },
  expandedContent:
    "Great job today! Don't forget to review the practice problems for next week's quiz.",
  isRead: false,
};

const homeworkAssigned: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: '6a6efb93-35a5-4ec2-9c83-c7f09c3f9fd7',
  occurredAt: iso(hours(1)),
  createdAt: iso(hours(1)),
  tabKey: 'classes',
  scope: userScope,
  visibility: 'direct',
  verb: 'homework.assigned',
  actor: educatorThreeActor,
  leading: { kind: 'icon', iconKey: 'Paperclip', tone: 'warning' },
  headline: {
    primary: educatorThreeActor.displayName,
    secondary: 'assigned homework for',
    emphasis: zayne?.displayName ?? 'Child',
  },
  expandedContent:
    'Complete problems 1-15 on page 87. Focus on factoring techniques. Due by Friday at 5:00 PM.',
  actionButton: {
    label: 'View assignment',
    variant: 'outline',
  },
  isRead: false,
};

const rescheduledSession: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: 'b5c5f9b2-20e5-4b3c-8bfe-7a0f3f42c5f8',
  occurredAt: iso(hours(2.5)),
  createdAt: iso(hours(2.5)),
  tabKey: 'classes',
  scope: userScope,
  visibility: 'direct',
  verb: 'session.rescheduled',
  actor: educatorActor,
  leading: { kind: 'icon', iconKey: 'GraduationCap', tone: 'info' },
  headline: {
    primary: educatorActor.displayName,
    secondary: 'rescheduled',
    emphasis: 'Math coaching session',
  },
  summary: 'New time: Friday at 6:30 PM.',
  isRead: false,
};

const canceledSession: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: 'fe0b63c1-6a52-4a9c-9f3a-1b7b9b0a12d4',
  occurredAt: iso(hours(4)),
  createdAt: iso(hours(4)),
  tabKey: 'classes',
  scope: userScope,
  visibility: 'direct',
  verb: 'session.canceled',
  actor: educatorTwoActor,
  leading: { kind: 'icon', iconKey: 'Bell', tone: 'warning' },
  headline: {
    primary: educatorTwoActor.displayName,
    secondary: 'canceled',
    emphasis: 'Science lab session',
  },
  summary: 'A makeup session will be scheduled soon.',
  isRead: false,
};

const classUpdated: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: 'd92e7f9c-4c8e-46b2-9e5b-2c7f4d5a1a99',
  occurredAt: iso(hours(6)),
  createdAt: iso(hours(6)),
  tabKey: 'classes',
  scope: userScope,
  visibility: 'scope_only',
  verb: 'class.updated',
  actor: educatorThreeActor,
  leading: { kind: 'icon', iconKey: 'GraduationCap', tone: 'info' },
  headline: {
    primary: 'Class update',
    secondary: 'for',
    emphasis: 'Social studies cohort',
  },
  summary: 'New reading materials were added to this week’s lesson.',
  isRead: true,
};

const recordingReady: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: '8d98f4f3-7f1d-4a1f-8e6c-1a8c2c2f6d3b',
  occurredAt: iso(days(1)),
  createdAt: iso(days(1)),
  tabKey: 'classes',
  scope: userScope,
  visibility: 'direct',
  verb: 'file.uploaded',
  actor: systemActor,
  leading: { kind: 'icon', iconKey: 'Video', tone: 'success' },
  headline: {
    primary: 'Recording ready',
    secondary: 'for',
    emphasis: `${sophia?.displayName ?? 'Child'} • Biology lab`,
  },
  actionButton: {
    label: 'Watch recording',
    variant: 'outline',
  },
  isRead: true,
};

const notesPosted: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: '2b9c7f1c-9f45-4f6a-9b6a-2b0e1a4c9d7b',
  occurredAt: iso(days(1)),
  createdAt: iso(days(1)),
  tabKey: 'classes',
  scope: userScope,
  visibility: 'direct',
  verb: 'notes.posted',
  actor: educatorTwoActor,
  leading: { kind: 'icon', iconKey: 'FileText', tone: 'info' },
  headline: {
    primary: educatorTwoActor.displayName,
    secondary: 'posted notes for',
    emphasis: 'Biology lab review',
  },
  preview: {
    text: 'Lab safety, organelles, and microscope calibration checklist...',
  },
  actionButton: {
    label: 'Open notes',
    variant: 'outline',
  },
  isRead: true,
};

const gradedHomework: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: '0c1e2b73-2b8e-4c6e-9cc7-bc0a60f0a7b2',
  occurredAt: iso(days(1)),
  createdAt: iso(days(1)),
  tabKey: 'classes',
  scope: userScope,
  visibility: 'direct',
  verb: 'homework.reviewed',
  actor: educatorTwoActor,
  leading: { kind: 'icon', iconKey: 'Paperclip', tone: 'warning' },
  headline: {
    primary: educatorTwoActor.displayName,
    secondary: 'graded',
    emphasis: `${sophia?.displayName ?? 'Child'} • Lab report`,
  },
  expandedContent:
    'Score: 95/100. Excellent work. Your hypothesis was clear and data analysis was thorough.',
  actionButton: {
    label: 'View feedback',
    variant: 'outline',
  },
  isRead: true,
};

const messageEdited: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: 'c842a1d0-4f21-46ae-9f9f-7a6b1a3c9f90',
  occurredAt: iso(days(1.5)),
  createdAt: iso(days(1.5)),
  tabKey: 'classes',
  scope: userScope,
  visibility: 'direct',
  verb: 'message.edited',
  actor: educatorActor,
  leading: { kind: 'icon', iconKey: 'MessageSquare', tone: 'info' },
  headline: {
    primary: educatorActor.displayName,
    secondary: 'edited a message in',
    emphasis: 'Algebra I chat',
  },
  preview: {
    text: 'Updated the homework due date to Friday.',
  },
  isRead: true,
};

const reactionAdded: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: '5f8c4e21-8d1a-4d7a-9b0f-2d1c9f8a5b6c',
  occurredAt: iso(days(2)),
  createdAt: iso(days(2)),
  tabKey: 'classes',
  scope: userScope,
  visibility: 'direct',
  verb: 'reaction.added',
  actor: educatorThreeActor,
  leading: { kind: 'icon', iconKey: 'MessageSquare', tone: 'neutral' },
  headline: {
    primary: educatorThreeActor.displayName,
    secondary: 'reacted to a message in',
    emphasis: 'Class announcements',
  },
  preview: {
    text: '👍 “Great work on the quiz!”',
  },
  isRead: true,
};

const fileDeleted: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: 'a9f0b4d1-3f6e-4a98-9c0f-3a1b8c7d9e5f',
  occurredAt: iso(days(2.5)),
  createdAt: iso(days(2.5)),
  tabKey: 'classes',
  scope: userScope,
  visibility: 'scope_only',
  verb: 'file.deleted',
  actor: educatorTwoActor,
  leading: { kind: 'icon', iconKey: 'FileText', tone: 'warning' },
  headline: {
    primary: educatorTwoActor.displayName,
    secondary: 'removed',
    emphasis: 'Old lab worksheet',
  },
  summary: 'An updated worksheet has been uploaded.',
  isRead: true,
};

const memberInvited: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: 'd1f2b3c4-5e6f-7a89-9b0c-1d2e3f4a5b6c',
  occurredAt: iso(days(3)),
  createdAt: iso(days(3)),
  tabKey: 'system',
  scope: userScope,
  visibility: 'public',
  verb: 'member.invited',
  actor: systemActor,
  leading: { kind: 'icon', iconKey: 'CheckCircle2', tone: 'success' },
  headline: {
    primary: 'Invitation sent',
    secondary: 'to join',
    emphasis: 'Family portal',
  },
  summary: 'Invite delivered to parent2@example.com.',
  isRead: true,
};

const roleChanged: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: 'f3a6b7c8-9d0e-4f1a-8b2c-3d4e5f6a7b8c',
  occurredAt: iso(days(3.5)),
  createdAt: iso(days(3.5)),
  tabKey: 'system',
  scope: userScope,
  visibility: 'public',
  verb: 'role.changed',
  actor: systemActor,
  leading: { kind: 'icon', iconKey: 'CheckCircle2', tone: 'info' },
  headline: {
    primary: 'Role updated',
    secondary: 'for',
    emphasis: 'Jamie Chen',
  },
  summary: 'Account role set to Guardian.',
  isRead: true,
};

const feedbackSurvey: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: 'c1a8c9c3-4b0b-4b6f-92f1-2d3e44e7f4ab',
  occurredAt: iso(days(3)),
  createdAt: iso(days(3)),
  tabKey: 'system',
  scope: userScope,
  visibility: 'direct',
  verb: 'message.posted',
  actor: systemActor,
  leading: { kind: 'icon', iconKey: 'ClipboardCheck', tone: 'info' },
  headline: {
    primary: 'Feedback request',
    secondary: 'for',
    emphasis: "Algebra I with Ms. Brooks",
  },
  expandedContent:
    'We would love to hear your feedback about the recent class. Your input helps us improve the learning experience.',
  actionButton: {
    label: 'Take survey',
    variant: 'default',
  },
  isRead: true,
};

const archivedMessageGroup: ActivityFeedGroupItemVM = {
  kind: 'group',
  id: 'b1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  occurredAt: iso(days(4)),
  createdAt: iso(days(4)),
  tabKey: 'system',
  scope: userScope,
  visibility: 'scope_only',
  verb: 'message.deleted',
  actor: educatorActor,
  leading: { kind: 'icon', iconKey: 'MessageSquare', tone: 'neutral' },
  headline: {
    primary: 'Messages archived',
    secondary: 'from',
    emphasis: 'Spring cohort chat',
  },
  summary: 'Older messages were archived automatically.',
  groupType: 'message',
  groupKey: `channel:${MOCK_EDUCATOR.id}:archive`,
  subActivityCount: 3,
  subActivities: { items: [], total: 3 },
  isRead: true,
};

const homeworkSubmitted: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: 'e3d4c5b6-a7f8-49c0-9b1a-2c3d4e5f6a7b',
  occurredAt: iso(days(4.5)),
  createdAt: iso(days(4.5)),
  tabKey: 'classes',
  scope: userScope,
  visibility: 'direct',
  verb: 'homework.submitted',
  actor: systemActor,
  leading: { kind: 'icon', iconKey: 'Paperclip', tone: 'warning' },
  headline: {
    primary: sophia?.displayName ?? 'Child',
    secondary: 'submitted',
    emphasis: 'Chemistry worksheet',
  },
  summary: 'Submitted 2 minutes before the deadline.',
  isRead: true,
};

const scheduleReminder: ActivityFeedLeafItemVM = {
  kind: 'leaf',
  id: 'a8d43262-0197-4c1d-9a3f-0b2db7d0d2f3',
  occurredAt: iso(days(2)),
  createdAt: iso(days(2)),
  tabKey: 'system',
  scope: userScope,
  visibility: 'direct',
  verb: 'message.posted',
  actor: systemActor,
  leading: { kind: 'icon', iconKey: 'Bell', tone: 'info' },
  headline: {
    primary: 'Reminder',
    secondary: 'for',
    emphasis: `${sophia?.displayName ?? 'Child'} • Spanish II`,
  },
  summary: 'Class tomorrow at 3:00 PM.',
  isRead: true,
};

export const INBOX_ACTIVITY_FEED: ActivityFeedVM = {
  activeTab: 'all',
  tabs: [
    { key: 'all', label: 'All' },
    { key: 'classes', label: 'Classes' },
    { key: 'payment', label: 'Payment' },
    { key: 'system', label: 'System' },
  ],
  sections: [
    {
      label: 'Today',
      items: [
        paymentReminder,
        classGroup,
        scienceGroup,
        completeClassReminder,
        sophiaReminder,
        messageActivity,
        homeworkAssigned,
        rescheduledSession,
        canceledSession,
      ],
    },
    {
      label: 'Yesterday',
      items: [
        recordingReady,
        notesPosted,
        gradedHomework,
        messageEdited,
        classUpdated,
      ],
    },
    {
      label: 'Earlier',
      items: [
        feedbackSurvey,
        archivedMessageGroup,
        reactionAdded,
        fileDeleted,
        memberInvited,
        roleChanged,
        homeworkSubmitted,
        scheduleReminder,
      ],
    },
  ],
};
