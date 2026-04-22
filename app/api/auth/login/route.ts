import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators/schemas';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  await delay(300);
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((e) => e.message).join(', ') },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  if (email === 'suhail@gmail.com' && password === 'astr0000') {
    // Generate unique token per session
    const token = `mock-token-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const response = NextResponse.json({
      user: {
        id: 'user-1',
        name: 'Suhail',
        email: 'suhail@gmail.com',
        isAdmin: true,
      },
      token,
    });
    response.cookies.set('auth-token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });
    return response;
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
