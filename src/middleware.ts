import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const publicPaths = [
    '/login',
    '/register',
    '/api/auth',
  ];

  const isPublic = publicPaths.some((path) => pathname.startsWith(path)) 
    || pathname.startsWith('/_next')
    || pathname.startsWith('/favicon.ico') 
    || pathname.startsWith('/assets') 
    || pathname === '/';

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
