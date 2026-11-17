/**
 * Runs every migration on a throwaway Postgres (PGlite) with a small stand-in for Supabase's auth and storage,
 * then checks the security rules students and the public rely on. Nothing touches the live database.
 */
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

const dir = new URL('../migrations/', import.meta.url);
const migrations = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
const db = new PGlite();
const q = async <T = Record<string, unknown>>(sql: string, params: unknown[] = []) => (await db.query<T>(sql, params)).rows;
const as = async (role: 'anon' | 'authenticated', uid?: string) => {
  await db.exec(`reset role; set test.uid = '${uid ?? ''}'; set role ${role};`);
};
const asOwner = () => db.exec(`reset role; set test.uid = '';`);
let admin = '', student = '';

/** True when the current role can't see any rows: either refused outright or filtered out by row level security. */
const hidden = (sql: string) => q(sql).then((rows) => rows.length === 0, () => true);

beforeAll(async () => {
  await db.exec(`
    create role anon; create role authenticated; create role service_role;
    create schema auth; create schema storage;
    grant usage on schema public to anon, authenticated;
    create table auth.users (id uuid primary key default gen_random_uuid(), email text, encrypted_password text,
      raw_user_meta_data jsonb default '{}', raw_app_meta_data jsonb default '{}', created_at timestamptz default now());
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
    create function auth.role() returns text language sql stable as $$ select 'authenticated'::text $$;
    create table storage.buckets (id text primary key, name text, public boolean default false, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text, owner uuid);
    alter table storage.objects enable row level security;
    create function storage.foldername(text) returns text[] language sql as $$ select string_to_array($1, '/') $$;`);
  // Every migration must be safe to run twice.
  for (const round of [1, 2]) for (const m of migrations) await db.exec(readFileSync(new URL(m, dir), 'utf8')).catch((e) => {
    throw new Error(`${m} (run ${round}): ${e.message}`);
  });
  // Supabase grants table access to its API roles; row level security decides the rest.
  await db.exec('grant select, insert, update, delete on all tables in schema public to authenticated; grant select on all tables in schema public to anon;');
  const add = async (email: string) => (await q<{ id: string }>(`insert into auth.users (email, encrypted_password) values ($1, 'temp-hash') returning id`, [email]))[0].id;
  admin = await add('admin@test.local');
  student = await add('student@test.local');
  await q(`update public.profiles set role = 'admin', must_change_password = false where id = $1`, [admin]);
}, 60_000);

describe('database security', () => {
  it('applies every migration twice without errors', () => {
    expect(migrations.length).toBeGreaterThanOrEqual(5);
  });

  it('only lets a student submit the next unlocked day', async () => {
    await as('authenticated', student);
    await q(`insert into public.submissions (lesson_key, answers) values ('w0-mon', array['a real sentence here'])`);
    await expect(q(`insert into public.submissions (lesson_key, answers) values ('w5-mon', array['a real sentence here'])`)).rejects.toThrow();
    await asOwner();
  });

  it("doesn't let a student review their own work", async () => {
    await as('authenticated', student);
    // Refused outright ("new row violates row-level security policy").
    await expect(q(`update public.submissions set feedback = 'great', reviewed_at = now() where lesson_key = 'w0-mon'`)).rejects.toThrow();
    await asOwner();
    const [row] = await q<{ reviewed_at: string | null }>(`select reviewed_at from public.submissions where lesson_key = 'w0-mon'`);
    expect(row.reviewed_at).toBeNull();
  });

  it('keeps the "change your password" flag until the temporary password really changes', async () => {
    await as('authenticated', student);
    await q('select public.password_changed()');
    await asOwner();
    expect((await q<{ must_change_password: boolean }>('select must_change_password from public.profiles where id = $1', [student]))[0].must_change_password).toBe(true);
    await q(`update auth.users set encrypted_password = 'new-hash' where id = $1`, [student]);
    await as('authenticated', student);
    await q('select public.password_changed()');
    await asOwner();
    expect((await q<{ must_change_password: boolean }>('select must_change_password from public.profiles where id = $1', [student]))[0].must_change_password).toBe(false);
  });

  it('never reuses a certificate number after a revoke', async () => {
    const a = (await q<{ number: string }>(`select number from public.create_certificate($1, '2026-12-01')`, [student]))[0].number;
    await q('delete from public.certificates where number = $1', [a]);
    const other = (await q<{ id: string }>(`insert into auth.users (email, encrypted_password) values ('second@test.local', 'h') returning id`))[0].id;
    const b = (await q<{ number: string }>(`select number from public.create_certificate($1, '2026-12-01')`, [other]))[0].number;
    expect(b).not.toBe(a);
  });

  it('lets anyone verify a certificate, but hides student records and internal tables', async () => {
    const rec = (await q<{ id: string }>(`insert into public.student_records (full_name, program, email) values ('Rec Ord', 'Data Analysis', 'r@test.local') returning id`))[0].id;
    await q(`insert into public.certificates (number, full_name, issued_on, program, duration, record_id) values ('FT25DA-900', 'Rec Ord', '2025-07-30', 'Data Analysis Program', '4 month', $1)`, [rec]);
    await as('anon');
    expect((await q<{ program: string }>(`select program from public.verify_certificate('ft25da-900')`))[0].program).toBe('Data Analysis Program');
    expect(await q('select * from public.student_records')).toHaveLength(0);
    await as('authenticated', student);
    expect(await q('select * from public.student_records')).toHaveLength(0);
    expect(await hidden('select * from public.temporary_passwords')).toBe(true);
    expect(await hidden('select * from public.certificate_counters')).toBe(true);
    await expect(q(`select public.create_certificate($1, '2026-12-01')`, [student])).rejects.toThrow();
    await as('authenticated', admin);
    expect((await q('select * from public.student_records')).length).toBeGreaterThan(0);
    await asOwner();
  });
});
