import type { ActivityFeedVM } from '@iconicedu/shared-types';

import { INBOX_ACTIVITY_FEED } from '@iconicedu/web/lib/data/inbox-activities';

export function getInboxActivityFeed(): ActivityFeedVM {
  return INBOX_ACTIVITY_FEED;
}
