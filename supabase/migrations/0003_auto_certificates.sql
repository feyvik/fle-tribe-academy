-- FLE TRIBE update 3: a certificate is issued automatically once an admin has reviewed every main-course submission.
-- The app then emails it to the student (see supabase/functions/admin-users). Bonus courses don't count.
-- Run in Supabase → SQL Editor, after 0002. Safe to run more than once.

-- Records when the certificate email went out, so it's sent once and failures can be retried.
alter table public.certificates add column if not exists emailed_at timestamptz;

-- True when every main-course day has a submission with feedback.
create or replace function public.course_reviewed(p_user uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select not exists (
    select 1 from public.course_lessons c
    where c.track = 'main'
      and not exists (
        select 1 from public.submissions s
        where s.user_id = p_user and s.lesson_key = c.lesson_key and s.reviewed_at is not null
      )
  );
$$;

-- Creates the certificate with the next FTL<yy>FE-<nnn> number. Internal: only other database functions may call it.
create or replace function public.create_certificate(p_user uuid, p_date date)
returns public.certificates
language plpgsql security definer set search_path = public as $$
declare
  prefix text := 'FTL' || to_char(p_date, 'YY') || 'FE-';
  next_n int;
  student public.profiles;
  result public.certificates;
begin
  perform pg_advisory_xact_lock(hashtext(prefix));
  select * into result from public.certificates where user_id = p_user limit 1;
  if found then return result; end if;

  select * into student from public.profiles where id = p_user;
  select coalesce(max(substring(number from length(prefix) + 1)::int), 0) + 1 into next_n
    from public.certificates where number like prefix || '%';
  insert into public.certificates (number, user_id, full_name, issued_on)
    values (prefix || lpad(next_n::text, 3, '0'), student.id, student.full_name, p_date)
    returning * into result;
  return result;
end $$;
revoke execute on function public.create_certificate(uuid, date) from public, anon, authenticated;

-- Manual issue, for an admin to catch up (for example after revoking one). Follows the same rule as automatic issuing.
create or replace function public.issue_certificate(p_user uuid, p_date date default current_date)
returns public.certificates
language plpgsql security definer set search_path = public as $$
declare
  student public.profiles;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  select * into student from public.profiles where id = p_user and role = 'student';
  if not found then raise exception 'Choose a student.'; end if;
  if not public.course_reviewed(p_user) then
    raise exception '% still has main-course work without feedback. A certificate can only be issued once every day is reviewed.',
      student.full_name;
  end if;
  if exists (select 1 from public.certificates where user_id = p_user) then
    raise exception '% already has a certificate.', student.full_name;
  end if;
  return public.create_certificate(p_user, p_date);
end $$;

-- Fires when a submission first gets feedback. Only that first review counts, so editing feedback later
-- can't bring back a certificate an admin revoked. A problem here must never stop the feedback from saving.
create or replace function public.issue_certificate_after_review() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.reviewed_at is null or old.reviewed_at is not null then return new; end if;
  begin
    if exists (select 1 from public.profiles where id = new.user_id and role = 'student')
       and public.course_reviewed(new.user_id) then
      perform public.create_certificate(new.user_id, current_date);
    end if;
  exception when others then
    raise warning 'Could not issue a certificate automatically: %', sqlerrm;
  end;
  return new;
end $$;
revoke execute on function public.issue_certificate_after_review() from public, anon, authenticated;

drop trigger if exists issue_certificate_after_review on public.submissions;
create trigger issue_certificate_after_review
  after update of reviewed_at on public.submissions
  for each row execute function public.issue_certificate_after_review();

-- Admin student list: adds how many main-course days have been reviewed.
drop function if exists public.admin_students();
create function public.admin_students()
returns table (id uuid, email text, full_name text, must_change_password boolean, created_at timestamptz,
               completed bigint, last_submitted_at timestamptz, reviewed bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
    select p.id, p.email, p.full_name, p.must_change_password, p.created_at,
           count(s.id), max(s.submitted_at),
           count(s.id) filter (where s.reviewed_at is not null and c.track = 'main')
    from public.profiles p
    left join public.submissions s on s.user_id = p.id
    left join public.course_lessons c on c.lesson_key = s.lesson_key
    where p.role = 'student'
    group by p.id order by p.created_at desc;
end $$;

-- Make the new column and functions available to the app straight away.
notify pgrst, 'reload schema';
