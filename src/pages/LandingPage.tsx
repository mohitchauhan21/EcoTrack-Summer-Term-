import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import { ArrowRight, Database, PieChart, RefreshCw, Shield, Globe, Zap, CheckCircle, BarChart3, FileSpreadsheet } from "lucide-react";
import { useEffect, useState, useRef } from "react";

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
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-zinc-500 text-sm font-medium uppercase tracking-widest">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex-1 bg-[#050505] flex flex-col pt-16">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 flex flex-col items-center text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Carbon Intelligence Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light text-zinc-100 mb-6 leading-tight">
              Track. Measure.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-medium">Decarbonize.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mb-12 font-medium leading-relaxed">
              EcoTrack simplifies carbon accounting for modern businesses. Ingest data, automate CO2e conversions, 
              and gain actionable insights across your entire organization — all from one dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02]"
              >
                <span>Start Tracking</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all"
              >
                <span>Learn More</span>
              </a>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-white/5 bg-[#080808] py-16">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedStat end={400} suffix="+" label="Logs Tracked" />
            <AnimatedStat end={4} label="Departments" />
            <AnimatedStat end={12} label="Months of Data" />
            <AnimatedStat end={99} suffix="%" label="Uptime" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-4">Core Capabilities</p>
              <h2 className="text-3xl md:text-4xl font-light text-zinc-100">
                Everything you need for<br />
                <span className="font-medium">carbon compliance</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 flex flex-col hover:border-emerald-500/20 transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.05)]">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 transition-transform">
                  <Database className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-3">Data Ingestion</h3>
                <p className="text-zinc-500 text-sm leading-relaxed flex-1">
                  Bulk upload CSV logs or manually enter activity data across all departments. Supports Travel, Utilities, Supply Chain, and custom activity types.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-zinc-400 uppercase tracking-widest font-bold">CSV</span>
                  <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-zinc-400 uppercase tracking-widest font-bold">Manual</span>
                  <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-zinc-400 uppercase tracking-widest font-bold">Bulk</span>
                </div>
              </div>
              
              <div className="group bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 flex flex-col hover:border-blue-500/20 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.05)]">
                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-3">Automated Conversion</h3>
                <p className="text-zinc-500 text-sm leading-relaxed flex-1">
                  Instantly compute carbon equivalents (tCO2e) using ISO-aligned conversion factors. No manual calculations — every entry is converted in real-time.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-zinc-400 uppercase tracking-widest font-bold">kWh</span>
                  <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-zinc-400 uppercase tracking-widest font-bold">Miles</span>
                  <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-zinc-400 uppercase tracking-widest font-bold">kg CO2e</span>
                </div>
              </div>
              
              <div className="group bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 flex flex-col hover:border-purple-500/20 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.05)]">
                <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 transition-transform">
                  <PieChart className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-3">Visual Reporting</h3>
                <p className="text-zinc-500 text-sm leading-relaxed flex-1">
                  Analyze trends with interactive charts, identify high-emitting departments, and export audit-ready Excel spreadsheet reports on demand.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-zinc-400 uppercase tracking-widest font-bold">Charts</span>
                  <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-zinc-400 uppercase tracking-widest font-bold">XLSX</span>
                  <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-zinc-400 uppercase tracking-widest font-bold">KPIs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-[#080808] border-y border-white/5 py-24 lg:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-4">Simple Workflow</p>
              <h2 className="text-3xl md:text-4xl font-light text-zinc-100">
                Three steps to<br />
                <span className="font-medium">carbon clarity</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-10 left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] h-px bg-gradient-to-r from-emerald-500/30 via-emerald-500/50 to-emerald-500/30" />
              
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10">
                  <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-black text-xs font-black">1</div>
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">Ingest Data</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Upload CSV files or manually enter emissions data from any department — travel, utilities, or supply chain.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10">
                  <Zap className="w-8 h-8 text-blue-500" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-black text-xs font-black">2</div>
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">Auto-Convert</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Our engine automatically converts raw activity data into standardized tCO2e using verified conversion factors.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-500/10 border-2 border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10">
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-black">3</div>
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">Analyze & Report</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Visualize trends, identify hotspots, and export audit-ready reports for stakeholders and compliance teams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / Feature Bar */}
        <section className="py-24 lg:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-4">Why EcoTrack</p>
              <h2 className="text-3xl md:text-4xl font-light text-zinc-100">
                Built for <span className="font-medium">sustainability officers</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Shield, title: "Role-Based Access", desc: "Granular RBAC with 4 roles — Super Admin, Admin, Employee, and Executive Viewer." },
                { icon: Globe, title: "Multi-Department", desc: "Track emissions across unlimited departments with per-department drill-down analytics." },
                { icon: CheckCircle, title: "Audit-Ready Exports", desc: "Generate filtered XLSX reports ready for compliance audits and board presentations." },
                { icon: Zap, title: "Real-Time Conversion", desc: "Every data entry is instantly converted to tCO2e — no manual formulas needed." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-[#0a0a0a] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 mb-1">{item.title}</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/5 bg-gradient-to-b from-[#050505] to-[#0a0a0a] py-24 lg:py-32">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-zinc-100 mb-4">
              Ready to <span className="font-medium text-emerald-400">decarbonize</span>?
            </h2>
            <p className="text-zinc-500 text-sm mb-10">Start tracking your organization's carbon footprint in minutes.</p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-black px-10 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
