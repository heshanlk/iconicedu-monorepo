'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

type SidebarContextValue = { isMobile: boolean; toggleSidebar: () => void };
const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  return React.useContext(SidebarContext) ?? { isMobile: false, toggleSidebar: () => {} };
}

export function SidebarProvider({ children, className }: { children: React.ReactNode; className?: string }) {
  const value = React.useMemo<SidebarContextValue>(() => ({ isMobile: false, toggleSidebar: () => {} }), []);
  return (
    <SidebarContext.Provider value={value}>
      <div className={cn('flex min-h-screen bg-background text-foreground', className)}>{children}</div>
    </SidebarContext.Provider>
  );
}

export function SidebarInset({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex flex-1 flex-col', className)}>{children}</div>;
}

export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('w-[280px] border-r bg-card text-card-foreground flex flex-col', className)} {...props} />
  ),
);
Sidebar.displayName = 'Sidebar';

export const SidebarHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-3 border-b', className)} {...props} />
);
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex-1 overflow-auto p-3 space-y-4', className)} {...props} />
);
SidebarContent.displayName = 'SidebarContent';

export const SidebarFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-3 border-t', className)} {...props} />
);
SidebarFooter.displayName = 'SidebarFooter';

export const SidebarMenu = ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className={cn('space-y-1', className)} {...props} />
);
SidebarMenu.displayName = 'SidebarMenu';

export function SidebarMenuItem({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn('list-none', className)} {...props} />;
}
SidebarMenuItem.displayName = 'SidebarMenuItem';

export function SidebarMenuButton({
  asChild,
  className,
  children,
  tooltip, // unused, present for API parity
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; tooltip?: string }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      className: cn(
        (children as any).props.className,
        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
        className,
      ),
      ...props,
    });
  }
  return (
    <button
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
SidebarMenuButton.displayName = 'SidebarMenuButton';

export const SidebarMenuAction = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      'flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      className,
    )}
    {...props}
  />
);
SidebarMenuAction.displayName = 'SidebarMenuAction';

export const SidebarGroup = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-2', className)} {...props} />
);
SidebarGroup.displayName = 'SidebarGroup';

export const SidebarGroupLabel = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-3 text-xs font-semibold uppercase text-muted-foreground', className)} {...props} />
);
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

export const SidebarGroupContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-1', className)} {...props} />
);
SidebarGroupContent.displayName = 'SidebarGroupContent';

export const SidebarMenuSub = ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className={cn('ml-4 space-y-1', className)} {...props} />
);
SidebarMenuSub.displayName = 'SidebarMenuSub';

export const SidebarMenuSubItem = ({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
  <li className={cn('list-none', className)} {...props} />
);
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

export const SidebarMenuSubButton = ({
  asChild,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      className: cn(
        (children as any).props.className,
        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
        className,
      ),
      ...props,
    });
  }
  return (
    <button
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

export const SidebarInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-ring focus:outline-none',
        className,
      )}
      {...props}
    />
  ),
);
SidebarInput.displayName = 'SidebarInput';
