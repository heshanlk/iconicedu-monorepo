'use client';

import { Button } from '../../ui/button';
import { MessageSquare, Video, X } from 'lucide-react';

interface EventActionsProps {
  onClose: () => void;
}

export function EventActions({ onClose }: EventActionsProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <Button size="sm">
          <Video className="h-4 w-4 mr-2" />
          Join
        </Button>
        <Button size="sm" variant="secondary">
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat
        </Button>
      </div>
      <Button size="sm" variant="ghost" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
