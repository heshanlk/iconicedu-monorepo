import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '../../../../lib/supabase/server';
import { ORG } from '../../../../lib/data/org';
import { getOrCreateAccount } from '../../../../lib/accounts/getOrCreateAccount';

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await getOrCreateAccount(supabase, {
      orgId: ORG.id,
      authUserId: data.user.id,
      authEmail: data.user.email ?? null,
    });

    return NextResponse.json({ status: 'active' });
  } catch (error) {
    console.error('activate-account', error);
    return NextResponse.json(
      { error: 'Unable to activate account' },
      { status: 500 },
    );
  }
}
