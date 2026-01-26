import type { SupabaseClient } from '@supabase/supabase-js';

import type { NotificationPreferenceRow } from '@iconicedu/shared-types';

import { NOTIFICATION_DEFAULTS_SELECT } from '@iconicedu/web/lib/profile/constants/selects';

export async function getNotificationDefaults(
  supabase: SupabaseClient,
  orgId: string,
  profileId: string,
) {
  return supabase
    .from('notification_preferences')
    .select(NOTIFICATION_DEFAULTS_SELECT)
    .eq('org_id', orgId)
    .eq('profile_id', profileId)
    .is('deleted_at', null)
    .returns<NotificationPreferenceRow[]>();
}
