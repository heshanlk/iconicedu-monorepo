import { NextRequest, NextResponse } from 'next/server';

import type { FamilyLinkInviteRow, FamilyLinkInviteVM } from '@iconicedu/shared-types';
import { createSupabaseServerClient } from '../../../../lib/supabase/server';
import { getAccountByAuthUserId } from '../../../../lib/sidebar/user/queries/accounts.query';
import {
  createFamilyInvite,
  deleteFamilyInvite,
  mapFamilyLinkInviteRowToVM,
} from '../../../../lib/family/invite';

type InvitePayload = {
  invitedRole: 'guardian' | 'child';
  invitedEmail: string;
  invitedPhoneE164?: string | null;
};

const toFamilyLinkInviteVM = (row: FamilyLinkInviteRow): FamilyLinkInviteVM =>
  mapFamilyLinkInviteRowToVM(row);

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const accountResponse = await getAccountByAuthUserId(supabase, userData.user.id);
  if (!accountResponse.data) {
    return NextResponse.json({ message: 'Account record not found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('family_link_invites')
    .select('*')
    .eq('org_id', accountResponse.data.org_id)
    .eq('created_by_account_id', accountResponse.data.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { message: 'Unable to load invites.' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    invites: (data ?? []).map(toFamilyLinkInviteVM),
  });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createSupabaseServerClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const accountResponse = await getAccountByAuthUserId(supabase, userData.user.id);
  if (!accountResponse.data) {
    return NextResponse.json({ message: 'Account record not found' }, { status: 404 });
  }

  const { inviteId } = (await request.json().catch(() => ({} as { inviteId?: string })));
  if (!inviteId) {
    return NextResponse.json({ message: 'Invite ID is required.' }, { status: 400 });
  }

  try {
    await deleteFamilyInvite({
      supabase,
      inviteId,
      guardianAccountId: accountResponse.data.id,
      orgId: accountResponse.data.org_id,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to delete invite.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const accountResponse = await getAccountByAuthUserId(supabase, userData.user.id);
  if (!accountResponse.data) {
    return NextResponse.json({ message: 'Account record not found' }, { status: 404 });
  }

  const payload: InvitePayload = await request.json().catch(() => ({} as InvitePayload));
  const trimmedEmail = (payload.invitedEmail ?? '').trim();
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return NextResponse.json({ message: 'Enter a valid email address.' }, { status: 400 });
  }
  if (payload.invitedRole !== 'guardian' && payload.invitedRole !== 'child') {
    return NextResponse.json({ message: 'Invalid invite role.' }, { status: 400 });
  }

  const invitedPhone =
    typeof payload.invitedPhoneE164 === 'string'
      ? payload.invitedPhoneE164.trim() || null
      : null;

  try {
    const insertedInvite = await createFamilyInvite({
      supabase,
      guardianAccountId: accountResponse.data.id,
      orgId: accountResponse.data.org_id,
      invitedRole: payload.invitedRole,
      invitedEmail: trimmedEmail,
      invitedPhoneE164: invitedPhone,
      createdByAccountId: accountResponse.data.id,
    });

    const inviteVM = toFamilyLinkInviteVM(insertedInvite);
    return NextResponse.json({ invite: inviteVM }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to send invite.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
