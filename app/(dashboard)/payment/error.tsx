'use client';

import { useEffect } from 'react';
import { CreditCard, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto text-center py-20 px-4">
      <CreditCard className="w-12 h-12 text-[#ff4757] mx-auto mb-4" />
      <h2 className="text-xl font-bold text-[#e8e8ec] font-[family-name:var(--font-mono)] mb-2">
        Payment Error
      </h2>
      <p className="text-sm text-[#8a8a9a] font-[family-name:var(--font-mono)] mb-6">
        {error.message || 'An unexpected error occurred during payment processing.'}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#06060a] bg-[#00e676] hover:bg-[#00c853] rounded-md transition-all font-[family-name:var(--font-mono)]"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );
}
