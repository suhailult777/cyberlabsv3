'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/auth-store';
import { apiClient } from '@/lib/utils/api';
import { ProvisioningSteps } from '@/components/provision/ProvisioningSteps';
import { LabEnvironmentView } from '@/components/provision/LabEnvironment';
import { LabEnvironment } from '@/types';
import { toast } from 'sonner';
import { Loader2, Server } from 'lucide-react';
import { PageTransition, FadeIn } from '@/components/motion';

export default function ProvisionPage() {
  const router = useRouter();
  const currentPlan = useAppStore((s) => s.currentPlan);
  const labEnvironment = useAppStore((s) => s.labEnvironment);
  const setLabEnvironment = useAppStore((s) => s.setLabEnvironment);

  const [currentStep, setCurrentStep] = useState(0);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const hasStartedProvisioning = useRef(false);

  const isReady = labEnvironment?.status === 'running';

  const startProvisioning = useCallback(async () => {
    if (!currentPlan || isProvisioning || hasStartedProvisioning.current) return;
    hasStartedProvisioning.current = true;
    setIsProvisioning(true);

    for (let i = 0; i < 3; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    try {
      const res = await apiClient<{ environment: LabEnvironment }>('/api/provision', {
        method: 'POST',
        body: JSON.stringify({ planId: currentPlan.id }),
      });

      setLabEnvironment(res.environment);
      setCurrentStep(3);
      toast.success('Lab is ready!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Provisioning failed';
      toast.error(message);
      hasStartedProvisioning.current = false;
    } finally {
      setIsProvisioning(false);
    }
  }, [currentPlan, isProvisioning, setLabEnvironment]);

  useEffect(() => {
    if (!currentPlan) {
      router.push('/dashboard');
      return;
    }

    if (!isReady && !hasStartedProvisioning.current) {
      startProvisioning();
    }
  }, [currentPlan, isReady, router, startProvisioning]);

  const handleEndSession = () => {
    setLabEnvironment(null);
    toast.info('Session ended');
    router.push('/dashboard');
  };

  const handleOpenLab = () => {
    if (labEnvironment) {
      router.push(labEnvironment.accessUrl);
    }
  };

  if (!currentPlan) {
    return (
      <PageTransition className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-[#8a8a9a] font-[family-name:var(--font-mono)]">
          <Loader2 className="w-5 h-5 animate-spin text-[#00e676]" />
          <span>Checking plan status...</span>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="max-w-3xl mx-auto">
      <FadeIn>
        <div className="flex items-center gap-2 mb-2">
          <Server className="w-4 h-4 text-[#00e676]" />
          <span className="text-[10px] font-bold text-[#00e676] font-[family-name:var(--font-mono)] tracking-wider">
            {isReady ? 'ENVIRONMENT_READY' : 'PROVISIONING'}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#e8e8ec] mb-2 font-[family-name:var(--font-mono)]">
          {isReady ? 'Your Lab Environment' : 'Provisioning Lab'}
        </h1>
        <p className="text-sm text-[#8a8a9a] mb-8">
          {isReady
            ? 'Your lab is running. Access details are below.'
            : `Setting up ${currentPlan.labName}. This will only take a moment.`}
        </p>
      </FadeIn>

      {!isReady ? (
        <ProvisioningSteps currentStep={currentStep} />
      ) : labEnvironment ? (
        <LabEnvironmentView
          environment={labEnvironment}
          onEndSession={handleEndSession}
          onOpenLab={handleOpenLab}
        />
      ) : null}
    </PageTransition>
  );
}
