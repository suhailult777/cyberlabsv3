import { NextResponse } from 'next/server';
import { labs } from '@/lib/data/labs';
import { delay } from '@/lib/utils/delay';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(300);
  const { id } = await params;
  const lab = labs.find((l) => l.id === id);

  if (!lab) {
    return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
  }

  return NextResponse.json({ lab });
}
