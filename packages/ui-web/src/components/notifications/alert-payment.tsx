'use client';

import { cn } from '../../lib/utils';

export function AlertPayment({ initials }: { initials: string }) {
  return (
    <div className={cn('flex size-6 shrink-0 items-center justify-center rounded-full text-sm', 'bg-red-100 text-red-600')}>
      {initials}
    </div>
  );
}
