import type { ISODateTime, UUID } from '../vm/shared';
import type { RoleKey } from '../vm/roles';

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
