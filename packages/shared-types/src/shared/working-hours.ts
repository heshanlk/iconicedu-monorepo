export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type WorkingHoursEntry = Readonly<{
  day: Weekday;
  enabled: boolean;
  from?: string | null;
  to?: string | null;
}>;

export type WorkingHoursSchedule = ReadonlyArray<WorkingHoursEntry>;
