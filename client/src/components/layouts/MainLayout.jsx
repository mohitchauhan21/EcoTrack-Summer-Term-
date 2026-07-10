import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * Main application layout.
 * Composes Navbar + Sidebar + Page Content (Outlet) + Footer.
 * Used by authenticated / dashboard routes.
 */
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleCollapse = () => setSidebarCollapsed((prev) => !prev);

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Navbar */}
      <Navbar onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Body — Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleCollapse}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-[calc(100vh-4rem)]">
          <div className="flex-1 p-4 lg:p-6">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
