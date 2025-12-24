'use client';

import type React from 'react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { ActivityItemBase } from './activity-item-base';
import type { Activity } from './types';

type ActivityBasicWithContentActionButtonProps = {
  activity: Activity;
  onMarkRead: (id: string, event: React.MouseEvent) => void;
  iconMap: Record<string, LucideIcon>;
  isSubActivity?: boolean;
  parentExpanded?: boolean;
  className?: string;
};

export function ActivityBasicWithContentActionButton({
  activity,
  onMarkRead,
  iconMap,
  isSubActivity,
  parentExpanded,
  className,
}: ActivityBasicWithContentActionButtonProps) {
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
      iconMap={iconMap}
      isSubActivity={isSubActivity}
      parentExpanded={parentExpanded}
      showActionButton
      className={className}
      footer={
        isExpanded && activity.expandedContent ? (
          <div className="animate-in slide-in-from-top-2 fade-in duration-300 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
            {activity.expandedContent}
          </div>
        ) : null
      }
    />
  );
}
