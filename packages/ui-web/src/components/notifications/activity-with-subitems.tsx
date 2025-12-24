'use client';

import type React from 'react';
import { useState } from 'react';
import {
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  MessageSquare,
  Paperclip,
  Sparkles,
  Video,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { cn } from '../../lib/utils';
import { ActivityWithButton } from './activity-with-button';
import { ActivityBasic } from './activity-basic';
import type { Activity } from './types';

type ActivityWithSubitemsProps = {
  activity: Activity;
  isSubActivity?: boolean;
  parentExpanded?: boolean;
  onMarkRead: (id: string, event: React.MouseEvent) => void;
  className?: string;
};

const READ_ICON_CLASS = 'bg-muted text-muted-foreground';

const ICON_MAP: Record<string, LucideIcon> = {
  MessageSquare,
  Video,
  FileText,
  Sparkles,
  Paperclip,
  Bell,
  ClipboardCheck,
  GraduationCap,
  CheckCircle2,
  CreditCard,
};

const ALERT_RENDERERS: Partial<
  Record<Activity['type'], (activity: Activity) => React.ReactElement>
> = {
  payment: (activity) => (
    <ActivityBasic activity={activity} className="bg-red-100 text-red-600" />
  ),
  survey: (activity) => (
    <ActivityBasic activity={activity} className="bg-cyan-100 text-cyan-600" />
  ),
  'complete-class': (activity) => (
    <ActivityBasic activity={activity} className="bg-yellow-100 text-yellow-600" />
  ),
  reminder: (activity) => (
    <ActivityBasic activity={activity} className="bg-purple-100 text-purple-600" />
  ),
};

export function ActivityWithSubitems({
  activity,
  isSubActivity = false,
  parentExpanded = false,
  onMarkRead,
  className,
}: ActivityWithSubitemsProps) {
  const hasSubActivities = Boolean(activity.subActivities?.length);
  const [isCollapsed, setIsCollapsed] = useState(hasSubActivities);
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = activity.icon ? ICON_MAP[activity.icon] : undefined;
  const alertRenderer = ALERT_RENDERERS[activity.type];

  const handleToggle = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('button[data-action-button="true"]')) {
      return;
    }

    if (hasSubActivities) {
      setIsCollapsed((prev) => !prev);
      return;
    }

    if (activity.expandedContent) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div className={cn('relative', className)}>
      {!isSubActivity && hasSubActivities && isCollapsed && (
        <div className="absolute left-[52px] top-2 right-0 bottom-2 pointer-events-none">
          <div className="absolute inset-0 rounded-lg bg-muted/20 translate-y-1 translate-x-1" />
          <div className="absolute inset-0 rounded-lg bg-muted/15 translate-y-2 translate-x-2" />
        </div>
      )}

      <div className="flex items-start gap-3 py-2.5">
        <div className="relative flex shrink-0 flex-col items-center">
          {isSubActivity && (
            <svg
              className="absolute -top-3 left-1/2 -translate-x-1/2"
              width="24"
              height="30"
              viewBox="0 0 24 30"
              fill="none"
            >
              <path
                d="M 12 0 Q 12 15, 24 30"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-border"
              />
            </svg>
          )}

          <div
            className={cn(
              'z-10 flex size-6 items-center justify-center rounded-full',
              activity.isRead ? READ_ICON_CLASS : activity.iconBg,
            )}
          >
            {Icon ? <Icon className="size-3" /> : null}
          </div>
        </div>

        <div
          className="shrink-0 pt-0.5 text-xs text-muted-foreground"
          style={{ width: '48px' }}
        >
          {activity.timestamp}
        </div>

        <div
          onClick={handleToggle}
          className={cn(
            'group relative z-10 flex min-w-0 flex-1 items-start gap-2.5 rounded-md px-2 py-1 -mx-2 transition-all duration-200',
            !isSubActivity && 'cursor-pointer hover:bg-muted/50',
            !isSubActivity && hasSubActivities && !isCollapsed && 'bg-muted/30 shadow-sm',
            isSubActivity && parentExpanded && 'bg-muted/30',
          )}
        >
          {alertRenderer ? (
            alertRenderer(activity)
          ) : activity.type === 'ai-summary' ? (
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
              <Sparkles className="size-3.5" />
            </div>
          ) : activity.participants && activity.participants.length > 1 ? (
            <div className="flex shrink-0 -space-x-1.5 pt-0.5">
              {activity.participants.slice(0, 4).map((participant, idx) => (
                <Avatar key={idx} className="size-6 border-2 border-background">
                  <AvatarImage src={participant.avatar || '/placeholder.svg'} />
                  <AvatarFallback className="text-[10px]">
                    {participant.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
              {activity.participants.length > 4 && (
                <Avatar className="size-6 border-2 border-background">
                  <AvatarFallback className="text-[10px]">
                    +{activity.participants.length - 4}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ) : (
            <Avatar className="size-6 shrink-0">
              <AvatarImage src={activity.avatar || '/placeholder.svg'} />
              <AvatarFallback className="text-[10px]">
                {activity.initials}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <p className="text-sm leading-tight text-pretty">
                <span className="font-semibold text-foreground">{activity.actor}</span>{' '}
                <span className="text-muted-foreground">{activity.action}</span>{' '}
                {activity.target && (
                  <span className="font-medium text-foreground">{activity.target}</span>
                )}
              </p>

              {!activity.isRead && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(event) => onMarkRead(activity.id, event)}
                  data-action-button="true"
                >
                  <Check className="size-3.5" />
                </Button>
              )}

              {!isSubActivity && hasSubActivities && (
                <>
                  <Badge
                    variant="secondary"
                    className="shrink-0 text-[10px] h-4 px-1.5"
                  >
                    {activity.subActivities.length}
                  </Badge>
                  <ChevronDown
                    className={cn(
                      'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                      !isCollapsed && 'rotate-180',
                    )}
                  />
                </>
              )}
            </div>

            <ActivityWithButton activity={activity} />

            {isExpanded && activity.expandedContent && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-300 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                {activity.expandedContent}
              </div>
            )}
          </div>
        </div>
      </div>

      {hasSubActivities && !isCollapsed && (
        <div className="relative ml-[42px] animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="absolute left-3 top-3 bottom-3 w-px bg-border" />
          {activity.subActivities?.map((sub) => (
            <div key={sub.id} className="relative">
              <ActivityWithSubitems
                activity={sub}
                isSubActivity
                parentExpanded={!isCollapsed}
                onMarkRead={onMarkRead}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
