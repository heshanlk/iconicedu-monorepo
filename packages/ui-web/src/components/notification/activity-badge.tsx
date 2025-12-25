'use client';

import { AvatarWithStatus } from '../shared/avatar-with-status';
import { cn } from '../../lib/utils';
import { AvatarGroup, AvatarGroupCount } from '../../ui/avatar';
import type { Activity } from '@iconicedu/shared-types';

type ActivityBadgeProps = {
  variant: Activity;
  className?: string;
};

const ALERT_BADGE_STYLES: Partial<Record<Activity['type'], string>> = {
  payment: 'bg-red-100 text-red-600',
  survey: 'bg-cyan-100 text-cyan-600',
  'complete-class': 'bg-yellow-100 text-yellow-600',
  reminder: 'bg-purple-100 text-purple-600',
  'ai-summary': 'bg-violet-100 text-violet-600',
};

export function ActivityBadge({ variant, className }: ActivityBadgeProps) {
  const alertClassName = ALERT_BADGE_STYLES[variant.type];

  if (alertClassName) {
    return (
      <div
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-full text-sm',
          alertClassName,
          className,
        )}
      >
        {variant.initials}
      </div>
    );
  }

  if (variant.participants && variant.participants.length > 1) {
    return (
      <AvatarGroup className={cn('shrink-0 pt-0.5', className)}>
        {variant.participants.slice(0, 2).map((participant, idx) => (
          <AvatarWithStatus
            key={idx}
            name={participant.initials}
            avatar={participant.avatar}
            showStatus={false}
            sizeClassName="size-6 border-2 border-background"
            initialsLength={2}
          />
        ))}
        {variant.participants.length > 2 && (
          <AvatarGroupCount className="text-[10px] size-6">
            +{variant.participants.length - 2}
          </AvatarGroupCount>
        )}
      </AvatarGroup>
    );
  }

  return (
    <AvatarWithStatus
      name={variant.initials}
      avatar={variant.avatar}
      showStatus={false}
      sizeClassName={cn('size-6 shrink-0', className)}
      fallbackClassName="text-[10px]"
      fallbackText={variant.initials}
      initialsLength={2}
    />
  );
}
