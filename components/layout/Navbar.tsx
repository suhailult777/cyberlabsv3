'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/auth-store';
import { LogOut, Terminal } from 'lucide-react';

export function Navbar() {
  const { isAuthenticated, user, logout, hasHydrated } = useAppStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    // Call logout API first to clear server-side cookie
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    // Then clear client-side state (localStorage, sessionStorage, cookie, zustand)
    logout();
    // Hard reload to ensure clean state
    window.location.href = '/';
  };

  if (!hasHydrated) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a2e] bg-[#06060a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight font-[family-name:var(--font-mono)]">
              <Terminal className="w-5 h-5 text-[#00e676]" />
              <span>Cyberlabs</span>
            </div>
            <div className="h-8 w-24 bg-[#1a1a2e] rounded-md animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[#1a1a2e] bg-[#06060a]/90 backdrop-blur-xl shadow-lg shadow-black/20'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight font-[family-name:var(--font-mono)] group"
          >
            <Terminal className="w-5 h-5 text-[#00e676] group-hover:drop-shadow-[0_0_8px_rgba(0,230,118,0.6)] transition-all" />
            <span className="text-glow">Cyberlabs</span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-[#8a8a9a] font-[family-name:var(--font-mono)]">
                  <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
                  <span>{user?.name || user?.email?.split('@')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8a8a9a] hover:text-[#ff4757] transition-colors font-[family-name:var(--font-mono)]"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">EXIT</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#06060a] bg-[#00e676] hover:bg-[#00c853] rounded-md transition-all glow-accent font-[family-name:var(--font-mono)]"
              >
                <Terminal className="w-4 h-4" />
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
