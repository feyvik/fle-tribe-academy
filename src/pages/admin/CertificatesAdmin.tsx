import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { StudentSummary } from '../../data/models';
import { mainDays, certificateDate } from '../../lib/course';
import { adminUsers, errorText, supabase } from '../../lib/supabase';
import type { CertificateSend } from './shared';
import { PageHeader } from '../../components/PageHeader';

interface IssuedRow {
  number: string;
  user_id: string | null;
  full_name: string;
  issued_on: string;
  emailed_at: string | null;
}

/**
 * Certificates are issued and emailed automatically when a student's last main-course day gets feedback.
 * This page shows them, re-sends emails, and can issue one by hand to catch up. Numbers come from the database: FTL<yy>FE-<nnn>.
 */
export default function CertificatesAdmin() {
  const [params] = useSearchParams();
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [certs, setCerts] = useState<IssuedRow[]>([]);
  const [studentId, setStudentId] = useState(params.get('student') ?? '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    document.title = 'Certificates · Admin · FLE TRIBE';
    Promise.all([
      supabase.rpc('admin_students'),
      supabase.from('certificates').select('number, user_id, full_name, issued_on, emailed_at').order('number', { ascending: false }),
    ]).then(([s, c]) => {
      if (s.error || c.error) setError(errorText(s.error ?? c.error));
      setStudents((s.data ?? []) as StudentSummary[]);
      setCerts((c.data ?? []) as IssuedRow[]);
    });
  }, []);

  const selected = students.find((s) => s.id === studentId);
  const hasCertificate = (id: string) => certs.some((c) => c.user_id === id);
  const eligible = (s: StudentSummary) => s.reviewed >= mainDays.length && !hasCertificate(s.id);
  const eligibleCount = students.filter(eligible).length;

  async function issue(e: FormEvent) {
    e.preventDefault();
    if (!studentId) return setError('Choose a student.');
    setBusy(true);
    setError('');
    const { data, error } = await supabase.rpc('issue_certificate', { p_user: studentId, p_date: date });
    setBusy(false);
    if (error) return setError(errorText(error));
    const row = { ...(data as IssuedRow), user_id: studentId };
    setCerts((list) => [row, ...list]);
    setStudentId('');
    sendEmail(row);
  }

  /** Emails a student their certificate, or sends it again. */
  async function sendEmail(cert: IssuedRow) {
    if (!cert.user_id) return;
    setSending(cert.number);
    setError('');
    setNotice('');
    try {
      const r = await adminUsers<CertificateSend>({ action: 'send_certificate', userId: cert.user_id, resend: true });
      if (r.emailed) {
        setCerts((list) => list.map((c) => (c.number === cert.number ? { ...c, emailed_at: new Date().toISOString() } : c)));
        setNotice(`Certificate ${cert.number} emailed to ${cert.full_name}.`);
      } else {
        setError(`Certificate ${cert.number} wasn’t emailed. ${r.emailProblem ?? ''}`);
      }
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSending(null);
    }
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
        When you give feedback on a student's last main-course day, their certificate is issued and emailed to them automatically. It also appears on their certificate page.
      </PageHeader>

      <section className="mb-8 rounded-xl border border-line bg-surface p-5">
        <h2 className="mb-4 text-lg font-bold">Issue one by hand</h2>
        <form className="grid gap-3 sm:grid-cols-[2fr_1fr_auto] sm:items-end" onSubmit={issue}>
          <div className="grid gap-1.5">
            <label htmlFor="cert-student" className="text-sm font-semibold">Student</label>
            <select id="cert-student" value={studentId} onChange={(e) => setStudentId(e.target.value)} className={field}>
              <option value="" disabled>Choose a student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id} disabled={!eligible(s)}>
                  {s.full_name} · {hasCertificate(s.id) ? 'certificate issued' : s.reviewed >= mainDays.length ? 'fully reviewed' : `${s.reviewed}/${mainDays.length} days`}
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
          Usually you won't need this. It's for catching up, such as after revoking a certificate. Every main-course day ({mainDays.length} days) must have feedback first.{' '}
          {eligibleCount === 0 ? 'No student is waiting for one.' : `${eligibleCount} ready.`}
        </p>
        {selected && !eligible(selected) && (
          <p className="mt-1 text-sm font-semibold text-fri">{selected.full_name} can't receive a certificate yet.</p>
        )}
        {error && <p className="mt-3 text-sm font-semibold text-fri" role="alert">{error}</p>}
        {notice && <p className="mt-3 text-sm font-semibold text-sat" role="status">{notice}</p>}
      </section>

      <h2 className="mb-3 text-lg font-bold">Issued <span className="text-muted">({certs.length})</span></h2>
      {certs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-muted">No certificates issued yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[720px] border-collapse text-[15px]">
            <thead><tr className="eyebrow text-left"><th className="px-4 py-3">Number</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Email</th><th className="px-4 py-3" /></tr></thead>
            <tbody>
              {certs.map((c) => (
                <tr key={c.number} className="border-t border-line">
                  <td className="px-4 py-3 font-mono font-semibold">{c.number}</td>
                  <td className="px-4 py-3">{c.full_name}</td>
                  <td className="px-4 py-3">{certificateDate(c.issued_on)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`mr-2 font-semibold ${c.emailed_at ? 'text-sat' : 'text-fri'}`}>{c.emailed_at ? 'Sent' : 'Not sent'}</span>
                    {c.user_id && (
                      <button type="button" disabled={sending !== null} onClick={() => sendEmail(c)} className="font-semibold text-accent hover:underline disabled:opacity-60">
                        {sending === c.number ? 'Sending…' : c.emailed_at ? 'Resend' : 'Send'}
                      </button>
                    )}
                  </td>
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
