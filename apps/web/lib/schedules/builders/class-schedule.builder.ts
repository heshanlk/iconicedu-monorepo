import type { ClassScheduleVM } from '@iconicedu/shared-types';

import { baseEvents } from '@iconicedu/web/lib/data/class-schedule-events';

export function getClassScheduleEvents(): ClassScheduleVM[] {
  return baseEvents;
}

export function getClassScheduleById(scheduleId: string): ClassScheduleVM | null {
  return baseEvents.find((event) => event.ids.id === scheduleId) ?? null;
}
