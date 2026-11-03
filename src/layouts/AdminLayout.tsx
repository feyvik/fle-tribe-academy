import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useAuth } from '../lib/auth';
import { FullPageMessage } from '../components/FullPageMessage';

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
      <header className="relative bg-brand text-white">
        <span className="absolute left-0 top-0 h-2 w-28 rounded-br-full bg-lime" aria-hidden="true" />
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/admin" aria-label="Admin home"><Logo tone="white" className="h-10" /></Link>
            <span className="rounded-md bg-lime px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink">Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="font-semibold text-lime hover:underline">Preview course</Link>
            <span className="hidden text-white/75 sm:inline">{profile.full_name}</span>
            <button type="button" onClick={() => signOut().then(() => navigate('/login'))} className="font-semibold text-white hover:text-lime">Sign out</button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1240px] gap-1 overflow-x-auto px-4 lg:px-8" aria-label="Admin sections">
          {tabs.map((t) => (
            <NavLink key={t.to} to={t.to}
                     className={({ isActive }) => `whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold ${isActive ? 'border-lime text-white' : 'border-transparent text-white/70 hover:text-white'}`}>
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
