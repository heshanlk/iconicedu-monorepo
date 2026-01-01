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
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Separator } from '../../ui/separator';
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
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="items-start">
            <DrawerTitle>Settings</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-32px)] p-0 sm:max-w-[680px]">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage account, billing, and notification preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">{content}</div>
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
    }> = [];

    members.push({
      id: profile.ids.id,
      name: profileBlock.displayName,
      email: contacts?.email ?? undefined,
      avatar: profileBlock.avatar,
      roleLabel: 'Parent',
      canRemove: false,
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
      });
    });

    return members;
  }, [
    profile.ids.id,
    profileBlock.avatar,
    profileBlock.displayName,
    contacts?.email,
    guardianChildLinks,
    childProfilesByAccountId,
    linkedAccountsById,
  ]);

  return (
    <Tabs
      value={value}
      onValueChange={(next) => onValueChange(next as UserSettingsTab)}
      orientation={isMobile ? 'horizontal' : 'vertical'}
      className="w-full"
    >
      <div
        className={cn(
          isMobile ? 'space-y-4' : 'grid min-h-[420px] grid-cols-[180px_1fr] gap-6',
        )}
      >
        <TabsList
          variant="line"
          className={cn(
            'bg-transparent p-0',
            isMobile
              ? 'w-full flex-nowrap justify-start gap-2 overflow-x-auto'
              : 'w-full flex-col items-stretch',
          )}
        >
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                <Icon className="size-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="min-h-0">
          <TabsContent value="account" className="mt-0 space-y-6">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-name">Display name</Label>
                  <Input id="settings-name" readOnly value={profileBlock.displayName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input id="settings-email" readOnly value={email} />
                </div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle>Presence</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-0 space-y-6">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Locale & time</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-timezone">Timezone</Label>
                  <Input id="settings-timezone" readOnly value={prefs.timezone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-locale">Locale</Label>
                  <Input id="settings-locale" readOnly value={prefs.locale ?? 'Auto'} />
                </div>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-0 space-y-6">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Contact methods</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="mt-0 space-y-6">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-0 space-y-6">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Account status</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
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
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle>Roles & access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="family" className="mt-0 space-y-6">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Parental controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Parents can link accounts to set limits, manage permissions, and keep
                  the family safe across learning spaces.
                </p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Family members</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="size-4" />
                  Add child
                </Button>
              </CardHeader>
              <CardContent className="space-y-1">
                {familyMembers.length ? (
                  familyMembers.map((member, index) => {
                    const initials = member.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <Collapsible
                        key={member.id}
                        className="rounded-2xl border border-border/60"
                      >
                        <CollapsibleTrigger className="flex w-full items-center gap-3 px-3 py-3 text-left">
                          <Avatar className="size-10">
                            <AvatarImage src={member.avatar?.url ?? undefined} />
                            <AvatarFallback>{initials}</AvatarFallback>
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
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="border-t border-border/60 px-3 py-3">
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" size="sm">
                                Change name
                              </Button>
                              <Button variant="outline" size="sm">
                                Change photo
                              </Button>
                              {member.canRemove ? (
                                <Button variant="destructive" size="sm">
                                  Remove from family
                                </Button>
                              ) : null}
                            </div>
                            <div className="space-y-4 text-sm">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="font-medium">Quiet hours</div>
                                  <div className="text-xs text-muted-foreground">
                                    Schedule hours when learning spaces are muted.
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  Enabled
                                </Button>
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-2">
                                  <Label>Start time</Label>
                                  <Input readOnly value="7:00 PM" />
                                </div>
                                <div className="space-y-2">
                                  <Label>End time</Label>
                                  <Input readOnly value="7:00 AM" />
                                </div>
                              </div>
                              <Separator />
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="font-medium">
                                    Reduce sensitive content
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Add extra safeguards for younger learners.
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  On
                                </Button>
                              </div>
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="font-medium">
                                    Improve experiences for everyone
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Allow anonymized data to improve lessons.
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  Off
                                </Button>
                              </div>
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="font-medium">Voice mode</div>
                                  <div className="text-xs text-muted-foreground">
                                    Enable voice for guided practice.
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  On
                                </Button>
                              </div>
                            </div>
                          </div>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-0 space-y-6">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Plan</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-2">
                  <Label htmlFor="settings-plan">Current plan</Label>
                  <Input id="settings-plan" readOnly value="Family Plus" />
                </div>
                <Button variant="outline">Manage plan</Button>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle>Payment method</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-2">
                  <Label htmlFor="settings-card">Card</Label>
                  <Input id="settings-card" readOnly value="Visa •••• 4242" />
                </div>
                <Button variant="outline">Update card</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 space-y-6">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
