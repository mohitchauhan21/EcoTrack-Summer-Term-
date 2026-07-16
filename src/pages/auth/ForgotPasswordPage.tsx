import React, { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft } from "lucide-react";
import apiClient from "../../api/axiosClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send reset request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] flex flex-col justify-center items-center pt-16 px-4 min-h-screen relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-md w-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <KeyRound className="w-6 h-6 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-light text-zinc-100 tracking-tight">Reset Password</h2>
          <p className="text-zinc-500 mt-2 text-sm">We'll send you instructions to reset it.</p>
        </div>
        
        {submitted ? (
          <div className="text-center">
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-medium mb-6">
              If an account exists with {email}, you will receive a password reset link shortly.
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-400 font-bold transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="admin@ecotrack.com"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-bold uppercase tracking-wide py-3 rounded-lg transition-colors text-sm mt-2"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            
            <div className="text-center mt-6">
              <Link to="/login" className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
