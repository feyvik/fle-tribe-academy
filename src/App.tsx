import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { FullPageMessage } from './components/FullPageMessage';
import { AuthProvider } from './lib/auth';

// Every page is loaded only when it's first opened, so the first visit downloads far less.
// Admin pages are never downloaded by students.
const StudentLayout = lazy(() => import('./layouts/StudentLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Login = lazy(() => import('./pages/Login'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const Verify = lazy(() => import('./pages/Verify'));
const Home = lazy(() => import('./pages/Home'));
const WeekPage = lazy(() => import('./pages/WeekPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const Certificates = lazy(() => import('./pages/Certificates'));
const Profile = lazy(() => import('./pages/Profile'));
const Students = lazy(() => import('./pages/admin/Students'));
const StudentDetail = lazy(() => import('./pages/admin/StudentDetail'));
const Content = lazy(() => import('./pages/admin/Content'));
const Submissions = lazy(() => import('./pages/admin/Submissions'));
const CertificatesAdmin = lazy(() => import('./pages/admin/CertificatesAdmin'));

/** Shown inside a layout while the next page's code downloads. */
function PageLoading() {
  return <p className="py-10 text-muted">Loading…</p>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<FullPageMessage text="Loading…" />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/change-password" element={<ChangePassword />} />
            {/* Public: anyone with a certificate number can verify it. */}
            <Route path="/verify/:number" element={<Verify />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="students" replace />} />
              <Route path="students" element={<Suspense fallback={<PageLoading />}><Students /></Suspense>} />
              <Route path="students/:id" element={<Suspense fallback={<PageLoading />}><StudentDetail /></Suspense>} />
              <Route path="content" element={<Suspense fallback={<PageLoading />}><Content /></Suspense>} />
              <Route path="submissions" element={<Suspense fallback={<PageLoading />}><Submissions /></Suspense>} />
              <Route path="certificates" element={<Suspense fallback={<PageLoading />}><CertificatesAdmin /></Suspense>} />
            </Route>

            <Route element={<StudentLayout />}>
              <Route index element={<Suspense fallback={<PageLoading />}><Home /></Suspense>} />
              <Route path="weeks/:weekId" element={<Suspense fallback={<PageLoading />}><WeekPage /></Suspense>} />
              <Route path="weeks/:weekId/:day" element={<Suspense fallback={<PageLoading />}><LessonPage /></Suspense>} />
              <Route path="certificates" element={<Suspense fallback={<PageLoading />}><Certificates /></Suspense>} />
              <Route path="profile" element={<Suspense fallback={<PageLoading />}><Profile /></Suspense>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
