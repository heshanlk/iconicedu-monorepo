import type { ISODateTime, UUID } from '@iconicedu/shared-types/shared/shared';
import type { RoleKey } from '@iconicedu/shared-types/vm/roles';

export interface UserRoleRow {
  id: UUID;
  org_id: UUID;
  account_id: UUID;
  role_key: RoleKey;
  assigned_by?: UUID | null;
  assigned_at: ISODateTime;
  created_at: ISODateTime;
  updated_at: ISODateTime;
  deleted_at?: ISODateTime | null;
}
