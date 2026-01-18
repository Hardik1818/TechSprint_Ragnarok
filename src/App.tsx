import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import OrgDashboard from './pages/OrgDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import OrgEmployees from './pages/OrgEmployees';
import OrgPayroll from './pages/OrgPayroll';
import AdminCompliance from './pages/AdminCompliance';
import AdminAnalytics from './pages/AdminAnalytics';

// Route Guard component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, loading } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/home', { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0a0a0c', color: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #00d2ff', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p>Loading DailyPay Nepal...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return null; // Will navigate via useEffect
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    navigate('/', { replace: true });
    return null;
  }

  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Employee Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/wallet" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <Wallet />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute allowedRoles={['employee', 'org_admin', 'admin']}>
          <Settings />
        </ProtectedRoute>
      } />

      {/* Organization Routes */}
      <Route path="/organization" element={
        <ProtectedRoute allowedRoles={['org_admin']}>
          <OrgDashboard />
        </ProtectedRoute>
      } />

      <Route path="/org/employees" element={
        <ProtectedRoute allowedRoles={['org_admin']}>
          <OrgEmployees />
        </ProtectedRoute>
      } />

      <Route path="/org/payroll" element={
        <ProtectedRoute allowedRoles={['org_admin']}>
          <OrgPayroll />
        </ProtectedRoute>
      } />

      {/* Regulatory/Admin Routes */}
      <Route path="/regulatory" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/compliance" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminCompliance />
        </ProtectedRoute>
      } />

      <Route path="/admin/analytics" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminAnalytics />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
