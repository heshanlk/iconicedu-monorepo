import * as React from 'react';

import { ChevronRight } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../../ui/collapsible';
import { Separator } from '../../../../ui/separator';

type UserSettingsTabSectionProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode | null;
  icon?: React.ReactNode;
  badgeIcon?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  showSeparator?: boolean;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
};

export function UserSettingsTabSection({
  title,
  subtitle,
  icon,
  badgeIcon,
  open,
  defaultOpen,
  onOpenChange,
  children,
  footer,
  showSeparator = true,
  className,
  contentClassName,
  disabled = false,
}: UserSettingsTabSectionProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) {
      return;
    }
    onOpenChange?.(nextOpen);
  };

  return (
    <>
      <Collapsible
        className={`rounded-2xl w-full ${className ?? ''}`}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
      >
        <CollapsibleTrigger
          disabled={disabled}
          aria-disabled={disabled}
          className={`group flex w-full items-center gap-3 py-3 text-left transition ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-foreground">
            {icon}
          </span>
          <div className="flex-1">
            <div className="text-sm font-medium">{title}</div>
            {subtitle ? (
              <div className="text-xs text-muted-foreground">{subtitle}</div>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {badgeIcon ? <span className="flex items-center">{badgeIcon}</span> : null}
            <ChevronRight className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent
          className={`py-4 w-full ${contentClassName ?? ''} ${
            disabled ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          {children}
          {footer ? <div className="pt-4">{footer}</div> : null}
        </CollapsibleContent>
      </Collapsible>
      {showSeparator ? <Separator /> : null}
    </>
  );
}
