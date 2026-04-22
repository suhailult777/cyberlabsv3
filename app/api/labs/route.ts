import { NextResponse } from 'next/server';
import { labs } from '@/lib/data/labs';
import { delay } from '@/lib/utils/delay';

export async function GET() {
  await delay(300);
  return NextResponse.json({ labs });
}
