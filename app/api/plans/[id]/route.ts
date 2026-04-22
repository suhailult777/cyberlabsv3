import { NextResponse } from 'next/server';
import { findPlanById } from '@/lib/data/store';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(300);
  const { id } = await params;

  const plan = findPlanById(id);
  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }

  return NextResponse.json({ plan });
}
