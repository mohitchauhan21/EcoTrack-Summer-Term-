import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  FileText,
  Upload,
  BarChart3,
  User,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/company-setup', icon: Building2, label: 'Company Setup' },
  { to: '/carbon-logs', icon: FileText, label: 'Carbon Logs' },
  { to: '/csv-upload', icon: Upload, label: 'CSV Upload' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-md">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-300 group overflow-hidden ${
                isActive
                  ? 'text-primary-700 bg-white/80 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.15)] border border-primary-100/50'
                  : 'text-secondary-600 hover:bg-white/60 hover:text-secondary-900 hover:shadow-sm'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-accent-500 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isActive ? 'text-primary-600' : 'group-hover:scale-110 group-hover:text-primary-500'} ${isCollapsed ? 'mx-auto' : ''}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="hidden lg:block p-4 border-t border-secondary-200/50">
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center w-full p-2.5 rounded-xl bg-white/50 text-secondary-500 hover:bg-white hover:text-primary-600 hover:shadow-sm border border-transparent hover:border-secondary-100 transition-all duration-200"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={`h-5 w-5 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-secondary-900/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-[4.5rem] left-0 z-30 h-[calc(100vh-4.5rem)] w-64 border-r border-white/60 shadow-xl lg:hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-[calc(100vh-4.5rem)] border-r border-white/60 transition-all duration-300 sticky top-[4.5rem] ${
          isCollapsed ? 'w-[80px]' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
