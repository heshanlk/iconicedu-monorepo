'use client';

import { memo, useMemo } from 'react';
import type { UserProfileVM } from '@iconicedu/shared-types';
import { getProfileDisplayName } from '@iconicedu/ui-web/lib/display-name';
import { cn } from '@iconicedu/ui-web/lib/utils';

interface TypingIndicatorProps {
  profiles: UserProfileVM[];
  className?: string;
}

export const TypingIndicator = memo(function TypingIndicator({
  profiles,
  className,
}: TypingIndicatorProps) {
  const label = useMemo(() => {
    if (!profiles.length) return '';
    const names = profiles.map((profile) => getProfileDisplayName(profile.profile));
    if (names.length === 1) {
      return `${names[0]} is typing`;
    }
    if (names.length === 2) {
      return `${names[0]} and ${names[1]} are typing`;
    }
    return `${names[0]}, ${names[1]}, and ${names.length - 2} others are typing`;
  }, [profiles]);

  if (!profiles.length) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground', className)}>
      <div className="flex items-center gap-1">
        <span className="sr-only">{label}</span>
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.2s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.1s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
      </div>
      <span>{label}…</span>
    </div>
  );
});
