import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, BarChart3, CloudUpload, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-mesh-darker flex flex-col relative overflow-hidden">
      {/* Floating background elements for depth */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-accent-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }} />

      {/* Navbar Minimal */}
      <nav className="relative z-10 py-6 px-6 lg:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-primary-500 to-accent-600 p-2 rounded-xl shadow-lg">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-secondary-900 tracking-tight">
            Eco<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Track</span>
          </span>
        </Link>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 text-center -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-secondary-900 tracking-tight leading-tight mb-6">
            Track your carbon footprint with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">precision.</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary-600 mb-10 max-w-2xl mx-auto font-medium">
            Empower your company to measure, manage, and reduce emissions with our intelligent sustainability dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="primary" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                Start Tracking Today
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl"
        >
          <div className="glass-card rounded-2xl p-6 text-left hover:scale-[1.02] transition-transform">
            <div className="bg-primary-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-secondary-900 mb-2">Deep Analytics</h3>
            <p className="text-secondary-600 text-sm">Visualize your emissions across departments and activity types with stunning interactive charts.</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-left hover:scale-[1.02] transition-transform">
            <div className="bg-info-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-info-600">
              <CloudUpload className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-secondary-900 mb-2">Bulk Import</h3>
            <p className="text-secondary-600 text-sm">Easily drag and drop CSV or Excel files to instantly upload thousands of historical carbon logs.</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-left hover:scale-[1.02] transition-transform">
            <div className="bg-warning-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-warning-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-secondary-900 mb-2">Secure & Private</h3>
            <p className="text-secondary-600 text-sm">Enterprise-grade security ensures your company's sustainability data remains completely private.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
