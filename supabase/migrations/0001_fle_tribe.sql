-- FLE TRIBE learning app: database, security rules and storage.
-- Run in Supabase → SQL Editor. Safe to run more than once, and works if a "profiles" table already exists.
--
-- Rules enforced here (not only in the app):
--   • Students only see their own profile, answers and certificates, and can't change their own role.
--   • A student can only submit a day once every day before it has been submitted (lessons unlock in order).
--   • Lesson videos/PDFs are only readable for lessons the student has unlocked.
--   • Answers can be edited until an admin gives feedback.
--   • Only admins add media, give feedback and issue certificates.

-- ── Profiles ─────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade
);
-- Add whatever columns an existing profiles table is missing.
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists role text;
alter table public.profiles add column if not exists must_change_password boolean not null default true;
alter table public.profiles add column if not exists created_at timestamptz not null default now();

-- An older setup may store role as a custom type or limit it to other values (e.g. 'user'). Make it plain text.
alter table public.profiles alter column role drop default;
do $$
declare c record;
begin
  for c in select conname from pg_constraint where conrelid = 'public.profiles'::regclass and contype = 'c' loop
    execute format('alter table public.profiles drop constraint %I', c.conname);
  end loop;
end $$;
alter table public.profiles alter column role type text using role::text;
alter table public.profiles alter column role set default 'student';
update public.profiles set role = 'student' where role is null or role not in ('admin', 'student');
alter table public.profiles add constraint profiles_role_check check (role in ('admin', 'student'));

-- Remove older sign-up triggers that also write to profiles (they would clash with the one below).
do $$
declare t record;
begin
  for t in
    select tg.tgname from pg_trigger tg join pg_proc p on p.oid = tg.tgfoid
    where tg.tgrelid = 'auth.users'::regclass and not tg.tgisinternal
      and tg.tgname <> 'on_auth_user_created' and p.prosrc ilike '%profiles%'
  loop
    execute format('drop trigger %I on auth.users', t.tgname);
  end loop;
end $$;

-- Remove every older security rule on profiles (an "edit your own profile" rule would let students make themselves admin).
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'profiles' loop
    execute format('drop policy %I on public.profiles', p.policyname);
  end loop;
end $$;

-- Every new auth user gets a student profile. Accounts are only created by admins (sign-up is disabled).
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role, must_change_password)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)), 'student', true)
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name),
        role = case when public.profiles.role = 'admin' then 'admin' else 'student' end;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Called by the app after a student replaces their temporary password.
create or replace function public.password_changed() returns void
language sql security definer set search_path = public as $$
  update public.profiles set must_change_password = false where id = auth.uid();
$$;

-- ── Course order ─────────────────────────────────────────────────────────────
-- Must match PHASES in src/data/curriculum.ts: 14 weeks × Mon–Sat.

create table if not exists public.course_lessons (
  position int primary key,
  lesson_key text not null unique
);

insert into public.course_lessons (position, lesson_key)
select (w.i - 1) * 6 + (d.j - 1), w.week || '-' || d.day
from unnest(array['w0','w1','w2','w3','w4','w5','w6','w7','w8','w9','w10','w11','w12','bonus']) with ordinality as w(week, i)
cross join unnest(array['mon','tue','wed','thu','fri','sat']) with ordinality as d(day, j)
on conflict do nothing;

-- ── Submissions ──────────────────────────────────────────────────────────────

-- Every answer needs a real sentence.
create or replace function public.answers_ok(a text[]) returns boolean
language sql immutable as $$
  select bool_and(char_length(trim(x)) between 10 and 5000) from unnest(a) x;
$$;

create table if not exists public.submissions (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  lesson_key text not null references public.course_lessons (lesson_key),
  answers text[] not null,
  link text,
  submitted_at timestamptz not null default now(),
  feedback text,
  reviewed_at timestamptz,
  unique (user_id, lesson_key),
  constraint answers_count check (cardinality(answers) between 1 and 12),
  constraint answers_length check (public.answers_ok(answers)),
  constraint link_format check (link is null or link ~* '^https?://\S+$')
);

-- Nobody can move an answer to another student or lesson after it is created.
revoke update on public.submissions from authenticated, anon;
grant update (answers, link, submitted_at, feedback, reviewed_at) on public.submissions to authenticated;

-- A day is unlocked when its position is at or before the first day the student hasn't submitted.
create or replace function public.lesson_unlocked(p_user uuid, p_key text) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select position from course_lessons where lesson_key = p_key), 1000000)
      <= coalesce((select min(c.position) from course_lessons c
                   where not exists (select 1 from submissions s where s.user_id = p_user and s.lesson_key = c.lesson_key)),
                  1000000);
$$;

-- ── Lesson media ─────────────────────────────────────────────────────────────
-- kind 'youtube': url is a YouTube link. kind 'video' / 'pdf': url is a path in the lesson-media storage bucket.

create table if not exists public.lesson_media (
  lesson_key text primary key references public.course_lessons (lesson_key),
  kind text not null check (kind in ('youtube', 'video', 'pdf')),
  url text not null,
  title text,
  updated_at timestamptz not null default now()
);

-- ── Certificates ─────────────────────────────────────────────────────────────

create table if not exists public.certificates (
  number text primary key,
  user_id uuid references public.profiles (id) on delete set null,
  full_name text not null,
  issued_on date not null,
  created_at timestamptz not null default now()
);

-- Issue the next number in the FTL<yy>FE-<nnn> series, e.g. FTL26FE-001.
create or replace function public.issue_certificate(p_user uuid, p_date date default current_date)
returns public.certificates
language plpgsql security definer set search_path = public as $$
declare
  prefix text := 'FTL' || to_char(p_date, 'YY') || 'FE-';
  next_n int;
  student public.profiles;
  result public.certificates;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  select * into student from public.profiles where id = p_user and role = 'student';
  if not found then raise exception 'Choose a student.'; end if;
  perform pg_advisory_xact_lock(hashtext(prefix));
  select coalesce(max(substring(number from length(prefix) + 1)::int), 0) + 1 into next_n
    from public.certificates where number like prefix || '%';
  insert into public.certificates (number, user_id, full_name, issued_on)
    values (prefix || lpad(next_n::text, 3, '0'), student.id, student.full_name, p_date)
    returning * into result;
  return result;
end $$;

-- Public verification: anyone with the number can confirm a certificate.
create or replace function public.verify_certificate(p_number text)
returns table (number text, full_name text, issued_on date)
language sql stable security definer set search_path = public as $$
  select c.number, c.full_name, c.issued_on from public.certificates c where upper(c.number) = upper(trim(p_number));
$$;
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- ── Admin: student list with progress ────────────────────────────────────────

drop function if exists public.admin_students();
create function public.admin_students()
returns table (id uuid, email text, full_name text, must_change_password boolean, created_at timestamptz,
               completed bigint, last_submitted_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
    select p.id, p.email, p.full_name, p.must_change_password, p.created_at,
           count(s.id), max(s.submitted_at)
    from public.profiles p left join public.submissions s on s.user_id = p.id
    where p.role = 'student'
    group by p.id order by p.created_at desc;
end $$;

-- ── Row level security ───────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.course_lessons enable row level security;
alter table public.submissions enable row level security;
alter table public.lesson_media enable row level security;
alter table public.certificates enable row level security;

create policy "own profile or admin" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy "admins edit profiles" on public.profiles for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "course order is readable" on public.course_lessons;
create policy "course order is readable" on public.course_lessons for select to authenticated using (true);

drop policy if exists "own submissions or admin" on public.submissions;
create policy "own submissions or admin" on public.submissions for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists "students submit unlocked days" on public.submissions;
create policy "students submit unlocked days" on public.submissions for insert to authenticated
  with check (
    user_id = auth.uid() and feedback is null and reviewed_at is null
    and not public.is_admin()
    and public.lesson_unlocked(auth.uid(), lesson_key)
  );
drop policy if exists "students edit until reviewed" on public.submissions;
create policy "students edit until reviewed" on public.submissions for update to authenticated
  using (user_id = auth.uid() and reviewed_at is null)
  with check (user_id = auth.uid() and feedback is null and reviewed_at is null);
drop policy if exists "admins review" on public.submissions;
create policy "admins review" on public.submissions for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins delete submissions" on public.submissions;
create policy "admins delete submissions" on public.submissions for delete to authenticated
  using (public.is_admin());

drop policy if exists "media for unlocked lessons" on public.lesson_media;
create policy "media for unlocked lessons" on public.lesson_media for select to authenticated
  using (public.is_admin() or public.lesson_unlocked(auth.uid(), lesson_key));
drop policy if exists "admins manage media" on public.lesson_media;
create policy "admins manage media" on public.lesson_media for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "own certificates or admin" on public.certificates;
create policy "own certificates or admin" on public.certificates for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists "admins delete certificates" on public.certificates;
create policy "admins delete certificates" on public.certificates for delete to authenticated
  using (public.is_admin());

-- ── Storage: uploaded videos and PDFs ────────────────────────────────────────
-- Files are stored as "<lesson_key>/<file>", e.g. "w3-tue/a1b2c3.mp4".

insert into storage.buckets (id, name, public, allowed_mime_types)
values ('lesson-media', 'lesson-media', false,
        array['application/pdf', 'video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do nothing;

drop policy if exists "read media for unlocked lessons" on storage.objects;
create policy "read media for unlocked lessons" on storage.objects for select to authenticated
  using (bucket_id = 'lesson-media'
         and (public.is_admin() or public.lesson_unlocked(auth.uid(), split_part(name, '/', 1))));
drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'lesson-media' and public.is_admin());
drop policy if exists "admins replace media" on storage.objects;
create policy "admins replace media" on storage.objects for update to authenticated
  using (bucket_id = 'lesson-media' and public.is_admin());
drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'lesson-media' and public.is_admin());
