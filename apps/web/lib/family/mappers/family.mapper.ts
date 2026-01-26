import type { FamilyLinkVM, FamilyVM } from '@iconicedu/shared-types';
import type { FamilyLinkRow, FamilyRow } from '@iconicedu/shared-types';

export function mapFamilyRowToVM(row: FamilyRow): FamilyVM {
  return {
    ids: {
      id: row.id,
      orgId: row.org_id,
    },
    displayName: row.display_name,
  };
}

export function mapFamilyLinkRowToVM(row: FamilyLinkRow): FamilyLinkVM {
  return {
    ids: {
      id: row.id,
      orgId: row.org_id,
      familyId: row.family_id,
    },
    accounts: {
      guardianAccountId: row.guardian_account_id,
      childAccountId: row.child_account_id,
    },
    relation: row.relation as FamilyLinkVM['relation'],
    permissionsScope: row.permissions_scope ?? null,
  };
}
