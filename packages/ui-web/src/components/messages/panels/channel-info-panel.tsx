'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import type { ChannelVM } from '@iconicedu/shared-types';

interface ChannelInfoPanelProps {
  channel: ChannelVM;
}

export const ChannelInfoPanel = memo(function ChannelInfoPanel({
  channel,
}: ChannelInfoPanelProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-sm">Channel details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div>{channel.topic}</div>
        {channel.description ? <div>{channel.description}</div> : null}
        <div>{channel.participants.length} participants</div>
      </CardContent>
    </Card>
  );
});
