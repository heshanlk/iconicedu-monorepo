import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function requireAuthedUser(supabase: SupabaseClient) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect('/login');
  }
  return data.user;
}
