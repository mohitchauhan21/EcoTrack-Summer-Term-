import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/axiosClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock role-based login based on email for testing
    let role: "superadmin" | "admin" | "employee" | "executive" = "admin";
    if (email.includes("superadmin")) role = "superadmin";
    else if (email.includes("employee")) role = "employee";
    else if (email.includes("exec")) role = "executive";

    try {
      let companyName = "Acme Corporation";
      try {
        const compRes = await apiClient.get("/company");
        if (compRes.data && compRes.data.name) {
          companyName = compRes.data.name;
        }
      } catch (err) {
        console.warn("No company profile found during login.");
        companyName = "";
      }

      login({ companyName, role, userName: `${role.charAt(0).toUpperCase() + role.slice(1)} User` });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      navigate("/dashboard");
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
            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <h2 className="text-2xl font-light text-zinc-100 tracking-tight">Sign In to EcoTrack</h2>
          <p className="text-zinc-500 mt-2 text-sm">Manage your corporate emissions.</p>
        </div>
        
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
              placeholder="admin@ecotrack.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-emerald-500 hover:text-emerald-400">Forgot Password?</Link>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wide py-3 rounded-lg transition-colors text-sm mt-2"
          >
            Sign In
          </button>
          
          <div className="text-center mt-4">
            <span className="text-xs text-zinc-500">Don't have an account? </span>
            <Link to="/register" className="text-xs text-emerald-500 hover:text-emerald-400 font-bold">Register</Link>
          </div>
        </form>
        
        <div className="mt-8 p-4 bg-zinc-900/50 border border-white/5 rounded-lg text-xs text-zinc-400 space-y-2">
          <p className="font-bold text-zinc-300 mb-2 uppercase tracking-widest text-[10px]">Demo Credentials (Type email to test roles):</p>
          <div className="flex justify-between items-center">
            <span>Admin: <strong className="text-zinc-200">admin@ecotrack.com</strong></span>
          </div>
          <div className="flex justify-between items-center">
            <span>Employee: <strong className="text-zinc-200">employee@ecotrack.com</strong></span>
          </div>
          <div className="flex justify-between items-center">
            <span>Executive: <strong className="text-zinc-200">exec@ecotrack.com</strong></span>
          </div>
          <div className="flex justify-between items-center">
            <span>Super Admin: <strong className="text-zinc-200">superadmin@ecotrack.com</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
