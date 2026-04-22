export function Footer() {
  return (
    <footer className="border-t border-[#1a1a2e] bg-[#06060a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#5a5a6a] font-[family-name:var(--font-mono)]">
            &copy; {new Date().getFullYear()} Cyberlabs :: Mock prototype for educational purposes
          </p>
          <div className="flex items-center gap-6 text-xs text-[#5a5a6a] font-[family-name:var(--font-mono)]">
            <span className="hover:text-[#8a8a9a] cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-[#8a8a9a] cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-[#8a8a9a] cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
