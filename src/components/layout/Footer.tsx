export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <p className="text-zinc-100 font-bold uppercase tracking-widest text-sm">EcoTrack</p>
        <p className="text-zinc-500 text-xs mt-2 font-medium">Sustainability Intelligence Platform</p>
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest mt-6">&copy; {new Date().getFullYear()} EcoTrack.</p>
      </div>
    </footer>
  );
}
