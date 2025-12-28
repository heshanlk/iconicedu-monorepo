import type { User } from '@iconicedu/shared-types';

export type AvatarSource = 'seed' | 'upload' | 'external';
export type ISODateTime = string;
export type UUID = string;
export type GradeLevel = {
  label: string;
  value: string | number;
} | null;
export type RoleKey = 'owner' | 'admin' | 'teacher' | 'parent' | 'child';
export type AccountStatus = 'active' | 'invited' | 'suspended' | 'deleted';

export const MOCK_ORG_ID = '4fca0d16-5d72-4a24-9a0d-6f8c0bf2b652';

export interface UserRole {
  orgId: UUID;
  id: UUID;
  roleKey: RoleKey;
  assignedBy?: UUID | null;
  assignedAt: ISODateTime;
}

export interface Family {
  orgId: UUID;
  id: UUID;
  displayName: string;
}

export interface FamilyLink {
  orgId: UUID;
  id: UUID;
  familyId: UUID;
  guardianAccountId: UUID;
  childAccountId: UUID;
  relation: 'parent' | 'legal_guardian' | 'caregiver' | 'relative' | 'other';
  permissionsScope?: string[] | null;
}

export interface Avatar {
  source: AvatarSource;
  url?: string | null;
  seed?: string | null;
  updatedAt?: ISODateTime | null;
}

export type PresenceState = {
  text?: string | null;
  emoji?: string | null;
  expiresAt?: ISODateTime | null;
};

export type LiveStatus = 'none' | 'in_class' | 'teaching' | 'busy' | 'reviewing_work';
export interface Presence {
  state: PresenceState;
  liveStatus: LiveStatus;
  lastSeenAt?: ISODateTime | null;
}

export interface UserContact {
  email?: string | null;
  phoneE164?: string | null;
  whatsappE164?: string | null;

  emailVerified?: boolean;
  phoneVerified?: boolean;
  whatsappVerified?: boolean;
  verifiedAt?: ISODateTime | null;

  preferredContactChannels?: string[] | null;
}

export interface UserAccount {
  orgId: UUID;
  id: UUID;

  contacts: UserContact;

  userRoles: UserRole[] | null;

  status?: AccountStatus;

  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  archivedAt?: ISODateTime | null;
}

export interface GuardianAccount extends UserAccount {
  familyLink: FamilyLink;
}
export interface ChildAccount extends UserAccount {
  familyLink: FamilyLink;
}

export interface BaseUserProfile {
  orgId: UUID;
  id: UUID;
  accountId: UUID;

  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  avatar: Avatar;

  timezone: string;
  locale?: string | null;
  languagesSpoken?: string[] | null;

  notificationDefaults?: Record<string, unknown> | null;

  presence?: Presence | null;

  status?: AccountStatus;

  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface TeacherProfile extends BaseUserProfile {
  headline?: string | null;
  subjects: string[] | null;
  gradesSupported: GradeLevel[] | null;
  education?: string | null;
  experienceYears?: number | null;
  certifications?: Array<{
    name: string;
    issuer?: string;
    year?: number;
  }> | null;
  joinedDate: Date;
  notesInternal?: string | null;
  ageGroupsComfortableWith?: string[] | null;
  identityVerificationStatus?: 'unverified' | 'pending' | 'verified' | null;
  curriculumTags?: string[] | null;
  badges?: string[] | null;
  averageRating?: number | null;
  totalReviews?: number | null;
  featuredVideoIntroUrl?: string | null;
  leadSource?: string | null;
}

export interface GuardianProfile extends BaseUserProfile {
  children: ChildProfile[];
  joinedDate: Date;
  notesInternal?: string | null;
  sessionNotesVisibility?: 'private' | 'shared' | null;
  leadSource?: string | null;
}

export interface ChildProfile extends BaseUserProfile {
  gradeLevel?: GradeLevel | null;
  schoolName?: string | null;
  schoolYear?: string | null;
  color: string;
  notesInternal?: string | null;
  interests?: string[] | null;
  strengths?: string[] | null;
  learningPreferences?: string[] | null;
  motivationStyles?: string[] | null;
  confidenceLevel?: 'low' | 'medium' | 'high' | null;
  communicationStyle?: 'chatty' | 'shy' | null;
}

export interface StaffProfile extends BaseUserProfile {
  department?: string | null;
  managerStaffId?: UUID | null;
  specialties?: string[] | null;
  jobTitle?: string | null;
  permissionsScope?: 'limited' | 'standard' | 'elevated' | null;
  notesInternal?: string | null;
  workingHoursRules?: string[] | null;
}

export const MOCK_CHILDREN_IDS = {
  sarah: '1b9504c3-0e65-4d7a-a843-2d7169f73407',
  zayne: '8f055dda-76e1-4a50-9e6e-34f0dc82e6f6',
  sophia: 'f0c0ea47-e1c1-4f54-bb99-b1df83db9da4',
} as const;

export const MOCK_CHILDREN: ChildProfile[] = [
  {
    orgId: MOCK_ORG_ID,
    userId: MOCK_CHILDREN_IDS.sarah,
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
    prefs: null,
    notificationDefaults: null,
    gradeLevel: 4,
    schoolName: 'Riverside Elementary School',
    schoolYear: '2024-2025',
    notesInternal: null,
    createdAt: '2020-09-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    color: 'bg-green-500 text-white',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: MOCK_CHILDREN_IDS.zayne,
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
    prefs: null,
    notificationDefaults: null,
    gradeLevel: 7,
    schoolName: 'Riverside Middle School',
    schoolYear: '2024-2025',
    notesInternal: null,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    color: 'bg-red-500 text-white',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: MOCK_CHILDREN_IDS.sophia,
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
    prefs: null,
    notificationDefaults: null,
    gradeLevel: 7,
    schoolName: 'Riverside Middle School',
    schoolYear: '2024-2025',
    notesInternal: null,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    color: 'bg-green-500 text-white',
  },
];

export const getMockChildrenByUserId = (userId: UUID) =>
  MOCK_CHILDREN.find((child) => child.userId === userId);

export const getMockChildrenNameByUserId = (userId: UUID) =>
  getMockChildrenByUserId(userId)?.displayName ?? 'Children';

export const toMessageUser = (profile: BaseUserProfile): User => ({
  id: profile.userId,
  name: profile.displayName,
  avatar: profile.avatar.url ?? '',
});

const toRoleLabel = (roleKey: RoleKey | undefined) => {
  if (!roleKey) return undefined;
  return roleKey.charAt(0).toUpperCase() + roleKey.slice(1);
};

export const toProfileUser = (
  profile: TeacherProfile | GuardianProfile,
  account?: UserAccount,
): User & {
  role?: string;
  email?: string | null;
  phone?: string | null;
  joinedDate?: Date;
  headline?: string | null;
  bio?: string | null;
  subjects?: string[] | null;
  gradesSupported?: GradeLevel[] | null;
  experienceYears?: number | null;
  certifications?: Array<{
    name: string;
    issuer?: string;
    year?: number;
  }> | null;
  childrenNames?: string[];
} => ({
  ...toMessageUser(profile),
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
      ? profile.children.map((child) => child.displayName)
      : undefined,
});

export const MOCK_TEACHER: TeacherProfile = {
  orgId: MOCK_ORG_ID,
  userId: 'a21b9c5f-0906-4f04-9b7f-6f7b4a6fb1c5',
  displayName: 'Ms. Jennifer Williams',
  firstName: 'Jennifer',
  lastName: 'Williams',
  avatar: {
    source: 'upload',
    seed: 'teacher-1',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-sarah-Vsp1gZWstExMvD0Qce0ogsgN6nv2pC.png',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  prefs: null,
  notificationDefaults: null,
  headline: 'Helping 4th graders love math.',
  subjects: ['Mathematics'],
  gradesSupported: ['4th Grade', 5],
  experienceYears: 8,
  certifications: [
    { name: 'Elementary Education Certification', issuer: 'State Board', year: 2016 },
  ],
  bio: 'Passionate about building confidence and curiosity in young mathematicians.',
  notesInternal: null,
  createdAt: '2020-09-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  joinedDate: new Date(2020, 8, 1),
};

export const MOCK_TEACHER_2: TeacherProfile = {
  orgId: MOCK_ORG_ID,
  userId: '0b2b3d51-9a35-4b47-86b4-5fe9b9b5f8e4',
  displayName: 'Mr. David Kim',
  firstName: 'David',
  lastName: 'Kim',
  avatar: {
    source: 'upload',
    seed: 'teacher-2',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-jordan-ACflnHBYNP7M9crd5MtKL7WSpk3GiQ.jpg',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  prefs: null,
  notificationDefaults: null,
  headline: 'Science comes alive through experiments.',
  subjects: ['Science'],
  gradesSupported: [6, 7, 8],
  experienceYears: 12,
  certifications: [
    { name: 'Secondary Science Certification', issuer: 'State Board', year: 2012 },
  ],
  bio: 'Hands-on labs and real-world examples keep students curious.',
  notesInternal: null,
  createdAt: '2018-08-20T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  joinedDate: new Date(2018, 7, 20),
};

export const MOCK_TEACHER_3: TeacherProfile = {
  orgId: MOCK_ORG_ID,
  userId: '4a5fbb0f-4b74-4c48-a3d4-1f88b0a2d8e2',
  displayName: 'Ms. Priya Desai',
  firstName: 'Priya',
  lastName: 'Desai',
  avatar: {
    source: 'upload',
    seed: 'teacher-3',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-alex-UoI6qSVh9rZS9DvLOmhIY8pabZfAOq.png',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  timezone: 'America/Chicago',
  locale: 'en-US',
  prefs: null,
  notificationDefaults: null,
  headline: 'Literacy-first teaching with joyful reading.',
  subjects: ['English Language Arts'],
  gradesSupported: [3, 4, 5],
  experienceYears: 9,
  certifications: [
    { name: 'Elementary Education Certification', issuer: 'State Board', year: 2015 },
  ],
  bio: 'Focuses on comprehension strategies and confident writing.',
  notesInternal: null,
  createdAt: '2019-08-15T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  joinedDate: new Date(2019, 7, 15),
};

export const MOCK_TEACHER_4: TeacherProfile = {
  orgId: MOCK_ORG_ID,
  userId: '6b0a28a8-1f47-41b5-9a61-3f5c2fffb7f6',
  displayName: 'Mr. Luis Hernandez',
  firstName: 'Luis',
  lastName: 'Hernandez',
  avatar: {
    source: 'upload',
    seed: 'teacher-4',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-mike-T2UMe9BlbWWIxlq7z99cJWqwEagAuc.jpg',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  timezone: 'America/Los_Angeles',
  locale: 'en-US',
  prefs: null,
  notificationDefaults: null,
  headline: 'History lessons built on stories and debate.',
  subjects: ['Social Studies'],
  gradesSupported: [7, 8],
  experienceYears: 14,
  certifications: [
    { name: 'Social Studies Certification', issuer: 'State Board', year: 2010 },
  ],
  bio: 'Encourages critical thinking and respectful discussion.',
  notesInternal: null,
  createdAt: '2017-01-10T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  joinedDate: new Date(2017, 0, 10),
};

export const MOCK_TEACHER_5: TeacherProfile = {
  orgId: MOCK_ORG_ID,
  userId: 'a5b1c3d7-0f7f-4b47-8c6d-9fb2d9b0b3d1',
  displayName: 'Ms. Chloe Rivera',
  firstName: 'Chloe',
  lastName: 'Rivera',
  avatar: {
    source: 'upload',
    seed: 'teacher-5',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-sarah-Vsp1gZWstExMvD0Qce0ogsgN6nv2pC.png',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  prefs: null,
  notificationDefaults: null,
  headline: 'Art and design that build confidence.',
  subjects: ['Art'],
  gradesSupported: ['K', 1, 2],
  experienceYears: 6,
  certifications: [
    { name: 'Arts Education Certification', issuer: 'State Board', year: 2019 },
  ],
  bio: 'Uses project-based learning to spark creativity.',
  notesInternal: null,
  createdAt: '2021-08-25T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  joinedDate: new Date(2021, 7, 25),
};

export const MOCK_TEACHERS: TeacherProfile[] = [
  MOCK_TEACHER,
  MOCK_TEACHER_2,
  MOCK_TEACHER_3,
  MOCK_TEACHER_4,
  MOCK_TEACHER_5,
];

export const MOCK_PARENT: GuardianProfile = {
  orgId: MOCK_ORG_ID,
  userId: '2a0f3cbe-0b3b-470a-8a98-9381c1c9c6a7',
  displayName: 'Michael Chen',
  firstName: 'Michael',
  lastName: 'Chen',
  avatar: {
    source: 'upload',
    seed: 'parent-1',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-mike-T2UMe9BlbWWIxlq7z99cJWqwEagAuc.jpg',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  timezone: 'America/New_York',
  locale: 'en-US',
  prefs: null,
  notificationDefaults: null,
  bio: 'Focused on keeping learning consistent and positive at home.',
  notesInternal: null,
  createdAt: '2021-09-15T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  children: MOCK_CHILDREN,
  joinedDate: new Date(2021, 8, 15),
};

export const MOCK_USER_ACCOUNTS: UserAccount[] = [
  {
    orgId: MOCK_ORG_ID,
    userId: MOCK_TEACHER.userId,
    contacts: { email: 'j.williams@school.edu', phoneE164: '+15551234567' },
    userRoles: [
      {
        userId: MOCK_TEACHER.userId,
        roleKey: 'teacher',
        assignedAt: '2020-09-01T00:00:00.000Z',
      },
    ],
    status: 'active',
    presence: null,
    createdAt: '2020-09-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: MOCK_TEACHER_2.userId,
    contacts: { email: 'd.kim@school.edu', phoneE164: '+15551230001' },
    userRoles: [
      {
        userId: MOCK_TEACHER_2.userId,
        roleKey: 'teacher',
        assignedAt: '2018-08-20T00:00:00.000Z',
      },
    ],
    status: 'active',
    presence: null,
    createdAt: '2018-08-20T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: MOCK_TEACHER_3.userId,
    contacts: { email: 'p.desai@school.edu', phoneE164: '+15551230002' },
    userRoles: [
      {
        userId: MOCK_TEACHER_3.userId,
        roleKey: 'teacher',
        assignedAt: '2019-08-15T00:00:00.000Z',
      },
    ],
    status: 'active',
    presence: null,
    createdAt: '2019-08-15T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: MOCK_TEACHER_4.userId,
    contacts: { email: 'l.hernandez@school.edu', phoneE164: '+15551230003' },
    userRoles: [
      {
        userId: MOCK_TEACHER_4.userId,
        roleKey: 'teacher',
        assignedAt: '2017-01-10T00:00:00.000Z',
      },
    ],
    status: 'active',
    presence: null,
    createdAt: '2017-01-10T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: MOCK_TEACHER_5.userId,
    contacts: { email: 'c.rivera@school.edu', phoneE164: '+15551230004' },
    userRoles: [
      {
        userId: MOCK_TEACHER_5.userId,
        roleKey: 'teacher',
        assignedAt: '2021-08-25T00:00:00.000Z',
      },
    ],
    status: 'active',
    presence: null,
    createdAt: '2021-08-25T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: MOCK_PARENT.userId,
    contacts: { email: 'michael.chen@email.com', phoneE164: '+15559876543' },
    userRoles: [
      {
        userId: MOCK_PARENT.userId,
        roleKey: 'parent',
        assignedAt: '2021-09-15T00:00:00.000Z',
      },
    ],
    status: 'active',
    presence: null,
    createdAt: '2021-09-15T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: MOCK_CHILDREN_IDS.sarah,
    contacts: {},
    userRoles: [
      {
        userId: MOCK_CHILDREN_IDS.sarah,
        roleKey: 'child',
        assignedAt: '2020-09-01T00:00:00.000Z',
      },
    ],
    status: 'active',
    presence: null,
    createdAt: '2020-09-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: MOCK_CHILDREN_IDS.zayne,
    contacts: {},
    userRoles: [
      {
        userId: MOCK_CHILDREN_IDS.zayne,
        roleKey: 'child',
        assignedAt: '2021-01-01T00:00:00.000Z',
      },
    ],
    status: 'active',
    presence: null,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: MOCK_CHILDREN_IDS.sophia,
    contacts: {},
    userRoles: [
      {
        userId: MOCK_CHILDREN_IDS.sophia,
        roleKey: 'child',
        assignedAt: '2021-01-01T00:00:00.000Z',
      },
    ],
    status: 'active',
    presence: null,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const getMockUserAccountByUserId = (userId: UUID) =>
  MOCK_USER_ACCOUNTS.find((account) => account.userId === userId);
