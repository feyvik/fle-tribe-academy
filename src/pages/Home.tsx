import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { DAY_KEYS, getWeek, phases, weekLabel } from '../lib/course';
import { useProgress } from '../lib/progress';

const rhythm = [
  { day: 'MON', text: 'Research & learn', tone: 'study' },
  { day: 'TUE', text: 'Research & learn', tone: 'study' },
  { day: 'WED', text: 'Research & learn', tone: 'study' },
  { day: 'THU', text: 'Research & learn', tone: 'study' },
  { day: 'FRI', text: 'Assignment: build & submit', tone: 'fri' },
  { day: 'SAT', text: 'Weekly review session', tone: 'sat' },
] as const;

/** The brand's three pillars (brand kit illustrations), one per part of the learning model. */
const pillars = [
  { name: 'Learn', art: '/brand/pillars/learn.svg' },
  { name: 'Forge', art: '/brand/pillars/forge.svg' },
  { name: 'Evolve', art: '/brand/pillars/evolve.svg' },
];

const toneBg = { study: 'bg-accent-soft', fri: 'bg-fri-soft', sat: 'bg-sat-soft' };
const toneText = { study: 'text-accent', fri: 'text-fri', sat: 'text-sat' };

export default function Home() {
  const progress = useProgress();
  const next = progress.nextUp;
  const daysDone = (weekId: string) => DAY_KEYS.filter((d) => progress.isDone(weekId, d)).length;
  const weekDone = (weekId: string) => daysDone(weekId) === DAY_KEYS.length;
  // Stage tracker: a month is done when every week in it is done; the current one holds your next lesson.
  const stages = phases.map((p) => ({
    name: p.name.split(' · ')[0],
    detail: p.name.split(' · ')[1] ?? '',
    state: p.weekIds.every(weekDone) ? 'done' : next && p.weekIds.includes(next.weekId) ? 'current' : 'upcoming',
  }));

  return (
    <>
      <section className="grid gap-6">
        {/* Brand band, echoing the certificate: purple field, lime tabs */}
        <div className="relative overflow-clip rounded-2xl bg-brand px-6 pb-9 pt-8 text-white sm:px-10 sm:pb-12 sm:pt-11">
          <span className="absolute left-0 top-0 h-3 w-28 rounded-br-full bg-lime sm:w-44" aria-hidden="true" />
          <span className="absolute bottom-0 right-0 h-3 w-28 rounded-tl-full bg-lime sm:w-44" aria-hidden="true" />
          <Logo variant="icon" tone="white" decorative className="pointer-events-none absolute -right-10 -top-6 h-64 opacity-[0.07] sm:h-80" />
          <div className="relative grid gap-5">
            <div className="text-overline text-lime">FLE TRIBE · Frontend Developer Program</div>
            <h1 className="max-w-[20ch] text-4xl font-extrabold tracking-tight sm:text-6xl">
              From "what is a browser?" to shipping a <span className="text-lime">React</span> app.
            </h1>
            <p className="max-w-[60ch] text-lg text-white/80">
              A 5-month journey through HTML, CSS, Bootstrap, JavaScript and React, ending with your app live on Vercel. Optional bonus courses in TypeScript, Tailwind, testing and AI.
              Research Monday to Thursday, build on Friday, talk it through on Saturday.
            </p>
            <div className="flex flex-wrap gap-3">
              {next ? (
                <Link to={`/weeks/${next.weekId}/${next.day}`} className="fle-btn fle-btn-win fle-btn-lg hover:brightness-95">
                  {progress.completedCount ? 'Continue learning' : 'Start Week 00'} →
                </Link>
              ) : (
                <Link to="/certificates" className="fle-btn fle-btn-win fle-btn-lg hover:brightness-95">Course complete ✓ See your certificate</Link>
              )}
              <Link to="/weeks/w0" className="inline-flex h-12 items-center rounded-md border border-white/40 px-6 font-semibold text-white hover:bg-white/10">Read the orientation</Link>
            </div>
          </div>
        </div>

        <p className="max-w-[64ch] text-muted">
          Each lesson has a video or a PDF, the topics to learn, and research questions you answer and submit. Submitting a lesson
          unlocks the next one.
        </p>

        <ol className="grid max-w-3xl grid-cols-3 gap-1.5 sm:grid-cols-6" aria-label="Weekly rhythm">
          {rhythm.map((r) => (
            <li key={r.day} className={`rounded-md px-3 pb-3 pt-2.5 ${toneBg[r.tone]}`}>
              <b className={`block text-overline ${toneText[r.tone]}`}>{r.day}</b>
              <small className="mt-1 block text-[13px] leading-snug">{r.text}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <img src={pillars[0].art} alt="" width={56} height={56} className="mb-4 size-14" />
          <div className="text-overline text-accent">{pillars[0].name}</div>
          <h2 className="mb-2 text-lg font-bold">Learning structure</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li><b>Monday–Thursday:</b> daily research and learning from the roadmap. It shows what to focus on each day while you build the research skills you need to teach yourself.</li>
            <li><b>Friday:</b> assignment day. Complete and submit your task.</li>
            <li><b>Saturday:</b> weekly review session to discuss progress and challenges.</li>
          </ul>
        </article>
        <article className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <img src={pillars[1].art} alt="" width={56} height={56} className="mb-4 size-14" />
          <div className="text-overline text-accent">{pillars[1].name}</div>
          <h2 className="mb-2 text-lg font-bold">Assignments &amp; submissions</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Every Friday you get a task based on that week's learning.</li>
            <li>Complete it <b>independently</b>.</li>
            <li>Submit it by <b>end of day (23:59)</b>.</li>
            <li>Be ready to <b>discuss your work</b> at the Saturday review.</li>
          </ul>
        </article>
        <article className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <img src={pillars[2].art} alt="" width={56} height={56} className="mb-4 size-14" />
          <div className="text-overline text-accent">{pillars[2].name}</div>
          <h2 className="mb-2 text-lg font-bold">How work is reviewed</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li><b>Works</b>: it does what the brief asks.</li>
            <li><b>Clean</b>: readable, well named, no dead code.</li>
            <li><b>Understood</b>: you can explain every line.</li>
            <li><b>Shipped</b>: on time, with a short README.</li>
          </ul>
        </article>
      </section>

      <section className="mt-14">
        <h2 className="mb-5 text-2xl font-extrabold">The roadmap</h2>
        <ol className="fle-stages mb-10" aria-label="Your stages">
          {stages.map((s, i) => (
            <li key={s.name} className={`fle-stage fle-stage-${s.state}`} aria-current={s.state === 'current' ? 'step' : undefined}>
              <span className="fle-stage-node" aria-hidden="true">{s.state === 'done' ? '✓' : i + 1}</span>
              <span className="fle-stage-text">
                <span className="fle-stage-name">{s.name}</span>
                <span className="fle-stage-state">{s.state === 'done' ? 'Done' : s.state === 'current' ? 'You are here' : s.detail}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="grid gap-8">
          {phases.map((phase) => (
            <div key={phase.name}>
              <div className="eyebrow mb-3">{phase.name}</div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {phase.weekIds.map((id) => {
                  const week = getWeek(id)!;
                  const open = progress.weekUnlocked(id);
                  const count = daysDone(id);
                  const state = !open ? 'locked' : count === 6 ? 'done' : next?.weekId === id ? 'current' : 'open';
                  const body = (
                    <>
                      <div className="fle-lesson-top">
                        <span className="fle-overline">{weekLabel(week)}</span>
                        {state === 'done' && <span className="fle-tag fle-tag-lime">✓ Completed</span>}
                        {state === 'current' && <span className="fle-tag fle-tag-primary">In progress</span>}
                        {state === 'locked' && <span className="fle-tag fle-tag-neutral">🔒 Locked</span>}
                      </div>
                      <h3 className="fle-lesson-title group-hover:text-accent">{week.title}</h3>
                      <div className="fle-progress">
                        <div className="fle-progress-head">
                          <span>Days submitted</span>
                          <span className="fle-progress-value">{count}/6</span>
                        </div>
                        <div className="fle-progress-track">
                          <div className={`fle-progress-fill ${count === 6 ? 'fle-progress-lime' : 'fle-progress-primary'}`} style={{ width: `${(count / 6) * 100}%` }} />
                        </div>
                      </div>
                    </>
                  );
                  return open ? (
                    <Link key={id} to={`/weeks/${id}`} className={`group fle-lesson hover:border-primary ${state === 'current' ? 'fle-lesson-in-progress' : ''}`}>{body}</Link>
                  ) : (
                    <div key={id} className="fle-lesson fle-lesson-locked">{body}</div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
