import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { StudentSummary } from '../../data/models';
import { mainDays, certificateDate } from '../../lib/course';
import { errorText, supabase } from '../../lib/supabase';
import { PageHeader } from '../../components/PageHeader';

interface IssuedRow {
  number: string;
  user_id: string | null;
  full_name: string;
  issued_on: string;
}

/** Issue certificates. Numbers are assigned by the database in the FTL<yy>FE-<nnn> series. */
export default function CertificatesAdmin() {
  const [params] = useSearchParams();
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [certs, setCerts] = useState<IssuedRow[]>([]);
  const [studentId, setStudentId] = useState(params.get('student') ?? '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Certificates · Admin · FLE TRIBE';
    Promise.all([
      supabase.rpc('admin_students'),
      supabase.from('certificates').select('number, user_id, full_name, issued_on').order('number', { ascending: false }),
    ]).then(([s, c]) => {
      if (s.error || c.error) setError(errorText(s.error ?? c.error));
      setStudents((s.data ?? []) as StudentSummary[]);
      setCerts((c.data ?? []) as IssuedRow[]);
    });
  }, []);

  const selected = students.find((s) => s.id === studentId);
  const hasCertificate = (id: string) => certs.some((c) => c.user_id === id);
  const eligible = (s: StudentSummary) => s.completed >= mainDays.length && !hasCertificate(s.id);
  const eligibleCount = students.filter(eligible).length;

  async function issue(e: FormEvent) {
    e.preventDefault();
    if (!studentId) return setError('Choose a student.');
    setBusy(true);
    setError('');
    const { data, error } = await supabase.rpc('issue_certificate', { p_user: studentId, p_date: date });
    setBusy(false);
    if (error) return setError(errorText(error));
    setCerts((list) => [{ ...(data as IssuedRow), user_id: studentId }, ...list]);
    setStudentId('');
  }

  async function revoke(number: string) {
    const { error } = await supabase.from('certificates').delete().eq('number', number);
    if (error) setError(errorText(error));
    else setCerts((list) => list.filter((c) => c.number !== number));
    setConfirmRevoke(null);
  }

  const field = 'rounded-lg border border-line bg-bg px-3 py-2.5';
  return (
    <>
      <PageHeader eyebrow="Admin" title="Certificates">
        Issue a certificate once a student completes the main course. It appears on their certificate page straight away.
      </PageHeader>

      <section className="mb-8 rounded-xl border border-line bg-surface p-5">
        <h2 className="mb-4 text-lg font-bold">Issue a certificate</h2>
        <form className="grid gap-3 sm:grid-cols-[2fr_1fr_auto] sm:items-end" onSubmit={issue}>
          <div className="grid gap-1.5">
            <label htmlFor="cert-student" className="text-sm font-semibold">Student</label>
            <select id="cert-student" value={studentId} onChange={(e) => setStudentId(e.target.value)} className={field}>
              <option value="" disabled>Choose a student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id} disabled={!eligible(s)}>
                  {s.full_name} · {hasCertificate(s.id) ? 'certificate issued' : s.completed >= mainDays.length ? 'course complete' : `${s.completed}/${mainDays.length} days`}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="cert-date" className="text-sm font-semibold">Date on certificate</label>
            <input id="cert-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
          </div>
          <button type="submit" disabled={busy || !selected || !eligible(selected)} className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-50">
            {busy ? 'Issuing…' : 'Issue certificate'}
          </button>
        </form>
        <p className="mt-3 text-sm text-muted">
          Only students who have submitted every day of the main course ({mainDays.length} days) can receive a certificate.{' '}
          {eligibleCount === 0 ? 'No student has completed the course yet.' : `${eligibleCount} ready.`}
        </p>
        {selected && !eligible(selected) && (
          <p className="mt-1 text-sm font-semibold text-fri">{selected.full_name} can't receive a certificate yet.</p>
        )}
        {error && <p className="mt-3 text-sm font-semibold text-fri" role="alert">{error}</p>}
      </section>

      <h2 className="mb-3 text-lg font-bold">Issued <span className="text-muted">({certs.length})</span></h2>
      {certs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-muted">No certificates issued yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[620px] border-collapse text-[15px]">
            <thead><tr className="eyebrow text-left"><th className="px-4 py-3">Number</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Date</th><th className="px-4 py-3" /></tr></thead>
            <tbody>
              {certs.map((c) => (
                <tr key={c.number} className="border-t border-line">
                  <td className="px-4 py-3 font-mono font-semibold">{c.number}</td>
                  <td className="px-4 py-3">{c.full_name}</td>
                  <td className="px-4 py-3">{certificateDate(c.issued_on)}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">
                    <Link to={`/verify/${c.number}`} className="text-accent hover:underline">View</Link>
                    {confirmRevoke === c.number ? (
                      <>
                        <button type="button" onClick={() => revoke(c.number)} className="ml-3 rounded bg-fri px-2 py-1 text-white">Confirm revoke</button>
                        <button type="button" onClick={() => setConfirmRevoke(null)} className="ml-2 text-muted">Keep</button>
                      </>
                    ) : (
                      <button type="button" onClick={() => setConfirmRevoke(c.number)} className="ml-3 text-fri">Revoke</button>
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
