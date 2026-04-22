import { NextResponse } from 'next/server';
import { findPlanById, environmentsStore } from '@/lib/data/store';
import { provisionSchema } from '@/lib/validators/schemas';
import { delay } from '@/lib/utils/delay';

export async function POST(request: Request) {
  await delay(3000);
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = provisionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((e) => e.message).join(', ') },
      { status: 400 }
    );
  }

  const { planId } = parsed.data;
  const plan = findPlanById(planId);

  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }

  const hours = plan.hours;
  const envId = `env-${Date.now()}`;

  const env = {
    id: envId,
    planId,
    accessUrl: `/lab/${envId}`,
    username: 'student',
    password: 'lab-pass-' + Math.floor(Math.random() * 10000),
    status: 'running' as const,
    startedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(),
  };

  environmentsStore.push(env);
  plan.status = 'provisioned';

  return NextResponse.json({ environment: env });
}
