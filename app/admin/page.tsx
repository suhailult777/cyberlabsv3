'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/utils/api';
import { formatCurrency } from '@/lib/utils/format';
import { Lab, Plan } from '@/types';
import {
  Activity,
  FlaskConical,
  DollarSign,
  Users,
  Server,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { FadeIn, SlideIn } from '@/components/motion';

interface Stats {
  totalLabs: number;
  totalPlans: number;
  totalRevenue: number;
  activeUsers: number;
  activeEnvironments: number;
  pendingPayments: number;
}

export default function AdminPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalLabs: 0,
    totalPlans: 0,
    totalRevenue: 0,
    activeUsers: 0,
    activeEnvironments: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [labsData, plansData] = await Promise.all([
          apiClient<{ labs: Lab[] }>('/api/labs'),
          apiClient<{ plans: Plan[] }>('/api/plans'),
        ]);

        setLabs(labsData.labs);
        setPlans(plansData.plans);

        const totalRevenue = plansData.plans.reduce(
          (sum, p) => sum + (p.status === 'paid' || p.status === 'provisioned' ? p.totalAmount : 0),
          0
        );
        const pendingPayments = plansData.plans.filter((p) => p.status === 'pending').length;
        const activeEnvironments = plansData.plans.filter((p) => p.status === 'provisioned').length;

        setStats({
          totalLabs: labsData.labs.length,
          totalPlans: plansData.plans.length,
          totalRevenue,
          activeUsers: 1,
          activeEnvironments,
          pendingPayments,
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const statCards = [
    {
      label: 'Total Labs',
      value: stats.totalLabs,
      icon: FlaskConical,
      color: 'text-[#00e676]',
      bg: 'bg-[#00e676]/10',
      border: 'border-[#00e676]/20',
    },
    {
      label: 'Total Plans',
      value: stats.totalPlans,
      icon: Activity,
      color: 'text-[#00e676]',
      bg: 'bg-[#00e676]/10',
      border: 'border-[#00e676]/20',
    },
    {
      label: 'Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-[#ffb000]',
      bg: 'bg-[#ffb000]/10',
      border: 'border-[#ffb000]/20',
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      icon: Users,
      color: 'text-[#ff4757]',
      bg: 'bg-[#ff4757]/10',
      border: 'border-[#ff4757]/20',
    },
    {
      label: 'Active Environments',
      value: stats.activeEnvironments,
      icon: Server,
      color: 'text-[#00e676]',
      bg: 'bg-[#00e676]/10',
      border: 'border-[#00e676]/20',
    },
    {
      label: 'Pending Payments',
      value: stats.pendingPayments,
      icon: Clock,
      color: 'text-[#ffb000]',
      bg: 'bg-[#ffb000]/10',
      border: 'border-[#ffb000]/20',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-[#8a8a9a] font-[family-name:var(--font-mono)]">
          <div className="w-5 h-5 border-2 border-[#1a1a2e] border-t-[#00e676] rounded-full animate-spin" />
          <span>Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <FadeIn>
        <div className="border-b border-[#1a1a2e] pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4 text-[#00e676]" />
            <span className="text-[10px] font-bold text-[#00e676] font-[family-name:var(--font-mono)] tracking-wider">
              ADMIN_CONSOLE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#e8e8ec] font-[family-name:var(--font-mono)]">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[#8a8a9a] mt-1 font-[family-name:var(--font-mono)]">
            Overview of platform activity and metrics.
          </p>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <SlideIn key={card.label} delay={index * 0.05} direction="up">
              <div className="p-5 rounded-lg border border-[#1a1a2e] bg-[#0e0e14] relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-md ${card.bg} border ${card.border}`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-[#5a5a6a]" />
                </div>
                <p className="text-2xl font-bold tracking-tight text-[#e8e8ec] font-[family-name:var(--font-mono)]">
                  {card.value}
                </p>
                <p className="text-xs text-[#5a5a6a] mt-1 font-[family-name:var(--font-mono)]">{card.label}</p>
              </div>
            </SlideIn>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Labs Table */}
        <SlideIn direction="left" delay={0.1}>
          <div className="rounded-lg border border-[#1a1a2e] bg-[#0e0e14] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a1a2e] flex items-center justify-between">
              <h2 className="font-bold text-sm text-[#e8e8ec] font-[family-name:var(--font-mono)]">Labs</h2>
              <span className="text-xs px-2 py-1 rounded-sm bg-[#14141f] text-[#8a8a9a] border border-[#1a1a2e] font-[family-name:var(--font-mono)]">
                {labs.length} total
              </span>
            </div>
            <div className="divide-y divide-[#1a1a2e]">
              {labs.map((lab) => (
                <div key={lab.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#e8e8ec] font-[family-name:var(--font-mono)]">{lab.name}</p>
                    <p className="text-xs text-[#5a5a6a] font-[family-name:var(--font-mono)] uppercase">{lab.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#00e676] font-[family-name:var(--font-mono)]">
                      {formatCurrency(lab.hourlyPrice)}/hr
                    </p>
                    <p className="text-xs text-[#5a5a6a] font-[family-name:var(--font-mono)]">{lab.difficulty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SlideIn>

        {/* Recent Plans */}
        <SlideIn direction="right" delay={0.15}>
          <div className="rounded-lg border border-[#1a1a2e] bg-[#0e0e14] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a1a2e] flex items-center justify-between">
              <h2 className="font-bold text-sm text-[#e8e8ec] font-[family-name:var(--font-mono)]">Recent Plans</h2>
              <span className="text-xs px-2 py-1 rounded-sm bg-[#14141f] text-[#8a8a9a] border border-[#1a1a2e] font-[family-name:var(--font-mono)]">
                {plans.length} total
              </span>
            </div>
            <div className="divide-y divide-[#1a1a2e]">
              {plans.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-[#5a5a6a] font-[family-name:var(--font-mono)]">
                  No plans created yet.
                </div>
              )}
              {plans.slice(-10).reverse().map((plan) => (
                <div key={plan.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#e8e8ec] font-[family-name:var(--font-mono)]">{plan.labName}</p>
                    <p className="text-xs text-[#5a5a6a] font-[family-name:var(--font-mono)]">{plan.hours} hrs</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#e8e8ec] font-[family-name:var(--font-mono)]">{formatCurrency(plan.totalAmount)}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-sm font-[family-name:var(--font-mono)] border ${
                        plan.status === 'provisioned'
                          ? 'bg-[#00e676]/10 text-[#00e676] border-[#00e676]/20'
                          : plan.status === 'paid'
                          ? 'bg-[#00e676]/10 text-[#00e676] border-[#00e676]/20'
                          : 'bg-[#14141f] text-[#5a5a6a] border-[#1a1a2e]'
                      }`}
                    >
                      {plan.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SlideIn>
      </div>
    </div>
  );
}
