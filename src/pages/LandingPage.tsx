import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import DashboardPreviewModal from "../components/DashboardPreviewModal";
import { ArrowRight, Database, PieChart, RefreshCw, Shield, Globe, Zap, CheckCircle, BarChart3, FileSpreadsheet, Leaf, Sparkles, TrendingDown, Target, Award, Mail, Phone, MapPin, Clock } from "lucide-react";
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
    <div ref={ref} className="text-center group flex flex-col items-center justify-center h-full">
      <div className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900 mb-2 tracking-tight">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="dark:text-zinc-500 text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-widest group-hover:dark:text-zinc-300 text-gray-700 transition-colors">{label}</div>
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

function FeatureCard({ icon: Icon, title, description, delayIndex }: { icon: any, title: string, description: string, delayIndex: number }) {
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
    <div 
      ref={ref} 
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} group relative dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 h-full hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-md dark:hover:border-white/[0.12] text-left flex flex-col`}
      style={{ transitionDelay: `${delayIndex * 100}ms` }}
    >
      <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-emerald-500" />
      </div>
      <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-3">{title}</h3>
      <p className="dark:text-zinc-400 text-gray-500 font-medium leading-relaxed flex-grow">
        {description}
      </p>
    </div>
  );
}

function ContactInfoCard({ icon: Icon, title, content, subtitle, delayIndex }: { icon: any, title: string, content: string, subtitle: string, delayIndex: number }) {
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
    <div 
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 group hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-md dark:hover:border-white/[0.12] flex flex-col items-center text-center h-full`}
      style={{ transitionDelay: `${delayIndex * 100}ms` }}
    >
      <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
        <Icon className="w-6 h-6 text-emerald-500" />
      </div>
      <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">{title}</h3>
      <p className="text-base dark:text-zinc-200 text-gray-800 font-semibold mb-2">{content}</p>
      <p className="text-sm dark:text-zinc-500 text-gray-500 font-medium">{subtitle}</p>
    </div>
  );
}

export default function LandingPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="flex-1 dark:bg-zinc-950 bg-white flex flex-col pt-16 overflow-hidden transition-colors">
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

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-400 w-full sm:w-auto">
              <Link
                to="/login"
                className="group inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>Start Tracking</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center border border-gray-300 dark:border-white/20 dark:text-zinc-200 text-gray-700 px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-300 dark:hover:bg-white/5 hover:bg-gray-100 hover:-translate-y-0.5 active:scale-[0.98]"
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

        {/* Features Section */}
        <section id="features" className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t dark:border-white/[0.06] border-gray-200">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 mb-6">
              Everything you need to manage corporate carbon emissions
            </h2>
            <p className="text-lg dark:text-zinc-400 text-gray-500 max-w-3xl mx-auto font-medium">
              A comprehensive toolkit designed to help your organization track, analyze, and reduce its environmental impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Leaf} 
              title="Carbon Tracking" 
              description="Record and manage emissions across departments." 
              delayIndex={0}
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Analytics Dashboard" 
              description="Interactive charts and real-time sustainability insights." 
              delayIndex={1}
            />
            <FeatureCard 
              icon={Target} 
              title="Department Management" 
              description="Organize teams and monitor departmental emissions." 
              delayIndex={2}
            />
            <FeatureCard 
              icon={Database} 
              title="CSV Import" 
              description="Bulk upload emission records quickly and securely." 
              delayIndex={3}
            />
            <FeatureCard 
              icon={FileSpreadsheet} 
              title="Reports & Export" 
              description="Generate Excel reports for compliance and analysis." 
              delayIndex={4}
            />
            <FeatureCard 
              icon={Shield} 
              title="User & Role Management" 
              description="Secure role-based access for administrators and employees." 
              delayIndex={5}
            />
          </div>
        </section>

        <section id="about" className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t dark:border-white/[0.06] border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left Column */}
            <div className="flex-1 lg:max-w-[55%] w-full">
              <SectionReveal>
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
                  <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Why EcoTrack</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold dark:text-white text-gray-900 mb-6 leading-tight tracking-tight">
                  Helping organizations make sustainability measurable.
                </h2>
                <p className="text-lg dark:text-zinc-400 text-gray-600 mb-10 font-medium leading-relaxed">
                  EcoTrack centralizes carbon emission tracking, analytics, reporting, and department management into one intuitive platform, enabling organizations to monitor sustainability goals with confidence.
                </p>
                
                <div className="space-y-5">
                  {[
                    "Track emissions across departments",
                    "Generate sustainability reports instantly",
                    "Secure role-based collaboration"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-6 group" style={{ animationDelay: `${i * 150}ms` }}>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span className="dark:text-zinc-300 text-gray-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </SectionReveal>
            </div>

            {/* Right Column */}
            <div className="flex-1 lg:max-w-[45%] w-full">
              <SectionReveal className="delay-300">
                <div className="grid grid-cols-2 gap-6 sm:gap-6 relative">
                  {/* Subtle glow behind the grid */}
                  <div className="absolute inset-0 bg-emerald-500/5 blur-3xl -z-10 rounded-full" />
                  
                  {/* Card 1 */}
                  <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md dark:hover:border-white/[0.12] hover:border-emerald-500/30 flex flex-col items-center justify-center min-h-[160px] md:min-h-[180px]">
                    <AnimatedStat end={400} suffix="+" label="Emission Logs" />
                  </div>
                  {/* Card 2 */}
                  <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md dark:hover:border-white/[0.12] hover:border-emerald-500/30 flex flex-col items-center justify-center min-h-[160px] md:min-h-[180px] sm:translate-y-6">
                    <AnimatedStat end={6} label="User Roles" />
                  </div>
                  {/* Card 3 */}
                  <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md dark:hover:border-white/[0.12] hover:border-emerald-500/30 flex flex-col items-center justify-center min-h-[160px] md:min-h-[180px]">
                    <AnimatedStat end={4} label="Departments" />
                  </div>
                  {/* Card 4 */}
                  <div className="dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md dark:hover:border-white/[0.12] hover:border-emerald-500/30 flex flex-col items-center justify-center min-h-[160px] md:min-h-[180px] sm:translate-y-6">
                    <AnimatedStat end={100} suffix="%" label="Responsive Dashboard" />
                  </div>
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="relative dark:bg-zinc-800 bg-gray-50 border dark:border-white/[0.06] border-gray-200 rounded-2xl p-12 lg:p-20 text-center overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-2xl pointer-events-none" />
              
              <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">🌱 Ready to Make an Impact?</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold dark:text-white text-gray-900 mb-6 leading-tight tracking-tight">
                  Start tracking your organization's carbon footprint today.
                </h2>
                
                <p className="text-lg dark:text-zinc-400 text-gray-500 mb-10 font-medium">
                  Monitor emissions, generate reports, and gain actionable sustainability insights—all from one powerful platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    Get Started
                  </Link>
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="inline-flex items-center justify-center border border-gray-300 dark:border-white/20 dark:text-zinc-200 text-gray-700 px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-300 dark:hover:bg-white/5 hover:bg-gray-100 hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    View Dashboard
                  </button>
                </div>
              </div>
            </div>
          </SectionReveal>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t dark:border-white/[0.06] border-gray-200">
          <div className="max-w-4xl mx-auto">
            <SectionReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 mb-4 tracking-tight">Get in Touch</h2>
                <p className="text-lg dark:text-zinc-400 text-gray-500 font-medium">
                  Questions, feedback, or collaboration opportunities? We'd love to hear from you.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-6">
                <ContactInfoCard
                  icon={Mail}
                  title="Email"
                  content="support@ecotrack.com"
                  subtitle="General support & inquiries"
                  delayIndex={1}
                />
                <ContactInfoCard
                  icon={Phone}
                  title="Phone"
                  content="+91 98765 43210"
                  subtitle="Monday – Friday"
                  delayIndex={2}
                />
                <ContactInfoCard
                  icon={MapPin}
                  title="Location"
                  content="Jalandhar, India"
                  subtitle="Head Office"
                  delayIndex={3}
                />
                <ContactInfoCard
                  icon={Clock}
                  title="Business Hours"
                  content="Mon – Fri"
                  subtitle="9:00 AM – 6:00 PM IST"
                  delayIndex={4}
                />
              </div>
            </SectionReveal>
          </div>
        </section>
      </main>
      <DashboardPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
    </div>
  );
};