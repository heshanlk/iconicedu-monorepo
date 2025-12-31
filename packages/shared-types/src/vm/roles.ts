
import type { FamilyLinkVM } from './family';
import type { ISODateTime, UUID } from './shared';

export type RoleKey = 'owner' | 'admin' | 'educator' | 'guardian' | 'child' | 'staff';

export interface RoleIdsVM {
  orgId: UUID;
  id: UUID;
}

export interface RoleAuditVM {
  assignedBy?: UUID | null;
  assignedAt: ISODateTime;
}


export interface UserRoleVM {
  ids: RoleIdsVM;
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
