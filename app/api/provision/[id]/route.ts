import { NextResponse } from 'next/server';
import { findEnvironmentById } from '@/lib/data/store';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(300);
  const { id } = await params;

  const env = findEnvironmentById(id);
  if (!env) {
    return NextResponse.json({ error: 'Environment not found' }, { status: 404 });
  }

  return NextResponse.json({ environment: env });
}
