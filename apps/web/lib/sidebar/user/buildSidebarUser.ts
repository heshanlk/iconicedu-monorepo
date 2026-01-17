import type {
  NotificationDefaultsVM,
  NotificationPreferenceVM,
  PresenceVM,
  UserAccountVM,
  UserProfileVM,
} from '@iconicedu/shared-types';
import type { AccountRow, ProfileRow } from '@iconicedu/shared-types';
import type { SupabaseClient } from '@supabase/supabase-js';

import { mapAccountRowToVM, mapUserRoles } from '../../user/mappers/account.mapper';
import { mapBaseProfile } from '../../user/mappers/base-profile.mapper';
import {
  deriveProfileKind,
  resolveAvatarSource,
  resolveExternalAvatarUrl,
} from '../../user/derive';
import { createSignedAvatarUrl } from '../../user/queries/avatar.query';
import { getAccountById } from '../../user/queries/accounts.query';
import { getNotificationDefaults } from '../../user/queries/notification-defaults.query';
import { getPresence } from '../../user/queries/presence.query';
import {
  getProfileByAccountId,
  insertProfileForAccount,
  updateProfileAvatar,
  upsertProfileForAccount,
} from '../../user/queries/profiles.query';
import { getUserRoles } from '../../user/queries/roles.query';
import { buildChildProfile } from '../../user/builders/child.builder';
import { buildEducatorProfile } from '../../user/builders/educator.builder';
import { buildGuardianProfile } from '../../user/builders/guardian.builder';
import { buildStaffProfile } from '../../user/builders/staff.builder';
import { getGuardianFamilyInvites } from '../../user/queries/family-link-invites.query';
import {
  findFamilyInviteForAccount,
  mapFamilyLinkInviteRowToVM,
  type FamilyLinkInviteRow,
} from '../../family/invite';

export async function buildSidebarUser(
  supabase: SupabaseClient,
  user: {
    id: string;
    email?: string | null;
    user_metadata?: Record<string, unknown>;
    app_metadata?: Record<string, unknown>;
  },
  account: { id: string; org_id: string },
  familyInvite?: FamilyLinkInviteRow | null,
  profileKindOverride?: UserProfileVM['kind'],
): Promise<{ accountVM: UserAccountVM; profileVM: UserProfileVM }> {
  const [accountRow, roleRows, profileResponse] = await Promise.all([
    getAccountById(supabase, account.id),
    getUserRoles(supabase, account.id, account.org_id),
    getProfileByAccountId(supabase, account.id),
  ]);

  const userRoles = mapUserRoles(roleRows.data ?? []);
  const accountVM = mapAccountRowToVM(accountRow.data as AccountRow | null, {
    accountId: account.id,
    orgId: account.org_id,
    authEmail: user.email ?? null,
    userRoles,
  });

  let profileRow = profileResponse.data as ProfileRow | null;
  const externalAvatarUrl = resolveExternalAvatarUrl(user);
  const inviteRow =
    familyInvite ??
    (await findFamilyInviteForAccount({
      supabase,
      orgId: account.org_id,
      accountId: account.id,
      email: user.email ?? null,
    }));
  const derivedKind =
    profileKindOverride ?? inviteRow?.invited_role ?? deriveProfileKind(userRoles);

  if (!profileRow) {
    const upserted = await upsertProfileForAccount(supabase, {
      orgId: account.org_id,
      accountId: account.id,
      kind: derivedKind,
      avatarSource: externalAvatarUrl ? 'external' : 'seed',
      avatarUrl: externalAvatarUrl,
      avatarSeed: user.id,
      timezone: 'UTC',
      locale: 'en-US',
      status: 'active',
      uiThemeKey: 'teal',
    });

    if (upserted.error?.code === '42P10') {
      const fallback = await insertProfileForAccount(supabase, {
        orgId: account.org_id,
        accountId: account.id,
        kind: derivedKind,
        avatarSource: externalAvatarUrl ? 'external' : 'seed',
        avatarUrl: externalAvatarUrl,
        avatarSeed: user.id,
        timezone: 'UTC',
        locale: 'en-US',
        status: 'active',
        uiThemeKey: 'teal',
      });

      if (fallback.error) {
        throw fallback.error;
      }

      profileRow = fallback.data ?? null;
    } else if (upserted.error) {
      throw upserted.error;
    } else {
      profileRow = upserted.data ?? null;
    }
  }

  if (!profileRow) {
    throw new Error('Profile record missing for authenticated user.');
  }

  if (
    externalAvatarUrl &&
    !profileRow.avatar_url &&
    resolveAvatarSource(profileRow.avatar_source) === 'seed' &&
    !profileRow.avatar_updated_at
  ) {
    const updated = await updateProfileAvatar(supabase, {
      profileId: profileRow.id,
      orgId: profileRow.org_id,
      avatarUrl: externalAvatarUrl,
      avatarSource: 'external',
    });

    if (updated.data) {
      profileRow = updated.data;
    }
  }

  const [notificationDefaults, presence, avatarUrl] = await Promise.all([
    loadNotificationDefaults(supabase, profileRow.org_id, profileRow.id),
    loadPresence(supabase, profileRow.org_id, profileRow.id),
    resolveAvatarUrl(
      supabase,
      profileRow.avatar_source,
      profileRow.avatar_url ?? null,
    ),
  ]);

  const baseProfile = mapBaseProfile(profileRow, {
    notificationDefaults,
    presence,
    avatarUrlOverride: avatarUrl,
  });

  if (profileRow.kind === 'educator') {
    return {
      accountVM,
      profileVM: await buildEducatorProfile(supabase, baseProfile, profileRow),
    };
  }

  if (profileRow.kind === 'child') {
    return {
      accountVM,
      profileVM: await buildChildProfile(supabase, baseProfile, profileRow),
    };
  }

  if (profileRow.kind === 'staff') {
    return {
      accountVM,
      profileVM: await buildStaffProfile(supabase, baseProfile, profileRow),
    };
  }

  if (profileRow.kind === 'guardian') {
    const invitesResponse = await getGuardianFamilyInvites(
      supabase,
      profileRow.org_id,
      profileRow.account_id,
    );
    const invites =
      invitesResponse.data?.map((row) => mapFamilyLinkInviteRowToVM(row)) ?? [];
    const guardianProfile = await buildGuardianProfile(supabase, baseProfile, profileRow);
    return {
      accountVM,
      profileVM: {
        ...guardianProfile,
        familyInvites: invites,
      },
    };
  }

  return {
    accountVM,
    profileVM: {
      ...baseProfile,
      kind: 'system',
    },
  };
}

async function loadNotificationDefaults(
  supabase: SupabaseClient,
  orgId: string,
  profileId: string,
): Promise<NotificationDefaultsVM | null> {
  const { data } = await getNotificationDefaults(supabase, orgId, profileId);

  if (!data?.length) {
    return null;
  }

  const defaults: NotificationDefaultsVM = {};
  data.forEach((item) => {
    const channels = Array.isArray(item.channels)
      ? (item.channels.filter(Boolean) as NotificationPreferenceVM['channels'])
      : [];
    defaults[item.pref_key] = {
      channels,
      muted: item.muted ?? null,
    };
  });

  return defaults;
}

async function loadPresence(
  supabase: SupabaseClient,
  orgId: string,
  profileId: string,
): Promise<PresenceVM | null> {
  const { data } = await getPresence(supabase, orgId, profileId);
  if (!data) {
    return null;
  }

  return {
    state: {
      text: data.state_text,
      emoji: data.state_emoji,
      expiresAt: data.state_expires_at,
    },
    liveStatus: data.live_status ?? 'offline',
    displayStatus: data.display_status ?? undefined,
    lastSeenAt: data.last_seen_at,
    presenceLoaded: data.presence_loaded ?? undefined,
  };
}

async function resolveAvatarUrl(
  supabase: SupabaseClient,
  avatarSource: string,
  avatarUrl: string | null,
): Promise<string | null> {
  if (!avatarUrl) {
    return null;
  }

  if (resolveAvatarSource(avatarSource) !== 'upload') {
    return avatarUrl;
  }

  const { data, error } = await createSignedAvatarUrl(supabase, avatarUrl);
  if (error) {
    return null;
  }

  return data?.signedUrl ?? null;
}
