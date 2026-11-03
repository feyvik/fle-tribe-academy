import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useAuth } from '../lib/auth';
import { errorText } from '../lib/supabase';

/** Shown after signing in with a temporary password (and usable any time to change it). */
export default function ChangePassword() {
  const { profile, loading, changePassword, signOut } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (loading) return null;
  if (!profile) return <Navigate to="/login" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (next.length < 8) return setError('Use at least 8 characters for your new password.');
    if (next !== confirm) return setError('The two new passwords don’t match.');
    if (next === current) return setError('Choose a password different from the current one.');
    setBusy(true);
    setError('');
    try {
      await changePassword(current, next);
      navigate(profile!.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  const field = 'rounded-lg border border-line bg-surface px-3 py-2.5';
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Logo className="mb-10 h-12" />
        <h1 className="text-3xl font-extrabold tracking-tight">Choose your password</h1>
        <p className="mt-2 text-muted">
          {profile.must_change_password
            ? `Welcome, ${profile.full_name}. Replace the temporary password you were sent with one only you know.`
            : 'Enter your current password, then your new one.'}
        </p>

        <form className="mt-8 grid gap-5" onSubmit={onSubmit} noValidate>
          <div className="grid gap-1.5">
            <label htmlFor="current" className="text-sm font-semibold">{profile.must_change_password ? 'Temporary password' : 'Current password'}</label>
            <input id="current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={field} />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="next" className="text-sm font-semibold">New password</label>
            <input id="next" type="password" autoComplete="new-password" aria-describedby="next-hint" value={next} onChange={(e) => setNext(e.target.value)} className={field} />
            <span id="next-hint" className="text-xs text-muted">At least 8 characters.</span>
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="confirm" className="text-sm font-semibold">Type the new password again</label>
            <input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} />
          </div>

          {error && <p className="rounded-lg bg-fri-soft px-3 py-2 text-sm font-semibold text-fri" role="alert">{error}</p>}

          <button type="submit" disabled={busy} className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60">
            {busy ? 'Saving…' : 'Save password'}
          </button>
          {profile.must_change_password ? (
            <button type="button" onClick={() => signOut().then(() => navigate('/login'))} className="text-sm font-semibold text-muted hover:text-fg">
              Sign out
            </button>
          ) : (
            <button type="button" onClick={() => navigate(-1)} className="text-sm font-semibold text-muted hover:text-fg">
              Cancel
            </button>
          )}
        </form>
      </div>
    </main>
  );
}
