import type {
  ISODateTime,
  UUID,
  FamilyLinkInviteRole,
  FamilyLinkInviteStatus,
} from '@iconicedu/shared-types/shared/shared';

export interface FamilyLinkInviteRow {
  id: UUID;
  org_id: UUID;
  family_id: UUID;
  invited_role: FamilyLinkInviteRole;
  invited_email?: string | null;
  invited_phone_e164?: string | null;
  invite_code_hash?: string | null;
  created_by_account_id: UUID;
  status: FamilyLinkInviteStatus;
  expires_at?: ISODateTime | null;
  accepted_by_account_id?: UUID | null;
  accepted_at?: ISODateTime | null;
  max_uses: number;
  uses: number;
  created_at: ISODateTime;
  updated_at: ISODateTime;
  created_by?: UUID | null;
  updated_by?: UUID | null;
  deleted_at?: ISODateTime | null;
  deleted_by?: UUID | null;
}
