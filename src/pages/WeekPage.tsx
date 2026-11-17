import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Orientation } from '../components/Orientation';
import type { DayKey } from '../data/models';
import { DAY_NAMES, getWeek, weekLabel, weekOrder, weekHeading } from '../lib/course';
import { useProgress } from '../lib/progress';
import { PageHeader } from '../components/PageHeader';

export default function WeekPage() {
  const { weekId = '' } = useParams();
  const progress = useProgress();
  const w = getWeek(weekId);

  useEffect(() => {
    if (w) document.title = `${weekHeading(w)} · FLE TRIBE`;
  }, [w]);

  if (!w) return <Navigate to="/" replace />;

  const i = weekOrder.indexOf(w.id);
  const prev = getWeek(weekOrder[i - 1]);
  const next = getWeek(weekOrder[i + 1]);
  const mediaTag = (key: string) => {
    const m = progress.media(key);
    return m ? (m.kind === 'pdf' ? ' · PDF' : ' · Video') : '';
  };

  const rows: { day: DayKey; tone: 'study' | 'fri' | 'sat'; eyebrow?: string; title: string; detail: string }[] = [
    ...w.lessons.map((l) => ({
      day: l.day,
      tone: 'study' as const,
      title: l.title,
      detail: `${DAY_NAMES[l.day]} · ${l.research.length} research questions${mediaTag(l.id)}`,
    })),
    { day: 'fri', tone: 'fri', eyebrow: 'Assignment · due 23:59', title: w.assignment.title, detail: w.assignment.brief },
    { day: 'sat', tone: 'sat', eyebrow: 'Weekly review', title: 'Progress & challenges', detail: `${w.review.questions.length} reflection questions` },
  ];
  const rowBg = { study: 'border border-line bg-surface shadow-sm', fri: 'border border-transparent bg-fri-soft', sat: 'border border-transparent bg-sat-soft' };
  const dayPill = { study: 'bg-primary text-on-primary', fri: 'bg-coral text-white', sat: 'bg-lime text-ink' };

  return (
    <>
      <PageHeader eyebrow={w.track === 'bonus' ? 'Optional bonus course · opens after the main course' : `Week ${w.number}`} title={w.title}>
        <b className="text-white">{w.track === 'bonus' ? 'By the end you can:' : 'By Saturday you can:'}</b> {w.goal}
      </PageHeader>

      {!progress.weekUnlocked(w.id) && (
        <div className="fle-callout fle-callout-heads-up mb-6">
          <span className="fle-callout-label">🔒 Locked</span>
          <span className="fle-callout-body">This week opens once you've submitted everything in the week before it.</span>
        </div>
      )}

      <ol className="grid gap-3">
        {rows.map((row) => {
          const open = progress.isUnlocked(w.id, row.day);
          const text = (
            <>
              {row.eyebrow && <span className="eyebrow">{row.eyebrow}</span>}
              <span className="block text-lg font-bold group-hover:text-accent">{row.title}</span>
              <span className="text-sm text-muted">{row.detail}</span>
            </>
          );
          return (
            <li key={row.day} className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-2 rounded-lg p-4 sm:grid-cols-[96px_minmax(0,1fr)_auto] ${rowBg[row.tone]} ${open ? '' : 'opacity-60'}`}>
              <span className={`w-14 rounded-sm py-1 text-center text-overline ${dayPill[row.tone]}`}>{row.day.toUpperCase()}</span>
              {open ? <Link to={row.day} className="group min-w-0">{text}</Link> : <div className="min-w-0">{text}</div>}
              <div className="col-span-2 sm:col-span-1">
                {progress.isDone(w.id, row.day) ? (
                  <span className="fle-tag fle-tag-lime">✓ Submitted</span>
                ) : open ? (
                  <Link to={row.day} className="fle-btn fle-btn-primary fle-btn-sm">Open →</Link>
                ) : (
                  <span className="fle-tag fle-tag-neutral">🔒 Locked</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {w.extra === 'orientation' && <Orientation />}

      <nav className="mt-10 flex justify-between gap-3" aria-label="Weeks">
        {prev ? (
          <Link to={`/weeks/${prev.id}`} className="fle-btn fle-btn-secondary fle-btn-md">← {weekLabel(prev)}</Link>
        ) : <span />}
        {next && (progress.weekUnlocked(next.id) ? (
          <Link to={`/weeks/${next.id}`} className="fle-btn fle-btn-secondary fle-btn-md">{weekLabel(next)} →</Link>
        ) : (
          <span className="rounded-md border border-dashed border-line px-4 py-2.5 text-sm font-semibold text-muted">🔒 {weekLabel(next)}</span>
        ))}
      </nav>
    </>
  );
}
