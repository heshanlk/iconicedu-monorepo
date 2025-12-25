'use client';

import { AvatarWithStatus } from '../shared/avatar-with-status';
import { cn } from '../../lib/utils';
import type { User } from '@iconicedu/shared-types';

interface TypingIndicatorProps {
  user: User;
  className?: string;
}

export function TypingIndicator({ user, className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-start gap-3 px-4 py-2', className)}>
      <AvatarWithStatus
        name={user.name}
        avatar={user.avatar}
        showStatus={false}
        sizeClassName="h-8 w-8"
        initialsLength={1}
      />

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">
          {user.name} is typing
        </span>
        <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
          <div className="flex gap-1">
            <span
              className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce"
              style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
            />
            <span
              className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce"
              style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
            />
            <span
              className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce"
              style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
