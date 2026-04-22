import { NextResponse } from 'next/server';
import { LabEnvironment } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  await delay(3000);
  const body = await request.json();

  const envId = `env-${Date.now()}`;
  const env: LabEnvironment = {
    id: envId,
    planId: body.planId,
    accessUrl: `/lab/${envId}`,
    username: 'student',
    password: 'lab-pass-' + Math.floor(Math.random() * 10000),
    status: 'running',
    startedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
  };

  return NextResponse.json({ environment: env });
}
