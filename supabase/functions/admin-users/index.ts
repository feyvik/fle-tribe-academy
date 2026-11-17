// Account management and emails. Everything is admin-only except password_changed. Creating users needs the service role key, which must never reach the browser,
// so it lives in this Edge Function. Deploy with:  supabase functions deploy admin-users
//
// POST { action: 'create', fullName, email }  → creates a student with a temporary password
// POST { action: 'delete', userId }           → removes the student and all their answers
// POST { action: 'password_changed' }         → any signed-in person: confirms their own password change by email
// POST { action: 'send_certificate', number | userId, resend? } → emails the student's certificate, if they have one and it hasn't gone out
// Secret APP_URL (your live https:// address) is used in the sign-in message.
// Secrets RESEND_API_KEY and EMAIL_FROM turn on emailing the details; without them the admin copies the message instead.

import { createClient } from 'npm:@supabase/supabase-js@2';
import { sendCertificateEmail, sendPasswordChangedEmail, sendSignInEmail, SUPPORT_EMAIL } from './email.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

/**
 * Readable temporary password, e.g. "Kite-4827-Rain-Ember": 3 words from 64 and 4 digits, about 2.4 billion possibilities
 * (the old 2-word version had about 2.3 million). It only lasts until the first sign-in, when the student must replace it.
 */
const WORDS = [
  'Kite', 'Rain', 'Lime', 'Wave', 'Star', 'Moon', 'Leaf', 'Bolt', 'Pine', 'Reef', 'Mint', 'Dune', 'Flame', 'Cloud', 'River', 'Stone',
  'Ember', 'Frost', 'Maple', 'Cedar', 'Coral', 'Pearl', 'Amber', 'Delta', 'Comet', 'Orbit', 'Prism', 'Pixel', 'Rocket', 'Harbor', 'Meadow', 'Canyon',
  'Falcon', 'Otter', 'Tiger', 'Panda', 'Raven', 'Heron', 'Lotus', 'Mango', 'Olive', 'Cocoa', 'Velvet', 'Marble', 'Silver', 'Copper', 'Indigo', 'Violet',
  'Summit', 'Island', 'Forest', 'Desert', 'Glacier', 'Lagoon', 'Breeze', 'Thunder', 'Sunrise', 'Galaxy', 'Nectar', 'Quartz', 'Willow', 'Zephyr', 'Atlas', 'Beacon',
];
function tempPassword() {
  const r = crypto.getRandomValues(new Uint32Array(4));
  const word = (n: number) => WORDS[n % WORDS.length];
  return `${word(r[0])}-${1000 + (r[1] % 9000)}-${word(r[2])}-${word(r[3])}`;
}

function signInMessage(name: string, email: string, password: string, appUrl: string) {
  return [
    `Hi ${name},`,
    '',
    'Welcome to the FLE TRIBE Frontend Developer Program. Here are your sign-in details:',
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
async function deliverSignIn(name: string, email: string, password: string, appUrl: string) {
  const message = signInMessage(name, email, password, appUrl);
  const { sent, problem } = await sendSignInEmail({
    apiKey: Deno.env.get('RESEND_API_KEY'),
    from: Deno.env.get('EMAIL_FROM'),
    to: email,
    name,
    password,
    appUrl,
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
  const body = await req.json().catch(() => ({}));
  const appUrl = (Deno.env.get('APP_URL') ?? req.headers.get('origin') ?? '').replace(/\/$/, '');
  const { data: me } = await admin.from('profiles').select('role, full_name, email').eq('id', caller.user.id).single();

  // Always goes to the signed-in person's own address, so it can't be used to email anyone else.
  if (body.action === 'password_changed') {
    if (!me) return json({ error: 'Profile not found.' }, 404);
    const { sent, problem } = await sendPasswordChangedEmail({
      apiKey: Deno.env.get('RESEND_API_KEY'),
      from: Deno.env.get('EMAIL_FROM'),
      to: me.email,
      name: me.full_name,
      appUrl,
    });
    return json({ emailed: sent, emailProblem: problem });
  }

  if (me?.role !== 'admin') return json({ error: 'Admins only.' }, 403);

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
    return json({ userId: data.user.id, ...(await deliverSignIn(fullName, email, password, appUrl)) }, 201);
  }

  if (body.action === 'send_certificate') {
    if (!body.number && !body.userId) return json({ error: 'Choose a certificate to send.' }, 400);
    // By certificate number (any certificate, including other programs'), or by app student (after their last review).
    const fields = 'number, full_name, issued_on, emailed_at, program, duration, user_id, record_id';
    const { data: cert, error } = body.number
      ? await admin.from('certificates').select(fields).eq('number', String(body.number)).maybeSingle()
      : await admin.from('certificates').select(fields).eq('user_id', body.userId).maybeSingle();
    if (error) return json({ error: error.message }, 400);
    if (!cert) return json({ issued: false });
    if (cert.emailed_at && !body.resend) return json({ issued: true, number: cert.number, alreadySent: true, emailed: true });

    // App students' email is on their profile; other programs' is on their student record (from the sign-up form).
    const { data: owner } = cert.user_id
      ? await admin.from('profiles').select('email').eq('id', cert.user_id).maybeSingle()
      : cert.record_id
        ? await admin.from('student_records').select('email').eq('id', cert.record_id).maybeSingle()
        : { data: null };
    if (!owner?.email) {
      return json({ issued: true, number: cert.number, emailed: false, emailProblem: 'There’s no email address on record for this student.' });
    }
    const { sent, problem } = await sendCertificateEmail({
      apiKey: Deno.env.get('RESEND_API_KEY'),
      from: Deno.env.get('EMAIL_FROM'),
      to: owner.email,
      name: cert.full_name,
      number: cert.number,
      issuedOn: cert.issued_on,
      program: cert.program,
      appUrl,
    });
    if (sent) await admin.from('certificates').update({ emailed_at: new Date().toISOString() }).eq('number', cert.number);
    return json({ issued: true, number: cert.number, emailed: sent, emailProblem: problem });
  }

  if (body.action === 'delete') {
    const { data: student } = await admin.from('profiles').select('id').eq('id', body.userId).eq('role', 'student').single();
    if (!student) return json({ error: 'Student not found.' }, 404);
    const { error } = await admin.auth.admin.deleteUser(student.id);
    return error ? json({ error: error.message }, 400) : json({ ok: true });
  }

  return json({ error: 'Unknown action.' }, 400);
});
