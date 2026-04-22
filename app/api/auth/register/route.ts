import { NextResponse } from 'next/server';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  await delay(300);
  const body = await request.json();

  const token = 'mock-jwt-token-xyz';
  const response = NextResponse.json({
    user: {
      id: `user-${Date.now()}`,
      name: body.name || 'Student',
      email: body.email,
    },
    token,
  });
  response.cookies.set('auth-token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}
