import type { IANATimezone, ISODateTime, UUID } from './shared';

export type WeekdayVM = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';
export type CalendarViewVM = 'week' | 'day' | 'month' | 'agenda';

export type CalendarVisibilityVM =
  | 'private'
  | 'internal'
  | 'class-members'
  | 'public';
export type CalendarColorTokenVM =
  | 'blue'
  | 'pink'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'purple'
  | 'gray';

export type ParticipantRoleVM =
  | 'educator'
  | 'child'
  | 'guardian'
  | 'staff'
  | 'observer';

export type ParticipationStatusVM = 'invited' | 'accepted' | 'declined' | 'tentative';

export interface CalendarParticipantVM {
  userId: UUID;
  role: ParticipantRoleVM;
  status?: ParticipationStatusVM;
  displayName?: string;
  avatarUrl?: string | null;
}

export type EventSourceVM =
  | { kind: 'class_session'; classSpaceId: UUID; sessionId?: UUID; channelId?: UUID }
  | { kind: 'availability_block'; ownerUserId: UUID }
  | { kind: 'manual'; createdByUserId: UUID };

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

export interface RecurrenceOverrideVM {
  occurrenceKey: ISODateTime;
  patch: Partial<
    Pick<
      CalendarEventVM,
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

export interface CalendarEventVM {
  id: UUID;
  title: string;
  startAt: ISODateTime;
  endAt: ISODateTime;
  timezone?: IANATimezone;
  status: EventStatusVM;
  description?: string | null;
  location?: string | null;
  visibility: CalendarVisibilityVM;
  color?: CalendarColorTokenVM;
  participants: CalendarParticipantVM[];
  source: EventSourceVM;
  recurrence?: RecurrenceVM;
  audit: EventAuditInfoVM;
}
