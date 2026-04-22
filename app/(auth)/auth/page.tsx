'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginSchema, registerSchema } from '@/lib/validators/schemas';
import { useAppStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';
import { Loader2, Terminal, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import Link from 'next/link';
import { PageTransition } from '@/components/motion';

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAppStore((s) => s.login);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const hasHydrated = useAppStore((s) => s.hasHydrated);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  // Redirect authenticated users to dashboard after hydration
  // This prevents login form flash when using browser back button (bfcache)
  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [hasHydrated, isAuthenticated, router]);

  const handleLoginSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Request failed');
      login(resData.user);
      toast.success('Session initialized.');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Request failed');
      login(resData.user);
      toast.success('Account created.');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    loginForm.reset();
    registerForm.reset();
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
              onClick={() => switchMode('login')}
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
              onClick={() => switchMode('register')}
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

          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4" noValidate>
              <div>
                <label htmlFor="login-email" className="block text-[10px] font-bold mb-1.5 text-[#8a8a9a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  {...loginForm.register('email')}
                  placeholder="suhail@gmail.com"
                  className={`w-full px-3 py-2.5 rounded-md border bg-[#14141f] text-[#e8e8ec] text-sm focus:outline-none focus:border-[#00e676] focus:shadow-[0_0_12px_rgba(0,230,118,0.15)] transition-all font-[family-name:var(--font-mono)] placeholder:text-[#3a3a4a] ${
                    loginForm.formState.errors.email ? 'border-[#ff4757]' : 'border-[#1a1a2e]'
                  }`}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-[#ff4757] mt-1 font-[family-name:var(--font-mono)]">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="login-password" className="block text-[10px] font-bold mb-1.5 text-[#8a8a9a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  {...loginForm.register('password')}
                  placeholder="astr0000"
                  autoComplete="current-password"
                  className={`w-full px-3 py-2.5 rounded-md border bg-[#14141f] text-[#e8e8ec] text-sm focus:outline-none focus:border-[#00e676] focus:shadow-[0_0_12px_rgba(0,230,118,0.15)] transition-all font-[family-name:var(--font-mono)] placeholder:text-[#3a3a4a] ${
                    loginForm.formState.errors.password ? 'border-[#ff4757]' : 'border-[#1a1a2e]'
                  }`}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-[#ff4757] mt-1 font-[family-name:var(--font-mono)]">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#06060a] bg-[#00e676] hover:bg-[#00c853] disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all glow-accent font-[family-name:var(--font-mono)]"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                AUTHENTICATE
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4" noValidate>
              <div>
                <label htmlFor="reg-name" className="block text-[10px] font-bold mb-1.5 text-[#8a8a9a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                  Operator Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  {...registerForm.register('name')}
                  placeholder="your_name"
                  className={`w-full px-3 py-2.5 rounded-md border bg-[#14141f] text-[#e8e8ec] text-sm focus:outline-none focus:border-[#00e676] focus:shadow-[0_0_12px_rgba(0,230,118,0.15)] transition-all font-[family-name:var(--font-mono)] placeholder:text-[#3a3a4a] ${
                    registerForm.formState.errors.name ? 'border-[#ff4757]' : 'border-[#1a1a2e]'
                  }`}
                />
                {registerForm.formState.errors.name && (
                  <p className="text-xs text-[#ff4757] mt-1 font-[family-name:var(--font-mono)]">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-[10px] font-bold mb-1.5 text-[#8a8a9a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  {...registerForm.register('email')}
                  placeholder="suhail@gmail.com"
                  className={`w-full px-3 py-2.5 rounded-md border bg-[#14141f] text-[#e8e8ec] text-sm focus:outline-none focus:border-[#00e676] focus:shadow-[0_0_12px_rgba(0,230,118,0.15)] transition-all font-[family-name:var(--font-mono)] placeholder:text-[#3a3a4a] ${
                    registerForm.formState.errors.email ? 'border-[#ff4757]' : 'border-[#1a1a2e]'
                  }`}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-xs text-[#ff4757] mt-1 font-[family-name:var(--font-mono)]">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-[10px] font-bold mb-1.5 text-[#8a8a9a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  {...registerForm.register('password')}
                  placeholder="astr0000"
                  autoComplete="new-password"
                  className={`w-full px-3 py-2.5 rounded-md border bg-[#14141f] text-[#e8e8ec] text-sm focus:outline-none focus:border-[#00e676] focus:shadow-[0_0_12px_rgba(0,230,118,0.15)] transition-all font-[family-name:var(--font-mono)] placeholder:text-[#3a3a4a] ${
                    registerForm.formState.errors.password ? 'border-[#ff4757]' : 'border-[#1a1a2e]'
                  }`}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-xs text-[#ff4757] mt-1 font-[family-name:var(--font-mono)]">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="reg-confirm" className="block text-[10px] font-bold mb-1.5 text-[#8a8a9a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                  Confirm Password
                </label>
                <input
                  id="reg-confirm"
                  type="password"
                  {...registerForm.register('confirmPassword')}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className={`w-full px-3 py-2.5 rounded-md border bg-[#14141f] text-[#e8e8ec] text-sm focus:outline-none focus:border-[#00e676] focus:shadow-[0_0_12px_rgba(0,230,118,0.15)] transition-all font-[family-name:var(--font-mono)] placeholder:text-[#3a3a4a] ${
                    registerForm.formState.errors.confirmPassword ? 'border-[#ff4757]' : 'border-[#1a1a2e]'
                  }`}
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-[#ff4757] mt-1 font-[family-name:var(--font-mono)]">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#06060a] bg-[#00e676] hover:bg-[#00c853] disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all glow-accent font-[family-name:var(--font-mono)]"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                CREATE_ACCOUNT
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

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
