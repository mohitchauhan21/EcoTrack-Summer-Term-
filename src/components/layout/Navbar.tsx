import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Leaf, Sun, Moon, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const sections = ['features', 'about', 'contact'];
      let current = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
            break;
          }
        }
      }
      setActiveHash(current);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update hash when clicking a link (since scrolling takes time)
  const handleLinkClick = (hash: string) => {
    setActiveHash(hash);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { name: "Features", href: "/#features", hash: "features" },
    { name: "About", href: "/#about", hash: "about" },
    { name: "Contact", href: "/#contact", hash: "contact" }
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-gray-200 dark:border-white/[0.06] backdrop-blur-md shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05),0_10px_20px_-2px_rgba(0,0,0,0.02)] dark:shadow-white/5 ${
        isScrolled 
          ? 'dark:bg-zinc-950/90 bg-white/90 py-3' 
          : 'dark:bg-zinc-950/30 bg-white/40 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start">
            <Link to="/" onClick={() => handleLinkClick("")} className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Leaf className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight uppercase dark:text-white text-gray-900">EcoTrack</span>
            </Link>
          </div>
          
          {/* Center: Nav Links */}
          <div className="hidden md:flex flex-none items-center justify-center gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={() => handleLinkClick(link.hash)}
                className={`relative text-sm font-semibold transition-colors duration-300 py-1 ${
                  activeHash === link.hash 
                    ? 'dark:text-white text-gray-900' 
                    : 'dark:text-zinc-400 text-gray-500 hover:dark:text-white hover:text-gray-900'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-emerald-500 rounded-full transition-all duration-300 ${activeHash === link.hash ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 origin-left hover:scale-x-100'}`} />
              </a>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex justify-end items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full dark:hover:bg-white/10 hover:bg-gray-100 dark:text-zinc-400 text-gray-500 transition-colors"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden md:flex items-center gap-6">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-sm font-semibold dark:text-zinc-400 text-gray-500 hover:dark:text-white hover:text-gray-900 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs dark:text-zinc-500 text-gray-500 hover:dark:text-zinc-300 text-gray-700 font-bold uppercase tracking-widest transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : location.pathname !== "/login" ? (
                <Link
                  to="/login"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(16,185,129,0.3)] active:scale-[0.98]"
                >
                  Sign In
                </Link>
              ) : null}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 rounded-lg dark:hover:bg-white/10 hover:bg-gray-100 dark:text-zinc-400 text-gray-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full dark:bg-zinc-950/95 bg-white/95 backdrop-blur-xl transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[400px] border-b dark:border-white/[0.06] border-gray-200 opacity-100' : 'max-h-0 border-transparent opacity-0'
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2 flex flex-col items-center shadow-lg">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              onClick={() => handleLinkClick(link.hash)}
              className={`block w-full text-center py-3 text-sm font-bold uppercase tracking-widest transition-colors ${
                activeHash === link.hash 
                  ? 'text-emerald-500' 
                  : 'dark:text-zinc-400 text-gray-600 hover:text-emerald-500'
              }`}
            >
              {link.name}
            </a>
          ))}
          {!isAuthenticated && location.pathname !== "/login" && (
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 w-full text-center bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-300"
            >
              Sign In
            </Link>
          )}
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-bold uppercase tracking-widest dark:text-zinc-400 text-gray-600 hover:text-emerald-500 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center py-3 text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
