import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '../../../../lib/supabase/server';
import { createSupabaseServiceClient } from '../../../../lib/supabase/service';
import { ORG } from '../../../../lib/data/org';
import { getOrCreateAccount } from '../../../../lib/accounts/getOrCreateAccount';
import { updateAccountStatus } from '../../../../lib/accounts/queries/accounts.query';

export async function POST() {
  const sessionSupabase = await createSupabaseServerClient();
  const { data } = await sessionSupabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const serviceSupabase = createSupabaseServiceClient();

  try {
    const { account } = await getOrCreateAccount(serviceSupabase, {
      orgId: ORG.id,
      authUserId: data.user.id,
      authEmail: data.user.email ?? null,
    });

    await updateAccountStatus(
      serviceSupabase,
      account.id,
      ORG.id,
      'active',
      data.user.id,
    );

    return NextResponse.json({ status: 'active' });
  } catch (error) {
    console.error('activate-account', error);
    return NextResponse.json(
      { error: 'Unable to activate account' },
      { status: 500 },
    );
  }
}
