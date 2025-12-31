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


export type EventSourceVM =
  | { kind: 'class_session'; learningSpaceId: UUID; sessionId?: UUID }
  | { kind: 'availability_block'; ownerUserId: UUID }
  | {
      kind: 'manual';
      createdByUserId: UUID;
      relatedTo?: { kind: 'learning_space'; id: UUID };
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
    | 'timezone'
  >
>;


export interface RecurrenceOverrideVM {
  occurrenceKey: ISODateTime; // original instance start (UTC)
  patch: ClassSchedulePatchVM;
}

export interface RecurrenceExceptionVM {
  occurrenceKey: ISODateTime; // original instance start (UTC)
  reason?: string;
}

export interface RecurrenceVM {
  seriesId: UUID; // stable id for the series (like Google Calendar recurring series)
  rule: RecurrenceRuleVM;
  exceptions?: RecurrenceExceptionVM[];
  overrides?: RecurrenceOverrideVM[];
}


export interface ClassScheduleVM {
  id: UUID;
  orgId: UUID;

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


export interface EventInstanceKeyVM {
  eventId: UUID; // schedule master id
  occurrenceKey: ISODateTime; // original startAt for that occurrence (UTC)
}


export interface ClassScheduleInstanceVM {
  
  id?: UUID;

  key: EventInstanceKeyVM;

  
  startAt: ISODateTime;
  endAt: ISODateTime;

  
  timezone?: IANATimezone;

  
  status: EventStatusVM;

  
  isCancelled?: boolean;

  
  title: string;
  description?: string | null;
  location?: string | null;
  visibility: ClassScheduleVisibilityVM;
  color?: ClassScheduleColorTokenVM;
  participants: ClassScheduleParticipantVM[];
  source: EventSourceVM;
}
