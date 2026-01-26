import type { ISODateTime, UUID } from '@iconicedu/shared-types/shared/shared';

export interface OrgRow {
  id: UUID;
  name: string;
  slug: string;
  created_at: ISODateTime;
  created_by?: UUID | null;
  updated_at: ISODateTime;
  updated_by?: UUID | null;
  deleted_at?: ISODateTime | null;
  deleted_by?: UUID | null;
}
