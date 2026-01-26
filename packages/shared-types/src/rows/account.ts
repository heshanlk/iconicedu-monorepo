import type { AccountStatus, ISODateTime, UUID } from '@iconicedu/shared-types/shared/shared';

export interface AccountRow {
  id: UUID;
  org_id: UUID;
  auth_user_id?: UUID | null;
  email?: string | null;
  phone_e164?: string | null;
  whatsapp_e164?: string | null;
  email_verified?: boolean | null;
  email_verified_at?: ISODateTime | null;
  phone_verified?: boolean | null;
  phone_verified_at?: ISODateTime | null;
  whatsapp_verified?: boolean | null;
  whatsapp_verified_at?: ISODateTime | null;
  preferred_contact_channels?: string[] | null;
  status: AccountStatus;
  created_at: ISODateTime;
  updated_at: ISODateTime;
  archived_at?: ISODateTime | null;
  deleted_at?: ISODateTime | null;
}
