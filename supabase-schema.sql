-- Harrogate Raiders shared tracker
-- This database allows public reads and only the configured admin email to write.
create table if not exists public.tracker_state (
  id text primary key check (id = 'main'),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.tracker_state enable row level security;
revoke all on public.tracker_state from anon, authenticated;
grant select on public.tracker_state to anon, authenticated;
grant insert, update on public.tracker_state to authenticated;

drop policy if exists "Anyone can read tracker data" on public.tracker_state;
create policy "Anyone can read tracker data"
  on public.tracker_state for select to anon, authenticated
  using (id = 'main');

drop policy if exists "Only admin can initialize tracker data" on public.tracker_state;
create policy "Only admin can initialize tracker data"
  on public.tracker_state for insert to authenticated
  with check (
    id = 'main'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = lower('rossetherington25@gmail.com')
  );

drop policy if exists "Only admin can update tracker data" on public.tracker_state;
create policy "Only admin can update tracker data"
  on public.tracker_state for update to authenticated
  using (
    id = 'main'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = lower('rossetherington25@gmail.com')
  )
  with check (
    id = 'main'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = lower('rossetherington25@gmail.com')
  );

-- No DELETE grant or policy is provided. Keep public sign-ups disabled in Auth settings.
