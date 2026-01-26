import { createSupabaseServerClient } from '@iconicedu/web/lib/supabase/server';
import { requireAuthedUser } from '@iconicedu/web/lib/auth/requireAuthedUser';
import { getOrCreateAccount } from '@iconicedu/web/lib/accounts/getOrCreateAccount';
import { ORG_ID } from '@iconicedu/web/lib/data/ids';
import { buildClassSchedulesByOrg } from '@iconicedu/web/lib/schedules/builders/class-schedule.builder';
import { ClassScheduleClient } from '@iconicedu/web/app/(app)/d/class-schedule/class-schedule-client';

export default async function ClassSchedulePage() {
  const supabase = await createSupabaseServerClient();
  const authUser = await requireAuthedUser(supabase);
  const { account } = await getOrCreateAccount(supabase, {
    orgId: ORG_ID,
    authUserId: authUser.id,
    authEmail: authUser.email ?? null,
  });
  const events = await buildClassSchedulesByOrg(supabase, account.org_id);

  return <ClassScheduleClient events={events} />;
}
