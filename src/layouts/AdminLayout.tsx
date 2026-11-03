import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ThemedLogo } from '../components/Logo';
import { useAuth } from '../lib/auth';
import { FullPageMessage } from './StudentLayout';

const tabs = [
  { to: 'students', label: 'Students' },
  { to: 'content', label: 'Lesson media' },
  { to: 'submissions', label: 'Submissions' },
  { to: 'certificates', label: 'Certificates' },
];

export default function AdminLayout() {
  const { profile, loading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return <FullPageMessage text="Loading…" />;
  if (!profile) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (profile.must_change_password) return <Navigate to="/change-password" replace />;
  if (profile.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/admin" aria-label="Admin home"><ThemedLogo className="h-9" /></Link>
            <span className="rounded-md bg-brand px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-white">Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="font-semibold text-accent hover:underline">Preview course</Link>
            <span className="hidden text-muted sm:inline">{profile.full_name}</span>
            <button type="button" onClick={() => signOut().then(() => navigate('/login'))} className="font-semibold hover:text-accent">Sign out</button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1240px] gap-1 overflow-x-auto px-4 lg:px-8" aria-label="Admin sections">
          {tabs.map((t) => (
            <NavLink key={t.to} to={t.to}
                     className={({ isActive }) => `whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold ${isActive ? 'border-brand text-fg' : 'border-transparent text-muted hover:text-fg'}`}>
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-[1240px] px-4 py-8 pb-20 lg:px-8">
        <Outlet />
      </main>
    </>
  );
}
