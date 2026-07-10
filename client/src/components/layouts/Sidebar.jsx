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

/**
 * Collapsible sidebar with navigation links.
 *
 * @param {boolean} isOpen - Controls sidebar visibility on mobile
 * @param {Function} onClose - Closes sidebar on mobile
 * @param {boolean} isCollapsed - Desktop collapsed state
 * @param {Function} onToggleCollapse - Toggles desktop collapse
 */

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
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-l-3 border-primary-600'
                  : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
              }`
            }
          >
            <item.icon className={`h-5 w-5 shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle (desktop only) */}
      <div className="hidden lg:block p-3 border-t border-secondary-100">
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center w-full p-2 rounded-lg text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600 transition-colors"
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
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
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
        className="fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-secondary-200 lg:hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-[calc(100vh-4rem)] bg-white border-r border-secondary-200 transition-all duration-300 sticky top-16 ${
          isCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
