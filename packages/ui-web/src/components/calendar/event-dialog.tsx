'use client';

import type React from 'react';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { ScrollArea } from '../../ui/scroll-area';
import { Separator } from '../../ui/separator';
import type { CalendarEvent } from '@iconicedu/shared-types';
import { EventDetailsHeader } from './event-details-header';
import { EventDetailsInfo } from './event-details-info';
import { EventActions } from './event-actions';

interface EventDialogProps {
  event: CalendarEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function EventDialog({ event, open, onOpenChange, children }: EventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] p-0 gap-0 [&>button]:hidden">
        <DialogTitle className="sr-only">
          {event.title || 'Calendar event details'}
        </DialogTitle>
        <ScrollArea className="max-h-[85vh]">
          <div className="p-4 bg-muted rounded-2xl">
            <div className="space-y-4">
              <EventDetailsHeader event={event} />
              <div className="px-4 space-y-3">
                <EventDetailsInfo event={event} />
                <Separator />
                <EventActions onClose={() => onOpenChange(false)} />
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
