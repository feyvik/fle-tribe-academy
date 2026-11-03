import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ThemedLogo } from '../components/Logo';
import { useAuth } from '../lib/auth';
import { getWeek, phases, shortLabel } from '../lib/course';
import { ProgressProvider, useProgress } from '../lib/progress';

/** Signed-in students (and admins previewing). Sends everyone else to the right place. */
export default function StudentLayout() {
  const { profile, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullPageMessage text="Loading…" />;
  if (!profile) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (profile.must_change_password) return <Navigate to="/change-password" replace />;
  return (
    <ProgressProvider>
      <Shell />
    </ProgressProvider>
  );
}

export function FullPageMessage({ text }: { text: string }) {
  return <div className="grid min-h-screen place-items-center text-muted">{text}</div>;
}

function Shell() {
  const { profile, isAdmin, signOut } = useAuth();
  const progress = useProgress();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  if (progress.loading) return <FullPageMessage text="Loading your course…" />;

  const navItem = ({ isActive }: { isActive: boolean }) =>
    `grid grid-cols-[38px_1fr_auto] items-center gap-1.5 rounded-lg px-2.5 py-2 text-[15px] leading-tight ${isActive ? 'bg-brand text-white' : 'hover:bg-sunk'}`;

  return (
    <>
      {/* Mobile top bar */}
      <header className="no-print sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/" aria-label="FLE TRIBE home"><ThemedLogo className="h-8" /></Link>
        <button type="button" aria-expanded={menuOpen} aria-controls="course-nav" onClick={() => setMenuOpen((o) => !o)}
                className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-semibold">
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      <div className="mx-auto flex max-w-[1240px] gap-10 px-4 lg:px-8 print:block print:max-w-none print:p-0">
        <nav id="course-nav" aria-label="Course weeks"
             className={`no-print fixed inset-x-0 top-[57px] bottom-0 z-20 overflow-y-auto bg-bg px-4 pb-10 pt-4 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-72 lg:shrink-0 lg:px-0 lg:pb-16 lg:pt-10 ${menuOpen ? '' : 'hidden'}`}>
          <Link to="/" className="mb-2 hidden lg:block" aria-label="FLE TRIBE home"><ThemedLogo className="h-12" /></Link>
          <p className="mb-6 hidden font-display text-sm font-semibold text-muted lg:block">Frontend Developer Program</p>

          <div className="mb-4 flex items-center justify-between gap-2 rounded-xl border border-line bg-surface px-4 py-3">
            <Link to="/profile" className="group min-w-0" title="Edit your profile">
              <div className="truncate font-semibold group-hover:text-accent">{profile?.full_name}</div>
              <div className="truncate text-xs text-muted">{profile?.email}</div>
            </Link>
            <div className="flex shrink-0 flex-col items-end gap-0.5 text-sm font-semibold">
              <Link to="/profile" className="text-accent hover:underline">Profile</Link>
              <button type="button" onClick={() => signOut().then(() => navigate('/login'))} className="text-muted hover:text-fg">
                Sign out
              </button>
            </div>
          </div>

          {isAdmin ? (
            <Link to="/admin" className="mb-4 block rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:opacity-90">
              ← Back to admin
              <span className="block text-xs font-normal text-white/80">You're previewing the course. Every lesson is open.</span>
            </Link>
          ) : (
            <div className="mb-6 rounded-xl border border-line bg-surface p-4">
              <div className="eyebrow">Your progress</div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-sunk">
                <div className="h-full bg-ok transition-[width] duration-300" style={{ width: `${progress.percent}%` }} />
              </div>
              <p className="mt-2 font-mono text-[13px] font-semibold tabular-nums">
                {progress.completedCount} of {progress.totalCount} days done
              </p>
            </div>
          )}

          <div className="grid gap-5">
            {phases.map((phase) => (
              <div key={phase.name}>
                <div className="eyebrow mb-1.5 ml-2.5">{phase.name}</div>
                {phase.weekIds.map((id) => {
                  const week = getWeek(id)!;
                  const label = shortLabel(week);
                  return progress.weekUnlocked(id) ? (
                    <NavLink key={id} to={`/weeks/${id}`} className={navItem}>
                      {({ isActive }) => (
                        <>
                          <span className={`font-mono text-xs font-semibold ${isActive ? '' : 'text-muted'}`}>{label}</span>
                          <span>{week.title}</span>
                          <span className={`font-mono text-xs font-semibold ${isActive ? '' : 'text-ok'}`}>{progress.weekDone(id) ? '✓' : ''}</span>
                        </>
                      )}
                    </NavLink>
                  ) : (
                    <div key={id} title={week.track === 'bonus' ? 'Opens after you finish the main course' : 'Finish the week before to unlock'}
                         className="grid grid-cols-[38px_1fr_auto] items-center gap-1.5 px-2.5 py-2 text-[15px] leading-tight text-muted">
                      <span className="font-mono text-xs font-semibold">{label}</span>
                      <span>{week.title}</span>
                      <span aria-label="Locked">🔒</span>
                    </div>
                  );
                })}
              </div>
            ))}
            <div>
              <div className="eyebrow mb-1.5 ml-2.5">After the program</div>
              <NavLink to="/certificates" className={({ isActive }) => navItem({ isActive }).replace('grid-cols-[38px_1fr_auto]', 'grid-cols-[38px_1fr]')}>
                <span className="font-mono text-xs font-semibold">CERT</span>
                <span>Certificate of completion</span>
              </NavLink>
            </div>
          </div>
        </nav>

        <main className="min-w-0 flex-1 py-8 pb-20 lg:py-10 print:p-0">
          <Outlet />
        </main>
      </div>
    </>
  );
}
