do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'rrule_byday'
  ) then
    create type public.rrule_byday as enum ('MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU');
  end if;
end
$$;

alter table public.class_schedule_recurrence
  add column if not exists raw_rrule text,
  add column if not exists bysecond int[],
  add column if not exists byminute int[],
  add column if not exists byhour int[],
  add column if not exists byday public.rrule_byday[],
  add column if not exists bymonthday int[],
  add column if not exists byyearday int[],
  add column if not exists byweekno int[],
  add column if not exists bymonth int[],
  add column if not exists bysetpos int[],
  add column if not exists wkst public.rrule_byday not null default 'MO';

alter table public.class_schedule_recurrence
  add constraint class_schedule_recurrence_bysecond_chk
    check (
      bysecond is null
      or bysecond <@ array[
        0,1,2,3,4,5,6,7,8,9,
        10,11,12,13,14,15,16,17,18,19,
        20,21,22,23,24,25,26,27,28,29,
        30,31,32,33,34,35,36,37,38,39,
        40,41,42,43,44,45,46,47,48,49,
        50,51,52,53,54,55,56,57,58,59
      ]::int[]
    ),
  add constraint class_schedule_recurrence_byminute_chk
    check (
      byminute is null
      or byminute <@ array[
        0,1,2,3,4,5,6,7,8,9,
        10,11,12,13,14,15,16,17,18,19,
        20,21,22,23,24,25,26,27,28,29,
        30,31,32,33,34,35,36,37,38,39,
        40,41,42,43,44,45,46,47,48,49,
        50,51,52,53,54,55,56,57,58,59
      ]::int[]
    ),
  add constraint class_schedule_recurrence_byhour_chk
    check (
      byhour is null
      or byhour <@ array[
        0,1,2,3,4,5,6,7,8,9,
        10,11,12,13,14,15,16,17,18,19,
        20,21,22,23
      ]::int[]
    ),
  add constraint class_schedule_recurrence_bymonth_chk
    check (
      bymonth is null
      or bymonth <@ array[1,2,3,4,5,6,7,8,9,10,11,12]::int[]
    );
