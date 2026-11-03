/** Extra reference material for Week 00: career paths and what is (and isn't) frontend. */
const roles = [
  { role: 'Frontend', builds: 'The interface in the browser: pages, components, interactions', tools: 'HTML, CSS, JavaScript, Bootstrap, React', overlap: 'This course' },
  { role: 'Backend', builds: 'APIs, business logic, databases, authentication', tools: 'Node, Java, C#, Python, SQL', overlap: 'You call their APIs' },
  { role: 'Full-stack', builds: 'Both sides of a feature', tools: 'Frontend + backend stack', overlap: 'A common next step' },
  { role: 'Mobile', builds: 'iOS and Android apps', tools: 'Swift, Kotlin, Flutter, React Native', overlap: 'Shared UI thinking' },
  { role: 'DevOps / Cloud', builds: 'Servers, pipelines, deployment, monitoring', tools: 'AWS, Azure, Docker, CI/CD', overlap: 'You deploy on what they run' },
  { role: 'QA / Test', builds: 'Test plans, automated tests', tools: 'Playwright, Cypress', overlap: 'Same browser tools' },
  { role: 'UI/UX Design', builds: 'Research, flows, visual design', tools: 'Figma', overlap: 'You turn their designs into code' },
  { role: 'Data / AI', builds: 'Analysis, models, dashboards', tools: 'Python, SQL', overlap: 'You visualise their results' },
];

const ladder = ['Intern', 'Junior (0–2 yrs)', 'Mid (2–5)', 'Senior (5+)', 'Lead / Staff / Manager'];

const sorts = [
  { name: 'Frontend', tone: 'border-t-ok', items: ['Turning designs into pages and components', 'Layout, styling, responsive design', 'Interactivity and client-side state', 'Accessibility (keyboard, screen readers)', 'Page speed in the browser', 'Displaying data from APIs'] },
  { name: 'Not frontend', tone: 'border-t-fri', items: ['Designing database tables', 'Writing server APIs and business rules', 'Configuring servers and networks', 'Training machine-learning models', 'Creating the brand or visual design itself'] },
  { name: "Gray areas you'll meet", tone: 'border-t-sat', items: ['Reading API docs and agreeing on data shapes', 'Deploying the frontend', 'Server-side rendering (Next.js)', 'Small design decisions when no designer is around', 'Writing UI tests'] },
];

export function Orientation() {
  return (
    <div className="mt-12 grid gap-6">
      <h2 className="text-2xl font-extrabold">Career paths at a glance</h2>
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[640px] border-collapse text-[15px]">
          <thead>
            <tr className="eyebrow text-left">
              <th className="px-4 py-3">Role</th><th className="px-4 py-3">What they build</th><th className="px-4 py-3">Core tools</th><th className="px-4 py-3">Overlap with frontend</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.role} className="border-t border-line align-top">
                <td className="whitespace-nowrap px-4 py-2.5 font-bold">{r.role}</td>
                <td className="px-4 py-2.5">{r.builds}</td>
                <td className="px-4 py-2.5">{r.tools}</td>
                <td className="px-4 py-2.5">{r.overlap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[13px] font-semibold" aria-label="Career ladder">
        {ladder.map((step, i) => (
          <li key={step} className="flex items-center gap-1.5">
            <span className="rounded-md bg-sunk px-2.5 py-1.5">{step}</span>
            {i < ladder.length - 1 && <span className="text-muted" aria-hidden="true">→</span>}
          </li>
        ))}
      </ol>

      <h2 className="mt-4 text-2xl font-extrabold">Is it frontend?</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {sorts.map((s) => (
          <section key={s.name} className={`rounded-xl border border-line border-t-4 bg-surface p-5 ${s.tone}`}>
            <h3 className="mb-2 text-base font-bold">{s.name}</h3>
            <ul className="list-disc space-y-1 pl-5">{s.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ))}
      </div>
    </div>
  );
}
