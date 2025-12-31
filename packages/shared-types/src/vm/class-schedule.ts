import type { IANATimezone, ISODateTime, UUID } from './shared';

export type WeekdayVM = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';
export type ClassScheduleViewVM = 'week' | 'day' | 'month' | 'agenda';

export type ClassScheduleVisibilityVM =
  | 'private'
  | 'internal'
  | 'class-members'
  | 'public';

export type ClassScheduleColorTokenVM =
  | 'blue'
  | 'pink'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'purple'
  | 'gray';

export type ParticipantRoleVM = 'educator' | 'child' | 'guardian' | 'staff' | 'observer';

export type ParticipationStatusVM = 'invited' | 'accepted' | 'declined' | 'tentative';

export interface ClassScheduleParticipantVM {
  userId: UUID;
  role: ParticipantRoleVM;
  status?: ParticipationStatusVM;
  displayName?: string;
  avatarUrl?: string | null;
}

/**
 * ✅ CHANGE: keep schedule independent from messaging
 * - removed channelId
 * - added optional relatedTo for manual events
 */
export type EventSourceVM =
  | { kind: 'class_session'; classSpaceId: UUID; sessionId?: UUID }
  | { kind: 'availability_block'; ownerUserId: UUID }
  | {
      kind: 'manual';
      createdByUserId: UUID;
      relatedTo?: { kind: 'class_space'; id: UUID };
    };

export type EventStatusVM = 'scheduled' | 'cancelled' | 'completed' | 'rescheduled';

export interface EventAuditInfoVM {
  createdAt: ISODateTime;
  createdBy: UUID;
  updatedAt?: ISODateTime;
  updatedBy?: UUID;
  cancelledAt?: ISODateTime;
  cancelledBy?: UUID;
  cancelReason?: 'guardian' | 'educator' | 'staff' | 'no_show' | 'holiday' | 'other';
  cancelNote?: string | null;

  // optional if you plan soft delete later
  deletedAt?: ISODateTime;
  deletedBy?: UUID;
}

export type RecurrenceFrequencyVM = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurrenceRuleVM {
  frequency: RecurrenceFrequencyVM;
  interval?: number;
  byWeekday?: WeekdayVM[];
  count?: number;
  until?: ISODateTime;
  timezone?: IANATimezone;
}

/**
 * ✅ CHANGE: explicit patch type (safer than Pick<ClassScheduleVM,...> directly)
 */
export type ClassSchedulePatchVM = Partial<
  Pick<
    ClassScheduleVM,
    | 'title'
    | 'description'
    | 'location'
    | 'startAt'
    | 'endAt'
    | 'status'
    | 'participants'
    | 'color'
    | 'visibility'
    | 'source'
  >
>;

export interface RecurrenceOverrideVM {
  occurrenceKey: ISODateTime;
  patch: ClassSchedulePatchVM;
}

export interface RecurrenceExceptionVM {
  occurrenceKey: ISODateTime;
  reason?: string;
}

export interface RecurrenceVM {
  rule: RecurrenceRuleVM;
  seriesId: UUID;
  exceptions?: RecurrenceExceptionVM[];
  overrides?: RecurrenceOverrideVM[];
}

/**
 * ✅ CHANGE: orgId + allDay/busy + optional participantIds convenience
 */
export interface ClassScheduleVM {
  id: UUID;
  orgId: UUID; // ✅ CHANGE

  title: string;
  startAt: ISODateTime;
  endAt: ISODateTime;
  timezone?: IANATimezone;

  status: EventStatusVM;
  description?: string | null;
  location?: string | null;

  visibility: ClassScheduleVisibilityVM;
  color?: ClassScheduleColorTokenVM;

  participants: ClassScheduleParticipantVM[];

  source: EventSourceVM;
  recurrence?: RecurrenceVM;
  audit: EventAuditInfoVM;
}
