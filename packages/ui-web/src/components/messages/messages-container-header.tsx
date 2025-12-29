'use client';

import { memo } from 'react';
import type { ReactNode } from 'react';
import { Info, Sparkles, type LucideIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { cn } from '../../lib/utils';

interface HeaderSubtitleItem {
  icon?: LucideIcon;
  label: string;
  onClick?: () => void;
  tooltip?: string;
}

interface MessagesContainerHeaderProps {
  title: string;
  subtitleItems?: HeaderSubtitleItem[];
  onOpenInfo: () => void;
  isInfoActive?: boolean;
  leading?: ReactNode;
}

const HeaderSubtitleItem = memo(function HeaderSubtitleItem({
  icon: Icon,
  label,
  onClick,
  className,
  tooltip,
}: {
  icon?: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
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

  if (!onClick || !tooltip) return content;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
});

const HeaderTitle = memo(function HeaderTitle({
  title,
  leading,
}: {
  title: string;
  leading?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      {leading ?? (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
      )}
      <span className="truncate text-sm font-semibold text-foreground">{title}</span>
    </div>
  );
});

const HeaderSubtitleRow = memo(function HeaderSubtitleRow({
  items,
}: {
  items: HeaderSubtitleItem[];
}) {
  return (
    <TooltipProvider>
      <div className="mt-1.5 flex flex-wrap items-center gap-3">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex items-center gap-3">
            {index > 0 && <span className="h-4 w-px bg-border" aria-hidden="true" />}
            <HeaderSubtitleItem
              icon={item.icon}
              label={item.label}
              onClick={item.onClick}
              tooltip={item.tooltip}
              className="text-muted-foreground"
            />
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
});

const HeaderInfoButton = memo(function HeaderInfoButton({
  isActive,
  onOpenInfo,
}: {
  isActive: boolean;
  onOpenInfo: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 text-muted-foreground"
      onClick={onOpenInfo}
    >
      <span
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full bg-muted',
          isActive && 'bg-primary/10 text-primary',
        )}
      >
        <Info className={cn('h-3.5 w-3.5')} strokeWidth={3} />
      </span>
    </Button>
  );
});

export const MessagesContainerHeader = memo(function MessagesContainerHeader({
  title,
  onOpenInfo,
  subtitleItems,
  isInfoActive = false,
  leading,
}: MessagesContainerHeaderProps) {
  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border px-4 py-3">
      <div className="flex min-w-0 flex-col">
        <HeaderTitle title={title} leading={leading} />
        {subtitleItems?.length ? <HeaderSubtitleRow items={subtitleItems} /> : null}
      </div>

      <div className="flex items-center gap-3 sm:justify-end">
        <HeaderInfoButton isActive={isInfoActive} onOpenInfo={onOpenInfo} />
      </div>
    </header>
  );
});
