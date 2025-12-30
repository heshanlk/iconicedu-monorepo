import type { AccountRoleContextVM, UserRoleVM } from './roles';
import type { AccountStatus, ISODateTime, UUID } from './shared';

export interface UserContactVM {
  email?: string | null;
  phoneE164?: string | null;
  whatsappE164?: string | null;

  emailVerified?: boolean;
  phoneVerified?: boolean;
  whatsappVerified?: boolean;
  verifiedAt?: ISODateTime | null;

  preferredContactChannels?: string[] | null;
}

export interface UserAccountVM {
  orgId: UUID;
  id: UUID;

  contacts: UserContactVM;

  status: AccountStatus;

  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  archivedAt?: ISODateTime | null;

  // Use userRoles for all roles; activeContext is the currently selected role + role-specific context.
  userRoles?: UserRoleVM[] | null;
  // Active role context for "single login → multiple roles"
  activeContext?: AccountRoleContextVM | null;
}
