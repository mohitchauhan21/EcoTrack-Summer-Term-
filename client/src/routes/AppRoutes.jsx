import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../components/layouts/MainLayout';

// Components
import ProtectedRoute from './ProtectedRoute';

// Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import CompanySetup from '../pages/CompanySetup';
import CarbonLogs from '../pages/CarbonLogs';
import CsvUpload from '../pages/CsvUpload';
import Analytics from '../pages/Analytics';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

/**
 * Application route definitions.
 *
 * Public routes: Landing, Login, Register, NotFound
 * App routes (with layout + auth): Dashboard, CompanySetup, CarbonLogs, CsvUpload, Analytics, Profile
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes — No layout */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* App Routes — Protected + MainLayout (Navbar + Sidebar + Footer) */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/company-setup" element={<CompanySetup />} />
        <Route path="/carbon-logs" element={<CarbonLogs />} />
        <Route path="/csv-upload" element={<CsvUpload />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
