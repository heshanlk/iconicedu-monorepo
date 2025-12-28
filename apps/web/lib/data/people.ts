import type {
  ChildProfileVM,
  EducatorProfileVM,
  GradeLevelOption,
  GuardianProfileVM,
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

export const MOCK_CHILDREN_IDS = {
  sarah: '1b9504c3-0e65-4d7a-a843-2d7169f73407',
  zayne: '8f055dda-76e1-4a50-9e6e-34f0dc82e6f6',
  sophia: 'f0c0ea47-e1c1-4f54-bb99-b1df83db9da4',
} as const;

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
      seed: 'Children-3',
      url: null,
      updatedAt: null,
    },
    timezone: 'America/New_York',
    locale: 'en-US',
    notificationDefaults: null,
    gradeLevel: makeGradeLevel('Grade 4', 4),
    schoolName: 'Riverside Elementary School',
    schoolYear: '2024-2025',
    notesInternal: null,
    createdAt: '2020-09-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
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
      seed: 'Children-4',
      url: null,
      updatedAt: null,
    },
    timezone: 'America/New_York',
    locale: 'en-US',
    notificationDefaults: null,
    gradeLevel: makeGradeLevel('Grade 7', 7),
    schoolName: 'Riverside Middle School',
    schoolYear: '2024-2025',
    notesInternal: null,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    color: 'bg-red-500 text-white',
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
      seed: 'Children-5',
      url: null,
      updatedAt: null,
    },
    timezone: 'America/New_York',
    locale: 'en-US',
    notificationDefaults: null,
    gradeLevel: makeGradeLevel('Grade 7', 7),
    schoolName: 'Riverside Middle School',
    schoolYear: '2024-2025',
    notesInternal: null,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
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
  id: 'a21b9c5f-0906-4f04-9b7f-6f7b4a6fb1c5',
  accountId: 'a21b9c5f-0906-4f04-9b7f-6f7b4a6fb1c5',
  displayName: 'Ms. Jennifer Williams',
  firstName: 'Jennifer',
  lastName: 'Williams',
  avatar: {
    source: 'upload',
    seed: 'educator-1',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-sarah-Vsp1gZWstExMvD0Qce0ogsgN6nv2pC.png',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  headline: 'Helping 4th graders love math.',
  subjects: ['Mathematics'],
  gradesSupported: [makeGradeLevel('Grade 4', 4), makeGradeLevel('Grade 5', 5)],
  experienceYears: 8,
  certifications: [
    { name: 'Elementary Education Certification', issuer: 'State Board', year: 2016 },
  ],
  bio: 'Passionate about building confidence and curiosity in young mathematicians.',
  notesInternal: null,
  createdAt: '2020-09-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  joinedDate: '2020-09-01T00:00:00.000Z',
};

export const MOCK_EDUCATOR_2: EducatorProfileVM = {
  orgId: MOCK_ORG_ID,
  id: '0b2b3d51-9a35-4b47-86b4-5fe9b9b5f8e4',
  accountId: '0b2b3d51-9a35-4b47-86b4-5fe9b9b5f8e4',
  displayName: 'Mr. David Kim',
  firstName: 'David',
  lastName: 'Kim',
  avatar: {
    source: 'upload',
    seed: 'educator-2',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-jordan-ACflnHBYNP7M9crd5MtKL7WSpk3GiQ.jpg',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  headline: 'Science comes alive through experiments.',
  subjects: ['Science'],
  gradesSupported: [
    makeGradeLevel('Grade 6', 6),
    makeGradeLevel('Grade 7', 7),
    makeGradeLevel('Grade 8', 8),
  ],
  experienceYears: 12,
  certifications: [
    { name: 'Secondary Science Certification', issuer: 'State Board', year: 2012 },
  ],
  bio: 'Hands-on labs and real-world examples keep children curious.',
  notesInternal: null,
  createdAt: '2018-08-20T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  joinedDate: '2018-08-20T00:00:00.000Z',
};

export const MOCK_EDUCATOR_3: EducatorProfileVM = {
  orgId: MOCK_ORG_ID,
  id: '4a5fbb0f-4b74-4c48-a3d4-1f88b0a2d8e2',
  accountId: '4a5fbb0f-4b74-4c48-a3d4-1f88b0a2d8e2',
  displayName: 'Ms. Priya Desai',
  firstName: 'Priya',
  lastName: 'Desai',
  avatar: {
    source: 'upload',
    seed: 'educator-3',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-alex-UoI6qSVh9rZS9DvLOmhIY8pabZfAOq.png',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  timezone: 'America/Chicago',
  locale: 'en-US',
  notificationDefaults: null,
  headline: 'Literacy-first teaching with joyful reading.',
  subjects: ['English Language Arts'],
  gradesSupported: [
    makeGradeLevel('Grade 3', 3),
    makeGradeLevel('Grade 4', 4),
    makeGradeLevel('Grade 5', 5),
  ],
  experienceYears: 9,
  certifications: [
    { name: 'Elementary Education Certification', issuer: 'State Board', year: 2015 },
  ],
  bio: 'Focuses on comprehension strategies and confident writing.',
  notesInternal: null,
  createdAt: '2019-08-15T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  joinedDate: '2019-08-15T00:00:00.000Z',
};

export const MOCK_EDUCATOR_4: EducatorProfileVM = {
  orgId: MOCK_ORG_ID,
  id: '6b0a28a8-1f47-41b5-9a61-3f5c2fffb7f6',
  accountId: '6b0a28a8-1f47-41b5-9a61-3f5c2fffb7f6',
  displayName: 'Mr. Luis Hernandez',
  firstName: 'Luis',
  lastName: 'Hernandez',
  avatar: {
    source: 'upload',
    seed: 'educator-4',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-mike-T2UMe9BlbWWIxlq7z99cJWqwEagAuc.jpg',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  timezone: 'America/Los_Angeles',
  locale: 'en-US',
  notificationDefaults: null,
  headline: 'History lessons built on stories and debate.',
  subjects: ['Social Studies'],
  gradesSupported: [makeGradeLevel('Grade 7', 7), makeGradeLevel('Grade 8', 8)],
  experienceYears: 14,
  certifications: [
    { name: 'Social Studies Certification', issuer: 'State Board', year: 2010 },
  ],
  bio: 'Encourages critical thinking and respectful discussion.',
  notesInternal: null,
  createdAt: '2017-01-10T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  joinedDate: '2017-01-10T00:00:00.000Z',
};

export const MOCK_EDUCATOR_5: EducatorProfileVM = {
  orgId: MOCK_ORG_ID,
  id: 'a5b1c3d7-0f7f-4b47-8c6d-9fb2d9b0b3d1',
  accountId: 'a5b1c3d7-0f7f-4b47-8c6d-9fb2d9b0b3d1',
  displayName: 'Ms. Chloe Rivera',
  firstName: 'Chloe',
  lastName: 'Rivera',
  avatar: {
    source: 'upload',
    seed: 'educator-5',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-sarah-Vsp1gZWstExMvD0Qce0ogsgN6nv2pC.png',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  headline: 'Art and design that build confidence.',
  subjects: ['Art'],
  gradesSupported: [
    makeGradeLevel('Kindergarten', 'K'),
    makeGradeLevel('Grade 1', 1),
    makeGradeLevel('Grade 2', 2),
  ],
  experienceYears: 6,
  certifications: [
    { name: 'Arts Education Certification', issuer: 'State Board', year: 2019 },
  ],
  bio: 'Uses project-based learning to spark creativity.',
  notesInternal: null,
  createdAt: '2021-08-25T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  joinedDate: '2021-08-25T00:00:00.000Z',
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
  id: '2a0f3cbe-0b3b-470a-8a98-9381c1c9c6a7',
  accountId: '2a0f3cbe-0b3b-470a-8a98-9381c1c9c6a7',
  displayName: 'Michael Chen',
  firstName: 'Michael',
  lastName: 'Chen',
  avatar: {
    source: 'upload',
    seed: 'guardian-1',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-mike-T2UMe9BlbWWIxlq7z99cJWqwEagAuc.jpg',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  notificationDefaults: null,
  bio: 'Focused on keeping learning consistent and positive at home.',
  notesInternal: null,
  createdAt: '2021-09-15T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  children: { items: MOCK_CHILDREN, total: MOCK_CHILDREN.length },
  joinedDate: '2021-09-15T00:00:00.000Z',
};

export const MOCK_USER_ACCOUNTS: UserAccountVM[] = [
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR.accountId,
    contacts: { email: 'j.williams@school.edu', phoneE164: '+15551234567' },
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_EDUCATOR.accountId}`,
        roleKey: 'educator',
        assignedAt: '2020-09-01T00:00:00.000Z',
      },
    ],
    status: 'active',
    createdAt: '2020-09-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_2.accountId,
    contacts: { email: 'd.kim@school.edu', phoneE164: '+15551230001' },
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_EDUCATOR_2.accountId}`,
        roleKey: 'educator',
        assignedAt: '2018-08-20T00:00:00.000Z',
      },
    ],
    status: 'active',
    createdAt: '2018-08-20T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_3.accountId,
    contacts: { email: 'p.desai@school.edu', phoneE164: '+15551230002' },
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_EDUCATOR_3.accountId}`,
        roleKey: 'educator',
        assignedAt: '2019-08-15T00:00:00.000Z',
      },
    ],
    status: 'active',
    createdAt: '2019-08-15T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_4.accountId,
    contacts: { email: 'l.hernandez@school.edu', phoneE164: '+15551230003' },
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_EDUCATOR_4.accountId}`,
        roleKey: 'educator',
        assignedAt: '2017-01-10T00:00:00.000Z',
      },
    ],
    status: 'active',
    createdAt: '2017-01-10T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_EDUCATOR_5.accountId,
    contacts: { email: 'c.rivera@school.edu', phoneE164: '+15551230004' },
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_EDUCATOR_5.accountId}`,
        roleKey: 'educator',
        assignedAt: '2021-08-25T00:00:00.000Z',
      },
    ],
    status: 'active',
    createdAt: '2021-08-25T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    id: MOCK_GUARDIAN.accountId,
    contacts: { email: 'michael.chen@email.com', phoneE164: '+15559876543' },
    userRoles: [
      {
        orgId: MOCK_ORG_ID,
        id: `role-${MOCK_GUARDIAN.accountId}`,
        roleKey: 'guardian',
        assignedAt: '2021-09-15T00:00:00.000Z',
      },
    ],
    status: 'active',
    createdAt: '2021-09-15T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
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
        assignedAt: '2020-09-01T00:00:00.000Z',
      },
    ],
    status: 'active',
    createdAt: '2020-09-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
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
        assignedAt: '2021-01-01T00:00:00.000Z',
      },
    ],
    status: 'active',
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
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
        assignedAt: '2021-01-01T00:00:00.000Z',
      },
    ],
    status: 'active',
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const getMockUserAccountById = (accountId: UUID) =>
  MOCK_USER_ACCOUNTS.find((account) => account.id === accountId);
