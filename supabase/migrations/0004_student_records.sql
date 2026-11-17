-- FLE TRIBE update 4: records of students on other programs (Data Analysis, UI/UX, Graphic Design, …) and their certificates.
-- These students have no login to the learning app; admins see them under Admin → Students, and anyone can verify their
-- certificate numbers at /verify. Certificates can also say which program, length and partner they were for.
-- Run in Supabase → SQL Editor, after 0003. Safe to run more than once. Student details are added separately, not here,
-- so personal information never goes into the code repository.

create table if not exists public.student_records (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  program text not null,
  joined_at timestamptz,
  heard_from text,
  reason text,
  headshot_url text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.student_records enable row level security;
drop policy if exists "admins manage student records" on public.student_records;
create policy "admins manage student records" on public.student_records for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Certificates from other programs: what they were for, and which record they belong to.
-- Empty program/duration means the learning app's own Frontend Developer Program.
alter table public.certificates add column if not exists program text;
alter table public.certificates add column if not exists duration text;
alter table public.certificates add column if not exists partner text;
alter table public.certificates add column if not exists record_id uuid references public.student_records (id) on delete set null;

-- Public verification now also returns the program, length and partner, so the certificate shows exactly as issued.
drop function if exists public.verify_certificate(text);
create function public.verify_certificate(p_number text)
returns table (number text, full_name text, issued_on date, program text, duration text, partner text)
language sql stable security definer set search_path = public as $$
  select c.number, c.full_name, c.issued_on, c.program, c.duration, c.partner
  from public.certificates c where upper(c.number) = upper(trim(p_number));
$$;
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- Make the new table, columns and function available to the app straight away.
notify pgrst, 'reload schema';
