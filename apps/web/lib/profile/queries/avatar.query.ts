import type { SupabaseClient } from '@supabase/supabase-js';

import { AVATAR_BUCKET, AVATAR_SIGNED_URL_TTL } from '../constants/theme';

export async function createSignedAvatarUrl(
  supabase: SupabaseClient,
  avatarPath: string,
) {
  return supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(avatarPath, AVATAR_SIGNED_URL_TTL);
}
