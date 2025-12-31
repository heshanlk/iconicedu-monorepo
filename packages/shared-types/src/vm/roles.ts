import type { FamilyLinkVM } from './family';
import type { ISODateTime, UUID } from './shared';

export type RoleKey =
  | 'owner'
  | 'admin'
  | 'educator'
  | 'guardian'
  | 'child'
  | 'staff';

export interface UserRoleVM {
  orgId: UUID;
  id: UUID;
  roleKey: RoleKey;
  assignedBy?: UUID | null;
  assignedAt: ISODateTime;
}

// Replace GuardianAccount/ChildAccount extends UserAccountVM with role context union
export type AccountRoleContextVM =
  | {
      roleKey: 'guardian';
      familyLink?: FamilyLinkVM | null;
    }
  | {
      roleKey: 'child';
      familyLink?: FamilyLinkVM | null;
    }
  | {
      roleKey: 'educator';
    }
  | {
      roleKey: 'admin';
    }
  | {
      roleKey: 'owner';
    }
  | {
      roleKey: 'staff';
    };
