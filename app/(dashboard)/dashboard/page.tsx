'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { planSchema } from '@/lib/validators/schemas';
import { apiClient } from '@/lib/utils/api';
import { formatCurrency } from '@/lib/utils/format';
import { useAppStore } from '@/lib/store/auth-store';
import { LabGrid } from '@/components/labs/LabGrid';
import { Lab, Plan } from '@/types';
import { toast } from 'sonner';
import { ArrowRight, Clock, Loader2, Terminal, User, Activity, Server } from 'lucide-react';
import { PageTransition, FadeIn, SlideIn } from '@/components/motion';

type PlanForm = z.infer<typeof planSchema>;

export default function DashboardPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const setCurrentPlan = useAppStore((s) => s.setCurrentPlan);

  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [isLoadingLabs, setIsLoadingLabs] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PlanForm>({
    resolver: zodResolver(planSchema),
    defaultValues: { labId: '', hours: 2 },
  });

  useEffect(() => {
    apiClient<{ labs: Lab[] }>('/api/labs')
      .then((data) => {
        setLabs(data.labs);
        setIsLoadingLabs(false);
      })
      .catch(() => {
        toast.error('Failed to load labs');
        setIsLoadingLabs(false);
      });
  }, []);

  useEffect(() => {
    if (selectedLab) {
      form.setValue('labId', selectedLab.id);
    }
  }, [selectedLab, form]);

  const hours = form.watch('hours') || 1;
  const total = selectedLab ? selectedLab.hourlyPrice * hours : 0;

  const onSubmit = async (data: PlanForm) => {
    if (!selectedLab) {
      toast.error('Please select a lab');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient<{ plan: Plan }>('/api/plans', {
        method: 'POST',
        body: JSON.stringify({
          labId: data.labId,
          hours: data.hours,
          userId: user?.id || 'user-1',
        }),
      });
      setCurrentPlan(res.plan);
      toast.success('Plan created! Redirecting to payment...');
      router.push('/payment');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create plan';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasHydrated || isLoadingLabs) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-[#8a8a9a] font-[family-name:var(--font-mono)]">
          <Loader2 className="w-5 h-5 animate-spin text-[#00e676]" />
          <span>Initializing systems...</span>
        </div>
      </div>
    );
  }

  return (
    <PageTransition className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-[#00e676]" />
              <span className="text-[10px] font-bold text-[#00e676] font-[family-name:var(--font-mono)] tracking-wider">
                MISSION_CONTROL
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#e8e8ec] font-[family-name:var(--font-mono)]">
              Choose Your Lab
            </h1>
            <p className="text-sm text-[#8a8a9a] mt-1">
              Select a lab environment and set your desired duration.
            </p>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lab Grid */}
        <SlideIn direction="left" delay={0.1} className="lg:col-span-2">
          <LabGrid
            labs={labs}
            selectedId={selectedLab?.id}
            onSelect={(lab) => {
              setSelectedLab(lab);
              toast.info(`Selected ${lab.name}`);
            }}
          />
        </SlideIn>

        {/* Sidebar */}
        <SlideIn direction="right" delay={0.15} className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Operator Details */}
            <div className="p-5 rounded-lg border border-[#1a1a2e] bg-[#0e0e14] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00e676] shadow-[0_0_12px_#00e676]" />
              <h2 className="font-bold mb-4 flex items-center gap-2 text-sm text-[#e8e8ec] font-[family-name:var(--font-mono)]">
                <User className="w-4 h-4 text-[#00e676]" />
                OPERATOR_DETAILS
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#5a5a6a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                    Name
                  </span>
                  <span className="font-medium text-[#e8e8ec] font-[family-name:var(--font-mono)]">
                    {user?.name || 'Guest'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#5a5a6a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                    Email
                  </span>
                  <span className="font-medium text-[#e8e8ec] font-[family-name:var(--font-mono)] text-xs">
                    {user?.email || '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#5a5a6a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                    Status
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[#00e676] font-[family-name:var(--font-mono)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" />
                    ONLINE
                  </span>
                </div>
              </div>
            </div>

            {/* Plan Summary */}
            <div className="p-5 rounded-lg border border-[#1a1a2e] bg-[#0e0e14] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#ffb000] shadow-[0_0_12px_#ffb000]" />
              <h2 className="font-bold mb-4 flex items-center gap-2 text-sm text-[#e8e8ec] font-[family-name:var(--font-mono)]">
                <Activity className="w-4 h-4 text-[#ffb000]" />
                DEPLOYMENT_CONFIG
              </h2>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold mb-2 text-[#5a5a6a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                    Duration (hours)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={48}
                    {...form.register('hours', { setValueAs: (v) => Number(v) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-[#5a5a6a] mt-1 font-[family-name:var(--font-mono)]">
                    <span>1h</span>
                    <span className="font-bold text-[#00e676]">{hours}h</span>
                    <span>48h</span>
                  </div>
                  {form.formState.errors.hours && (
                    <p className="text-xs text-[#ff4757] mt-1 font-[family-name:var(--font-mono)]">
                      {form.formState.errors.hours.message}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-[#1a1a2e] space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[10px] font-bold text-[#5a5a6a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                      Lab
                    </span>
                    <span className="font-medium text-[#e8e8ec] font-[family-name:var(--font-mono)] text-xs">
                      {selectedLab?.name || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[10px] font-bold text-[#5a5a6a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                      Rate
                    </span>
                    <span className="font-medium text-[#e8e8ec] font-[family-name:var(--font-mono)] text-xs">
                      {selectedLab ? formatCurrency(selectedLab.hourlyPrice) + '/hr' : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[10px] font-bold text-[#5a5a6a] font-[family-name:var(--font-mono)] tracking-wider uppercase">
                      Hours
                    </span>
                    <span className="font-medium text-[#e8e8ec] font-[family-name:var(--font-mono)] text-xs">
                      {hours}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#1a1a2e]">
                    <span className="text-sm font-bold text-[#e8e8ec] font-[family-name:var(--font-mono)]">
                      TOTAL
                    </span>
                    <span className="text-xl font-bold text-[#00e676] font-[family-name:var(--font-mono)] text-glow">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedLab}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#06060a] bg-[#00e676] hover:bg-[#00c853] disabled:opacity-40 disabled:cursor-not-allowed rounded-md transition-all glow-accent font-[family-name:var(--font-mono)]"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {selectedLab ? 'DEPLOY_LAB' : 'SELECT_LAB'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </SlideIn>
      </div>
    </PageTransition>
  );
}
