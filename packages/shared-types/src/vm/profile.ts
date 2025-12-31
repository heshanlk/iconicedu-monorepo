import type {
  AccountStatus,
  AvatarSource,
  ConnectionVM,
  GradeLevelOption,
  ISODateTime,
  UUID,
} from './shared';

export interface AvatarVM {
  source: AvatarSource;
  url?: string | null;
  seed?: string | null;
  updatedAt?: ISODateTime | null;
}

export type PresenceStateVM = {
  text?: string | null;
  emoji?: string | null;
  expiresAt?: ISODateTime | null;
};

export type PresenceDisplayStatusVM = 'online' | 'idle' | 'busy' | 'away' | 'offline';
export type LiveStatusVM =
  | 'in_class'
  | 'teaching'
  | 'reviewing_work'
  | 'busy'
  | 'away'
  | 'offline';

export interface PresenceVM {
  state: PresenceStateVM;
  liveStatus: LiveStatusVM;
  displayStatus?: PresenceDisplayStatusVM;
  lastSeenAt?: ISODateTime | null;
  presenceLoaded?: boolean;
}

export interface BaseUserProfileVM {
  orgId: UUID;
  id: UUID;
  accountId: UUID;

  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;

  avatar: AvatarVM;

  timezone: string;
  locale?: string | null;
  languagesSpoken?: string[] | null;

  notificationDefaults?: Record<string, unknown> | null;
  presence?: PresenceVM | null;

  status?: AccountStatus;

  countryCode?: string | null;
  countryName?: string | null;
  region?: string | null;
  city?: string | null;
  postalCode?: string | null;

  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface EducatorProfileVM extends BaseUserProfileVM {
  headline?: string | null;
  subjects?: string[] | null;
  gradesSupported?: GradeLevelOption[] | null;

  education?: string | null;
  experienceYears?: number | null;

  certifications?: Array<{
    name: string;
    issuer?: string;
    year?: number;
  }> | null;

  joinedDate: ISODateTime;

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

export interface ChildProfileVM extends BaseUserProfileVM {
  gradeLevel?: GradeLevelOption | null;
  birthYear?: number | null;

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

export interface GuardianProfileVM extends BaseUserProfileVM {
  children?: ConnectionVM<ChildProfileVM> | null;

  joinedDate: ISODateTime;

  notesInternal?: string | null;
  sessionNotesVisibility?: 'private' | 'shared' | null;
  leadSource?: string | null;
}

export interface StaffProfileVM extends BaseUserProfileVM {
  department?: string | null;
  managerStaffId?: UUID | null;
  specialties?: string[] | null;
  jobTitle?: string | null;

  permissionsScope?: 'limited' | 'standard' | 'elevated' | null;

  notesInternal?: string | null;
  workingHoursRules?: string[] | null;
}
export type UserProfileVM =
  | EducatorProfileVM
  | GuardianProfileVM
  | ChildProfileVM
  | StaffProfileVM;
