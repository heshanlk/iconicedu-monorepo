'use client';

import { memo } from 'react';
import { Badge } from '@iconicedu/ui-web/ui/badge';
import { EyeOff } from 'lucide-react';
import type { MessageVM } from '@iconicedu/shared-types';

interface VisibilityBadgeProps {
  message: MessageVM;
}

export const VisibilityBadge = memo(function VisibilityBadge({
  message,
}: VisibilityBadgeProps) {
  const visibility = message.core.visibility;
  if (visibility.type === 'all') return null;

  const getVisibilityText = () => {
    if (visibility.type === 'sender-only') return 'Only visible to you';
    if (visibility.type === 'recipient-only') return 'Only visible to recipient';
    if (visibility.type === 'specific-users') return 'Visible to specific users';
    return 'Private';
  };

  return (
    <Badge variant="secondary" className="text-[10px] gap-1">
      <EyeOff className="h-2.5 w-2.5" />
      {getVisibilityText()}
    </Badge>
  );
});
