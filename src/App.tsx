import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientListPage from './pages/PatientListPage';
import PatientRegistrationPage from './pages/PatientRegistrationPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';

/**
 * Defines the application's routing structure, including public and protected routes, within an authentication context.
 *
 * Public routes include login, privacy policy, and terms pages. Protected routes require authentication and include dashboard, patient management, and appointments. Unmatched or root paths redirect to the dashboard.
 *
 * @returns The application's main routing component wrapped in an authentication provider.
 */
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsAndConditionsPage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientListPage />} />
        <Route path="/patients/register" element={<PatientRegistrationPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        
        {/* Redirect to login if no route matches */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;