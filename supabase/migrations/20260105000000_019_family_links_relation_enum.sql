do $$
begin
  if not exists (select 1 from pg_type where typname = 'family_relation') then
    create type public.family_relation as enum (
      'guardian',
      'legal_guardian',
      'caregiver',
      'relative',
      'other'
    );
  end if;
end$$;

alter table public.family_links
  alter column relation type public.family_relation using relation::public.family_relation;
