-- Allow account verification flags to be optional so we can track unset states.
alter table public.accounts
  alter column phone_verified drop not null,
  alter column whatsapp_verified drop not null,
  alter column email_verified drop not null;
