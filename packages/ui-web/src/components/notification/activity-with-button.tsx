'use client';

import { Button } from '@iconicedu/ui-web/ui/button';
import { cn } from '@iconicedu/ui-web/lib/utils';
import type { ActivityFeedItemVM } from '@iconicedu/shared-types';

export function ActivityWithButton({
  activity,
  className,
}: {
  activity: ActivityFeedItemVM;
  className?: string;
}) {
  const actionButton = activity.content.actionButton;

  if (!actionButton) {
    return null;
  }

  const href = actionButton.href ?? undefined;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        size="sm"
        variant={actionButton.variant}
        data-action-button="true"
        className="h-7 text-xs"
        disabled={!href}
        asChild={Boolean(href)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {href ? <a href={href}>{actionButton.label}</a> : actionButton.label}
      </Button>
    </div>
  );
}
