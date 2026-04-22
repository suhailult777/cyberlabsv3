'use client';

import Link from 'next/link';
import { ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#06060a] grid-bg scanlines">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Error Code */}
        <div className="mb-6">
          <span className="text-8xl font-bold text-[#00e676] font-[family-name:var(--font-mono)] text-glow">
            404
          </span>
        </div>

        {/* Terminal Message */}
        <div className="rounded-lg border border-[#1a1a2e] bg-[#0e0e14] p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#ff4757] shadow-[0_0_12px_#ff4757]" />
          <div className="font-[family-name:var(--font-mono)] text-sm space-y-2">
            <p className="text-[#8a8a9a]">
              <span className="text-[#00e676]">$</span> curl -I {typeof window !== 'undefined' ? window.location.pathname : '/unknown'}
            </p>
            <p className="text-[#ff4757]">HTTP/1.1 404 Not Found</p>
            <p className="text-[#5a5a6a]">Connection: closed</p>
            <p className="text-[#5a5a6a]">Content-Type: text/html</p>
            <p className="text-[#ffb000] mt-3">
              Error: The requested resource does not exist on this server.
            </p>
          </div>
        </div>

        {/* Action */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-[#06060a] bg-[#00e676] hover:bg-[#00c853] rounded-md transition-all glow-accent font-[family-name:var(--font-mono)]"
        >
          <Home className="w-4 h-4" />
          Return to Base
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
