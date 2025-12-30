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
    userRoles?: UserRoleVM[] | null;
    activeContext?: AccountRoleContextVM | null;
}
//# sourceMappingURL=account.d.ts.map