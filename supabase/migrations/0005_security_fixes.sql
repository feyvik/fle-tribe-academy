-- FLE TRIBE update 5: security fixes from the November 2026 audit.
--   1. Certificate numbers are never reused, even after a certificate is revoked.
--   2. The "must change password" flag only clears once the temporary password has really been replaced.
-- Run in Supabase → SQL Editor, after 0004. Safe to run more than once.

-- ── 1. Certificate numbers never repeat ──────────────────────────────────────
-- Each series (e.g. FTL26FE-) remembers the last number it gave out. Revoking deletes the certificate but not the count,
-- so a revoked number can't later verify as someone else's certificate.

create table if not exists public.certificate_counters (
  prefix text primary key,
  last_number int not null
);
alter table public.certificate_counters enable row level security;  -- no policies: only database functions use it
revoke all on public.certificate_counters from anon, authenticated;

-- Start each series from the highest number already issued (including certificates added by hand, e.g. FT25DA-004).
insert into public.certificate_counters (prefix, last_number)
select substring(number from '^(.*-)'), max(substring(number from '-(\d+)$')::int)
from public.certificates
where number ~ '-\d+$'
group by 1
on conflict (prefix) do update set last_number = greatest(public.certificate_counters.last_number, excluded.last_number);

create or replace function public.create_certificate(p_user uuid, p_date date)
returns public.certificates
language plpgsql security definer set search_path = public as $$
declare
  prefix text := 'FTL' || to_char(p_date, 'YY') || 'FE-';
  next_n int;
  student public.profiles;
  result public.certificates;
begin
  perform pg_advisory_xact_lock(hashtext('certificate:' || p_user::text));
  select * into result from public.certificates where user_id = p_user limit 1;
  if found then return result; end if;

  select * into student from public.profiles where id = p_user;
  insert into public.certificate_counters (prefix, last_number) values (prefix, 1)
  on conflict on constraint certificate_counters_pkey
    do update set last_number = public.certificate_counters.last_number + 1
  returning last_number into next_n;
  insert into public.certificates (number, user_id, full_name, issued_on)
    values (prefix || lpad(next_n::text, 3, '0'), student.id, student.full_name, p_date)
    returning * into result;
  return result;
end $$;
revoke execute on function public.create_certificate(uuid, date) from public, anon, authenticated;

-- ── 2. Temporary passwords must really be changed ────────────────────────────
-- When an account is created we remember its temporary password's hash (never the password itself), in a table
-- nobody can read through the app. password_changed() only clears the flag once the stored password is different.

create table if not exists public.temporary_passwords (
  user_id uuid primary key references auth.users (id) on delete cascade,
  password_hash text not null
);
alter table public.temporary_passwords enable row level security;  -- no policies: invisible to the app
revoke all on public.temporary_passwords from anon, authenticated;

create or replace function public.remember_temporary_password() returns trigger
language plpgsql security definer set search_path = public, auth as $$
begin
  if new.encrypted_password is not null and new.encrypted_password <> '' then
    insert into public.temporary_passwords (user_id, password_hash) values (new.id, new.encrypted_password)
    on conflict (user_id) do update set password_hash = excluded.password_hash;
  end if;
  return new;
end $$;
revoke execute on function public.remember_temporary_password() from public, anon, authenticated;

drop trigger if exists remember_temporary_password on auth.users;
create trigger remember_temporary_password after insert on auth.users
  for each row execute function public.remember_temporary_password();

-- Students who haven't changed their temporary password yet: remember it now.
insert into public.temporary_passwords (user_id, password_hash)
select u.id, u.encrypted_password
from auth.users u join public.profiles p on p.id = u.id
where p.must_change_password and u.encrypted_password is not null and u.encrypted_password <> ''
on conflict (user_id) do nothing;

create or replace function public.password_changed() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  -- Still the temporary password? Then nothing changes and the student is asked again.
  if exists (
    select 1 from public.temporary_passwords t join auth.users u on u.id = t.user_id
    where t.user_id = auth.uid() and t.password_hash = u.encrypted_password
  ) then
    return;
  end if;
  update public.profiles set must_change_password = false where id = auth.uid();
  delete from public.temporary_passwords where user_id = auth.uid();
end $$;

-- Make the changes available to the app straight away.
notify pgrst, 'reload schema';
