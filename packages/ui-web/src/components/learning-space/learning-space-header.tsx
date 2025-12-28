'use client';

import { memo } from 'react';
import { Info, Bookmark, Calendar, Clock, MoreHorizontal, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { cn } from '../../lib/utils';

interface LearningSpaceHeaderProps {
  title: string;
  schedule: string;
  nextSession: string;
  savedCount: number;
  onOpenInfo: () => void;
  onSavedMessagesClick: () => void;
  joinUrl?: string;
  accentColor?: string;
}

const HeaderChip = memo(function HeaderChip({
  icon: Icon,
  label,
  onClick,
  className,
}: {
  icon: typeof Calendar;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  const content = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground',
        onClick && 'cursor-pointer hover:text-foreground transition-colors',
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Icon className="h-3.5 w-3.5" />
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
  joinUrl,
  accentColor = 'bg-emerald-100 text-emerald-700',
}: LearningSpaceHeaderProps) {
  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-border bg-muted/40 px-4 py-3">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={cn(
            'mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl',
            accentColor,
          )}
        >
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            {title}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <HeaderChip icon={Calendar} label={schedule} />
          <HeaderChip icon={Clock} label={nextSession} />
          <HeaderChip
            icon={Bookmark}
            label={`${savedCount} saved`}
            onClick={onSavedMessagesClick}
            className="bg-primary/10 text-primary"
          />
        </div>
        </div>
      </div>

      <TooltipProvider>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild={Boolean(joinUrl)}>
            {joinUrl ? (
              <a href={joinUrl} target="_blank" rel="noreferrer">
                Join
              </a>
            ) : (
              <span>Join</span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={onOpenInfo}
          >
            <Info className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onOpenInfo}>View details</DropdownMenuItem>
              <DropdownMenuItem>Mute updates</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Leave space
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipProvider>
    </header>
  );
});
