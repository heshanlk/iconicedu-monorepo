import type { IdsBaseVM, UUID } from '../shared/shared';

export type FamilyRelationVM =
  | 'guardian'
  | 'legal_guardian'
  | 'caregiver'
  | 'relative'
  | 'other';

export interface FamilyVM {
  ids: IdsBaseVM;
  displayName: string;
}

export interface FamilyLinkVM {
  ids: Omit<IdsBaseVM, 'familyId'> & { familyId: UUID };

  accounts: {
    guardianAccountId: UUID;
    childAccountId: UUID;
  };

  relation: FamilyRelationVM;

  permissionsScope?: string[] | null;
}
