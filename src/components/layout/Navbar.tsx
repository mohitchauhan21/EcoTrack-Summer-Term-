import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Leaf, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full dark:bg-[#0a0a0a]/80 bg-white/80 backdrop-blur-xl border-b dark:border-white/10 border-gray-200 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
              <Leaf className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight uppercase dark:text-white text-gray-900">EcoTrack</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-sm font-semibold dark:text-zinc-400 text-gray-500 hover:dark:text-white hover:text-gray-900 transition-colors">Features</a>
            <a href="/#about" className="text-sm font-semibold dark:text-zinc-400 text-gray-500 hover:dark:text-white hover:text-gray-900 transition-colors">About</a>
            <a href="/#contact" className="text-sm font-semibold dark:text-zinc-400 text-gray-500 hover:dark:text-white hover:text-gray-900 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full dark:hover:bg-white/5 hover:bg-gray-100 dark:text-zinc-400 text-gray-500 transition-colors"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="text-sm font-semibold dark:text-zinc-400 text-gray-500 hover:dark:text-white hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs dark:text-zinc-500 text-gray-500 hover:dark:text-zinc-300 text-gray-700 font-bold uppercase tracking-wider"
                >
                  Logout
                </button>
              </div>
            ) : location.pathname !== "/login" ? (
              <Link
                to="/login"
                className="bg-emerald-500 text-black px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-emerald-400 transition-all active:scale-[0.98]"
              >
                Sign In
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
