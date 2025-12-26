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
  desktopContent: ReactNode;
  mobileContent: ReactNode;
}

export function MessagesSidebar({
  title,
  subtitle,
  open,
  onClose,
  desktopContent,
  mobileContent,
}: MessagesSidebarProps) {
  const isMobile = useIsMobile();

  if (!open) return null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(value) => !value && onClose()}>
        <DrawerContent className="flex h-[85vh] flex-col p-0">
          <DrawerHeader className="flex-row items-start justify-between border-b border-border px-4 py-3 text-left">
            <div className="space-y-0.5">
              <DrawerTitle className="text-base font-semibold">{title}</DrawerTitle>
              {subtitle ? (
                <DrawerDescription className="text-xs">{subtitle}</DrawerDescription>
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
          </DrawerHeader>
          <div className="flex min-h-0 flex-1 flex-col">{mobileContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Card className="hidden md:flex w-[400px] flex-col rounded-none border-0 border-l border-border bg-card">
      <CardHeader className="flex-row items-start justify-between space-y-0 border-b border-border px-4 py-3">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
          {subtitle ? (
            <CardDescription className="text-xs text-muted-foreground">
              {subtitle}
            </CardDescription>
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
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        {desktopContent}
      </CardContent>
    </Card>
  );
}
