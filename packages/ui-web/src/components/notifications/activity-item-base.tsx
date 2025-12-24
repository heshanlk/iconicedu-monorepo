'use client';

import type React from 'react';
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
import { ActivityBadge } from './activity-badge';
import { ActivityWithButton } from './activity-with-button';
import type { Activity } from './types';

type ActivityItemBaseProps = {
  activity: Activity;
  onMarkRead: (id: string, event: React.MouseEvent) => void;
  onToggle?: (event: React.MouseEvent) => void;
  isSubActivity?: boolean;
  parentExpanded?: boolean;
  isCollapsed?: boolean;
  showSubActivityToggle?: boolean;
  showActionButton?: boolean;
  footer?: React.ReactNode;
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
    <ActivityBadge activity={activity} className="bg-red-100 text-red-600" />
  ),
  survey: (activity) => (
    <ActivityBadge activity={activity} className="bg-cyan-100 text-cyan-600" />
  ),
  'complete-class': (activity) => (
    <ActivityBadge activity={activity} className="bg-yellow-100 text-yellow-600" />
  ),
  reminder: (activity) => (
    <ActivityBadge activity={activity} className="bg-purple-100 text-purple-600" />
  ),
};

export function ActivityItemBase({
  activity,
  onMarkRead,
  onToggle,
  isSubActivity = false,
  parentExpanded = false,
  isCollapsed = false,
  showSubActivityToggle = false,
  showActionButton = false,
  footer,
  className,
}: ActivityItemBaseProps) {
  const Icon = activity.icon ? ICON_MAP[activity.icon] : undefined;
  const alertRenderer = ALERT_RENDERERS[activity.type];

  return (
    <div className={cn('flex items-start gap-3 py-2.5', className)}>
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
        onClick={onToggle}
        className={cn(
          'group relative z-10 flex min-w-0 flex-1 items-start gap-2.5 rounded-md px-2 py-1 -mx-2 transition-all duration-200',
          onToggle && !isSubActivity && 'cursor-pointer hover:bg-muted/50',
          onToggle && showSubActivityToggle && !isCollapsed && 'bg-muted/30 shadow-sm',
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
            <AvatarFallback className="text-[10px]">{activity.initials}</AvatarFallback>
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

            {showSubActivityToggle && (
              <>
                <Badge variant="secondary" className="shrink-0 text-[10px] h-4 px-1.5">
                  {activity.subActivities?.length ?? 0}
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

          {showActionButton && <ActivityWithButton activity={activity} />}

          {footer}
        </div>
      </div>
    </div>
  );
}
