import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import { ArrowRight, Database, PieChart, RefreshCw, Shield, Globe, Zap, CheckCircle, BarChart3, FileSpreadsheet, Leaf, Sparkles, TrendingDown, Target, Award } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";

function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.1,
      color: ["#10b981", "#06b6d4", "#8b5cf6", "#10b981"][Math.floor(Math.random() * 4)]
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
            background: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function FloatingOrbs() {
  return (
    <>
      {/* Large floating gradient orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full opacity-[0.03] animate-float-slow"
        style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-[0.03] animate-float-reverse"
        style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full opacity-[0.02] animate-float"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', filter: 'blur(60px)' }} />
    </>
  );
}

function OrbitalRing() {
  return (
    <div className="hidden lg:block absolute top-[25%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] z-0">
      {/* Orbit ring */}
      <div className="absolute inset-12 border border-emerald-500/10 rounded-full animate-float-slow" />
      <div className="absolute inset-24 border border-blue-500/10 rounded-full animate-float-reverse" style={{ animationDuration: '12s' }} />
      <div className="absolute inset-36 border border-purple-500/10 rounded-full animate-float" style={{ animationDuration: '15s' }} />
      {/* Orbiting dots */}
      <div className="absolute w-3 h-3 bg-emerald-500/40 rounded-full animate-float"
        style={{ top: 'calc(50% - 6px)', left: 'calc(50% - 6px)', animation: 'orbit 8s linear infinite' }} />
      <div className="absolute w-2 h-2 bg-blue-500/40 rounded-full animate-float-reverse"
        style={{ top: 'calc(50% - 4px)', left: 'calc(50% - 4px)', animation: 'orbit-reverse 12s linear infinite' }} />
      {/* Center glow */}
      <div className="absolute inset-[35%] bg-emerald-500/5 rounded-full blur-3xl animate-breathe" />
    </div>
  );
}

function AnimatedStat({ end, suffix = "", label }: { end: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className="text-center group">
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="dark:text-zinc-500 text-gray-500 text-sm font-medium uppercase tracking-widest group-hover:dark:text-zinc-300 text-gray-700 transition-colors">{label}</div>
    </div>
  );
}


const colorMap: Record<string, { bg: string; border: string; hoverBorder: string; icon: string; ring: string }> = {
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", hoverBorder: "hover:border-emerald-500/20", icon: "text-emerald-500", ring: "bg-emerald-500" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", hoverBorder: "hover:border-blue-500/20", icon: "text-blue-500", ring: "bg-blue-500" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", hoverBorder: "hover:border-purple-500/20", icon: "text-purple-500", ring: "bg-purple-500" },
};

function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex-1 dark:bg-[#050505] bg-white flex flex-col pt-16 overflow-hidden transition-colors">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          <Particles />
          <FloatingOrbs />
          <OrbitalRing />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 flex flex-col items-center text-center relative z-10 w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Carbon Intelligence Platform v2.0</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold dark:text-white text-gray-900 mb-6 leading-tight animate-fade-in-up delay-200 tracking-tight">
              Track. Measure.
              <br />
              <span className="text-gradient-animate font-bold">Decarbonize.</span>
            </h1>

            <p className="text-lg md:text-xl dark:text-zinc-400 text-gray-600 max-w-3xl mb-12 font-medium leading-relaxed animate-fade-in-up delay-300">
              EcoTrack simplifies carbon accounting for modern businesses. Ingest data, automate CO2e conversions,
              and gain <span className="text-emerald-400">actionable insights</span> across your entire organization.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-400">
              <Link
                to="/login"
                className="group inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Tracking</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center space-x-2 dark:glass-light bg-gray-200 dark:text-white text-gray-900 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 dark:hover:bg-white/10 hover:bg-gray-300"
              >
                <span>Explore Features</span>
              </a>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 rounded-full border-2 border-zinc-400/50 flex items-start justify-center pt-2">
                <div className="w-1 h-2 bg-zinc-400/70 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Placeholders for Navigation */}
        <section id="features" className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-t dark:border-white/5 border-gray-200">
          <h2 className="text-3xl font-bold dark:text-white text-gray-900">Features</h2>
          <p className="dark:text-zinc-400 text-gray-500 mt-4 max-w-2xl mx-auto">Explore how EcoTrack can help you automate carbon accounting and gain actionable insights.</p>
        </section>

        <section id="about" className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-t dark:border-white/5 border-gray-200">
          <h2 className="text-3xl font-bold dark:text-white text-gray-900">About Us</h2>
          <p className="dark:text-zinc-400 text-gray-500 mt-4 max-w-2xl mx-auto">Learn more about our mission to decarbonize modern businesses through transparent data.</p>
        </section>

        <section id="contact" className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-t dark:border-white/5 border-gray-200">
          <h2 className="text-3xl font-bold dark:text-white text-gray-900">Contact</h2>
          <p className="dark:text-zinc-400 text-gray-500 mt-4 max-w-2xl mx-auto">Get in touch with our enterprise sales team to start your journey.</p>
        </section>
      </main>
    </div>
  );
};