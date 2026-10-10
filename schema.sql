-- Dokkho Haat initial schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.workers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  category text not null,
  phone text not null check (char_length(phone) between 8 and 20),
  district text not null,
  thana text not null,
  area text,
  bio text check (bio is null or char_length(bio) <= 1000),
  experience_years int not null default 0 check (experience_years between 0 and 60),
  photo_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workers_status_idx on public.workers(status);
create index if not exists workers_category_idx on public.workers(category);
create index if not exists workers_location_idx on public.workers(district, thana);

create or replace function public.is_admin()
returns boolean language sql stable security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

-- Automatically create a non-admin profile when a new Auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql
as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists workers_touch_updated_at on public.workers;
create trigger workers_touch_updated_at before update on public.workers
for each row execute procedure public.touch_updated_at();

-- A worker can never self-approve or self-reject by changing status.
create or replace function public.protect_worker_status()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.status := 'pending';
    new.user_id := old.user_id;
  end if;
  return new;
end;
$$;
drop trigger if exists workers_protect_status on public.workers;
create trigger workers_protect_status before update on public.workers
for each row execute procedure public.protect_worker_status();

alter table public.profiles enable row level security;
alter table public.workers enable row level security;

drop policy if exists "profile read own or admin" on public.profiles;
create policy "profile read own or admin" on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles cannot be edited by users" on public.profiles;
-- No user INSERT/UPDATE policy: roles are managed only through trusted SQL/admin processes.

drop policy if exists "public can read approved workers" on public.workers;
create policy "public can read approved workers" on public.workers for select to anon, authenticated
using (status = 'approved' or user_id = auth.uid() or public.is_admin());

drop policy if exists "authenticated can create own worker profile" on public.workers;
create policy "authenticated can create own worker profile" on public.workers for insert to authenticated
with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "owner or admin can update worker profile" on public.workers;
create policy "owner or admin can update worker profile" on public.workers for update to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "admin can delete worker profile" on public.workers;
create policy "admin can delete worker profile" on public.workers for delete to authenticated
using (public.is_admin());

-- After your first account signs up, make that account an admin by running this
-- separately in SQL Editor with your own exact login email:
-- update public.profiles set role = 'admin' where email = 'YOUR_EMAIL@example.com';
-- Never expose the service_role key in frontend code.
