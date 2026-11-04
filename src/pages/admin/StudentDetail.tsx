import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Certificate, Profile, Submission } from '../../data/models';
import { allDays, formatDateTime, isBonus, lessonInfo, lessonKey, mainDays } from '../../lib/course';
import { adminUsers, errorText, supabase } from '../../lib/supabase';
import { SubmissionReview } from './shared';

/** One student: progress, all their answers with feedback, and removal. */
export default function StudentDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Profile | null>(null);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [error, setError] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*').eq('id', id).single(),
      supabase.from('submissions').select('*').eq('user_id', id).order('submitted_at', { ascending: false }),
      supabase.from('certificates').select('number, full_name, issued_on').eq('user_id', id),
    ]).then(([p, s, c]) => {
      if (p.error) return setError('Student not found.');
      setStudent(p.data as Profile);
      setSubs((s.data ?? []) as Submission[]);
      setCerts((c.data ?? []) as Certificate[]);
      document.title = `${(p.data as Profile).full_name} · Admin · FLE TRIBE`;
    });
  }, [id]);

  const current = useMemo(() => {
    const done = new Set(subs.map((s) => s.lesson_key));
    const next = allDays.find((d) => !done.has(lessonKey(d.weekId, d.day)));
    return next ? lessonInfo(lessonKey(next.weekId, next.day)) : null;
  }, [subs]);

  async function remove() {
    setBusy(true);
    try {
      await adminUsers({ action: 'delete', userId: id });
      navigate('/admin/students');
    } catch (err) {
      setError(errorText(err));
      setBusy(false);
    }
  }

  const button = 'rounded-lg border border-line bg-surface px-4 py-2 text-sm font-semibold hover:border-fg disabled:opacity-60';
  return (
    <>
      <Link to="/admin/students" className="text-sm text-muted hover:text-fg">← All students</Link>
      {error && <p className="mt-4 rounded-lg bg-fri-soft px-3 py-2 font-semibold text-fri" role="alert">{error}</p>}
      {student && (
        <>
          <header className="mb-6 mt-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{student.full_name}</h1>
              <p className="mt-1 text-muted">{student.email} · added {formatDateTime(student.created_at)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={`/admin/certificates?student=${student.id}`} className={button}>Issue certificate</Link>
              {!confirmRemove && (
                <button type="button" onClick={() => setConfirmRemove(true)} className="rounded-lg px-4 py-2 text-sm font-semibold text-fri hover:bg-fri-soft">
                  Delete student
                </button>
              )}
            </div>
          </header>

          {confirmRemove && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-fri bg-fri-soft p-4" role="alert">
              <p className="m-0 font-semibold">Delete {student.full_name}? Their account and all their answers are removed. This can't be undone.</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setConfirmRemove(false)} className="rounded-lg px-4 py-2 text-sm font-semibold">Keep</button>
                <button type="button" onClick={remove} disabled={busy} className="rounded-lg bg-fri px-4 py-2 text-sm font-semibold text-white">Delete student</button>
              </div>
            </div>
          )}


          <section className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="eyebrow">Progress</div>
              <p className="mt-1 text-2xl font-extrabold tabular-nums">{subs.filter((s) => !isBonus(s.lesson_key.split('-')[0])).length} <span className="text-base font-semibold text-muted">/ {mainDays.length} days</span></p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="eyebrow">Working on</div>
              <p className="mt-1 font-semibold">{current?.label ?? 'Course complete'}</p>
              <p className="m-0 text-sm text-muted">{current?.title}</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="eyebrow">Account</div>
              <p className="mt-1 font-semibold">{student.must_change_password ? "Hasn't signed in yet" : 'Active'}</p>
            </div>
          </section>

          {certs.map((c) => (
            <p key={c.number} className="mb-6 rounded-lg bg-sat-soft px-4 py-3 font-semibold">
              Certificate issued: <Link to={`/verify/${c.number}`} className="font-mono underline">{c.number}</Link>
            </p>
          ))}

          <h2 className="mb-3 text-xl font-bold">Submissions <span className="text-muted">({subs.length})</span></h2>
          {subs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line p-8 text-center text-muted">Nothing submitted yet.</p>
          ) : (
            <div className="grid gap-4">
              {subs.map((s) => (
                <SubmissionReview key={s.id} submission={s} onReviewed={(u) => setSubs((list) => list.map((x) => (x.id === u.id ? u : x)))} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
