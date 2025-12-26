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
        <DrawerContent className="flex h-[85vh] flex-col p-0">
          <DrawerHeader className="border-b border-border bg-background px-4 py-3 text-left">
            <DrawerTitle asChild>
              <div className="text-base">
                <MessagesSidebarHeader
                  title={title}
                  subtitle={subtitle}
                  onClose={onClose}
                />
              </div>
            </DrawerTitle>
            {subtitle ? <DrawerDescription className="sr-only" /> : null}
          </DrawerHeader>
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Card className="hidden md:flex w-[400px] flex-col rounded-none border-0 border-l border-border bg-card">
      <CardHeader className="border-b border-border bg-card px-4 py-3">
        <CardTitle asChild>
          <div>
            <MessagesSidebarHeader
              title={title}
              subtitle={subtitle}
              onClose={onClose}
            />
          </div>
        </CardTitle>
        {subtitle ? <CardDescription className="sr-only" /> : null}
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col p-0">{children}</CardContent>
    </Card>
  );
}
