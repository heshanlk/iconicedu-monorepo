'use client';

import * as React from 'react';
import {
  BadgeCheck,
  Bell,
  Briefcase,
  BookOpen,
  ChevronRight,
  Clock,
  CreditCard,
  Lightbulb,
  FileText,
  Globe,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  MessageCircle,
  Megaphone,
  Palette,
  Phone,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  User,
  Users,
  Wallet,
} from 'lucide-react';

import type { ThemeKey, UserAccountVM, UserProfileVM } from '@iconicedu/shared-types';
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
import { Button } from '../../ui/button';
import { useSidebar } from '../../ui/sidebar';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Separator } from '../../ui/separator';
import { Switch } from '../../ui/switch';
import { ScrollArea } from '../../ui/scroll-area';
import { Textarea } from '../../ui/textarea';
import { Card, CardAction, CardContent } from '../../ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../../ui/input-group';
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
  | 'profile'
  | 'preferences'
  | 'location'
  | 'family'
  | 'notifications';

const SETTINGS_TABS: Array<{
  value: UserSettingsTab;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = [
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'account', label: 'Account', icon: BadgeCheck },
  { value: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { value: 'location', label: 'Location', icon: MapPin },
  { value: 'family', label: 'Family', icon: Users },
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
};

export function UserSettingsDialog({
  open,
  onOpenChange,
  activeTab,
  onTabChange,
  profile,
  account,
}: UserSettingsDialogProps) {
  const { isMobile } = useSidebar();

  const content = (
    <UserSettingsTabs
      value={activeTab}
      onValueChange={onTabChange}
      profile={profile}
      account={account}
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
  isMobile: boolean;
};

function UserSettingsTabs({
  value,
  onValueChange,
  profile,
  account,
  isMobile,
}: UserSettingsTabsProps) {
  const profileBlock = profile.profile;
  const prefs = profile.prefs;
  const contacts = account?.contacts;
  const email = contacts?.email ?? '';
  const preferredChannels = contacts?.preferredContactChannels ?? [];
  const location = profile.location;
  const roles = account?.access?.userRoles ?? [];
  const orgLabel = account?.ids.orgId ?? 'Unknown org';
  const [profileThemes, setProfileThemes] = React.useState<Record<string, ThemeKey>>({});
  const [preferredChannelSelections, setPreferredChannelSelections] =
    React.useState<string[]>(preferredChannels);
  const currentThemeKey = profileThemes[profile.ids.id] ?? profile.ui?.themeKey ?? 'teal';
  const currentThemeLabel =
    PROFILE_THEME_OPTIONS.find((option) => option.value === currentThemeKey)?.label ??
    'Accent color';
  const isGuardianOrAdmin =
    profile.kind === 'guardian' ||
    roles.some((role) => role.roleKey === 'admin' || role.roleKey === 'owner');
  const childProfile = profile.kind === 'child' ? profile : null;
  const educatorProfile = profile.kind === 'educator' ? profile : null;
  const staffProfile = profile.kind === 'staff' ? profile : null;

  const togglePreferredChannel = (channel: string, enabled: boolean) => {
    setPreferredChannelSelections((prev) => {
      if (enabled) {
        return prev.includes(channel) ? prev : [...prev, channel];
      }
      return prev.filter((item) => item !== channel);
    });
  };

  const NOTIFICATION_UI_SECTIONS = [
    {
      key: 'defaults',
      title: 'Defaults',
      icon: Bell,
      items: [
        'Email updates about new messages and schedule changes',
        'Weekly digest of learning space activity',
        'SMS reminders for upcoming sessions',
      ],
    },
    {
      key: 'messages',
      title: 'Messages',
      icon: MessageCircle,
      items: [
        'Email me when I get a direct message',
        'Email me when a teacher messages me',
        'Notify me about @mentions',
        'Notify me about replies to my messages',
        'Mute busy channels (only @mentions and DMs)',
      ],
    },
    {
      key: 'schedule',
      title: 'Schedule & Sessions',
      icon: Clock,
      items: [
        'Upcoming session reminder',
        'Session starting soon',
        'Session rescheduled',
        'Session canceled',
        'Tutor running late / no-show alert',
        'Make-up session scheduled',
      ],
    },
    {
      key: 'homework',
      title: 'Homework & Classwork',
      icon: BookOpen,
      items: [
        'New homework assigned',
        'Homework due reminder',
        'Homework feedback posted',
        'New resource/material added (PDF, link, worksheet)',
      ],
    },
    {
      key: 'progress',
      title: 'Progress & Reports',
      icon: FileText,
      items: [
        'Weekly progress report',
        'Monthly progress report',
        'Attendance summary',
        'Milestones/achievements (optional)',
      ],
    },
    {
      key: 'announcements',
      title: 'Announcements',
      icon: Megaphone,
      items: [
        'Important announcements from ICONIC',
        'Class announcements (teacher posts)',
        'Policy or calendar updates (holidays, closures)',
      ],
    },
    ...(isGuardianOrAdmin
      ? [
          {
            key: 'billing',
            title: 'Billing & Payments',
            icon: Wallet,
            items: [
              'Payment receipt',
              'Payment failed',
              'Invoice ready',
              'Refund processed',
              'Plan ending / renewal reminder',
            ],
          },
        ]
      : []),
    {
      key: 'app',
      title: 'App & Account',
      icon: ShieldCheck,
      items: [
        'Security alerts (new login, password change) (recommended always on)',
        'New device sign-in',
        'Account changes (role/invite accepted)',
      ],
    },
    {
      key: 'digest',
      title: 'Digest & Frequency',
      icon: SlidersHorizontal,
      items: [
        'Instant notifications',
        'Daily digest',
        'Weekly digest',
        'Only urgent (schedule changes + direct messages)',
      ],
    },
  ];
  const guardianChildren =
    profile.kind === 'guardian' ? (profile.children?.items ?? []) : [];
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

    guardianChildren.forEach((childProfile) => {
      members.push({
        id: childProfile.ids.id,
        name: childProfile.profile.displayName ?? 'Child',
        email: undefined,
        avatar: childProfile.profile.avatar ?? null,
        roleLabel: 'Child',
        canRemove: true,
        themeKey: childProfile.ui?.themeKey ?? 'teal',
      });
    });

    return members;
  }, [
    profile.ids.id,
    profileBlock.avatar,
    profileBlock.displayName,
    contacts?.email,
    profile.ui?.themeKey,
    guardianChildren,
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
            ? 'flex min-h-0 flex-1 flex-col gap-4 w-full'
            : 'grid min-h-0 h-full w-full grid-cols-[180px_1fr] gap-6',
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

        <ScrollArea className={cn('min-h-0 flex-1 w-full min-w-0', isMobile && 'flex-1')}>
          <TabsContent value="profile" className="mt-0 space-y-8 w-full">
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
                    <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
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
                          <div className="text-xs text-muted-foreground">
                            JPG, PNG up to 5MB.
                          </div>
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
                          {childProfile?.gradeLevel ?? 'Grade not set'}
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="py-4 w-full">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="settings-grade">Grade level</Label>
                          <Input
                            id="settings-grade"
                            defaultValue={childProfile?.gradeLevel ?? ''}
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
                      <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
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
                      <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
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
                      <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="py-4 w-full">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="settings-learning-preferences">
                            Learning preferences
                          </Label>
                          <Input
                            id="settings-learning-preferences"
                            defaultValue={
                              childProfile?.learningPreferences?.join(', ') ?? ''
                            }
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="settings-motivation">Motivation styles</Label>
                          <Input
                            id="settings-motivation"
                            defaultValue={
                              childProfile?.motivationStyles?.join(', ') ?? ''
                            }
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
                        <div className="text-sm font-medium">
                          Communication & confidence
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {childProfile?.confidenceLevel ?? 'Not set'}
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
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
                          <Label htmlFor="settings-communication">
                            Communication style
                          </Label>
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
                      <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
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
                            defaultValue={educatorProfile?.subjects?.join(', ') ?? ''}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="settings-educator-grades">
                            Grades supported
                          </Label>
                          <Input
                            id="settings-educator-grades"
                            defaultValue={
                              educatorProfile?.gradesSupported?.join(', ') ?? ''
                            }
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
                          {educatorProfile?.subjects?.join(', ') ?? 'Subjects not set'}
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="py-4 w-full">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="settings-educator-experience">
                            Experience years
                          </Label>
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
                          {educatorProfile?.curriculumTags?.join(', ') ?? 'Not set'}
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
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
                          <Label htmlFor="settings-educator-curriculum">
                            Curriculum tags
                          </Label>
                          <Input
                            id="settings-educator-curriculum"
                            defaultValue={
                              educatorProfile?.curriculumTags?.join(', ') ?? ''
                            }
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
                      <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="py-4 w-full">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="settings-staff-hours">
                            Working hours rules
                          </Label>
                          <Input
                            id="settings-staff-hours"
                            defaultValue={
                              staffProfile?.workingHoursRules?.join(', ') ?? ''
                            }
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
          </TabsContent>

          <TabsContent value="account" className="mt-0 space-y-8 w-full">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">Account Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage email, password, and contact verification settings.
                  </p>
                </div>
              </div>
              <div className="space-y-1 w-full">
                <Collapsible className="rounded-2xl w-full">
                  <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-xs text-muted-foreground">
                        {contacts?.email ?? 'Not provided'}
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-4 w-full">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="settings-account-email">Email</Label>
                        <InputGroup>
                          <InputGroupInput
                            id="settings-account-email"
                            defaultValue={email}
                            aria-label="Email"
                          />
                          <InputGroupAddon align="inline-end">
                            {contacts?.emailVerified ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                <BadgeCheck className="h-3 w-3" />
                                <span className="sr-only">Verified</span>
                              </Badge>
                            ) : (
                              <Badge className="bg-muted text-muted-foreground">
                                <BadgeCheck className="h-3 w-3 text-muted-foreground" />
                                <span className="sr-only">Not verified</span>
                              </Badge>
                            )}
                            {contacts?.verifiedAt ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-xs text-muted-foreground cursor-help">
                                    Verified on
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>{contacts.verifiedAt}</TooltipContent>
                              </Tooltip>
                            ) : null}
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                      <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
                        <div>
                          <div className="text-sm font-medium">
                            Receive notifications by email
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Use this email for account alerts and reminders.
                          </div>
                        </div>
                        <Switch
                          checked={preferredChannelSelections.includes('email')}
                          onCheckedChange={(checked) =>
                            togglePreferredChannel('email', checked)
                          }
                          aria-label="Receive notifications by email"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="settings-account-password">New password</Label>
                        <Input id="settings-account-password" type="password" />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="settings-account-password-confirm">
                          Confirm password
                        </Label>
                        <Input id="settings-account-password-confirm" type="password" />
                      </div>
                      <div className="sm:col-span-2 flex justify-end">
                        <Button size="sm">Save</Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <Separator />
              </div>
              <div className="space-y-1 w-full">
                <Collapsible className="rounded-2xl w-full">
                  <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Phone</div>
                      <div className="text-xs text-muted-foreground">
                        {contacts?.phoneE164 ?? 'Not provided'}
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-4 w-full">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="settings-account-phone">Phone</Label>
                        <InputGroup>
                          <InputGroupInput
                            id="settings-account-phone"
                            defaultValue={contacts?.phoneE164 ?? ''}
                            aria-label="Phone"
                          />
                          <InputGroupAddon align="inline-end">
                            {contacts?.phoneVerified ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                <BadgeCheck className="h-3 w-3" />
                                <span className="sr-only">Verified</span>
                              </Badge>
                            ) : (
                              <Badge className="bg-muted text-muted-foreground">
                                <BadgeCheck className="h-3 w-3 text-muted-foreground" />
                                <span className="sr-only">Not verified</span>
                              </Badge>
                            )}
                            {contacts?.verifiedAt ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-xs text-muted-foreground cursor-help">
                                    Verified on
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>{contacts.verifiedAt}</TooltipContent>
                              </Tooltip>
                            ) : null}
                          </InputGroupAddon>
                        </InputGroup>
                        {contacts?.verifiedAt ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs text-muted-foreground cursor-help">
                                Verified on
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{contacts.verifiedAt}</TooltipContent>
                          </Tooltip>
                        ) : null}
                      </div>
                      {contacts?.phoneVerified ? (
                        <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
                          <div>
                            <div className="text-sm font-medium">
                              Receive notifications by phone
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Use SMS for alerts and reminders.
                            </div>
                          </div>
                          <Switch
                            checked={preferredChannelSelections.includes('sms')}
                            onCheckedChange={(checked) =>
                              togglePreferredChannel('sms', checked)
                            }
                            aria-label="Receive notifications by phone"
                          />
                        </div>
                      ) : null}
                      <div className="sm:col-span-2 flex justify-end">
                        <Button size="sm">Save</Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <Separator />
              </div>
              <div className="space-y-1 w-full">
                <Collapsible className="rounded-2xl w-full">
                  <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">WhatsApp</div>
                      <div className="text-xs text-muted-foreground">
                        {contacts?.whatsappE164 ?? 'Not provided'}
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-4 w-full">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="settings-account-whatsapp">WhatsApp</Label>
                        <InputGroup>
                          <InputGroupInput
                            id="settings-account-whatsapp"
                            defaultValue={contacts?.whatsappE164 ?? ''}
                            aria-label="WhatsApp"
                          />
                          <InputGroupAddon align="inline-end">
                            {contacts?.whatsappVerified ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                <BadgeCheck className="h-3 w-3" />
                                <span className="sr-only">Verified</span>
                              </Badge>
                            ) : (
                              <Badge className="bg-muted text-muted-foreground">
                                <BadgeCheck className="h-3 w-3 text-muted-foreground" />
                                <span className="sr-only">Not verified</span>
                              </Badge>
                            )}
                            {contacts?.verifiedAt ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-xs text-muted-foreground cursor-help">
                                    Verified on
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>{contacts.verifiedAt}</TooltipContent>
                              </Tooltip>
                            ) : null}
                          </InputGroupAddon>
                        </InputGroup>
                        {contacts?.verifiedAt ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs text-muted-foreground cursor-help">
                                Verified on
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{contacts.verifiedAt}</TooltipContent>
                          </Tooltip>
                        ) : null}
                      </div>
                      {contacts?.whatsappVerified ? (
                        <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
                          <div>
                            <div className="text-sm font-medium">
                              Receive notifications by WhatsApp
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Use WhatsApp for alerts and reminders.
                            </div>
                          </div>
                          <Switch
                            checked={preferredChannelSelections.includes('whatsapp')}
                            onCheckedChange={(checked) =>
                              togglePreferredChannel('whatsapp', checked)
                            }
                            aria-label="Receive notifications by WhatsApp"
                          />
                        </div>
                      ) : null}
                      <div className="sm:col-span-2 flex justify-end">
                        <Button size="sm">Save</Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="mt-0 space-y-8 w-full">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your locale, language, and appearance settings.
                  </p>
                </div>
              </div>
              <div className="space-y-1 w-full">
                <Collapsible className="rounded-2xl w-full">
                  <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                      <Palette className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Accent color</div>
                      <div className="text-xs text-muted-foreground">
                        {currentThemeLabel}
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-4 w-full">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Accent color</Label>
                        <Select
                          value={currentThemeKey}
                          onValueChange={(value) =>
                            setProfileThemes((prev) => ({
                              ...prev,
                              [profile.ids.id]: value as ThemeKey,
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select color" />
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
                      <Clock className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Timezone</div>
                      <div className="text-xs text-muted-foreground">
                        {prefs.timezone}
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-4 w-full">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="settings-timezone">Timezone</Label>
                        <Input id="settings-timezone" defaultValue={prefs.timezone} />
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
                      <Globe className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Locale</div>
                      <div className="text-xs text-muted-foreground">
                        {prefs.locale ?? 'Auto'}
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-4 w-full">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="settings-locale">Locale</Label>
                        <Input id="settings-locale" defaultValue={prefs.locale ?? ''} />
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
                      <Languages className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Languages spoken</div>
                      <div className="text-xs text-muted-foreground">
                        {prefs.languagesSpoken?.length
                          ? prefs.languagesSpoken.join(', ')
                          : 'Not set'}
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-4 w-full">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="settings-languages">Languages spoken</Label>
                        <Input
                          id="settings-languages"
                          defaultValue={prefs.languagesSpoken?.join(', ') ?? ''}
                          placeholder="English, Spanish"
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
          </TabsContent>

          <TabsContent value="location" className="mt-0 space-y-8 w-full">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your country, region, and local address details.
                  </p>
                </div>
              </div>
              <div className="space-y-1 w-full">
                <Collapsible className="rounded-2xl w-full">
                  <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Address</div>
                      <div className="text-xs text-muted-foreground">
                        {location?.city ?? 'City'}, {location?.region ?? 'State'}{' '}
                        {location?.postalCode ?? 'Zip'} •{' '}
                        {location?.countryName ?? location?.countryCode ?? 'Country'}
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-4 w-full">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="settings-city">City</Label>
                        <Input id="settings-city" defaultValue={location?.city ?? ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="settings-region">State</Label>
                        <Input
                          id="settings-region"
                          defaultValue={location?.region ?? ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="settings-postal">Zip</Label>
                        <Input
                          id="settings-postal"
                          defaultValue={location?.postalCode ?? ''}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="settings-country">Country</Label>
                        <Input
                          id="settings-country"
                          defaultValue={
                            location?.countryName ?? location?.countryCode ?? ''
                          }
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
          </TabsContent>

          <TabsContent value="family" className="mt-0 space-y-8 w-full">
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

          <TabsContent value="notifications" className="mt-0 space-y-8 w-full">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure alerts, digests, and account notifications.
                  </p>
                </div>
              </div>
              <div className="space-y-1 w-full">
                {NOTIFICATION_UI_SECTIONS.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <Collapsible key={section.key} className="rounded-2xl w-full">
                      <CollapsibleTrigger className="group flex w-full items-center gap-3 py-3 text-left">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{section.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {section.items.length} options
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="py-4 w-full">
                        <div className="space-y-3">
                          {section.items.map((item) => (
                            <div
                              key={item}
                              className="flex items-start justify-between gap-4 text-sm"
                            >
                              <span className="leading-5">{item}</span>
                              <Switch aria-label={item} />
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                      {index < NOTIFICATION_UI_SECTIONS.length - 1 ? <Separator /> : null}
                    </Collapsible>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </div>
    </Tabs>
  );
}
