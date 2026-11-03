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
  const dayPill = { study: 'bg-brand text-white', fri: 'bg-[#c23a37] text-white', sat: 'bg-lime text-ink' };

  return (
    <>
      <PageHeader eyebrow={w.track === 'bonus' ? 'Optional bonus course · opens after the main course' : `Week ${w.number}`} title={w.title}>
        <b className="text-white">{w.track === 'bonus' ? 'By the end you can:' : 'By Saturday you can:'}</b> {w.goal}
      </PageHeader>

      {!progress.weekUnlocked(w.id) && (
        <p className="mb-6 rounded-lg bg-sunk px-4 py-3 text-sm font-semibold">🔒 This week opens once you've submitted everything in the week before it.</p>
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
            <li key={row.day} className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-2 rounded-xl p-4 sm:grid-cols-[96px_minmax(0,1fr)_auto] ${rowBg[row.tone]} ${open ? '' : 'opacity-60'}`}>
              <span className={`w-14 rounded-md py-1 text-center font-mono text-xs font-bold tracking-wider ${dayPill[row.tone]}`}>{row.day.toUpperCase()}</span>
              {open ? <Link to={row.day} className="group min-w-0">{text}</Link> : <div className="min-w-0">{text}</div>}
              <div className="col-span-2 sm:col-span-1">
                {progress.isDone(w.id, row.day) ? (
                  <span className="rounded-full bg-lime px-3 py-1 text-xs font-bold text-ink">✓ Submitted</span>
                ) : open ? (
                  <Link to={row.day} className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">Open →</Link>
                ) : (
                  <span className="text-xs font-bold text-muted">🔒 Locked</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {w.extra === 'orientation' && <Orientation />}

      <nav className="mt-10 flex justify-between gap-3" aria-label="Weeks">
        {prev ? (
          <Link to={`/weeks/${prev.id}`} className="rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold hover:border-fg">← {weekLabel(prev)}</Link>
        ) : <span />}
        {next && (progress.weekUnlocked(next.id) ? (
          <Link to={`/weeks/${next.id}`} className="rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold hover:border-fg">{weekLabel(next)} →</Link>
        ) : (
          <span className="rounded-lg border border-dashed border-line px-4 py-2.5 text-sm font-semibold text-muted">🔒 {weekLabel(next)}</span>
        ))}
      </nav>
    </>
  );
}
