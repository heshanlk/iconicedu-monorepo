'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';

interface SavedPanelProps {
  savedCount: number;
}

export const SavedPanel = memo(function SavedPanel({ savedCount }: SavedPanelProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-sm">Saved messages</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {savedCount ? `${savedCount} saved message(s)` : 'No saved messages yet.'}
      </CardContent>
    </Card>
  );
});
