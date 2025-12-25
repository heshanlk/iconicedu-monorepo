'use client';

import type React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { cn } from '../../lib/utils';
import { ActivityBadge } from './activity-badge';
import { ActivityWithButton } from './activity-with-button';
import type { Activity } from '@iconicedu/shared-types';

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
  const Icon = activity.icon;

  return (
    <div
      className={cn(
        'flex flex-col gap-2 py-2.5 md:flex-row md:items-start md:gap-3',
        className,
      )}
    >
      <div className="flex items-center gap-2 md:flex-row md:items-start">
        <div className="relative flex shrink-0 flex-col items-center">
          <div
            className={cn(
              'z-10 flex size-6 items-center justify-center rounded-full',
              activity.isRead ? READ_ICON_CLASS : activity.iconBg,
            )}
          >
            {Icon ? <Icon className="size-3" /> : null}
          </div>
        </div>

        <div className="text-xs text-muted-foreground md:pt-0.5 md:w-12 md:shrink-0 text-center">
          {activity.timestamp}
        </div>
        {!isSubActivity && <div className="h-px flex-1 bg-border md:hidden" />}
      </div>

      <div
        onClick={onToggle}
        className={cn(
          'group relative z-10 flex min-w-0 flex-1 items-start gap-2.5 rounded-md px-2 py-1 -mx-2 transition-all duration-200',
          onToggle && !isSubActivity && 'cursor-pointer hover:bg-muted/50',
          onToggle && showSubActivityToggle && !isCollapsed && 'bg-muted/30',
          isSubActivity && parentExpanded && 'bg-muted/30',
        )}
      >
        <ActivityBadge variant={activity} />

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
