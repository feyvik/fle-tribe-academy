import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { LinkList, Linkify } from '../../components/Linkify';
import type { Submission } from '../../data/models';
import { formatDateTime, lessonInfo } from '../../lib/course';
import { adminUsers, errorText, supabase } from '../../lib/supabase';

export interface SignInDetails {
  password: string;
  /** Ready-to-send message with the sign-in link, email and temporary password. */
  message: string;
  /** True when the details were emailed to the student. */
  emailed?: boolean;
  /** Why the email wasn't sent, if it wasn't. */
  emailProblem?: string;
}

/** Result of asking the server to email a student's certificate. */
export interface CertificateSend {
  issued: boolean;
  number?: string;
  /** It had already been emailed, so nothing new happened. */
  alreadySent?: boolean;
  emailed?: boolean;
  emailProblem?: string;
}

/** Confirms the student was emailed, or shows the details once, ready to copy and send (WhatsApp, email, …). */
export function CredentialsCard({ details, heading, onClose }: { details: SignInDetails; heading: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(details.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the text is selectable in the box.
    }
  }
  const message = (
    <>
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-surface p-4 font-mono text-sm">{details.message}</pre>
      <button type="button" onClick={copy} className="mt-3 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
        {copied ? 'Copied ✓' : 'Copy message'}
      </button>
    </>
  );
  return (
    <section className="rounded-xl border-2 border-brand bg-accent-soft p-5" role="status">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">{heading}</h3>
          {details.emailed ? (
            <p className="m-0 text-sm font-semibold">✓ Their sign-in details have been emailed to them.</p>
          ) : (
            <p className="m-0 text-sm">
              {details.emailProblem && <b>The email wasn’t sent. {details.emailProblem} </b>}
              Send this message to the student. The temporary password is only shown now.
            </p>
          )}
        </div>
        <button type="button" onClick={onClose} className="text-sm font-semibold text-muted hover:text-fg">Done</button>
      </div>
      {details.emailed ? (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-semibold">Didn’t arrive? Show the message to send yourself</summary>
          {message}
        </details>
      ) : (
        message
      )}
    </section>
  );
}

/** One submission with its questions, and a box to write feedback. Feedback locks the answers. */
export function SubmissionReview({
  submission,
  student,
  onReviewed,
}: {
  submission: Submission;
  student?: { id: string; name: string };
  onReviewed: (s: Submission) => void;
}) {
  const info = lessonInfo(submission.lesson_key);
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [certificate, setCertificate] = useState<CertificateSend | null>(null);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!feedback.trim()) return setError('Write some feedback first.');
    setBusy(true);
    setError('');
    const { data, error } = await supabase
      .from('submissions')
      .update({ feedback: feedback.trim(), reviewed_at: new Date().toISOString() })
      .eq('id', submission.id)
      .select()
      .single();
    setBusy(false);
    if (error) return setError(errorText(error));
    onReviewed(data as Submission);
    // The database issues the certificate when this was the last review; this emails it. If the call fails,
    // the certificate still exists and Admin → Certificates offers to send it.
    adminUsers<CertificateSend>({ action: 'send_certificate', userId: submission.user_id })
      .then((r) => { if (r.issued && !r.alreadySent) setCertificate(r); })
      .catch(() => {});
  }

  return (
    <article className="rounded-xl border border-line bg-surface p-5">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="eyebrow">{info.label}</div>
          <h3 className="text-lg font-bold">{info.title}</h3>
          {student && <Link to={`/admin/students/${student.id}`} className="text-sm font-semibold text-accent hover:underline">{student.name}</Link>}
        </div>
        <div className="text-right text-xs text-muted">
          Submitted {formatDateTime(submission.submitted_at)}
          <div className="mt-1">
            <span className={`rounded-full px-2.5 py-1 font-bold ${submission.reviewed_at ? 'bg-sat-soft text-sat' : 'bg-fri-soft text-fri'}`}>
              {submission.reviewed_at ? 'Reviewed' : 'Needs review'}
            </span>
          </div>
        </div>
      </header>

      <dl className="grid gap-3">
        {submission.link && (
          <div>
            <dt className="eyebrow mb-1">Link to their work</dt>
            <dd className="m-0"><LinkList links={[submission.link]} /></dd>
          </div>
        )}
        {submission.answers.map((a, i) => (
          <div key={i}>
            <dt className="rich mb-1 text-sm font-semibold text-muted" dangerouslySetInnerHTML={{ __html: info.questions[i] || `Answer ${i + 1}` }} />
            <dd className="m-0 whitespace-pre-wrap"><Linkify text={a} /></dd>
          </div>
        ))}
        {!!submission.links?.length && (
          <div>
            <dt className="eyebrow mb-1">Links</dt>
            <dd className="m-0"><LinkList links={submission.links} /></dd>
          </div>
        )}
      </dl>

      {submission.feedback ? (
        <div className="mt-4 rounded-lg bg-sat-soft p-4">
          <div className="eyebrow mb-1 !text-sat">Your feedback</div>
          <p className="m-0 whitespace-pre-wrap">{submission.feedback}</p>
        </div>
      ) : (
        <form className="mt-4 grid gap-2" onSubmit={save}>
          <label htmlFor={`fb-${submission.id}`} className="text-sm font-semibold">Feedback for the student</label>
          <textarea id={`fb-${submission.id}`} rows={3} placeholder="What's good, and one thing to improve." value={feedback}
                    onChange={(e) => setFeedback(e.target.value)} className="rounded-lg border border-line bg-bg px-3 py-2.5" />
          {error && <p className="text-sm font-semibold text-fri" role="alert">{error}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
              {busy ? 'Saving…' : 'Send feedback'}
            </button>
            <span className="text-xs text-muted">The student sees it on the lesson. Their answers can't be edited afterwards.</span>
          </div>
        </form>
      )}

      {certificate && (
        <p className="mt-4 rounded-lg bg-accent-soft p-4 text-sm font-semibold" role="status">
          🎓 That completes the course. Certificate <span className="font-mono">{certificate.number}</span> has been issued
          {certificate.emailed
            ? ' and emailed to the student.'
            : `, but the email wasn’t sent. ${certificate.emailProblem ?? ''} You can send it from Admin → Certificates.`}
        </p>
      )}
    </article>
  );
}
