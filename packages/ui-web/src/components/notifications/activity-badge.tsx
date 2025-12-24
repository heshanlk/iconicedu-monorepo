'use client';

import { cn } from '../../lib/utils';
import type { Activity } from './types';

type ActivityBadgeProps = {
  activity: Activity;
  className: string;
};

export function ActivityBadge({ activity, className }: ActivityBadgeProps) {
  return (
    <div
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-full text-sm',
        className,
      )}
    >
      {activity.initials}
    </div>
  );
}
