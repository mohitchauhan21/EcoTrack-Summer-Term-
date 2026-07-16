import React, { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Tags,
  FileSpreadsheet,
  BarChart3,
  FileText,
  Users,
  UserCircle,
  LogOut,
  Menu,
  X,
  Leaf,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

/* ── Avatar with initials ─────────────────────────────────── */
function UserAvatar({ name, size = 36 }: { name: string | null; size?: number }) {
  const initials = (name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="rounded-full bg-emerald-500/15 text-emerald-400 font-bold flex items-center justify-center text-xs select-none border border-emerald-500/20 transition-all duration-200 hover:bg-emerald-500/25 hover:border-emerald-500/40"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

export default function DashboardLayout() {
  const { role, logout, userName } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Nav items — Profile & Logout removed from here, moved to avatar dropdown
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["superadmin", "admin", "employee", "executive"],
      exact: true,
    },
    {
      name: "Company",
      path: "/dashboard/company",
      icon: Building2,
      roles: ["superadmin", "admin"],
    },
    {
      name: "Departments",
      path: "/dashboard/departments",
      icon: Tags,
      roles: ["superadmin", "admin"],
    },
    {
      name: "Carbon Logs",
      path: "/dashboard/logs",
      icon: FileSpreadsheet,
      roles: ["superadmin", "admin", "employee"],
    },
    {
      name: "Analytics",
      path: "/dashboard/analytics",
      icon: BarChart3,
      roles: ["superadmin", "admin", "executive"],
    },
    {
      name: "Reports",
      path: "/dashboard/reports",
      icon: FileText,
      roles: ["superadmin", "admin", "executive"],
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: Users,
      roles: ["superadmin", "admin"],
    },
  ];

  const visibleNavItems = navItems.filter(
    (item) => role && item.roles.includes(role)
  );

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? "bg-[#050505]" : "bg-gray-50"}`}>
      {/* ── Fixed Top Navbar ─────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[70px] backdrop-blur-xl border-b transition-colors duration-300 ${
          isDark
            ? "bg-[#0a0a0a]/95 border-white/10"
            : "bg-white/95 border-gray-200"
        }`}
      >
        <div className="h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left — Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-black" />
            </div>
            <span className={`text-lg font-bold tracking-tight uppercase hidden sm:inline ${isDark ? "text-white" : "text-gray-900"}`}>
              EcoTrack
            </span>
          </NavLink>

          {/* Center — Desktop navigation links */}
          <div className="hidden lg:flex items-center gap-1">
            {visibleNavItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "text-emerald-500 bg-emerald-500/10"
                      : isDark
                        ? "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={16} />
                  {item.name}
                  {isActive && (
                    <span className="absolute -bottom-[21px] left-3.5 right-3.5 h-[2px] bg-emerald-500 rounded-full" />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Right — Theme toggle + Avatar + hamburger (mobile) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                isDark
                  ? "text-zinc-400 hover:text-yellow-400 hover:bg-white/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Avatar + dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <UserAvatar name={userName} />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div
                  role="menu"
                  className={`absolute right-0 top-[calc(100%+8px)] w-52 rounded-xl border shadow-xl overflow-hidden transition-all duration-200 origin-top-right animate-in fade-in zoom-in-95 ${
                    isDark
                      ? "bg-[#111111] border-white/10 shadow-black/40"
                      : "bg-white border-gray-200 shadow-gray-200/60"
                  }`}
                >
                  {/* User info header */}
                  <div className={`px-4 py-3 border-b ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
                    <p className={`text-sm font-medium truncate ${isDark ? "text-zinc-200" : "text-gray-900"}`}>
                      {userName || "User"}
                    </p>
                    <p className={`text-[11px] capitalize mt-0.5 ${isDark ? "text-zinc-500" : "text-gray-400"}`}>
                      {role || "—"}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      role="menuitem"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/dashboard/profile");
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                        isDark
                          ? "text-zinc-300 hover:bg-white/5 hover:text-white"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <UserCircle size={16} />
                      Profile
                    </button>
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                        isDark
                          ? "text-zinc-300 hover:bg-white/5 hover:text-red-400"
                          : "text-gray-700 hover:bg-gray-50 hover:text-red-500"
                      }`}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDark
                  ? "text-zinc-400 hover:text-white hover:bg-white/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ──────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className={`absolute top-0 right-0 w-72 h-full border-l flex flex-col animate-in slide-in-from-right duration-200 ${
              isDark
                ? "bg-[#0a0a0a] border-white/10"
                : "bg-white border-gray-200"
            }`}
          >
            <div className={`h-[70px] flex items-center justify-between px-5 border-b ${isDark ? "border-white/5" : "border-gray-100"}`}>
              <span className={`text-sm font-bold uppercase tracking-widest ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
                Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-zinc-400 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {visibleNavItems.map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : isDark
                          ? "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            <div className={`p-4 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/dashboard/profile");
                }}
                className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium transition-colors ${
                  isDark
                    ? "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <UserCircle size={18} />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium transition-colors ${
                  isDark
                    ? "text-zinc-400 hover:bg-white/5 hover:text-red-400"
                    : "text-gray-500 hover:bg-gray-50 hover:text-red-500"
                }`}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="flex-1 pt-[70px]">
        <div className="max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
