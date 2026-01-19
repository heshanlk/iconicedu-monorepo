-- Remove the unique index that required child accounts to provide a phone number.
DROP INDEX IF EXISTS public.accounts_org_id_phone_e164_idx;
