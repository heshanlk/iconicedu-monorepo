'use client';

import type React from 'react';
import { cn } from '../../lib/utils';

export function ActivityWithSubitems({
  children,
  showStack,
  className,
}: {
  children: React.ReactNode;
  showStack: boolean;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      {showStack && (
        <div className="absolute left-[52px] top-2 right-0 bottom-2 pointer-events-none">
          <div className="absolute inset-0 rounded-lg bg-muted/20 translate-y-1 translate-x-1" />
          <div className="absolute inset-0 rounded-lg bg-muted/15 translate-y-2 translate-x-2" />
        </div>
      )}
      {children}
    </div>
  );
}
