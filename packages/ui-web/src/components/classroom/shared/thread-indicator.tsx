import { memo } from 'react';
import { Button } from '../../../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Badge } from '../../../ui/badge';
import { MessageCircle } from 'lucide-react';
import type { Thread } from '@iconicedu/shared-types';
import { formatThreadTime } from '../../../lib/message-utils';

interface ThreadIndicatorProps {
  thread: Thread;
  onClick: () => void;
  unreadCount?: number;
}

export const ThreadIndicator = memo(function ThreadIndicator({
  thread,
  onClick,
  unreadCount = 0,
}: ThreadIndicatorProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="mt-1 h-auto w-fit gap-2 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-sm text-primary hover:bg-muted hover:text-primary"
    >
      <MessageCircle className="h-3.5 w-3.5" />
      <span className="font-medium">
        {thread.messageCount} {thread.messageCount === 1 ? 'reply' : 'replies'}
      </span>
      {unreadCount > 0 && (
        <Badge variant="destructive" className="h-5 min-w-[1.25rem] px-1.5 text-xs">
          {unreadCount}
        </Badge>
      )}
      <div className="flex -space-x-2">
        {thread.participants.slice(0, 3).map((participant) => (
          <Avatar key={participant.id} className="h-5 w-5 border-2 border-background">
            <AvatarImage
              src={participant.avatar || '/placeholder.svg'}
              alt={participant.name}
            />
            <AvatarFallback className="text-[10px]">
              {participant.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {formatThreadTime(thread.lastReply)}
      </span>
    </Button>
  );
});
