import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * Main application layout.
 * Composes Navbar + Sidebar + Page Content (Outlet) + Footer.
 * Applies mesh background and page transitions.
 */
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleCollapse = () => setSidebarCollapsed((prev) => !prev);

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      {/* Navbar */}
      <Navbar onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Body — Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleCollapse}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-[calc(100vh-4.5rem)] overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
          <div className="mt-auto">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
