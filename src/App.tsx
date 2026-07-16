/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { FilterProvider } from "./context/FilterContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/layout/Navbar";
import DashboardLayout from "./components/layout/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import CompanyProfilePage from "./pages/dashboard/CompanyProfilePage";
import DepartmentsPage from "./pages/dashboard/DepartmentsPage";
import CarbonLogsPage from "./pages/dashboard/CarbonLogsPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import UsersPage from "./pages/dashboard/UsersPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import OnboardingPage from "./pages/OnboardingPage";
import EcoInsightsPage from "./pages/ai/EcoInsightsPage";
import NotFoundPage from "./pages/NotFoundPage";

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { isAuthenticated, role, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <FilterProvider>
          <BrowserRouter>
            <div className="font-sans text-zinc-100 bg-[#050505] min-h-screen flex flex-col">
              <Routes>
                {/* Public Routes with Navbar */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                </Route>
                
                {/* Onboarding */}
                <Route path="/onboarding" element={
                  <ProtectedRoute>
                    <OnboardingPage />
                  </ProtectedRoute>
                } />

                {/* Protected Dashboard Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardPage />} />
                  <Route path="profile" element={<ProfilePage />} />

                  {/* Company & Departments */}
                  <Route path="company" element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
                      <CompanyProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="departments" element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
                      <DepartmentsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="departments/add" element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
                      <DepartmentsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="departments/:id/edit" element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
                      <DepartmentsPage />
                    </ProtectedRoute>
                  } />

                  {/* Logs */}
                  <Route path="logs" element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin", "employee"]}>
                      <CarbonLogsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="logs/add" element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin", "employee"]}>
                      <CarbonLogsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="logs/upload" element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin", "employee"]}>
                      <CarbonLogsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="logs/:id/edit" element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin", "employee"]}>
                      <CarbonLogsPage />
                    </ProtectedRoute>
                  } />

                  {/* Analytics & Reports & Eco Insights */}
                  <Route path="analytics" element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin", "executive"]}>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="reports" element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin", "executive"]}>
                      <ReportsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="insights" element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin", "executive"]}>
                      <EcoInsightsPage />
                    </ProtectedRoute>
                  } />

                  {/* Users & Settings */}
                  <Route path="users" element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
                      <UsersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="settings" element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                </Route>

                {/* 404 - Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </BrowserRouter>
        </FilterProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
