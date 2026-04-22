'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/auth-store';
import { apiClient } from '@/lib/utils/api';
import { toast } from 'sonner';
import { CheckCircle, Loader2, XCircle, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/motion';

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPlan = useAppStore((s) => s.currentPlan);
  const setPaymentStatus = useAppStore((s) => s.setPaymentStatus);

  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    const txnid = searchParams.get('txnid');
    const amount = searchParams.get('amount');
    const productinfo = searchParams.get('productinfo');
    const firstname = searchParams.get('firstname');
    const email = searchParams.get('email');
    const hash = searchParams.get('hash');
    const easebuzzStatus = searchParams.get('status');

    if (!txnid || !hash) {
      queueMicrotask(() => {
        setStatus('failed');
        setMessage('Invalid callback parameters.');
      });
      return;
    }

    async function verify() {
      try {
        const res = await apiClient<{ status: string; message?: string }>('/api/payments/verify', {
          method: 'POST',
          body: JSON.stringify({
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            status: easebuzzStatus,
            hash,
          }),
        });

        if (res.status === 'success') {
          setStatus('success');
          setPaymentStatus('success');
          toast.success('Payment verified!');
          setTimeout(() => {
            router.push('/provision');
          }, 1500);
        } else {
          setStatus('failed');
          setPaymentStatus('failed');
          setMessage(res.message || 'Payment verification failed.');
          toast.error(res.message || 'Payment verification failed.');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Payment verification failed.';
        setStatus('failed');
        setPaymentStatus('failed');
        setMessage(msg);
        toast.error(msg);
      }
    }

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (!currentPlan) {
    return (
      <PageTransition className="max-w-lg mx-auto text-center py-20">
        <Terminal className="w-12 h-12 text-[#5a5a6a] mx-auto mb-4" />
        <p className="text-[#8a8a9a] font-[family-name:var(--font-mono)]">No active plan found.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 text-[#00e676] hover:text-[#00c853] font-[family-name:var(--font-mono)] text-sm"
        >
          Go to Dashboard
        </button>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="max-w-lg mx-auto text-center py-20">
      <AnimatePresence mode="wait">
        {status === 'verifying' && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <Loader2 className="w-12 h-12 animate-spin text-[#00e676] mx-auto" />
            <h2 className="text-xl font-bold text-[#e8e8ec] font-[family-name:var(--font-mono)]">Verifying Payment</h2>
            <p className="text-sm text-[#8a8a9a] font-[family-name:var(--font-mono)]">{message}</p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <CheckCircle className="w-12 h-12 text-[#00e676] mx-auto" />
            <h2 className="text-xl font-bold text-[#e8e8ec] font-[family-name:var(--font-mono)]">Payment Successful!</h2>
            <p className="text-sm text-[#8a8a9a] font-[family-name:var(--font-mono)]">
              Redirecting to lab provisioning...
            </p>
          </motion.div>
        )}

        {status === 'failed' && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <XCircle className="w-12 h-12 text-[#ff4757] mx-auto" />
            <h2 className="text-xl font-bold text-[#e8e8ec] font-[family-name:var(--font-mono)]">Payment Failed</h2>
            <p className="text-sm text-[#8a8a9a] font-[family-name:var(--font-mono)] mb-6">{message}</p>
            <button
              onClick={() => router.push('/payment')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-[#06060a] bg-[#00e676] hover:bg-[#00c853] rounded-md transition-all glow-accent font-[family-name:var(--font-mono)]"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#00e676] mx-auto mb-4" />
          <p className="text-sm text-[#8a8a9a] font-[family-name:var(--font-mono)]">Loading...</p>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
