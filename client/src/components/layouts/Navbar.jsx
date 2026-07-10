import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Menu, X, Bell } from 'lucide-react';

/**
 * Top navigation bar with logo, nav links, and mobile toggle.
 *
 * @param {Function} onMenuToggle - Toggles sidebar on mobile
 * @param {boolean} sidebarOpen - Current sidebar state
 */
const Navbar = ({ onMenuToggle, sidebarOpen }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-secondary-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left — Menu toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Leaf className="h-7 w-7 text-primary-600" />
            </motion.div>
            <span className="text-xl font-bold text-secondary-900 tracking-tight">
              Eco<span className="text-primary-600">Track</span>
            </span>
          </Link>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary-500 rounded-full" />
          </button>

          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm ml-2">
            U
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
