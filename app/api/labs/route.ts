import { NextResponse } from 'next/server';
import { labs } from '@/lib/data/labs';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await delay(300);
  return NextResponse.json({ labs });
}
