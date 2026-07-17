import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search, Leaf } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 8 + 5,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.3 + 0.05,
    }));
  }, []);

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size + "px",
            height: p.size + "px",
            left: p.x + "%",
            top: p.y + "%",
            background: "#10b981",
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <div className="flex-1 bg-zinc-950 flex items-center justify-center min-h-screen relative overflow-hidden">
      <Particles />
      
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl animate-breathe" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
      
      <div className="text-center relative z-10 px-4">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-float">
          <Search className="w-8 h-8 text-emerald-500" />
        </div>
        
        <h1 className="text-8xl md:text-9xl font-light dark:text-zinc-100 text-gray-900 mb-4 tracking-tight">
          4<span className="text-gradient-animate">0</span>4
        </h1>
        
        <p className="text-xl dark:text-zinc-400 text-gray-600 mb-2 font-light">Page not found</p>
        <p className="dark:text-zinc-600 text-gray-400 text-sm mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 glass-light text-white px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
