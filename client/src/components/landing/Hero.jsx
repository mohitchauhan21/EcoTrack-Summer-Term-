import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-white min-h-[90vh] flex items-center justify-center py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side (50%) */}
          <div className="space-y-8 text-left">
            {/* Small Badge */}
            <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-wider">
              Carbon Emission Tracking Platform
            </span>

            {/* Large Heading */}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight max-w-[600px]">
              Track Your Company's <br />
              <span className="text-emerald-600">Carbon Footprint</span>
            </h1>

            {/* Short Description */}
            <p className="text-lg text-slate-600 leading-relaxed max-w-[500px]">
              EcoTrack helps organizations monitor, analyze and report carbon emissions through one centralized platform.
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <Link
                to="/register"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
              <a
                href="#learn-more"
                className="border border-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right Side (50% - Clean Placeholder wireframe card) */}
          <div className="flex justify-center items-center">
            {/* Main wireframe dashboard card */}
            <div className="w-full max-w-[500px] bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              {/* Header Wireframe */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <span className="text-xs font-semibold text-slate-400">Dashboard Preview</span>
                </div>
                <div className="w-16 h-4 bg-slate-200 rounded" />
              </div>

              {/* Three KPI Cards (Wireframe) */}
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-slate-200 bg-white rounded-lg p-3 space-y-2 h-16 flex flex-col justify-between">
                  <div className="w-10 h-2 bg-slate-100 rounded" />
                  <div className="w-14 h-3 bg-slate-200 rounded" />
                </div>
                <div className="border border-slate-200 bg-white rounded-lg p-3 space-y-2 h-16 flex flex-col justify-between">
                  <div className="w-10 h-2 bg-slate-100 rounded" />
                  <div className="w-12 h-3 bg-slate-200 rounded" />
                </div>
                <div className="border border-slate-200 bg-white rounded-lg p-3 space-y-2 h-16 flex flex-col justify-between">
                  <div className="w-8 h-2 bg-slate-100 rounded" />
                  <div className="w-10 h-3 bg-slate-200 rounded" />
                </div>
              </div>

              {/* Simple line placeholders simulating widgets */}
              <div className="border border-slate-200 bg-white rounded-lg p-4 space-y-3">
                <div className="w-24 h-3 bg-slate-200 rounded" />
                <div className="w-full h-2 bg-slate-100 rounded" />
                <div className="w-[85%] h-2 bg-slate-100 rounded" />
                <div className="w-[50%] h-2 bg-slate-100 rounded" />
              </div>

              {/* Recent Activity Table Placeholder */}
              <div className="border border-slate-200 bg-white rounded-lg p-4 space-y-3">
                {/* Table Title */}
                <div className="w-28 h-3 bg-slate-200 rounded mb-2" />
                
                {/* Table Rows */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <div className="w-24 h-2 bg-slate-100 rounded" />
                    <div className="w-12 h-2 bg-slate-100 rounded" />
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <div className="w-20 h-2 bg-slate-100 rounded" />
                    <div className="w-10 h-2 bg-slate-100 rounded" />
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <div className="w-28 h-2 bg-slate-100 rounded" />
                    <div className="w-14 h-2 bg-slate-100 rounded" />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
