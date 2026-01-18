alter table public.accounts
  alter column preferred_contact_channels set default array['email']::text[];

update public.accounts
set preferred_contact_channels = array['email']::text[]
where preferred_contact_channels is null;
