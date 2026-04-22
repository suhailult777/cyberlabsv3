import { NextResponse } from 'next/server';
import { labs } from '@/lib/data/labs';
import { plansStore } from '@/lib/data/store';
import { planSchema } from '@/lib/validators/schemas';
import { delay } from '@/lib/utils/delay';

export async function POST(request: Request) {
  await delay(300);
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = planSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((e) => e.message).join(', ') },
      { status: 400 }
    );
  }

  const { labId, hours } = parsed.data;
  const lab = labs.find((l) => l.id === labId);

  if (!lab) {
    return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
  }

  const plan = {
    id: `plan-${Date.now()}`,
    userId: (body.userId as string) || 'user-1',
    labId: lab.id,
    labName: lab.name,
    hours,
    hourlyPrice: lab.hourlyPrice,
    totalAmount: lab.hourlyPrice * hours,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(),
  };

  plansStore.push(plan);

  return NextResponse.json({ plan });
}

export async function GET() {
  await delay(300);
  return NextResponse.json({ plans: plansStore });
}
