'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store/auth-store';

export function Providers({ children }: { children: React.ReactNode }) {
  const setHasHydrated = useAppStore((s) => s.setHasHydrated);

  useEffect(() => {
    // Rehydrate the persisted store on client mount
    // The persist middleware will restore user, isAuthenticated, currentPlan, etc.
    // from localStorage/sessionStorage automatically.
    // We just need to mark hydration as complete.
    useAppStore.persist.rehydrate();
    setHasHydrated(true);
  }, [setHasHydrated]);

  return <>{children}</>;
}
