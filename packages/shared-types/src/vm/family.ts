import type { FamilyRelation } from '@iconicedu/shared-types/shared/shared';
import type { IdsBaseVM, UUID } from '@iconicedu/shared-types/shared/shared';

export type FamilyRelationVM = FamilyRelation;

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
