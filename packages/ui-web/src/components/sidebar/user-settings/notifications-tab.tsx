import * as React from 'react';
import {
  Bell,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Megaphone,
  MessageCircle,
  ShieldCheck,
  SlidersHorizontal,
  Wallet,
} from 'lucide-react';

import { Button } from '../../../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu';
import { Separator } from '../../../ui/separator';
import { Switch } from '../../../ui/switch';

type NotificationSectionItem = {
  key: string;
  label: string;
};

type NotificationsTabProps = {
  isGuardianOrAdmin: boolean;
  notificationChannels: Record<string, string[]>;
  onNotificationChannelsChange: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
};

export function NotificationsTab({
  isGuardianOrAdmin,
  notificationChannels,
  onNotificationChannelsChange,
}: NotificationsTabProps) {
  const notificationChannelOptions = [
    { key: 'push', label: 'Push' },
    { key: 'email', label: 'Email' },
    { key: 'sms', label: 'SMS' },
    { key: 'whatsapp', label: 'WhatsApp' },
  ];

  const sections = [
    {
      key: 'defaults',
      title: 'Defaults',
      icon: Bell,
      items: [
        {
          key: 'defaults.message_updates',
          label: 'Email updates about new messages and schedule changes',
        },
        { key: 'defaults.weekly_digest', label: 'Weekly digest of learning space activity' },
        { key: 'defaults.sms_reminders', label: 'SMS reminders for upcoming sessions' },
      ],
    },
    {
      key: 'messages',
      title: 'Messages',
      icon: MessageCircle,
      items: [
        { key: 'messages.direct_message', label: 'Email me when I get a direct message' },
        { key: 'messages.teacher_message', label: 'Email me when a teacher messages me' },
        { key: 'messages.mentions', label: 'Notify me about @mentions' },
        { key: 'messages.replies', label: 'Notify me about replies to my messages' },
        { key: 'messages.mute_busy', label: 'Mute busy channels (only @mentions and DMs)' },
      ],
    },
    {
      key: 'schedule',
      title: 'Schedule & Sessions',
      icon: Clock,
      items: [
        { key: 'schedule.upcoming_reminder', label: 'Upcoming session reminder' },
        { key: 'schedule.starting_soon', label: 'Session starting soon' },
        { key: 'schedule.rescheduled', label: 'Session rescheduled' },
        { key: 'schedule.canceled', label: 'Session canceled' },
        { key: 'schedule.no_show', label: 'Tutor running late / no-show alert' },
        { key: 'schedule.makeup', label: 'Make-up session scheduled' },
      ],
    },
    {
      key: 'homework',
      title: 'Homework & Classwork',
      icon: BookOpen,
      items: [
        { key: 'homework.assigned', label: 'New homework assigned' },
        { key: 'homework.due_reminder', label: 'Homework due reminder' },
        { key: 'homework.feedback', label: 'Homework feedback posted' },
        {
          key: 'homework.new_resource',
          label: 'New resource/material added (PDF, link, worksheet)',
        },
      ],
    },
    {
      key: 'progress',
      title: 'Progress & Reports',
      icon: FileText,
      items: [
        { key: 'progress.weekly_report', label: 'Weekly progress report' },
        { key: 'progress.monthly_report', label: 'Monthly progress report' },
        { key: 'progress.attendance_summary', label: 'Attendance summary' },
        { key: 'progress.milestones', label: 'Milestones/achievements (optional)' },
      ],
    },
    {
      key: 'announcements',
      title: 'Announcements',
      icon: Megaphone,
      items: [
        { key: 'announcements.important', label: 'Important announcements from ICONIC' },
        { key: 'announcements.class_posts', label: 'Class announcements (teacher posts)' },
        {
          key: 'announcements.policy_updates',
          label: 'Policy or calendar updates (holidays, closures)',
        },
      ],
    },
    ...(isGuardianOrAdmin
      ? [
          {
            key: 'billing',
            title: 'Billing & Payments',
            icon: Wallet,
            items: [
              { key: 'billing.receipt', label: 'Payment receipt' },
              { key: 'billing.failed', label: 'Payment failed' },
              { key: 'billing.invoice_ready', label: 'Invoice ready' },
              { key: 'billing.refund', label: 'Refund processed' },
              { key: 'billing.renewal', label: 'Plan ending / renewal reminder' },
            ],
          },
        ]
      : []),
    {
      key: 'app',
      title: 'App & Account',
      icon: ShieldCheck,
      items: [
        {
          key: 'app.security_alerts',
          label: 'Security alerts (new login, password change) (recommended always on)',
        },
        { key: 'app.new_device', label: 'New device sign-in' },
        { key: 'app.account_changes', label: 'Account changes (role/invite accepted)' },
      ],
    },
    {
      key: 'digest',
      title: 'Digest & Frequency',
      icon: SlidersHorizontal,
      items: [
        { key: 'digest.instant', label: 'Instant notifications' },
        { key: 'digest.daily', label: 'Daily digest' },
        { key: 'digest.weekly', label: 'Weekly digest' },
        {
          key: 'digest.urgent_only',
          label: 'Only urgent (schedule changes + direct messages)',
        },
      ],
    },
  ];

  const notificationKeys = React.useMemo(
    () =>
      new Set(
        sections.flatMap((section) => section.items.map((item) => item.key)),
      ),
    [sections],
  );

  const scopedChannels = React.useMemo(() => {
    const entries = Object.entries(notificationChannels).filter(([key]) =>
      notificationKeys.has(key),
    );
    return Object.fromEntries(entries);
  }, [notificationChannels, notificationKeys]);

  const toggleNotificationChannel = (itemKey: string, channel: string, enabled: boolean) => {
    onNotificationChannelsChange((prev) => {
      const current = prev[itemKey] ?? [];
      if (enabled) {
        return current.includes(channel)
          ? prev
          : { ...prev, [itemKey]: [...current, channel] };
      }
      return { ...prev, [itemKey]: current.filter((entry) => entry !== channel) };
    });
  };

  const formatNotificationChannels = (itemKey: string) => {
    const selected = scopedChannels[itemKey] ?? [];
    if (!selected.length) {
      return 'Off';
    }
    return selected
      .map(
        (key) => notificationChannelOptions.find((option) => option.key === key)?.label,
      )
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="space-y-8 w-full">
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
          {sections.map((section, index) => {
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
                        key={item.key}
                        className="flex items-start justify-between gap-4 text-sm"
                      >
                        <span className="leading-5">{item.label}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-1 px-2 text-xs">
                              {formatNotificationChannels(item.key)}
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                                  {notificationChannelOptions.map((option) => {
                                    const isChecked =
                                      scopedChannels[item.key]?.includes(option.key) ??
                                      false;
                              return (
                                <DropdownMenuItem
                                  key={option.key}
                                  onSelect={(event) => event.preventDefault()}
                                  className="flex items-center justify-between gap-3"
                                >
                                  <span>{option.label}</span>
                                  <Switch
                                    checked={isChecked}
                                    onCheckedChange={(checked) =>
                                      toggleNotificationChannel(item.key, option.key, checked)
                                    }
                                    aria-label={`${option.label} notifications for ${item.label}`}
                                  />
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
                {index < sections.length - 1 ? <Separator /> : null}
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
}
