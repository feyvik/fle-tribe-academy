-- FLE TRIBE update 2: 5-month (20-week) main course + optional bonus courses, students edit their own profile,
-- add links to their answers, and certificates require the completed main course.
-- Run in Supabase → SQL Editor, after 0001. Safe to run more than once.

-- ── Course structure: 20-week main course (w0–w19) + 4 optional bonus courses ─
-- Must match PHASES in src/data/curriculum.ts. Bonus courses open after the main course and don't count towards it.

alter table public.course_lessons add column if not exists track text not null default 'main';

-- One-time move from the original 13-week layout: only weeks 0–2 kept their content, so media and any answers
-- for every other lesson are cleared (re-add media under Admin → Lesson media).
do $$
begin
  if not exists (select 1 from public.course_lessons where lesson_key = 'w19-mon') then
    delete from public.lesson_media where lesson_key !~ '^(w0|w1|w2)-';
    delete from public.submissions where lesson_key !~ '^(w0|w1|w2)-';
    delete from public.course_lessons where lesson_key !~ '^w[0-9]+-';
  end if;
end $$;

insert into public.course_lessons (position, lesson_key, track)
select (w.i - 1) * 6 + (d.j - 1), w.week || '-' || d.day, case when w.i > 20 then 'bonus' else 'main' end
from unnest(array['w0','w1','w2','w3','w4','w5','w6','w7','w8','w9','w10','w11','w12','w13','w14','w15','w16','w17','w18','w19',
                  'ts','tw','ship','ai']) with ordinality as w(week, i)
cross join unnest(array['mon','tue','wed','thu','fri','sat']) with ordinality as d(day, j)
on conflict (lesson_key) do update set position = excluded.position, track = excluded.track;

-- Main course: a day opens when every earlier main day is submitted.
-- Bonus course: opens once the whole main course is submitted; its days open in order.
create or replace function public.lesson_unlocked(p_user uuid, p_key text) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare
  l public.course_lessons;
  main_left boolean;
begin
  select * into l from course_lessons where lesson_key = p_key;
  if not found then return false; end if;
  if l.track = 'main' then
    return l.position <= coalesce((select min(c.position) from course_lessons c
      where c.track = 'main' and not exists (select 1 from submissions s where s.user_id = p_user and s.lesson_key = c.lesson_key)), 1000000);
  end if;
  main_left := exists (select 1 from course_lessons c where c.track = 'main'
      and not exists (select 1 from submissions s where s.user_id = p_user and s.lesson_key = c.lesson_key));
  if main_left then return false; end if;
  return l.position <= coalesce((select min(c.position) from course_lessons c
      where split_part(c.lesson_key, '-', 1) = split_part(p_key, '-', 1)
        and not exists (select 1 from submissions s where s.user_id = p_user and s.lesson_key = c.lesson_key)), 1000000);
end $$;

-- Student list for admins: progress counts the main course only.
drop function if exists public.admin_students();
create function public.admin_students()
returns table (id uuid, email text, full_name text, must_change_password boolean, created_at timestamptz,
               completed bigint, last_submitted_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
    select p.id, p.email, p.full_name, p.must_change_password, p.created_at,
           count(s.id) filter (where c.track = 'main'), max(s.submitted_at)
    from public.profiles p
    left join public.submissions s on s.user_id = p.id
    left join public.course_lessons c on c.lesson_key = s.lesson_key
    where p.role = 'student'
    group by p.id order by p.created_at desc;
end $$;

-- ── Links on submissions ─────────────────────────────────────────────────────
-- Up to 5 extra links per answer (GitHub, CodePen, articles…), each an http(s) URL.

alter table public.submissions add column if not exists links text[] not null default '{}';

create or replace function public.links_ok(l text[]) returns boolean
language sql immutable as $$
  select cardinality(l) <= 5 and coalesce(bool_and(x ~* '^https?://\S+$' and char_length(x) <= 500), true) from unnest(l) x;
$$;

alter table public.submissions drop constraint if exists links_valid;
alter table public.submissions add constraint links_valid check (public.links_ok(links));

grant update (answers, link, links, submitted_at, feedback, reviewed_at) on public.submissions to authenticated;

-- ── Students edit their own profile ──────────────────────────────────────────
-- Only the name (as printed on the certificate) can be changed, and not after a certificate is issued.
-- Role and email can't be changed this way.

create or replace function public.update_my_profile(p_full_name text)
returns public.profiles
language plpgsql security definer set search_path = public as $$
declare
  clean text := regexp_replace(trim(coalesce(p_full_name, '')), '\s+', ' ', 'g');
  result public.profiles;
begin
  if auth.uid() is null then raise exception 'Please sign in.'; end if;
  if char_length(clean) < 2 or char_length(clean) > 80 then
    raise exception 'Enter your full name (2 to 80 characters).';
  end if;
  if exists (select 1 from public.certificates where user_id = auth.uid()) then
    raise exception 'Your certificate has been issued, so your name can no longer be changed. Ask an admin for help.';
  end if;
  update public.profiles set full_name = clean where id = auth.uid() returning * into result;
  return result;
end $$;

-- ── Course progress helper ───────────────────────────────────────────────────

create or replace function public.lessons_completed(p_user uuid) returns int
language sql stable security definer set search_path = public as $$
  select count(*)::int from public.submissions s
  join public.course_lessons c on c.lesson_key = s.lesson_key
  where s.user_id = p_user and c.track = 'main';
$$;

-- ── Certificates only for students who completed every lesson ───────────────

create or replace function public.issue_certificate(p_user uuid, p_date date default current_date)
returns public.certificates
language plpgsql security definer set search_path = public as $$
declare
  prefix text := 'FTL' || to_char(p_date, 'YY') || 'FE-';
  next_n int;
  total int;
  done int;
  student public.profiles;
  result public.certificates;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  select * into student from public.profiles where id = p_user and role = 'student';
  if not found then raise exception 'Choose a student.'; end if;

  select count(*) into total from public.course_lessons where track = 'main';
  done := public.lessons_completed(p_user);
  if done < total then
    raise exception '% has completed % of % days. A certificate can only be issued once the main course is complete.',
      student.full_name, done, total;
  end if;
  if exists (select 1 from public.certificates where user_id = p_user) then
    raise exception '% already has a certificate.', student.full_name;
  end if;

  perform pg_advisory_xact_lock(hashtext(prefix));
  select coalesce(max(substring(number from length(prefix) + 1)::int), 0) + 1 into next_n
    from public.certificates where number like prefix || '%';
  insert into public.certificates (number, user_id, full_name, issued_on)
    values (prefix || lpad(next_n::text, 3, '0'), student.id, student.full_name, p_date)
    returning * into result;
  return result;
end $$;

-- Certificates can only be created through issue_certificate (no direct inserts).
revoke insert on public.certificates from authenticated, anon;

-- Make the new columns and functions available to the app straight away.
notify pgrst, 'reload schema';
