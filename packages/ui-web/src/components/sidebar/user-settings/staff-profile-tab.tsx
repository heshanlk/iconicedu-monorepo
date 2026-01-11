import * as React from 'react';
import { Briefcase, Moon } from 'lucide-react';

import type {
  StaffProfileSaveInput,
  StaffProfileVM,
  Weekday,
  WorkingHoursEntry,
  WorkingHoursSchedule,
} from '@iconicedu/shared-types';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Switch } from '../../../ui/switch';
import { UserSettingsTabSection } from './components/user-settings-tab-section';
import { cn } from '../../../lib/utils';

const WORKING_DAYS: ReadonlyArray<{ day: Weekday; label: string }> = [
  { day: 'monday', label: 'Monday' },
  { day: 'tuesday', label: 'Tuesday' },
  { day: 'wednesday', label: 'Wednesday' },
  { day: 'thursday', label: 'Thursday' },
  { day: 'friday', label: 'Friday' },
  { day: 'saturday', label: 'Saturday' },
  { day: 'sunday', label: 'Sunday' },
];

const DEFAULT_FROM = '09:00';
const DEFAULT_TO = '17:00';
const DEFAULT_WEEKDAYS = new Set<Weekday>([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
]);

type WorkingHoursRowState = {
  day: Weekday;
  label: string;
  enabled: boolean;
  from: string;
  to: string;
};

const buildScheduleState = (
  source?: WorkingHoursSchedule | null,
): WorkingHoursRowState[] => {
  const lookup = new Map(source?.map((entry) => [entry.day, entry]));
  return WORKING_DAYS.map(({ day, label }) => {
    const entry = lookup.get(day);
    return {
      day,
      label,
      enabled: entry?.enabled ?? DEFAULT_WEEKDAYS.has(day),
      from: entry?.from ?? DEFAULT_FROM,
      to: entry?.to ?? DEFAULT_TO,
    };
  });
};

const serializeSchedule = (rows: WorkingHoursRowState[]): WorkingHoursEntry[] => {
  return rows.map((row) => ({
    day: row.day,
    enabled: row.enabled,
    from: row.enabled ? row.from : null,
    to: row.enabled ? row.to : null,
  }));
};

type DayRowProps = {
  row: WorkingHoursRowState;
  onToggle: (enabled: boolean) => void;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
};

function DayRow({ row, onToggle, onChangeFrom, onChangeTo }: DayRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-border bg-muted/40 px-3 py-2">
      <div className="flex items-center gap-3 min-w-[140px]">
        <Switch
          checked={row.enabled}
          onCheckedChange={(checked) => onToggle(Boolean(checked))}
          className="data-[state=unchecked]:bg-muted data-[state=checked]:bg-foreground h-7 w-12 rounded-full border border-muted/40"
        />
        <span
          className={cn(
            'text-sm font-medium',
            row.enabled ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {row.label}
        </span>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
            From
          </span>
          {row.enabled ? (
            <Input
              type="time"
              value={row.from}
              onChange={(event) => onChangeFrom(event.target.value)}
              className="h-10 rounded-[18px] border border-transparent bg-muted/70 px-3 text-base font-semibold tracking-wide text-foreground outline-none"
            />
          ) : (
            <div className="flex h-10 items-center justify-between rounded-[18px] border border-muted/40 bg-muted/40 px-3 text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              <Moon className="size-4" />
              Closed
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
            To
          </span>
          {row.enabled ? (
            <Input
              type="time"
              value={row.to}
              onChange={(event) => onChangeTo(event.target.value)}
              className="h-10 rounded-[18px] border border-transparent bg-muted/70 px-3 text-base font-semibold tracking-wide text-foreground outline-none"
            />
          ) : (
            <div className="flex h-10 items-center justify-between rounded-[18px] border border-muted/40 bg-muted/40 px-3 text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              <Moon className="size-4" />
              Closed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type StaffProfileTabProps = {
  staffProfile: StaffProfileVM;
  onSave?: (input: StaffProfileSaveInput) => Promise<void> | void;
};

export function StaffProfileTab({ staffProfile, onSave }: StaffProfileTabProps) {
  const [department, setDepartment] = React.useState(staffProfile.department ?? '');
  const [jobTitle, setJobTitle] = React.useState(staffProfile.jobTitle ?? '');
  const [schedule, setSchedule] = React.useState<WorkingHoursRowState[]>(() =>
    buildScheduleState(staffProfile.workingHoursSchedule),
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const hasExistingSchedule =
    staffProfile.workingHoursSchedule && staffProfile.workingHoursSchedule.length > 0;
  const initialScheduleRef = React.useRef<string>(
    hasExistingSchedule ? JSON.stringify(schedule) : '',
  );
  const initialDepartmentRef = React.useRef(staffProfile.department ?? '');
  const initialJobTitleRef = React.useRef(staffProfile.jobTitle ?? '');

  React.useEffect(() => {
    setDepartment(staffProfile.department ?? '');
    setJobTitle(staffProfile.jobTitle ?? '');
    initialDepartmentRef.current = staffProfile.department ?? '';
    initialJobTitleRef.current = staffProfile.jobTitle ?? '';
    const normalized = buildScheduleState(staffProfile.workingHoursSchedule);
    setSchedule(normalized);
    if (staffProfile.workingHoursSchedule && staffProfile.workingHoursSchedule.length > 0) {
      initialScheduleRef.current = JSON.stringify(normalized);
    } else {
      initialScheduleRef.current = '';
    }
  }, [staffProfile]);

  const summary = React.useMemo(() => {
    const activeRows = schedule.filter((row) => row.enabled);
    if (!activeRows.length) {
      return 'No working hours shared yet';
    }
    return activeRows.map((row) => `${row.label}: ${row.from} – ${row.to}`).join(', ');
  }, [schedule]);

  const isDirty = React.useMemo(() => {
    return (
      department !== initialDepartmentRef.current ||
      jobTitle !== initialJobTitleRef.current ||
      JSON.stringify(schedule) !== initialScheduleRef.current
    );
  }, [department, jobTitle, schedule]);

  const handleSave = React.useCallback(async () => {
    if (!onSave) {
      return;
    }
    setErrorMessage(null);
    setIsSaving(true);
    try {
      await onSave({
        profileId: staffProfile.ids.id,
        orgId: staffProfile.ids.orgId,
        department: department || null,
        jobTitle: jobTitle || null,
        workingHoursSchedule: serializeSchedule(schedule),
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to save staff profile.',
      );
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [onSave, schedule, staffProfile.ids.id, staffProfile.ids.orgId]);

  const updateRow = (day: Weekday, changes: Partial<WorkingHoursRowState>) =>
    setSchedule((current) =>
      current.map((row) => (row.day === day ? { ...row, ...changes } : row)),
    );

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-base font-semibold">Staff profile</h3>
        <p className="text-sm text-muted-foreground">Department and role details.</p>
      </div>
      <UserSettingsTabSection
        title="Department & role"
        icon={<Briefcase className="h-5 w-5" />}
        footer={
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="rounded-full"
            >
              Save
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="staff-department">Department</Label>
            <Input
              id="staff-department"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              placeholder="Customer success"
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="staff-role">Role</Label>
            <Input
              id="staff-role"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              placeholder="Support specialist"
              className="w-full"
            />
          </div>
        </div>
      </UserSettingsTabSection>
      <UserSettingsTabSection
        title="Working hours & availability"
        subtitle={summary}
        icon={<Briefcase className="h-5 w-5" />}
        footer={
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="rounded-full"
            >
              Save
            </Button>
          </div>
        }
        showSeparator={false}
      >
        <div className="space-y-3">
          {schedule.map((row) => (
            <DayRow
              key={row.day}
              row={row}
              onToggle={(enabled) => updateRow(row.day, { enabled })}
              onChangeFrom={(value) => updateRow(row.day, { from: value })}
              onChangeTo={(value) => updateRow(row.day, { to: value })}
            />
          ))}
        </div>
        {errorMessage ? (
          <p className="mt-2 text-xs text-destructive">{errorMessage}</p>
        ) : null}
      </UserSettingsTabSection>
    </div>
  );
}
