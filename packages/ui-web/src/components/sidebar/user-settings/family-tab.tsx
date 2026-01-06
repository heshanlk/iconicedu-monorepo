'use client';

import * as React from 'react';
import { ChevronRight, Plus, UserPlus, X } from 'lucide-react';

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

type FamilyMemberItem = {
  id: string;
  name: string;
  email?: string;
  avatar?: UserProfileVM['profile']['avatar'] | null;
  roleLabel: string;
  canRemove: boolean;
  themeKey: ThemeKey;
};

type InviteEntry = {
  id: string;
  email: string;
  role: 'guardian' | 'child';
};

type FamilyTabProps = {
  familyMembers: FamilyMemberItem[];
  profileThemes: Record<string, ThemeKey>;
  profileThemeOptions: Array<{ value: string; label: string }>;
  setProfileThemes: React.Dispatch<React.SetStateAction<Record<string, ThemeKey>>>;
  showOnboardingToast?: boolean;
};

export function FamilyTab({
  familyMembers,
  profileThemes,
  profileThemeOptions,
  setProfileThemes,
  showOnboardingToast = false,
}: FamilyTabProps) {
  const [isToastDismissed, setIsToastDismissed] = React.useState(false);
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  const [inviteRole, setInviteRole] = React.useState<'guardian' | 'child'>('guardian');
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteError, setInviteError] = React.useState<string | null>(null);
  const [invites, setInvites] = React.useState<InviteEntry[]>([]);
  const showToast = showOnboardingToast && !isToastDismissed;

  const handleInviteSave = React.useCallback(() => {
    const trimmedEmail = inviteEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setInviteError('Enter a valid email address.');
      return;
    }
    const nextInvite: InviteEntry = {
      id: `invite-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      email: trimmedEmail,
      role: inviteRole,
    };
    setInvites((prev) => [...prev, nextInvite]);
    setInviteEmail('');
    setInviteRole('guardian');
    setInviteError(null);
    setIsInviteOpen(false);
  }, [inviteEmail, inviteRole]);

  const handleRemoveInvite = React.useCallback((id: string) => {
    setInvites((prev) => prev.filter((invite) => invite.id !== id));
  }, []);

  const inviteRoles: Array<InviteEntry['role']> = ['guardian', 'child'];

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
            <Button variant="ghost" size="sm">
              <Plus className="size-4" />
              Add
            </Button>
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
                  <Button size="sm" onClick={handleInviteSave}>
                    Send invite
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Separator />
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
              const themeValue = profileThemes[member.id] ?? member.themeKey ?? 'teal';
              const themeClass = `theme-${themeValue}`;
              const avatarIcon = (
                <Avatar className={`size-10 border theme-border ${themeClass}`}>
                  <AvatarImage src={member.avatar?.url ?? undefined} />
                  <AvatarFallback className="theme-bg theme-fg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              );
              return (
                <UserSettingsTabSection
                  key={member.id}
                  icon={avatarIcon}
                  title={member.name}
                  subtitle={member.email ?? 'Invitation sent'}
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
                      <div className="space-y-2">
                        <Label>Display name</Label>
                        <Input defaultValue={member.name} />
                      </div>
                      <div className="space-y-2">
                        <Label>Accent color</Label>
                        <Select
                          value={themeValue}
                          onValueChange={(value) =>
                            setProfileThemes((prev) => ({
                              ...prev,
                              [member.id]: value as ThemeKey,
                            }))
                          }
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
              <Separator />
              {invites.map((invite, index) => (
                <UserSettingsTabSection
                  key={invite.id}
                  icon={
                    <Avatar className="size-10 border theme-border theme-slate">
                      <AvatarFallback>
                        {invite.role === 'child' ? 'CH' : 'GD'}
                      </AvatarFallback>
                    </Avatar>
                  }
                  title={invite.role === 'child' ? 'Invited child' : 'Invited guardian'}
                  subtitle={`${invite.email} · Invitation sent`}
                  showSeparator={index < invites.length - 1}
                >
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveInvite(invite.id)}
                    >
                      Remove from family
                    </Button>
                  </div>
                </UserSettingsTabSection>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
