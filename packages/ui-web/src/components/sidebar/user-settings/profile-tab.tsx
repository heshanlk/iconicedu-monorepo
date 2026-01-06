import * as React from 'react';
import {
  BookOpen,
  Briefcase,
  ChevronRight,
  Lightbulb,
  SlidersHorizontal,
  ArrowRight,
  User,
  Users,
  X,
} from 'lucide-react';

import type {
  ChildProfileVM,
  EducatorProfileVM,
  GradeLevelOption,
  StaffProfileVM,
  UserProfileVM,
} from '@iconicedu/shared-types';
import { BorderBeam } from '../../../ui/border-beam';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../ui/alert-dialog';
import { cn } from '@iconicedu/ui-web/lib/utils';
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
import { UserSettingsTabSection } from './components/user-settings-tab-section';

type ProfileTabProps = {
  profile: UserProfileVM;
  profileBlock: UserProfileVM['profile'];
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
  expandProfileDetails?: boolean;
  scrollToRequired?: boolean;
  scrollToken?: number;
  primaryActionLabel?: string;
  onPrimaryActionComplete?: () => void;
  onProfileSave?: (input: ProfileSaveInput) => Promise<void> | void;
  onAvatarUpload?: (input: ProfileAvatarInput) => Promise<void> | void;
  onAvatarRemove?: (input: ProfileAvatarRemoveInput) => Promise<void> | void;
};

export type ProfileSaveInput = {
  profileId: string;
  orgId: string;
  displayName: string;
  firstName: string;
  lastName: string;
  bio?: string | null;
};

export type ProfileAvatarInput = {
  profileId: string;
  orgId: string;
  file: File;
};

export type ProfileAvatarRemoveInput = {
  profileId: string;
  orgId: string;
};

export function ProfileTab({
  profile,
  profileBlock,
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
  expandProfileDetails = false,
  scrollToRequired = false,
  scrollToken = 0,
  primaryActionLabel = 'Save',
  onPrimaryActionComplete,
  onProfileSave,
  onAvatarUpload,
  onAvatarRemove,
}: ProfileTabProps) {
  const [profileDetailsOpen, setProfileDetailsOpen] =
    React.useState(expandProfileDetails);
  const shouldHighlightRequired = expandProfileDetails;
  const [firstNameValue, setFirstNameValue] = React.useState(
    profileBlock.firstName ?? '',
  );
  const [lastNameValue, setLastNameValue] = React.useState(profileBlock.lastName ?? '');
  const [isFirstFocused, setIsFirstFocused] = React.useState(false);
  const [isLastFocused, setIsLastFocused] = React.useState(false);
  const showProfileTaskToast = expandProfileDetails;
  const [isProfileToastDismissed, setIsProfileToastDismissed] = React.useState(false);
  const [displayNameValue, setDisplayNameValue] = React.useState(
    profileBlock.displayName ?? '',
  );
  const [bioValue, setBioValue] = React.useState(profileBlock.bio ?? '');
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [showRequiredErrors, setShowRequiredErrors] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [avatarUploadError, setAvatarUploadError] = React.useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = React.useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = React.useState(false);
  const [avatarRemoved, setAvatarRemoved] = React.useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement | null>(null);
  const firstNameRef = React.useRef<HTMLInputElement | null>(null);
  const lastNameRef = React.useRef<HTMLInputElement | null>(null);
  const isPrimaryDisabled =
    primaryActionLabel === 'Continue' &&
    (!firstNameValue.trim() || !lastNameValue.trim());

  React.useEffect(() => {
    if (expandProfileDetails) {
      setProfileDetailsOpen(true);
    }
  }, [expandProfileDetails]);

  React.useEffect(() => {
    if (!expandProfileDetails) {
      return;
    }
    const target = !firstNameValue.trim() ? firstNameRef.current : lastNameRef.current;
    if (target) {
      requestAnimationFrame(() => target.focus());
    }
  }, [expandProfileDetails, firstNameValue, lastNameValue]);

  React.useEffect(() => {
    if (!scrollToRequired) {
      return;
    }
    const target = !firstNameValue.trim()
      ? firstNameRef.current
      : !lastNameValue.trim()
        ? lastNameRef.current
        : firstNameRef.current;
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, [firstNameValue, lastNameValue, scrollToRequired, scrollToken]);

  React.useEffect(() => {
    setFirstNameValue(profileBlock.firstName ?? '');
    setLastNameValue(profileBlock.lastName ?? '');
    setDisplayNameValue(profileBlock.displayName ?? '');
    setBioValue(profileBlock.bio ?? '');
    setAvatarPreview(null);
    setAvatarRemoved(false);
  }, [
    profileBlock.firstName,
    profileBlock.lastName,
    profileBlock.displayName,
    profileBlock.bio,
  ]);

  React.useEffect(() => {
    if (displayNameValue.trim()) {
      return;
    }
    const derivedName = `${firstNameValue.trim()} ${lastNameValue.trim()}`.trim();
    if (derivedName) {
      setDisplayNameValue(derivedName);
    }
  }, [displayNameValue, firstNameValue, lastNameValue]);

  const handleProfileSave = React.useCallback(
    async (afterSave?: () => void) => {
      setSaveError(null);
      setSaveSuccess(false);

      const trimmedFirstName = firstNameValue.trim();
      const trimmedLastName = lastNameValue.trim();
      const trimmedDisplayName = displayNameValue.trim();
      const trimmedBio = bioValue.trim();

      if (!trimmedFirstName || !trimmedLastName) {
        setShowRequiredErrors(true);
        setSaveError('First and last name are required.');
        return;
      }

      setShowRequiredErrors(false);
      if (!onProfileSave) {
        setSaveSuccess(true);
        afterSave?.();
        return;
      }

      setIsSaving(true);
      try {
        await onProfileSave({
          profileId: profile.ids.id,
          orgId: profile.ids.orgId,
          displayName: trimmedDisplayName || `${trimmedFirstName} ${trimmedLastName}`,
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          bio: trimmedBio || null,
        });
        setSaveSuccess(true);
        afterSave?.();
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : 'Unable to save profile.');
      } finally {
        setIsSaving(false);
      }
    },
    [
      bioValue,
      displayNameValue,
      firstNameValue,
      lastNameValue,
      onProfileSave,
      profile.ids.id,
      profile.ids.orgId,
    ],
  );

  React.useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  React.useEffect(() => {
    if (profileBlock.avatar.url) {
      setAvatarRemoved(false);
    }
  }, [profileBlock.avatar.url]);

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      setAvatarUploadError(null);

      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }

      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setAvatarRemoved(false);

      if (!onAvatarUpload) {
        return;
      }

      setIsUploadingAvatar(true);
      try {
        await onAvatarUpload({
          profileId: profile.ids.id,
          orgId: profile.ids.orgId,
          file,
        });
      } catch (error) {
        setAvatarUploadError(
          error instanceof Error ? error.message : 'Unable to upload photo.',
        );
      } finally {
        setIsUploadingAvatar(false);
        event.target.value = '';
      }
    },
    [avatarPreview, onAvatarUpload, profile.ids.id, profile.ids.orgId],
  );

  const handleAvatarRemove = React.useCallback(async () => {
    setAvatarUploadError(null);
    setAvatarRemoved(true);
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
    if (!onAvatarRemove) {
      return;
    }
    try {
      setIsRemovingAvatar(true);
      await onAvatarRemove({
        profileId: profile.ids.id,
        orgId: profile.ids.orgId,
      });
    } catch (error) {
      setAvatarUploadError(
        error instanceof Error ? error.message : 'Unable to remove avatar.',
      );
    } finally {
      setIsRemovingAvatar(false);
    }
  }, [avatarPreview, onAvatarRemove, profile.ids.id, profile.ids.orgId]);

  const handleConfirmAvatarRemove = React.useCallback(async () => {
    await handleAvatarRemove();
    setIsRemoveDialogOpen(false);
  }, [handleAvatarRemove]);

  const avatarUrl = avatarRemoved
    ? null
    : (avatarPreview ?? profileBlock.avatar.url ?? null);
  const hasAvatar = Boolean(profileBlock.avatar.url ?? avatarPreview) && !avatarRemoved;
  const fallbackName =
    profileBlock.displayName?.trim() ||
    `${profileBlock.firstName ?? ''} ${profileBlock.lastName ?? ''}`.trim() ||
    'User';
  const avatarInitials = fallbackName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const avatarThemeKey = profile.ui?.themeKey ?? 'teal';

  return (
    <div className="space-y-8 w-full">
      {showProfileTaskToast && !isProfileToastDismissed ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="font-medium text-foreground">
                Please fill out{' '}
                <span className="relative inline-flex items-center rounded-2xl px-2 py-1">
                  <BorderBeam
                    size={48}
                    initialOffset={12}
                    className="from-transparent via-pink-500 to-transparent"
                    transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                  />
                  <span className="relative z-10">required</span>
                </span>{' '}
                details to continue.
              </div>
              <div className="text-muted-foreground">
                Fields marked as <span className="text-destructive">*</span> are required.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsProfileToastDismissed(true)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
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
          <UserSettingsTabSection
            icon={<User className="h-5 w-5" />}
            title="Profile details"
            subtitle={profileBlock.displayName}
            open={expandProfileDetails ? true : profileDetailsOpen}
            onOpenChange={(nextOpen) => {
              if (expandProfileDetails) return;
              setProfileDetailsOpen(nextOpen);
            }}
            showSeparator={false}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 flex items-center gap-3">
                <Avatar
                  key={`${avatarUrl ?? 'fallback'}-${avatarRemoved ? 'removed' : 'active'}`}
                  className={cn('size-12 border theme-border', `theme-${avatarThemeKey}`)}
                >
                  {avatarUrl ? <AvatarImage src={avatarUrl} /> : null}
                  <AvatarFallback className="theme-bg theme-fg font-semibold">
                    {avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">Profile photo</div>
                  <div className="text-xs text-muted-foreground">JPG, PNG up to 5MB.</div>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={handleAvatarClick}
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? 'Uploading...' : 'Change'}
                </Button>
                {hasAvatar ? (
                  <AlertDialog
                    open={isRemoveDialogOpen}
                    onOpenChange={setIsRemoveDialogOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={isRemovingAvatar}>
                        {isRemovingAvatar ? 'Removing...' : 'Remove'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove profile photo?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will reset your avatar to the default initials.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirmAvatarRemove}
                            disabled={isRemovingAvatar}
                          >
                            Remove
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : null}
              </div>
              {avatarUploadError ? (
                <div className="sm:col-span-2 text-xs text-destructive">
                  {avatarUploadError}
                </div>
              ) : null}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="settings-display-name">Display name</Label>
                <Input
                  id="settings-display-name"
                  value={displayNameValue}
                  onChange={(event) => setDisplayNameValue(event.target.value)}
                  placeholder="Enter a display name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-first-name">
                  First name <span className="text-destructive">*</span>
                </Label>
                <div className="relative rounded-full">
                  {shouldHighlightRequired &&
                  !firstNameValue.trim() &&
                  !isFirstFocused ? (
                    <BorderBeam
                      size={60}
                      initialOffset={20}
                      borderWidth={2}
                      className="from-transparent via-pink-500 to-transparent"
                      transition={{
                        type: 'spring',
                        stiffness: 60,
                        damping: 20,
                      }}
                    />
                  ) : null}
                  <Input
                    id="settings-first-name"
                    ref={firstNameRef}
                    value={firstNameValue}
                    required
                    className="relative"
                    placeholder="Enter your first name"
                    onFocus={() => setIsFirstFocused(true)}
                    onBlur={() => setIsFirstFocused(false)}
                    onChange={(event) => {
                      setFirstNameValue(event.target.value);
                      if (showRequiredErrors && event.target.value.trim()) {
                        setShowRequiredErrors(false);
                      }
                    }}
                  />
                </div>
                {showRequiredErrors && !firstNameValue.trim() ? (
                  <p className="text-xs text-destructive">First name is required.</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-last-name">
                  Last name <span className="text-destructive">*</span>
                </Label>
                <div className="relative rounded-full">
                  {shouldHighlightRequired && !lastNameValue.trim() && !isLastFocused ? (
                    <BorderBeam
                      size={60}
                      initialOffset={20}
                      borderWidth={2}
                      className="from-transparent via-pink-500 to-transparent"
                      transition={{
                        type: 'spring',
                        stiffness: 60,
                        damping: 20,
                      }}
                    />
                  ) : null}
                  <Input
                    id="settings-last-name"
                    ref={lastNameRef}
                    value={lastNameValue}
                    required
                    className="relative"
                    placeholder="Enter your last name"
                    onFocus={() => setIsLastFocused(true)}
                    onBlur={() => setIsLastFocused(false)}
                    onChange={(event) => {
                      setLastNameValue(event.target.value);
                      if (showRequiredErrors && event.target.value.trim()) {
                        setShowRequiredErrors(false);
                      }
                    }}
                  />
                </div>
                {showRequiredErrors && !lastNameValue.trim() ? (
                  <p className="text-xs text-destructive">Last name is required.</p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="settings-bio">About me</Label>
                  <span className="text-xs text-muted-foreground">Optional</span>
                </div>
                <Textarea
                  id="settings-bio"
                  value={bioValue}
                  onChange={(event) => setBioValue(event.target.value)}
                  rows={4}
                  placeholder="Share a short bio to help others know you."
                />
              </div>
              <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  {saveError ? (
                    <span className="text-destructive">{saveError}</span>
                  ) : saveSuccess ? (
                    <span className="text-primary">Profile saved.</span>
                  ) : null}
                </div>
                <Button
                  size="sm"
                  onClick={() => handleProfileSave(onPrimaryActionComplete)}
                  disabled={isSaving || isPrimaryDisabled}
                >
                  {isSaving ? (
                    'Saving...'
                  ) : primaryActionLabel === 'Continue' ? (
                    <span className="inline-flex items-center gap-2">
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : (
                    primaryActionLabel
                  )}
                </Button>
              </div>
            </div>
          </UserSettingsTabSection>
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
                      placeholder="Grade level"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="settings-birth-year">Birth year</Label>
                    <Input
                      id="settings-birth-year"
                      defaultValue={childProfile?.birthYear ?? ''}
                      placeholder="e.g. 2012"
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
                      placeholder="School name"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-school-year">Academic year</Label>
                    <Input
                      id="settings-school-year"
                      defaultValue={childProfile?.schoolYear ?? ''}
                      placeholder="e.g. 2025-2026"
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
                      placeholder="Interests (comma-separated)"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-strengths">Strengths</Label>
                    <Input
                      id="settings-strengths"
                      defaultValue={childProfile?.strengths?.join(', ') ?? ''}
                      placeholder="Strengths (comma-separated)"
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
                      placeholder="Learning preferences (comma-separated)"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-motivation">Motivation styles</Label>
                    <Input
                      id="settings-motivation"
                      defaultValue={childProfile?.motivationStyles?.join(', ') ?? ''}
                      placeholder="Motivation styles (comma-separated)"
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
                      placeholder="low, medium, or high"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="settings-communication">Communication style</Label>
                    <Input
                      id="settings-communication"
                      defaultValue={childProfile?.communicationStyle ?? ''}
                      placeholder="chatty or shy"
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
                      placeholder="Short headline"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-educator-subjects">Subjects</Label>
                    <Input
                      id="settings-educator-subjects"
                      defaultValue={educatorSubjects.join(', ') ?? ''}
                      placeholder="Subjects (comma-separated)"
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
                      placeholder="Grades (comma-separated)"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-educator-video">Intro video URL</Label>
                    <Input
                      id="settings-educator-video"
                      defaultValue={educatorProfile?.featuredVideoIntroUrl ?? ''}
                      placeholder="Video intro URL"
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
                      placeholder="Years of experience"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-educator-education">Education</Label>
                    <Input
                      id="settings-educator-education"
                      defaultValue={educatorProfile?.education ?? ''}
                      placeholder="Education background"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-educator-certifications">
                      Certifications
                    </Label>
                    <Input
                      id="settings-educator-certifications"
                      defaultValue={
                        educatorProfile?.certifications
                          ?.map((cert) => cert.name)
                          .join(', ') ?? ''
                      }
                      placeholder="Certifications (comma-separated)"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-educator-badges">Badges</Label>
                    <Input
                      id="settings-educator-badges"
                      defaultValue={educatorBadges.join(', ')}
                      placeholder="Badges (comma-separated)"
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
                      placeholder="Age groups (comma-separated)"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-educator-curriculum">Curriculum tags</Label>
                    <Input
                      id="settings-educator-curriculum"
                      defaultValue={educatorCurriculumTags.join(', ')}
                      placeholder="Curriculum tags (comma-separated)"
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
                  <div className="text-sm font-medium">Availability & working rules</div>
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
                      placeholder="Working hours (comma-separated)"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="settings-staff-specialties">Specialties</Label>
                    <Input
                      id="settings-staff-specialties"
                      defaultValue={staffSpecialties.join(', ')}
                      placeholder="Specialties (comma-separated)"
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
