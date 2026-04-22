import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex items-center gap-3 text-[#8a8a9a] font-[family-name:var(--font-mono)]">
        <Loader2 className="w-5 h-5 animate-spin text-[#00e676]" />
        <span>Provisioning lab environment...</span>
      </div>
    </div>
  );
}
