'use client';

import type React from 'react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { ActivityBasicWithActionButton } from './activity-basic-with-action-button';
import { ActivityBasicWithExpandedContent } from './activity-basic-with-expanded-content';
import { ActivityItemBase } from './activity-item-base';
import type {
  ActivityFeedGroupItemVM,
  ActivityFeedLeafItemVM,
} from '@iconicedu/shared-types';

type ActivityWithSubitemsProps = {
  activity: ActivityFeedGroupItemVM;
  isSubActivity?: boolean;
  parentExpanded?: boolean;
  onMarkRead: (id: string, event: React.MouseEvent) => void;
  className?: string;
};

export function ActivityWithSubitems({
  activity,
  isSubActivity = false,
  parentExpanded = false,
  onMarkRead,
  className,
}: ActivityWithSubitemsProps) {
  const subActivities = activity.subActivities?.items ?? [];
  const subActivityCount =
    activity.subActivityCount ?? activity.subActivities?.total ?? subActivities.length;
  const hasSubActivities = subActivityCount > 0;
  const [isCollapsed, setIsCollapsed] = useState(hasSubActivities);

  const handleToggle = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('button[data-action-button="true"]')) {
      return;
    }

    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className={cn('relative', className)}>
      <ActivityItemBase
        activity={activity}
        onMarkRead={onMarkRead}
        onToggle={handleToggle}
        isSubActivity={isSubActivity}
        parentExpanded={parentExpanded}
        isCollapsed={isCollapsed}
        showSubActivityToggle={hasSubActivities}
        showActionButton={Boolean(activity.actionButton)}
        subActivityCount={subActivityCount}
      />

      {hasSubActivities && !isCollapsed && (
        <div className="relative ml-6 md:ml-[42px] animate-in slide-in-from-top-2 fade-in duration-300">
          {subActivities.map((sub: ActivityFeedLeafItemVM) => (
            <div key={sub.id} className="relative">
              {sub.expandedContent ? (
                <ActivityBasicWithExpandedContent
                  activity={sub}
                  onMarkRead={onMarkRead}
                  showActionButton={Boolean(sub.actionButton)}
                  isSubActivity
                  parentExpanded={!isCollapsed}
                />
              ) : sub.actionButton ? (
                <ActivityBasicWithActionButton
                  activity={sub}
                  onMarkRead={onMarkRead}
                  isSubActivity
                  parentExpanded={!isCollapsed}
                />
              ) : (
                <ActivityItemBase
                  activity={sub}
                  onMarkRead={onMarkRead}
                  isSubActivity
                  parentExpanded={!isCollapsed}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
