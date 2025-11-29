'use client';
import * as React from 'react';
import { cn } from '../../lib/utils';

type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
}

export function DropdownMenu({
  children,
  defaultOpen = false,
  className,
  ...props
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className={cn('relative inline-flex', className)} {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function DropdownMenuTrigger({
  children,
  asChild,
  className,
  ...props
}: DropdownMenuTriggerProps) {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error('DropdownMenuTrigger must be used within DropdownMenu');

  const triggerProps = {
    onClick: () => ctx.setOpen(!ctx.open),
    className,
    'aria-expanded': ctx.open,
    ...props,
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, triggerProps);
  }

  return (
    <button type="button" {...triggerProps}>
      {children}
    </button>
  );
}

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end';
}

export function DropdownMenuContent({
  children,
  className,
  align = 'start',
  ...props
}: DropdownMenuContentProps) {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error('DropdownMenuContent must be used within DropdownMenu');
  const { setOpen } = ctx;

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(event.target as Node)) setOpen(false);
    }
    function onEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEscape);
    };
  }, [setOpen]);

  if (!ctx.open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 mt-2 min-w-[160px] rounded-lg border border-border bg-card p-1 shadow-lg',
        align === 'end' ? 'right-0' : 'left-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function DropdownMenuItem({
  children,
  className,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error('DropdownMenuItem must be used within DropdownMenu');

  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        ctx.setOpen(false);
      }}
      className={cn(
        'flex w-full items-center rounded-md px-3 py-2 text-sm text-foreground transition hover:bg-[hsl(var(--border))/0.2]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
