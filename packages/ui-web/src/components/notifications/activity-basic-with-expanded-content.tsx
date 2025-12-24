'use client';

import type React from 'react';
import { useState } from 'react';
import { ActivityItemBase } from './activity-item-base';
import type { Activity } from './types';

type ActivityBasicWithExpandedContentProps = {
  activity: Activity;
  onMarkRead: (id: string, event: React.MouseEvent) => void;
  showActionButton?: boolean;
  isSubActivity?: boolean;
  parentExpanded?: boolean;
  className?: string;
};

export function ActivityBasicWithExpandedContent({
  activity,
  onMarkRead,
  showActionButton = false,
  isSubActivity,
  parentExpanded,
  className,
}: ActivityBasicWithExpandedContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (_event: React.MouseEvent) => {
    if (activity.expandedContent) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <ActivityItemBase
      activity={activity}
      onMarkRead={onMarkRead}
      onToggle={handleToggle}
      isSubActivity={isSubActivity}
      parentExpanded={parentExpanded}
      showActionButton={showActionButton}
      className={className}
      footer={
        isExpanded && activity.expandedContent ? (
          <div className="animate-in slide-in-from-top-2 fade-in duration-300 rounded-md bg-muted/50 p-3 text-[12px] text-muted-foreground">
            {activity.expandedContent}
          </div>
        ) : null
      }
    />
  );
}
