'use client';

import { useEffect, useState } from 'react';
import { LabEnvironment } from '@/types';
import { formatDuration } from '@/lib/utils/format';
import { Clock, Copy, ExternalLink, Power, Terminal, User } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion';

interface LabEnvironmentViewProps {
  environment: LabEnvironment;
  onEndSession: () => void;
}

export function LabEnvironmentView({ environment, onEndSession }: LabEnvironmentViewProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const expiry = new Date(environment.expiresAt).getTime();
    const updateTimer = () => {
      const remaining = expiry - Date.now();
      setTimeLeft(Math.max(0, remaining));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [environment.expiresAt]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Countdown */}
      <FadeIn delay={0.1}>
        <div className="flex items-center justify-between p-4 rounded-lg bg-[#ffb000]/5 border border-[#ffb000]/20">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#ffb000]" />
            <span className="text-sm font-bold text-[#ffb000] font-[family-name:var(--font-mono)]">
              Time Remaining
            </span>
          </div>
          <span className="text-lg font-bold text-[#ffb000] font-[family-name:var(--font-mono)]">
            {formatDuration(timeLeft)}
          </span>
        </div>
      </FadeIn>

      {/* Mock Terminal */}
      <FadeIn delay={0.15}>
        <div className="rounded-lg border border-[#1a1a2e] overflow-hidden bg-[#0e0e14]">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#14141f] border-b border-[#1a1a2e]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff4757]" />
              <div className="w-3 h-3 rounded-full bg-[#ffb000]" />
              <div className="w-3 h-3 rounded-full bg-[#00e676]" />
            </div>
            <span className="text-xs text-[#5a5a6a] ml-2 font-[family-name:var(--font-mono)]">Lab Terminal</span>
          </div>
          <div className="p-4 font-[family-name:var(--font-mono)] text-sm text-[#00e676] space-y-1">
            <p>$ ssh student@{environment.accessUrl.replace('/lab/', '')}.cyberlabs.local</p>
            <p className="text-[#8a8a9a]">Connecting to lab environment...</p>
            <p className="text-[#8a8a9a]">Connected!</p>
            <p className="text-[#5a5a6a]">Welcome to {environment.accessUrl}. Type &apos;help&apos; for available commands.</p>
            <p className="animate-pulse">$ _</p>
          </div>
        </div>
      </FadeIn>

      {/* Credentials */}
      <FadeIn delay={0.2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-[#1a1a2e] bg-[#0e0e14]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#5a5a6a] font-[family-name:var(--font-mono)] tracking-wider uppercase flex items-center gap-1.5">
                <User className="w-4 h-4" />
                Username
              </span>
              <button
                onClick={() => copyToClipboard(environment.username, 'Username')}
                className="text-[#5a5a6a] hover:text-[#8a8a9a] transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#e8e8ec]">{environment.username}</p>
          </div>

          <div className="p-4 rounded-lg border border-[#1a1a2e] bg-[#0e0e14]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#5a5a6a] font-[family-name:var(--font-mono)] tracking-wider uppercase flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                Password
              </span>
              <button
                onClick={() => copyToClipboard(environment.password, 'Password')}
                className="text-[#5a5a6a] hover:text-[#8a8a9a] transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#e8e8ec]">{environment.password}</p>
          </div>
        </div>
      </FadeIn>

      {/* Actions */}
      <FadeIn delay={0.25}>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={environment.accessUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-[#06060a] bg-[#00e676] hover:bg-[#00c853] rounded-md transition-all glow-accent font-[family-name:var(--font-mono)]"
          >
            <ExternalLink className="w-4 h-4" />
            Open Lab Dashboard
          </a>
          <button
            onClick={onEndSession}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-[#ff4757] bg-[#ff4757]/5 border border-[#ff4757]/20 hover:bg-[#ff4757]/10 rounded-md transition-all font-[family-name:var(--font-mono)]"
          >
            <Power className="w-4 h-4" />
            End Session
          </button>
        </div>
      </FadeIn>
    </motion.div>
  );
}
