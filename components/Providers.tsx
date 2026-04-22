'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store/auth-store';

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    const rehydrate = async () => {
      await useAppStore.persist.rehydrate();
      hydrate();
    };
    rehydrate();
  }, [hydrate]);

  return <>{children}</>;
}
