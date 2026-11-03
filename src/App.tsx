import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
import { AuthProvider } from './lib/auth';
import CertificatesAdmin from './pages/admin/CertificatesAdmin';
import Content from './pages/admin/Content';
import StudentDetail from './pages/admin/StudentDetail';
import Students from './pages/admin/Students';
import Submissions from './pages/admin/Submissions';
import Certificates from './pages/Certificates';
import ChangePassword from './pages/ChangePassword';
import Home from './pages/Home';
import LessonPage from './pages/LessonPage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Verify from './pages/Verify';
import WeekPage from './pages/WeekPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
          {/* Public: anyone with a certificate number can verify it. */}
          <Route path="/verify/:number" element={<Verify />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="students" replace />} />
            <Route path="students" element={<Students />} />
            <Route path="students/:id" element={<StudentDetail />} />
            <Route path="content" element={<Content />} />
            <Route path="submissions" element={<Submissions />} />
            <Route path="certificates" element={<CertificatesAdmin />} />
          </Route>

          <Route element={<StudentLayout />}>
            <Route index element={<Home />} />
            <Route path="weeks/:weekId" element={<WeekPage />} />
            <Route path="weeks/:weekId/:day" element={<LessonPage />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
