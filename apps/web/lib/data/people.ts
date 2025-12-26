import type { User } from '@iconicedu/shared-types';

export type MockStudentKey = 'sarahChen' | 'zayne' | 'sophia';

export type MemberState = 'active' | 'inactive' | 'invited';
export type AvatarSource = 'seed' | 'upload' | 'external';
export type ISODateTime = string;
export type UUID = string;
export type ContactMethod = 'email' | 'phone' | 'whatsapp' | 'none';

export interface BaseUserProfile {
  userId: string;
  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarSource: AvatarSource;
  avatarSeed: string;
  avatarUrl?: string | null;
  avatarUpdatedAt?: string | null;
  phoneE164?: string | null;
  timezone: string;
  locale?: string | null;
  prefs?: Record<string, unknown> | null;
  notificationDefaults?: Record<string, unknown> | null;
}

export type PersonaKey = 'teacher' | 'parent' | 'student';

export interface OrgMemberProfile {
  orgId: UUID;
  userId: UUID;
  preferredContactMethod?: ContactMethod | null;
  preferredLanguage?: string | null;
  notesInternal?: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export type OrgRoleKey = 'owner' | 'admin' | 'teacher' | 'parent' | 'student';

export interface UserRole {
  orgId: UUID;
  userId: UUID;
  roleKey: OrgRoleKey;
  assignedBy?: UUID | null;
  assignedAt: ISODateTime;
}

// =====================
// Families (Parent ↔ Student referencing)
// =====================
export interface Family {
  id: UUID;
  orgId: UUID;
  familyName?: string | null;
  createdAt: ISODateTime;
  updatedAt?: ISODateTime | null;
}

export type FamilyRole = 'parent' | 'guardian' | 'student';

export interface FamilyMember {
  familyId: UUID;
  userId: UUID;
  orgId: UUID;
  familyRole: FamilyRole;
  relationship?: string | null;
  isPrimary?: boolean | null;
  createdAt: ISODateTime;
}

// Helpful computed shapes (not DB tables)
export interface ParentChildLink {
  orgId: UUID;
  familyId: UUID;
  parentUserId: UUID;
  studentUserId: UUID;
  relationship?: string | null;
  isPrimary?: boolean | null;
}

export interface TeacherProfile extends BaseUserProfile {
  role: 'Teacher';
  orgId: UUID;
  email?: string | null;
  headline?: string | null;
  subjects?: string[] | null;
  gradesSupported?: Array<number | string> | null;
  languages?: string[] | null;
  experienceYears?: number | null;
  certifications?: Array<{
    name: string;
    issuer?: string;
    year?: number;
  }> | null;
  notesInternal?: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  school: string;
  grade: string;
  joinedDate: Date;
}

export interface ParentProfile extends BaseUserProfile {
  role: 'Parent';
  email?: string | null;
  school: string;
  grade: string;
  students: StudentProfile[];
  joinedDate: Date;
}

export interface StaffProfile extends BaseUserProfile {
  role: 'Staff';
  orgId: UUID;
  department?: string | null;
  jobTitle?: string | null;
  notesInternal?: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface StudentProfile extends BaseUserProfile {
  role: 'Student';
  orgId: UUID;
  gradeLevel?: number | null;
  schoolName?: string | null;
  schoolYear?: string | null;
  notesInternal?: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  key: MockStudentKey;
  legacyId: number;
  color: string;
}

export type MockStudent = StudentProfile;

export const MOCK_STUDENTS: StudentProfile[] = [
  {
    orgId: MOCK_ORG_ID,
    userId: '1b9504c3-0e65-4d7a-a843-2d7169f73407',
    displayName: 'Sarah Chen',
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
    gradeLevel: 4,
    schoolName: 'Riverside Elementary School',
    schoolYear: '2024-2025',
    notesInternal: null,
    createdAt: '2020-09-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    key: 'sarahChen',
    legacyId: 3,
    color: 'bg-green-500 text-white',
    role: 'Student',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: '8f055dda-76e1-4a50-9e6e-34f0dc82e6f6',
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
    gradeLevel: 7,
    schoolName: 'Riverside Middle School',
    schoolYear: '2024-2025',
    notesInternal: null,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    key: 'zayne',
    legacyId: 4,
    color: 'bg-red-500 text-white',
    role: 'Student',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: 'f0c0ea47-e1c1-4f54-bb99-b1df83db9da4',
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
    gradeLevel: 7,
    schoolName: 'Riverside Middle School',
    schoolYear: '2024-2025',
    notesInternal: null,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    key: 'sophia',
    legacyId: 5,
    color: 'bg-green-500 text-white',
    role: 'Student',
  },
];

export const getMockStudentById = (id: number) =>
  MOCK_STUDENTS.find((student) => student.legacyId === id);

export const getMockStudentName = (id: number) =>
  getMockStudentById(id)?.displayName ?? `Student ${id}`;

const isMockStudent = (student: StudentProfile | undefined): student is StudentProfile =>
  Boolean(student);

export const getMockStudentsByIds = (ids: number[]): StudentProfile[] =>
  ids.map((id) => getMockStudentById(id)).filter(isMockStudent);

export const MOCK_ORG_ID = '4fca0d16-5d72-4a24-9a0d-6f8c0bf2b652';

export const MOCK_ORG_MEMBER_PROFILES: OrgMemberProfile[] = [
  {
    orgId: MOCK_ORG_ID,
    userId: 'a21b9c5f-0906-4f04-9b7f-6f7b4a6fb1c5',
    activePersona: 'teacher',
    displayNameOverride: null,
    preferredContactMethod: 'email',
    preferredLanguage: 'en-US',
    notesInternal: null,
    createdAt: '2020-09-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: '2a0f3cbe-0b3b-470a-8a98-9381c1c9c6a7',
    activePersona: 'parent',
    displayNameOverride: null,
    preferredContactMethod: 'email',
    preferredLanguage: 'en-US',
    notesInternal: null,
    createdAt: '2021-09-15T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: '1b9504c3-0e65-4d7a-a843-2d7169f73407',
    activePersona: 'student',
    displayNameOverride: null,
    preferredContactMethod: null,
    preferredLanguage: 'en-US',
    notesInternal: null,
    createdAt: '2020-09-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: '8f055dda-76e1-4a50-9e6e-34f0dc82e6f6',
    activePersona: 'student',
    displayNameOverride: null,
    preferredContactMethod: null,
    preferredLanguage: 'en-US',
    notesInternal: null,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    orgId: MOCK_ORG_ID,
    userId: 'f0c0ea47-e1c1-4f54-bb99-b1df83db9da4',
    activePersona: 'student',
    displayNameOverride: null,
    preferredContactMethod: null,
    preferredLanguage: 'en-US',
    notesInternal: null,
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const getMockOrgMemberProfileByUserId = (userId: string) =>
  MOCK_ORG_MEMBER_PROFILES.find((profile) => profile.userId === userId);

export const toMessageUser = (profile: BaseUserProfile): User => ({
  id: profile.userId,
  name: profile.displayName,
  avatar: profile.avatarUrl ?? '',
});

export const toProfileUser = (
  profile: TeacherProfile | ParentProfile,
): User & {
  role?: string;
  email?: string | null;
  phone?: string | null;
  school?: string;
  grade?: string;
  joinedDate?: Date;
} => ({
  ...toMessageUser(profile),
  role: profile.role,
  email: profile.email ?? null,
  phone: profile.phoneE164 ?? null,
  school: profile.school,
  grade: profile.grade,
  joinedDate: profile.joinedDate,
});

export const MOCK_TEACHER: TeacherProfile = {
  orgId: MOCK_ORG_ID,
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
  role: 'Teacher',
  email: 'j.williams@school.edu',
  headline: 'Helping 4th graders love math.',
  subjects: ['Mathematics'],
  gradesSupported: ['4th Grade', 5],
  languages: ['English'],
  experienceYears: 8,
  certifications: [
    { name: 'Elementary Education Certification', issuer: 'State Board', year: 2016 },
  ],
  notesInternal: null,
  createdAt: '2020-09-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  school: 'Riverside Elementary School',
  grade: '4th Grade',
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
  role: 'Parent',
  email: 'michael.chen@email.com',
  school: 'Riverside Elementary School',
  grade: '4th Grade',
  students: getMockStudentsByIds([3]),
  joinedDate: new Date(2021, 8, 15),
};
