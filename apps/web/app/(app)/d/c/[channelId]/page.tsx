import { notFound } from 'next/navigation';
import { DashboardHeader, MessagesShell } from '@iconicedu/ui-web';
import { createSupabaseServerClient } from '@iconicedu/web/lib/supabase/server';
import { requireAuthedUser } from '@iconicedu/web/lib/auth/requireAuthedUser';
import { getOrCreateAccount } from '@iconicedu/web/lib/accounts/getOrCreateAccount';
import { getProfileByAccountId } from '@iconicedu/web/lib/profile/queries/profiles.query';
import { ORG_ID } from '@iconicedu/web/lib/data/ids';
import { buildChannelById } from '@iconicedu/web/lib/channels/builders/channel.builder';

export default async function Page({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;
  const supabase = await createSupabaseServerClient();
  const authUser = await requireAuthedUser(supabase);
  const { account } = await getOrCreateAccount(supabase, {
    orgId: ORG_ID,
    authUserId: authUser.id,
    authEmail: authUser.email ?? null,
  });
  const profileResponse = await getProfileByAccountId(supabase, account.id);
  const channel = await buildChannelById(supabase, account.org_id, channelId, {
    accountId: account.id,
  });

  if (!channel) {
    notFound();
  }

  return (
    <div className="flex h-[calc(100vh-1.0rem)] flex-col">
      <DashboardHeader />
      <MessagesShell channel={channel} currentUserId={profileResponse.data?.id ?? ''} />
    </div>
  );
}
