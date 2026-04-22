import { NextResponse } from 'next/server';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(300);
  const { id } = await params;

  // In-memory lookup would go here; for mock, return a placeholder
  return NextResponse.json({
    plan: {
      id,
      userId: 'user-1',
      labId: 'penetration-testing',
      labName: 'Penetration Testing Lab',
      hours: 4,
      hourlyPrice: 150,
      totalAmount: 600,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    },
  });
}
