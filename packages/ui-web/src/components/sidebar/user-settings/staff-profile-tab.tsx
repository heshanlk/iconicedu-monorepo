import * as React from 'react';
import { Briefcase, Moon, X } from 'lucide-react';

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
import { Item, ItemContent, ItemHeader } from '../../../ui/item';
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
const DEFAULT_TO = '17:30';
const DEFAULT_WEEKDAYS = new Set<Weekday>([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
]);

const SPECIALTY_OPTIONS = [
  'Scheduling',
  'Billing',
  'Onboarding',
  'Customer success',
  'Curriculum design',
  'Operations',
  'Mentorship',
  'Technical support',
  'Program management',
];

const normalizeSpecialties = (values?: string[] | null) =>
  Array.from(new Set((values ?? []).map((value) => value.trim()).filter(Boolean)));

const formatTimeLabel = (value: string) => {
  const [hourString, minuteString] = value.split(':');
  const hour = Number(hourString);
  const minute = Number(minuteString);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour.toString().padStart(2, '0')}:${minuteString} ${period}`;
};

const TIME_OPTIONS = Array.from({ length: 24 * 2 }, (_, index) => {
  const totalMinutes = index * 30;
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const value = `${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}`;
  return { value, label: formatTimeLabel(value) };
});

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
    <Item
      size="sm"
      variant="default"
      className="gap-3 bg-transparent px-3 py-3 shadow-none"
    >
      <ItemHeader className="gap-3 px-0">
        <div className="flex items-center gap-3">
          <Switch
            size="sm"
            checked={row.enabled}
            onCheckedChange={(checked) => onToggle(Boolean(checked))}
            className="data-[state=checked]:bg-gradient-to-r data-[state=unchecked]:bg-muted h-5 w-9 rounded-full border border-muted/40 shadow-sm"
          />
          <span
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.08em]',
              row.enabled ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {row.label}
          </span>
        </div>
      </ItemHeader>
      <ItemContent className="px-0 pt-0">
        <div className="grid w-full grid-cols-[1fr_1fr] gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              From
            </span>
            {row.enabled ? (
              <Input
                type="time"
                value={row.from}
                step={1800}
                className="h-9 text-xs"
                onChange={(event) => onChangeFrom(event.target.value)}
              />
            ) : (
              <div className="flex h-10 items-center gap-2 rounded-[14px] border border-muted/40 bg-muted/50 px-4 text-sm font-semibold text-muted-foreground">
                <Moon className="h-4 w-4" />
                Offline
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              To
            </span>
            {row.enabled ? (
              <Input
                type="time"
                value={row.to}
                step={1800}
                className="h-9 text-xs"
                onChange={(event) => onChangeTo(event.target.value)}
              />
            ) : (
              <div className="flex h-10 items-center gap-2 rounded-[14px] border border-muted/40 bg-muted/50 px-4 text-sm font-semibold text-muted-foreground">
                <Moon className="h-4 w-4" />
                Offline
              </div>
            )}
          </div>
        </div>
      </ItemContent>
    </Item>
  );
}

type StaffProfileTabProps = {
  staffProfile: StaffProfileVM;
  onSave?: (input: StaffProfileSaveInput) => Promise<void> | void;
};

export function StaffProfileTab({ staffProfile, onSave }: StaffProfileTabProps) {
  const [department, setDepartment] = React.useState(staffProfile.department ?? '');
  const [jobTitle, setJobTitle] = React.useState(staffProfile.jobTitle ?? '');
  const [specialties, setSpecialties] = React.useState<string[]>(() =>
    normalizeSpecialties(staffProfile.specialties),
  );
  const [specialtyInput, setSpecialtyInput] = React.useState('');
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
  const initialSpecialtiesRef = React.useRef<string>(
    JSON.stringify(normalizeSpecialties(staffProfile.specialties)),
  );

  React.useEffect(() => {
    setDepartment(staffProfile.department ?? '');
    setJobTitle(staffProfile.jobTitle ?? '');
    initialDepartmentRef.current = staffProfile.department ?? '';
    initialJobTitleRef.current = staffProfile.jobTitle ?? '';
    const normalized = buildScheduleState(staffProfile.workingHoursSchedule);
    setSchedule(normalized);
    if (
      staffProfile.workingHoursSchedule &&
      staffProfile.workingHoursSchedule.length > 0
    ) {
      initialScheduleRef.current = JSON.stringify(normalized);
    } else {
      initialScheduleRef.current = '';
    }
    const normalizedSpecialties = normalizeSpecialties(staffProfile.specialties);
    setSpecialties(normalizedSpecialties);
    initialSpecialtiesRef.current = JSON.stringify(normalizedSpecialties);
    setSpecialtyInput('');
  }, [staffProfile]);

  const departmentRoleDescription = React.useMemo(() => {
    if (!department && !jobTitle) {
      return 'Select a department and job title so people know your focus.';
    }
    if (department && jobTitle) {
      return `Department: ${department}. Role: ${jobTitle}.`;
    }
    if (department) {
      return `Department: ${department}.`;
    }
    return `Role: ${jobTitle}.`;
  }, [department, jobTitle]);

  const specialtySuggestions = React.useMemo(
    () => SPECIALTY_OPTIONS.filter((option) => !specialties.includes(option)),
    [specialties],
  );

  const addSpecialty = React.useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    setSpecialties((current) =>
      current.includes(trimmed) ? current : [...current, trimmed],
    );
    setSpecialtyInput('');
  }, []);

  const removeSpecialty = React.useCallback((value: string) => {
    setSpecialties((current) => current.filter((item) => item !== value));
  }, []);

  const handleSpecialtyKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addSpecialty(specialtyInput);
      }
    },
    [addSpecialty, specialtyInput],
  );

  const summary = React.useMemo(() => {
    const activeRows = schedule.filter((row) => row.enabled);
    if (!activeRows.length) {
      return 'No working hours shared yet';
    }
    return activeRows
      .map(
        (row) =>
          `${row.label}: ${formatTimeLabel(row.from)} – ${formatTimeLabel(row.to)}`,
      )
      .join(', ');
  }, [schedule]);

  const isDirty = React.useMemo(() => {
    return (
      department !== initialDepartmentRef.current ||
      jobTitle !== initialJobTitleRef.current ||
      JSON.stringify(schedule) !== initialScheduleRef.current ||
      JSON.stringify(specialties) !== initialSpecialtiesRef.current
    );
  }, [department, jobTitle, schedule, specialties]);

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
        specialties: specialties.length ? specialties : null,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to save staff profile.',
      );
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [
    onSave,
    department,
    jobTitle,
    schedule,
    specialties,
    staffProfile.ids.id,
    staffProfile.ids.orgId,
  ]);

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
            <Label htmlFor="staff-job-title">Job title</Label>
            <Input
              id="staff-job-title"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              placeholder="Support specialist"
              className="w-full"
            />
          </div>
          <p className="text-xs text-muted-foreground">{departmentRoleDescription}</p>
          <div className="flex flex-col gap-3">
            <Label htmlFor="staff-specialties">Specialties</Label>
            <div className="flex flex-wrap gap-2">
              {specialties.map((value) => (
                <span
                  key={value}
                  className="flex items-center gap-1 rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {value}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(value)}
                    className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {!specialties.length && (
                <span className="text-xs text-muted-foreground">
                  Add specialties to describe your focus
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="staff-specialties"
                value={specialtyInput}
                onChange={(event) => setSpecialtyInput(event.target.value)}
                onKeyDown={handleSpecialtyKeyDown}
                placeholder="Add specialties"
                className="w-full"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSpecialty(specialtyInput)}
                className="rounded-full"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {specialtySuggestions.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  size="xs"
                  className="rounded-full"
                  onClick={() => addSpecialty(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
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
