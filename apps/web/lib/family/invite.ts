import { createHash, randomUUID } from 'crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type {
  FamilyLinkInviteRole,
  FamilyLinkInviteRow,
  FamilyLinkInviteVM,
} from '@iconicedu/shared-types';
import { getProfileByAccountId } from '../sidebar/user/queries/profiles.query';

export const FAMILY_INVITE_EXPIRATION_DAYS = 7;

type EnsureFamilyOptions = {
  supabase: SupabaseClient;
  guardianAccountId: string;
  orgId: string;
};

type CreateFamilyInviteOptions = EnsureFamilyOptions & {
  invitedRole: FamilyLinkInviteRole;
  invitedEmail: string;
  invitedPhoneE164?: string | null;
  createdByAccountId: string;
  expiresInDays?: number;
  maxUses?: number;
};

const getFamilyInviteAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    throw new Error('Missing Supabase service role configuration.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
};

const createFamilyInvitationHash = () => {
  const inviteCode = randomUUID();
  const inviteCodeHash = createHash('sha256').update(inviteCode).digest('hex');
  return inviteCodeHash;
};

export async function ensureFamilyForGuardian(options: EnsureFamilyOptions) {
  const { supabase, guardianAccountId, orgId } = options;

  const { data: existingLink } = await supabase
    .from('family_links')
    .select('family_id')
    .eq('guardian_account_id', guardianAccountId)
    .eq('org_id', orgId)
    .is('deleted_at', null)
    .limit(1)
    .maybeSingle<{ family_id: string }>();

  if (existingLink?.family_id) {
    return existingLink.family_id;
  }

  const profileResponse = await getProfileByAccountId(supabase, guardianAccountId);
  const lastName = profileResponse.data?.last_name?.trim();
  const label = lastName ? `${lastName}'s Family` : 'Family';

  const { data: familyData, error } = await supabase
    .from('families')
    .insert({
      org_id: orgId,
      display_name: label,
      created_by: guardianAccountId,
    })
    .select('id')
    .single<{ id: string }>();

  if (error || !familyData) {
    throw error ?? new Error('Unable to create family record.');
  }

  return familyData.id;
}

export async function createFamilyInvite(options: CreateFamilyInviteOptions) {
  const familyId = await ensureFamilyForGuardian({
    supabase: options.supabase,
    guardianAccountId: options.guardianAccountId,
    orgId: options.orgId,
  });

  const adminClient = getFamilyInviteAdminClient();
  const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
    options.invitedEmail,
  );

  if (inviteError) {
    throw inviteError;
  }

  const expiresAt = new Date();
  expiresAt.setDate(
    expiresAt.getDate() + (options.expiresInDays ?? FAMILY_INVITE_EXPIRATION_DAYS),
  );

  const inviteCodeHash = createFamilyInvitationHash();

  const { data, error } = await options.supabase
    .from('family_link_invites')
    .insert({
      org_id: options.orgId,
      family_id: familyId,
      invited_role: options.invitedRole,
      invited_email: options.invitedEmail,
      invited_phone_e164: options.invitedPhoneE164 ?? null,
      invite_code_hash: inviteCodeHash,
      created_by_account_id: options.createdByAccountId,
      status: 'pending',
      expires_at: expiresAt.toISOString(),
      max_uses: options.maxUses ?? 1,
      uses: 0,
      created_by: options.createdByAccountId,
      updated_by: options.createdByAccountId,
    })
    .select('*')
    .single<FamilyLinkInviteRow>();

  if (error || !data) {
    throw error ?? new Error('Unable to record invite.');
  }

  return data;
}

export function mapFamilyLinkInviteRowToVM(row: FamilyLinkInviteRow): FamilyLinkInviteVM {
  return {
    id: row.id,
    orgId: row.org_id,
    familyId: row.family_id,
    invitedRole: row.invited_role,
    invitedEmail: row.invited_email ?? null,
    invitedPhoneE164: row.invited_phone_e164 ?? null,
    status: row.status,
    expiresAt: row.expires_at ?? null,
    acceptedByAccountId: row.accepted_by_account_id ?? null,
    acceptedAt: row.accepted_at ?? null,
    maxUses: row.max_uses,
    uses: row.uses,
    createdByAccountId: row.created_by_account_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function deleteFamilyInvite(options: {
  supabase: SupabaseClient;
  inviteId: string;
  guardianAccountId: string;
  orgId: string;
}) {
  const { data, error } = await options.supabase
    .from('family_link_invites')
    .delete()
    .eq('id', options.inviteId)
    .eq('org_id', options.orgId)
    .eq('created_by_account_id', options.guardianAccountId)
    .is('deleted_at', null);

  if (error) {
    throw error;
  }

  return data;
}
