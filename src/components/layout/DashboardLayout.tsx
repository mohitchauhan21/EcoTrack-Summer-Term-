import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  Tags, 
  FileSpreadsheet, 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  UserCircle,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout() {
  const { role, logout, companyName } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define sidebar navigation based on RBAC matrix
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["superadmin", "admin", "employee", "executive"],
      exact: true
    },
    {
      name: "Company",
      path: "/dashboard/company",
      icon: Building2,
      roles: ["superadmin", "admin"]
    },
    {
      name: "Departments",
      path: "/dashboard/departments",
      icon: Tags,
      roles: ["superadmin", "admin"]
    },
    {
      name: "Carbon Logs",
      path: "/dashboard/logs",
      icon: FileSpreadsheet,
      roles: ["superadmin", "admin", "employee"]
    },
    {
      name: "Analytics",
      path: "/dashboard/analytics",
      icon: BarChart3,
      roles: ["superadmin", "admin", "executive"]
    },
    {
      name: "Reports",
      path: "/dashboard/reports",
      icon: FileText,
      roles: ["superadmin", "admin", "executive"]
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: Users,
      roles: ["superadmin", "admin"]
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
      roles: ["superadmin", "admin"]
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: UserCircle,
      roles: ["superadmin", "admin", "employee", "executive"]
    }
  ];

  // Filter items by role
  const visibleNavItems = navItems.filter(item => 
    role && item.roles.includes(role)
  );

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/5 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64 flex flex-col ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-[#0a0a0a] rounded-full" />
            </div>
            <span className="text-lg font-light tracking-tight text-white">EcoTrack</span>
          </div>
          <button className="lg:hidden text-zinc-400" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 truncate">
            {companyName || "Organization"}
          </p>
          <p className="text-[10px] text-zinc-600 uppercase mt-1">Role: {role}</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
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
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#050505]">
        {/* Mobile header */}
        <header className="lg:hidden h-16 border-b border-white/5 flex items-center px-4 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-20">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="text-zinc-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 text-center font-light tracking-tight text-white">EcoTrack</div>
          <div className="w-6" /> {/* Spacer */}
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
