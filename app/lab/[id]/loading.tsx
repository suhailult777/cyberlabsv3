import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#06060a] flex items-center justify-center">
      <div className="flex items-center gap-3 text-[#8a8a9a] font-[family-name:var(--font-mono)]">
        <Loader2 className="w-5 h-5 animate-spin text-[#00e676]" />
        <span>Loading lab environment...</span>
      </div>
    </div>
  );
}
