'use client';

import { memo } from 'react';
import { Bookmark, Clock, Info, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import { cn } from '../../lib/utils';

interface LearningSpaceHeaderProps {
  title: string;
  schedule: string;
  nextSession: string;
  savedCount: number;
  onOpenInfo: () => void;
  onSavedMessagesClick: () => void;
  isInfoActive?: boolean;
}

const HeaderChip = memo(function HeaderChip({
  icon: Icon,
  label,
  onClick,
  className,
}: {
  icon?: typeof Clock;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  const content = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs text-muted-foreground',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      <span className="truncate">{label}</span>
    </span>
  );

  if (!onClick) return content;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent>View saved messages</TooltipContent>
    </Tooltip>
  );
});

export const LearningSpaceHeader = memo(function LearningSpaceHeader({
  title,
  schedule,
  nextSession,
  savedCount,
  onOpenInfo,
  onSavedMessagesClick,
  isInfoActive = false,
}: LearningSpaceHeaderProps) {
  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border px-4 py-3">
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="truncate text-sm font-semibold text-foreground">{title}</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          <HeaderChip
            icon={Bookmark}
            label={`${savedCount}`}
            onClick={onSavedMessagesClick}
            className="text-muted-foreground"
          />
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <HeaderChip icon={Clock} label={nextSession} />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground"
          onClick={onOpenInfo}
        >
          <span
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full bg-muted',
              isInfoActive && 'bg-primary/10 text-primary',
            )}
          >
            <Info className={cn('h-3.5 w-3.5')} strokeWidth={3} />
          </span>
        </Button>
      </div>
    </header>
  );
});
