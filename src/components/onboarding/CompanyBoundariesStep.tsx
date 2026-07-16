import React, { useState } from "react";

interface Props {
  onComplete: (name: string, region: string) => void;
}

export default function CompanyBoundariesStep({ onComplete }: Props) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && region) {
      onComplete(name, region);
    }
  };

  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">1</div>
        <h2 className="text-xl font-light tracking-wide text-zinc-100">Define Company Boundaries</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Company Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
            placeholder="e.g. Acme Corporation"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Primary Operating Region</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
            required
          >
            <option value="" disabled>Select a region...</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia Pacific">Asia Pacific</option>
            <option value="Latin America">Latin America</option>
            <option value="Middle East & Africa">Middle East & Africa</option>
            <option value="Mumbai/India">Mumbai/India</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={!name || !region}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-bold uppercase tracking-wide px-6 py-3 rounded-lg transition-colors text-sm"
        >
          Save Details
        </button>
      </form>
    </div>
  );
}
