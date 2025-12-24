'use client';

import type React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ActivityItemBase } from './activity-item-base';
import type { Activity } from './types';

type ActivityBasicWithActionButtonProps = {
  activity: Activity;
  onMarkRead: (id: string, event: React.MouseEvent) => void;
  iconMap: Record<string, LucideIcon>;
  isSubActivity?: boolean;
  parentExpanded?: boolean;
  className?: string;
};

export function ActivityBasicWithActionButton({
  activity,
  onMarkRead,
  iconMap,
  isSubActivity,
  parentExpanded,
  className,
}: ActivityBasicWithActionButtonProps) {
  return (
    <ActivityItemBase
      activity={activity}
      onMarkRead={onMarkRead}
      iconMap={iconMap}
      isSubActivity={isSubActivity}
      parentExpanded={parentExpanded}
      showActionButton
      className={className}
    />
  );
}
