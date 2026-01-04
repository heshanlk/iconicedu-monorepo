import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { SidebarProvider } from '@iconicedu/ui-web';
import { SidebarShell } from './sidebar-shell';
import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { ORG } from '../../../lib/data/org';
import { SIDEBAR_LEFT_DATA } from '../../../lib/data/sidebar-left';
import type {
  AvatarSource,
  ChildProfileVM,
  ConnectionVM,
  EducatorProfileVM,
  GradeLevelOption,
  NotificationDefaultsVM,
  NotificationPreferenceVM,
  PresenceVM,
  RoleKey,
  SidebarLeftDataVM,
  StaffProfileVM,
  ThemeKey,
  UserAccountVM,
  UserProfileVM,
  UserRoleVM,
} from '@iconicedu/shared-types';
import type {
  AccountRow,
  ChildProfileRow,
  ChildProfileGradeLevelRow,
  EducatorProfileRow,
  FamilyLinkRow,
  GuardianProfileRow,
  ProfilePresenceRow,
  ProfileRow,
  StaffProfileRow,
  UserRoleRow,
} from '@iconicedu/shared-types';

export default async function Layout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/login');
  }

  let { data: account } = await supabase
    .from('accounts')
    .select('id, org_id')
    .eq('auth_user_id', data.user.id)
    .is('deleted_at', null)
    .maybeSingle();

  if (!account) {
    const { data: inserted, error } = await supabase
      .from('accounts')
      .insert({
        org_id: ORG.id,
        auth_user_id: data.user.id,
        email: data.user.email ?? null,
        preferred_contact_channels: ['email'],
        status: 'active',
      })
      .select('id, org_id')
      .single();

    if (error) {
      redirect('/login');
    }

    account = inserted;
  }

  const { accountVM, profileVM } = await buildSidebarUser(supabase, data.user, account);

  const needsNameCompletion =
    !profileVM.profile.firstName?.trim() || !profileVM.profile.lastName?.trim();
  const needsPhoneCompletion =
    !accountVM.contacts.phoneE164?.trim() || !accountVM.contacts.phoneVerified;
  const sidebarData: SidebarLeftDataVM = {
    ...SIDEBAR_LEFT_DATA,
    user: {
      profile: profileVM,
      account: accountVM,
    },
  };

  return (
    <>
      <SidebarProvider>
        <SidebarShell
          data={sidebarData}
          forceProfileCompletion={needsNameCompletion}
          forceAccountCompletion={!needsNameCompletion && needsPhoneCompletion}
        >
          {children}
        </SidebarShell>
      </SidebarProvider>
    </>
  );
}

async function buildSidebarUser(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  user: {
    id: string;
    email?: string | null;
    user_metadata?: Record<string, unknown>;
    app_metadata?: Record<string, unknown>;
  },
  account: { id: string; org_id: string },
): Promise<{ accountVM: UserAccountVM; profileVM: UserProfileVM }> {
  const { data: accountRow } = await supabase
    .from('accounts')
    .select(
      [
        'id',
        'org_id',
        'email',
        'phone_e164',
        'whatsapp_e164',
        'email_verified',
        'email_verified_at',
        'phone_verified',
        'phone_verified_at',
        'whatsapp_verified',
        'whatsapp_verified_at',
        'preferred_contact_channels',
        'status',
        'created_at',
        'updated_at',
        'archived_at',
      ].join(','),
    )
    .eq('id', account.id)
    .maybeSingle<AccountRow>();

  const { data: roleRows } = await supabase
    .from('user_roles')
    .select('id, org_id, role_key, assigned_by, assigned_at')
    .eq('account_id', account.id)
    .eq('org_id', account.org_id)
    .is('deleted_at', null);

  const userRoles: UserRoleVM[] =
    (roleRows as UserRoleRow[] | null | undefined)?.map((role) => ({
      ids: {
        id: role.id,
        orgId: role.org_id,
      },
      roleKey: role.role_key as RoleKey,
      audit: {
        assignedBy: role.assigned_by ?? null,
        assignedAt: role.assigned_at,
      },
    })) ?? [];

  const accountVM: UserAccountVM = {
    ids: {
      id: account.id,
      orgId: account.org_id,
    },
    contacts: {
      email: accountRow?.email ?? user.email ?? null,
      phoneE164: accountRow?.phone_e164 ?? null,
      whatsappE164: accountRow?.whatsapp_e164 ?? null,
      emailVerified: accountRow?.email_verified ?? null,
      emailVerifiedAt: accountRow?.email_verified_at ?? null,
      phoneVerified: accountRow?.phone_verified ?? null,
      phoneVerifiedAt: accountRow?.phone_verified_at ?? null,
      whatsappVerified: accountRow?.whatsapp_verified ?? null,
      whatsappVerifiedAt: accountRow?.whatsapp_verified_at ?? null,
      preferredContactChannels:
        (accountRow?.preferred_contact_channels as Array<
          'email' | 'sms' | 'whatsapp'
        > | null) ?? ['email'],
    },
    access: userRoles.length
      ? {
          userRoles,
          activeContext: null,
        }
      : undefined,
    lifecycle: {
      status: accountRow?.status ?? 'active',
      createdAt: accountRow?.created_at ?? new Date().toISOString(),
      updatedAt: accountRow?.updated_at ?? new Date().toISOString(),
      archivedAt: accountRow?.archived_at ?? null,
    },
  };

  let { data: profileRow } = await supabase
    .from('profiles')
    .select(
      [
        'id',
        'org_id',
        'account_id',
        'kind',
        'display_name',
        'first_name',
        'last_name',
        'bio',
        'avatar_source',
        'avatar_url',
        'avatar_seed',
        'avatar_updated_at',
        'timezone',
        'locale',
        'languages_spoken',
        'status',
        'country_code',
        'country_name',
        'region',
        'city',
        'postal_code',
        'notes_internal',
        'lead_source',
        'ui_theme_key',
        'created_at',
        'updated_at',
      ].join(','),
    )
    .eq('account_id', account.id)
    .is('deleted_at', null)
    .maybeSingle<ProfileRow>();

  const externalAvatarUrl = resolveExternalAvatarUrl(user);

  if (!profileRow) {
    const derivedKind = deriveProfileKind(userRoles);
    const displayName = deriveDisplayName(user);
    const { data: insertedProfile } = await supabase
      .from('profiles')
      .insert({
        org_id: account.org_id,
        account_id: account.id,
        kind: derivedKind,
        display_name: displayName,
        first_name: null,
        last_name: null,
        avatar_source: externalAvatarUrl ? 'external' : 'seed',
        avatar_url: externalAvatarUrl,
        avatar_seed: user.id,
        timezone: 'UTC',
        locale: 'en-US',
        status: 'active',
        ui_theme_key: 'teal',
      })
      .select(
        [
          'id',
          'org_id',
          'account_id',
          'kind',
          'display_name',
          'first_name',
          'last_name',
          'bio',
          'avatar_source',
          'avatar_url',
          'avatar_seed',
          'avatar_updated_at',
          'timezone',
          'locale',
          'languages_spoken',
          'status',
          'country_code',
          'country_name',
          'region',
          'city',
          'postal_code',
          'notes_internal',
          'lead_source',
          'ui_theme_key',
          'created_at',
          'updated_at',
        ].join(','),
      )
      .single<ProfileRow>();

    profileRow = insertedProfile ?? null;
  }

  if (!profileRow) {
    redirect('/login');
  }

  if (
    externalAvatarUrl &&
    !profileRow.avatar_url &&
    resolveAvatarSource(profileRow.avatar_source) === 'seed'
  ) {
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .update({
        avatar_source: 'external',
        avatar_url: externalAvatarUrl,
      })
      .eq('id', profileRow.id)
      .eq('org_id', profileRow.org_id)
      .select(
        [
          'id',
          'org_id',
          'account_id',
          'kind',
          'display_name',
          'first_name',
          'last_name',
          'bio',
          'avatar_source',
          'avatar_url',
          'avatar_seed',
          'avatar_updated_at',
          'timezone',
          'locale',
          'languages_spoken',
          'status',
          'country_code',
          'country_name',
          'region',
          'city',
          'postal_code',
          'notes_internal',
          'lead_source',
          'ui_theme_key',
          'created_at',
          'updated_at',
        ].join(','),
      )
      .maybeSingle<ProfileRow>();

    if (updatedProfile) {
      profileRow = updatedProfile;
    }
  }

  const notificationDefaults = await loadNotificationDefaults(
    supabase,
    profileRow.org_id,
    profileRow.id,
  );
  const presence = await loadPresence(supabase, profileRow.org_id, profileRow.id);

  const avatarUrl = await resolveAvatarUrl(
    supabase,
    profileRow.avatar_source,
    profileRow.avatar_url,
  );
  const baseProfile = buildBaseProfile(
    profileRow,
    notificationDefaults,
    presence,
    avatarUrl,
  );

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
    return {
      accountVM,
      profileVM: await buildGuardianProfile(supabase, baseProfile, profileRow),
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

function deriveDisplayName(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}) {
  const fullName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : null;
  if (fullName?.trim()) {
    return fullName.trim();
  }
  if (user.email) {
    return user.email.split('@')[0];
  }
  return 'New user';
}

function resolveExternalAvatarUrl(user: {
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}): string | null {
  const provider = user.app_metadata?.provider;
  if (provider !== 'google') {
    return null;
  }

  const avatarUrl =
    (typeof user.user_metadata?.avatar_url === 'string'
      ? user.user_metadata.avatar_url
      : null) ??
    (typeof user.user_metadata?.picture === 'string'
      ? user.user_metadata.picture
      : null);

  return avatarUrl && avatarUrl.trim() ? avatarUrl.trim() : null;
}

function deriveProfileKind(userRoles: UserRoleVM[]): UserProfileVM['kind'] {
  const rolePriority: RoleKey[] = [
    'guardian',
    'educator',
    'staff',
    'child',
    'admin',
    'owner',
  ];
  const roleKey =
    rolePriority.find((candidate) =>
      userRoles.some((role) => role.roleKey === candidate),
    ) ?? null;

  if (roleKey === 'educator') return 'educator';
  if (roleKey === 'child') return 'child';
  if (roleKey === 'staff') return 'staff';
  if (roleKey === 'admin' || roleKey === 'owner') return 'staff';
  return 'guardian';
}

function resolveAvatarSource(value: string | null): AvatarSource {
  if (value === 'upload' || value === 'external' || value === 'seed') {
    return value;
  }
  return 'seed';
}

const THEME_KEYS: ThemeKey[] = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'amber',
  'blue',
  'cyan',
  'emerald',
  'fuchsia',
  'green',
  'indigo',
  'lime',
  'orange',
  'pink',
  'purple',
  'red',
  'rose',
  'sky',
  'teal',
  'violet',
  'yellow',
];
const THEME_KEY_SET = new Set(THEME_KEYS);
const AVATAR_BUCKET = 'public-avatars';
const AVATAR_SIGNED_URL_TTL = 60 * 60;

function resolveThemeKey(value: string | null): ThemeKey | null {
  if (value && THEME_KEY_SET.has(value as ThemeKey)) {
    return value as ThemeKey;
  }
  return null;
}

function buildBaseProfile(
  profileRow: ProfileRow,
  notificationDefaults: NotificationDefaultsVM | null,
  presence: PresenceVM | null,
  avatarUrlOverride?: string | null,
): Omit<UserProfileVM, 'kind'> {
  return {
    ids: {
      id: profileRow.id,
      orgId: profileRow.org_id,
      accountId: profileRow.account_id,
    },
    profile: {
      displayName: profileRow.display_name,
      firstName: profileRow.first_name,
      lastName: profileRow.last_name,
      bio: profileRow.bio,
      avatar: {
        source: resolveAvatarSource(profileRow.avatar_source),
        url: avatarUrlOverride ?? profileRow.avatar_url,
        seed: profileRow.avatar_seed,
        updatedAt: profileRow.avatar_updated_at,
      },
    },
    prefs: {
      timezone: profileRow.timezone ?? 'UTC',
      locale: profileRow.locale,
      languagesSpoken: profileRow.languages_spoken,
      notificationDefaults,
    },
    presence,
    status: profileRow.status ?? undefined,
    location: {
      countryCode: profileRow.country_code,
      countryName: profileRow.country_name,
      region: profileRow.region,
      city: profileRow.city,
      postalCode: profileRow.postal_code,
    },
    internal: {
      notesInternal: profileRow.notes_internal,
      leadSource: profileRow.lead_source,
    },
    meta: {
      createdAt: profileRow.created_at,
      updatedAt: profileRow.updated_at,
    },
    ui: {
      themeKey: resolveThemeKey(profileRow.ui_theme_key),
    },
  };
}

async function resolveAvatarUrl(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  avatarSource: string,
  avatarUrl: string | null,
): Promise<string | null> {
  if (!avatarUrl) {
    return null;
  }

  if (resolveAvatarSource(avatarSource) !== 'upload') {
    return avatarUrl;
  }

  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(avatarUrl, AVATAR_SIGNED_URL_TTL);

  if (error) {
    return null;
  }

  return data?.signedUrl ?? null;
}

async function loadNotificationDefaults(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  orgId: string,
  profileId: string,
): Promise<NotificationDefaultsVM | null> {
  const { data } = await supabase
    .from('notification_preferences')
    .select('pref_key, channels, muted')
    .eq('org_id', orgId)
    .eq('profile_id', profileId)
    .is('deleted_at', null);

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
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  orgId: string,
  profileId: string,
): Promise<PresenceVM | null> {
  const { data } = await supabase
    .from('profile_presence')
    .select(
      [
        'state_text',
        'state_emoji',
        'state_expires_at',
        'live_status',
        'display_status',
        'last_seen_at',
        'presence_loaded',
      ].join(','),
    )
    .eq('org_id', orgId)
    .eq('profile_id', profileId)
    .is('deleted_at', null)
    .maybeSingle<ProfilePresenceRow>();

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

async function buildEducatorProfile(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  baseProfile: Omit<UserProfileVM, 'kind'>,
  profileRow: ProfileRow,
): Promise<EducatorProfileVM> {
  const { data: educator } = await supabase
    .from('educator_profiles')
    .select(
      [
        'headline',
        'education',
        'experience_years',
        'certifications',
        'joined_date',
        'age_groups_comfortable_with',
        'identity_verification_status',
        'average_rating',
        'total_reviews',
        'featured_video_intro_url',
      ].join(','),
    )
    .eq('profile_id', profileRow.id)
    .is('deleted_at', null)
    .maybeSingle<EducatorProfileRow>();

  const { data: subjectRows } = await supabase
    .from('educator_profile_subjects')
    .select('subject')
    .eq('profile_id', profileRow.id)
    .is('deleted_at', null);
  const { data: gradeRows } = await supabase
    .from('educator_profile_grade_levels')
    .select('grade_id, grade_label')
    .eq('profile_id', profileRow.id)
    .is('deleted_at', null);
  const { data: tagRows } = await supabase
    .from('educator_profile_curriculum_tags')
    .select('tag')
    .eq('profile_id', profileRow.id)
    .is('deleted_at', null);
  const { data: badgeRows } = await supabase
    .from('educator_profile_badges')
    .select('badge')
    .eq('profile_id', profileRow.id)
    .is('deleted_at', null);

  return {
    ...baseProfile,
    kind: 'educator',
    headline: educator?.headline ?? null,
    subjects: subjectRows?.map((row) => row.subject) ?? null,
    gradesSupported:
      gradeRows?.map((row) => ({
        id: row.grade_id,
        label: row.grade_label ?? row.grade_id,
      })) ?? null,
    education: educator?.education ?? null,
    experienceYears: educator?.experience_years ?? null,
    certifications: educator?.certifications ?? null,
    joinedDate: educator?.joined_date ?? profileRow.created_at,
    ageGroupsComfortableWith: educator?.age_groups_comfortable_with ?? null,
    identityVerificationStatus: educator?.identity_verification_status ?? null,
    curriculumTags: tagRows?.map((row) => row.tag) ?? null,
    badges: badgeRows?.map((row) => row.badge) ?? null,
    averageRating: educator?.average_rating ?? null,
    totalReviews: educator?.total_reviews ?? null,
    featuredVideoIntroUrl: educator?.featured_video_intro_url ?? null,
  };
}

async function buildChildProfile(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  baseProfile: Omit<UserProfileVM, 'kind'>,
  profileRow: ProfileRow,
): Promise<ChildProfileVM> {
  const { data: child } = await supabase
    .from('child_profiles')
    .select('birth_year, school_name, school_year, confidence_level, communication_style')
    .eq('profile_id', profileRow.id)
    .is('deleted_at', null)
    .maybeSingle<ChildProfileRow>();
  const { data: gradeRow } = await supabase
    .from('child_profile_grade_level')
    .select('grade_id, grade_label')
    .eq('profile_id', profileRow.id)
    .is('deleted_at', null)
    .maybeSingle<ChildProfileGradeLevelRow>();

  const gradeLevel: GradeLevelOption | null = gradeRow
    ? {
        id: gradeRow.grade_id,
        label: gradeRow.grade_label ?? gradeRow.grade_id,
      }
    : null;

  return {
    ...baseProfile,
    kind: 'child',
    gradeLevel,
    birthYear: child?.birth_year ?? null,
    schoolName: child?.school_name ?? null,
    schoolYear: child?.school_year ?? null,
    interests: null,
    strengths: null,
    learningPreferences: null,
    motivationStyles: null,
    confidenceLevel: child?.confidence_level ?? null,
    communicationStyle: child?.communication_style ?? null,
  };
}

async function buildStaffProfile(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  baseProfile: Omit<UserProfileVM, 'kind'>,
  profileRow: ProfileRow,
): Promise<StaffProfileVM> {
  const { data: staff } = await supabase
    .from('staff_profiles')
    .select(
      'department, manager_staff_id, job_title, permissions_scope, working_hours_rules',
    )
    .eq('profile_id', profileRow.id)
    .is('deleted_at', null)
    .maybeSingle<StaffProfileRow>();
  const { data: specialties } = await supabase
    .from('staff_profile_specialties')
    .select('specialty')
    .eq('profile_id', profileRow.id)
    .is('deleted_at', null);

  return {
    ...baseProfile,
    kind: 'staff',
    department: staff?.department ?? null,
    managerStaffId: staff?.manager_staff_id ?? null,
    jobTitle: staff?.job_title ?? null,
    permissionsScope: staff?.permissions_scope ?? null,
    specialties: specialties?.map((row) => row.specialty) ?? null,
    workingHoursRules: staff?.working_hours_rules ?? null,
  };
}

async function buildGuardianProfile(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  baseProfile: Omit<UserProfileVM, 'kind'>,
  profileRow: ProfileRow,
): Promise<UserProfileVM> {
  const { data: guardian } = await supabase
    .from('guardian_profiles')
    .select('joined_date, session_notes_visibility')
    .eq('profile_id', profileRow.id)
    .is('deleted_at', null)
    .maybeSingle<GuardianProfileRow>();

  const { data: familyLinks } = await supabase
    .from('family_links')
    .select('child_account_id')
    .eq('guardian_account_id', profileRow.account_id)
    .eq('org_id', profileRow.org_id)
    .is('deleted_at', null);

  const childAccountIds =
    (familyLinks as FamilyLinkRow[] | null | undefined)?.map(
      (link) => link.child_account_id,
    ) ?? [];
  const children = await loadChildProfiles(supabase, profileRow.org_id, childAccountIds);

  const childrenConnection: ConnectionVM<ChildProfileVM> = {
    items: children,
    total: children.length,
  };

  return {
    ...baseProfile,
    kind: 'guardian',
    children: childrenConnection,
    joinedDate: guardian?.joined_date ?? profileRow.created_at,
    sessionNotesVisibility: guardian?.session_notes_visibility ?? null,
  };
}

async function loadChildProfiles(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  orgId: string,
  childAccountIds: string[],
): Promise<ChildProfileVM[]> {
  if (!childAccountIds.length) {
    return [];
  }

  const { data: profileRows } = await supabase
    .from('profiles')
    .select(
      [
        'id',
        'org_id',
        'account_id',
        'kind',
        'display_name',
        'first_name',
        'last_name',
        'bio',
        'avatar_source',
        'avatar_url',
        'avatar_seed',
        'avatar_updated_at',
        'timezone',
        'locale',
        'languages_spoken',
        'status',
        'country_code',
        'country_name',
        'region',
        'city',
        'postal_code',
        'notes_internal',
        'lead_source',
        'ui_theme_key',
        'created_at',
        'updated_at',
      ].join(','),
    )
    .in('account_id', childAccountIds)
    .eq('org_id', orgId)
    .eq('kind', 'child')
    .is('deleted_at', null);

  if (!profileRows?.length) {
    return [];
  }

  const profileIds = profileRows.map((row) => row.id);
  const { data: childRows } = await supabase
    .from('child_profiles')
    .select(
      'profile_id, birth_year, school_name, school_year, confidence_level, communication_style',
    )
    .in('profile_id', profileIds)
    .is('deleted_at', null);
  const { data: gradeRows } = await supabase
    .from('child_profile_grade_level')
    .select('profile_id, grade_id, grade_label')
    .in('profile_id', profileIds)
    .is('deleted_at', null);

  const childByProfileId = new Map(
    ((childRows as ChildProfileRow[] | null) ?? []).map((row) => [row.profile_id, row]),
  );
  const gradeByProfileId = new Map(
    ((gradeRows as ChildProfileGradeLevelRow[] | null) ?? []).map((row) => [
      row.profile_id,
      row,
    ]),
  );

  const profilesWithAvatar = await Promise.all(
    profileRows.map(async (row) => ({
      row,
      avatarUrl: await resolveAvatarUrl(supabase, row.avatar_source, row.avatar_url),
    })),
  );

  return profilesWithAvatar.map(({ row, avatarUrl }) => {
    const baseProfile = buildBaseProfile(row as ProfileRow, null, null, avatarUrl);
    const child = childByProfileId.get(row.id);
    const grade = gradeByProfileId.get(row.id);
    const gradeLevel: GradeLevelOption | null = grade
      ? {
          id: grade.grade_id,
          label: grade.grade_label ?? grade.grade_id,
        }
      : null;

    return {
      ...baseProfile,
      kind: 'child',
      gradeLevel,
      birthYear: child?.birth_year ?? null,
      schoolName: child?.school_name ?? null,
      schoolYear: child?.school_year ?? null,
      interests: null,
      strengths: null,
      learningPreferences: null,
      motivationStyles: null,
      confidenceLevel: child?.confidence_level ?? null,
      communicationStyle: child?.communication_style ?? null,
    };
  });
}
