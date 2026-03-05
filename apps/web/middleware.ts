import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hasAuthCookie = Boolean(request.cookies.get('chromedia_access')?.value);
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/admin') && !hasAuthCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && hasAuthCookie) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login']
};
