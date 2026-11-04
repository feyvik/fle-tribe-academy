// Sends a student's sign-in details through Resend (https://resend.com/docs/api-reference/emails/send-email).
// A failed email must never undo the account: callers get { sent: false, problem } and the admin copies the message instead.

/** Where students' replies and questions go. Change it here to use another inbox. */
export const SUPPORT_EMAIL = 'thefletribe@gmail.com';
const WEBSITE = 'fletribe.org';

export interface SignInEmail {
  apiKey?: string;
  /** e.g. FLE TRIBE <hello@fletribe.org>. The domain must be verified in Resend. */
  from?: string;
  to: string;
  name: string;
  password: string;
  appUrl: string;
  /** Plain-text version: the same message the admin can copy. */
  text: string;
}

export interface EmailResult {
  sent: boolean;
  /** Why it wasn't sent, written for the admin. */
  problem?: string;
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const INK = '#2a292c';
const MUTED = '#5f5e63';
const BRAND = '#3f09c9';
const LIME = '#b6ff00';
const LINE = '#e8e6ee';
const FONT = "'Plus Jakarta Sans',Arial,Helvetica,sans-serif";

const heading = (text: string) =>
  `<p style="margin:28px 0 12px;font-size:16px;font-weight:700;color:${INK}">${text}</p>`;

/** A numbered row in the getting-started list. Uses tables because many email apps ignore modern CSS layout. */
const step = (n: number, text: string) => `
  <tr>
    <td width="36" valign="top" style="padding:0 0 12px">
      <div style="width:26px;height:26px;line-height:26px;border-radius:13px;background:#f1edfc;color:${BRAND};font-size:13px;font-weight:700;text-align:center">${n}</div>
    </td>
    <td valign="top" style="padding:3px 0 12px;font-size:15px;line-height:1.5;color:${INK}">${text}</td>
  </tr>`;

const detail = (label: string, value: string, mono = false) => `
  <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${MUTED}">${label}</p>
  <p style="margin:0;font-size:${mono ? 18 : 15}px;font-weight:700;color:${INK};word-break:break-all;${mono ? "font-family:Menlo,Consolas,'Courier New',monospace;" : ''}">${escape(value)}</p>`;

export function signInHtml({ to, name, password, appUrl }: SignInEmail) {
  return emailPage({
    to,
    title: 'Welcome to FLE TRIBE',
    preview: 'Your account is ready. Here’s how to sign in and start learning.',
    appUrl,
    reason: 'an admin created a FLE TRIBE account for',
    privacyNote: 'Keep this password private and don’t share it with anyone.',
    body: `
          <p style="margin:0 0 12px;font-size:15px;line-height:1.6">Hi ${escape(name)},</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6">Your place on the FLE TRIBE <b>Frontend Developer Program</b> is ready. Over the next 5 months, you’ll go from “what is a browser?” to shipping your own React app.</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6fb;border-radius:12px;border:1px solid ${LINE}">
            <tr><td style="padding:18px 20px 8px">${detail('Email', to)}</td></tr>
            <tr><td style="padding:10px 20px 18px">${detail('Temporary password', password, true)}</td></tr>
          </table>

          ${button('Sign in to FLE TRIBE', `${appUrl}/login`)}

          ${heading('Getting started')}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${step(1, 'Sign in with the details above.')}
            ${step(2, 'Choose your own password. You’ll be asked to do this straight away.')}
            ${step(3, 'Start Week 00: <b>Tech, careers &amp; what frontend is</b>.')}
          </table>
          ${heading('Your weekly rhythm')}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.45;color:${INK}">
            <tr><td width="130" valign="top" style="padding:8px 8px 8px 0;border-top:1px solid ${LINE};font-weight:700">Mon – Thu</td><td valign="top" style="padding:8px 0;border-top:1px solid ${LINE}">Guided lessons and research</td></tr>
            <tr><td width="130" valign="top" style="padding:8px 8px 8px 0;border-top:1px solid ${LINE};font-weight:700">Friday</td><td valign="top" style="padding:8px 0;border-top:1px solid ${LINE}">Project work</td></tr>
            <tr><td width="130" valign="top" style="padding:8px 8px 8px 0;border-top:1px solid ${LINE};font-weight:700">Saturday</td><td valign="top" style="padding:8px 0;border-top:1px solid ${LINE}">Live review and feedback</td></tr>
          </table>`,
  });
}

export interface PasswordChangedEmail {
  apiKey?: string;
  from?: string;
  to: string;
  name: string;
  appUrl: string;
}

export function passwordChangedText({ name, appUrl }: PasswordChangedEmail) {
  return [
    `Hi ${name},`,
    '',
    'Your FLE TRIBE password was changed successfully. You can now sign in with your new password.',
    '',
    `Sign in at: ${appUrl}/login`,
    '',
    `Didn't change it? Contact us straight away at ${SUPPORT_EMAIL}.`,
    '',
    'FLE TRIBE',
  ].join('\n');
}

export function passwordChangedHtml(e: PasswordChangedEmail) {
  return emailPage({
    to: e.to,
    title: 'Your password was changed',
    preview: 'Your FLE TRIBE password was changed successfully.',
    appUrl: e.appUrl,
    reason: 'the password was changed on the FLE TRIBE account for',
    body: `
          <p style="margin:0 0 12px;font-size:15px;line-height:1.6">Hi ${escape(e.name)},</p>
          <p style="margin:0;font-size:15px;line-height:1.6">Your FLE TRIBE password was changed successfully. You can now sign in with your new password.</p>

          ${button('Go to FLE TRIBE', `${e.appUrl}/login`)}

          <p style="margin:24px 0 0;font-size:15px;line-height:1.6"><b>Didn’t change it?</b> Contact us straight away using the address below.</p>`,
  });
}

/** The parts every FLE TRIBE email shares: logo header, help line and footer. */
function emailPage(page: { to: string; title: string; preview: string; appUrl: string; body: string; reason: string; privacyNote?: string }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${page.title}</title>
</head>
<body style="margin:0;padding:0;background:#f7f6fb;font-family:${FONT};color:${INK}">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${page.preview}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6fb">
    <tr><td align="center" style="padding:24px 12px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${LINE}">
        <tr><td style="background:${BRAND};padding:24px 28px">
          <img src="${escape(page.appUrl)}/brand/logo-white.png" width="122" height="44" alt="FLE TRIBE" style="display:block;border:0;font-size:22px;font-weight:800;color:#ffffff">
        </td></tr>
        <tr><td style="padding:32px 28px">
          <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;font-weight:800;color:${INK}">${page.title}</h1>
          ${page.body}

          <p style="margin:28px 0 0;padding-top:20px;border-top:1px solid ${LINE};font-size:14px;line-height:1.6;color:${MUTED}">
            ${page.privacyNote ? `${page.privacyNote}<br>` : ''}Need help? Reply to this email or write to <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND}">${SUPPORT_EMAIL}</a>.
          </p>
        </td></tr>
        <tr><td align="center" style="background:${INK};padding:24px 28px;color:#ffffff">
          <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:${LIME}">Forge. Learn. Evolve.</p>
          <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(255,255,255,.78)">
            FLE TRIBE LTD · <a href="https://${WEBSITE}" style="color:#ffffff">${WEBSITE}</a><br>
            You’re receiving this because ${page.reason} ${escape(page.to)}.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Big lime button, plus the plain link for email apps that break it. */
function button(label: string, url: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 12px">
            <tr><td style="background:${LIME};border-radius:999px">
              <a href="${escape(url)}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:${INK};text-decoration:none">${label}</a>
            </td></tr>
          </table>
          <p style="margin:0;font-size:13px;line-height:1.5;color:${MUTED}">Button not working? Go to <a href="${escape(url)}" style="color:${BRAND};word-break:break-all">${escape(url)}</a></p>`;
}

export interface CertificateEmail {
  apiKey?: string;
  from?: string;
  to: string;
  name: string;
  number: string;
  /** ISO date, e.g. 2026-11-30. */
  issuedOn: string;
  appUrl: string;
}

const certificateUrl = (e: CertificateEmail) => `${e.appUrl}/verify/${encodeURIComponent(e.number)}`;
const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function certificateText(e: CertificateEmail) {
  return [
    `Congratulations ${e.name}!`,
    '',
    'You have completed the FLE TRIBE Frontend Developer Program, and your certificate is ready.',
    '',
    `Certificate No: ${e.number}`,
    `Issued: ${longDate(e.issuedOn)}`,
    `View and download it: ${certificateUrl(e)}`,
    '',
    'Anyone who opens this link can confirm your certificate is genuine, so you can share it with employers.',
    '',
    `Need help? Write to ${SUPPORT_EMAIL}.`,
    '',
    'FLE TRIBE',
  ].join('\n');
}

export function certificateHtml(e: CertificateEmail) {
  return emailPage({
    to: e.to,
    title: 'Congratulations! Your certificate is ready',
    preview: `You've completed the program. Certificate No: ${e.number}.`,
    appUrl: e.appUrl,
    reason: 'FLE TRIBE issued a certificate to',
    body: `
          <p style="margin:0 0 12px;font-size:15px;line-height:1.6">Hi ${escape(e.name)},</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6">You've completed the FLE TRIBE <b>Frontend Developer Program</b>. Five months of work, reviewed and done. We're proud of what you've built.</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6fb;border-radius:12px;border:1px solid ${LINE}">
            <tr><td style="padding:18px 20px 8px">${detail('Awarded to', e.name)}</td></tr>
            <tr><td style="padding:10px 20px 8px">${detail('Certificate number', e.number, true)}</td></tr>
            <tr><td style="padding:10px 20px 18px">${detail('Issued', longDate(e.issuedOn))}</td></tr>
          </table>

          ${button('View your certificate', certificateUrl(e))}

          ${heading('What to do next')}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${step(1, 'Open your certificate and click <b>Download PDF</b>, then choose <b>Save as PDF</b>.')}
            ${step(2, 'Add it to your CV and portfolio.')}
            ${step(3, 'Share the link with employers. Anyone who opens it can confirm it’s genuine.')}
          </table>`,
  });
}

/** Posts one email to Resend. A failure comes back as a problem to show the admin, never an exception. */
async function deliver(message: { apiKey?: string; from?: string; appUrl: string; to: string; subject: string; text: string; html: string }): Promise<EmailResult> {
  if (!message.apiKey || !message.from) return { sent: false, problem: 'Automatic email isn’t set up yet.' };
  if (!message.appUrl.startsWith('https://')) {
    return { sent: false, problem: 'Automatic email needs the APP_URL secret set to your live site’s https:// address.' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${message.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: message.from,
        reply_to: SUPPORT_EMAIL,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) return { sent: true };
    const body = await res.json().catch(() => ({}));
    console.error('Resend rejected the email', res.status, body?.name);
    return { sent: false, problem: `The email service said: ${body?.message ?? `error ${res.status}`}` };
  } catch (err) {
    console.error('Could not reach Resend', err);
    return { sent: false, problem: 'The email service couldn’t be reached.' };
  }
}

export const sendCertificateEmail = (e: CertificateEmail) =>
  deliver({
    apiKey: e.apiKey,
    from: e.from,
    appUrl: e.appUrl,
    to: e.to,
    subject: 'Congratulations! Your FLE TRIBE certificate is ready',
    text: certificateText(e),
    html: certificateHtml(e),
  });

export const sendPasswordChangedEmail = (e: PasswordChangedEmail) =>
  deliver({
    apiKey: e.apiKey,
    from: e.from,
    appUrl: e.appUrl,
    to: e.to,
    subject: 'Your FLE TRIBE password was changed',
    text: passwordChangedText(e),
    html: passwordChangedHtml(e),
  });

export const sendSignInEmail = (e: SignInEmail) =>
  deliver({
    apiKey: e.apiKey,
    from: e.from,
    appUrl: e.appUrl,
    to: e.to,
    subject: 'Welcome to FLE TRIBE: your sign-in details',
    text: e.text,
    html: signInHtml(e),
  });
