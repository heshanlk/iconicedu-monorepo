import type { FamilyLinkVM } from '@iconicedu/shared-types/vm/family';
import type { IdsBaseVM, ISODateTime, UUID } from '@iconicedu/shared-types/shared/shared';

export type RoleKey = 'owner' | 'admin' | 'educator' | 'guardian' | 'child' | 'staff';

export interface RoleAuditVM {
  assignedBy?: UUID | null;
  assignedAt: ISODateTime;
}

export interface UserRoleVM {
  ids: IdsBaseVM;
  roleKey: RoleKey;
  audit: RoleAuditVM;
}

export interface FamilyScopedContextVM {
  familyLink?: FamilyLinkVM | null;
}

export type AccountRoleContextVM =
  | ({ roleKey: 'guardian' } & FamilyScopedContextVM)
  | ({ roleKey: 'child' } & FamilyScopedContextVM)
  | { roleKey: 'educator' }
  | { roleKey: 'admin' }
  | { roleKey: 'owner' }
  | { roleKey: 'staff' };
