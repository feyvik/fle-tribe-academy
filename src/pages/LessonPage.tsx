import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { MediaPlayer } from '../components/MediaPlayer';
import { SubmissionForm } from '../components/SubmissionForm';
import type { DayKey } from '../data/models';
import { DAY_KEYS, DAY_NAMES, dayLabel, getWeek, neighbour, weekHeading } from '../lib/course';
import { useProgress } from '../lib/progress';
import { PageHeader } from '../components/PageHeader';

/** One day of a week: a study lesson (Mon–Thu), the Friday assignment, or the Saturday review. */
export default function LessonPage() {
  const { weekId = '', day: dayParam = '' } = useParams();
  const progress = useProgress();
  const w = getWeek(weekId);
  const day = dayParam as DayKey;
  const lesson = w?.lessons.find((l) => l.day === day);
  const title = lesson?.title ?? (day === 'fri' ? w?.assignment.title : 'Weekly review');

  useEffect(() => {
    if (w && title) document.title = `${title} · FLE TRIBE`;
  }, [w, title]);

  if (!w || !DAY_KEYS.includes(day)) return <Navigate to="/" replace />;

  const prev = neighbour(w.id, day, -1);
  const next = neighbour(w.id, day, 1);
  const media = progress.media(`${w.id}-${day}`);

  return (
    <>
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-fg">Home</Link> <span>/</span>
        <Link to={`/weeks/${w.id}`} className="hover:text-fg">{weekHeading(w)}</Link> <span>/</span>
        <span className="text-fg">{DAY_NAMES[day]}</span>
      </nav>

      {!progress.isUnlocked(w.id, day) ? (
        <div className="grid max-w-xl gap-4 rounded-xl border border-line bg-surface p-8">
          <span className="text-4xl" aria-hidden="true">🔒</span>
          <h1 className="text-2xl font-extrabold">This lesson is locked</h1>
          <p className="m-0 text-muted">Lessons open one at a time. Submit your answers for the lesson before this one to unlock it.</p>
          {progress.nextUp && (
            <Link to={`/weeks/${progress.nextUp.weekId}/${progress.nextUp.day}`}
                  className="justify-self-start rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:opacity-90">
              Go to your next lesson: {dayLabel(progress.nextUp.weekId, progress.nextUp.day)} →
            </Link>
          )}
        </div>
      ) : lesson ? (
        <>
          <PageHeader eyebrow={`${DAY_NAMES[day]} · Research & learn`} title={lesson.title} />
          <MediaPlayer media={media} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <section className="rich rounded-xl border border-line bg-surface p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-bold text-accent">What you'll learn</h2>
              <ul className="list-disc space-y-1.5 pl-5">
                {lesson.learn.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}
              </ul>
            </section>
            <aside className="self-start rounded-xl bg-brand p-5 text-white">
              <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-lime">Start your research here</h2>
              <ul className="grid gap-2">
                {lesson.resources.map((r) => (
                  <li key={r.url}><a href={r.url} target="_blank" rel="noopener" className="font-semibold text-white underline decoration-lime decoration-2 underline-offset-4 hover:text-lime">{r.label} ↗</a></li>
                ))}
              </ul>
            </aside>
          </div>
          <div className="mt-8"><SubmissionForm weekId={w.id} day={day} questions={lesson.research} heading="Research questions" /></div>
        </>
      ) : day === 'fri' ? (
        <>
          <PageHeader tone="coral" eyebrow="Friday · Assignment · due 23:59" title={w.assignment.title}>{w.assignment.brief}</PageHeader>
          {media && <div className="mb-8"><MediaPlayer media={media} /></div>}
          <div className="rich grid gap-6 rounded-xl bg-fri-soft p-6">
            <section>
              <h2 className="eyebrow mb-3 !text-fri">Done when</h2>
              <ul className="space-y-2">
                {w.assignment.doneWhen.map((item, i) => (
                  <li key={i} className="flex gap-3"><span className="text-fri" aria-hidden="true">□</span><span dangerouslySetInnerHTML={{ __html: item }} /></li>
                ))}
              </ul>
            </section>
            <section className="grid gap-1">
              <h2 className="eyebrow !text-fri">How to submit</h2>
              <p className="m-0">{w.assignment.submit}, by 23:59 today.</p>
              <p className="m-0 text-sm text-muted">Complete the task independently and be ready to discuss it at Saturday's review.</p>
            </section>
          </div>
          <div className="mt-8"><SubmissionForm weekId={w.id} day="fri" mode="assignment" heading="Submit your assignment" /></div>
        </>
      ) : (
        <>
          <PageHeader tone="ink" eyebrow="Saturday · Weekly review" title="Progress & challenges">
            Bring your submission and your journal. Each student shares what they built, one blocker and one win.
          </PageHeader>
          <div className="rounded-xl bg-sat-soft p-6">
            <h2 className="eyebrow mb-3 !text-sat">Prepare</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Have your Friday submission open and ready to show.</li>
              <li>Note one thing that broke and how you fixed it.</li>
              <li>Bring one question you still can't answer.</li>
            </ul>
          </div>
          <div className="mt-8"><SubmissionForm weekId={w.id} day="sat" questions={w.review.questions} heading="Your reflection" /></div>
        </>
      )}

      <nav className="mt-10 grid gap-3 sm:grid-cols-2" aria-label="Lessons">
        {prev ? (
          <Link to={`/weeks/${prev.weekId}/${prev.day}`} className="rounded-xl border border-line bg-surface p-4 hover:border-fg">
            <span className="eyebrow">← Previous</span>
            <span className="mt-1 block font-semibold">{dayLabel(prev.weekId, prev.day)}</span>
          </Link>
        ) : <span />}
        {next && (progress.isUnlocked(next.weekId, next.day) ? (
          <Link to={`/weeks/${next.weekId}/${next.day}`} className="rounded-xl border border-line bg-surface p-4 text-right hover:border-fg">
            <span className="eyebrow">Next →</span>
            <span className="mt-1 block font-semibold">{dayLabel(next.weekId, next.day)}</span>
          </Link>
        ) : (
          <div className="rounded-xl border border-dashed border-line p-4 text-right text-muted">
            <span className="eyebrow">Next · 🔒 locked</span>
            <span className="mt-1 block font-semibold">{dayLabel(next.weekId, next.day)}</span>
            <span className="block text-sm">Submit this lesson to unlock it.</span>
          </div>
        ))}
      </nav>
    </>
  );
}
