'use client';

import { cn } from '../../lib/utils';

export function AlertSurvey({ initials }: { initials: string }) {
  return (
    <div className={cn('flex size-6 shrink-0 items-center justify-center rounded-full text-sm', 'bg-cyan-100 text-cyan-600')}>
      {initials}
    </div>
  );
}
