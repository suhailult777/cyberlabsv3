import { NextResponse } from 'next/server';
import { findEnvironmentById, updateEnvironmentStatus } from '@/lib/data/store';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(500);
  const { id } = await params;

  const env = findEnvironmentById(id);
  if (!env) {
    return NextResponse.json({ error: 'Environment not found' }, { status: 404 });
  }

  const updated = updateEnvironmentStatus(id, 'stopped');
  return NextResponse.json({ environment: updated });
}
