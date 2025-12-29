'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import type { MessageVM } from '@iconicedu/shared-types';

interface ThreadPanelProps {
  threadId?: string | null;
  messages?: MessageVM[];
}

export const ThreadPanel = memo(function ThreadPanel({
  threadId,
  messages,
}: ThreadPanelProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-sm">Thread</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {threadId ? `Thread ${threadId}` : 'Select a thread to view replies.'}
        {messages?.length ? (
          <div className="mt-2 text-xs">{messages.length} replies loaded</div>
        ) : null}
      </CardContent>
    </Card>
  );
});
