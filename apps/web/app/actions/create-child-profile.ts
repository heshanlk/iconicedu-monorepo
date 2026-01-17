'use server';

import type { AccountRow, ChildProfileVM } from '@iconicedu/shared-types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getFamilyInviteAdminClient, ensureFamilyForGuardian } from '../../lib/family/invite';
import { loadChildProfiles } from '../../lib/sidebar/user/builders/load-child-profiles';
import { getAccountByAuthUserId } from '../../lib/sidebar/user/queries/accounts.query';
import { createSupabaseServerClient } from '../../lib/supabase/server';

const normalizeEmail = (value?: string | null) => value?.trim().toLowerCase() ?? null;

async function createOrLoadChildAccount(options: {
  serviceClient: SupabaseClient;
  orgId: string;
  email?: string | null;
  createdByAccountId: string;
}): Promise<AccountRow> {
  const normalizedEmail = normalizeEmail(options.email);

  if (normalizedEmail) {
    // TODO: revisit invite flow when child account exists with the same email so we don't silently skip needed updates.
    const { data: existingAccount } = await options.serviceClient
      .from('accounts')
      .select('*')
      .eq('org_id', options.orgId)
      .ilike('email', normalizedEmail)
      .is('deleted_at', null)
      .limit(1)
      .maybeSingle<AccountRow>();

    if (existingAccount) {
      return existingAccount;
    }
  }

  const { data: childAccount, error: accountError } = await options.serviceClient
    .from('accounts')
    .insert({
      org_id: options.orgId,
      email: normalizedEmail,
      preferred_contact_channels: ['email'],
      status: 'active',
      created_by: options.createdByAccountId,
      updated_by: options.createdByAccountId,
    })
    .select('*')
    .single<AccountRow>();

  if (accountError || !childAccount) {
    throw accountError ?? new Error('Unable to create child account');
  }

  return childAccount;
}

type CreateChildProfileInput = {
  orgId: string;
  displayName: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  birthYear: number;
  email?: string | null;
  timezone?: string | null;
  city?: string | null;
  region?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
};

export async function createChildProfileAction(
  input: CreateChildProfileInput,
): Promise<ChildProfileVM> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const accountResponse = await getAccountByAuthUserId(supabase, user.id);
  if (!accountResponse.data) {
    throw new Error('Guardian account not found');
  }

  const guardianAccount = accountResponse.data;
  if (input.orgId !== guardianAccount.org_id) {
    throw new Error('Organization mismatch');
  }
  const serviceClient = getFamilyInviteAdminClient();

  const childAccount = await createOrLoadChildAccount({
    serviceClient,
    orgId: guardianAccount.org_id,
    email: input.email,
    createdByAccountId: guardianAccount.id,
  });
  const displayNameValue = `${input.firstName.trim()} ${input.lastName.trim()}`.trim();

  const profilePayload = {
    org_id: guardianAccount.org_id,
    account_id: childAccount.id,
    kind: 'child',
    display_name: displayNameValue,
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    avatar_source: 'seed',
    avatar_url: null,
    avatar_seed: childAccount.id,
    timezone: input.timezone ?? 'UTC',
    locale: 'en-US',
    status: 'active',
    country_code: input.countryCode ?? null,
    country_name: input.countryName ?? null,
    region: input.region ?? null,
    city: input.city ?? null,
    created_by: guardianAccount.id,
    updated_by: guardianAccount.id,
  };

  const { data: profileRow, error: profileError } = await serviceClient
    .from('profiles')
    .upsert(profilePayload, { onConflict: 'org_id,account_id' })
    .select('*')
    .single();

  if (profileError || !profileRow) {
    throw profileError ?? new Error('Unable to create child profile');
  }

  const familyId = await ensureFamilyForGuardian({
    supabase: serviceClient,
    guardianAccountId: guardianAccount.id,
    orgId: guardianAccount.org_id,
  });

  const { error: linkError } = await serviceClient
    .from('family_links')
    .upsert(
      {
        org_id: guardianAccount.org_id,
        family_id: familyId,
        guardian_account_id: guardianAccount.id,
        child_account_id: childAccount.id,
        relation: 'guardian',
        created_by: guardianAccount.id,
        updated_by: guardianAccount.id,
      },
      { onConflict: 'org_id,family_id,guardian_account_id,child_account_id' },
    );

  if (linkError) {
    throw linkError;
  }

  const { error: childProfileError } = await serviceClient
    .from('child_profiles')
    .upsert(
      {
        profile_id: profileRow.id,
        org_id: guardianAccount.org_id,
        birth_year: input.birthYear,
        created_by: guardianAccount.id,
        updated_by: guardianAccount.id,
      },
      { onConflict: 'org_id,profile_id' },
    );

  if (childProfileError) {
    throw childProfileError;
  }

  const { error: gradeError } = await serviceClient
    .from('child_profile_grade_level')
    .upsert(
      {
        org_id: guardianAccount.org_id,
        profile_id: profileRow.id,
        grade_id: input.gradeLevel,
        grade_label: input.gradeLevel,
        created_by: guardianAccount.id,
        updated_by: guardianAccount.id,
      },
      { onConflict: 'org_id,profile_id' },
    );

  if (gradeError) {
    throw gradeError;
  }

  const children = await loadChildProfiles(
    serviceClient,
    guardianAccount.org_id,
    [childAccount.id],
  );

  if (!children.length) {
    throw new Error('Unable to load child profile');
  }

  return children[0];
}
