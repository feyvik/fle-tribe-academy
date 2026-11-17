import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useProgress } from '../lib/progress';
import { errorText, supabase } from '../lib/supabase';
import { PageHeader } from '../components/PageHeader';

/** The signed-in person's profile: their name (as printed on the certificate), email, password and progress. */
export default function Profile() {
  const { profile, isAdmin, updateName } = useAuth();
  const progress = useProgress();
  const [name, setName] = useState(profile?.full_name ?? '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [hasCertificate, setHasCertificate] = useState(false);

  useEffect(() => {
    document.title = 'Your profile · FLE TRIBE';
    if (!profile || isAdmin) return;
    supabase.from('certificates').select('number').eq('user_id', profile.id).limit(1)
      .then(({ data }) => setHasCertificate((data ?? []).length > 0));
  }, [profile, isAdmin]);

  if (!profile) return null;

  async function save(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setMessage({ kind: 'error', text: 'Enter your full name.' });
    setBusy(true);
    setMessage(null);
    try {
      await updateName(name);
      setMessage({ kind: 'ok', text: 'Saved. This is the name that will appear on your certificate.' });
    } catch (err) {
      setMessage({ kind: 'error', text: errorText(err) });
    } finally {
      setBusy(false);
    }
  }

  const unchanged = name.trim().replace(/\s+/g, ' ') === profile.full_name;
  return (
    <>
      <PageHeader eyebrow="Your account" title={profile.full_name}>{profile.email}</PageHeader>

      <div className="grid max-w-3xl gap-6">
        <section className="rounded-lg border border-line bg-surface p-6">
          <h2 className="mb-1 text-lg font-bold">Your details</h2>
          <p className="mb-5 text-sm text-muted">Your name is printed on your certificate, so use your full name as you want it to appear.</p>
          <form className="grid gap-5" onSubmit={save} noValidate>
            <div className="grid gap-1.5">
              <label htmlFor="full-name" className="text-sm font-semibold">Full name</label>
              <input id="full-name" autoComplete="name" value={name} disabled={hasCertificate} onChange={(e) => setName(e.target.value)}
                     className="fle-input disabled:opacity-60" />
              {hasCertificate && (
                <span className="text-xs text-muted">Your certificate has been issued, so your name is locked. Ask an admin if it needs correcting.</span>
              )}
            </div>
            <div className="grid gap-1.5">
              <span className="text-sm font-semibold">Email</span>
              <span className="rounded-md bg-sunk px-3 py-2.5 text-muted">{profile.email}</span>
              <span className="text-xs text-muted">You sign in with this email. To change it, ask your program admin.</span>
            </div>
            {message && (
              <p role={message.kind === 'error' ? 'alert' : 'status'}
                 className={`m-0 rounded-md px-3 py-2 text-sm font-semibold ${message.kind === 'error' ? 'bg-fri-soft text-fri' : 'bg-sat-soft text-sat'}`}>
                {message.text}
              </p>
            )}
            {!hasCertificate && (
              <button type="submit" disabled={busy || unchanged}
                      className="justify-self-start fle-btn fle-btn-primary fle-btn-md">
                {busy ? 'Saving…' : 'Save changes'}
              </button>
            )}
          </form>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-surface p-6">
          <div>
            <h2 className="mb-1 text-lg font-bold">Password</h2>
            <p className="m-0 text-sm text-muted">Change the password you use to sign in.</p>
          </div>
          <Link to="/change-password" className="fle-btn fle-btn-secondary fle-btn-md">Change password</Link>
        </section>

        {!isAdmin && (
          <section className="rounded-lg border border-line bg-surface p-6">
            <h2 className="mb-3 text-lg font-bold">Progress</h2>
            <div className="fle-progress-track">
              <div className="fle-progress-fill fle-progress-primary" style={{ width: `${progress.percent}%` }} />
            </div>
            <p className="mt-2 font-mono text-sm font-semibold tabular-nums">{progress.completedCount} of {progress.totalCount} days done</p>
          </section>
        )}
      </div>
    </>
  );
}
