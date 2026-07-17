import { useEffect, useRef, useState } from "react";
import { X, BarChart3, Leaf, FileSpreadsheet, Users } from "lucide-react";

interface DashboardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardPreviewModal({ isOpen, onClose }: DashboardPreviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Wait for the next frame to trigger the animation so it doesn't instantly appear
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      document.body.style.overflow = "";
      const timer = setTimeout(() => setShouldRender(false), 300); // matches duration-300
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isAnimating ? "opacity-100 backdrop-blur-sm" : "opacity-0 backdrop-blur-none"
      }`}
    >
      <div 
        className="absolute inset-0 bg-black/60 transition-opacity duration-300"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      <div 
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full max-w-[1100px] max-h-[90vh] overflow-y-auto dark:bg-zinc-900 bg-white rounded-2xl border dark:border-white/[0.06] border-gray-200 shadow-2xl transition-all duration-300 transform outline-none ${
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start sm:items-center justify-between px-6 py-5 md:px-8 md:py-6 border-b dark:border-white/[0.06] border-gray-200 dark:bg-zinc-900/90 bg-white/90 backdrop-blur-md">
          <div className="pr-4">
            <h2 id="modal-title" className="text-xl md:text-2xl font-bold dark:text-white text-gray-900 tracking-tight">
              Dashboard Preview
            </h2>
            <p className="text-sm dark:text-zinc-400 text-gray-500 mt-1 font-medium leading-relaxed">
              Explore EcoTrack's modern sustainability management dashboard.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 flex-shrink-0 rounded-full dark:hover:bg-white/10 hover:bg-gray-100 dark:text-zinc-400 text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          <div className="rounded-2xl overflow-hidden border dark:border-white/[0.06] border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] mb-12 relative group bg-gray-50 dark:bg-zinc-900">
             <img 
               src="/dashboard-preview.png" 
               alt="EcoTrack Dashboard Preview" 
               className={`w-full h-auto object-contain transition-all duration-700 ease-out ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
             />
          </div>

          <div className="max-w-3xl mx-auto text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-900 mb-4 tracking-tight">
              Everything you need in one dashboard
            </h3>
            <p className="text-base dark:text-zinc-400 text-gray-500 font-medium leading-relaxed">
              EcoTrack provides organizations with a centralized dashboard to monitor carbon emissions, analyze sustainability metrics, manage departments, generate reports, and make data-driven environmental decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6">
            {/* Feature 1 */}
            <div className={`dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-md dark:hover:border-white/[0.12] ${isAnimating ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-4'}`}>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="text-base font-bold dark:text-white text-gray-900 mb-2">Analytics Dashboard</h4>
              <p className="text-sm dark:text-zinc-400 text-gray-500 font-medium">Interactive charts and KPI insights.</p>
            </div>
            
            {/* Feature 2 */}
            <div className={`dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-md dark:hover:border-white/[0.12] ${isAnimating ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-4'}`}>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <Leaf className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="text-base font-bold dark:text-white text-gray-900 mb-2">Carbon Tracking</h4>
              <p className="text-sm dark:text-zinc-400 text-gray-500 font-medium">Monitor emissions across departments.</p>
            </div>

            {/* Feature 3 */}
            <div className={`dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-md dark:hover:border-white/[0.12] ${isAnimating ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-4'}`}>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="text-base font-bold dark:text-white text-gray-900 mb-2">Reports</h4>
              <p className="text-sm dark:text-zinc-400 text-gray-500 font-medium">Generate exportable sustainability reports.</p>
            </div>

            {/* Feature 4 */}
            <div className={`dark:bg-zinc-900 bg-white border dark:border-white/[0.06] border-gray-200 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-md dark:hover:border-white/[0.12] ${isAnimating ? 'opacity-100 translate-y-0 delay-400' : 'opacity-0 translate-y-4'}`}>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="text-base font-bold dark:text-white text-gray-900 mb-2">User Management</h4>
              <p className="text-sm dark:text-zinc-400 text-gray-500 font-medium">Role-based access for secure collaboration.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 md:px-8 md:py-6 border-t dark:border-white/[0.06] border-gray-200 flex justify-center bg-gray-50 dark:bg-zinc-950">
          <button
            onClick={onClose}
            className="border border-gray-300 dark:border-white/20 dark:text-zinc-200 text-gray-700 px-8 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-300 dark:hover:bg-white/5 hover:bg-gray-100 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
