import type { ActivityFeedItemVM } from '@iconicedu/shared-types';

export function getActivityPrimaryLabel(item: ActivityFeedItemVM) {
  return item.content.headline.primary;
}
