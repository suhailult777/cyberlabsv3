'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store/auth-store';

export function Providers({ children }: { children: React.ReactNode }) {
  const setHasHydrated = useAppStore((s) => s.setHasHydrated);

  useEffect(() => {
    // Rehydrate the persisted store on client mount
    // The persist middleware will restore user, isAuthenticated, currentPlan, etc.
    // from localStorage/sessionStorage automatically.
    useAppStore.persist.rehydrate();
    setHasHydrated(true);

    // Handle bfcache (Back-Forward Cache) restoration
    // When the browser restores a page from bfcache, the Zustand store might
    // have stale state. Force rehydration from localStorage to ensure auth persists.
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        useAppStore.persist.rehydrate();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [setHasHydrated]);

  return <>{children}</>;
}
