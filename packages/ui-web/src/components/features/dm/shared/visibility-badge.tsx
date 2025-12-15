'use client';

import { memo } from 'react';
import { Badge } from '../../../../ui/badge';
import { EyeOff } from 'lucide-react';
import type { Message } from '../../../../types/types';

interface VisibilityBadgeProps {
  message: Message;
}

export const VisibilityBadge = memo(function VisibilityBadge({
  message,
}: VisibilityBadgeProps) {
  if (message.visibility.type === 'all') return null;

  const getVisibilityText = () => {
    if (message.visibility.type === 'sender-only') return 'Only visible to you';
    if (message.visibility.type === 'recipient-only') return 'Only visible to recipient';
    if (message.visibility.type === 'specific-users') return 'Visible to specific users';
    return 'Private';
  };

  return (
    <Badge variant="secondary" className="text-[10px] gap-1">
      <EyeOff className="h-2.5 w-2.5" />
      {getVisibilityText()}
    </Badge>
  );
});
