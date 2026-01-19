'use client';

import * as React from 'react';
import {
  CalendarDays,
  Check,
  Clock,
  Moon,
  SlidersHorizontal,
  Sun,
  User,
  Users,
  X,
} from 'lucide-react';

import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Slider } from '../../../ui/slider';
import { Label } from '../../../ui/label';
import { UserSettingsTabSection } from './components/user-settings-tab-section';
import { cn } from '@iconicedu/ui-web/lib/utils';

const CLASS_TYPE_OPTIONS = [
  { value: 'one-one', label: 'One-on-one', icon: User },
  { value: 'small-groups', label: 'Small groups', icon: Users },
] as const;

type ClassTypeOption = (typeof CLASS_TYPE_OPTIONS)[number];
type ClassTypeValue = ClassTypeOption['value'];

const DAYS = [
  { key: 'Mon', label: 'MON' },
  { key: 'Tue', label: 'TUE' },
  { key: 'Wed', label: 'WED' },
  { key: 'Thu', label: 'THU' },
  { key: 'Fri', label: 'FRI' },
  { key: 'Sat', label: 'SAT' },
  { key: 'Sun', label: 'SUN' },
] as const;

type DayKey = (typeof DAYS)[number]['key'];
export type DayAvailability = Record<DayKey, number[]>;

const MORNING_HOURS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const AFTERNOON_HOURS = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

const DEFAULT_AVAILABILITY: DayAvailability = {
  Mon: [9, 10, 11, 14, 15, 16],
  Tue: [9, 10, 11, 14, 15, 16],
  Wed: [14, 15, 16],
  Thu: [9, 10, 11],
  Fri: [14, 15, 16, 17],
  Sat: [],
  Sun: [],
};

interface CommitmentSegment {
  label: 'Light' | 'Moderate' | 'Substantial' | 'Full-time';
  min: number;
  max: number;
  trackClass: string;
  textClass: string;
}

const COMMITMENT_SEGMENTS: CommitmentSegment[] = [
  {
    label: 'Light',
    min: 0,
    max: 10,
    trackClass: 'bg-green-500',
    textClass: 'text-green-500',
  },
  {
    label: 'Moderate',
    min: 10,
    max: 20,
    trackClass: 'bg-blue-500',
    textClass: 'text-blue-500',
  },
  {
    label: 'Substantial',
    min: 20,
    max: 30,
    trackClass: 'bg-amber-500',
    textClass: 'text-amber-500',
  },
  {
    label: 'Full-time',
    min: 30,
    max: 40,
    trackClass: 'bg-red-500',
    textClass: 'text-red-500',
  },
];

type AvailabilitySchedulerProps = {
  value?: DayAvailability;
  onChange?: (value: DayAvailability) => void;
};

function AvailabilityScheduler({ value, onChange }: AvailabilitySchedulerProps) {
  const [selectedDay, setSelectedDay] = React.useState<DayKey>('Mon');
  const [availability, setAvailability] = React.useState<DayAvailability>(
    value ?? DEFAULT_AVAILABILITY,
  );

  React.useEffect(() => {
    setAvailability(value ?? DEFAULT_AVAILABILITY);
  }, [value]);

  const updateAvailability = React.useCallback(
    (next: DayAvailability) => {
      setAvailability(next);
      onChange?.(next);
    },
    [onChange],
  );

  const toggleHour = React.useCallback(
    (hour: number) => {
      const dayHours = availability[selectedDay] ?? [];
      const nextHours = dayHours.includes(hour)
        ? dayHours.filter((item) => item !== hour)
        : [...dayHours, hour].sort((a, b) => a - b);
      updateAvailability({
        ...availability,
        [selectedDay]: nextHours,
      });
    },
    [availability, selectedDay, updateAvailability],
  );

  const isHourSelected = React.useCallback(
    (hour: number) => availability[selectedDay]?.includes(hour) ?? false,
    [availability, selectedDay],
  );

  const getDayIndicator = React.useCallback(
    (day: DayKey) => {
      const hours = availability[day] ?? [];
      const morningCount = hours.filter((hour) => hour < 12).length;
      const afternoonCount = hours.filter((hour) => hour >= 12).length;
      return { morning: morningCount, afternoon: afternoonCount };
    },
    [availability],
  );

  const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-1 sm:gap-2">
        {DAYS.map(({ key, label }) => {
          const indicator = getDayIndicator(key);
          const isSelected = selectedDay === key;
          const hasAvailability = indicator.morning > 0 || indicator.afternoon > 0;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedDay(key)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg transition-colors',
                isSelected ? 'bg-muted' : 'hover:bg-muted/50',
              )}
            >
              <span
                className={cn(
                  'text-xs sm:text-sm font-medium',
                  isSelected ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
              <div className="flex gap-0.5 h-4 items-end">
                <div
                  className={cn(
                    'w-1.5 sm:w-2 rounded-sm transition-all',
                    hasAvailability ? 'bg-primary/60' : 'bg-muted-foreground/20',
                  )}
                  style={{
                    height:
                      indicator.morning > 0
                        ? `${Math.min(4 + indicator.morning * 1.5, 16)}px`
                        : '4px',
                  }}
                />
                <div
                  className={cn(
                    'w-1.5 sm:w-2 rounded-sm transition-all',
                    hasAvailability ? 'bg-primary/40' : 'bg-muted-foreground/20',
                  )}
                  style={{
                    height:
                      indicator.afternoon > 0
                        ? `${Math.min(4 + indicator.afternoon * 1.5, 16)}px`
                        : '4px',
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Sun className="size-4" />
          <span className="font-medium">Morning</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {MORNING_HOURS.map((hour) => {
            const selected = isHourSelected(hour);
            return (
              <Button
                key={`morning-${hour}`}
                size="sm"
                variant={selected ? 'default' : 'ghost'}
                className={cn(
                  'h-9 text-sm font-normal rounded-full transition-all',
                  selected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => toggleHour(hour)}
              >
                {formatHour(hour)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Moon className="size-4" />
          <span className="font-medium">Afternoon/Evening</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {AFTERNOON_HOURS.map((hour) => {
            const selected = isHourSelected(hour);
            return (
              <Button
                key={`afternoon-${hour}`}
                size="sm"
                variant={selected ? 'default' : 'ghost'}
                className={cn(
                  'h-9 text-sm font-normal rounded-full transition-all',
                  selected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => toggleHour(hour)}
              >
                {formatHour(hour)}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export type EducatorAvailabilityInput = {
  classTypes: Array<ClassTypeValue>;
  weeklyCommitment: number;
  availability: DayAvailability;
};

type EducatorAvailabilityTabProps = {
  initialClassTypes?: EducatorAvailabilityInput['classTypes'];
  initialWeeklyCommitment?: number;
  initialAvailability?: DayAvailability;
  onSave?: (input: EducatorAvailabilityInput) => Promise<void> | void;
};

export function EducatorAvailabilityTab({
  initialClassTypes,
  initialWeeklyCommitment = 10,
  initialAvailability,
  onSave,
}: EducatorAvailabilityTabProps) {
  const [selectedClassTypes, setSelectedClassTypes] = React.useState<
    Array<ClassTypeValue>
  >(initialClassTypes ?? []);
  const [weeklyCommitment, setWeeklyCommitment] = React.useState(initialWeeklyCommitment);
  const [availability, setAvailability] = React.useState<DayAvailability>(
    initialAvailability ?? DEFAULT_AVAILABILITY,
  );
  const [isSaving, setIsSaving] = React.useState(false);

  const toggleClassType = React.useCallback((value: ClassTypeValue) => {
    setSelectedClassTypes((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  }, []);

  const handleSave = React.useCallback(async () => {
    if (!onSave) {
      return;
    }
    setIsSaving(true);
    try {
      await onSave({
        classTypes: selectedClassTypes,
        weeklyCommitment,
        availability,
      });
    } finally {
      setIsSaving(false);
    }
  }, [availability, onSave, selectedClassTypes, weeklyCommitment]);

  const handleWeeklyChange = React.useCallback((values: number[]) => {
    const nextValue = values[0] ?? 0;
    setWeeklyCommitment(nextValue);
  }, []);

  const handleWeeklyInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = Number(event.target.value);
      if (Number.isNaN(parsed)) {
        return;
      }
      setWeeklyCommitment(Math.min(Math.max(parsed, 0), 40));
    },
    [],
  );

  const activeCommitmentSegment = React.useMemo(() => {
    return (
      COMMITMENT_SEGMENTS.find((segment) => weeklyCommitment <= segment.max) ??
      COMMITMENT_SEGMENTS[COMMITMENT_SEGMENTS.length - 1]
    );
  }, [weeklyCommitment]);

  const getSegmentFillPercent = React.useCallback(
    (segment: CommitmentSegment) => {
      if (weeklyCommitment <= segment.min) {
        return 0;
      }
      if (weeklyCommitment >= segment.max) {
        return 100;
      }
      return ((weeklyCommitment - segment.min) / (segment.max - segment.min)) * 100;
    },
    [weeklyCommitment],
  );

  const classPreferencesSubtitle = React.useMemo(() => {
    const classSummary =
      selectedClassTypes
        .map(
          (value) =>
            CLASS_TYPE_OPTIONS.find((option) => option.value === value)?.label,
        )
        .filter(Boolean)
        .join(', ') || 'Class types not set';
    return `${classSummary} · ${weeklyCommitment} hrs/week`;
  }, [selectedClassTypes, weeklyCommitment]);

  return (
    <div className="space-y-4">
      <UserSettingsTabSection
        title="Class preferences"
        subtitle={classPreferencesSubtitle}
        icon={<SlidersHorizontal className="h-5 w-5" />}
        defaultOpen
        footer={
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!onSave || isSaving}
              className="relative z-10"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Preferred class types</Label>
            <div className="flex flex-wrap gap-2">
              {selectedClassTypes.map((value) => {
                const option = CLASS_TYPE_OPTIONS.find((entry) => entry.value === value);
                if (!option) {
                  return null;
                }

                const Icon = option.icon;
                return (
                  <span
                    key={value}
                    className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium"
                  >
                    <Icon className="size-3 text-muted-foreground" />
                    <span>{option.label}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedClassTypes((prev) =>
                          prev.filter((entry) => entry !== value),
                        )
                      }
                      aria-label={`Remove ${option.label}`}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CLASS_TYPE_OPTIONS.map((option) => {
                const isSelected = selectedClassTypes.includes(option.value);
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleClassType(option.value)}
                    className={cn(
                      'flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition',
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-foreground/60',
                    )}
                    aria-pressed={isSelected}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="size-4" />
                      {option.label}
                    </span>
                    {isSelected ? <Check className="size-3" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">Weekly commitment</h4>
              <span className="text-xs text-muted-foreground">
                1 - 40 hours available
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Slider
                  id="weekly-commitment"
                  value={[weeklyCommitment]}
                  min={0}
                  max={40}
                  step={1}
                  onValueChange={handleWeeklyChange}
                  className="h-3 rounded-full"
                />
              </div>
              <div className="flex items-center gap-1">
                <Input
                  id="weekly-commitment-input"
                  type="number"
                  min={0}
                  max={40}
                  value={weeklyCommitment}
                  onChange={handleWeeklyInputChange}
                  className="w-20 text-center"
                />
                <span className="text-xs text-muted-foreground">hrs/week</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                <span className={cn('font-semibold', activeCommitmentSegment.textClass)}>
                  {activeCommitmentSegment.label}
                </span>{' '}
                commitment
              </span>
              <span className="text-muted-foreground">{weeklyCommitment} hrs/week</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wide">
                {COMMITMENT_SEGMENTS.map((segment) => (
                  <span
                    key={segment.label}
                    className={cn(
                      'flex-1 text-center font-semibold',
                      activeCommitmentSegment.label === segment.label
                        ? segment.textClass
                        : 'text-muted-foreground',
                    )}
                  >
                    {segment.label}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {COMMITMENT_SEGMENTS.map((segment) => (
                  <div
                    key={segment.label}
                    className="flex-1 h-1 rounded-full bg-muted-foreground/30 overflow-hidden"
                  >
                    <div
                      className={cn('h-full', segment.trackClass)}
                      style={{ width: `${getSegmentFillPercent(segment)}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </UserSettingsTabSection>
      <UserSettingsTabSection
        title="Weekly availability"
        subtitle="Map the time blocks you can teach"
        icon={<CalendarDays className="h-5 w-5" />}
        footer={
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSave} disabled={!onSave || isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>Pick specific hours per day</span>
          </div>
          <AvailabilityScheduler value={availability} onChange={setAvailability} />
        </div>
      </UserSettingsTabSection>
    </div>
  );
}
