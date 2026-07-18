import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { COUNTRIES } from "../../constants/regions";
import { Select } from "../../components/ui/Select";
import { useToast } from "../../context/ToastContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    region: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value });
    if (value.trim().length === 0) {
      setPasswordError("Password is required.");
    } else if (value.trim().length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else {
      setPasswordError(null);
    }
    if (formData.confirmPassword && value !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setFormData({ ...formData, confirmPassword: value });
    if (value.trim().length === 0) {
      setConfirmPasswordError("Confirm Password is required.");
    } else if (value !== formData.password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedPassword = formData.password.trim();
    const trimmedConfirm = formData.confirmPassword.trim();

    if (!trimmedPassword) {
      setPasswordError("Password is required.");
      return;
    }
    if (trimmedPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (!trimmedConfirm) {
      setConfirmPasswordError("Confirm Password is required.");
      return;
    }
    if (trimmedPassword !== trimmedConfirm) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        region: formData.region
      });
      toastSuccess('Account created successfully! Welcome to EcoTrack.');
      navigate("/onboarding");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 dark:bg-zinc-950 bg-gray-50 flex flex-col justify-center items-center pt-28 pb-12 px-4 min-h-screen relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-xl w-full dark:bg-zinc-900/80 bg-white/80 backdrop-blur-xl border dark:border-white/[0.06] border-gray-200 rounded-2xl p-10 pb-12 shadow-sm relative z-10">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Leaf className="w-6 h-6 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-light dark:text-zinc-100 text-gray-900 tracking-tight">Create an Account</h2>
          <p className="dark:text-zinc-500 text-gray-500 mt-4 text-sm">Join EcoTrack and manage your corporate emissions.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 mb-2">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
                className="w-full dark:bg-zinc-800 bg-gray-50 border dark:border-white/[0.06] border-gray-200 rounded-lg px-4 py-3 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="Acme Corp"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 mb-2">Country</label>
              <Select
                value={formData.region}
                onChange={value => setFormData({...formData, region: value})}
                placeholder="Select a country..."
                options={[
                  { value: '', label: 'Select a country...', disabled: true },
                  ...COUNTRIES.map((country) => ({ value: country, label: country }))
                ]}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 mb-2">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full dark:bg-zinc-800 bg-gray-50 border dark:border-white/[0.06] border-gray-200 rounded-lg px-4 py-3 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full dark:bg-zinc-800 bg-gray-50 border dark:border-white/[0.06] border-gray-200 rounded-lg px-4 py-3 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="john@acme.com"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={e => handlePasswordChange(e.target.value)}
                  className={`w-full dark:bg-zinc-800 bg-gray-50 border ${
                    passwordError
                      ? 'border-red-500/50 focus:border-red-500/50'
                      : 'dark:border-white/[0.06] border-gray-200 focus:border-emerald-500/50'
                  } rounded-lg px-4 py-3 pr-10 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none transition-colors`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer dark:text-zinc-500 text-gray-400 hover:dark:text-zinc-300 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{passwordError}</p>
              )}
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={e => handleConfirmPasswordChange(e.target.value)}
                  className={`w-full dark:bg-zinc-800 bg-gray-50 border ${
                    confirmPasswordError
                      ? 'border-red-500/50 focus:border-red-500/50'
                      : 'dark:border-white/[0.06] border-gray-200 focus:border-emerald-500/50'
                  } rounded-lg px-4 py-3 pr-10 text-sm dark:text-zinc-100 text-gray-900 focus:outline-none transition-colors`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer dark:text-zinc-500 text-gray-400 hover:dark:text-zinc-300 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{confirmPasswordError}</p>
              )}
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mt-6">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:dark:bg-zinc-800 bg-gray-200 disabled:dark:text-zinc-500 text-gray-500 text-black font-bold uppercase tracking-wide py-3.5 rounded-lg transition-colors text-sm mt-10"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          
          <div className="text-center pt-2">
            <span className="text-xs dark:text-zinc-500 text-gray-500">Already have an account? </span>
            <Link to="/login" className="text-xs text-emerald-500 hover:text-emerald-400 font-bold transition-colors">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
