import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const userRoutes = ["/room", "/chest", "/profile", "/rooms", "/buy-coins", "/room"];
const guestRoutes = ["/log-in", "/sign-up", "/profile", "/rooms", "/room"];
const OAuthRoutes = ["/finish-auth"];
const AllRoutes = [...userRoutes, ...guestRoutes, ...OAuthRoutes];

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const pathname = req.nextUrl.pathname;

  //Check if the path does not exist, this also allows every other path thats not in one of the permission routes!
  if (
    !AllRoutes.some((route) => pathname.startsWith(route)) &&
    pathname !== "/"
  ) {
    //Get them to that route so we can show them 404
    return NextResponse.next();
  }

  if (token?.oauthProfile) {
    const isOAuthRoute = OAuthRoutes.some((route) => pathname.startsWith(route));
    if (isOAuthRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/finish-auth", req.url));
  }

  if (pathname === "/") {
    return NextResponse.next();
  }

  if (!token) {
    const isGuestRoute = guestRoutes.some((route) => pathname.startsWith(route));
    if (!isGuestRoute) {
      return NextResponse.redirect(new URL("/log-in", req.url));
    }
    return NextResponse.next();
  }

  const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));
  if (isUserRoute) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
