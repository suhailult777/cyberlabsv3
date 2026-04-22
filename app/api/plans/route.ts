import { NextResponse } from 'next/server';
import { Plan } from '@/types';
import { labs } from '@/lib/data/labs';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockPlans: Plan[] = [
  {
    id: 'plan-demo-1',
    userId: 'user-1',
    labId: 'penetration-testing',
    labName: 'Penetration Testing Lab',
    hours: 4,
    hourlyPrice: 150,
    totalAmount: 600,
    status: 'provisioned',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  },
  {
    id: 'plan-demo-2',
    userId: 'user-1',
    labId: 'forensics-analysis',
    labName: 'Digital Forensics Lab',
    hours: 2,
    hourlyPrice: 200,
    totalAmount: 400,
    status: 'paid',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    expiresAt: new Date(Date.now() + 7200000).toISOString(),
  },
  {
    id: 'plan-demo-3',
    userId: 'user-1',
    labId: 'malware-reverse-engineering',
    labName: 'Malware Reverse Engineering',
    hours: 6,
    hourlyPrice: 180,
    totalAmount: 1080,
    status: 'pending',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    expiresAt: new Date(Date.now() + 21600000).toISOString(),
  },
];

export async function POST(request: Request) {
  await delay(300);
  const body = await request.json();

  const lab = labs.find((l) => l.id === body.labId);
  if (!lab) {
    return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
  }

  const plan: Plan = {
    id: `plan-${Date.now()}`,
    userId: body.userId || 'user-1',
    labId: lab.id,
    labName: lab.name,
    hours: body.hours,
    hourlyPrice: lab.hourlyPrice,
    totalAmount: lab.hourlyPrice * body.hours,
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + body.hours * 60 * 60 * 1000).toISOString(),
  };

  return NextResponse.json({ plan });
}

export async function GET() {
  await delay(300);
  return NextResponse.json({ plans: mockPlans });
}
