import type { RoleKey, UserRoleVM } from '@iconicedu/shared-types';
import type { UserRoleRow } from '@iconicedu/shared-types';

export function mapUserRoleRow(row: UserRoleRow): UserRoleVM {
  return {
    ids: {
      id: row.id,
      orgId: row.org_id,
    },
    roleKey: row.role_key as RoleKey,
    audit: {
      assignedBy: row.assigned_by ?? null,
      assignedAt: row.assigned_at,
    },
  };
}

export function mapUserRoleRows(rows: UserRoleRow[] | null | undefined): UserRoleVM[] {
  return rows?.map(mapUserRoleRow) ?? [];
}
