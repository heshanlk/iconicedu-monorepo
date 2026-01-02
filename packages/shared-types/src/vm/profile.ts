import type {
  AccountStatus,
  AvatarSource,
  ConnectionVM,
  GradeLevelOption,
  ISODateTime,
  ThemeKey,
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

export interface UserIdsVM {
  orgId: UUID;
  id: UUID;
  accountId: UUID;
}

export interface UserProfileBlockVM {
  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  avatar: AvatarVM;
}

export interface UserPrefsVM {
  timezone: string;
  locale?: string | null;
  languagesSpoken?: string[] | null;
  notificationDefaults?: NotificationDefaultsVM | null;
}

export type NotificationChannelVM = 'push' | 'email' | 'sms';

export interface NotificationPreferenceVM {
  channels: NotificationChannelVM[];
  muted?: boolean | null;
}

export type NotificationDefaultsVM = Record<string, NotificationPreferenceVM>;

export interface UserLocationVM {
  countryCode?: string | null;
  countryName?: string | null;
  region?: string | null;
  city?: string | null;
  postalCode?: string | null;
}

export interface UserInternalVM {
  notesInternal?: string | null;
  leadSource?: string | null;
}

export interface UserMetaVM {
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface UserUiVM {
  color?: string | null;
  themeKey?: ThemeKey | null;
}

export interface BaseUserProfileVM {
  ids: UserIdsVM;
  profile: UserProfileBlockVM;
  prefs: UserPrefsVM;

  presence?: PresenceVM | null;

  status?: AccountStatus;

  location?: UserLocationVM;

  internal?: UserInternalVM;

  meta: UserMetaVM;

  ui?: UserUiVM;
}

export interface EducatorProfileVM extends BaseUserProfileVM {
  kind: 'educator';

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

  ageGroupsComfortableWith?: string[] | null;

  identityVerificationStatus?: 'unverified' | 'pending' | 'verified' | null;

  curriculumTags?: string[] | null;
  badges?: string[] | null;

  averageRating?: number | null;
  totalReviews?: number | null;

  featuredVideoIntroUrl?: string | null;
}

export interface ChildProfileVM extends BaseUserProfileVM {
  kind: 'child';

  gradeLevel?: GradeLevelOption | null;
  birthYear?: number | null;

  schoolName?: string | null;
  schoolYear?: string | null;

  interests?: string[] | null;
  strengths?: string[] | null;
  learningPreferences?: string[] | null;
  motivationStyles?: string[] | null;

  confidenceLevel?: 'low' | 'medium' | 'high' | null;
  communicationStyle?: 'chatty' | 'shy' | null;
}

export interface GuardianProfileVM extends BaseUserProfileVM {
  kind: 'guardian';

  children?: ConnectionVM<ChildProfileVM> | null;

  joinedDate: ISODateTime;

  sessionNotesVisibility?: 'private' | 'shared' | null;
}

export interface StaffProfileVM extends BaseUserProfileVM {
  kind: 'staff';

  department?: string | null;
  managerStaffId?: UUID | null;
  specialties?: string[] | null;
  jobTitle?: string | null;

  permissionsScope?: 'limited' | 'standard' | 'elevated' | null;

  workingHoursRules?: string[] | null;
}

export type UserProfileVM =
  | EducatorProfileVM
  | GuardianProfileVM
  | ChildProfileVM
  | StaffProfileVM;
