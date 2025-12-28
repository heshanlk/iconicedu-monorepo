// =====================
// Shared primitives
// =====================

export type UUID = string;
export type ISODateTime = string;

export type AvatarSource = 'seed' | 'upload' | 'external';
export type RoleKey = 'owner' | 'admin' | 'educator' | 'guardian' | 'child';
export type AccountStatus = 'active' | 'invited' | 'suspended' | 'deleted';

// Stable persisted keys you can safely store/query
export type GradeLevelKey = string | number;

// UI-friendly grade option (dropdown, chips, etc.)
export type GradeLevelOption = {
  id: GradeLevelKey;
  label: string;
} | null;

// Generic pagination/connection shape for FE VMs
export interface ConnectionVM<T> {
  items: T[];
  nextCursor?: string | null;
  total?: number | null;
}

// =====================
// Roles / org membership (VM)
// =====================

export interface UserRoleVM {
  orgId: UUID;
  id: UUID;
  roleKey: RoleKey;
  assignedBy?: UUID | null;
  assignedAt: ISODateTime;
}

// =====================
// FamilyVM (VM)
// =====================

export interface FamilyVM {
  orgId: UUID;
  id: UUID;
  displayName: string;
}

export type FamilyRelation =
  | 'guardian'
  | 'legal_guardian'
  | 'caregiver'
  | 'relative'
  | 'other';

export interface FamilyLinkVM {
  orgId: UUID;
  id: UUID;
  familyId: UUID;

  guardianAccountId: UUID;
  // NOTE: Keeping your original name for compatibility, but in DB I recommend "childId"
  childAccountId: UUID;

  relation: FamilyRelation;

  // Optional fine-grained scoping used by UI (tabs/features)
  permissionsScope?: string[] | null;
}

// =====================
// AvatarVM / presence (VM)
// =====================

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

export type LiveStatus = 'none' | 'in_class' | 'teaching' | 'busy' | 'reviewing_work';

export interface PresenceVM {
  state: PresenceStateVM;
  liveStatus: LiveStatus;
  lastSeenAt?: ISODateTime | null;

  // Helpful FE flags for hydration
  presenceLoaded?: boolean;
}

// =====================
// Contacts (VM)
// =====================

export interface UserContactVM {
  email?: string | null;
  phoneE164?: string | null;
  whatsappE164?: string | null;

  emailVerified?: boolean;
  phoneVerified?: boolean;
  whatsappVerified?: boolean;
  verifiedAt?: ISODateTime | null;

  preferredContactChannels?: string[] | null;
}

// =====================
// Account (VM)
// =====================

export interface UserAccountVM {
  orgId: UUID;
  id: UUID;

  contacts: UserContactVM;

  // VM convenience: populated from user_roles join
  userRoles?: UserRoleVM[] | null;

  status?: AccountStatus;

  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  archivedAt?: ISODateTime | null;

  // Active role context for "single login → multiple roles"
  activeContext?: AccountRoleContextVM | null;
}

// Replace GuardianAccount/ChildAccount extends UserAccountVM with role context union
export type AccountRoleContextVM =
  | {
      roleKey: 'guardian';
      familyLink?: FamilyLinkVM | null;
    }
  | {
      roleKey: 'child';
      familyLink?: FamilyLinkVM | null;
    }
  | {
      roleKey: 'educator';
    }
  | {
      roleKey: 'admin';
    }
  | {
      roleKey: 'owner';
    }
  | {
      roleKey: 'staff';
    };

// =====================
// Base profile (VM)
// =====================

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

  // PresenceVM is a separately hydrated chunk in many UIs
  presence?: PresenceVM | null;

  status?: AccountStatus;

  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

// =====================
// Role-specific profiles (VM)
// =====================

export interface EducatorProfileVM extends BaseUserProfileVM {
  headline?: string | null;

  // Tags/labels for UI (can be stored as text[] or join tables)
  subjects?: string[] | null;

  // UI options for display
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
  // UI option for display
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
  // Use a connection for scalable UI + consistent patterns
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

// Union for FE usage
export type UserProfileVM =
  | EducatorProfileVM
  | GuardianProfileVM
  | ChildProfileVM
  | StaffProfileVM;
