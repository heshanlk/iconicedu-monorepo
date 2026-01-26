import type { OrgVM } from '@iconicedu/shared-types';

type OrgRow = {
  id: string;
  name: string;
  slug: string;
};

export function mapOrgRow(row: OrgRow): OrgVM {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
  };
}
