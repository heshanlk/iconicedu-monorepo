'use client';

import type { ReactNode } from 'react';
import { Button } from '../../ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '../../ui/drawer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { ScrollArea } from '../../ui/scroll-area';
import { X } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

interface MessagesSidebarProps {
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

function MessagesSidebarHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="space-y-0.5">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        {subtitle ? (
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        ) : null}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function MessagesSidebar({
  title,
  subtitle,
  open,
  onClose,
  children,
}: MessagesSidebarProps) {
  const isMobile = useIsMobile();

  if (!open) return null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(value) => !value && onClose()}>
        <DrawerContent className="flex h-[85vh] min-h-0 flex-col overflow-hidden p-0 before:inset-0 before:rounded-t-xl data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-[85vh]">
          <DrawerHeader className="w-full border-b border-border bg-background px-4 py-3">
            <DrawerTitle asChild>
              <div className="w-full text-base">
                <MessagesSidebarHeader
                  title={title}
                  subtitle={subtitle}
                  onClose={onClose}
                />
              </div>
            </DrawerTitle>
            {subtitle ? <DrawerDescription className="sr-only" /> : null}
          </DrawerHeader>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Card className="hidden md:flex w-[400px] min-h-0 flex-col rounded-none border-0 border-l border-border bg-card">
      <CardHeader className="border-b border-border bg-card px-4 py-3">
        <MessagesSidebarHeader title={title} subtitle={subtitle} onClose={onClose} />
        {subtitle ? <CardDescription className="sr-only" /> : null}
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex min-h-0 flex-col">{children}</div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
