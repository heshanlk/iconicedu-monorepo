import type { User } from '@iconicedu/shared-types';

export type AvatarSource = 'seed' | 'upload' | 'external';
export type ISODateTime = string;
export type UUID = string;
export type GradeLevel = number | string;

export interface BaseUserProfile {
  userId: UUID;
  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarSource: AvatarSource;
  avatarSeed: string;
  avatarUrl?: string | null;
  avatarUpdatedAt?: string | null;
  email?: string | null;
  phoneE164?: string | null;
  timezone: string;
  locale?: string | null;
  prefs?: Record<string, unknown> | null;
  notificationDefaults?: Record<string, unknown> | null;
  userRoles?: UserRole[] | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export type OrgRoleKey = 'owner' | 'admin' | 'teacher' | 'parent' | 'student';

export interface UserRole {
  userId: UUID;
  roleKey: OrgRoleKey;
  assignedBy?: UUID | null;
  assignedAt: ISODateTime;
}

export interface TeacherProfile extends BaseUserProfile {
  email: string;
  headline?: string | null;
  subjects?: string[] | null;
  gradesSupported?: GradeLevel[] | null;
  experienceYears?: number | null;
  certifications?: Array<{
    name: string;
    issuer?: string;
    year?: number;
  }> | null;
  bio?: string | null;
  joinedDate: Date;
  notesInternal?: string | null;
}

export interface ParentProfile extends BaseUserProfile {
  email: string;
  students: StudentProfile[];
  joinedDate: Date;
  notesInternal?: string | null;
  bio?: string | null;
}

export interface StudentProfile extends BaseUserProfile {
  gradeLevel?: GradeLevel | null;
  schoolName?: string | null;
  schoolYear?: string | null;
  color: string;
  notesInternal?: string | null;
}

export const MOCK_STUDENT_IDS = {
  sarah: '1b9504c3-0e65-4d7a-a843-2d7169f73407',
  zayne: '8f055dda-76e1-4a50-9e6e-34f0dc82e6f6',
  sophia: 'f0c0ea47-e1c1-4f54-bb99-b1df83db9da4',
} as const;

export const MOCK_STUDENTS: StudentProfile[] = [
  {
    userId: MOCK_STUDENT_IDS.sarah,
    displayName: 'Sarah',
    firstName: 'Sarah',
    lastName: 'Chen',
    avatarSource: 'seed',
    avatarSeed: 'student-3',
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
        roleKey: 'student',
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
    userId: MOCK_STUDENT_IDS.zayne,
    displayName: 'Zayne',
    firstName: 'Zayne',
    lastName: null,
    avatarSource: 'seed',
    avatarSeed: 'student-4',
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
        roleKey: 'student',
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
    userId: MOCK_STUDENT_IDS.sophia,
    displayName: 'Sophia',
    firstName: 'Sophia',
    lastName: null,
    avatarSource: 'seed',
    avatarSeed: 'student-5',
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
        roleKey: 'student',
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

export const getMockStudentByUserId = (userId: UUID) =>
  MOCK_STUDENTS.find((student) => student.userId === userId);

export const getMockStudentNameByUserId = (userId: UUID) =>
  getMockStudentByUserId(userId)?.displayName ?? 'Student';

export const toMessageUser = (profile: BaseUserProfile): User => ({
  id: profile.userId,
  name: profile.displayName,
  avatar: profile.avatarUrl ?? '',
});

const toRoleLabel = (roleKey: OrgRoleKey | undefined) => {
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
} => ({
  ...toMessageUser(profile),
  role: toRoleLabel(profile.userRoles?.[0]?.roleKey),
  email: profile.email ?? null,
  phone: profile.phoneE164 ?? null,
  joinedDate: profile.joinedDate,
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
  students: MOCK_STUDENTS,
  joinedDate: new Date(2021, 8, 15),
};
