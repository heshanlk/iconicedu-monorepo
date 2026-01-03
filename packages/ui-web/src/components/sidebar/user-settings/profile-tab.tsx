import * as React from 'react';
import {
  BookOpen,
  Briefcase,
  ChevronRight,
  Lightbulb,
  SlidersHorizontal,
  User,
  Users,
} from 'lucide-react';

import type {
  ChildProfileVM,
  EducatorProfileVM,
  GradeLevelOption,
  StaffProfileVM,
  ThemeKey,
  UserProfileVM,
} from '@iconicedu/shared-types';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Button } from '../../../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../ui/collapsible';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Separator } from '../../../ui/separator';
import { Textarea } from '../../../ui/textarea';

type ProfileTabProps = {
  profile: UserProfileVM;
  profileBlock: UserProfileVM['profile'];
  currentThemeKey: ThemeKey;
  childProfile: ChildProfileVM | null;
  educatorProfile: EducatorProfileVM | null;
  staffProfile: StaffProfileVM | null;
  formatGradeLevel: (
    gradeLevel?: { id: string | number; label: string } | null,
  ) => string;
  childGradeLevel?: { id: string | number; label: string } | null;
  educatorSubjects?: string[];
  educatorGradesSupported?: GradeLevelOption[];
  educatorCurriculumTags?: string[];
  educatorBadges?: string[];
  staffSpecialties?: string[];
};

export function ProfileTab({
  profile,
  profileBlock,
  currentThemeKey,
  childProfile,
  educatorProfile,
  staffProfile,
  formatGradeLevel,
  childGradeLevel,
  educatorSubjects = [],
  educatorGradesSupported = [],
  educatorCurriculumTags = [],
  educatorBadges = [],
  staffSpecialties = [],
}: ProfileTabProps) {
  return (
    <div className="space-y-8 w-full">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold">Profile</h3>
            <p className="text-sm text-muted-foreground">
              Update your display name, profile photo, and bio.
            </p>
          </div>
        </div>
        <div className="space-y-1 w-full">
          <Collapsible className="rounded-2xl w-full">
            <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                <User className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium">Profile details</div>
                <div className="text-xs text-muted-foreground">
                  {profileBlock.displayName}
                </div>
              </div>
              <ChevronIcon />
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4 w-full">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 flex items-center gap-3">
                  <Avatar
                    className={`size-12 border theme-border theme-${currentThemeKey}`}
                  >
                    <AvatarImage src={profileBlock.avatar.url ?? undefined} />
                    <AvatarFallback className="theme-bg theme-fg">
                      {(profileBlock.displayName ?? 'U')
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">Profile photo</div>
                    <div className="text-xs text-muted-foreground">JPG, PNG up to 5MB.</div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    Change
                  </Button>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-display-name">Display name</Label>
                  <Input
                    id="settings-display-name"
                    defaultValue={profileBlock.displayName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-first-name">First name</Label>
                  <Input
                    id="settings-first-name"
                    defaultValue={profileBlock.firstName ?? ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-last-name">Last name</Label>
                  <Input
                    id="settings-last-name"
                    defaultValue={profileBlock.lastName ?? ''}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="settings-bio">Bio</Label>
                  <Textarea
                    id="settings-bio"
                    defaultValue={profileBlock.bio ?? ''}
                    rows={4}
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <Button size="sm">Save</Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {profile.kind === 'child' ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base font-semibold">Student profile</h3>
              <p className="text-sm text-muted-foreground">
                Learning preferences and school details.
              </p>
            </div>
          </div>
          <Separator />
          <div className="space-y-1 w-full">
            <Collapsible className="rounded-2xl w-full">
              <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                  <User className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">Basic student info</div>
                  <div className="text-xs text-muted-foreground">
                    {formatGradeLevel(childGradeLevel ?? childProfile?.gradeLevel)}
                  </div>
                </div>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-4 w-full">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="settings-grade">Grade level</Label>
                    <Input
                      id="settings-grade"
                      defaultValue={childGradeLevel?.label ?? ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="settings-birth-year">Birth year</Label>
                    <Input
                      id="settings-birth-year"
                      defaultValue={childProfile?.birthYear ?? ''}
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button size="sm">Save</Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Separator />
            <Collapsible className="rounded-2xl w-full">
              <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">School details</div>
                  <div className="text-xs text-muted-foreground">
                    {childProfile?.schoolName ?? 'School not set'}
                  </div>
                </div>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-4 w-full">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-school">School name</Label>
                    <Input
                      id="settings-school"
                      defaultValue={childProfile?.schoolName ?? ''}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-school-year">Academic year</Label>
                    <Input
                      id="settings-school-year"
                      defaultValue={childProfile?.schoolYear ?? ''}
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button size="sm">Save</Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Separator />
            <Collapsible className="rounded-2xl w-full">
              <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                  <Lightbulb className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">Learner profile</div>
                  <div className="text-xs text-muted-foreground">
                    {childProfile?.interests?.length
                      ? childProfile.interests.join(', ')
                      : 'Not set'}
                  </div>
                </div>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-4 w-full">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-interests">Interests</Label>
                    <Input
                      id="settings-interests"
                      defaultValue={childProfile?.interests?.join(', ') ?? ''}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-strengths">Strengths</Label>
                    <Input
                      id="settings-strengths"
                      defaultValue={childProfile?.strengths?.join(', ') ?? ''}
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button size="sm">Save</Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Separator />
            <Collapsible className="rounded-2xl w-full">
              <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                  <SlidersHorizontal className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    Learning & motivation preferences
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {childProfile?.learningPreferences?.length
                      ? childProfile.learningPreferences.join(', ')
                      : 'Not set'}
                  </div>
                </div>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-4 w-full">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-learning-preferences">
                      Learning preferences
                    </Label>
                    <Input
                      id="settings-learning-preferences"
                      defaultValue={childProfile?.learningPreferences?.join(', ') ?? ''}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-motivation">Motivation styles</Label>
                    <Input
                      id="settings-motivation"
                      defaultValue={childProfile?.motivationStyles?.join(', ') ?? ''}
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button size="sm">Save</Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Separator />
            <Collapsible className="rounded-2xl w-full">
              <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                  <Users className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">Communication & confidence</div>
                  <div className="text-xs text-muted-foreground">
                    {childProfile?.confidenceLevel ?? 'Not set'}
                  </div>
                </div>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-4 w-full">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="settings-confidence">Confidence level</Label>
                    <Input
                      id="settings-confidence"
                      defaultValue={childProfile?.confidenceLevel ?? ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="settings-communication">Communication style</Label>
                    <Input
                      id="settings-communication"
                      defaultValue={childProfile?.communicationStyle ?? ''}
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button size="sm">Save</Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      ) : null}

      {profile.kind === 'educator' ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base font-semibold">Educator profile</h3>
              <p className="text-sm text-muted-foreground">
                Teaching focus, credentials, and specialties.
              </p>
            </div>
          </div>
          <Separator />
          <div className="space-y-1 w-full">
            <Collapsible className="rounded-2xl w-full">
              <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                  <User className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">Basic info</div>
                  <div className="text-xs text-muted-foreground">
                    {educatorProfile?.headline ?? 'Headline not set'}
                  </div>
                </div>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-4 w-full">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-educator-headline">Headline</Label>
                    <Input
                      id="settings-educator-headline"
                      defaultValue={educatorProfile?.headline ?? ''}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-educator-subjects">Subjects</Label>
                    <Input
                      id="settings-educator-subjects"
                      defaultValue={educatorSubjects.join(', ') ?? ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="settings-educator-grades">Grades supported</Label>
                    <Input
                      id="settings-educator-grades"
                      defaultValue={educatorGradesSupported
                        .map((grade) => grade?.label)
                        .filter(Boolean)
                        .join(', ')}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-educator-video">Intro video URL</Label>
                    <Input
                      id="settings-educator-video"
                      defaultValue={educatorProfile?.featuredVideoIntroUrl ?? ''}
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button size="sm">Save</Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Separator />
            <Collapsible className="rounded-2xl w-full">
              <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                  <Briefcase className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">Expertise & background</div>
                  <div className="text-xs text-muted-foreground">
                    {educatorSubjects.join(', ') || 'Subjects not set'}
                  </div>
                </div>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-4 w-full">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="settings-educator-experience">Experience years</Label>
                    <Input
                      id="settings-educator-experience"
                      defaultValue={educatorProfile?.experienceYears ?? ''}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-educator-education">Education</Label>
                    <Input
                      id="settings-educator-education"
                      defaultValue={educatorProfile?.education ?? ''}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-educator-certifications">Certifications</Label>
                    <Input
                      id="settings-educator-certifications"
                      defaultValue={
                        educatorProfile?.certifications
                          ?.map((cert) => cert.name)
                          .join(', ') ?? ''
                      }
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-educator-badges">Badges</Label>
                    <Input
                      id="settings-educator-badges"
                      defaultValue={educatorBadges.join(', ')}
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button size="sm">Save</Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Separator />
            <Collapsible className="rounded-2xl w-full">
              <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                  <SlidersHorizontal className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">Teaching preferences</div>
                  <div className="text-xs text-muted-foreground">
                    {educatorCurriculumTags.join(', ') || 'Not set'}
                  </div>
                </div>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-4 w-full">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-educator-age-groups">
                      Age groups comfortable with
                    </Label>
                    <Input
                      id="settings-educator-age-groups"
                      defaultValue={
                        educatorProfile?.ageGroupsComfortableWith?.join(', ') ?? ''
                      }
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-educator-curriculum">Curriculum tags</Label>
                    <Input
                      id="settings-educator-curriculum"
                      defaultValue={educatorCurriculumTags.join(', ')}
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button size="sm">Save</Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      ) : null}

      {profile.kind === 'staff' ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-base font-semibold">Staff profile</h3>
              <p className="text-sm text-muted-foreground">
                Department, role, and internal availability.
              </p>
            </div>
          </div>
          <Separator />
          <div className="space-y-1 w-full">
            <Collapsible className="rounded-2xl w-full">
              <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                  <Briefcase className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    Availability & working rules
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {staffProfile?.workingHoursRules?.join(', ') ?? 'Not set'}
                  </div>
                </div>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-4 w-full">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-staff-hours">Working hours rules</Label>
                    <Input
                      id="settings-staff-hours"
                      defaultValue={staffProfile?.workingHoursRules?.join(', ') ?? ''}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-staff-specialties">Specialties</Label>
                    <Input
                      id="settings-staff-specialties"
                      defaultValue={staffSpecialties.join(', ')}
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button size="sm">Save</Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ChevronIcon() {
  return (
    <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
  );
}
