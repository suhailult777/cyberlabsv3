'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppStore } from '@/lib/store/auth-store';
import { formatDuration } from '@/lib/utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Copy,
  Power,
  Terminal,
  User,
  Shield,
  Activity,
  ChevronRight,
  Wifi,
  Server,
} from 'lucide-react';
import { toast } from 'sonner';

const BOOT_LINES = [
  '[ OK ] Started kernel.',
  '[ OK ] Mounted /proc.',
  '[ OK ] Mounted /sys.',
  '[ OK ] Started udev Kernel Device Manager.',
  '[ OK ] Mounted /dev/hugepages.',
  '[ OK ] Mounted /dev/mqueue.',
  '[ OK ] Started Remount Root and Kernel File Systems.',
  '[ OK ] Started dhcpcd on all interfaces.',
  '[ OK ] Started OpenBSD Secure Shell server.',
  '[ OK ] Started Cyberlabs Agent v3.2.1',
  '[ OK ] Environment ready.',
];

export default function LabPage() {
  const router = useRouter();
  const params = useParams();
  const envId = params.id as string;

  const labEnvironment = useAppStore((s) => s.labEnvironment);
  const currentPlan = useAppStore((s) => s.currentPlan);
  const setLabEnvironment = useAppStore((s) => s.setLabEnvironment);
  const user = useAppStore((s) => s.user);
  const hasHydrated = useAppStore((s) => s.hasHydrated);

  const [timeLeft, setTimeLeft] = useState(0);
  const [bootIndex, setBootIndex] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  // Validate environment — wait for store hydration before redirecting
  useEffect(() => {
    if (!hasHydrated) return;
    if (!labEnvironment || labEnvironment.id !== envId) {
      router.replace('/dashboard');
    }
  }, [hasHydrated, labEnvironment, envId, router]);

  // Countdown timer
  useEffect(() => {
    if (!labEnvironment) return;
    const expiry = new Date(labEnvironment.expiresAt).getTime();
    const updateTimer = () => {
      const remaining = expiry - Date.now();
      setTimeLeft(Math.max(0, remaining));
      if (remaining <= 0) {
        toast.error('Lab session expired');
        setLabEnvironment(null);
        router.push('/dashboard');
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [labEnvironment, router, setLabEnvironment]);

  // Boot sequence animation
  useEffect(() => {
    if (bootIndex < BOOT_LINES.length) {
      const timer = setTimeout(() => {
        setBootIndex((i) => i + 1);
      }, 120 + Math.random() * 180);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowPrompt(true), 400);
      return () => clearTimeout(timer);
    }
  }, [bootIndex]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [bootIndex, commandHistory, currentInput]);

  const handleEndSession = () => {
    setLabEnvironment(null);
    toast.info('Session ended');
    router.push('/dashboard');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      const cmd = currentInput.trim();
      setCommandHistory((prev) => [...prev, `$ ${cmd}`]);
      setCurrentInput('');

      // Simple mock responses
      setTimeout(() => {
        const responses: Record<string, string> = {
          help: 'Available commands: help, whoami, ls, status, ip, clear, exit',
          whoami: user?.name || 'student',
          ls: 'Documents  Downloads  lab-tools  notes.txt  target-list.txt',
          status: 'Lab environment: RUNNING\nUptime: 0m\nServices: ssh, http, nmap, metasploit',
          ip: '10.0.42.15/24',
          clear: '__CLEAR__',
          exit: 'Use the End Session button to disconnect.',
        };
        const response = responses[cmd.toLowerCase()] || `Command not found: ${cmd}`;
        if (response === '__CLEAR__') {
          setCommandHistory([]);
        } else {
          setCommandHistory((prev) => [...prev, response]);
        }
      }, 150 + Math.random() * 200);
    }
  };

  if (!hasHydrated || !labEnvironment || labEnvironment.id !== envId) {
    return (
      <div className="min-h-screen bg-[#06060a] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#8a8a9a] font-[family-name:var(--font-mono)]">
          <Activity className="w-5 h-5 animate-spin text-[#00e676]" />
          <span>Verifying session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06060a] text-[#e8e8ec] flex flex-col font-[family-name:var(--font-mono)] overflow-hidden">
      {/* Top Status Bar */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="shrink-0 border-b border-[#1a1a2e] bg-[#06060a]/90 backdrop-blur-md z-50"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 h-14">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Server className="w-4 h-4 text-[#00e676]" />
              <span className="text-[10px] font-bold text-[#00e676] tracking-wider uppercase">
                ENVIRONMENT_READY
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[#1a1a2e]" />
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#5a5a6a]">
              <Wifi className="w-3 h-3 text-[#00e676] animate-pulse" />
              <span>{currentPlan?.labName || 'Lab Environment'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#ffb000]/5 border border-[#ffb000]/20">
              <Clock className="w-3.5 h-3.5 text-[#ffb000]" />
              <span className="text-xs font-bold text-[#ffb000] tabular-nums">
                {formatDuration(timeLeft)}
              </span>
            </div>

            {/* End Session */}
            <button
              onClick={handleEndSession}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#ff4757] bg-[#ff4757]/5 border border-[#ff4757]/20 hover:bg-[#ff4757]/10 rounded-md transition-colors"
            >
              <Power className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">END_SESSION</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Terminal Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col min-h-0 p-3 sm:p-4"
        >
          <div className="flex-1 flex flex-col rounded-lg border border-[#1a1a2e] overflow-hidden bg-[#0a0a10]">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#14141f] border-b border-[#1a1a2e] shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff4757]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffb000]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00e676]" />
                </div>
                <span className="text-[10px] text-[#5a5a6a] ml-2 tracking-wider">
                  {envId} — ssh student@{envId}.cyberlabs.local
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-[#00e676]" />
                <span className="text-[10px] text-[#00e676] tracking-wider">SECURE</span>
              </div>
            </div>

            {/* Terminal Body */}
            <div
              ref={terminalRef}
              className="flex-1 overflow-y-auto p-4 space-y-1 text-sm leading-relaxed"
            >
              {/* Boot lines */}
              <AnimatePresence>
                {BOOT_LINES.slice(0, bootIndex).map((line, i) => (
                  <motion.p
                    key={`boot-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[#5a5a6a] text-xs"
                  >
                    {line}
                  </motion.p>
                ))}
              </AnimatePresence>

              {/* Command history */}
              {commandHistory.map((entry, i) => (
                <p
                  key={`cmd-${i}`}
                  className={
                    entry.startsWith('$ ')
                      ? 'text-[#e8e8ec]'
                      : 'text-[#8a8a9a] whitespace-pre-wrap'
                  }
                >
                  {entry.startsWith('$ ') ? (
                    <>
                      <span className="text-[#00e676]">$</span>{' '}
                      <span className="text-[#e8e8ec]">{entry.slice(2)}</span>
                    </>
                  ) : (
                    entry
                  )}
                </p>
              ))}

              {/* Active prompt */}
              {showPrompt && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 pt-1"
                >
                  <span className="text-[#00e676] shrink-0">$</span>
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleCommand}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    className="flex-1 bg-transparent text-[#e8e8ec] outline-none placeholder:text-[#3a3a4a] min-w-0"
                    placeholder="Type a command (help, whoami, ls, status, ip, clear, exit)..."
                  />
                  <span className="w-2 h-4 bg-[#00e676] animate-pulse shrink-0" />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Sidebar — Credentials & Info */}
        <motion.aside
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-[#1a1a2e] bg-[#0a0a10]/50 backdrop-blur-sm p-4 space-y-4 overflow-y-auto"
        >
          {/* Connection Info */}
          <div className="p-4 rounded-lg border border-[#1a1a2e] bg-[#0e0e14] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00e676] shadow-[0_0_12px_#00e676]" />
            <h3 className="text-[10px] font-bold text-[#5a5a6a] tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Connection
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[#5a5a6a] block mb-0.5">SSH Command</span>
                <code className="block text-[#00e676] bg-[#14141f] px-2 py-1.5 rounded border border-[#1a1a2e] break-all">
                  ssh student@{envId}.cyberlabs.local
                </code>
              </div>
              <div>
                <span className="text-[#5a5a6a] block mb-0.5">Access URL</span>
                <code className="block text-[#8a8a9a] bg-[#14141f] px-2 py-1.5 rounded border border-[#1a1a2e] break-all">
                  {labEnvironment.accessUrl}
                </code>
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className="p-4 rounded-lg border border-[#1a1a2e] bg-[#0e0e14] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#ffb000] shadow-[0_0_12px_#ffb000]" />
            <h3 className="text-[10px] font-bold text-[#5a5a6a] tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Credentials
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#5a5a6a] uppercase tracking-wider">Username</span>
                  <button
                    onClick={() => copyToClipboard(labEnvironment.username, 'Username')}
                    className="text-[#5a5a6a] hover:text-[#8a8a9a] transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm text-[#e8e8ec] font-medium">{labEnvironment.username}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#5a5a6a] uppercase tracking-wider">Password</span>
                  <button
                    onClick={() => copyToClipboard(labEnvironment.password, 'Password')}
                    className="text-[#5a5a6a] hover:text-[#8a8a9a] transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm text-[#e8e8ec] font-medium font-[family-name:var(--font-mono)] tracking-wider">
                  {labEnvironment.password}
                </p>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="p-4 rounded-lg border border-[#1a1a2e] bg-[#0e0e14]">
            <h3 className="text-[10px] font-bold text-[#5a5a6a] tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Session
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5a5a6a]">Status</span>
                <span className="text-[#00e676] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" />
                  RUNNING
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5a5a6a]">Started</span>
                <span className="text-[#8a8a9a]">
                  {new Date(labEnvironment.startedAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5a5a6a]">Expires</span>
                <span className="text-[#8a8a9a]">
                  {new Date(labEnvironment.expiresAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5a5a6a]">Plan</span>
                <span className="text-[#8a8a9a]">{currentPlan?.labName || '—'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button
              onClick={() =>
                copyToClipboard(
                  `ssh student@${envId}.cyberlabs.local\nPassword: ${labEnvironment.password}`,
                  'SSH details'
                )
              }
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-bold text-[#06060a] bg-[#00e676] hover:bg-[#00c853] rounded-md transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy SSH Details
            </button>
            <button
              onClick={handleEndSession}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-bold text-[#ff4757] bg-[#ff4757]/5 border border-[#ff4757]/20 hover:bg-[#ff4757]/10 rounded-md transition-colors"
            >
              <Power className="w-3.5 h-3.5" />
              End Session
            </button>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
