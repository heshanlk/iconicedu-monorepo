'use client';

import type React from 'react';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '../../ui/drawer';
import { Separator } from '../../ui/separator';
import type { ClassScheduleVM } from '@iconicedu/shared-types';
import { EventDetailsHeader } from './event-details-header';
import { EventDetailsInfo } from './event-details-info';
import { EventActions } from './event-actions';
import { useIsMobile } from '../../hooks/use-mobile';

interface EventDialogProps {
  event: ClassScheduleVM;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function EventDialog({ event, open, onOpenChange, children }: EventDialogProps) {
  const isMobile = useIsMobile();
  const content = (
    // <ScrollArea className="max-h-[85vh]">
    <div className="p-4">
      <div className="space-y-4">
        <EventDetailsHeader event={event} />
        <div className="px-4 space-y-3">
          <EventDetailsInfo event={event} />
          <Separator />
          <EventActions event={event} onClose={() => onOpenChange(false)} />
        </div>
      </div>
    </div>
    // </ScrollArea>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} data-vaul-custom-container="true">
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="flex flex-col overflow-hidden bg-background p-0 rounded-t-xl before:inset-0 before:rounded-t-xl">
          <DrawerTitle className="sr-only">
            {event.title || 'Class schedule details'}
          </DrawerTitle>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] p-0 gap-0 [&>button]:hidden">
        <DialogTitle className="sr-only">
          {event.title || 'Class schedule details'}
        </DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
}
