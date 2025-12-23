'use client';

import { cn } from '../../lib/utils';

export function AlertCompleteClass({ initials }: { initials: string }) {
  return (
    <div className={cn('flex size-6 shrink-0 items-center justify-center rounded-full text-sm', 'bg-yellow-100 text-yellow-600')}>
      {initials}
    </div>
  );
}
