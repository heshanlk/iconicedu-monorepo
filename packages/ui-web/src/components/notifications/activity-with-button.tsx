'use client';

import { Button } from '../../ui/button';
import type { Activity } from './types';

export function ActivityWithButton({
  actionButton,
}: {
  actionButton?: Activity['actionButton'];
}) {
  if (!actionButton) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
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
