'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';

export const PinnedPanel = memo(function PinnedPanel() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-sm">Pinned items</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        No pinned items yet.
      </CardContent>
    </Card>
  );
});
