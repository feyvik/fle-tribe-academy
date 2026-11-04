// Admin-only account management. Creating users needs the service role key, which must never reach the browser,
// so it lives in this Edge Function. Deploy with:  supabase functions deploy admin-users
//
// POST { action: 'create', fullName, email }  → creates a student with a temporary password
// POST { action: 'reset', userId }            → sets a new temporary password
// POST { action: 'delete', userId }           → removes the student and all their answers
// POST { action: 'send_certificate', userId, resend? } → emails the student's certificate, if they have one and it hasn't gone out
// Secret APP_URL (your live https:// address) is used in the sign-in message.
// Secrets RESEND_API_KEY and EMAIL_FROM turn on emailing the details; without them the admin copies the message instead.

import { createClient } from 'npm:@supabase/supabase-js@2';
import { sendCertificateEmail, sendSignInEmail, SUPPORT_EMAIL } from './email.ts';

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
    `Need help? Write to ${SUPPORT_EMAIL}.`,
    '',
    'FLE TRIBE',
  ].join('\n');
}

/** Builds the sign-in message and tries to email it. The admin always gets the message back in case the email fails. */
async function deliverSignIn(name: string, email: string, password: string, appUrl: string, isReset: boolean) {
  const message = signInMessage(name, email, password, appUrl, isReset);
  const { sent, problem } = await sendSignInEmail({
    apiKey: Deno.env.get('RESEND_API_KEY'),
    from: Deno.env.get('EMAIL_FROM'),
    to: email,
    name,
    password,
    appUrl,
    isReset,
    text: message,
  });
  return { password, message, emailed: sent, emailProblem: problem };
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
    return json({ userId: data.user.id, ...(await deliverSignIn(fullName, email, password, appUrl, false)) }, 201);
  }

  if (body.action === 'send_certificate') {
    const { data: cert, error } = await admin.from('certificates')
      .select('number, full_name, issued_on, emailed_at').eq('user_id', body.userId).maybeSingle();
    if (error) return json({ error: error.message }, 400);
    if (!cert) return json({ issued: false });
    if (cert.emailed_at && !body.resend) return json({ issued: true, number: cert.number, alreadySent: true, emailed: true });

    const { data: student } = await admin.from('profiles').select('email').eq('id', body.userId).single();
    if (!student) return json({ error: 'Student not found.' }, 404);
    const { sent, problem } = await sendCertificateEmail({
      apiKey: Deno.env.get('RESEND_API_KEY'),
      from: Deno.env.get('EMAIL_FROM'),
      to: student.email,
      name: cert.full_name,
      number: cert.number,
      issuedOn: cert.issued_on,
      appUrl,
    });
    if (sent) await admin.from('certificates').update({ emailed_at: new Date().toISOString() }).eq('number', cert.number);
    return json({ issued: true, number: cert.number, emailed: sent, emailProblem: problem });
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
    return json(await deliverSignIn(student.full_name, student.email, password, appUrl, true));
  }

  return json({ error: 'Unknown action.' }, 400);
});
