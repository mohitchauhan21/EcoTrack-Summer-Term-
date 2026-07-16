export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t dark:border-white/5 border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <p className="dark:text-zinc-100 text-gray-900 font-bold uppercase tracking-widest text-sm">EcoTrack</p>
        <p className="dark:text-zinc-500 text-gray-500 text-xs mt-2 font-medium">Sustainability Intelligence Platform</p>
        <p className="dark:text-zinc-600 text-gray-400 text-[10px] uppercase tracking-widest mt-6">&copy; {new Date().getFullYear()} EcoTrack.</p>
      </div>
    </footer>
  );
}
