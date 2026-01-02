import type { AccountRoleContextVM, UserRoleVM } from './roles';
import type { AccountStatus, ISODateTime, IdsBaseVM } from './shared';

export type ContactChannelVM = 'email' | 'sms' | 'whatsapp';

export interface UserContactVM {
  email?: string | null;
  phoneE164?: string | null;
  whatsappE164?: string | null;

  emailVerified?: boolean;
  phoneVerified?: boolean;
  whatsappVerified?: boolean;
  verifiedAt?: ISODateTime | null;

  preferredContactChannels?: ContactChannelVM[] | null;
}

export interface AccountAccessVM {
  userRoles?: UserRoleVM[] | null;
  activeContext?: AccountRoleContextVM | null;
}

export interface AccountLifecycleVM {
  status: AccountStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  archivedAt?: ISODateTime | null;
}

export interface UserAccountVM {
  ids: IdsBaseVM;

  contacts: UserContactVM;

  access?: AccountAccessVM;

  lifecycle: AccountLifecycleVM;
}
