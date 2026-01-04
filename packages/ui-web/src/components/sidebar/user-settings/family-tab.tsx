import * as React from 'react';
import { ChevronRight, Plus, X } from 'lucide-react';

import type { ThemeKey, UserProfileVM } from '@iconicedu/shared-types';
import { BorderBeam } from '../../../ui/border-beam';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../ui/collapsible';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
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
  const showToast = showOnboardingToast && !isToastDismissed;

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
          <Button variant="outline" size="sm">
            <Plus className="size-4" />
            Add child
          </Button>
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
              return (
                <Collapsible key={member.id} className="rounded-2xl">
                  <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                    <Avatar className={`size-10 border theme-border ${themeClass}`}>
                      <AvatarImage src={member.avatar?.url ?? undefined} />
                      <AvatarFallback className="theme-bg theme-fg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{member.name}</span>
                        <Badge variant="secondary">{member.roleLabel}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {member.email ?? 'Invitation sent'}
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-4">
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
                  </CollapsibleContent>
                  {index < familyMembers.length - 1 ? <Separator /> : null}
                </Collapsible>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No family members added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
