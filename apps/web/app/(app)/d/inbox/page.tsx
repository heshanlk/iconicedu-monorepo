import { DashboardHeader, InboxContainer } from '@iconicedu/ui-web';

import { createSupabaseServerClient } from '@iconicedu/web/lib/supabase/server';
import { requireAuthedUser } from '@iconicedu/web/lib/auth/requireAuthedUser';
import { getOrCreateAccount } from '@iconicedu/web/lib/accounts/getOrCreateAccount';
import { ORG_ID } from '@iconicedu/web/lib/data/ids';
import { buildActivityFeedByOrg } from '@iconicedu/web/lib/activity-feed/builders/activity-feed.builder';

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const authUser = await requireAuthedUser(supabase);
  const { account } = await getOrCreateAccount(supabase, {
    orgId: ORG_ID,
    authUserId: authUser.id,
    authEmail: authUser.email ?? null,
  });
  const feed = await buildActivityFeedByOrg(supabase, account.org_id);

  return (
    <div className="flex min-h-0 h-screen flex-1 flex-col">
      <DashboardHeader title={'Inbox'} />
      <div className="p-4 pt-0">
        <InboxContainer feed={feed} />
      </div>
    </div>
  );
}
