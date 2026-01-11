'use client';

import * as React from 'react';
import { Briefcase, SlidersHorizontal, User } from 'lucide-react';

import type {
  CountryCode,
  EducatorProfileSaveInput,
  EducatorProfileVM,
  GradeLevel,
} from '@iconicedu/shared-types';
import { Button } from '../../../ui/button';
import { Checkbox } from '../../../ui/checkbox';
import { Input } from '../../../ui/input';
import { Textarea } from '../../../ui/textarea';
import { Label } from '../../../ui/label';
import { UserSettingsTabSection } from './components/user-settings-tab-section';
import {
  GRADE_META,
  gradeLabel,
  normalizeCountryCode,
  optionsForCountry,
} from '@iconicedu/shared-types';

const listToString = (items?: string[] | null) => (items ?? []).join(', ');

const stringToList = (value: string) =>
  value
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean);

const SUBJECT_OPTIONS = [
  'Math',
  'Science',
  'English Language Arts',
  'Social Studies',
  'STEM & coding',
  'Creative arts',
  'Music & performance',
  'Mindfulness & SEL',
  'Language studies',
  'Career readiness',
];

const AGE_GROUP_OPTIONS = [
  'Toddlers',
  'Preschool',
  'Early elementary',
  'Upper elementary',
  'Middle school',
  'High school',
  'Adults',
];

const CURRICULUM_TAG_OPTIONS = [
  'Project-based learning',
  'Interdisciplinary',
  'Social-emotional',
  'Literacy',
  'Numeracy',
  'STEAM',
  'Inquiry-based',
  'Culturally responsive',
  'Differentiated',
];

const isValidGradeLevel = (value?: GradeLevel | null): value is GradeLevel =>
  typeof value === 'string' && Boolean(GRADE_META[value as GradeLevel]);

const sanitizeGrades = (grades?: GradeLevel[] | null): GradeLevel[] =>
  (grades ?? []).filter(isValidGradeLevel);

type EducatorProfileTabProps = {
  educatorProfile: EducatorProfileVM;
  fallbackCountryCode?: string | null;
  onSave?: (input: EducatorProfileSaveInput) => Promise<void> | void;
};

export function EducatorProfileTab({
  educatorProfile,
  fallbackCountryCode,
  onSave,
}: EducatorProfileTabProps) {
  const educatorCountryCode = React.useMemo<CountryCode>(
    () =>
      normalizeCountryCode(
        educatorProfile.location?.countryCode ?? fallbackCountryCode,
      ),
    [educatorProfile.location?.countryCode, fallbackCountryCode],
  );
  const gradeOptions = React.useMemo(
    () => optionsForCountry(educatorCountryCode),
    [educatorCountryCode],
  );

  const [headlineValue, setHeadlineValue] = React.useState(
    educatorProfile.headline ?? '',
  );
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>(
    educatorProfile.subjects ?? [],
  );
  const [selectedGrades, setSelectedGrades] = React.useState<GradeLevel[]>(
    sanitizeGrades(educatorProfile.gradesSupported),
  );
  const [videoValue, setVideoValue] = React.useState(
    educatorProfile.featuredVideoIntroUrl ?? '',
  );
  const toggleSelection = React.useCallback(
    <T,>(value: T, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
      setter((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
      );
    },
    [],
  );
  const [experienceValue, setExperienceValue] = React.useState(
    educatorProfile.experienceYears?.toString() ?? '',
  );
  const [educationValue, setEducationValue] = React.useState(
    educatorProfile.education ?? '',
  );
  const [certificationsValue, setCertificationsValue] = React.useState(
    listToString(educatorProfile.certifications?.map((cert) => cert.name) ?? []),
  );
  const [selectedAgeGroups, setSelectedAgeGroups] = React.useState<string[]>(
    educatorProfile.ageGroupsComfortableWith ?? [],
  );
  const [selectedCurriculumTags, setSelectedCurriculumTags] = React.useState<string[]>(
    educatorProfile.curriculumTags ?? [],
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setHeadlineValue(educatorProfile.headline ?? '');
    setSelectedSubjects(educatorProfile.subjects ?? []);
    setSelectedGrades(sanitizeGrades(educatorProfile.gradesSupported));
    setVideoValue(educatorProfile.featuredVideoIntroUrl ?? '');
    setExperienceValue(educatorProfile.experienceYears?.toString() ?? '');
    setEducationValue(educatorProfile.education ?? '');
    setCertificationsValue(
      listToString(educatorProfile.certifications?.map((cert) => cert.name)),
    );
    setSelectedAgeGroups(educatorProfile.ageGroupsComfortableWith ?? []);
    setSelectedCurriculumTags(educatorProfile.curriculumTags ?? []);
  }, [educatorProfile]);

  const selectedGradeLabels = React.useMemo(
    () => selectedGrades.map((grade) => gradeLabel(grade, educatorCountryCode)),
    [selectedGrades, educatorCountryCode],
  );

  const handleSave = React.useCallback(async () => {
    if (!onSave) {
      return;
    }

    if (!selectedSubjects.length || !selectedGrades.length) {
      setErrorMessage('Subjects and grades are required.');
      return;
    }

    setErrorMessage(null);
    setIsSaving(true);

    const experienceNumber = experienceValue.trim() ? Number(experienceValue) : null;
    const sanitizedExperience =
      experienceNumber !== null && Number.isNaN(experienceNumber)
        ? null
        : experienceNumber;

    const gradeLevels =
      selectedGrades.length > 0
        ? selectedGrades.map((grade) => ({
            gradeId: grade,
            gradeLabel: gradeLabel(grade, educatorCountryCode),
          }))
        : null;

    try {
      await onSave({
        profileId: educatorProfile.ids.id,
        orgId: educatorProfile.ids.orgId,
        headline: headlineValue.trim() || null,
        subjects: selectedSubjects,
        gradeLevels,
        featuredVideoIntroUrl: videoValue.trim() || null,
        education: educationValue.trim() || null,
        experienceYears: sanitizedExperience,
        certifications: stringToList(certificationsValue),
        ageGroups: selectedAgeGroups,
        curriculumTags: selectedCurriculumTags,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to save educator profile.',
      );
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [
    educatorProfile.ids.id,
    educatorProfile.ids.orgId,
    headlineValue,
    videoValue,
    educationValue,
    experienceValue,
    certificationsValue,
    selectedAgeGroups,
    selectedCurriculumTags,
    onSave,
    selectedSubjects,
    selectedGrades,
  ]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">Educator profile</h3>
          <p className="text-sm text-muted-foreground">
            Teaching focus, credentials, and specialties.
          </p>
        </div>
      </div>
      <UserSettingsTabSection
        title="Basic info"
        subtitle={
          selectedSubjects.length || selectedGradeLabels.length
            ? [
                selectedSubjects.length
                  ? `Subjects: ${selectedSubjects.join(', ')}`
                  : 'Subjects not set',
                selectedGradeLabels.length
                  ? `Grades: ${selectedGradeLabels.join(', ')}`
                  : 'Grades not set',
              ].join(' · ')
            : 'Subjects and grades not set'
        }
        icon={<User className="h-5 w-5" />}
        footer={
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={
                isSaving ||
                !onSave ||
                !selectedSubjects.length ||
                !selectedGrades.length
              }
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="settings-educator-headline">Headline</Label>
            <Input
              id="settings-educator-headline"
              value={headlineValue}
              onChange={(event) => setHeadlineValue(event.target.value)}
              placeholder="Short headline"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center gap-1 text-sm">
              <Label>Subjects</Label>
              <span className="text-destructive">*</span>
            </div>
            {!selectedSubjects.length ? (
              <p className="text-xs text-destructive">Select at least one subject.</p>
            ) : null}
            <div className="grid gap-2 sm:grid-cols-2">
              {SUBJECT_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:border-primary"
                >
                  <Checkbox
                    checked={selectedSubjects.includes(option)}
                    onCheckedChange={() =>
                      toggleSelection(option, setSelectedSubjects)
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center gap-1 text-sm">
              <Label>Grades supported</Label>
              <span className="text-destructive">*</span>
            </div>
            {!selectedGrades.length ? (
              <p className="text-xs text-destructive">Select at least one grade.</p>
            ) : null}
            <div className="grid gap-2">
              {gradeOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:border-primary"
                >
                  <Checkbox
                    checked={selectedGrades.includes(option.value)}
                    onCheckedChange={() =>
                      toggleSelection(option.value, setSelectedGrades)
                    }
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="settings-educator-video">Intro video URL</Label>
            <Input
              id="settings-educator-video"
              value={videoValue}
              onChange={(event) => setVideoValue(event.target.value)}
              placeholder="Video intro URL"
            />
          </div>
        </div>
      </UserSettingsTabSection>
      <UserSettingsTabSection
        title="Expertise & background"
        subtitle={
          experienceValue
            ? `${experienceValue} year${experienceValue === '1' ? '' : 's'} experience`
            : 'Years of experience not set'
        }
        icon={<Briefcase className="h-5 w-5" />}
        footer={
          <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={
                  isSaving ||
                  !onSave ||
                  !selectedSubjects.length ||
                  !selectedGrades.length
                }
              >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="settings-educator-experience">Experience years</Label>
            <Input
              id="settings-educator-experience"
              type="number"
              value={experienceValue}
              onChange={(event) => setExperienceValue(event.target.value)}
              placeholder="Years of experience"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="settings-educator-education">Education</Label>
            <Textarea
              id="settings-educator-education"
              value={educationValue}
              onChange={(event) => setEducationValue(event.target.value)}
              placeholder="Education background"
              rows={3}
              className="resize-none"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="settings-educator-certifications">Certifications</Label>
            <Textarea
              id="settings-educator-certifications"
              value={certificationsValue}
              onChange={(event) => setCertificationsValue(event.target.value)}
              placeholder="Certifications (comma-separated)"
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
      </UserSettingsTabSection>
      <UserSettingsTabSection
        title="Teaching preferences"
        subtitle={
          [
            selectedCurriculumTags.length
              ? `Curriculum: ${selectedCurriculumTags.join(', ')}`
              : null,
            selectedAgeGroups.length
              ? `Age groups: ${selectedAgeGroups.join(', ')}`
              : null,
          ]
            .filter(Boolean)
            .join(' · ') || 'Not set'
        }
        icon={<SlidersHorizontal className="h-5 w-5" />}
        showSeparator={false}
        footer={
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={
                isSaving ||
                !onSave ||
                !selectedSubjects.length ||
                !selectedGrades.length
              }
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Age groups comfortable with</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {AGE_GROUP_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:border-primary"
                >
                  <Checkbox
                    checked={selectedAgeGroups.includes(option)}
                    onCheckedChange={() =>
                      toggleSelection(option, setSelectedAgeGroups)
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Label>Curriculum tags</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {CURRICULUM_TAG_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:border-primary"
                >
                  <Checkbox
                    checked={selectedCurriculumTags.includes(option)}
                    onCheckedChange={() =>
                      toggleSelection(option, setSelectedCurriculumTags)
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
      </UserSettingsTabSection>
      {errorMessage ? (
        <div className="pt-2">
          <p className="text-xs text-destructive">{errorMessage}</p>
        </div>
      ) : null}
    </div>
  );
}
