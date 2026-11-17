import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { StudentRecord } from '../../data/models';
import { certificateDate, formatDateTime } from '../../lib/course';
import { errorText, supabase } from '../../lib/supabase';
import { Pagination, usePagination } from '../../components/Pagination';

interface RecordCertificate {
  number: string;
  record_id: string;
  issued_on: string;
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

  if (loading) return null;
  if (error) {
    return (
      <p className="mt-10 font-semibold text-fri">
        Other programs couldn't load: {error}
      </p>
    );
  }
  if (records.length === 0) return null;

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
        <label className="flex items-center gap-2 text-sm font-semibold">
          Program
          <select value={program} onChange={(e) => setProgram(e.target.value)} className="rounded-lg border border-line bg-bg px-3 py-2">
            {programs.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
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
                    <td className="px-4 py-3 font-mono text-sm">{r.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-sm">{r.joined_at ? formatDateTime(r.joined_at) : '—'}</td>
                    <td className="px-4 py-3 text-sm">
                      {cert ? (
                        <Link to={`/verify/${cert.number}`} className="rounded-full bg-lime px-2.5 py-1 font-mono text-xs font-bold text-ink hover:brightness-95"
                              title={`Issued ${certificateDate(cert.issued_on)}`}>
                          {cert.number}
                        </Link>
                      ) : (
                        <span className="text-muted">—</span>
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
                        <dl className="grid gap-3 sm:grid-cols-[180px_1fr]">
                          <dt className="font-semibold">Why they joined</dt><dd className="m-0">{r.reason || '—'}</dd>
                          <dt className="font-semibold">Heard about us</dt><dd className="m-0">{r.heard_from || '—'}</dd>
                          <dt className="font-semibold">Headshot</dt>
                          <dd className="m-0">
                            {r.headshot_url ? <a href={r.headshot_url} target="_blank" rel="noopener noreferrer" className="text-accent underline">Open in Google Drive ↗</a> : '—'}
                          </dd>
                          {r.notes && (<><dt className="font-semibold">Notes</dt><dd className="m-0">{r.notes}</dd></>)}
                        </dl>
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
    </section>
  );
}
