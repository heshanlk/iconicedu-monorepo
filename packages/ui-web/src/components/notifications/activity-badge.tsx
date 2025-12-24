'use client';

import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { cn } from '../../lib/utils';
import type { Activity } from './types';

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
      <div className={cn('flex shrink-0 -space-x-1.5 pt-0.5', className)}>
        {variant.participants.slice(0, 2).map((participant, idx) => (
          <Avatar key={idx} className="size-6 border-2 border-background">
            <AvatarImage src={participant.avatar || '/placeholder.svg'} />
            <AvatarFallback className="text-[10px]">
              {participant.initials}
            </AvatarFallback>
          </Avatar>
        ))}
        {variant.participants.length > 2 && (
          <Avatar className="size-6 border-2 border-background">
            <AvatarFallback className="text-[10px]">
              +{variant.participants.length - 2}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  }

  return (
    <Avatar className={cn('size-6 shrink-0', className)}>
      <AvatarImage src={variant.avatar || '/placeholder.svg'} />
      <AvatarFallback className="text-[10px]">{variant.initials}</AvatarFallback>
    </Avatar>
  );
}
