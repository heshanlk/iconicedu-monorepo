import * as React from 'react';
import { Briefcase, Check } from 'lucide-react';

import type {
  DayAvailability,
  DayKey,
  StaffProfileSaveInput,
  StaffProfileVM,
  Weekday,
  WorkingHoursEntry,
  WorkingHoursSchedule,
} from '@iconicedu/shared-types';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { UserSettingsTabSection } from './components/user-settings-tab-section';
import { AvailabilityScheduler } from '../../shared/availability-scheduler';
import { DAY_KEYS, EMPTY_DAY_AVAILABILITY } from '@iconicedu/shared-types';

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

const WEEKDAY_TO_DAY_KEY: Record<Weekday, DayKey> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

const DAY_KEY_TO_WEEKDAY = Object.entries(WEEKDAY_TO_DAY_KEY).reduce((acc, [key, value]) => {
  acc[value as DayKey] = key as Weekday;
  return acc;
}, {} as Record<DayKey, Weekday>);

const formatHourLabel = (hour: number) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour.toString().padStart(2, '0')}:00 ${period}`;
};

const buildAvailabilityFromSchedule = (
  schedule?: WorkingHoursSchedule | null,
): DayAvailability => {
  const availability: DayAvailability = { ...EMPTY_DAY_AVAILABILITY };
  schedule?.forEach((entry) => {
    if (!entry.enabled || !entry.from || !entry.to) {
      return;
    }
    const mappedDay = WEEKDAY_TO_DAY_KEY[entry.day];
    if (!mappedDay) {
      return;
    }
    const [fromHourStr] = entry.from.split(':');
    const [toHourStr] = entry.to.split(':');
    const fromHour = Number(fromHourStr);
    const toHour = Number(toHourStr);

    if (Number.isNaN(fromHour) || Number.isNaN(toHour) || toHour <= fromHour) {
      return;
    }

    availability[mappedDay] = Array.from(
      { length: toHour - fromHour },
      (_, index) => fromHour + index,
    );
  });
  return availability;
};

const availabilityToWorkingHours = (availability: DayAvailability): WorkingHoursEntry[] => {
  return DAY_KEYS.map((day) => {
    const hours = availability[day] ?? [];
    if (!hours.length) {
      return { day: DAY_KEY_TO_WEEKDAY[day], enabled: false, from: null, to: null };
    }

    const startHour = Math.min(...hours);
    const endHour = Math.max(...hours) + 1;
    return {
      day: DAY_KEY_TO_WEEKDAY[day],
      enabled: true,
      from: `${startHour.toString().padStart(2, '0')}:00`,
      to: `${Math.min(endHour, 24).toString().padStart(2, '0')}:00`,
    };
  });
};

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
  const [availability, setAvailability] = React.useState<DayAvailability>(() =>
    buildAvailabilityFromSchedule(staffProfile.workingHoursSchedule),
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const initialDepartmentRef = React.useRef(staffProfile.department ?? '');
  const initialJobTitleRef = React.useRef(staffProfile.jobTitle ?? '');
  const initialSpecialtiesRef = React.useRef<string>(
    JSON.stringify(normalizeSpecialties(staffProfile.specialties)),
  );
  const initialAvailabilityRef = React.useRef<string>(
    JSON.stringify(
      buildAvailabilityFromSchedule(staffProfile.workingHoursSchedule),
    ),
  );

  React.useEffect(() => {
    setDepartment(staffProfile.department ?? '');
    setJobTitle(staffProfile.jobTitle ?? '');
    initialDepartmentRef.current = staffProfile.department ?? '';
    initialJobTitleRef.current = staffProfile.jobTitle ?? '';
    const normalizedAvailability = buildAvailabilityFromSchedule(
      staffProfile.workingHoursSchedule,
    );
    setAvailability(normalizedAvailability);
    initialAvailabilityRef.current = JSON.stringify(normalizedAvailability);
    const normalizedSpecialties = normalizeSpecialties(staffProfile.specialties);
    setSpecialties(normalizedSpecialties);
    initialSpecialtiesRef.current = JSON.stringify(normalizedSpecialties);
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

  const toggleSpecialty = React.useCallback((value: string) => {
    setSpecialties((current) =>
      current.includes(value)
        ? current.filter((existing) => existing !== value)
        : [...current, value],
    );
  }, []);

  const summary = React.useMemo(() => {
    const entries = DAY_KEYS.filter((day) => (availability[day] ?? []).length);
    if (!entries.length) {
      return 'No working hours shared yet';
    }
    const formatDayLabel = (key: string) =>
      key[0].toUpperCase() + key.slice(1, 3).toLowerCase();
    return entries
      .map((day) => {
        const dayHours = availability[day] ?? [];
        const start = Math.min(...dayHours);
        const end = Math.max(...dayHours) + 1;
        return `${formatDayLabel(day)}: ${formatHourLabel(start)} – ${formatHourLabel(
          Math.min(end, 24),
        )}`;
      })
      .join(', ');
  }, [availability]);

  const isDirty = React.useMemo(() => {
    return (
      department !== initialDepartmentRef.current ||
      jobTitle !== initialJobTitleRef.current ||
      JSON.stringify(availability) !== initialAvailabilityRef.current ||
      JSON.stringify(specialties) !== initialSpecialtiesRef.current
    );
  }, [department, jobTitle, availability, specialties]);

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
        workingHoursSchedule: availabilityToWorkingHours(availability),
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
    availability,
    specialties,
    staffProfile.ids.id,
    staffProfile.ids.orgId,
  ]);

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-base font-semibold">Staff profile</h3>
        <p className="text-sm text-muted-foreground">Department and role details.</p>
      </div>
      <UserSettingsTabSection
        title="Department & role"
        subtitle={departmentRoleDescription}
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
            <div className="relative w-full rounded-xl border border-transparent">
              <div className="grid gap-2 sm:grid-cols-2">
                {SPECIALTY_OPTIONS.map((option) => {
                  const isSelected = specialties.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleSpecialty(option)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-foreground/60'
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected ? <Check className="h-4 w-4 text-primary" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </UserSettingsTabSection>
      <UserSettingsTabSection
        title="Weekly availability"
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
        <AvailabilityScheduler value={availability} onChange={setAvailability} />
        {errorMessage ? (
          <p className="mt-2 text-xs text-destructive">{errorMessage}</p>
        ) : null}
      </UserSettingsTabSection>
    </div>
  );
}
