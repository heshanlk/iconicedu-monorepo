export const FAMILY_SELECT =
  'id, org_id, display_name, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by';
export const FAMILY_LINK_SELECT =
  'id, org_id, family_id, guardian_account_id, child_account_id, relation, permissions_scope, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by';
export const FAMILY_INVITE_SELECT =
  'id, org_id, family_id, invited_role, invited_email, invited_phone_e164, invite_code_hash, created_by_account_id, status, expires_at, accepted_by_account_id, accepted_at, max_uses, uses, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by';
