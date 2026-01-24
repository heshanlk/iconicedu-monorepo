'use server';

import type { AccountRow } from '@iconicedu/shared-types';
import { headers } from 'next/headers';
import { z } from 'zod';

import { createSupabaseServerClient } from '../../../../../../lib/supabase/server';
import { ORG } from '../../../../../../lib/data/org';
import {
  getAccountByAuthUserId,
  getAccountByEmail,
  insertInvitedAccount,
} from '../../../../../../lib/user/queries/accounts.query';
import {
  insertProfileForAccount,
  upsertProfileForAccount,
} from '../../../../../../lib/user/queries/profiles.query';
import { getFamilyInviteAdminClient } from '../../../../../../lib/family/queries/invite.query';

const INVITE_SCHEMA = z.object({
  email: z.string().trim().email(),
  profileKind: z.enum(['guardian', 'staff', 'educator']),
});

type InviteUserResult = {
  email: string;
  inviteUrl: string;
};

const KIND_DISPLAY_NAME: Record<z.infer<typeof INVITE_SCHEMA>['profileKind'], string> = {
  guardian: 'Invited guardian',
  staff: 'Invited staff',
  educator: 'Invited educator',
};

function buildRedirectUrl(profileKind: string, baseUrl: string) {
  const sanitizedBase = baseUrl.replace(/\/$/, '');
  const params = new URLSearchParams({ profileKind });
  return `${sanitizedBase}/auth/callback?${params.toString()}`;
}

async function resolveBaseUrl() {
  const headerStore = headers();
  const forwardedHost =
    headerStore.get('x-forwarded-host') ?? headerStore.get('host') ?? undefined;
  const protocol = headerStore.get('x-forwarded-proto') ?? 'https';
  if (forwardedHost) {
    return `${protocol}://${forwardedHost}`;
  }
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

export async function inviteAdminUserAction(
  formData: FormData,
): Promise<InviteUserResult> {
  const parsed = INVITE_SCHEMA.parse({
    email: formData.get('email'),
    profileKind: formData.get('profileKind'),
  });

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error('Unauthorized');
  }

  const accountResponse = await getAccountByAuthUserId(supabase, userData.user.id);
  if (!accountResponse.data) {
    throw new Error('Account record not found');
  }

  const adminClient = getFamilyInviteAdminClient();
  const normalizedEmail = parsed.email.toLowerCase();

  const existingAccountResponse = await getAccountByEmail(
    adminClient,
    ORG.id,
    normalizedEmail,
  );

  if (existingAccountResponse.error) {
    throw existingAccountResponse.error;
  }

  let targetAccount: AccountRow | null | undefined = existingAccountResponse.data;

  if (!targetAccount) {
    const { data: insertedAccount, error: insertError } = await insertInvitedAccount(
      adminClient,
      {
        orgId: ORG.id,
        email: normalizedEmail,
        createdBy: accountResponse.data.id,
      },
    );

    if (insertError || !insertedAccount) {
      throw insertError ?? new Error('Unable to create account.');
    }

    targetAccount = insertedAccount;
  }

  if (!targetAccount?.id) {
    throw new Error('Unable to resolve invited account.');
  }

  const { data: profileInserted, error: upsertError } =
    await upsertProfileForAccount(adminClient, {
      orgId: ORG.id,
      accountId: targetAccount.id,
      kind: parsed.profileKind,
      displayName: KIND_DISPLAY_NAME[parsed.profileKind],
      avatarSource: 'seed',
      avatarUrl: null,
      avatarSeed: targetAccount.id,
      timezone: 'UTC',
      locale: 'en-US',
      status: 'invited',
      uiThemeKey: 'teal',
    });

  if (upsertError?.code === '42P10') {
    const { error: insertError } = await insertProfileForAccount(adminClient, {
      orgId: ORG.id,
      accountId: targetAccount.id,
      kind: parsed.profileKind,
      displayName: KIND_DISPLAY_NAME[parsed.profileKind],
      avatarSource: 'seed',
      avatarUrl: null,
      avatarSeed: targetAccount.id,
      timezone: 'UTC',
      locale: 'en-US',
      status: 'invited',
      uiThemeKey: 'teal',
    });
    if (insertError) {
      throw insertError;
    }
  } else if (upsertError) {
    throw upsertError;
  }

  const baseUrl = await resolveBaseUrl();
  const redirectTo = buildRedirectUrl(parsed.profileKind, baseUrl);

  const { error: otpError } = await adminClient.auth.signInWithOtp({
    email: normalizedEmail,
    emailRedirectTo: redirectTo,
  });

  if (otpError) {
    throw otpError;
  }

  const { data: generatedLink, error: linkError } =
    await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email: normalizedEmail,
      redirectTo,
    });

  if (linkError) {
    throw linkError;
  }

  return {
    email: normalizedEmail,
    inviteUrl: generatedLink?.action_link ?? redirectTo,
  };
}
