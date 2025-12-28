'use client';

import type React from 'react';
import { ActivityItemBase } from './activity-item-base';
import type { ActivityFeedItemVM } from '@iconicedu/shared-types';

type ActivityBasicWithActionButtonProps = {
  activity: ActivityFeedItemVM;
  onMarkRead: (id: string, event: React.MouseEvent) => void;
  isSubActivity?: boolean;
  parentExpanded?: boolean;
  className?: string;
};

export function ActivityBasicWithActionButton({
  activity,
  onMarkRead,
  isSubActivity,
  parentExpanded,
  className,
}: ActivityBasicWithActionButtonProps) {
  return (
    <ActivityItemBase
      activity={activity}
      onMarkRead={onMarkRead}
      isSubActivity={isSubActivity}
      parentExpanded={parentExpanded}
      showActionButton
      className={className}
    />
  );
}
