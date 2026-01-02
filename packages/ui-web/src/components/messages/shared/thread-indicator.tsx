import { memo } from 'react';
import { Button } from '../../../ui/button';
import { AvatarWithStatus } from '../../shared/avatar-with-status';
import { Badge } from '../../../ui/badge';
import { MessageCircle } from 'lucide-react';
import type { ThreadVM } from '@iconicedu/shared-types';
import { formatThreadTime } from '../../../lib/message-utils';

interface ThreadIndicatorProps {
  thread: ThreadVM;
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
      className="mt-1 h-auto w-fit gap-2 rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-sm text-primary hover:bg-muted hover:text-primary"
    >
      <MessageCircle className="h-3.5 w-3.5" />
      <span className="font-medium">
        {thread.stats.messageCount}{' '}
        {thread.stats.messageCount === 1 ? 'reply' : 'replies'}
      </span>
      {unreadCount > 0 && (
        <Badge variant="destructive" className="h-5 min-w-[1.25rem] px-1.5 text-xs">
          {unreadCount}
        </Badge>
      )}
      <div className="flex -space-x-2">
        {thread.participants.slice(0, 3).map((participant) => (
          <AvatarWithStatus
            key={participant.ids.id}
            name={participant.profile.displayName}
            avatar={participant.profile.avatar}
            themeKey={participant.ui?.themeKey}
            showStatus={false}
            sizeClassName="h-5 w-5 border-2 border-background"
            fallbackClassName="text-[10px]"
            initialsLength={1}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {formatThreadTime(thread.stats.lastReplyAt)}
      </span>
    </Button>
  );
});
