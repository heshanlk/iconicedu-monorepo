import type {
  ChildProfileVM,
  EducatorProfileVM,
  FamilyLinkVM,
  FamilyVM,
  GradeLevelOption,
  GuardianProfileVM,
  LiveStatus,
  PresenceVM,
  RoleKey,
  UserAccountVM,
  UserProfileVM,
  UUID,
} from '@iconicedu/shared-types';

export const MOCK_ORG_ID = '4fca0d16-5d72-4a24-9a0d-6f8c0bf2b652';
const makeGradeLevel = (label: string, id: string | number): GradeLevelOption => ({
  id,
  label,
});
const makePresence = (
  liveStatus: LiveStatus,
  text?: string,
  emoji?: string,
  lastSeenAt?: string,
): PresenceVM => ({
  state: { text, emoji },
  liveStatus,
  lastSeenAt: lastSeenAt ?? new Date().toISOString(),
  presenceLoaded: true,
});

export const MOCK_CHILDREN_IDS = {
  sarah: 'b2c1a93e-9d1a-4b1c-8a8a-8c5bd617d19e',
  zayne: '4c5b2c1d-1f33-4f5d-9d74-6c784b8d5f0e',
  sophia: 'f9d3c9a2-6e0a-4a31-9f28-5b0a3f8a1e62',
} as const;

export const MOCK_FAMILY_ID = '1f9c7e3a-1b88-4d0a-8c27-6a22c9b0f2a1';

export const MOCK_FAMILY: FamilyVM = {
  orgId: MOCK_ORG_ID,
  id: MOCK_FAMILY_ID,
  displayName: 'Chen Family',
};

export const MOCK_FAMILY_LINKS: FamilyLinkVM[] = [
  {
    orgId: MOCK_ORG_ID,
    id: 'family-link-guardian-sarah',
    familyId: MOCK_FAMILY_ID,
    guardianAccountId: 'c4b0e8d2-7d33-4c1a-8d6f-5a2b3c4d5e6f',
    childAccountId: MOCK_CHILDREN_IDS.sarah,
    relation: 'guardian',
    permissionsScope: ['messages', 'class-schedule', 'learning-spaces'],
  },
  {
    orgId: MOCK_ORG_ID,
    id: 'family-link-guardian-zayne',
    familyId: MOCK_FAMILY_ID,
    guardianAccountId: 'c4b0e8d2-7d33-4c1a-8d6f-5a2b3c4d5e6f',
    childAccountId: MOCK_CHILDREN_IDS.zayne,
    relation: 'guardian',
    permissionsScope: ['messages', 'class-schedule', 'learning-spaces'],
  },
  {
    orgId: MOCK_ORG_ID,
    id: 'family-link-guardian-sophia',
    familyId: MOCK_FAMILY_ID,
    guardianAccountId: 'c4b0e8d2-7d33-4c1a-8d6f-5a2b3c4d5e6f',
    childAccountId: MOCK_CHILDREN_IDS.sophia,
    relation: 'guardian',
    permissionsScope: ['messages', 'class-schedule', 'learning-spaces'],
  },
];

export const MOCK_CHILDREN: ChildProfileVM[] = [
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_CHILDREN_IDS.sarah,
    accountId: MOCK_CHILDREN_IDS.sarah,
    displayName: 'Sarah',
    firstName: 'Sarah',
    lastName: 'Chen',
    avatar: {
      source: 'seed',
      seed: 'Children-12',
      url: null,
      updatedAt: null,
    },
    timezone: 'America/New_York',
    locale: 'en-US',
    notificationDefaults: null,
    presence: makePresence('none', 'Offline', undefined, '2024-02-01T09:15:00.000Z'),
    gradeLevel: makeGradeLevel('Grade 3', 3),
    schoolName: 'Cedar Grove Elementary',
    schoolYear: '2024-2025',
    notesInternal: null,
    createdAt: '2021-08-20T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
    color: 'bg-green-500 text-white',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_CHILDREN_IDS.zayne,
    accountId: MOCK_CHILDREN_IDS.zayne,
    displayName: 'Zayne',
    firstName: 'Zayne',
    lastName: null,
    avatar: {
      source: 'seed',
      seed: 'Children-13',
      url: null,
      updatedAt: null,
    },
    timezone: 'America/New_York',
    locale: 'en-US',
    notificationDefaults: null,
    presence: makePresence('reviewing_work', 'Reviewing homework'),
    gradeLevel: makeGradeLevel('Grade 6', 6),
    schoolName: 'Maple Ridge Middle School',
    schoolYear: '2024-2025',
    notesInternal: null,
    createdAt: '2020-01-15T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
    color: 'bg-green-500 text-white',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_CHILDREN_IDS.sophia,
    accountId: MOCK_CHILDREN_IDS.sophia,
    displayName: 'Sophia',
    firstName: 'Sophia',
    lastName: null,
    avatar: {
      source: 'seed',
      seed: 'Children-14',
      url: null,
      updatedAt: null,
    },
    timezone: 'America/New_York',
    locale: 'en-US',
    notificationDefaults: null,
    presence: makePresence('busy', 'In class'),
    gradeLevel: makeGradeLevel('Grade 5', 5),
    schoolName: 'Maple Ridge Middle School',
    schoolYear: '2024-2025',
    notesInternal: null,
    createdAt: '2020-03-10T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
    color: 'bg-green-500 text-white',
  },
];

export const getMockChildByAccountId = (accountId: UUID) =>
  MOCK_CHILDREN.find((child) => child.accountId === accountId);

export const getMockChildNameByAccountId = (accountId: UUID) =>
  getMockChildByAccountId(accountId)?.displayName ?? 'Child';

const toRoleLabel = (roleKey: RoleKey | undefined) => {
  if (!roleKey) return undefined;
  return roleKey.charAt(0).toUpperCase() + roleKey.slice(1);
};

export const toProfileUser = (
  profile: EducatorProfileVM | GuardianProfileVM,
  account?: UserAccountVM,
): UserProfileVM & {
  role?: string;
  email?: string | null;
  phone?: string | null;
  joinedDate?: string;
  headline?: string | null;
  bio?: string | null;
  subjects?: string[] | null;
  gradesSupported?: GradeLevelOption[] | null;
  experienceYears?: number | null;
  certifications?: Array<{
    name: string;
    issuer?: string;
    year?: number;
  }> | null;
  childrenNames?: string[];
} => ({
  ...profile,
  role: toRoleLabel(account?.userRoles?.[0]?.roleKey),
  email: account?.contacts.email ?? null,
  phone: account?.contacts.phoneE164 ?? null,
  joinedDate: profile.joinedDate,
  headline: 'headline' in profile ? (profile.headline ?? null) : null,
  bio: 'bio' in profile ? (profile.bio ?? null) : null,
  subjects: 'subjects' in profile ? (profile.subjects ?? null) : null,
  gradesSupported:
    'gradesSupported' in profile ? (profile.gradesSupported ?? null) : null,
  experienceYears:
    'experienceYears' in profile ? (profile.experienceYears ?? null) : null,
  certifications: 'certifications' in profile ? (profile.certifications ?? null) : null,
  childrenNames:
    'children' in profile
      ? profile.children?.items?.map((child) => child.displayName)
      : undefined,
});

export const MOCK_EDUCATOR: EducatorProfileVM = {
  orgId: MOCK_ORG_ID,
  id: '7d2a6c33-62f5-4e1d-9a1f-0a8b54f1b2a0',
  accountId: '7d2a6c33-62f5-4e1d-9a1f-0a8b54f1b2a0',
  displayName: 'Ms. Elena Brooks',
  firstName: 'Elena',
  lastName: 'Brooks',
  avatar: {
    source: 'upload',
    seed: 'educator-1',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-sarah-Vsp1gZWstExMvD0Qce0ogsgN6nv2pC.png',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  presence: makePresence('teaching', 'Teaching now'),
  headline: 'Building confident readers and writers.',
  subjects: ['English Language Arts'],
  gradesSupported: [makeGradeLevel('Grade 4', 4), makeGradeLevel('Grade 5', 5)],
  experienceYears: 10,
  certifications: [
    { name: 'Elementary Education Certification', issuer: 'State Board', year: 2014 },
  ],
  bio: 'Focuses on literacy foundations and joyful classroom discussions.',
  notesInternal: null,
  createdAt: '2016-08-15T00:00:00.000Z',
  updatedAt: '2024-02-01T00:00:00.000Z',
  joinedDate: '2016-08-15T00:00:00.000Z',
};

export const MOCK_EDUCATOR_2: EducatorProfileVM = {
  orgId: MOCK_ORG_ID,
  id: '9c8d6b44-31ce-4b69-9fe3-12f90f6d2b1c',
  accountId: '9c8d6b44-31ce-4b69-9fe3-12f90f6d2b1c',
  displayName: 'Mr. Aiden Park',
  firstName: 'Aiden',
  lastName: 'Park',
  avatar: {
    source: 'upload',
    seed: 'educator-2',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-jordan-ACflnHBYNP7M9crd5MtKL7WSpk3GiQ.jpg',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  presence: makePresence('in_class', 'In a lab session'),
  headline: 'Hands-on science for curious minds.',
  subjects: ['Science'],
  gradesSupported: [
    makeGradeLevel('Grade 5', 5),
    makeGradeLevel('Grade 6', 6),
    makeGradeLevel('Grade 7', 7),
  ],
  experienceYears: 11,
  certifications: [
    { name: 'Secondary Science Certification', issuer: 'State Board', year: 2013 },
  ],
  bio: 'Uses inquiry-based labs to make science feel real.',
  notesInternal: null,
  createdAt: '2017-08-20T00:00:00.000Z',
  updatedAt: '2024-02-01T00:00:00.000Z',
  joinedDate: '2017-08-20T00:00:00.000Z',
};

export const MOCK_EDUCATOR_3: EducatorProfileVM = {
  orgId: MOCK_ORG_ID,
  id: '3f1a5c77-5c21-4a8b-b7f3-0b6a23d2c5e1',
  accountId: '3f1a5c77-5c21-4a8b-b7f3-0b6a23d2c5e1',
  displayName: 'Ms. Nora Singh',
  firstName: 'Nora',
  lastName: 'Singh',
  avatar: {
    source: 'upload',
    seed: 'educator-3',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-alex-UoI6qSVh9rZS9DvLOmhIY8pabZfAOq.png',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  timezone: 'America/Chicago',
  locale: 'en-US',
  notificationDefaults: null,
  presence: makePresence('busy', 'Planning lessons'),
  headline: 'Project-based social studies and history.',
  subjects: ['Social Studies'],
  gradesSupported: [makeGradeLevel('Grade 6', 6), makeGradeLevel('Grade 7', 7)],
  experienceYears: 7,
  certifications: [
    { name: 'Social Studies Certification', issuer: 'State Board', year: 2016 },
  ],
  bio: 'Encourages debate, perspective-taking, and civic engagement.',
  notesInternal: null,
  createdAt: '2018-08-15T00:00:00.000Z',
  updatedAt: '2024-02-01T00:00:00.000Z',
  joinedDate: '2018-08-15T00:00:00.000Z',
};

export const MOCK_EDUCATOR_4: EducatorProfileVM = {
  orgId: MOCK_ORG_ID,
  id: 'aa9f7c11-1b8a-4b3e-93a2-0d4a6b8c9e12',
  accountId: 'aa9f7c11-1b8a-4b3e-93a2-0d4a6b8c9e12',
  displayName: 'Ms. Brooke Carter',
  firstName: 'Brooke',
  lastName: 'Carter',
  avatar: {
    source: 'upload',
    seed: 'educator-4',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-mike-T2UMe9BlbWWIxlq7z99cJWqwEagAuc.jpg',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  timezone: 'America/Los_Angeles',
  locale: 'en-US',
  notificationDefaults: null,
  presence: makePresence('reviewing_work', 'Reviewing work'),
  headline: 'Math foundations for confident problem solving.',
  subjects: ['Mathematics'],
  gradesSupported: [makeGradeLevel('Grade 6', 6), makeGradeLevel('Grade 7', 7)],
  experienceYears: 13,
  certifications: [
    { name: 'Secondary Math Certification', issuer: 'State Board', year: 2011 },
  ],
  bio: 'Breaks down complex topics into approachable steps.',
  notesInternal: null,
  createdAt: '2016-01-10T00:00:00.000Z',
  updatedAt: '2024-02-01T00:00:00.000Z',
  joinedDate: '2016-01-10T00:00:00.000Z',
};

export const MOCK_EDUCATOR_5: EducatorProfileVM = {
  orgId: MOCK_ORG_ID,
  id: '5c4e2a90-8d5c-4c1e-9f25-2f9b7a1c3d4e',
  accountId: '5c4e2a90-8d5c-4c1e-9f25-2f9b7a1c3d4e',
  displayName: 'Mr. Gabriel Ortiz',
  firstName: 'Gabriel',
  lastName: 'Ortiz',
  avatar: {
    source: 'upload',
    seed: 'educator-5',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-sarah-Vsp1gZWstExMvD0Qce0ogsgN6nv2pC.png',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  presence: makePresence('in_class', 'Design lab in session'),
  headline: 'STEM creativity through design challenges.',
  subjects: ['STEM'],
  gradesSupported: [
    makeGradeLevel('Grade 4', 4),
    makeGradeLevel('Grade 5', 5),
    makeGradeLevel('Grade 6', 6),
  ],
  experienceYears: 5,
  certifications: [
    { name: 'STEM Education Certification', issuer: 'State Board', year: 2020 },
  ],
  bio: 'Builds confidence through hands-on design and iteration.',
  notesInternal: null,
  createdAt: '2020-08-25T00:00:00.000Z',
  updatedAt: '2024-02-01T00:00:00.000Z',
  joinedDate: '2020-08-25T00:00:00.000Z',
};

export const MOCK_EDUCATORS: EducatorProfileVM[] = [
  MOCK_EDUCATOR,
  MOCK_EDUCATOR_2,
  MOCK_EDUCATOR_3,
  MOCK_EDUCATOR_4,
  MOCK_EDUCATOR_5,
];

export const MOCK_GUARDIAN: GuardianProfileVM = {
  orgId: MOCK_ORG_ID,
  id: 'c4b0e8d2-7d33-4c1a-8d6f-5a2b3c4d5e6f',
  accountId: 'c4b0e8d2-7d33-4c1a-8d6f-5a2b3c4d5e6f',
  displayName: 'Jamie Chen',
  firstName: 'Jamie',
  lastName: 'Chen',
  avatar: {
    source: 'upload',
    seed: 'guardian-1',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-mike-T2UMe9BlbWWIxlq7z99cJWqwEagAuc.jpg',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  presence: makePresence('busy', 'Wrapping up a call'),
  bio: 'Focused on consistent routines and supporting progress at home.',
  notesInternal: null,
  createdAt: '2022-01-05T00:00:00.000Z',
  updatedAt: '2024-02-01T00:00:00.000Z',
  children: { items: MOCK_CHILDREN, total: MOCK_CHILDREN.length },
  joinedDate: '2022-01-05T00:00:00.000Z',
};

export const MOCK_USER_ACCOUNTS: UserAccountVM[] = [
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR.accountId,
    contacts: { email: 'e.brooks@school.edu', phoneE164: '+15551234567' },
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_EDUCATOR.accountId}`,
        roleKey: 'educator',
        assignedAt: '2016-08-15T00:00:00.000Z',
      },
    ],
    activeContext: { roleKey: 'educator' },
    status: 'active',
    createdAt: '2016-08-15T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_2.accountId,
    contacts: { email: 'a.park@school.edu', phoneE164: '+15551230001' },
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_EDUCATOR_2.accountId}`,
        roleKey: 'educator',
        assignedAt: '2017-08-20T00:00:00.000Z',
      },
    ],
    activeContext: { roleKey: 'educator' },
    status: 'active',
    createdAt: '2017-08-20T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_3.accountId,
    contacts: { email: 'n.singh@school.edu', phoneE164: '+15551230002' },
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_EDUCATOR_3.accountId}`,
        roleKey: 'educator',
        assignedAt: '2018-08-15T00:00:00.000Z',
      },
    ],
    activeContext: { roleKey: 'educator' },
    status: 'active',
    createdAt: '2018-08-15T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_4.accountId,
    contacts: { email: 'b.carter@school.edu', phoneE164: '+15551230003' },
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_EDUCATOR_4.accountId}`,
        roleKey: 'educator',
        assignedAt: '2016-01-10T00:00:00.000Z',
      },
    ],
    activeContext: { roleKey: 'educator' },
    status: 'active',
    createdAt: '2016-01-10T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_5.accountId,
    contacts: { email: 'g.ortiz@school.edu', phoneE164: '+15551230004' },
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_EDUCATOR_5.accountId}`,
        roleKey: 'educator',
        assignedAt: '2020-08-25T00:00:00.000Z',
      },
    ],
    activeContext: { roleKey: 'educator' },
    status: 'active',
    createdAt: '2020-08-25T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_GUARDIAN.accountId,
    contacts: { email: 'jamie.chen@email.com', phoneE164: '+15559876543' },
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_GUARDIAN.accountId}`,
        roleKey: 'guardian',
        assignedAt: '2022-01-05T00:00:00.000Z',
      },
    ],
    activeContext: { roleKey: 'guardian', familyLink: MOCK_FAMILY_LINKS[0] },
    status: 'active',
    createdAt: '2022-01-05T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_CHILDREN_IDS.sarah,
    contacts: {},
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_CHILDREN_IDS.sarah}`,
        roleKey: 'child',
        assignedAt: '2021-08-20T00:00:00.000Z',
      },
    ],
    activeContext: { roleKey: 'child', familyLink: MOCK_FAMILY_LINKS[0] },
    status: 'active',
    createdAt: '2021-08-20T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_CHILDREN_IDS.zayne,
    contacts: {},
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_CHILDREN_IDS.zayne}`,
        roleKey: 'child',
        assignedAt: '2020-01-15T00:00:00.000Z',
      },
    ],
    activeContext: { roleKey: 'child', familyLink: MOCK_FAMILY_LINKS[1] },
    status: 'active',
    createdAt: '2020-01-15T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_CHILDREN_IDS.sophia,
    contacts: {},
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_CHILDREN_IDS.sophia}`,
        roleKey: 'child',
        assignedAt: '2020-03-10T00:00:00.000Z',
      },
    ],
    activeContext: { roleKey: 'child', familyLink: MOCK_FAMILY_LINKS[2] },
    status: 'active',
    createdAt: '2020-03-10T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
];

export const getMockUserAccountById = (accountId: UUID) =>
  MOCK_USER_ACCOUNTS.find((account) => account.id === accountId);
