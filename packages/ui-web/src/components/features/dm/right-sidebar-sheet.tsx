import type React from 'react';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../../ui/sheet';

interface RightSidebarSheetProps {
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function RightSidebarSheet({
  title,
  subtitle,
  open,
  onClose,
  children,
}: RightSidebarSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[85vh] flex flex-col p-0">
        <SheetHeader className="flex-shrink-0 border-b border-border px-4 py-3">
          <SheetTitle className="text-left">
            <span className="text-base font-semibold">{title}</span>
            {subtitle && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {subtitle}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
