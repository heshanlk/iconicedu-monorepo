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
 * ✅ Event source (kept schedule independent from messaging)
 */
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

  // optional soft delete
  deletedAt?: ISODateTime;
  deletedBy?: UUID;
}

export type RecurrenceFrequencyVM = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * ✅ Recurrence rule, evaluated in timezone (DST-safe)
 * NOTE: startAt/endAt should be stored as UTC ISO strings in DB,
 * while timezone/tzid tells you how to expand recurrences.
 */
export interface RecurrenceRuleVM {
  frequency: RecurrenceFrequencyVM;
  interval?: number;
  byWeekday?: WeekdayVM[];
  count?: number;
  until?: ISODateTime;
  timezone?: IANATimezone;
}

/**
 * ✅ Patch type for overrides (safe & stable)
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
    | 'timezone'
  >
>;

/**
 * ✅ OccurrenceKey semantics (IMPORTANT):
 * Always the ORIGINAL instance start datetime (UTC) produced by the rule,
 * even if an override moves startAt/endAt.
 */
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

/**
 * ✅ Schedule master (one-off event OR recurring series master)
 * DB equivalent: schedule_event (+ schedule_event_recurrence optional)
 */
export interface ClassScheduleVM {
  id: UUID;
  orgId: UUID;

  title: string;

  /** UTC ISO string in storage; displayed in `timezone` */
  startAt: ISODateTime;
  endAt: ISODateTime;

  /** tz for display and recurrence evaluation */
  timezone?: IANATimezone;

  status: EventStatusVM;
  description?: string | null;
  location?: string | null;

  visibility: ClassScheduleVisibilityVM;
  color?: ClassScheduleColorTokenVM;

  participants: ClassScheduleParticipantVM[];

  source: EventSourceVM;

  /** present when recurring */
  recurrence?: RecurrenceVM;

  audit: EventAuditInfoVM;
}

/**
 * ✅ Durable instance identity (Google-style: eventId + recurrenceId/occurrenceKey)
 * Use this key to upsert a materialized instance row in DB when needed (attendance, notes, billing, etc.)
 */
export interface EventInstanceKeyVM {
  eventId: UUID; // schedule master id
  occurrenceKey: ISODateTime; // original startAt for that occurrence (UTC)
}

/**
 * ✅ Materialized/virtual occurrence returned to UI
 * - If `id` exists => persisted in DB (schedule_event_instance)
 * - If `id` is missing => computed on the fly from rule + overrides for the requested range
 */
export interface ClassScheduleInstanceVM {
  /** DB id if materialized; optional for computed instances */
  id?: UUID;

  key: EventInstanceKeyVM;

  /** Actual time after overrides (UTC ISO strings) */
  startAt: ISODateTime;
  endAt: ISODateTime;

  /** Local timezone context */
  timezone?: IANATimezone;

  /** Status after overrides */
  status: EventStatusVM;

  /** convenience */
  isCancelled?: boolean;

  /** Denormalized display fields (after override patch) */
  title: string;
  description?: string | null;
  location?: string | null;
  visibility: ClassScheduleVisibilityVM;
  color?: ClassScheduleColorTokenVM;
  participants: ClassScheduleParticipantVM[];
  source: EventSourceVM;
}
