import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** False until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env. */
export const supabaseConfigured = !!url && !!anonKey;

export const supabase = createClient(url ?? 'https://not-configured.supabase.co', anonKey ?? 'not-configured');

export const MEDIA_BUCKET = 'lesson-media';

/** A readable message from a Supabase or Edge Function error. */
export function errorText(err: unknown, fallback = 'Something went wrong. Try again.'): string {
  const e = err as { message?: string; context?: unknown };
  const msg = e?.message ?? '';
  if (/Failed to fetch|NetworkError/i.test(msg)) return 'Can’t reach the server. Check your connection and try again.';
  if (/Invalid login credentials/i.test(msg)) return 'That email and password don’t match. Check them and try again.';
  if (/answers_length/.test(msg)) return 'Answer every question with at least a full sentence (10+ characters).';
  if (/link_format/.test(msg)) return 'The link must start with https:// (for example your GitHub repo).';
  if (/PGRST116|0 rows|multiple \(or no\) rows/i.test(msg)) return 'This work has already been reviewed, so it can no longer be changed.';
  if (/PGRST202|schema cache|column .* does not exist/i.test(msg))
    return 'This feature needs the latest database update. An admin needs to run it in Supabase (see the README).';
  if (/row-level security/i.test(msg)) return 'You can’t do that yet. Finish the lessons before this one first.';
  return msg || fallback;
}

/** Calls the admin-users Edge Function and surfaces its error message. */
export async function adminUsers<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>('admin-users', { body });
  if (error) {
    const ctx = (error as { context?: Response }).context;
    const detail = ctx && typeof ctx.json === 'function' ? await ctx.json().catch(() => null) : null;
    throw new Error(detail?.error ?? error.message);
  }
  return data as T;
}
