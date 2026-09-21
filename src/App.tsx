import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { MaterialsPage } from './pages/public/MaterialsPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { AppointmentPage } from './pages/public/AppointmentPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminMaterialsPage } from './pages/admin/AdminMaterialsPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminSecurityPage } from './pages/admin/AdminSecurityPage';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <SettingsProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Website Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/materials" element={<MaterialsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/appointment" element={<AppointmentPage />} />
                </Route>

                {/* Admin Auth Route */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="projects" element={<AdminProjectsPage />} />
                  <Route path="gallery" element={<AdminGalleryPage />} />
                  <Route path="services" element={<AdminServicesPage />} />
                  <Route path="materials" element={<AdminMaterialsPage />} />
                  <Route path="appointments" element={<AdminAppointmentsPage />} />
                  <Route path="messages" element={<AdminMessagesPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  <Route path="security" element={<AdminSecurityPage />} />
                </Route>

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </SettingsProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
