import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith('/auth');
  const isProtected = ['/dashboard', '/payment', '/provision', '/lab'].some((p) =>
    pathname.startsWith(p)
  );
  const isAdminPage = pathname.startsWith('/admin');

  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For mock prototype, we just check token presence for admin.
  // In a real app, you'd verify the JWT and check an admin claim.
  if (isAdminPage && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
