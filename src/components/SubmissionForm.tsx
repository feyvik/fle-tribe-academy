import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { DayKey } from '../data/models';
import { useAuth } from '../lib/auth';
import { dayLabel, neighbour } from '../lib/course';
import { useProgress } from '../lib/progress';
import { errorText } from '../lib/supabase';
import { LinkList, Linkify } from './Linkify';

const MAX_LINKS = 5;
const URL_OK = /^https?:\/\/\S+$/i;

/**
 * Where a student answers a day's questions and submits them, with optional links (GitHub, CodePen, articles…).
 * Submitting completes the day and unlocks the next. Answers stay editable until an admin gives feedback.
 * mode 'answers': one box per question. mode 'assignment': a link to the work plus notes for the reviewer.
 * Admins see the same form as a read-only preview.
 */
export function SubmissionForm({
  weekId,
  day,
  questions = [],
  mode = 'answers',
  heading = 'Your answers',
}: {
  weekId: string;
  day: DayKey;
  questions?: string[];
  mode?: 'answers' | 'assignment';
  heading?: string;
}) {
  const { isAdmin } = useAuth();
  const progress = useProgress();
  const submission = progress.submission(weekId, day);
  const fields = mode === 'assignment' ? ['Notes for your reviewer: what you built, one thing that broke, and how you fixed it.'] : questions;
  const next = neighbour(weekId, day, 1);

  const [answers, setAnswers] = useState<string[]>([]);
  const [link, setLink] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(false);

  // Reset whenever the lesson changes, pre-filled with any saved answers.
  useEffect(() => {
    const s = progress.submission(weekId, day);
    setAnswers(fields.map((_, i) => s?.answers[i] ?? ''));
    setLink(s?.link ?? '');
    setLinks(s?.links ?? []);
    setEditing(!s);
    setError('');
    setJustSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekId, day, progress.loading]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (isAdmin) return;
    const trimmed = answers.map((a) => a.trim());
    if (trimmed.some((a) => a.length < 10)) return setError('Answer every question with at least a full sentence.');
    if (mode === 'assignment' && !URL_OK.test(link.trim()))
      return setError('Add the link to your work, starting with https:// (for example your GitHub repo or live site).');
    const cleanLinks = links.map((l) => l.trim()).filter(Boolean);
    const bad = cleanLinks.find((l) => !URL_OK.test(l));
    if (bad) return setError(`"${bad}" isn't a full web address. Links must start with https://`);

    const firstTime = !submission;
    setBusy(true);
    setError('');
    try {
      await progress.submit(weekId, day, trimmed, link.trim() || undefined, cleanLinks);
      setLinks(cleanLinks);
      setJustSubmitted(firstTime);
      setEditing(false);
    } catch (err) {
      setError(/links/.test(String((err as Error)?.message))
        ? 'Links can’t be saved yet: the latest database update hasn’t been applied. Remove the links to submit, or ask your admin.'
        : errorText(err));
    } finally {
      setBusy(false);
    }
  }

  const showForm = isAdmin || editing;

  return (
    <section className="rounded-xl border-t-4 border-lime bg-surface p-5 shadow-sm ring-1 ring-line sm:p-6" aria-labelledby="answers-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id="answers-heading" className="text-2xl font-extrabold text-accent">{heading}</h2>
        {submission && !isAdmin && (
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${submission.reviewed_at ? 'bg-lime text-ink' : 'bg-accent-soft text-accent'}`}>
            {submission.reviewed_at ? 'Reviewed' : 'Submitted · awaiting review'}
          </span>
        )}
      </div>

      {isAdmin && (
        <p className="mb-5 rounded-lg bg-accent-soft px-4 py-3 text-sm">
          <b>Preview.</b> This is the form students fill in. Submitting completes the day and unlocks the next one. Admins can't submit.
        </p>
      )}

      {showForm ? (
        <form className="grid gap-5" onSubmit={onSubmit} noValidate>
          <fieldset disabled={isAdmin} className="m-0 grid gap-5 border-0 p-0">
            {mode === 'assignment' && (
              <div className="grid gap-1.5">
                <label htmlFor="sub-link" className="font-semibold">Link to your work</label>
                <input id="sub-link" type="url" placeholder="https://github.com/you/project" value={link}
                       onChange={(e) => setLink(e.target.value)} className="rounded-lg border border-line bg-bg px-3 py-2.5 disabled:opacity-70" />
              </div>
            )}

            {fields.map((q, i) => (
              <div key={i} className="grid gap-1.5">
                <label htmlFor={`answer-${i}`} className="rich font-semibold">
                  {mode === 'answers' && <span className="text-muted">{i + 1}. </span>}
                  <span dangerouslySetInnerHTML={{ __html: q }} />
                </label>
                <textarea id={`answer-${i}`} rows={5} placeholder="Answer in your own words. You can paste links too." value={answers[i] ?? ''}
                          onChange={(e) => setAnswers((a) => a.map((v, j) => (j === i ? e.target.value : v)))}
                          className="rounded-lg border border-line bg-bg px-3 py-2.5 leading-relaxed disabled:opacity-70" />
              </div>
            ))}

            {/* Optional links: GitHub repos, CodePens, articles that helped, screenshots… */}
            <div className="grid gap-2 rounded-lg bg-sunk p-4">
              <div>
                <span className="font-semibold">{mode === 'assignment' ? 'More links' : 'Links'} <span className="font-normal text-muted">(optional)</span></span>
                <p className="m-0 text-sm text-muted">Add up to {MAX_LINKS} links: your code on GitHub or CodePen, screenshots, or articles that helped you.</p>
              </div>
              {links.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <label htmlFor={`extra-link-${i}`} className="sr-only">Link {i + 1}</label>
                  <input id={`extra-link-${i}`} type="url" placeholder="https://" value={l}
                         onChange={(e) => setLinks((all) => all.map((v, j) => (j === i ? e.target.value : v)))}
                         className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 disabled:opacity-70" />
                  <button type="button" onClick={() => setLinks((all) => all.filter((_, j) => j !== i))}
                          className="shrink-0 rounded-lg px-3 text-sm font-semibold text-fri hover:bg-fri-soft" aria-label={`Remove link ${i + 1}`}>
                    Remove
                  </button>
                </div>
              ))}
              {links.length < MAX_LINKS && (
                <button type="button" onClick={() => setLinks((all) => [...all, ''])}
                        className="justify-self-start rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-semibold hover:border-fg">
                  + Add a link
                </button>
              )}
            </div>
          </fieldset>

          {error && <p className="m-0 rounded-lg bg-fri-soft px-3 py-2 text-sm font-semibold text-fri" role="alert">{error}</p>}

          {!isAdmin && (
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" disabled={busy} className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60">
                {busy ? 'Submitting…' : submission ? 'Save changes' : 'Submit and unlock next lesson'}
              </button>
              {submission && <button type="button" className="font-semibold text-muted hover:text-fg" onClick={() => setEditing(false)}>Cancel</button>}
            </div>
          )}
        </form>
      ) : submission ? (
        <>
          {justSubmitted && next && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-lime px-4 py-3 text-ink">
              <span className="font-semibold">Submitted. {dayLabel(next.weekId, next.day)} is now unlocked.</span>
              <Link to={`/weeks/${next.weekId}/${next.day}`} className="font-bold underline">Go to it →</Link>
            </div>
          )}
          <dl className="grid gap-4">
            {submission.link && (
              <div>
                <dt className="eyebrow mb-1">Link to your work</dt>
                <dd className="m-0"><LinkList links={[submission.link]} /></dd>
              </div>
            )}
            {fields.map((q, i) => (
              <div key={i}>
                <dt className="rich mb-1 text-sm font-semibold text-muted" dangerouslySetInnerHTML={{ __html: q }} />
                <dd className="m-0 whitespace-pre-wrap"><Linkify text={submission.answers[i] ?? ''} /></dd>
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
            <div className="mt-5 rounded-lg bg-sat-soft p-4">
              <div className="eyebrow mb-1 !text-sat">Feedback from FLE TRIBE</div>
              <p className="m-0 whitespace-pre-wrap"><Linkify text={submission.feedback} /></p>
            </div>
          ) : (
            <button type="button" className="mt-5 font-semibold text-accent hover:underline" onClick={() => setEditing(true)}>Edit answers</button>
          )}
        </>
      ) : null}
    </section>
  );
}
