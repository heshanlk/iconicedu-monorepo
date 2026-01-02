'use client';

import * as React from 'react';
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  CreditCard,
  MapPin,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from 'lucide-react';

import type {
  FamilyLinkVM,
  FamilyVM,
  ThemeKey,
  UserAccountVM,
  UserProfileVM,
} from '@iconicedu/shared-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../../ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';
import { Button } from '../../ui/button';
import { useSidebar } from '../../ui/sidebar';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Separator } from '../../ui/separator';
import { Switch } from '../../ui/switch';
import { ScrollArea } from '../../ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../ui/collapsible';
import { cn } from '@iconicedu/ui-web/lib/utils';

export type UserSettingsTab =
  | 'account'
  | 'preferences'
  | 'contact'
  | 'location'
  | 'security'
  | 'family'
  | 'billing'
  | 'notifications';

const SETTINGS_TABS: Array<{
  value: UserSettingsTab;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = [
  { value: 'account', label: 'Account', icon: BadgeCheck },
  { value: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { value: 'contact', label: 'Contact', icon: Bell },
  { value: 'location', label: 'Location', icon: MapPin },
  { value: 'security', label: 'Security', icon: ShieldCheck },
  { value: 'family', label: 'Family', icon: Users },
  { value: 'billing', label: 'Billing', icon: CreditCard },
  { value: 'notifications', label: 'Notifications', icon: Bell },
];

const PROFILE_THEME_OPTIONS = [
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' },
  { value: 'amber', label: 'Amber' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'lime', label: 'Lime' },
  { value: 'green', label: 'Green' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'teal', label: 'Teal' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'sky', label: 'Sky' },
  { value: 'blue', label: 'Blue' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'violet', label: 'Violet' },
  { value: 'purple', label: 'Purple' },
  { value: 'fuchsia', label: 'Fuchsia' },
  { value: 'pink', label: 'Pink' },
  { value: 'rose', label: 'Rose' },
];

type UserSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: UserSettingsTab;
  onTabChange: (tab: UserSettingsTab) => void;
  profile: UserProfileVM;
  account?: UserAccountVM | null;
  families?: FamilyVM[] | null;
  familyLinks?: FamilyLinkVM[] | null;
  linkedAccounts?: UserAccountVM[] | null;
  linkedProfiles?: UserProfileVM[] | null;
};

export function UserSettingsDialog({
  open,
  onOpenChange,
  activeTab,
  onTabChange,
  profile,
  account,
  families,
  familyLinks,
  linkedAccounts,
  linkedProfiles,
}: UserSettingsDialogProps) {
  const { isMobile } = useSidebar();

  const content = (
    <UserSettingsTabs
      value={activeTab}
      onValueChange={onTabChange}
      profile={profile}
      account={account}
      families={families}
      familyLinks={familyLinks}
      linkedAccounts={linkedAccounts}
      linkedProfiles={linkedProfiles}
      isMobile={isMobile}
    />
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[85vh]">
          <div className="flex h-full flex-col min-h-0">
            <DrawerHeader className="items-start">
              <DrawerTitle>Settings</DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 min-h-0 px-4 pb-4">{content}</div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[85vh] max-w-[calc(100vw-32px)] p-0 sm:max-w-[680px]">
        <div className="flex h-full flex-col min-h-0">
          <DialogHeader className="p-6">
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage account, billing, and notification preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 px-6 pb-6">{content}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type UserSettingsTabsProps = {
  value: UserSettingsTab;
  onValueChange: (tab: UserSettingsTab) => void;
  profile: UserProfileVM;
  account?: UserAccountVM | null;
  families?: FamilyVM[] | null;
  familyLinks?: FamilyLinkVM[] | null;
  linkedAccounts?: UserAccountVM[] | null;
  linkedProfiles?: UserProfileVM[] | null;
  isMobile: boolean;
};

function UserSettingsTabs({
  value,
  onValueChange,
  profile,
  account,
  families,
  familyLinks,
  linkedAccounts,
  linkedProfiles,
  isMobile,
}: UserSettingsTabsProps) {
  const profileBlock = profile.profile;
  const prefs = profile.prefs;
  const contacts = account?.contacts;
  const email = contacts?.email ?? '';
  const location = profile.location;
  const roles = account?.access?.userRoles ?? [];
  const familyItems = families ?? [];
  const familyLinkItems = familyLinks ?? [];
  const linkedAccountItems = linkedAccounts ?? [];
  const linkedProfileItems = linkedProfiles ?? [];
  const [profileThemes, setProfileThemes] = React.useState<Record<string, ThemeKey>>({});
  const childProfilesByAccountId = React.useMemo(() => {
    const map = new Map<string, UserProfileVM>();
    linkedProfileItems.forEach((item) => {
      map.set(item.ids.accountId, item);
    });
    return map;
  }, [linkedProfileItems]);
  const linkedAccountsById = React.useMemo(() => {
    const map = new Map<string, UserAccountVM>();
    linkedAccountItems.forEach((item) => {
      map.set(item.ids.id, item);
    });
    return map;
  }, [linkedAccountItems]);
  const guardianAccountId = account?.ids.id ?? null;
  const guardianChildLinks = guardianAccountId
    ? familyLinkItems.filter(
        (link) => link.accounts.guardianAccountId === guardianAccountId,
      )
    : [];
  const familyName = familyItems[0]?.displayName ?? 'Family';
  const familyMembers = React.useMemo(() => {
    const members: Array<{
      id: string;
      name: string;
      email?: string;
      avatar?: UserProfileVM['profile']['avatar'] | null;
      roleLabel: string;
      canRemove: boolean;
      themeKey: ThemeKey;
    }> = [];

    members.push({
      id: profile.ids.id,
      name: profileBlock.displayName,
      email: contacts?.email ?? undefined,
      avatar: profileBlock.avatar,
      roleLabel: 'Myself',
      canRemove: false,
      themeKey: profile.ui?.themeKey ?? 'teal',
    });

    guardianChildLinks.forEach((link) => {
      const childProfile = childProfilesByAccountId.get(link.accounts.childAccountId);
      const childAccount = linkedAccountsById.get(link.accounts.childAccountId);
      members.push({
        id: `${link.ids.familyId}-${link.accounts.childAccountId}`,
        name: childProfile?.profile.displayName ?? 'Child',
        email: childAccount?.contacts.email ?? undefined,
        avatar: childProfile?.profile.avatar ?? null,
        roleLabel: link.relation === 'guardian' ? 'Child' : 'Child',
        canRemove: true,
        themeKey: childProfile?.ui?.themeKey ?? 'teal',
      });
    });

    return members;
  }, [
    profile.ids.id,
    profileBlock.avatar,
    profileBlock.displayName,
    contacts?.email,
    profile.ui?.themeKey,
    guardianChildLinks,
    childProfilesByAccountId,
    linkedAccountsById,
  ]);

  return (
    <Tabs
      value={value}
      onValueChange={(next) => onValueChange(next as UserSettingsTab)}
      orientation={isMobile ? 'horizontal' : 'vertical'}
      className="w-full h-full"
    >
      <div
        className={cn(
          isMobile
            ? 'flex min-h-0 flex-1 flex-col gap-4'
            : 'grid min-h-0 h-full grid-cols-[180px_1fr] gap-6',
        )}
      >
        <TabsList
          variant="line"
          className={cn(
            'bg-transparent p-0',
            isMobile
              ? 'w-full flex-nowrap justify-start gap-2 overflow-x-auto sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70'
              : 'w-full flex-col items-stretch',
          )}
        >
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="gap-2 after:hidden data-[state=active]:bg-muted/50"
              >
                <Icon className="size-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <ScrollArea className={cn('min-h-0 flex-1', isMobile && 'flex-1')}>
          <TabsContent value="account" className="mt-0 space-y-8">
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Profile</h3>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-name">Display name</Label>
                  <Input id="settings-name" readOnly value={profileBlock.displayName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input id="settings-email" readOnly value={email} />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Presence</h3>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-status">Status</Label>
                  <Input
                    id="settings-status"
                    readOnly
                    value={profile.presence?.state.text ?? 'Available'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-last-seen">Last seen</Label>
                  <Input
                    id="settings-last-seen"
                    readOnly
                    value={profile.presence?.lastSeenAt ?? 'Just now'}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="mt-0 space-y-8">
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Locale & time</h3>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-timezone">Timezone</Label>
                  <Input id="settings-timezone" readOnly value={prefs.timezone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-locale">Locale</Label>
                  <Input id="settings-locale" readOnly value={prefs.locale ?? 'Auto'} />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Languages</h3>
              <Separator />
              {prefs.languagesSpoken?.length ? (
                <div className="flex flex-wrap gap-2">
                  {prefs.languagesSpoken.map((language) => (
                    <Badge key={language} variant="secondary">
                      {language}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No languages added yet.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-0 space-y-8">
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Contact methods</h3>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-email-address">Email</Label>
                  <Input
                    id="settings-email-address"
                    readOnly
                    value={contacts?.email ?? 'Not provided'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-phone">Phone</Label>
                  <Input
                    id="settings-phone"
                    readOnly
                    value={contacts?.phoneE164 ?? 'Not provided'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-whatsapp">WhatsApp</Label>
                  <Input
                    id="settings-whatsapp"
                    readOnly
                    value={contacts?.whatsappE164 ?? 'Not provided'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-preferred">Preferred channels</Label>
                  <Input
                    id="settings-preferred"
                    readOnly
                    value={contacts?.preferredContactChannels?.join(', ') ?? 'Auto'}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location" className="mt-0 space-y-8">
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Location</h3>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-country">Country</Label>
                  <Input
                    id="settings-country"
                    readOnly
                    value={location?.countryName ?? location?.countryCode ?? 'Not set'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-region">Region / State</Label>
                  <Input
                    id="settings-region"
                    readOnly
                    value={location?.region ?? 'Not set'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-city">City</Label>
                  <Input
                    id="settings-city"
                    readOnly
                    value={location?.city ?? 'Not set'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-postal">Postal code</Label>
                  <Input
                    id="settings-postal"
                    readOnly
                    value={location?.postalCode ?? 'Not set'}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-0 space-y-8">
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Account status</h3>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-account-status">Status</Label>
                  <Input
                    id="settings-account-status"
                    readOnly
                    value={account?.lifecycle.status ?? 'active'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-account-created">Created</Label>
                  <Input
                    id="settings-account-created"
                    readOnly
                    value={account?.lifecycle.createdAt ?? profile.meta.createdAt}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Roles & access</h3>
              <Separator />
              {roles.length ? (
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <Badge key={role.ids.id} variant="secondary">
                      {role.roleKey}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No roles assigned.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="family" className="mt-0 space-y-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">Parental controls</h3>
                  <p className="text-sm text-muted-foreground">
                    Parents can link accounts to set limits, manage permissions, and keep
                    the family safe across learning spaces.
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
                    const themeValue =
                      profileThemes[member.id] ?? member.themeKey ?? 'teal';
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
                                <Label>Profile theme</Label>
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
                                    <SelectValue placeholder="Select theme" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PROFILE_THEME_OPTIONS.map((option) => (
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
                  <p className="text-sm text-muted-foreground">
                    No family members added yet.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-0 space-y-8">
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Plan</h3>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-2">
                  <Label htmlFor="settings-plan">Current plan</Label>
                  <Input id="settings-plan" readOnly value="Family Plus" />
                </div>
                <Button variant="outline">Manage plan</Button>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Payment method</h3>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-2">
                  <Label htmlFor="settings-card">Card</Label>
                  <Input id="settings-card" readOnly value="Visa •••• 4242" />
                </div>
                <Button variant="outline">Update card</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 space-y-8">
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Notifications</h3>
              <Separator />
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-defaults">Defaults</Label>
                  <Input
                    id="settings-defaults"
                    readOnly
                    value={
                      prefs.notificationDefaults
                        ? 'Custom preferences'
                        : 'System defaults'
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="flex items-start gap-3 text-sm">
                  <Checkbox defaultChecked />
                  <span className="leading-5">
                    Email updates about new messages and schedule changes.
                  </span>
                </Label>
                <Label className="flex items-start gap-3 text-sm">
                  <Checkbox defaultChecked />
                  <span className="leading-5">
                    Weekly digest of learning space activity.
                  </span>
                </Label>
                <Label className="flex items-start gap-3 text-sm">
                  <Checkbox />
                  <span className="leading-5">SMS reminders for upcoming sessions.</span>
                </Label>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </div>
    </Tabs>
  );
}
