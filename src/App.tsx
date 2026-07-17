/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { FilterProvider } from "./context/FilterContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/layout/Navbar";
import DashboardLayout from "./components/layout/DashboardLayout";

// Lazy-loaded pages for better performance and code splitting
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const CompanyProfilePage = lazy(() => import("./pages/dashboard/CompanyProfilePage"));
const DepartmentsPage = lazy(() => import("./pages/dashboard/DepartmentsPage"));
const CarbonLogsPage = lazy(() => import("./pages/dashboard/CarbonLogsPage"));
const AnalyticsPage = lazy(() => import("./pages/dashboard/AnalyticsPage"));
const ReportsPage = lazy(() => import("./pages/dashboard/ReportsPage"));
const UsersPage = lazy(() => import("./pages/dashboard/UsersPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Loading fallback for lazy-loaded pages
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-zinc-950 bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
          <div className="w-5 h-5 bg-emerald-500 rounded-full animate-pulse" />
        </div>
        <span className="text-sm dark:text-zinc-500 text-gray-500 font-medium">Loading...</span>
      </div>
    </div>
  );
}

// Error boundary to catch lazy-loading failures
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("EcoTrack ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center dark:bg-zinc-950 bg-gray-50 p-4">
          <div className="flex flex-col items-center text-center max-w-md">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold dark:text-zinc-100 text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-sm dark:text-zinc-400 text-gray-500 mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-2xl font-bold uppercase tracking-wide text-sm transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <FilterProvider>
            <BrowserRouter>
              <div className="font-sans min-h-screen flex flex-col transition-colors duration-300 theme-root">
              <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
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

                  {/* Analytics & Reports */}
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

                  {/* Users */}
                  <Route path="users" element={
                    <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
                      <UsersPage />
                    </ProtectedRoute>
                  } />
                </Route>

                {/* 404 - Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              </Suspense>
              </ErrorBoundary>
              </div>
            </BrowserRouter>
          </FilterProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
