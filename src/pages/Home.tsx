import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { getWeek, phases, weekLabel } from '../lib/course';
import { useProgress } from '../lib/progress';

const rhythm = [
  { day: 'MON', text: 'Research & learn', tone: 'study' },
  { day: 'TUE', text: 'Research & learn', tone: 'study' },
  { day: 'WED', text: 'Research & learn', tone: 'study' },
  { day: 'THU', text: 'Research & learn', tone: 'study' },
  { day: 'FRI', text: 'Assignment: build & submit', tone: 'fri' },
  { day: 'SAT', text: 'Weekly review session', tone: 'sat' },
] as const;

const toneBg = { study: 'bg-accent-soft', fri: 'bg-fri-soft', sat: 'bg-sat-soft' };
const toneText = { study: 'text-accent', fri: 'text-fri', sat: 'text-sat' };

export default function Home() {
  const progress = useProgress();
  const next = progress.nextUp;

  return (
    <>
      <section className="grid gap-6">
        {/* Brand band, echoing the certificate: purple field, lime tabs */}
        <div className="relative overflow-clip rounded-2xl bg-brand px-6 pb-9 pt-8 text-white sm:px-10 sm:pb-12 sm:pt-11">
          <span className="absolute left-0 top-0 h-3 w-28 rounded-br-full bg-lime sm:w-44" aria-hidden="true" />
          <span className="absolute bottom-0 right-0 h-3 w-28 rounded-tl-full bg-lime sm:w-44" aria-hidden="true" />
          <Logo variant="icon" tone="white" className="pointer-events-none absolute -right-10 -top-6 h-64 opacity-[0.07] sm:h-80" />
          <div className="relative grid gap-5">
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-lime">FLE TRIBE · Frontend Developer Program</div>
            <h1 className="max-w-[20ch] text-4xl font-extrabold tracking-tight sm:text-6xl">
              From "what is a browser?" to shipping a <span className="text-lime">React</span> app.
            </h1>
            <p className="max-w-[60ch] text-lg text-white/80">
              A 5-month journey through HTML, CSS, Bootstrap, JavaScript and React, ending with your app live on Vercel. Optional bonus courses in TypeScript, Tailwind, testing and AI.
              Research Monday to Thursday, build on Friday, talk it through on Saturday.
            </p>
            <div className="flex flex-wrap gap-3">
              {next ? (
                <Link to={`/weeks/${next.weekId}/${next.day}`} className="rounded-lg bg-lime px-5 py-3 font-bold text-ink hover:brightness-95">
                  {progress.completedCount ? 'Continue learning' : 'Start Week 00'} →
                </Link>
              ) : (
                <Link to="/certificates" className="rounded-lg bg-lime px-5 py-3 font-bold text-ink">Course complete ✓ See your certificate</Link>
              )}
              <Link to="/weeks/w0" className="rounded-lg border border-white/40 px-5 py-3 font-semibold hover:bg-white/10">Read the orientation</Link>
            </div>
          </div>
        </div>

        <p className="max-w-[64ch] text-muted">
          Each lesson has a video or a PDF, the topics to learn, and research questions you answer and submit. Submitting a lesson
          unlocks the next one.
        </p>

        <ol className="grid max-w-3xl grid-cols-3 gap-1.5 sm:grid-cols-6" aria-label="Weekly rhythm">
          {rhythm.map((r) => (
            <li key={r.day} className={`rounded-lg px-3 pb-3 pt-2.5 ${toneBg[r.tone]}`}>
              <b className={`block font-mono text-xs tracking-wider ${toneText[r.tone]}`}>{r.day}</b>
              <small className="mt-1 block text-[13px] leading-snug">{r.text}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-line bg-surface p-5">
          <h2 className="mb-2 text-lg font-bold">1. Learning structure</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li><b>Monday–Thursday:</b> daily research and learning from the roadmap. It shows what to focus on each day while you build the research skills you need to teach yourself.</li>
            <li><b>Friday:</b> assignment day. Complete and submit your task.</li>
            <li><b>Saturday:</b> weekly review session to discuss progress and challenges.</li>
          </ul>
        </article>
        <article className="rounded-xl border border-line bg-surface p-5">
          <h2 className="mb-2 text-lg font-bold">2. Assignments &amp; submissions</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Every Friday you get a task based on that week's learning.</li>
            <li>Complete it <b>independently</b>.</li>
            <li>Submit it by <b>end of day (23:59)</b>.</li>
            <li>Be ready to <b>discuss your work</b> at the Saturday review.</li>
          </ul>
        </article>
        <article className="rounded-xl border border-line bg-surface p-5">
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
        <div className="grid gap-8">
          {phases.map((phase) => (
            <div key={phase.name}>
              <div className="eyebrow mb-3">{phase.name}</div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {phase.weekIds.map((id) => {
                  const week = getWeek(id)!;
                  const open = progress.weekUnlocked(id);
                  const count = (['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const).filter((d) => progress.isDone(id, d)).length;
                  const body = (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-accent">{weekLabel(week)}</span>
                        <span className="font-mono text-xs tabular-nums text-muted">{open ? `${count}/6` : '🔒'}</span>
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-accent">{week.title}</h3>
                      <div className="h-1.5 overflow-hidden rounded-full bg-sunk">
                        <div className="h-full bg-ok" style={{ width: `${(count / 6) * 100}%` }} />
                      </div>
                    </>
                  );
                  return open ? (
                    <Link key={id} to={`/weeks/${id}`} className="group grid gap-2 rounded-xl border border-line bg-surface p-4 hover:border-fg">{body}</Link>
                  ) : (
                    <div key={id} className="grid gap-2 rounded-xl border border-line bg-surface p-4 opacity-60">{body}</div>
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
