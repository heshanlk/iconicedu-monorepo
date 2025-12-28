import type { UUID } from './shared';

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
  childAccountId: UUID;

  relation: FamilyRelation;

  // Optional fine-grained scoping used by UI (tabs/features)
  permissionsScope?: string[] | null;
}
