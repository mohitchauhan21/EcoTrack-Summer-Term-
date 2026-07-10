import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo */}
          <div className="flex items-center flex-1">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-emerald-600">EcoTrack</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-center gap-8 flex-1">
            <a href="#home" className="text-gray-600 hover:text-emerald-600 text-sm font-medium">Home</a>
            <a href="#features" className="text-gray-600 hover:text-emerald-600 text-sm font-medium">Features</a>
            <a href="#about" className="text-gray-600 hover:text-emerald-600 text-sm font-medium">About</a>
            <a href="#contact" className="text-gray-600 hover:text-emerald-600 text-sm font-medium">Contact</a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center justify-end gap-4 flex-1">
            <Link to="/login" className="text-gray-600 hover:text-emerald-600 px-3 py-2 text-sm font-medium">
              Login
            </Link>
            <Link to="/register" className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-md text-sm font-medium">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-200">
            <a href="#home" className="block text-gray-600 hover:text-emerald-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">Home</a>
            <a href="#features" className="block text-gray-600 hover:text-emerald-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">Features</a>
            <a href="#about" className="block text-gray-600 hover:text-emerald-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">About</a>
            <a href="#contact" className="block text-gray-600 hover:text-emerald-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">Contact</a>
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col space-y-2">
              <Link to="/login" className="block text-center text-gray-600 hover:text-emerald-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">
                Login
              </Link>
              <Link to="/register" className="block text-center bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-2 rounded-md text-base font-medium">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
