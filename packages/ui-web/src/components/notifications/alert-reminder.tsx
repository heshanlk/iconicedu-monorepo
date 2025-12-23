'use client';

import { cn } from '../../lib/utils';

export function AlertReminder({ initials }: { initials: string }) {
  return (
    <div className={cn('flex size-6 shrink-0 items-center justify-center rounded-full text-sm', 'bg-purple-100 text-purple-600')}>
      {initials}
    </div>
  );
}
