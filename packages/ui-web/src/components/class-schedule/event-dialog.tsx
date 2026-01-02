'use client';

import type React from 'react';

import { Separator } from '../../ui/separator';
import type { ClassScheduleVM } from '@iconicedu/shared-types';
import { EventDetailsHeader } from './event-details-header';
import { EventDetailsInfo } from './event-details-info';
import { EventActions } from './event-actions';
import { useIsMobile } from '../../hooks/use-mobile';
import { ResponsiveDialog } from '../shared/responsive-dialog';

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

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={event.title || 'Class schedule details'}
      trigger={children}
      showHeader={false}
      isMobile={isMobile}
      dialogShowCloseButton={false}
      drawerProps={{ 'data-vaul-custom-container': true }}
      drawerContentClassName="flex flex-col overflow-hidden bg-background p-0 rounded-t-xl before:inset-0 before:rounded-t-xl"
      dialogContentClassName="max-w-lg max-h-[85vh] p-0 gap-0 [&>button]:hidden"
    >
      {content}
    </ResponsiveDialog>
  );
}
