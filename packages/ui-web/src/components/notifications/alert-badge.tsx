'use client';

import { cn } from '../../lib/utils';

type AlertBadgeProps = {
  initials: string;
  className: string;
};

export function AlertBadge({ initials, className }: AlertBadgeProps) {
  return (
    <div
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-full text-sm',
        className,
      )}
    >
      {initials}
    </div>
  );
}
