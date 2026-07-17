import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 dark:bg-zinc-950 bg-gray-50 flex flex-col justify-center items-center pt-16 px-4 min-h-screen relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-md w-full dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 shadow-sm relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold dark:text-zinc-100 text-gray-900 tracking-tight">Sign In to EcoTrack</h2>
          <p className="dark:text-zinc-500 text-gray-500 mt-3 text-sm">Manage your corporate emissions.</p>
        </div>
        
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full dark:bg-zinc-900/80 bg-gray-50 border dark:border-white/[0.06] border-gray-200 rounded-2xl px-4 py-3.5 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
              placeholder="admin@ecotrack.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full dark:bg-zinc-900/80 bg-gray-50 border dark:border-white/[0.06] border-gray-200 rounded-2xl px-4 py-3.5 pr-10 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 dark:text-zinc-500 text-gray-500 hover:dark:text-zinc-300 text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">Forgot Password?</Link>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:dark:bg-zinc-800 bg-gray-200 disabled:dark:text-zinc-500 text-gray-500 text-black font-bold uppercase tracking-wide py-3.5 rounded-2xl transition-all duration-300 text-sm mt-4 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] disabled:shadow-none active:scale-[0.98]"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
          
          <div className="text-center mt-6">
            <span className="text-xs dark:text-zinc-500 text-gray-500">Don't have an account? </span>
            <Link to="/register" className="text-xs text-emerald-500 hover:text-emerald-400 font-bold transition-colors">Register</Link>
          </div>
        </form>
        
        <details className="mt-8 group">
          <summary className="text-xs uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 cursor-pointer flex justify-center items-center hover:dark:text-zinc-300 hover:text-gray-700 transition-colors list-none outline-none">
            <span className="border-b border-dashed dark:border-zinc-500 border-gray-400 group-hover:dark:border-zinc-300 group-hover:border-gray-700">View Demo Credentials</span>
          </summary>
          <div className="mt-6 p-5 dark:bg-zinc-900/50 bg-gray-50 border dark:border-white/[0.06] border-gray-200 rounded-2xl text-xs dark:text-zinc-400 text-gray-600 space-y-3">
            <div className="flex justify-between items-center">
              <span>Admin: <strong className="dark:text-zinc-200 text-gray-800">admin@ecotrack.com</strong></span>
            </div>
            <div className="flex justify-between items-center">
              <span>Employee: <strong className="dark:text-zinc-200 text-gray-800">employee@ecotrack.com</strong></span>
            </div>
            <div className="flex justify-between items-center">
              <span>Executive: <strong className="dark:text-zinc-200 text-gray-800">exec@ecotrack.com</strong></span>
            </div>
            <div className="flex justify-between items-center">
              <span>Super Admin: <strong className="dark:text-zinc-200 text-gray-800">superadmin@ecotrack.com</strong></span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t dark:border-white/[0.06] border-gray-200 mt-1">
              <span>Password: <strong className="dark:text-zinc-200 text-gray-800">Password123!</strong></span>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
