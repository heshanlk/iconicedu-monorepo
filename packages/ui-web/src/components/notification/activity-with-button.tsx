'use client';

import { Button } from '../../ui/button';
import { cn } from '../../lib/utils';
import type { Activity } from './types';

export function ActivityWithButton({
  activity,
  className,
}: {
  activity: Activity;
  className?: string;
}) {
  const actionButton = activity.actionButton;

  if (!actionButton) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        size="sm"
        variant={actionButton.variant}
        onClick={(e) => {
          e.stopPropagation();
          actionButton.onClick();
        }}
        data-action-button="true"
        className="h-7 text-xs"
      >
        {actionButton.label}
      </Button>
    </div>
  );
}
