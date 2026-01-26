import type { OrgRow, OrgVM } from '@iconicedu/shared-types';

export function mapOrgRow(row: OrgRow): OrgVM {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
  };
}
