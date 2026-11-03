// Admin-only account management. Creating users needs the service role key, which must never reach the browser,
// so it lives in this Edge Function. Deploy with:  supabase functions deploy admin-users
//
// POST { action: 'create', fullName, email }  → creates a student with a temporary password
// POST { action: 'reset', userId }            → sets a new temporary password
// POST { action: 'delete', userId }           → removes the student and all their answers
// Optional secret APP_URL (supabase secrets set APP_URL=https://…) is used in the sign-in message.

import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

/** Readable temporary password, e.g. "Kite-4827-Rain". */
function tempPassword() {
  const words = ['Kite', 'Rain', 'Lime', 'Wave', 'Star', 'Moon', 'Leaf', 'Bolt', 'Pine', 'Reef', 'Mint', 'Dune', 'Flame', 'Cloud', 'River', 'Stone'];
  const r = crypto.getRandomValues(new Uint32Array(3));
  return `${words[r[0] % words.length]}-${1000 + (r[1] % 9000)}-${words[r[2] % words.length]}`;
}

function signInMessage(name: string, email: string, password: string, appUrl: string, isReset: boolean) {
  return [
    `Hi ${name},`,
    '',
    isReset
      ? 'Your FLE TRIBE password has been reset. Here are your new sign-in details:'
      : 'Welcome to the FLE TRIBE Frontend Developer Program. Here are your sign-in details:',
    '',
    `Sign in at: ${appUrl}/login`,
    `Email: ${email}`,
    `Temporary password: ${password}`,
    '',
    "You'll be asked to choose your own password the first time you sign in.",
    '',
    'FLE TRIBE',
  ].join('\n');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Use POST.' }, 405);

  const url = Deno.env.get('SUPABASE_URL')!;
  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  // Who is calling? Must be a signed-in admin.
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const { data: caller } = await admin.auth.getUser(token);
  if (!caller?.user) return json({ error: 'Please sign in.' }, 401);
  const { data: me } = await admin.from('profiles').select('role').eq('id', caller.user.id).single();
  if (me?.role !== 'admin') return json({ error: 'Admins only.' }, 403);

  const body = await req.json().catch(() => ({}));
  const appUrl = (Deno.env.get('APP_URL') ?? req.headers.get('origin') ?? '').replace(/\/$/, '');

  if (body.action === 'create') {
    const fullName = String(body.fullName ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    if (fullName.length < 2) return json({ error: 'Enter the student’s full name.' }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Enter a valid email address.' }, 400);

    const password = tempPassword();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (error) {
      const taken = /already|registered|exists/i.test(error.message);
      return json({ error: taken ? 'There is already an account with that email.' : error.message }, taken ? 409 : 400);
    }
    return json({ userId: data.user.id, password, message: signInMessage(fullName, email, password, appUrl, false) }, 201);
  }

  if (body.action === 'reset' || body.action === 'delete') {
    const { data: student } = await admin.from('profiles').select('*').eq('id', body.userId).eq('role', 'student').single();
    if (!student) return json({ error: 'Student not found.' }, 404);

    if (body.action === 'delete') {
      const { error } = await admin.auth.admin.deleteUser(student.id);
      return error ? json({ error: error.message }, 400) : json({ ok: true });
    }

    const password = tempPassword();
    const { error } = await admin.auth.admin.updateUserById(student.id, { password });
    if (error) return json({ error: error.message }, 400);
    await admin.from('profiles').update({ must_change_password: true }).eq('id', student.id);
    return json({ password, message: signInMessage(student.full_name, student.email, password, appUrl, true) });
  }

  return json({ error: 'Unknown action.' }, 400);
});
