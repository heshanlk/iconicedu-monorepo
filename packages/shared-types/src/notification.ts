import { AvatarVM } from './vm/profile';
import { ConnectionVM, ISODateTime, UUID } from './vm/shared';

export type ActivityGroupKey =
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

export type FeedScope =
  | { kind: 'global' } // e.g., staff dashboard
  | { kind: 'class_space'; classSpaceId: UUID }
  | { kind: 'channel'; channelId: UUID }
  | { kind: 'dm'; threadId: UUID } // optional, if you model DMs as a thread
  | { kind: 'user'; userId: UUID }; // "your notifications/activity"

export type ActorVM = {
  id: UUID;
  displayName: string;
  avatarUrl?: string | null;
  roleKey?: 'owner' | 'admin' | 'educator' | 'guardian' | 'child' | 'staff' | string;
};

export type EntityRef =
  | { type: 'class_space'; id: UUID }
  | { type: 'session'; id: UUID }
  | { type: 'homework'; id: UUID }
  | { type: 'summary'; id: UUID }
  | { type: 'message'; id: UUID }
  | { type: 'file'; id: UUID }
  | { type: 'user'; id: UUID }
  | { type: 'educator'; id: UUID }
  | { type: 'guardian'; id: UUID }
  | { type: 'child'; id: UUID }
  | { type: 'staff'; id: UUID };

export type ActivityVisibility = 'public' | 'scope_only' | 'direct';
export type AudienceRule =
  | { kind: 'all_in_scope' }
  | { kind: 'roles_only'; roleKeys: string[] }
  | { kind: 'users_only'; userIds: UUID[] }
  | { kind: 'exclude_users'; userIds: UUID[] };

export type ActivityImportance = 'normal' | 'important' | 'urgent';

export type ActivityVerb =
  // class / scheduling
  | 'class.created'
  | 'class.updated'
  | 'session.scheduled'
  | 'session.rescheduled'
  | 'session.canceled'
  | 'session.completed'

  // communication
  | 'message.posted'
  | 'message.edited'
  | 'message.deleted'
  | 'reaction.added'
  | 'reaction.removed'

  // learning artifacts
  | 'homework.assigned'
  | 'homework.submitted'
  | 'homework.reviewed'
  | 'summary.posted'
  | 'notes.posted'
  | 'file.uploaded'
  | 'file.deleted'

  // membership / access
  | 'member.invited'
  | 'member.joined'
  | 'member.removed'
  | 'role.changed';

export type InboxTabKey = 'all' | 'classes' | 'payment' | 'system';

export type InboxIconKey =
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
      iconKey: InboxIconKey;
      // optional tint key for UI
      tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
    }
  | {
      kind: 'avatars';
      avatars: AvatarVM[]; // FE can render first N
      overflowCount?: number; // e.g., +2
    };

/** ---------------------------
 * Headline pieces so you can bold parts
 * Example:
 *  primary: "Ms. Dinesha"
 *  secondary: "upcoming class for"
 *  emphasis: "Zayne Algebra I"
 * -------------------------- */
export type InboxHeadlineVM = {
  primary: string;
  secondary?: string;
  emphasis?: string;
};

export type InboxActionButtonVM = {
  label: string;
  variant: 'default' | 'outline' | 'secondary';
  onClick?: () => void;
};

export interface ActivityFeedItemBase {
  id: UUID;

  // time
  occurredAt: ISODateTime; // when it happened
  createdAt: ISODateTime; // when stored (can differ for imports)

  // inbox categorization (tabs)
  tabKey: InboxTabKey;

  // where it belongs
  scope: FeedScope;
  visibility: ActivityVisibility;
  audience?: AudienceRule[]; // extra filtering within a scope

  // what happened
  verb: ActivityVerb;

  // who did it
  actor: ActorVM | { kind: 'system' };

  // what it happened to
  object?: EntityRef; // primary object (e.g., homework, message, session)
  target?: EntityRef; // secondary (e.g., channel/class_space/session)

  // optional structure
  groupKey?: string; // e.g., "session:<uuid>" to group multiple events
  groupType?: ActivityGroupKey;

  // content for UI (keep it small; fetch full objects separately)
  leading?: InboxLeadingVM; // e.g., "Homework assigned"
  headline: InboxHeadlineVM;
  summary?: string; // e.g., "Fractions worksheet (IXL skill: ...)"
  preview?: {
    text?: string; // message snippet
    attachmentsCount?: number;
  };
  actionButton?: InboxActionButtonVM;
  expandedContent?: string;
  importance?: ActivityImportance;
  isRead?: boolean; // for per-user feeds/notifications

  // extensible payload for backend-driven details
  metadata?: Record<string, unknown>;
}

/** ---------------------------
 * Leaf: single row activity
 * -------------------------- */
export type ActivityFeedLeafItem = ActivityFeedItemBase & {
  kind: 'leaf';

  // no children
  groupKey?: never;
  groupType?: never;
  subActivities?: never;
};

/** ---------------------------
 * Group: a single row representing multiple class-specific activities
 * - shows badge count (e.g. 6)
 * - expands to reveal children (paged)
 * -------------------------- */
export type ActivityFeedGroupItem = ActivityFeedItemBase & {
  kind: 'group';

  // stable grouping identifiers
  groupType: ActivityGroupKey;
  groupKey: string; // e.g. "class_space:<id>:upcoming" OR "session:<id>"

  // UI state
  isCollapsed?: boolean;

  // badge count shown on the right (e.g. "6")
  // if omitted, FE can fall back to subActivities.totalCount if your ConnectionVM has it
  subActivityCount?: number;

  /**
   * Children (paged). When collapsed you can omit items but still provide total.
   * Example collapsed:
   *   subActivities: { items: [], total: 6 }
   */
  subActivities?: ConnectionVM<ActivityFeedLeafItem>;
};

export type ActivityFeedItem = ActivityFeedLeafItem | ActivityFeedGroupItem;

/** ---------------------------
 * Sections like TODAY / YESTERDAY
 * -------------------------- */
export type ActivityFeedSectionVM = {
  label: string; // "TODAY"
  items: ActivityFeedItem[];
};

/** ---------------------------
 * Entire inbox screen VM
 * -------------------------- */
export type ActivityFeedVM = {
  activeTab: InboxTabKey;

  tabs: Array<{
    key: InboxTabKey;
    label: string;
    badgeCount?: number; // All(11), Classes(7), Payment(1), System(3)
  }>;

  // inbox-style date sections
  sections: ActivityFeedSectionVM[];

  // overall paging (scroll)
  nextCursor?: string | null;

  // optional: unread count for the whole feed
  unreadCount?: number;
};
