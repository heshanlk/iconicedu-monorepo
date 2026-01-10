import type {
  ISODateTime,
  UUID,
  FamilyLinkInviteRole,
  FamilyLinkInviteStatus,
} from '../shared/shared';

export interface FamilyLinkInviteVM {
  id: UUID;
  orgId: UUID;
  familyId: UUID;
  invitedRole: FamilyLinkInviteRole;
  invitedEmail?: string | null;
  invitedPhoneE164?: string | null;
  status: FamilyLinkInviteStatus;
  expiresAt?: ISODateTime | null;
  acceptedByAccountId?: UUID | null;
  acceptedAt?: ISODateTime | null;
  maxUses: number;
  uses: number;
  createdByAccountId: UUID;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
