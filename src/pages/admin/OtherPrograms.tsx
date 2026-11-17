import { Fragment, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { StudentRecord } from '../../data/models';
import { certificateDate, formatDateTime } from '../../lib/course';
import { errorText, supabase } from '../../lib/supabase';
import { Pagination } from '../../components/Pagination';
import { usePagination } from '../../lib/pagination';

interface RecordCertificate {
  number: string;
  record_id: string;
  issued_on: string;
}

type Draft = Pick<StudentRecord, 'full_name' | 'email' | 'phone' | 'program' | 'notes'>;
const EMPTY: Draft = { full_name: '', email: '', phone: '', program: '', notes: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Add or edit a student record. Empty optional fields are saved as empty, not as blank text. */
function RecordForm({ initial, programs, onSave, onCancel }: {
  initial: Draft;
  programs: string[];
  onSave: (d: Draft) => Promise<void>;
  onCancel: () => void;
}) {
  const [d, setD] = useState<Draft>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k: keyof Draft) => (e: { target: { value: string } }) => setD({ ...d, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    const clean: Draft = {
      full_name: d.full_name.trim(),
      email: d.email?.trim() || null,
      phone: d.phone?.trim() || null,
      program: d.program.trim(),
      notes: d.notes?.trim() || null,
    };
    if (clean.full_name.length < 2) return setError('Enter their full name.');
    if (!clean.program) return setError('Enter their program, e.g. Data Analysis.');
    if (clean.email && !EMAIL_RE.test(clean.email)) return setError('That email address doesn’t look right.');
    setBusy(true);
    setError('');
    try {
      await onSave(clean);
    } catch (err) {
      setError(errorText(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-3 sm:grid-cols-2">
      <label className="fle-field"><span className="fle-field-label">Full name</span><input className="fle-input" value={d.full_name} onChange={set('full_name')} /></label>
      <label className="fle-field"><span className="fle-field-label">Program</span>
        <input className="fle-input" list="record-programs" value={d.program} onChange={set('program')} placeholder="e.g. Data Analysis" />
        <datalist id="record-programs">{programs.map((p) => <option key={p} value={p} />)}</datalist>
      </label>
      <label className="fle-field"><span className="fle-field-label">Email (optional)</span><input className="fle-input" type="email" value={d.email ?? ''} onChange={set('email')} /></label>
      <label className="fle-field"><span className="fle-field-label">Phone (optional)</span><input className="fle-input" type="tel" value={d.phone ?? ''} onChange={set('phone')} /></label>
      <label className="fle-field sm:col-span-2"><span className="fle-field-label">Notes (optional)</span><textarea className="fle-input fle-input-multi" value={d.notes ?? ''} onChange={set('notes')} /></label>
      {error && <p className="m-0 font-semibold text-fri sm:col-span-2" role="alert">{error}</p>}
      <div className="flex gap-2 sm:col-span-2">
        <button type="submit" disabled={busy} className="fle-btn fle-btn-primary fle-btn-md">{busy ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel} className="fle-btn fle-btn-secondary fle-btn-md">Cancel</button>
      </div>
    </form>
  );
}

/**
 * Students on FLE TRIBE's other programs (Data Analysis, UI/UX, …). They have no login to this app: these are records,
 * kept so their certificates can be verified. Only students with a certificate show one here.
 */
export function OtherPrograms() {
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [certs, setCerts] = useState<RecordCertificate[]>([]);
  const [program, setProgram] = useState('All');
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from('student_records').select('*').order('joined_at', { ascending: true }),
      supabase.from('certificates').select('number, record_id, issued_on').not('record_id', 'is', null),
    ]).then(([r, c]) => {
      if (r.error || c.error) setError(errorText(r.error ?? c.error));
      setRecords((r.data ?? []) as StudentRecord[]);
      setCerts((c.data ?? []) as RecordCertificate[]);
      setLoading(false);
    });
  }, []);

  const programs = useMemo(() => ['All', ...new Set(records.map((r) => r.program))], [records]);
  const shown = program === 'All' ? records : records.filter((r) => r.program === program);
  const certificateFor = (id: string) => certs.find((c) => c.record_id === id);
  const pager = usePagination(shown, 10, program);

  const knownPrograms = programs.filter((p) => p !== 'All');

  async function add(d: Draft) {
    const { data, error } = await supabase.from('student_records').insert(d).select().single();
    if (error) throw error;
    setRecords((list) => [...list, data as StudentRecord]);
    setAdding(false);
  }

  async function save(id: string, d: Draft) {
    const { data, error } = await supabase.from('student_records').update(d).eq('id', id).select().single();
    if (error) throw error;
    setRecords((list) => list.map((r) => (r.id === id ? (data as StudentRecord) : r)));
    setEditing(null);
  }

  /** Removes the record. A certificate they hold stays valid and verifiable; it just isn't linked to a record any more. */
  async function remove(id: string) {
    const { error } = await supabase.from('student_records').delete().eq('id', id);
    if (error) return setError(errorText(error));
    setRecords((list) => list.filter((r) => r.id !== id));
    setCerts((list) => list.filter((c) => c.record_id !== id));
    setConfirmDelete(null);
    setOpen(null);
  }

  if (loading) return null;
  if (error && records.length === 0) {
    return (
      <p className="mt-10 font-semibold text-fri">
        Other programs couldn't load: {error}
      </p>
    );
  }

  return (
    <section className="mt-12">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">
            Other programs <span className="text-muted">({records.length})</span>
            <span className="ml-2 text-sm font-semibold text-muted">· {certs.length} with a certificate</span>
          </h2>
          <p className="text-sm text-muted">Records of students on other FLE TRIBE programs. They can't sign in to this app.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {records.length > 0 && (
            <label className="flex items-center gap-2 text-sm font-semibold">
              Program
              <select value={program} onChange={(e) => setProgram(e.target.value)} className="fle-input">
                {programs.map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
          )}
          {!adding && <button type="button" onClick={() => setAdding(true)} className="fle-btn fle-btn-secondary fle-btn-md">+ Add a record</button>}
        </div>
      </div>

      {error && <p className="mb-3 font-semibold text-fri" role="alert">{error}</p>}
      {adding && (
        <div className="mb-4 rounded-lg border border-line bg-surface p-5">
          <h3 className="mb-3 text-base font-bold">Add a student record</h3>
          <RecordForm initial={EMPTY} programs={knownPrograms} onSave={add} onCancel={() => setAdding(false)} />
        </div>
      )}

      {records.length > 0 && (<>
      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full min-w-[860px] border-collapse text-[15px]">
          <thead>
            <tr className="eyebrow text-left">
              <th className="px-4 py-3">Student</th><th className="px-4 py-3">Program</th><th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Joined</th><th className="px-4 py-3">Certificate</th><th className="px-4 py-3"><span className="sr-only">Details</span></th>
            </tr>
          </thead>
          <tbody>
            {pager.pageItems.map((r) => {
              const cert = certificateFor(r.id);
              return (
                <Fragment key={r.id}>
                  <tr className="border-t border-line align-middle">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{r.full_name}</div>
                      {r.email && <div className="text-sm text-muted">{r.email}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm">{r.program}</td>
                    <td className="px-4 py-3 font-mono text-sm">{r.phone ?? 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{r.joined_at ? formatDateTime(r.joined_at) : 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      {cert ? (
                        <Link to={`/verify/${cert.number}`} className="fle-tag fle-tag-lime font-mono hover:brightness-95"
                              title={`Issued ${certificateDate(cert.issued_on)}`}>
                          {cert.number}
                        </Link>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold">
                      <button type="button" onClick={() => setOpen(open === r.id ? null : r.id)} aria-expanded={open === r.id} className="text-accent hover:underline">
                        {open === r.id ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {open === r.id && (
                    <tr className="bg-sunk">
                      <td colSpan={6} className="px-4 py-4 text-sm">
                        {editing === r.id ? (
                          <RecordForm initial={{ full_name: r.full_name, email: r.email, phone: r.phone, program: r.program, notes: r.notes }}
                                      programs={knownPrograms} onSave={(d) => save(r.id, d)} onCancel={() => setEditing(null)} />
                        ) : (<>
                        <dl className="grid gap-3 sm:grid-cols-[180px_1fr]">
                          <dt className="font-semibold">Why they joined</dt><dd className="m-0">{r.reason || 'N/A'}</dd>
                          <dt className="font-semibold">Heard about us</dt><dd className="m-0">{r.heard_from || 'N/A'}</dd>
                          <dt className="font-semibold">Headshot</dt>
                          <dd className="m-0">
                            {r.headshot_url ? <a href={r.headshot_url} target="_blank" rel="noopener noreferrer" className="text-accent underline">Open in Google Drive ↗</a> : 'N/A'}
                          </dd>
                          {r.notes && (<><dt className="font-semibold">Notes</dt><dd className="m-0">{r.notes}</dd></>)}
                        </dl>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <button type="button" onClick={() => setEditing(r.id)} className="fle-btn fle-btn-secondary fle-btn-sm">Edit</button>
                          {confirmDelete === r.id ? (
                            <>
                              <span className="font-semibold text-fri">
                                Delete {r.full_name}'s record?{cert ? ` Certificate ${cert.number} stays valid.` : ''}
                              </span>
                              <button type="button" onClick={() => remove(r.id)} className="fle-btn fle-btn-sm bg-coral text-white hover:opacity-90">Delete</button>
                              <button type="button" onClick={() => setConfirmDelete(null)} className="fle-btn fle-btn-ghost fle-btn-sm">Keep</button>
                            </>
                          ) : (
                            <button type="button" onClick={() => setConfirmDelete(r.id)} className="fle-btn fle-btn-sm text-fri hover:bg-fri-soft">Delete</button>
                          )}
                        </div>
                        </>)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination {...pager} label="Other programs" />
      </>)}
    </section>
  );
}
