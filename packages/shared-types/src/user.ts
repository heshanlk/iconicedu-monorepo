export type AvatarSource = 'seed' | 'upload' | 'external';
export type ISODateTime = string;
export type UUID = string;
export type GradeLevel = {
  label: string;
  value: string | number;
} | null;
export type RoleKey = 'owner' | 'admin' | 'teacher' | 'parent' | 'child';
export type AccountStatus = 'active' | 'invited' | 'suspended' | 'deleted';

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

export interface EducatorProfile extends BaseUserProfile {
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

export interface GuardianProfile extends BaseUserProfile {
  children: ChildProfile[];
  joinedDate: Date;
  notesInternal?: string | null;
  sessionNotesVisibility?: 'private' | 'shared' | null;
  leadSource?: string | null;
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

export type UserProfile =
  | EducatorProfile
  | GuardianProfile
  | ChildProfile
  | StaffProfile;
