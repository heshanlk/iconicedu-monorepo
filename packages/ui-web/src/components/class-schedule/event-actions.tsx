'use client';

import type { ClassScheduleVM } from '@iconicedu/shared-types';
import { Button } from '../../ui/button';
import { MessageSquare, Video, X } from 'lucide-react';

interface EventActionsProps {
  event: ClassScheduleVM;
  onClose: () => void;
}

export function EventActions({ event, onClose }: EventActionsProps) {
  const joinLink = event.meetingLink ?? null;
  const chatLink =
    event.source.kind === 'class_session' && event.source.channelId
      ? `/dashboard/ls/${event.source.channelId}`
      : null;

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        {joinLink ? (
          <Button size="sm" asChild>
            <a href={joinLink} target="_blank" rel="noreferrer">
              <Video className="h-4 w-4 mr-2" />
              Join
            </a>
          </Button>
        ) : (
          <Button size="sm" disabled>
            <Video className="h-4 w-4 mr-2" />
            Join
          </Button>
        )}
        {chatLink ? (
          <Button size="sm" variant="outline" asChild>
            <a href={chatLink}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </a>
          </Button>
        ) : (
          <Button size="sm" variant="outline" disabled>
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Button>
        )}
      </div>
      <Button size="sm" variant="ghost" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
