import type { User } from '@iconicedu/shared-types';

export type AvatarSource = 'seed' | 'upload' | 'external';
export type ISODateTime = string;
export type UUID = string;
export type GradeLevel = number | string;
export type RoleKey = 'owner' | 'admin' | 'teacher' | 'parent' | 'child';
export interface UserRole {
  userId: UUID;
  roleKey: RoleKey;
  assignedBy?: UUID | null;
  assignedAt: ISODateTime;
}
export interface BaseUserProfile {
  userId: UUID;

  displayName: string;
  firstName?: string | null;
  lastName?: string | null;

  bio?: string | null;

  avatarSource: AvatarSource;
  avatarSeed: string;
  avatarUrl?: string | null;
  avatarUpdatedAt?: string | null;

  email?: string | null;
  phoneE164?: string | null;

  timezone: string;
  locale?: string | null;
  languagesSpoken?: string[] | null;

  prefs?: Record<string, unknown> | null;
  notificationDefaults?: Record<string, unknown> | null;
  preferredContactChannels?: string[] | null;

  userRoles?: UserRole[] | null;

  createdAt: ISODateTime;
  updatedAt: ISODateTime;

  status?: 'active' | 'inactive' | 'suspended' | null;
}

export interface TeacherProfile extends BaseUserProfile {
  email: string;
  headline?: string | null;
  subjects?: string[] | null;
  gradesSupported?: GradeLevel[] | null;
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

export interface ParentProfile extends BaseUserProfile {
  email: string;
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
    userId: MOCK_CHILDREN_IDS.sarah,
    displayName: 'Sarah',
    firstName: 'Sarah',
    lastName: 'Chen',
    avatarSource: 'seed',
    avatarSeed: 'Children-3',
    avatarUrl: null,
    avatarUpdatedAt: null,
    phoneE164: null,
    timezone: 'America/New_York',
    locale: 'en-US',
    prefs: null,
    notificationDefaults: null,
    userRoles: [
      {
        userId: '1b9504c3-0e65-4d7a-a843-2d7169f73407',
        roleKey: 'child',
        assignedAt: '2020-09-01T00:00:00.000Z',
      },
    ],
    gradeLevel: 4,
    schoolName: 'Riverside Elementary School',
    schoolYear: '2024-2025',
    notesInternal: null,
    createdAt: '2020-09-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    color: 'bg-green-500 text-white',
  },
  {
    userId: MOCK_CHILDREN_IDS.zayne,
    displayName: 'Zayne',
    firstName: 'Zayne',
    lastName: null,
    avatarSource: 'seed',
    avatarSeed: 'Children-4',
    avatarUrl: null,
    avatarUpdatedAt: null,
    phoneE164: null,
    timezone: 'America/New_York',
    locale: 'en-US',
    prefs: null,
    notificationDefaults: null,
    userRoles: [
      {
        userId: '8f055dda-76e1-4a50-9e6e-34f0dc82e6f6',
        roleKey: 'child',
        assignedAt: '2021-01-01T00:00:00.000Z',
      },
    ],
    gradeLevel: 7,
    schoolName: 'Riverside Middle School',
    schoolYear: '2024-2025',
    notesInternal: null,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    color: 'bg-red-500 text-white',
  },
  {
    userId: MOCK_CHILDREN_IDS.sophia,
    displayName: 'Sophia',
    firstName: 'Sophia',
    lastName: null,
    avatarSource: 'seed',
    avatarSeed: 'Children-5',
    avatarUrl: null,
    avatarUpdatedAt: null,
    phoneE164: null,
    timezone: 'America/New_York',
    locale: 'en-US',
    prefs: null,
    notificationDefaults: null,
    userRoles: [
      {
        userId: 'f0c0ea47-e1c1-4f54-bb99-b1df83db9da4',
        roleKey: 'child',
        assignedAt: '2021-01-01T00:00:00.000Z',
      },
    ],
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
  avatar: profile.avatarUrl ?? '',
});

const toRoleLabel = (roleKey: RoleKey | undefined) => {
  if (!roleKey) return undefined;
  return roleKey.charAt(0).toUpperCase() + roleKey.slice(1);
};

export const toProfileUser = (
  profile: TeacherProfile | ParentProfile,
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
  role: toRoleLabel(profile.userRoles?.[0]?.roleKey),
  email: profile.email ?? null,
  phone: profile.phoneE164 ?? null,
  joinedDate: profile.joinedDate,
  headline: 'headline' in profile ? profile.headline ?? null : null,
  bio: 'bio' in profile ? profile.bio ?? null : null,
  subjects: 'subjects' in profile ? profile.subjects ?? null : null,
  gradesSupported: 'gradesSupported' in profile ? profile.gradesSupported ?? null : null,
  experienceYears: 'experienceYears' in profile ? profile.experienceYears ?? null : null,
  certifications: 'certifications' in profile ? profile.certifications ?? null : null,
  childrenNames: 'children' in profile
    ? profile.children.map((child) => child.displayName)
    : undefined,
});

export const MOCK_TEACHER: TeacherProfile = {
  userId: 'a21b9c5f-0906-4f04-9b7f-6f7b4a6fb1c5',
  displayName: 'Ms. Jennifer Williams',
  firstName: 'Jennifer',
  lastName: 'Williams',
  avatarSource: 'upload',
  avatarSeed: 'teacher-1',
  avatarUrl:
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-sarah-Vsp1gZWstExMvD0Qce0ogsgN6nv2pC.png',
  avatarUpdatedAt: '2024-01-01T00:00:00.000Z',
  phoneE164: '+15551234567',
  timezone: 'America/New_York',
  locale: 'en-US',
  prefs: null,
  notificationDefaults: null,
  userRoles: [
    {
      userId: 'a21b9c5f-0906-4f04-9b7f-6f7b4a6fb1c5',
      roleKey: 'teacher',
      assignedAt: '2020-09-01T00:00:00.000Z',
    },
  ],
  email: 'j.williams@school.edu',
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

export const MOCK_PARENT: ParentProfile = {
  userId: '2a0f3cbe-0b3b-470a-8a98-9381c1c9c6a7',
  displayName: 'Michael Chen',
  firstName: 'Michael',
  lastName: 'Chen',
  avatarSource: 'upload',
  avatarSeed: 'parent-1',
  avatarUrl:
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-mike-T2UMe9BlbWWIxlq7z99cJWqwEagAuc.jpg',
  avatarUpdatedAt: '2024-01-01T00:00:00.000Z',
  phoneE164: '+15559876543',
  timezone: 'America/New_York',
  locale: 'en-US',
  prefs: null,
  notificationDefaults: null,
  userRoles: [
    {
      userId: '2a0f3cbe-0b3b-470a-8a98-9381c1c9c6a7',
      roleKey: 'parent',
      assignedAt: '2021-09-15T00:00:00.000Z',
    },
  ],
  email: 'michael.chen@email.com',
  bio: 'Focused on keeping learning consistent and positive at home.',
  notesInternal: null,
  createdAt: '2021-09-15T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  children: MOCK_CHILDREN,
  joinedDate: new Date(2021, 8, 15),
};
