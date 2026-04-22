import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="max-w-lg mx-auto text-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-[#00e676] mx-auto mb-4" />
      <p className="text-sm text-[#8a8a9a] font-[family-name:var(--font-mono)]">Loading payment gateway...</p>
    </div>
  );
}
