import { NextResponse } from 'next/server';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(500);
  const { id } = await params;

  return NextResponse.json({
    environment: {
      id,
      planId: 'plan-123',
      accessUrl: `/lab/${id}`,
      username: 'student',
      password: 'lab-pass-1234',
      status: 'stopped',
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    },
  });
}
