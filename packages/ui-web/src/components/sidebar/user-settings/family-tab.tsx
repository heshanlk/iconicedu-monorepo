'use client';

import * as React from 'react';
import { Plus, UserPlus, X } from 'lucide-react';

import type { ThemeKey, UserProfileVM } from '@iconicedu/shared-types';
import { BorderBeam } from '../../../ui/border-beam';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../ui/dialog';
import { UserSettingsTabSection } from './components/user-settings-tab-section';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';
import { Separator } from '../../../ui/separator';
import { toast } from 'sonner';

import type {
  FamilyLinkInviteRole,
  FamilyLinkInviteVM,
} from '@iconicedu/shared-types';
import type { ProfileSaveInput } from './profile-tab';
import {
  BIRTH_YEAR_OPTIONS,
  GRADE_LEVEL_OPTIONS,
} from './student-profile-tab';

type FamilyMemberItem = {
  id: string;
  profileId: string;
  orgId: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  email?: string;
  avatar?: UserProfileVM['profile']['avatar'] | null;
  roleLabel: string;
  canRemove: boolean;
  isChild?: boolean;
  themeKey: ThemeKey;
};

type EditableChildData = Record<string, { displayName: string; themeKey: ThemeKey }>;

type FamilyTabProps = {
  timezone?: string | null;
  location?: {
    city?: string | null;
    region?: string | null;
    postalCode?: string | null;
    countryCode?: string | null;
    countryName?: string | null;
  } | null;
  familyMembers: FamilyMemberItem[];
  profileThemes: Record<string, ThemeKey>;
  profileThemeOptions: Array<{ value: string; label: string }>;
  setProfileThemes: React.Dispatch<React.SetStateAction<Record<string, ThemeKey>>>;
  showOnboardingToast?: boolean;
  initialInvites?: FamilyLinkInviteVM[];
  onInviteCreate?: (input: {
    invitedRole: FamilyLinkInviteRole;
    invitedEmail: string;
  }) => Promise<FamilyLinkInviteVM> | void;
  onInviteRemove?: (input: { inviteId: string }) => Promise<void> | void;
  onProfileSave?: (input: ProfileSaveInput) => Promise<void> | void;
  onChildThemeSave?: (input: {
    profileId: string;
    orgId: string;
    themeKey: ThemeKey;
  }) => Promise<void> | void;
  onChildProfileCreate?: (input: {
    orgId: string;
    displayName: string;
    firstName: string;
    lastName: string;
    gradeLevel: string;
    birthYear: number;
    timezone?: string | null;
    city?: string | null;
    region?: string | null;
    countryCode?: string | null;
    countryName?: string | null;
  }) => Promise<void> | void;
};

export function FamilyTab({
  familyMembers,
  profileThemes,
  profileThemeOptions,
  setProfileThemes,
  showOnboardingToast = false,
  initialInvites = [],
  onInviteCreate,
  onInviteRemove,
  onProfileSave,
  onChildThemeSave,
  onChildProfileCreate,
  timezone,
  location,
}: FamilyTabProps) {
  const [isToastDismissed, setIsToastDismissed] = React.useState(false);
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  const [inviteRole, setInviteRole] = React.useState<FamilyLinkInviteRole>('child');
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteError, setInviteError] = React.useState<string | null>(null);
  const [invites, setInvites] = React.useState<FamilyLinkInviteVM[]>(initialInvites);
  const [isInviteSaving, setIsInviteSaving] = React.useState(false);
  const [removingInviteIds, setRemovingInviteIds] = React.useState<
    Record<string, boolean>
  >({});
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newChildDisplayName, setNewChildDisplayName] = React.useState('');
  const [newChildFirstName, setNewChildFirstName] = React.useState('');
  const [newChildLastName, setNewChildLastName] = React.useState('');
  const [newChildGrade, setNewChildGrade] = React.useState('');
  const [newChildBirthYear, setNewChildBirthYear] = React.useState('');
  const [isCreatingChild, setIsCreatingChild] = React.useState(false);
  const showToast = showOnboardingToast && !isToastDismissed;
  const INVITE_SAVE_ERROR = 'Unable to send invite right now. Please try again.';
  const INVITE_REMOVE_ERROR = 'Unable to remove invite right now. Please try again.';

  const handleInviteSave = React.useCallback(async () => {
    if (isInviteSaving) {
      return;
    }
    if (!onInviteCreate) {
      const message = 'Unable to send invite.';
      setInviteError(message);
      toast.error(message);
      return;
    }
    const trimmedEmail = inviteEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setInviteError('Enter a valid email address.');
      toast.error('Enter a valid email address.');
      return;
    }
    setIsInviteSaving(true);
    try {
      const invite = await onInviteCreate({
        invitedRole: inviteRole,
        invitedEmail: trimmedEmail,
      });
      if (!invite) {
        throw new Error('Unable to send invite.');
      }
      setInvites((prev) => [...prev, invite]);
      setInviteEmail('');
      setInviteRole('child');
      setInviteError(null);
      setIsInviteOpen(false);
      toast.success('Invitation sent');
    } catch (error) {
      console.error(error);
      setInviteError(INVITE_SAVE_ERROR);
      toast.error(INVITE_SAVE_ERROR);
    } finally {
      setIsInviteSaving(false);
    }
  }, [inviteEmail, inviteRole, isInviteSaving, onInviteCreate]);

  const handleRemoveInvite = React.useCallback(
    async (id: string) => {
      if (removingInviteIds[id]) {
        return;
      }
      if (!onInviteRemove) {
        toast.error(INVITE_REMOVE_ERROR);
        return;
      }
      setRemovingInviteIds((prev) => ({ ...prev, [id]: true }));
      try {
        await onInviteRemove({ inviteId: id });
        setInvites((prev) => prev.filter((invite) => invite.id !== id));
        toast.success('Invite removed');
    } catch (error) {
      console.error(error);
      toast.error(INVITE_REMOVE_ERROR);
    } finally {
        setRemovingInviteIds((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    },
    [onInviteRemove, removingInviteIds],
  );

  const inviteRoles: FamilyLinkInviteRole[] = ['guardian', 'child'];
  const [editableChildData, setEditableChildData] = React.useState<EditableChildData>(
    () =>
      Object.fromEntries(
        familyMembers.map((member) => {
          const theme = profileThemes[member.id] ?? member.themeKey ?? 'teal';
          return [member.id, { displayName: member.name, themeKey: theme }];
        }),
      ),
  );

  React.useEffect(() => {
    setEditableChildData(
      Object.fromEntries(
        familyMembers.map((member) => {
          const theme = profileThemes[member.id] ?? member.themeKey ?? 'teal';
          return [member.id, { displayName: member.name, themeKey: theme }];
        }),
      ),
    );
  }, [familyMembers, profileThemes]);

  const handleDialogReset = React.useCallback(() => {
    setNewChildDisplayName('');
    setNewChildFirstName('');
    setNewChildLastName('');
    setNewChildGrade('');
    setNewChildBirthYear('');
  }, []);

  const canSubmitChild =
    newChildDisplayName.trim() &&
    newChildFirstName.trim() &&
    newChildLastName.trim() &&
    newChildGrade &&
    newChildBirthYear;

  const handleChildCreate = React.useCallback(async () => {
    if (!onChildProfileCreate) {
      toast.error('Child creation is not configured.');
      return;
    }
    if (!canSubmitChild) {
      toast.error('Please fill all required child fields.');
      return;
    }
    setIsCreatingChild(true);
    try {
      await onChildProfileCreate({
        orgId: familyMembers[0]?.orgId ?? '',
        displayName: newChildDisplayName.trim(),
        firstName: newChildFirstName.trim(),
        lastName: newChildLastName.trim(),
        gradeLevel: newChildGrade,
        birthYear: Number(newChildBirthYear),
        timezone,
        city: location?.city ?? null,
        region: location?.region ?? null,
        countryCode: location?.countryCode ?? null,
        countryName: location?.countryName ?? null,
      });
      toast.success('Child profile submitted');
      handleDialogReset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Unable to create child profile');
    } finally {
      setIsCreatingChild(false);
    }
  }, [
    canSubmitChild,
    familyMembers,
    handleDialogReset,
    location?.city,
    location?.countryCode,
    location?.countryName,
    location?.region,
    newChildBirthYear,
    newChildDisplayName,
    newChildFirstName,
    newChildGrade,
    newChildLastName,
    onChildProfileCreate,
    timezone,
  ]);

  const handleDisplayNameSave = React.useCallback(
    async (member: FamilyMemberItem) => {
      if (!onProfileSave || !member.isChild) {
        return;
      }
      const childData = editableChildData[member.id];
      const nextValue = childData?.displayName.trim() ?? '';
      if (!nextValue || nextValue === member.name) {
        return;
      }

      const promise = Promise.resolve(
        onProfileSave({
          profileId: member.profileId,
          orgId: member.orgId,
          displayName: nextValue,
          firstName: member.firstName ?? '',
          lastName: member.lastName ?? '',
          bio: member.bio ?? undefined,
        }),
      );

      toast.promise(promise, {
        loading: 'Saving display name...',
        success: 'Display name saved',
        error: 'Unable to save display name',
      });
    },
    [editableChildData, onProfileSave],
  );

  const handleAccentChange = React.useCallback(
    (member: FamilyMemberItem, theme: string) => {
      if (!onChildThemeSave || !member.isChild) {
        return;
      }
      const promise = Promise.resolve(
        onChildThemeSave({
          profileId: member.profileId,
          orgId: member.orgId,
          themeKey: theme as ThemeKey,
        }),
      );
      toast.promise(promise, {
        loading: 'Saving accent color...',
        success: 'Accent color saved',
        error: 'Unable to save accent color',
      });
    },
    [onChildThemeSave],
  );

  return (
    <div className="space-y-8 w-full">
      {showToast ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="font-medium text-foreground">
                Please fill out required details to continue.
              </div>
              <div className="text-muted-foreground">
                Fields marked as{' '}
                <span className="relative inline-flex items-center">
                  <BorderBeam
                    size={48}
                    initialOffset={12}
                    borderWidth={2}
                    className="from-transparent via-pink-500 to-transparent"
                    transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                  />
                  <span className="relative z-10 text-destructive">*</span>
                </span>{' '}
                are required.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsToastDismissed(true)}
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
            <h3 className="text-base font-semibold">Parental controls</h3>
            <p className="text-sm text-muted-foreground">
              Parents can link accounts to set limits, manage permissions, and keep the
              family safe across learning spaces.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold">Family members</h3>
          <div className="flex items-center gap-2">
            <Dialog
              open={isDialogOpen}
              onOpenChange={(nextOpen) => {
                setIsDialogOpen(nextOpen);
                if (!nextOpen) {
                  handleDialogReset();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Plus className="size-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a student profile</DialogTitle>
                  <DialogDescription>
                    Required fields are marked with an asterisk. Timezone and location are
                    inherited from your profile.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-display-name">Display name *</Label>
                    <Input
                      id="new-display-name"
                      value={newChildDisplayName}
                      onChange={(event) => setNewChildDisplayName(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-first-name">First name *</Label>
                      <Input
                        id="new-first-name"
                        value={newChildFirstName}
                        onChange={(event) => setNewChildFirstName(event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-last-name">Last name *</Label>
                      <Input
                        id="new-last-name"
                        value={newChildLastName}
                        onChange={(event) => setNewChildLastName(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-grade">Grade level *</Label>
                      <Select
                        value={newChildGrade}
                        onValueChange={(value) => setNewChildGrade(value)}
                        required
                      >
                        <SelectTrigger id="new-grade" className="w-full">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADE_LEVEL_OPTIONS.map((option: string) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-birth-year">Birth year *</Label>
                      <Select
                        value={newChildBirthYear}
                        onValueChange={(value) => setNewChildBirthYear(value)}
                        required
                      >
                        <SelectTrigger id="new-birth-year" className="w-full">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {BIRTH_YEAR_OPTIONS.map((year: number) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Timezone: {timezone ?? 'inherited'}, Location: {location?.city ?? '—'}
                    {location?.region ? `, ${location.region}` : ''} {location?.countryName
                      ? `(${location.countryName})`
                      : ''}
                  </div>
                </div>
                <DialogFooter className="mt-4 flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button size="sm" variant="ghost">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    size="sm"
                    onClick={handleChildCreate}
                    disabled={isCreatingChild}
                  >
                    {isCreatingChild ? 'Creating…' : 'Create student'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <UserPlus className="size-4" />
                  Invite
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite a family member</DialogTitle>
                  <DialogDescription>
                    Select whether the invite is for a guardian or child, then provide
                    their email address. Invitations can be revoked afterwards.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Who are you inviting?</Label>
                    <div className="flex flex-col gap-2">
                      {inviteRoles.map((option) => (
                        <label
                          key={option}
                          className="flex cursor-pointer items-center gap-3 rounded-3xl border px-4 py-2 transition hover:border-foreground"
                        >
                          <input
                            type="radio"
                            name="family-invite-role"
                            value={option}
                            checked={inviteRole === option}
                            onChange={() => setInviteRole(option as 'guardian' | 'child')}
                            className="h-4 w-4 accent-primary"
                          />
                          <span className="text-sm font-medium">
                            {option === 'guardian' ? 'Guardian' : 'Child'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Email</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      value={inviteEmail}
                      onChange={(event) => {
                        setInviteEmail(event.target.value);
                        if (inviteError) {
                          setInviteError(null);
                        }
                      }}
                      placeholder="guardian@example.com"
                    />
                    {inviteError ? (
                      <p className="text-xs text-destructive">{inviteError}</p>
                    ) : null}
                  </div>
                </div>
                <DialogFooter className="mt-4 flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button type="button" size="sm" variant="ghost">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button size="sm" onClick={handleInviteSave} disabled={isInviteSaving}>
                    {isInviteSaving ? 'Sending...' : 'Send invite'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="space-y-1">
              {familyMembers.length ? (
                familyMembers.map((member, index) => {
                  const initials = member.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();
                  const isSelf = !member.canRemove;
                  const editable = editableChildData[member.id];
                  const themeValue = editable?.themeKey ?? profileThemes[member.id] ?? member.themeKey ?? 'teal';
                  const themeClass = `theme-${themeValue}`;
                  const avatarIcon = (
                    <Avatar className={`size-10 border theme-border ${themeClass}`}>
                      <AvatarImage src={member.avatar?.url ?? undefined} />
                      <AvatarFallback className="theme-bg theme-fg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  );
                  const memberNameParts = [member.firstName, member.lastName]
                    .filter(Boolean)
                    .map((part) => part?.trim())
                    .filter(Boolean);
                  const memberDescriptionParts = [
                    memberNameParts.length ? memberNameParts.join(' ') : undefined,
                    member.email,
                  ].filter(Boolean);
                  const subtitle = memberDescriptionParts.length
                    ? memberDescriptionParts.join(' · ')
                    : 'Invitation sent';
                  const displayNameValue = editable?.displayName ?? member.name;
                  const isChildMember = Boolean(member.isChild);
                  return (
                    <UserSettingsTabSection
                      key={member.id}
                      icon={avatarIcon}
                      title={member.name}
                      subtitle={subtitle}
                      badgeIcon={<Badge variant="secondary">{member.roleLabel}</Badge>}
                      showSeparator={
                        index < familyMembers.length - 1 || Boolean(invites.length)
                      }
                    >
                      {isSelf ? (
                        <div className="flex justify-end">
                          <Button variant="destructive" size="sm">
                            Remove from family
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {isChildMember ? (
                            <>
                            <div className="space-y-2">
                              <Label>Display name</Label>
                              <Input
                                value={displayNameValue}
                                onChange={(event) => {
                                  const next = event.target.value;
                                  setEditableChildData((prev) => ({
                                    ...prev,
                                    [member.id]: {
                                      displayName: next,
                                      themeKey: prev[member.id]?.themeKey ?? themeValue,
                                    },
                                  }));
                                }}
                                onBlur={() => {
                                  void handleDisplayNameSave(member);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                    (event.target as HTMLInputElement).blur();
                                  }
                                }}
                              />
                            </div>
                              <div className="space-y-2">
                                <Label>Accent color</Label>
                                <Select
                                  value={themeValue}
                                  onValueChange={(value) => {
                                    setProfileThemes((prev) => ({
                                      ...prev,
                                      [member.id]: value as ThemeKey,
                                    }));
                                    setEditableChildData((prev) => ({
                                      ...prev,
                                      [member.id]: {
                                        displayName: prev[member.id]?.displayName ?? displayNameValue,
                                        themeKey: value as ThemeKey,
                                      },
                                    }));
                                    handleAccentChange(member, value);
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select color" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {profileThemeOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        <span
                                          className={`flex items-center gap-2 theme-${option.value}`}
                                        >
                                          <span className="theme-swatch h-3.5 w-3.5 rounded-full" />
                                          {option.label}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          ) : null}
                          <div className="flex justify-end">
                            <Button variant="destructive" size="sm">
                              Remove from family
                            </Button>
                          </div>
                        </div>
                      )}
                  </UserSettingsTabSection>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No family members added yet.</p>
            )}
          {invites.length ? (
            <>
              {invites.map((invite, index) => {
                const statusLabel =
                  invite.status.charAt(0).toUpperCase() + invite.status.slice(1);
                const subtitleParts = [
                  invite.invitedEmail ?? 'Invitation sent',
                  invite.invitedPhoneE164,
                  statusLabel,
                ].filter(Boolean);
                const isRemoving = Boolean(removingInviteIds[invite.id]);
                return (
                  <UserSettingsTabSection
                    key={invite.id}
                    icon={
                      <Avatar className="size-10 border theme-border theme-slate">
                        <AvatarFallback>
                          {invite.invitedRole === 'child' ? 'CH' : 'GD'}
                        </AvatarFallback>
                      </Avatar>
                    }
                    title={
                      invite.invitedRole === 'child'
                        ? 'Invited child'
                        : 'Invited guardian'
                    }
                    subtitle={subtitleParts.join(' · ')}
                    badgeIcon={<Badge variant="secondary">{statusLabel}</Badge>}
                    showSeparator={index < invites.length - 1}
                  >
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveInvite(invite.id)}
                        disabled={isRemoving}
                      >
                        {isRemoving ? 'Removing...' : 'Remove from family'}
                      </Button>
                    </div>
                  </UserSettingsTabSection>
                );
              })}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
