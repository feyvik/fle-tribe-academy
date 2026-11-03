import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FullPageMessage } from '../components/FullPageMessage';
import { Logo, ThemedLogo } from '../components/Logo';
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

function Shell() {
  const { profile, isAdmin, signOut } = useAuth();
  const progress = useProgress();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  if (progress.loading) return <FullPageMessage text="Loading your course…" />;

  const navItem = ({ isActive }: { isActive: boolean }) =>
    `grid grid-cols-[38px_1fr_auto] items-center gap-1.5 rounded-lg px-2.5 py-2 text-[15px] leading-tight transition-colors ${
      isActive ? 'bg-side-active font-semibold text-side-active-fg' : 'text-side-fg hover:bg-side-hover'
    }`;

  return (
    <>
      {/* Mobile top bar */}
      <header className="no-print sticky top-0 z-30 flex items-center justify-between gap-3 bg-brand px-4 py-3 text-white lg:hidden">
        <Link to="/" aria-label="FLE TRIBE home"><Logo tone="white" className="h-8" /></Link>
        <button type="button" aria-expanded={menuOpen} aria-controls="course-nav" onClick={() => setMenuOpen((o) => !o)}
                className="rounded-lg bg-lime px-3 py-1.5 text-sm font-bold text-ink">
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      {/* Course navigation: purple sidebar on desktop, full-screen drawer on phones */}
      <nav id="course-nav" aria-label="Course weeks"
           className={`no-print fixed inset-x-0 bottom-0 top-[56px] z-20 overflow-y-auto overscroll-contain border-r border-side-line bg-side px-4 pb-10 pt-5 text-side-fg lg:inset-y-0 lg:left-0 lg:right-auto lg:top-0 lg:block lg:w-80 lg:px-5 lg:pt-8 ${menuOpen ? '' : 'hidden'}`}>
        <span className="absolute left-0 top-0 hidden h-2 w-24 rounded-br-full bg-lime lg:block" aria-hidden="true" />
        <Link to="/" className="mb-1 hidden lg:block" aria-label="FLE TRIBE home"><ThemedLogo className="h-12" /></Link>
        <p className="mb-6 hidden font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-side-label lg:block">Frontend Developer Program</p>

        <div className="mb-4 flex items-center justify-between gap-2 rounded-xl bg-side-card px-4 py-3 shadow-sm">
          <Link to="/profile" className="group min-w-0" title="Edit your profile">
            <div className="truncate font-semibold group-hover:text-accent">{profile?.full_name}</div>
            <div className="truncate text-xs text-side-muted">{profile?.email}</div>
          </Link>
          <div className="flex shrink-0 flex-col items-end gap-0.5 text-sm font-semibold">
            <Link to="/profile" className="text-accent hover:underline">Profile</Link>
            <button type="button" onClick={() => signOut().then(() => navigate('/login'))} className="text-side-muted hover:text-side-fg">
              Sign out
            </button>
          </div>
        </div>

        {isAdmin ? (
          <Link to="/admin" className="mb-6 block rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white hover:opacity-90">
            ← Back to admin
            <span className="block text-xs font-medium text-white/80">You're previewing the course. Every lesson is open.</span>
          </Link>
        ) : (
          <div className="mb-6 rounded-xl bg-side-card p-4 shadow-sm">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-side-label">Your progress</span>
              <span className="font-display text-lg font-extrabold tabular-nums">{progress.percent}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-side-hover">
              <div className="h-full rounded-full bg-side-active transition-[width] duration-300" style={{ width: `${progress.percent}%` }} />
            </div>
            <p className="mt-2 text-xs text-side-muted tabular-nums">{progress.completedCount} of {progress.totalCount} days done</p>
          </div>
        )}

        <div className="grid gap-5">
          {phases.map((phase) => (
            <div key={phase.name}>
              <div className="mb-1.5 ml-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-side-label">{phase.name}</div>
              {phase.weekIds.map((id) => {
                const week = getWeek(id)!;
                const label = shortLabel(week);
                return progress.weekUnlocked(id) ? (
                  <NavLink key={id} to={`/weeks/${id}`} className={navItem}>
                    {({ isActive }) => (
                      <>
                        <span className={`font-mono text-xs font-semibold ${isActive ? '' : 'text-side-muted'}`}>{label}</span>
                        <span>{week.title}</span>
                        <span className={`font-mono text-xs font-bold ${isActive ? '' : 'text-side-done'}`}>{progress.weekDone(id) ? '✓' : ''}</span>
                      </>
                    )}
                  </NavLink>
                ) : (
                  <div key={id} title={week.track === 'bonus' ? 'Opens after you finish the main course' : 'Finish the week before to unlock'}
                       className="grid grid-cols-[38px_1fr_auto] items-center gap-1.5 px-2.5 py-2 text-[15px] leading-tight text-side-muted opacity-60">
                    <span className="font-mono text-xs font-semibold">{label}</span>
                    <span>{week.title}</span>
                    <span aria-label="Locked" className="text-xs">🔒</span>
                  </div>
                );
              })}
            </div>
          ))}
          <div>
            <div className="mb-1.5 ml-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-side-label">After the program</div>
            <NavLink to="/certificates" className={({ isActive }) => navItem({ isActive }).replace('grid-cols-[38px_1fr_auto]', 'grid-cols-[38px_1fr]')}>
              <span className="font-mono text-xs font-semibold">CERT</span>
              <span>Certificate of completion</span>
            </NavLink>
          </div>
        </div>
      </nav>

      <div className="lg:pl-80 print:p-0">
        <main className="mx-auto min-w-0 max-w-[1100px] px-4 py-6 pb-20 sm:px-6 lg:px-10 lg:py-8 print:max-w-none print:p-0">
          <Outlet />
        </main>
      </div>
    </>
  );
}
