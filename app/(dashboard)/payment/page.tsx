'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/lib/store/auth-store';
import { apiClient } from '@/lib/utils/api';
import { formatCurrency } from '@/lib/utils/format';
import { toast } from 'sonner';
import { ArrowRight, CheckCircle, CreditCard, Loader2, ShieldCheck, Terminal, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, FadeIn } from '@/components/motion';

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPlan = useAppStore((s) => s.currentPlan);
  const setPaymentStatus = useAppStore((s) => s.setPaymentStatus);
  const paymentStatus = useAppStore((s) => s.paymentStatus);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const mockSuccess = searchParams.get('mock') === 'success';

  useEffect(() => {
    if (!mockSuccess || !currentPlan) return;
    const planId = currentPlan.id;

    let cancelled = false;

    async function runMockSuccess() {
      setIsProcessing(true);
      setPaymentStatus('processing');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (cancelled) return;
      await apiClient('/api/payments/verify', {
        method: 'POST',
        body: JSON.stringify({ txnId: 'txn-mock', planId }),
      });
      if (cancelled) return;
      setPaymentStatus('success');
      toast.success('Payment successful!');
      setTimeout(() => {
        if (!cancelled) router.push('/provision');
      }, 1500);
    }

    runMockSuccess();
    return () => { cancelled = true; };
  }, [mockSuccess, currentPlan, router, setPaymentStatus]);

  if (!currentPlan) {
    return (
      <PageTransition className="text-center py-20">
        <Terminal className="w-12 h-12 text-[#5a5a6a] mx-auto mb-4" />
        <p className="text-[#8a8a9a] font-[family-name:var(--font-mono)]">No active plan found.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 text-[#00e676] hover:text-[#00c853] font-[family-name:var(--font-mono)] text-sm"
        >
          Return to Dashboard
        </button>
      </PageTransition>
    );
  }

  const handlePay = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const data = await apiClient<{
        mock: boolean;
        paymentUrl?: string;
        txnId: string;
        hash?: string;
        key?: string;
        amount?: string;
        productinfo?: string;
        firstname?: string;
        email?: string;
        surl?: string;
        furl?: string;
      }>('/api/payments/initiate', {
        method: 'POST',
        body: JSON.stringify({
          planId: currentPlan.id,
          amount: currentPlan.totalAmount,
          productinfo: currentPlan.labName,
          firstname: useAppStore.getState().user?.name || 'Student',
          email: useAppStore.getState().user?.email || 'student@cyberlabs.local',
        }),
      });

      if (data.mock) {
        setIsMockMode(true);
        setIsProcessing(false);
        setPaymentStatus('idle');
      } else if (data.paymentUrl && formRef.current) {
        const form = formRef.current;
        form.action = data.paymentUrl;
        form.method = 'POST';
        const fields: Record<string, string | undefined> = {
          key: data.key,
          txnid: data.txnId,
          amount: data.amount,
          productinfo: data.productinfo,
          firstname: data.firstname,
          email: data.email,
          hash: data.hash,
          surl: data.surl,
          furl: data.furl,
        };
        Object.entries(fields).forEach(([name, value]) => {
          if (value) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
          }
        });
        form.submit();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setPaymentStatus('failed');
      toast.error(message);
      setIsProcessing(false);
    }
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await apiClient('/api/payments/verify', {
        method: 'POST',
        body: JSON.stringify({
          txnId: `txn-mock-${Date.now()}`,
          planId: currentPlan.id,
          amount: currentPlan.totalAmount,
        }),
      });
      setPaymentStatus('success');
      toast.success('Payment simulated successfully!');
      setTimeout(() => {
        router.push('/provision');
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment simulation failed';
      setPaymentStatus('failed');
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition className="max-w-lg mx-auto">
      <FadeIn>
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-4 h-4 text-[#00e676]" />
          <span className="text-[10px] font-bold text-[#00e676] font-[family-name:var(--font-mono)] tracking-wider">
            PAYMENT_GATEWAY
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#e8e8ec] mb-8 font-[family-name:var(--font-mono)]">
          Process Payment
        </h1>
      </FadeIn>

      <div className="space-y-6">
        {/* Order Summary */}
        <FadeIn delay={0.1}>
          <div className="p-5 rounded-lg border border-[#1a1a2e] bg-[#0e0e14] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00e676] shadow-[0_0_12px_#00e676]" />
            <h2 className="font-bold mb-4 text-sm text-[#e8e8ec] font-[family-name:var(--font-mono)]">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[10px] font-bold text-[#5a5a6a] font-[family-name:var(--font-mono)] tracking-wider uppercase">Lab</span>
                <span className="font-medium text-[#e8e8ec] font-[family-name:var(--font-mono)] text-xs">{currentPlan.labName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-bold text-[#5a5a6a] font-[family-name:var(--font-mono)] tracking-wider uppercase">Hours</span>
                <span className="font-medium text-[#e8e8ec] font-[family-name:var(--font-mono)] text-xs">{currentPlan.hours}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-3 border-t border-[#1a1a2e]">
                <span className="text-[#e8e8ec] font-[family-name:var(--font-mono)]">TOTAL</span>
                <span className="text-[#00e676] font-[family-name:var(--font-mono)] text-glow">{formatCurrency(currentPlan.totalAmount)}</span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Payment Method */}
        <FadeIn delay={0.15}>
          <div className="p-5 rounded-lg border border-[#1a1a2e] bg-[#0e0e14]">
            <h2 className="font-bold mb-4 flex items-center gap-2 text-sm text-[#e8e8ec] font-[family-name:var(--font-mono)]">
              <ShieldCheck className="w-4 h-4 text-[#00e676]" />
              Payment Method
            </h2>
            <div className="p-4 rounded-md border border-[#00e676]/20 bg-[#00e676]/5 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#00e676]" />
              <div>
                <p className="text-sm font-medium text-[#e8e8ec] font-[family-name:var(--font-mono)]">Easebuzz Secure Checkout</p>
                <p className="text-xs text-[#5a5a6a] font-[family-name:var(--font-mono)]">
                  {isMockMode ? 'Mock mode active' : 'Click below to proceed'}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Hidden form for Easebuzz auto-submit */}
        <form ref={formRef} style={{ display: 'none' }} />

        {/* Actions */}
        <FadeIn delay={0.2}>
          <AnimatePresence mode="wait">
            {paymentStatus === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6 rounded-lg bg-[#00e676]/5 border border-[#00e676]/20"
              >
                <CheckCircle className="w-10 h-10 text-[#00e676] mx-auto mb-3" />
                <h3 className="font-bold text-lg text-[#e8e8ec] font-[family-name:var(--font-mono)]">Payment Successful!</h3>
                <p className="text-sm text-[#8a8a9a] mt-1 font-[family-name:var(--font-mono)]">
                  Redirecting to lab provisioning...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {!isMockMode ? (
                  <button
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#06060a] bg-[#00e676] hover:bg-[#00c853] disabled:opacity-40 disabled:cursor-not-allowed rounded-md transition-all glow-accent font-[family-name:var(--font-mono)]"
                  >
                    {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isProcessing ? 'Processing...' : `Pay ${formatCurrency(currentPlan.totalAmount)}`}
                    {!isProcessing && <ArrowRight className="w-4 h-4" />}
                  </button>
                ) : (
                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#06060a] bg-[#ffb000] hover:bg-[#e6a000] disabled:opacity-40 disabled:cursor-not-allowed rounded-md transition-all font-[family-name:var(--font-mono)]"
                  >
                    {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isProcessing ? 'Simulating...' : (
                      <>
                        <Zap className="w-4 h-4" />
                        Simulate Payment
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => router.push('/dashboard')}
                  disabled={isProcessing}
                  className="w-full text-sm text-[#5a5a6a] hover:text-[#8a8a9a] transition-colors font-[family-name:var(--font-mono)]"
                >
                  Back to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </FadeIn>
      </div>
    </PageTransition>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#00e676] mx-auto mb-4" />
          <p className="text-sm text-[#8a8a9a] font-[family-name:var(--font-mono)]">Loading payment gateway...</p>
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
