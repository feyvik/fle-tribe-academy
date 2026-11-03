import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { StudentSummary } from '../../data/models';
import { mainDays, formatDateTime } from '../../lib/course';
import { adminUsers, errorText, supabase } from '../../lib/supabase';
import { CredentialsCard, type SignInDetails } from './shared';
import { PageHeader } from '../../components/PageHeader';

/** Add students (there is no public sign-up) and see everyone's progress. */
export default function Students() {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<(SignInDetails & { name: string }) | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const { data, error } = await supabase.rpc('admin_students');
    if (error) setLoadError(errorText(error));
    else setStudents((data ?? []) as StudentSummary[]);
    setLoading(false);
  }

  useEffect(() => {
    document.title = 'Students · Admin · FLE TRIBE';
    load();
  }, []);

  async function add(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const r = await adminUsers<SignInDetails>({ action: 'create', fullName: name.trim(), email: email.trim() });
      setCreated({ ...r, name: name.trim() });
      setName('');
      setEmail('');
      load();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  /** Deletes the student's account and all their answers (via the admin-users Edge Function). */
  async function remove(id: string) {
    setDeleting(true);
    setError('');
    try {
      await adminUsers({ action: 'delete', userId: id });
      setStudents((list) => list.filter((s) => s.id !== id));
    } catch (err) {
      setError(errorText(err));
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  }

  const field = 'rounded-lg border border-line bg-bg px-3 py-2.5';
  return (
    <>
      <PageHeader eyebrow="Admin" title="Students">
        There's no public sign-up. Add each student here and send them their sign-in details.
      </PageHeader>

      <section className="mb-8 rounded-xl border border-line bg-surface p-5">
        <h2 className="mb-4 text-lg font-bold">Add a student</h2>
        <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end" onSubmit={add} noValidate>
          <div className="grid gap-1.5">
            <label htmlFor="new-name" className="text-sm font-semibold">Full name</label>
            <input id="new-name" autoComplete="off" placeholder="As it should appear on the certificate" value={name} onChange={(e) => setName(e.target.value)} className={field} />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="new-email" className="text-sm font-semibold">Email</label>
            <input id="new-email" type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
          </div>
          <button type="submit" disabled={busy} className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-60">
            {busy ? 'Adding…' : 'Add student'}
          </button>
        </form>
        {error && <p className="mt-3 rounded-lg bg-fri-soft px-3 py-2 text-sm font-semibold text-fri" role="alert">{error}</p>}
      </section>

      {created && (
        <div className="mb-8">
          <CredentialsCard details={created} heading={`${created.name} has been added`} onClose={() => setCreated(null)} />
        </div>
      )}

      <h2 className="mb-3 text-lg font-bold">
        All students <span className="text-muted">({students.length})</span>
        {students.some((s) => s.completed >= mainDays.length) && (
          <span className="ml-2 text-sm font-semibold text-muted">
            · {students.filter((s) => s.completed >= mainDays.length).length} completed the course
          </span>
        )}
      </h2>
      {loading ? (
        <p className="text-muted">Loading students…</p>
      ) : loadError ? (
        <p className="font-semibold text-fri">{loadError}</p>
      ) : students.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-muted">No students yet. Add your first student above.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[860px] border-collapse text-[15px]">
            <thead>
              <tr className="eyebrow text-left">
                <th className="px-4 py-3">Student</th><th className="px-4 py-3">Progress</th><th className="px-4 py-3">Last submitted</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t border-line align-middle hover:bg-sunk">
                  <td className="px-4 py-3">
                    <Link to={s.id} className="font-semibold hover:text-accent">{s.full_name}</Link>
                    <div className="text-sm text-muted">{s.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-sunk">
                        <div className="h-full bg-ok" style={{ width: `${(s.completed / mainDays.length) * 100}%` }} />
                      </div>
                      <span className="font-mono text-xs tabular-nums">{s.completed}/{mainDays.length}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatDateTime(s.last_submitted_at)}</td>
                  <td className="px-4 py-3 text-sm">
                    {s.completed >= mainDays.length ? (
                      <Link to="/admin/certificates" className="rounded-full bg-lime px-2.5 py-1 text-xs font-bold text-ink hover:brightness-95"
                            title="Every main-course day is submitted. Issue their certificate.">
                        Course complete ✓
                      </Link>
                    ) : s.must_change_password ? (
                      <span className="rounded-full bg-fri-soft px-2.5 py-1 text-xs font-bold text-fri">Hasn't signed in yet</span>
                    ) : (
                      <span className="rounded-full bg-sat-soft px-2.5 py-1 text-xs font-bold text-sat">In progress</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">
                    {confirmDelete === s.id ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="text-fri">Delete {s.full_name} and all their answers?</span>
                        <button type="button" onClick={() => remove(s.id)} disabled={deleting} className="rounded bg-fri px-2.5 py-1 text-white disabled:opacity-60">
                          {deleting ? 'Deleting…' : 'Delete'}
                        </button>
                        <button type="button" onClick={() => setConfirmDelete(null)} className="text-muted">Keep</button>
                      </span>
                    ) : (
                      <button type="button" onClick={() => setConfirmDelete(s.id)} className="text-fri hover:underline">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
