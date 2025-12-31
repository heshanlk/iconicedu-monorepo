
import type { UUID } from './shared';



export type FamilyRelationVM =
  | 'guardian'
  | 'legal_guardian'
  | 'caregiver'
  | 'relative'
  | 'other';



export interface FamilyIdsVM {
  orgId: UUID;
  id: UUID;
}

export interface FamilyLinkIdsVM extends FamilyIdsVM {
  familyId: UUID;
}



export interface FamilyVM {
  ids: FamilyIdsVM;
  displayName: string;
}



export interface FamilyLinkVM {
  ids: FamilyLinkIdsVM;

  accounts: {
    guardianAccountId: UUID;
    childAccountId: UUID;
  };

  relation: FamilyRelationVM;

  permissionsScope?: string[] | null;
}
