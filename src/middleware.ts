import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const userRoutes = ['/home'];
const guestRoutes = ['/log-in', '/sign-up'];

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const pathname = req.nextUrl.pathname;

  if (token?.oauthProfile && pathname !== '/') {
    return NextResponse.redirect(new URL('/finish-auth', req.url));
  }

  if (pathname === '/') {
    return NextResponse.next();
  }

  if (!token) {
    const isGuestRoute = guestRoutes.some((route) => pathname.includes(route));
    if (!isGuestRoute) {
      return NextResponse.redirect(new URL('/log-in', req.url));
    }
    return NextResponse.next();
  }

  const isUserRoute = userRoutes.some((route) => pathname.includes(route));
  if (isUserRoute) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/', req.url));
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
