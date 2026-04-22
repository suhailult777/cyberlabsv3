import { NextResponse } from 'next/server';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(300);
  const { id } = await params;

  return NextResponse.json({
    environment: {
      id,
      planId: 'plan-123',
      accessUrl: `/lab/${id}`,
      username: 'student',
      password: 'lab-pass-1234',
      status: 'running',
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    },
  });
}
