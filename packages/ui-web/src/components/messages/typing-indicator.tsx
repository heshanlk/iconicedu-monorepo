'use client';

import { memo, useMemo } from 'react';
import type { UserProfileVM } from '@iconicedu/shared-types';
import { getProfileDisplayName } from '@iconicedu/ui-web/lib/display-name';
import { cn } from '@iconicedu/ui-web/lib/utils';
import { AvatarGroup, AvatarGroupCount } from '@iconicedu/ui-web/ui/avatar';
import { AvatarWithStatus } from '@iconicedu/ui-web/components/shared/avatar-with-status';

interface TypingIndicatorProps {
  profiles: UserProfileVM[];
  variant?: 'inline' | 'message';
  className?: string;
}

export const TypingIndicator = memo(function TypingIndicator({
  profiles,
  variant = 'message',
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

  if (variant === 'message') {
    const primary = profiles[0];
    const primaryName = getProfileDisplayName(primary.profile);
    const remainingCount = Math.max(0, profiles.length - 1);
    const displayName =
      remainingCount > 0
        ? `${primaryName} and ${remainingCount} other${remainingCount > 1 ? 's' : ''}`
        : primaryName;

    return (
      <div className={cn('flex items-start gap-3 px-4 py-2', className)}>
        <AvatarWithStatus
          name={primaryName}
          avatar={primary.profile.avatar}
          themeKey={primary.ui?.themeKey ?? null}
          showStatus={false}
          sizeClassName="size-8 border-2 border-background"
          fallbackClassName="text-xs"
          initialsLength={2}
        />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">{displayName}</span>
          <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground shadow-sm">
            <span className="sr-only">{label}</span>
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.2s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.1s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground',
        className,
      )}
    >
      <AvatarGroup className="shrink-0">
        {profiles.slice(0, 2).map((profile) => (
          <AvatarWithStatus
            key={profile.ids.id}
            name={getProfileDisplayName(profile.profile)}
            avatar={profile.profile.avatar}
            themeKey={profile.ui?.themeKey ?? null}
            showStatus={false}
            sizeClassName="size-6 border-2 border-background"
            fallbackClassName="text-[10px]"
            initialsLength={2}
          />
        ))}
        {profiles.length > 2 && (
          <AvatarGroupCount className="text-[10px] size-6">
            +{profiles.length - 2}
          </AvatarGroupCount>
        )}
      </AvatarGroup>
      <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/90 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
        <span className="sr-only">{label}</span>
        <span>Typing</span>
        <span className="ml-1.5 inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.2s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.1s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
        </span>
      </div>
    </div>
  );
});
