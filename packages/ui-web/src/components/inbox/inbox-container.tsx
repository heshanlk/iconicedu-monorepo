'use client';

import type React from 'react';
import { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  MessageSquare,
  Paperclip,
  Sparkles,
  Video,
} from 'lucide-react';
import { Badge } from '../../ui/badge';
import { ScrollArea } from '../../ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { ActivityBasic } from '../notification/activity-basic';
import { ActivityBasicWithActionButton } from '../notification/activity-basic-with-action-button';
import { ActivityBasicWithExpandedContent } from '../notification/activity-basic-with-expanded-content';
import { ActivityWithSubitems } from '../notification/activity-with-subitems';
import type { Activity, InboxActivityInput, InboxIconKey } from '@iconicedu/shared-types';

const INBOX_ICON_MAP: Record<InboxIconKey, React.ComponentType<{ className?: string }>> = {
  Bell,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  MessageSquare,
  Paperclip,
  Sparkles,
  Video,
};

const mapActivityInput = (activity: InboxActivityInput): Activity => {
  const { iconKey, actionButton, subActivities, ...rest } = activity;
  const icon = iconKey ? INBOX_ICON_MAP[iconKey] : undefined;
  const actionLabel = actionButton?.label;
  const mappedActionButton = actionButton
    ? {
        ...actionButton,
        onClick: () => {
          console.log(`Action: ${actionLabel}`);
        },
      }
    : undefined;

  return {
    ...rest,
    icon,
    actionButton: mappedActionButton,
    subActivities: subActivities?.map(mapActivityInput),
  };
};

const TAB_FILTERS = {
  all: (_activity: Activity) => true,
  classes: (activity: Activity) => activity.category === 'class',
  payment: (activity: Activity) => activity.category === 'payment',
  system: (activity: Activity) => activity.category === 'system',
} as const;
type TabKey = keyof typeof TAB_FILTERS;

const groupActivitiesByDate = (items: Activity[]): Array<[string, Activity[]]> =>
  Object.entries(
    items.reduce(
      (acc, activity) => {
        if (!acc[activity.date]) {
          acc[activity.date] = [];
        }
        acc[activity.date].push(activity);
        return acc;
      },
      {} as Record<string, Activity[]>,
    ),
  ) as Array<[string, Activity[]]>;

export function InboxContainer({
  activities: activityInputs,
}: {
  activities: InboxActivityInput[];
}) {
  const [activities, setActivities] = useState<Activity[]>(() =>
    activityInputs.map(mapActivityInput),
  );
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const groupedActivities = groupActivitiesByDate(activities);
  const tabFilter = TAB_FILTERS[activeTab];
  const tabCounts = {
    all: activities.filter((activity) => !activity.isRead).length,
    classes: activities.filter(
      (activity) => activity.category === 'class' && !activity.isRead,
    ).length,
    payment: activities.filter(
      (activity) => activity.category === 'payment' && !activity.isRead,
    ).length,
    system: activities.filter(
      (activity) => activity.category === 'system' && !activity.isRead,
    ).length,
  };

  const filteredGroupedActivities = groupedActivities
    .map(([date, dateActivities]) => {
      const filtered = dateActivities.filter(tabFilter);
      return [date, filtered] as const;
    })
    .filter(([, dateActivities]) => dateActivities.length > 0);

  const handleTabChange = (value: string) => {
    if (value in TAB_FILTERS) {
      setActiveTab(value as TabKey);
    }
  };

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === id) {
          return { ...activity, isRead: true };
        }
        // Also mark sub-activities as read
        if (activity.subActivities) {
          return {
            ...activity,
            subActivities: activity.subActivities.map((sub: Activity) =>
              sub.id === id ? { ...sub, isRead: true } : sub,
            ),
          };
        }
        return activity;
      }),
    );
  };

  const renderActivity = (activity: Activity) => {
    if (activity.subActivities?.length) {
      return <ActivityWithSubitems activity={activity} onMarkRead={markAsRead} />;
    }

    if (activity.expandedContent) {
      return (
        <ActivityBasicWithExpandedContent
          activity={activity}
          onMarkRead={markAsRead}
          showActionButton={Boolean(activity.actionButton)}
        />
      );
    }

    if (activity.actionButton) {
      return (
        <ActivityBasicWithActionButton activity={activity} onMarkRead={markAsRead} />
      );
    }

    return <ActivityBasic activity={activity} onMarkRead={markAsRead} />;
  };

  return (
    <Tabs
      value={activeTab}
      defaultValue="all"
      onValueChange={handleTabChange}
      className="flex size-full flex-col"
    >
      <div className="px-4 py-2">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <span>All</span>
            {tabCounts.all > 0 && (
              <Badge className="h-4 px-1.5 text-[10px] bg-rose-500 text-white">
                {tabCounts.all}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="classes" className="gap-2">
            <span>Classes</span>
            {tabCounts.classes > 0 && (
              <Badge className="h-4 px-1.5 text-[10px] bg-rose-500 text-white">
                {tabCounts.classes}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <span>Payment</span>
            {tabCounts.payment > 0 && (
              <Badge className="h-4 px-1.5 text-[10px] bg-rose-500 text-white">
                {tabCounts.payment}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <span>System</span>
            {tabCounts.system > 0 && (
              <Badge className="h-4 px-1.5 text-[10px] bg-rose-500 text-white">
                {tabCounts.system}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value={activeTab} className="mt-0">
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4 space-y-8">
            {filteredGroupedActivities.map(([date, dateActivities]) => (
              <div key={date} className="space-y-1">
                <h2 className="sticky top-0 z-30 -mx-4 mb-4 bg-background/95 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-sm backdrop-blur">
                  {date}
                </h2>
                <div className="space-y-1">
                  {dateActivities.map((activity) => (
                    <div key={activity.id} className="relative">
                      {renderActivity(activity)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
