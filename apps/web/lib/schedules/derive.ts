import type { ClassScheduleVM } from '@iconicedu/shared-types';

export function getScheduleDurationMinutes(schedule: ClassScheduleVM) {
  const start = new Date(schedule.startAt).getTime();
  const end = new Date(schedule.endAt).getTime();
  return Math.max(0, Math.round((end - start) / 60000));
}
