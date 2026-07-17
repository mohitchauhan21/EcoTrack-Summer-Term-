import { Link } from "react-router-dom";
import { Leaf, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="dark:bg-[#050505] bg-gray-50 border-t dark:border-white/5 border-gray-200 pt-16 pb-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand */}
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
                <Leaf className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight uppercase dark:text-white text-gray-900">EcoTrack</span>
            </Link>
            <p className="text-sm dark:text-zinc-400 text-gray-500 font-medium leading-relaxed mb-6">
              Empowering organizations to track, measure, and reduce their carbon footprint through intelligent data.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-sm font-bold dark:text-white text-gray-900 uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm dark:text-zinc-400 text-gray-500 dark:hover:text-emerald-400 hover:text-emerald-600 font-medium transition-colors">Home</Link></li>
              <li><a href="/#features" className="text-sm dark:text-zinc-400 text-gray-500 dark:hover:text-emerald-400 hover:text-emerald-600 font-medium transition-colors">Features</a></li>
              <li><a href="/#about" className="text-sm dark:text-zinc-400 text-gray-500 dark:hover:text-emerald-400 hover:text-emerald-600 font-medium transition-colors">About</a></li>
              <li><a href="/#contact" className="text-sm dark:text-zinc-400 text-gray-500 dark:hover:text-emerald-400 hover:text-emerald-600 font-medium transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="flex flex-col">
            <h4 className="text-sm font-bold dark:text-white text-gray-900 uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/dashboard" className="text-sm dark:text-zinc-400 text-gray-500 dark:hover:text-emerald-400 hover:text-emerald-600 font-medium transition-colors">Dashboard</Link></li>
              <li><Link to="/dashboard/analytics" className="text-sm dark:text-zinc-400 text-gray-500 dark:hover:text-emerald-400 hover:text-emerald-600 font-medium transition-colors">Analytics</Link></li>
              <li><Link to="/dashboard/reports" className="text-sm dark:text-zinc-400 text-gray-500 dark:hover:text-emerald-400 hover:text-emerald-600 font-medium transition-colors">Reports</Link></li>
              <li><Link to="/dashboard/logs" className="text-sm dark:text-zinc-400 text-gray-500 dark:hover:text-emerald-400 hover:text-emerald-600 font-medium transition-colors">Carbon Logs</Link></li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="flex flex-col">
            <h4 className="text-sm font-bold dark:text-white text-gray-900 uppercase tracking-widest mb-6">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full dark:bg-[#0f0f0f] bg-white border dark:border-white/10 border-gray-200 flex items-center justify-center dark:text-zinc-400 text-gray-500 dark:hover:text-white hover:text-gray-900 dark:hover:border-white/30 hover:border-gray-400 hover:-translate-y-1 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full dark:bg-[#0f0f0f] bg-white border dark:border-white/10 border-gray-200 flex items-center justify-center dark:text-zinc-400 text-gray-500 dark:hover:text-white hover:text-gray-900 dark:hover:border-white/30 hover:border-gray-400 hover:-translate-y-1 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="mailto:hello@ecotrack.com" className="w-10 h-10 rounded-full dark:bg-[#0f0f0f] bg-white border dark:border-white/10 border-gray-200 flex items-center justify-center dark:text-zinc-400 text-gray-500 dark:hover:text-white hover:text-gray-900 dark:hover:border-white/30 hover:border-gray-400 hover:-translate-y-1 transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t dark:border-white/10 border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs dark:text-zinc-500 text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} EcoTrack. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <span className="text-[10px] sm:text-xs dark:text-zinc-600 text-gray-400 font-semibold uppercase tracking-widest">Version 1.0</span>
            <span className="text-[10px] sm:text-xs dark:text-zinc-600 text-gray-400 font-medium">Built with React, Node.js, Express & MongoDB.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
