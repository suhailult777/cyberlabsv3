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
          activeUsers: 1, // Mock: only demo user
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
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Total Plans',
      value: stats.totalPlans,
      icon: Activity,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
    },
    {
      label: 'Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      icon: Users,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
    },
    {
      label: 'Active Environments',
      value: stats.activeEnvironments,
      icon: Server,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      label: 'Pending Payments',
      value: stats.pendingPayments,
      icon: Clock,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-neutral-700 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Dashboard</h1>
        <p className="text-sm text-neutral-400">Overview of platform activity and metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-neutral-600" />
              </div>
              <p className="text-2xl font-bold tracking-tight">{card.value}</p>
              <p className="text-xs text-neutral-500 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Labs Table */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="font-semibold">Labs</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-neutral-800 text-neutral-400">
              {labs.length} total
            </span>
          </div>
          <div className="divide-y divide-neutral-800">
            {labs.map((lab) => (
              <div key={lab.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{lab.name}</p>
                  <p className="text-xs text-neutral-500">{lab.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-400">
                    {formatCurrency(lab.hourlyPrice)}/hr
                  </p>
                  <p className="text-xs text-neutral-500">{lab.difficulty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Plans */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="font-semibold">Recent Plans</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-neutral-800 text-neutral-400">
              {plans.length} total
            </span>
          </div>
          <div className="divide-y divide-neutral-800">
            {plans.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-neutral-500">
                No plans created yet.
              </div>
            )}
            {plans.slice(-10).reverse().map((plan) => (
              <div key={plan.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{plan.labName}</p>
                  <p className="text-xs text-neutral-500">{plan.hours} hrs</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(plan.totalAmount)}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      plan.status === 'provisioned'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : plan.status === 'paid'
                        ? 'bg-sky-500/10 text-sky-400'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
