import type { AvatarVM } from './profile';
import { ConnectionVM, EntityRefVM, ISODateTime, UUID } from './shared';

export type ActivityGroupKeyVM =
  | 'homework'
  | 'message'
  | 'class'
  | 'reminder'
  | 'recording'
  | 'notes'
  | 'ai-summary'
  | 'payment'
  | 'survey'
  | 'complete-class';

export type FeedScopeVM =
  | { kind: 'global' }
  | { kind: 'learning_space'; learningSpaceId: UUID }
  | { kind: 'channel'; channelId: UUID }
  | { kind: 'dm'; threadId: UUID }
  | { kind: 'user'; userId: UUID };

export type SystemProfileVM = {
  kind: 'system';
  id: UUID;
  displayName: string;
  avatar: AvatarVM;
};

export interface ActivityActorProfileVM {
  id: UUID;
  displayName: string;
  avatar: AvatarVM;
}

export type ActivityActorVM = ActivityActorProfileVM | SystemProfileVM;

export type ActivityVisibilityVM = 'public' | 'scope_only' | 'direct';
export type AudienceRuleVM =
  | { kind: 'all_in_scope' }
  | { kind: 'roles_only'; roleKeys: string[] }
  | { kind: 'users_only'; userIds: UUID[] }
  | { kind: 'exclude_users'; userIds: UUID[] };

export type ActivityImportanceVM = 'normal' | 'important' | 'urgent';

export type ActivityVerbVM =
  | 'class.created'
  | 'class.updated'
  | 'session.scheduled'
  | 'session.rescheduled'
  | 'session.canceled'
  | 'session.completed'
  | 'message.posted'
  | 'message.edited'
  | 'message.deleted'
  | 'reaction.added'
  | 'reaction.removed'
  | 'homework.assigned'
  | 'homework.submitted'
  | 'homework.reviewed'
  | 'summary.posted'
  | 'notes.posted'
  | 'file.uploaded'
  | 'file.deleted'
  | 'member.invited'
  | 'member.joined'
  | 'member.removed'
  | 'role.changed';

export type InboxTabKeyVM = 'all' | 'classes' | 'payment' | 'system';

export type InboxIconKeyVM =
  | 'Bell'
  | 'CheckCircle2'
  | 'ClipboardCheck'
  | 'CreditCard'
  | 'FileText'
  | 'GraduationCap'
  | 'MessageSquare'
  | 'Paperclip'
  | 'Sparkles'
  | 'Video';

export type InboxLeadingVM =
  | {
      kind: 'icon';
      iconKey: InboxIconKeyVM;
      tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
    }
  | {
      kind: 'avatars';
      avatars: AvatarVM[];
      overflowCount?: number;
    };

export type InboxHeadlineVM = {
  primary: string;
  secondary?: string;
  emphasis?: string;
};

export type InboxActionButtonVM = {
  label: string;
  variant: 'default' | 'outline' | 'secondary';
  href?: string | null;
  actionKey?: string | null;
  payload?: Record<string, unknown> | null;
};

export interface ActivityFeedItemBaseVM {
  id: UUID;

  occurredAt: ISODateTime;
  createdAt: ISODateTime;

  tabKey: InboxTabKeyVM;

  scope: FeedScopeVM;
  visibility: ActivityVisibilityVM;
  audience?: AudienceRuleVM[];

  verb: ActivityVerbVM;

  actor: ActivityActorVM;

  object?: EntityRefVM;
  target?: EntityRefVM;

  groupKey?: string;
  groupType?: ActivityGroupKeyVM;

  leading?: InboxLeadingVM;
  headline: InboxHeadlineVM;
  summary?: string;
  preview?: {
    text?: string;
    attachmentsCount?: number;
  };
  actionButton?: InboxActionButtonVM;
  expandedContent?: string;
  importance?: ActivityImportanceVM;
  isRead?: boolean;

  metadata?: Record<string, unknown>;
}

export type ActivityFeedLeafItemVM = ActivityFeedItemBaseVM & {
  kind: 'leaf';

  groupKey?: never;
  groupType?: never;
  subActivities?: never;
};

export type ActivityFeedGroupItemVM = ActivityFeedItemBaseVM & {
  kind: 'group';

  groupType: ActivityGroupKeyVM;
  groupKey: string;

  isCollapsed?: boolean;

  subActivityCount?: number;

  subActivities?: ConnectionVM<ActivityFeedLeafItemVM>;
};

export type ActivityFeedItemVM = ActivityFeedLeafItemVM | ActivityFeedGroupItemVM;

export type ActivityFeedSectionVM = {
  label: string;
  items: ActivityFeedItemVM[];
};

export type ActivityFeedVM = {
  activeTab: InboxTabKeyVM;

  tabs: Array<{
    key: InboxTabKeyVM;
    label: string;
    badgeCount?: number;
  }>;

  sections: ActivityFeedSectionVM[];

  nextCursor?: string | null;

  unreadCount?: number;
};
