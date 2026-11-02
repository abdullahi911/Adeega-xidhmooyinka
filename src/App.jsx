import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Packages from './components/Packages';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import NotificationBanner from './components/NotificationBanner';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import './App.css';

// Lazy-load Admin components for performance
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function LoadingFallback() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7FAFF' }}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 36,
            height: 36,
            border: '3px solid #D0E4FF',
            borderTopColor: '#1769FF',
            borderRadius: '50%',
            animation: 'adminSpin 0.7s linear infinite',
            margin: '0 auto 1rem',
          }}
        />
        <p style={{ color: '#52627A', fontSize: '0.9rem', fontWeight: 600 }}>Fadlan sug...</p>
      </div>
    </div>
  );
}

function PublicLandingPage() {
  return (
    <>
      <NotificationBanner />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Packages />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<PublicLandingPage />} />

          {/* Admin Login (Restricted to Authorized Administrator) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Dashboard Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Any unauthorized /admin/* navigation redirects to login */}
          <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />

          {/* Fallback to public homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
