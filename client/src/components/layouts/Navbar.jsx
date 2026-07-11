import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Menu, X, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Top navigation bar with glassmorphism, user info, and mobile toggle.
 */
const Navbar = ({ onMenuToggle, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-40 w-full glass-nav h-[4.5rem]">
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        {/* Left — Menu toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl text-secondary-500 hover:bg-white/50 hover:text-primary-600 transition-all duration-200 lg:hidden focus-ring"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg pr-2">
            <motion.div
              whileHover={{ rotate: [0, -10, 15, 0], scale: 1.1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="bg-gradient-to-br from-primary-400 to-accent-600 p-1.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-shadow duration-300"
            >
              <Leaf className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-2xl font-extrabold text-secondary-900 tracking-tight">
              Eco<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Track</span>
            </span>
          </Link>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-xl text-secondary-500 hover:bg-white/50 hover:text-primary-600 transition-all duration-200 relative focus-ring"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-danger-500 rounded-full border-2 border-white/80 animate-pulse-soft" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3 ml-1 pl-3 border-l border-secondary-200/50">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 border border-primary-200 flex items-center justify-center text-primary-700 font-bold text-sm shadow-sm">
              {userInitial}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold text-secondary-800 leading-none">
                {user?.name?.split(' ')[0]}
              </span>
              <span className="text-xs text-secondary-500 mt-0.5 capitalize">{user?.role || 'User'}</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-secondary-500 hover:bg-danger-50/80 hover:text-danger-600 transition-all duration-200 ml-1 focus-ring group"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
