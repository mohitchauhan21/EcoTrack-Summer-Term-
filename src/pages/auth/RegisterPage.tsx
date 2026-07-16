import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful registration
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    navigate("/login");
  };

  return (
    <div className="flex-1 bg-[#050505] flex flex-col justify-center items-center pt-16 px-4 min-h-screen relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-xl w-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-6 h-6 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-light text-zinc-100 tracking-tight">Create an Account</h2>
          <p className="text-zinc-500 mt-2 text-sm">Join EcoTrack and manage your corporate emissions.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="Acme Corp"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="john@acme.com"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wide py-3 rounded-lg transition-colors text-sm mt-6"
          >
            Create Account
          </button>
          
          <div className="text-center mt-6">
            <span className="text-xs text-zinc-500">Already have an account? </span>
            <Link to="/login" className="text-xs text-emerald-500 hover:text-emerald-400 font-bold transition-colors">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
