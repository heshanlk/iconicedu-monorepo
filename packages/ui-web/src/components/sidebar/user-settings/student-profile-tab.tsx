import * as React from 'react';
import { BookOpen, Lightbulb, SlidersHorizontal, Users, User } from 'lucide-react';

import type {
  ChildProfileVM,
  ChildProfileSaveInput,
  GradeLevel,
} from '@iconicedu/shared-types';
import {
  gradeLabel,
  normalizeCountryCode,
  optionsForCountry,
} from '@iconicedu/shared-types';
import { Button } from '@iconicedu/ui-web/ui/button';
import { BorderBeam } from '@iconicedu/ui-web/ui/border-beam';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@iconicedu/ui-web/ui/collapsible';
import { Input } from '@iconicedu/ui-web/ui/input';
import { Label } from '@iconicedu/ui-web/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@iconicedu/ui-web/ui/select';
import { Separator } from '@iconicedu/ui-web/ui/separator';
import { Checkbox } from '@iconicedu/ui-web/ui/checkbox';
import { ChevronIcon } from '@iconicedu/ui-web/components/sidebar/user-settings/components/chevron-icon';
import { useSequentialHighlight } from '@iconicedu/ui-web/components/sidebar/user-settings/hooks/use-sequential-highlight';

export const BIRTH_YEAR_OPTIONS = (() => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 3;
  const endYear = startYear - 25;
  const years: number[] = [];
  for (let year = startYear; year >= endYear; year -= 1) {
    years.push(year);
  }
  return years;
})();
const INTEREST_OPTIONS = [
  'STEM & science',
  'Creative arts',
  'Coding & robotics',
  'Math challenges',
  'Reading & literature',
  'Writing & storytelling',
  'Outdoor discovery',
  'Music & performance',
  'History & culture',
];
const STRENGTH_OPTIONS = [
  'Problem solving',
  'Creativity',
  'Empathy',
  'Collaboration',
  'Curiosity',
  'Communication',
  'Focus',
  'Leadership',
];
const LEARNING_PREFERENCES_OPTIONS = [
  'Hands-on learning',
  'Project-based',
  'Independent study',
  'Guided instruction',
  'Visual aids',
  'Story-driven lessons',
  'Game-based challenges',
];
const MOTIVATION_STYLE_OPTIONS = [
  'Goal-oriented',
  'Rewards & recognition',
  'Collaborative energy',
  'Friendly competition',
  'Personal mastery',
  'Positive reinforcement',
];
const COMMUNICATION_STYLE_OPTIONS = [
  'Reflective',
  'Chatty',
  'Direct',
  'Questions-oriented',
  'Storyteller',
  'Analytical',
];
const CONFIDENCE_LEVEL_OPTIONS = ['Low', 'Medium', 'High'];

type StudentProfileTabProps = {
  childProfile: ChildProfileVM;
  fallbackCountryCode?: string | null;
  onChildProfileSave?: (input: ChildProfileSaveInput) => Promise<void> | void;
  onboardingRequired?: boolean;
};

const resolveGradeSelection = (profile: ChildProfileVM): GradeLevel | '' =>
  profile.gradeLevel ?? '';

export function StudentProfileTab({
  childProfile,
  fallbackCountryCode,
  onChildProfileSave,
  onboardingRequired = false,
}: StudentProfileTabProps) {
  const studentCountryCode = React.useMemo(
    () => normalizeCountryCode(childProfile.location?.countryCode ?? fallbackCountryCode),
    [childProfile.location?.countryCode, fallbackCountryCode],
  );
  const gradeOptions = React.useMemo(
    () => optionsForCountry(studentCountryCode),
    [studentCountryCode],
  );
  const [gradeSelection, setGradeSelection] = React.useState<GradeLevel | ''>(
    resolveGradeSelection(childProfile),
  );
  const [birthYearSelection, setBirthYearSelection] = React.useState(
    childProfile.birthYear != null ? String(childProfile.birthYear) : '',
  );
  const [schoolNameValue, setSchoolNameValue] = React.useState(
    childProfile.schoolName ?? '',
  );
  const [schoolYearValue, setSchoolYearValue] = React.useState(
    childProfile.schoolYear ?? '',
  );
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>(
    childProfile.interests ?? [],
  );
  const [selectedStrengths, setSelectedStrengths] = React.useState<string[]>(
    childProfile.strengths ?? [],
  );
  const [selectedLearningPreferences, setSelectedLearningPreferences] = React.useState<
    string[]
  >(childProfile.learningPreferences ?? []);
  const [selectedMotivationStyles, setSelectedMotivationStyles] = React.useState<
    string[]
  >(childProfile.motivationStyles ?? []);
  const [selectedCommunicationStyles, setSelectedCommunicationStyles] = React.useState<
    string[]
  >(childProfile.communicationStyles ?? []);
  const [selectedConfidenceLevel, setSelectedConfidenceLevel] = React.useState<string>(
    childProfile.confidenceLevel ?? '',
  );
  const [childProfileError, setChildProfileError] = React.useState<string | null>(null);
  const [isSavingChildProfile, setIsSavingChildProfile] = React.useState(false);
  const [basicInfoOpen, setBasicInfoOpen] = React.useState(onboardingRequired);
  const isBasicInfoComplete = Boolean(gradeSelection && birthYearSelection);
  const otherSectionsDisabled = onboardingRequired && !isBasicInfoComplete;
  React.useEffect(() => {
    if (onboardingRequired && !isBasicInfoComplete) {
      setBasicInfoOpen(true);
    }
  }, [onboardingRequired, isBasicInfoComplete]);

  const toggleSelection = React.useCallback(
    (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
      setter((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
      );
    },
    [],
  );

  const isSaveDisabled = isSavingChildProfile || !gradeSelection || !birthYearSelection;

  const handleBasicInfoOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (onboardingRequired && !isBasicInfoComplete && !nextOpen) {
        return;
      }
      setBasicInfoOpen(nextOpen);
    },
    [onboardingRequired, isBasicInfoComplete],
  );

  const sequentialHighlight = useSequentialHighlight<'grade' | 'birthYear'>({
    order: ['grade', 'birthYear'],
    satisfied: {
      grade: Boolean(gradeSelection),
      birthYear: Boolean(birthYearSelection),
    },
    enabled: onboardingRequired,
  });
  const showGradeBeam = sequentialHighlight.isActive('grade');
  const showBirthYearBeam = sequentialHighlight.isActive('birthYear');
  const showSaveActionBeam =
    onboardingRequired &&
    Boolean(gradeSelection && birthYearSelection && !isSavingChildProfile);

  React.useEffect(() => {
    setGradeSelection(resolveGradeSelection(childProfile));
    setBirthYearSelection(
      childProfile.birthYear != null ? String(childProfile.birthYear) : '',
    );
    setSchoolNameValue(childProfile.schoolName ?? '');
    setSchoolYearValue(childProfile.schoolYear ?? '');
    setSelectedInterests(childProfile.interests ?? []);
    setSelectedStrengths(childProfile.strengths ?? []);
    setSelectedLearningPreferences(childProfile.learningPreferences ?? []);
    setSelectedMotivationStyles(childProfile.motivationStyles ?? []);
    setSelectedCommunicationStyles(childProfile.communicationStyles ?? []);
    setSelectedConfidenceLevel(childProfile.confidenceLevel ?? '');
  }, [childProfile]);

  const handleChildProfileSave = React.useCallback(async () => {
    if (!onChildProfileSave) {
      return;
    }

    if (!gradeSelection || !birthYearSelection) {
      setChildProfileError('Grade level and birth year are required.');
      return;
    }

    setChildProfileError(null);
    setIsSavingChildProfile(true);
    const gradeForSave = gradeSelection || null;
    const gradeLabelValue =
      gradeForSave !== null ? gradeLabel(gradeForSave, studentCountryCode) : null;
    try {
      await onChildProfileSave({
        profileId: childProfile.ids.id,
        orgId: childProfile.ids.orgId,
        gradeId: gradeForSave,
        gradeLabel: gradeLabelValue,
        birthYear: Number(birthYearSelection),
        schoolName: schoolNameValue.trim() || null,
        schoolYear: schoolYearValue.trim() || null,
        interests: selectedInterests,
        strengths: selectedStrengths,
        learningPreferences: selectedLearningPreferences,
        motivationStyles: selectedMotivationStyles,
        confidenceLevel: selectedConfidenceLevel || null,
        communicationStyles: selectedCommunicationStyles,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save student profile.';
      setChildProfileError(message);
      throw error;
    } finally {
      setIsSavingChildProfile(false);
    }
  }, [
    childProfile.ids.id,
    childProfile.ids.orgId,
    gradeSelection,
    studentCountryCode,
    birthYearSelection,
    schoolNameValue,
    schoolYearValue,
    selectedInterests,
    selectedStrengths,
    selectedLearningPreferences,
    selectedMotivationStyles,
    selectedCommunicationStyles,
    selectedConfidenceLevel,
    onChildProfileSave,
  ]);

  if (!childProfile) {
    return null;
  }

  return (
    <div className="space-y-3 w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">Student profile</h3>
          <p className="text-sm text-muted-foreground">
            Learning preferences and school details.
          </p>
        </div>
      </div>
      <div className="space-y-1 w-full">
        <Collapsible
          className="rounded-2xl w-full"
          open={basicInfoOpen}
          onOpenChange={handleBasicInfoOpenChange}
        >
          <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
              <User className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="text-sm font-medium">Basic student info</div>
              <div className="text-xs text-muted-foreground">
                {childProfile.gradeLevel
                  ? gradeLabel(childProfile.gradeLevel, studentCountryCode)
                  : 'Not set'}
              </div>
            </div>
            <ChevronIcon />
          </CollapsibleTrigger>
          <CollapsibleContent className="py-4 w-full">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="settings-grade">
                  Grade level <span className="text-destructive">*</span>
                </Label>
                <div className="relative w-full rounded-full overflow-hidden">
                  {showGradeBeam ? (
                    <BorderBeam
                      size={52}
                      initialOffset={8}
                      borderWidth={2}
                      className="from-transparent via-amber-700 to-transparent"
                      transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                    />
                  ) : null}
                  <Select
                    value={gradeSelection}
                    onValueChange={(value) => setGradeSelection(value as GradeLevel)}
                  >
                    <SelectTrigger
                      id="settings-grade"
                      className="relative z-10 w-full rounded-4xl"
                    >
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-birth-year">
                  Birth year <span className="text-destructive">*</span>
                </Label>
                <div className="relative w-full rounded-full overflow-hidden">
                  {showBirthYearBeam ? (
                    <BorderBeam
                      size={52}
                      initialOffset={8}
                      borderWidth={2}
                      className="from-transparent via-amber-700 to-transparent"
                      transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                    />
                  ) : null}
                  <Select
                    value={birthYearSelection}
                    onValueChange={(value) => setBirthYearSelection(value)}
                  >
                    <SelectTrigger
                      id="settings-birth-year"
                      aria-required="true"
                      className="relative z-10 w-full rounded-4xl"
                    >
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {BIRTH_YEAR_OPTIONS.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-destructive min-h-[1em]">
                  {childProfileError ?? ''}
                </p>
                <div className="relative inline-flex rounded-full">
                  {showSaveActionBeam ? (
                    <BorderBeam
                      size={26}
                      initialOffset={8}
                      borderWidth={2}
                      className="from-transparent via-amber-700 to-transparent"
                      transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                    />
                  ) : null}
                  <Button
                    size="sm"
                    onClick={() => {
                      void handleChildProfileSave();
                    }}
                    disabled={isSaveDisabled}
                    className="relative z-10"
                  >
                    {isSavingChildProfile ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Separator />
        <Collapsible className="rounded-2xl w-full">
          <CollapsibleTrigger
            disabled={otherSectionsDisabled}
            aria-disabled={otherSectionsDisabled}
            className={`group flex w-full items-center gap-3 py-3 text-left ${
              otherSectionsDisabled ? 'cursor-not-allowed opacity-70' : ''
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
              <BookOpen className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="text-sm font-medium">School details</div>
              <div className="text-xs text-muted-foreground">
                {childProfile.schoolName ?? 'School not set'}
              </div>
            </div>
            <ChevronIcon />
          </CollapsibleTrigger>
          <CollapsibleContent
            className={`py-4 w-full ${otherSectionsDisabled ? 'pointer-events-none opacity-60' : ''}`}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="settings-school">School name</Label>
                <Input
                  id="settings-school"
                  value={schoolNameValue}
                  onChange={(event) => setSchoolNameValue(event.target.value)}
                  placeholder="School name"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="settings-school-year">Academic year</Label>
                <Input
                  id="settings-school-year"
                  value={schoolYearValue}
                  onChange={(event) => setSchoolYearValue(event.target.value)}
                  placeholder="e.g. 2025-2026"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => {
                    void handleChildProfileSave();
                  }}
                  disabled={isSaveDisabled}
                >
                  {isSavingChildProfile ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Separator />
        <Collapsible className="rounded-2xl w-full">
          <CollapsibleTrigger
            disabled={otherSectionsDisabled}
            aria-disabled={otherSectionsDisabled}
            className={`group flex w-full items-center gap-3 py-3 text-left ${
              otherSectionsDisabled ? 'cursor-not-allowed opacity-70' : ''
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
              <Lightbulb className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="text-sm font-medium">Learner profile</div>
              <div className="text-xs text-muted-foreground">
                {childProfile.interests?.length
                  ? childProfile.interests.join(', ')
                  : 'Not set'}
              </div>
            </div>
            <ChevronIcon />
          </CollapsibleTrigger>
          <CollapsibleContent
            className={`py-4 w-full ${otherSectionsDisabled ? 'pointer-events-none opacity-60' : ''}`}
          >
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Interests</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {INTEREST_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:border-primary"
                    >
                      <Checkbox
                        checked={selectedInterests.includes(option)}
                        onCheckedChange={() =>
                          toggleSelection(option, setSelectedInterests)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>Strengths</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {STRENGTH_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:border-primary"
                    >
                      <Checkbox
                        checked={selectedStrengths.includes(option)}
                        onCheckedChange={() =>
                          toggleSelection(option, setSelectedStrengths)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => {
                    void handleChildProfileSave();
                  }}
                  disabled={isSaveDisabled}
                >
                  {isSavingChildProfile ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Separator />
        <Collapsible className="rounded-2xl w-full">
          <CollapsibleTrigger
            disabled={otherSectionsDisabled}
            aria-disabled={otherSectionsDisabled}
            className={`group flex w-full items-center gap-3 py-3 text-left ${
              otherSectionsDisabled ? 'cursor-not-allowed opacity-70' : ''
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
              <SlidersHorizontal className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="text-sm font-medium">Learning & motivation preferences</div>
              <div className="text-xs text-muted-foreground">
                {childProfile.learningPreferences?.length
                  ? childProfile.learningPreferences.join(', ')
                  : 'Not set'}
              </div>
            </div>
            <ChevronIcon />
          </CollapsibleTrigger>
          <CollapsibleContent
            className={`py-4 w-full ${otherSectionsDisabled ? 'pointer-events-none opacity-60' : ''}`}
          >
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Learning preferences</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {LEARNING_PREFERENCES_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:border-primary"
                    >
                      <Checkbox
                        checked={selectedLearningPreferences.includes(option)}
                        onCheckedChange={() =>
                          toggleSelection(option, setSelectedLearningPreferences)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>Motivation styles</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {MOTIVATION_STYLE_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:border-primary"
                    >
                      <Checkbox
                        checked={selectedMotivationStyles.includes(option)}
                        onCheckedChange={() =>
                          toggleSelection(option, setSelectedMotivationStyles)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => {
                    void handleChildProfileSave();
                  }}
                  disabled={isSaveDisabled}
                >
                  {isSavingChildProfile ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Separator />
        <Collapsible className="rounded-2xl w-full">
          <CollapsibleTrigger
            disabled={otherSectionsDisabled}
            aria-disabled={otherSectionsDisabled}
            className={`group flex w-full items-center gap-3 py-3 text-left ${
              otherSectionsDisabled ? 'cursor-not-allowed opacity-70' : ''
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
              <Users className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="text-sm font-medium">Communication & confidence</div>
              <div className="text-xs text-muted-foreground">
                {childProfile.confidenceLevel ?? 'Not set'}
              </div>
              <div className="text-xs text-muted-foreground">
                {childProfile.communicationStyles?.length
                  ? childProfile.communicationStyles.join(', ')
                  : 'Communication not set'}
              </div>
            </div>
            <ChevronIcon />
          </CollapsibleTrigger>
          <CollapsibleContent
            className={`py-4 w-full ${otherSectionsDisabled ? 'pointer-events-none opacity-60' : ''}`}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="settings-confidence">Confidence level</Label>
                <Select
                  value={selectedConfidenceLevel}
                  onValueChange={(value) => setSelectedConfidenceLevel(value)}
                >
                  <SelectTrigger id="settings-confidence" className="w-full">
                    <SelectValue placeholder="Select confidence level" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONFIDENCE_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 sm:col-span-2">
                <Label>Communication styles</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {COMMUNICATION_STYLE_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:border-primary"
                    >
                      <Checkbox
                        checked={selectedCommunicationStyles.includes(option)}
                        onCheckedChange={() =>
                          toggleSelection(option, setSelectedCommunicationStyles)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => {
                    void handleChildProfileSave();
                  }}
                  disabled={isSaveDisabled}
                >
                  {isSavingChildProfile ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
