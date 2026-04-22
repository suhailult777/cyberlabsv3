'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';
import { Loader2, Terminal, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, FadeIn } from '@/components/motion';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const login = useAppStore((s) => s.login);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (mode === 'login') {
      if (!email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';
      if (!password) newErrors.password = 'Password is required';
    } else {
      if (!name.trim()) newErrors.name = 'Name is required';
      else if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
      if (!email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';
      if (!password) newErrors.password = 'Password is required';
      else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body: Record<string, string> = { email, password };
      if (mode === 'register') body.name = name;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Request failed');
      }

      login(data.user);
      toast.success(mode === 'login' ? 'Session initialized.' : 'Account created.');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (mode === 'login' ? 'Invalid credentials' : 'Registration failed');
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[#06060a] grid-bg scanlines">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <Terminal className="w-7 h-7 text-[#00e676] group-hover:drop-shadow-[0_0_8px_rgba(0,230,118,0.6)] transition-all" />
            <span className="text-2xl font-bold text-[#e8e8ec] font-[family-name:var(--font-mono)] text-glow">
              Cyberlabs
            </span>
          </Link>
          <p className="text-sm text-[#8a8a9a] font-[family-name:var(--font-mono)]">
            {mode === 'login' ? 'Authenticate to access lab environments' : 'Register new operator credentials'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-[#1a1a2e] bg-[#0e0e14] p-6 relative overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00e676] shadow-[0_0_12px_#00e676]" />

          {/* Mode Toggle */}
          <div className="flex rounded-md bg-[#14141f] p-1 mb-6 border border-[#1a1a2e]">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrors({}); }}
              className={`flex-1 py-2 text-xs font-bold rounded-sm transition-all font-[family-name:var(--font-mono)] tracking-wider flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-[#00e676] text-[#06060a] shadow-[0_0_12px_rgba(0,230,118,0.3)]'
                  : 'text-[#5a5a6a] hover:text-[#8a8a9a]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrors({}); }}
              className={`flex-1 py-2 text-xs font-bold rounded-sm transition-all font-[family-name:var(--font-mono)] tracking-wider flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-[#00e676] text-[#06060a] shadow-[0_0_12px_rgba(0,230,118,0.3)]'
                  : 'text-[#5a5a6a] hover:text-[#8a8a9a]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              REGISTER
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="block text-[10px] font-bold mb-1.5 text-[#8a8a9a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                  Operator Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="your_name"
                  className={`w-full px-3 py-2.5 rounded-md border bg-[#14141f] text-[#e8e8ec] text-sm focus:outline-none focus:border-[#00e676] focus:shadow-[0_0_12px_rgba(0,230,118,0.15)] transition-all font-[family-name:var(--font-mono)] placeholder:text-[#3a3a4a] ${
                    errors.name ? 'border-[#ff4757]' : 'border-[#1a1a2e]'
                  }`}
                />
                {errors.name && <p className="text-xs text-[#ff4757] mt-1 font-[family-name:var(--font-mono)]">{errors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[10px] font-bold mb-1.5 text-[#8a8a9a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="suhail@gmail.com"
                className={`w-full px-3 py-2.5 rounded-md border bg-[#14141f] text-[#e8e8ec] text-sm focus:outline-none focus:border-[#00e676] focus:shadow-[0_0_12px_rgba(0,230,118,0.15)] transition-all font-[family-name:var(--font-mono)] placeholder:text-[#3a3a4a] ${
                  errors.email ? 'border-[#ff4757]' : 'border-[#1a1a2e]'
                }`}
              />
              {errors.email && <p className="text-xs text-[#ff4757] mt-1 font-[family-name:var(--font-mono)]">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold mb-1.5 text-[#8a8a9a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="astr0000"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className={`w-full px-3 py-2.5 rounded-md border bg-[#14141f] text-[#e8e8ec] text-sm focus:outline-none focus:border-[#00e676] focus:shadow-[0_0_12px_rgba(0,230,118,0.15)] transition-all font-[family-name:var(--font-mono)] placeholder:text-[#3a3a4a] ${
                  errors.password ? 'border-[#ff4757]' : 'border-[#1a1a2e]'
                }`}
              />
              {errors.password && <p className="text-xs text-[#ff4757] mt-1 font-[family-name:var(--font-mono)]">{errors.password}</p>}
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-[10px] font-bold mb-1.5 text-[#8a8a9a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className={`w-full px-3 py-2.5 rounded-md border bg-[#14141f] text-[#e8e8ec] text-sm focus:outline-none focus:border-[#00e676] focus:shadow-[0_0_12px_rgba(0,230,118,0.15)] transition-all font-[family-name:var(--font-mono)] placeholder:text-[#3a3a4a] ${
                    errors.confirmPassword ? 'border-[#ff4757]' : 'border-[#1a1a2e]'
                  }`}
                />
                {errors.confirmPassword && <p className="text-xs text-[#ff4757] mt-1 font-[family-name:var(--font-mono)]">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#06060a] bg-[#00e676] hover:bg-[#00c853] disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all glow-accent font-[family-name:var(--font-mono)]"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'AUTHENTICATE' : 'CREATE_ACCOUNT'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-3 rounded-md bg-[#14141f] border border-[#1a1a2e]">
            <p className="text-[11px] text-center text-[#5a5a6a] font-[family-name:var(--font-mono)]">
              Demo credentials: <span className="text-[#8a8a9a]">suhail@gmail.com</span> / <span className="text-[#8a8a9a]">astr0000</span>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
