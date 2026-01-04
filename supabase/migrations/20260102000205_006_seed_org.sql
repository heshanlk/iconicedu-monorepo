insert into public.orgs (id, name, slug)
values (
  'b3a5f6e3-2f6a-4c12-9d3a-1f1f1b0a6f1a',
  'ICONIC Academy',
  'iconic-academy'
)
on conflict (id) do update
  set name = excluded.name,
      slug = excluded.slug,
      updated_at = now();
