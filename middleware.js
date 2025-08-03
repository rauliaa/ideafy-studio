import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const isAuth = !!token;

  const { pathname } = request.nextUrl;

  // Allow requests if the following is true...
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  // If not authenticated and accessing protected route
  if (!isAuth && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
