import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { HelpAssistant } from './components/HelpAssistant';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Citizen Pages
import { CitizenDashboard } from './pages/CitizenDashboard';
import { CreateEmergencyPage } from './pages/CreateEmergencyPage';
import { CitizenRequestsPage } from './pages/CitizenRequestsPage';
import { RequestDetailsPage } from './pages/RequestDetailsPage';

// NGO & Volunteer Pages
import { ReliefDashboard } from './pages/ReliefDashboard';
import { AvailableRequestsPage } from './pages/AvailableRequestsPage';
import { MyAssignmentsPage } from './pages/MyAssignmentsPage';

// Government Pages
import { ControlRoomDashboard } from './pages/ControlRoomDashboard';
import { LiveMapPage } from './pages/LiveMapPage';
import { RequestsMonitoringPage } from './pages/RequestsMonitoringPage';
import { CoverageGapsPage } from './pages/CoverageGapsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ActivityMonitoringPage } from './pages/ActivityMonitoringPage';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { UserManagementPage } from './pages/UserManagementPage';
import { DuplicateMonitoringPage } from './pages/DuplicateMonitoringPage';

// Protected Route Guard with Role Check
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If unauthorized for specific page, redirect to their role home
    if (user.role === 'CITIZEN') return <Navigate to="/citizen" replace />;
    if (user.role === 'GOVERNMENT') return <Navigate to="/control-room" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/relief" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Citizen Routes */}
            <Route
              path="/citizen"
              element={
                <ProtectedRoute allowedRoles={['CITIZEN', 'GOVERNMENT', 'ADMIN']}>
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/new"
              element={
                <ProtectedRoute allowedRoles={['CITIZEN', 'GOVERNMENT', 'ADMIN']}>
                  <CreateEmergencyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/requests"
              element={
                <ProtectedRoute allowedRoles={['CITIZEN', 'GOVERNMENT', 'ADMIN']}>
                  <CitizenRequestsPage />
                </ProtectedRoute>
              }
            />

            {/* Shared Details View for any authenticated user */}
            <Route
              path="/requests/:id"
              element={
                <ProtectedRoute>
                  <RequestDetailsPage />
                </ProtectedRoute>
              }
            />

            {/* NGO & Volunteer Routes */}
            <Route
              path="/relief"
              element={
                <ProtectedRoute allowedRoles={['NGO', 'VOLUNTEER', 'GOVERNMENT', 'ADMIN']}>
                  <ReliefDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/relief/available"
              element={
                <ProtectedRoute allowedRoles={['NGO', 'VOLUNTEER', 'GOVERNMENT', 'ADMIN']}>
                  <AvailableRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/relief/my-tasks"
              element={
                <ProtectedRoute allowedRoles={['NGO', 'VOLUNTEER', 'GOVERNMENT', 'ADMIN']}>
                  <MyAssignmentsPage />
                </ProtectedRoute>
              }
            />

            {/* Government Control Room Routes */}
            <Route
              path="/control-room"
              element={
                <ProtectedRoute allowedRoles={['GOVERNMENT', 'ADMIN']}>
                  <ControlRoomDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/control-room/map"
              element={
                <ProtectedRoute allowedRoles={['GOVERNMENT', 'ADMIN', 'NGO', 'VOLUNTEER']}>
                  <LiveMapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/control-room/requests"
              element={
                <ProtectedRoute allowedRoles={['GOVERNMENT', 'ADMIN']}>
                  <RequestsMonitoringPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/control-room/coverage"
              element={
                <ProtectedRoute allowedRoles={['GOVERNMENT', 'ADMIN', 'NGO']}>
                  <CoverageGapsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/control-room/resources"
              element={
                <ProtectedRoute allowedRoles={['GOVERNMENT', 'ADMIN']}>
                  <ResourcesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/control-room/activity"
              element={
                <ProtectedRoute allowedRoles={['GOVERNMENT', 'ADMIN']}>
                  <ActivityMonitoringPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/duplicates"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <DuplicateMonitoringPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <HelpAssistant />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

